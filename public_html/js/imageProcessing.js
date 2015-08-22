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
function processImage(fileInput) {
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
                    if( !loadedFromFile ) {
                        loadedFromFile = true;
                        getRGBValues( img, 5);
                    }
                };
            };
        })(img);
        
        
//        getRGBValues(img, 5);
        reader.readAsDataURL(file);
    }
}

// Currently redraws image... 
function getRGBValues(img, blockSize) {

    // Create a temp image of the input image
//    var tempImage = new Image();
//    tempImage.src = img.src;

    // Draw it to access the pixels directly
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw Image to original canvas
    console.log( "" + img.width + " : " + img.height );
    context.drawImage(img, 0, 0);

    // Create a new canvas for the new image
//    var newCanvas = document.createElement("canvas");
//    var newContext = newCanvas.getContext("2d");
//    newCanvas.width = img.width / blockSize;
//    newCanvas.height = img.height / blockSize;

    console.log( "" + img.width + " : " + img.height );
    var imageData = context.getImageData(0, 0, img.width, img.height);
    var pixels = imageData.data;
//    var outputPixels = context.getImageData(0, 0, newCanvas.width, newCanvas.height);
//
//    for (var i = 0, numNewPixels = outputPixels.length; i < numNewPixels; i += 4) {
//        
//        
//    }
    
    for (var i = 0, n = pixels.length; i < n; i += 4) {
        if( i > 255 ) {
            pixels[i] = 255;
            pixels[i+1] = 255;
            pixels[i+2] = 255;
            pixels[i+3] = 255;
        } else {
            pixels[i] = i;
            pixels[i+1] = i;
            pixels[i+2] = i;
            pixels[i+3] = 255;
        }
    }

    context.putImageData( imageData, 0,0);
    img.src = canvas.toDataURL();
}




