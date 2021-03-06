/* 
 * The MIT License
 *
 * Copyright 2015 Nathan Gewecke.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* Game namespace */
var game = {
// an object where to store game information
    data: {
// score
        score: 0
    },
    // Run on page load.
    "onload": function () {
        // Initialize the video.
        if (!me.video.init(config.screenWidth, config.screenHeight,
                {wrapper: "screen",
                    scale: "auto",
                    scaleMethod: "fit",
                    doubleBuffering: true})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        me.sys.fps = config.fps;

        // add "#debug" to the URL to enable the debug Panel
        if (me.game.HASH.debug === true) {
            window.onReady(function () {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
                me.debug.renderHitBox = false;
                me.debug.displayFPS = true;
                me.debug.renderVelocity = false;
            });
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");
        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);
        // Load the resources.
        me.loader.preload(game.resources);
        // Initialize melonJS and display a loading screen.
        me.state.set(me.state.LOADING, new game.LoadingScreen());
        me.state.change(me.state.LOADING);
    },
    // Run on game resources loaded.
    "loaded": function () {
        // Set Statescreens
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAMEOVER, new game.GameOverScreen());
        me.state.set(me.state.GAME_END, new game.GameEndScreen());

        // add our player entity in the entity pool
        me.pool.register("player", game.PlayerEntity);
        me.pool.register("laser", game.BaseLaser);
        me.pool.register("baseEnemy", game.BaseEnemy);
        me.pool.register("pixel", game.Pixel);
        // Start the game.
        me.state.change(me.state.MENU);
    }
};

game.EnemyManager = {
    init: function (pixels) {
        this.pixels = pixels;
        this.currentPixelId = 0;
        this.currentEnemyCount = 0;
        this.destroyedEnemyCount = 0;
    },
    startEnemyDeployment: function () {
        this.intervalId = me.timer.setInterval(
                game.EnemyManager.handleInterval,
                config.enemyTimerDelay,
                true);
    },
    handleInterval: function () {
        var color = game.EnemyManager.selectColor();

        if (color == "Out_of_Pixels") {
            if (game.EnemyManager.currentEnemyCount === 0) {
                me.state.change(me.state.GAME_END);
            }
        } else {
            game.EnemyManager.createEnemy(color, "Base");
        }
    },
    stopEnemyDeployment: function () {
        me.timer.clearInterval(this.intervalId);
    },
    resetManager: function () {
        this.currentPixelId = 0;
        this.currentEnemyCount = 0;
        this.destroyedEnemyCount = 0;
        for (var pixel in this.pixels) {
            pixel.reset();
        }
    },
    enemyDestroyed: function (enemy) {
        enemy.alive = false;
        me.game.world.removeChild(enemy);
        var pixel = this.pixels[enemy.pixel];
        pixel.decrementRemaining(enemy.value, enemy.color);
        this.currentEnemyCount--;
        this.destroyedEnemyCount++;
    },
    enemyEscaped: function (enemy) {
        enemy.alive = false;
        me.game.world.removeChild(enemy);
        this.currentEnemyCount--;
    },
    createEnemy: function (color, type) {
        var putEnemyInWorld = false;
        switch (type) {
            case "Base":
                var enemy = me.pool.pull("baseEnemy",
                        me.game.viewport.right - 5,
                        Math.floor(Math.random() * (me.game.viewport.bottom - 32)) + 1,
                        this.currentPixelId, color);
                me.game.world.addChild(enemy, 20);
                var pixel = this.pixels[enemy.pixel];
                pixel.decrementUsed(enemy.value, enemy.color);
                putEnemyInWorld = true;
                break;
        }

        if (putEnemyInWorld) {
            this.currentEnemyCount++;
        }
    },
    selectColor: function ( ) {
        if (this.currentPixelId >= this.pixels.length) {
            return "Out_of_Pixels";
        }

        var currentPixel = this.pixels[this.currentPixelId];
        var colors = new Array();

        if (currentPixel.redUsed >= config.minimumEnemyValue) {
            colors.push("Red");
        }

        if (currentPixel.greenUsed >= config.minimumEnemyValue) {
            colors.push("Green");
        }

        if (currentPixel.blueUsed >= config.minimumEnemyValue) {
            colors.push("Blue");
        }

        if (colors.length === 0) {
            this.currentPixelId++;
            return this.selectColor();
        }
        return colors[Math.floor(Math.random() * colors.length)];
    }
};

game.Pixel = Object.extend({
    init: function (red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.reset();
    },
    decrementRemaining: function (value, color) {
        switch (color) {
            case "Red":
                this.redRemaining -= value;
                break;
            case "Green":
                this.greenRemaining -= value;
                break;
            case "Blue":
                this.blueRemaining -= value;
                break;
        }
    },
    decrementUsed: function (value, color) {
        switch (color) {
            case "Red":
                this.redUsed -= value;
                break;
            case "Green":
                this.greenUsed -= value;
                break;
            case "Blue":
                this.blueUsed -= value;
                break;
        }
    },
    reset: function () {
        if ((this.red < config.minimumEnemyValue) && (this.green < config.minimumEnemyValue) && (this.blue < config.minimumEnemyValue)) {
            this.redRemaining = config.minimumEnemyValue * config.blackPixelEnemyCount;
            this.greenRemaining = config.minimumEnemyValue * config.blackPixelEnemyCount;
            this.blueRemaining = config.minimumEnemyValue * config.blackPixelEnemyCount;
        } else {
            this.redRemaining = this.red;
            this.greenRemaining = this.green;
            this.blueRemaining = this.blue;
        }

        this.redUsed = this.redRemaining;
        this.greenUsed = this.greenRemaining;
        this.blueUsed = this.blueRemaining;
    }

});
