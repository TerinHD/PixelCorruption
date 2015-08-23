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
                height: 32,
                laserCount: 1,
                numLaser: 0
            }]);
        
        this.numLaserShots = 1;
        this.usedLaserShots = 0;

        // Correct the Hitbox.
        // @TODO - Fix hitbox to allow for concave nature of the polygon.
        var poly = [new me.Vector2d(5, 5), new me.Vector2d(31, 17), new me.Vector2d(5, 28)];
        this.body.removeShapeAt(0);
        this.body.addShape(new me.Polygon(0, 0, poly));
        this.body.updateBounds();
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;
    },
    /**
     * update the entity
     */
    update: function (dt) {

        // @TODO - Update Velocity to never be negative.
        if (me.input.isKeyPressed('left')) {
            // update the entity velocity
            this.body.accel.x = -config.playerAccel;
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            if (this.body.vel.x < -config.maxPlayerVel) {
                this.body.vel.x = -config.maxPlayerVel;
            }
        } else if (me.input.isKeyPressed('right')) {
            // update the entity velocitysdawasdaw
            this.body.accel.x = config.playerAccel;
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            if (this.body.vel.x > config.maxPlayerVel) {
                this.body.vel.x = config.maxPlayerVel;
            }
        } else {
            if (this.body.vel.x !== 0) {
                this.body.vel.x += -this.body.accel.x * me.timer.tick;
                if ((this.body.vel.x > 0 && this.body.accel.x < 0) ||
                        this.body.vel.x < 0 && this.body.accel.x > 0) {
                    this.body.accel.x = 0;
                    this.body.vel.x = 0;
                }
            }
        }

        if (me.input.isKeyPressed('up')) {
            // update the entity velocity
            this.body.accel.y = -config.playerAccel;
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            if (this.body.vel.y < -config.maxPlayerVel) {
                this.body.vel.y = -config.maxPlayerVel;
            }
        } else if (me.input.isKeyPressed('down')) {
            // update the entity velocity
            this.body.accel.y = config.playerAccel;
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            if (this.body.vel.y > config.maxPlayerVel) {
                this.body.vel.y = config.maxPlayerVel;
            }
        } else {
            if (this.body.vel.y !== 0) {
                this.body.vel.y += -this.body.accel.y * me.timer.tick;
                if ((this.body.vel.y > 0 && this.body.accel.y < 0) ||
                        this.body.vel.y < 0 && this.body.accel.y > 0) {
                    this.body.accel.y = 0;
                    this.body.vel.y = 0;
                }
            }
        }

        if (me.input.isKeyPressed("shoot") &&  this.numLaserShots > this.usedLaserShots) {
            me.game.world.addChild(me.pool.pull("laser", this.pos.x + this.width + this.body.vel.x, this.pos.y + (this.height / 2) - (config.baseLaserHeight / 2), this));
            this.usedLaserShots++;
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
        var isCollision = true;
        if (other.body.collisionType === me.collision.types.PROJECTILE_OBJECT) {
            if (other instanceof game.BaseLaser) {
                isCollision = false;
            }
        } else if ( other.body.collisionType === me.collision.types.ENEMY_OBJECT ) {
            me.game.world.removeChild(this);
            game.EnemyManager.enemyDestroyed( other );
            me.state.change(me.state.GAMEOVER);
        }

        // Make all other objects solid
        return isCollision;
    }
});

/**
 * Enemy Entities
 */
game.BaseEnemy = me.Entity.extend({
    /**
     * constructor
     */
    init: function (x, y, pixel, color) {
        var image = "";
        this.color = color;
        this.pixel = pixel;
        this.value = config.baseEnemyValue;
        this.alive = true;
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

        // Correct the Hitbox.
        var poly = [new me.Vector2d(4, 5), new me.Vector2d(26, 5), new me.Vector2d(26, 27), new me.Vector2d(4, 27)];
        this.body.removeShapeAt(0);
        this.body.addShape(new me.Polygon(0, 0, poly));
        this.body.updateBounds();
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;
    },
    update: function (time) {
        this.body.vel.x = -config.baseEnemyVel;
        if (this.pos.x < me.game.viewport.left) {
            me.game.world.removeChild(this);
            game.EnemyManager.enemyEscaped(this);
        }
        
        
        this._super(me.Entity, "update", [time]);

        this.body.update();

        return true;
    } 

});


/** 
 * Game Elements
 */
game.BaseLaser = me.Entity.extend({
    init: function (x, y, player) {
        this._super(me.Entity, "init", [x, y, {width: config.baseLaserWidth, height: config.baseLaserHeight}]);
        this.z = 5;
        this.player = player;
        this.alive = true;
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        this.body.updateBounds();
//        this.body.setVelocity(1, 0);
        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
        this.renderable = new (me.Renderable.extend({
            init: function () {
                this._super(me.Renderable, "init", [0, 0, config.baseLaserWidth, config.baseLaserHeight]);
            },
            destroy: function () {
            },
            draw: function (renderer) {
                var color = renderer.globalColor.toHex();
                renderer.setColor('#FFFFFF');
                renderer.fillRect(0, 0, this.width, this.height);
                renderer.setColor(color);
            }
        }));
        this.alwaysUpdate = true;
    },
    update: function (time) {
        this.body.vel.x = config.baseLaserVel * time;
        if (this.pos.x > me.game.viewport.right) {
            me.game.world.removeChild(this);
            this.player.usedLaserShots--;
        }

        this.body.update();
        me.collision.check(this);

        return true;
    },
    onCollision: function (res, other) {
        if( this.alive ) {
            if (other.body.collisionType === me.collision.types.ENEMY_OBJECT && other.alive) {
                this.alive = false;
                me.game.world.removeChild(this);
                game.EnemyManager.enemyDestroyed( other );
                this.player.usedLaserShots--;
    //            game.PlayScreen.enemyManager.removeChild(other);
                return false;
            } else if( other.body.collisionType === me.collision.types.PLAYER_OBJECT || 
                    other.body.collisionType === me.collision.types.PROJECTILE_OBJECT) {
                return false;
            } 
        }
    }
});