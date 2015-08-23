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
    
game.TextLoading = me.Renderable.extend({
        // constructor
        init: function (w, h) {
            this._super(me.Renderable, "init", [0, 0, w, h]);
            this.logo1 = new me.Font("Karmatic Arcade", 32, "white", "middle");
            this.logo1.textBaseline = "alphabetic";
        },
        
        // Draw the Loading... text
        draw: function (renderer) {
            var logo1_width = this.logo1.measureText(renderer, "Loading...").width;
            var xpos = (this.width - logo1_width) / 2;
            var ypos = this.height / 2;
            this.logo1.draw(renderer, "Loading...", xpos, ypos);
        }

    });


game.LoadingScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function () {
        me.game.reset();

        // background color
        me.game.world.addChild(new me.ColorLayer("background", "#000000", 0));

        me.game.world.addChild(new game.TextLoading(me.video.renderer.getWidth(), me.video.renderer.getHeight()), 2);
    },
    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function () {
        ; // TODO
    }
});
