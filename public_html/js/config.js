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

/**
 * Config Namespace
 */
var config = {
    // System Configs
    fps: 75, // Target Frames per second
    enemyTimerDelay: 100, // Milliseconds 
    
    // Screen Size
    screenWidth: 900,
    screenHeight: 500,
    
    imageScaleWidth: 350,
    imageScaleHeight: 150,
    
    logoWidth: 800,
    logoHeight: 350,
    
    // Player Variables
    playerAccel: 0.5,
    maxPlayerVel: 15,
    playerNumShots: 5,
    
    // Enemy Variables
    blackPixelEnemyCount: 3, // Number of enemies if a pixel is black rgb(0,0,0)
    minimumEnemyValue: 25, // Should match baseEnemyValue
    baseEnemyValue: 25,
    baseEnemyVel: 5,
    
    // Weapon Variables
    baseLaserWidth: 28,
    baseLaserHeight: 5,
    baseLaserVel: 1,
    
    // Version
    version: 1
};
