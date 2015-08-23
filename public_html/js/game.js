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
                {   wrapper: "screen", 
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
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        // add our player entity in the entity pool
        me.pool.register("player", game.PlayerEntity);
        me.pool.register("laser", game.BaseLaser);
        me.pool.register("baseEnemy", game.BaseEnemy);
        // Start the game.
        me.state.change(me.state.MENU);
    }
};

game.colors = ["Red", "Green", "Blue"];

game.EnemyManager = {
    init: function (pixels) {
        this.pixels = pixels;
        this.currentPixel = 0;
    },
    enemyDestroyed: function (enemy) {
        enemy.alive = false;
        me.game.world.removeChild(enemy);
//        var pixel = pixels[enemy.pixel];
//        pixel.decrement( enemy.value, enemy.color);
        
        this.createEnemy(game.colors[Math.floor(Math.random() * 3)], "Base");
    },
    enemyEscaped: function (enemy) {
        enemy.alive = false;
        me.game.world.removeChild(enemy);
        
        this.createEnemy(game.colors[Math.floor(Math.random() * 3)], "Base");
    },
    
    createEnemy: function (color, type) {
        switch (type) {
            case "Base":
                me.game.world.addChild(
                        me.pool.pull("baseEnemy",
                                me.game.viewport.right - 5,
                                Math.floor(Math.random() * (me.game.viewport.bottom - 32)) + 1,
                                this.currentPixel, color), 20);
                break;
        }
    }
};
game.Pixel = {
    init: function (red, green, blue, alpha) {
        this.red = red;
        this.redRemaining = red;
        this.green = green;
        this.greenRemaining = green;
        this.blue = blue;
        this.blueRemaining = blue;
        this.alpha = alpha;
    },
    decrement: function (value, color) {
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
    }

};
