define(["require", "exports", "./Component", "../utils/utils", "../constant/Constant", "./EventListenTask"], function (require, exports, Component_1, utils_1, Constant_1, EventListenTask_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Bullet extends Component_1.Component {
        constructor(level, width, height, pos, imgPath, direction) {
            super(width, height, pos, imgPath);
            this.damage = 4;
            this.level = level;
            this.setDirection(direction);
        }
        setDirection(direction) {
            this.direction = direction ? direction : Constant_1.ComponentConstant.DIRECTION_DOWN;
            this.speed = 2 * this.direction;
        }
        move(command) {
            this.position.top += this.speed;
        }
    }
    exports.Bullet = Bullet;
    class Weapon {
        constructor(position, autoFire, direction, shootInterval) {
            this.level = Weapon.LEVEL_NOMAL;
            this.eventTask = new EventListenTask_1.EventListenTask();
            this.autoFire = false;
            this.bullets = [];
            this.position = position;
            this.autoFire = autoFire;
            this.direction = direction ? direction : Constant_1.ComponentConstant.DIRECTION_DOWN;
            this.shootInterval = shootInterval ? shootInterval : 10;
            this.eventTask.add('hit', (bullet, index) => {
                if (this.targetList && this.targetList.length) {
                    this.targetList.forEach(target => {
                        if (utils_1.impact(bullet, target)) {
                            target.underAttack(bullet.damage);
                            this.bullets.splice(index, 1);
                        }
                    });
                }
            });
            this.eventTask.add('draw', (delta, renderCount, render) => {
                this.bullets.forEach((bullet, index, bullets) => {
                    bullet.move();
                    this.eventTask.trigger('hit', [bullet, index]);
                });
                if (this.bullets.length > 300)
                    this.bullets.splice(0, 150);
                if (this.autoFire && render.renderFrequency(this.shootInterval))
                    this.fire();
            });
        }
        upgrade() {
            if (this.level < Weapon.LEVEL_LASER) {
                this.level++;
            }
        }
        fire() {
            let bullet = new Bullet(this.level, Constant_1.BulletConstant.NORMAL_WIDTH, Constant_1.BulletConstant.NORMAL_HEIGHT, utils_1.propertoesDeepCopy(this.position), (this.type == Constant_1.FighterConstant.TYPE_HERO) ? Constant_1.BulletConstant.HERO_IMG_PATH : Constant_1.BulletConstant.ENEMY_IMG_PATH, this.direction);
            this.bullets.push(bullet);
        }
        eachBullet(callback) {
            this.bullets.forEach((value, index, array) => {
                callback(value, index, array);
            });
        }
        targetTo(targetList) {
            this.targetList = targetList;
        }
        on(eventName, callback) {
            this.eventTask.add(eventName, callback);
        }
        unbind(eventName, callback) {
            this.eventTask.removeAll(eventName);
        }
        triggle(eventName, args) {
            this.eventTask.trigger(eventName, args);
        }
    }
    Weapon.LEVEL_NOMAL = 0;
    Weapon.LEVEL_POWER = 1;
    Weapon.LEVEL_SHOTGUN = 2;
    Weapon.LEVEL_LASER = 3;
    exports.Weapon = Weapon;
    class WeaponUtils extends Component_1.ComponentUtils {
        constructor(canvas, weapon) {
            super(canvas);
            this.weapon = weapon;
        }
        draw(delta, renderCount, render) {
            this.weapon.triggle('draw', [delta, renderCount, render]);
            this.weapon.eachBullet((value) => {
                this.canvas.context2d.drawImage(value.image, value.position.left + Constant_1.FighterConstant.WIDTH / 2, (this.weapon.direction == Constant_1.ComponentConstant.DIRECTION_DOWN) ?
                    value.position.top + Constant_1.FighterConstant.HEIGHT : value.position.top, value.width, value.height);
            });
        }
    }
    exports.WeaponUtils = WeaponUtils;
});
