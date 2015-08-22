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

/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({
    
    /**
     * constructor
     */
    init: function (x, y) {
        
        // call the constructor
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 32,
                height: 32
            }]);

        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        this.body.updateBounds();
//        this.body.collisionType = "Player";
    },
    /**
     * update the entity
     */
    update: function (dt) {
        if (me.input.isKeyPressed('left')) {
            // update the entity velocity
            this.body.accel.x = -config.playerAccel;
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            if( this.body.vel.x < -config.maxPlayerVel ) {
                this.body.vel.x = -config.maxPlayerVel;
            }
        } else if (me.input.isKeyPressed('right')) {
            // update the entity velocitysdawasdaw
            this.body.accel.x = config.playerAccel;
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            if( this.body.vel.x > config.maxPlayerVel ) {
                this.body.vel.x = config.maxPlayerVel;
            }
        } else {
            if( this.body.vel.x !== 0 ) {
                this.body.vel.x += -this.body.accel.x * me.timer.tick;
                if( (this.body.vel.x > 0 && this.body.accel.x < 0) ||
                      this.body.vel.x < 0 && this.body.accel.x > 0  ) {
                    this.body.accel.x = 0;
                    this.body.vel.x = 0;
                }
            }
        }
        
        if (me.input.isKeyPressed('up')) {
            // update the entity velocity
            this.body.accel.y = -config.playerAccel;
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            if( this.body.vel.y < -config.maxPlayerVel ) {
                this.body.vel.y = -config.maxPlayerVel;
            }
        } else if (me.input.isKeyPressed('down')) {
            // update the entity velocity
            this.body.accel.y = config.playerAccel;
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            if( this.body.vel.y > config.maxPlayerVel ) {
                this.body.vel.y = config.maxPlayerVel;
            }
        } else {
            if( this.body.vel.y !== 0 ) {
                this.body.vel.y += -this.body.accel.y * me.timer.tick;
                if( (this.body.vel.y > 0 && this.body.accel.y < 0) ||
                      this.body.vel.y < 0 && this.body.accel.y > 0  ) {
                    this.body.accel.y = 0;
                    this.body.vel.y = 0;
                }
            }
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        if (this.bottom > me.game.viewport.bottom) {
            this.pos.y = me.game.viewport.bottom - this.height;
            this.body.vel.y = 0;
        }
        
        if (this.top < me.game.viewport.top) {
            this.pos.y = me.game.viewport.top;
            this.body.vel.y = 0;
        }
//        
        
        if (this.left < me.game.viewport.left) {
            this.pos.x = me.game.viewport.left;
            this.body.vel.x = 0;
        }
        
        if (this.right > me.game.viewport.right) {
            this.pos.x = me.game.viewport.right - this.width;
            this.body.vel.x = 0;
        }

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision: function (response, other) {
        console.log( other.body.collisionType );
        
        // Make all other objects solid
        return true;
    }
});

/**
 * Enemy Entities
 */
game.BaseEnemy = me.Entity.extend({
    /**
     * constructor
     */
    init: function (x, y, color) {
        var image = "";
        switch (color) {
            case "Red":
                image = "red_base_enemy";
                break;
            case "Green":
                image = "green_base_enemy";
                break;
            case "Blue":
                image = "blue_base_enemy";
                break;
        }

        // call the constructor
        this._super(me.Entity, 'init', [x, y, {
                image: image,
                width: 32,
                height: 32
            }]);
    }
});
