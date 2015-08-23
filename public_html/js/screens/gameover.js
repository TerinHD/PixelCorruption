/* 
 * The MIT License
 *
 * Copyright 2015 Nathan.
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
game.TextGameOver = me.Renderable.extend({
    // constructor
    init: function (w, h) {
        this._super(me.Renderable, "init", [0, 0, w, h]);
        this.gameOverText = new me.Font("Karmatic Arcade", 48, "white", "middle");
        this.gameOverText.textBaseline = "alphabetic";
    },
    // Draw the Loading... text
    draw: function (renderer) {
        var measurement = this.gameOverText.measureText(renderer, "GAME OVER!");
        var xpos = (this.width - measurement.width) / 2;
        var ypos = (this.height - measurement.height) / 4; // Top 1/4th
        this.gameOverText.draw(renderer, "GAME OVER!", xpos, ypos);
    }

});

game.GameOverInstructions = me.Renderable.extend({
    // constructor
    init: function (w, h) {
        this._super(me.Renderable, "init", [0, 0, w, h]);
        this.text1 = new me.Font("Karmatic Arcade", 20, "white", "middle");
        this.text1.textBaseline = "alphabetic";
        this.text2 = new me.Font("Karmatic Arcade", 20, "white", "middle");
        this.text2.textBaseline = "alphabetic";
    },
    // Draw the Loading... text
    draw: function (renderer) {
        var measurement = this.text1.measureText(renderer, "Above is your corrupted image.");
        var measurement2 = this.text2.measureText(renderer, "Title Screen - Press Enter");
        var xpos = (this.width - measurement.width) / 2;
        var ypos = (this.height - measurement.height) - 26 - measurement2.height;
        this.text1.draw(renderer, "Above is your corrupted image", xpos, ypos);
        xpos = (this.width - measurement2.width) / 2;
        ypos = (this.height - measurement2.height) - 20;
        this.text2.draw(renderer, "Title Screen - Press Enter", xpos, ypos);
    }

});

game.GameOverScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function () {
        me.game.reset();
        
        game.ImageProcessor.createCorruptImage( game.CorruptImage, game.EnemyManager.pixels);

        // background color
        me.game.world.addChild(new me.ColorLayer("background", "#000000", 0));
        me.game.world.addChild(new game.TextGameOver(me.video.renderer.getWidth(), me.video.renderer.getHeight()), 2);
        me.game.world.addChild(new game.GameOverInstructions(me.video.renderer.getWidth(), me.video.renderer.getHeight()), 2);
        
        // Create Sprite so we can scale it appropriately.
//        var imageSprite = new me.Sprite(
//                (me.video.renderer.getWidth() - config.imageScaleWidth) / 2,
//                (me.video.renderer.getHeight() - config.imageScaleHeight) / 2,
//                { image: game.CorruptImage, framewidth: game.CorruptImage.width, frameheight: game.CorruptImage.height});
//                
//        // Now we need to figure out how to scale it...
//        var ratioWidth = game.CorruptImage.width / config.imageScaleWidth;
//        var ratioHeight = game.CorruptImage.height / config.imageScaleHeight;
//        if( ratioWidth > ratioHeight ) {
//            console.log ("Here?");
//            imageSprite.scale( ratioWidth, ratioWidth );
////            imageSprite.scaleV( ratioWidth );
//        } else {
//            console.log ("There?");
//            imageSprite.scale( ratioHeight, ratioHeight );
////            imageSprite.scaleV( ratioHeight );
//        }
//        
//        me.game.world.addChild( imageSprite, 3);
        
        me.game.world.addChild(new me.ImageLayer(
                (me.video.renderer.getWidth() - game.CorruptImage.width) / 2, 
                (me.video.renderer.getHeight() - game.CorruptImage.height) / 3,
                { image: game.CorruptImage, width: game.CorruptImage.width, height: game.CorruptImage.height}), 3);
        
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "enter") {
                
                me.state.change(me.state.MENU);
            }
        });
    },
    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function () {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindPointer(me.input.mouse.LEFT);
        me.event.unsubscribe(this.handler);
    }
});

