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

// Process the image for game data.
game.ImageProcessor = {
    processImage: function (fileInput) {
        var files = fileInput.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {
                continue;
            }
            var img = document.getElementById("thumbnail");
//        var img = new Image();
            img.file = file;
            var reader = new FileReader();
            var loadedFromFile = false;
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                    img.onload = function () {
                        if (!loadedFromFile) {
                            loadedFromFile = true;
                            this.getRGBValues(img, 5);
                        }
                    };
                };
            })(img);
//        getRGBValues(img, 5);
            reader.readAsDataURL(file);
        }
    },
// Currently redraws image... 
    getRGBValues: function ( img ) {

        // Create a temp image of the input image
//    var tempImage = new Image();
//    tempImage.src = img.src;

        // Draw it to access the pixels directly
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw Image to original canvas
        context.drawImage(img, 0, 0);

        // Create a new canvas for the new image
//    var newCanvas = document.createElement("canvas");
//    var newContext = newCanvas.getContext("2d");
//    newCanvas.width = img.width / blockSize;
//    newCanvas.height = img.height / blockSize;
        var imageData = context.getImageData(0, 0, img.width, img.height);
        var pixels = imageData.data;
        
//        var numPixels = img.width * img.height;
//        var sizeOfPixels = numPixels * 4;
        var pixelArray = new Array();

        for (var i = 0, n = pixels.length; i < n; i += 4) {
            var pixelNum = i / 4;
            pixelArray[pixelNum] = me.pool.pull("pixel", pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]); 
        }

//        context.putImageData(imageData, 0, 0);
//        img.src = canvas.toDataURL();
        return pixelArray;
    }
};