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

game.UploadForm = me.Renderable.extend({
    init : function (x, y, type, length) {
        
        this.div = document.createElement('DIV');
        this.div.innerHTML = '<input id="file" type="file" accept="image/*" onchange="game.ImageProcessor.processLoadImage(this)" />';
        this.div.id = "uploadForm";
        this.div.class = "uploadForm";

        var screen = me.video.getWrapper();
        screen.appendChild(this.div);
    },

    destroy : function () {
        var screen = me.video.getWrapper();
        screen.removeChild( this.div );
    }
});

game.TextInstructions = me.Renderable.extend({
    // constructor
    init: function (w, h) {
        this._super(me.Renderable, "init", [0, 0, w, h]);
        this.logo1 = new me.Font("Karmatic Arcade", 20, "white", "middle");
        this.logo1.textBaseline = "alphabetic";
    },
    // Draw the Loading... text
    draw: function (renderer) {
        var measurement = this.logo1.measureText(renderer, "Select an image to play then press Enter or press Enter");
        var xpos = (this.width - measurement.width) / 2;
        var ypos = ((this.height - measurement.height) / 4)*3;
        this.logo1.draw(renderer, "Select an image to play then press Enter or press Enter", xpos, ypos);
    }

});

game.UserImage = undefined;
game.CorruptImage = undefined;

game.TitleScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function () {

        // background color
        me.game.world.addChild(new me.ColorLayer("background", "#000000", 0));
        me.game.world.addChild(new game.TextInstructions(me.video.renderer.getWidth(), me.video.renderer.getHeight()), 2);
        // Center the logo.
        var x = (config.screenWidth / 2) - (config.logoWidth / 2);
        if (x < 0) {
            x = 0;
        }

        // Use the first 1/3 for the Logo if you can.
        var y = (config.screenHeight / 3) - (config.logoHeight / 2);
        if (y < 0) {
            y = 0;
        }

        me.game.world.addChild(new me.ImageLayer(x, y, {
            image: "logo",
            width: config.logoWidth,
            height: config.logoHeight,
            name: "logo",
            z: 1
        }));
        
        this.input = new game.UploadForm((config.screenWidth / 4), (config.screenHeight / 3) * 2);

        me.game.world.addChild(this.input, 3);

        // change to play state on press Enter or click/tap
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "enter") {
                if( typeof game.UserImage === 'undefined' || !(game.UserImage instanceof Image)) {
                    this.img = me.loader.getImage("default");
                } else {
                    this.img = game.UserImage;
                }

                game.CorruptImage = game.ImageProcessor.copyImage(this.img);
                var pixels = game.ImageProcessor.getRGBValues(this.img);
                game.EnemyManager.init(pixels);
                // this will unlock audio on mobile devices
                me.state.change(me.state.PLAY);
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
