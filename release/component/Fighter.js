define(["require", "exports", "./Component", "../utils/utils", "../constant/Constant", "./Weapon", "../Exception/Exception", "../control/Control", "../canvas/CanvasAnimation"], function (require, exports, Component_1, utils_1, Constant_1, Weapon_1, Exception_1, Control_1, CanvasAnimation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FighterAutoMoveException = Exception_1.ComponentException.FighterAutoMoveException;
    class Fighter extends Component_1.Component {
        constructor() {
            super(...arguments);
            this.moveSpeed = Constant_1.FighterConstant.HERO_DEFAULT_SPEED;
            this.health = Constant_1.FighterConstant.ENEMY_DEFAULT_HEALTH;
            this.type = Constant_1.FighterConstant.TYPE_ENEMY;
        }
        move(keyCode) {
            Control_1.KeyboardControl.moveControlModel(keyCode, this.position, this.moveSpeed);
        }
        limitMove(keyCode, canvas) {
            this.move(keyCode);
            utils_1.limitMoveRangeByCanvas(this, canvas);
        }
        loadWeapon(weapon) {
            this.weapon = weapon;
            weapon.type = this.type;
            return weapon;
        }
        setSpeed(speed) {
            this.moveSpeed = speed;
        }
        underAttack(damage) {
            this.health -= damage;
            this.triggle('healthChange', [this.health, damage]);
        }
        on(eventName, callback) {
            super.on(eventName, callback);
        }
        roleAs(role) {
            if (role == 'hero') {
                this.health = Constant_1.FighterConstant.HERO_DEFAULT_HEALTH;
                this.type = Constant_1.FighterConstant.TYPE_HERO;
            }
            else if (role == 'boss') {
                this.health = Constant_1.FighterConstant.BOSS_DEFAULT_HEALTH;
                this.type = Constant_1.FighterConstant.TYPE_BOSS;
            }
            return this;
        }
        //TODO
        autoFollow(fighter, x = true, y = false, moveArea) {
            let randomX, randomY;
            if ((!fighter || !x) && (!moveArea || !moveArea.x || !moveArea.x.length))
                throw new FighterAutoMoveException('x');
            if ((!fighter || !y) && (!moveArea || !moveArea.y || !moveArea.y.length))
                throw new FighterAutoMoveException('y');
            if (moveArea.x)
                randomX = utils_1.rateRandom(moveArea.x[0], moveArea.x[1]);
            if (moveArea.y)
                randomY = utils_1.rateRandom(moveArea.y[0], moveArea.y[1]);
            this.on('draw', (delta, renderCount, render) => {
                let target = { top: fighter.position.top, left: fighter.position.left };
                let freq = render.renderFrequency(80);
                if (!x) {
                    if (freq)
                        randomX = utils_1.rateRandom(moveArea.x[0], moveArea.x[1]);
                    target.left = randomX;
                }
                if (!y) {
                    if (freq)
                        randomY = utils_1.rateRandom(moveArea.y[0], moveArea.y[1]);
                    target.top = randomY;
                }
                if (target.top > this.position.top) {
                    this.move(Constant_1.Constant.KEY_DOWN);
                }
                else {
                    this.move(Constant_1.Constant.KEY_UP);
                }
                if (target.left > this.position.left) {
                    this.move(Constant_1.Constant.KEY_RIGHT);
                }
                else {
                    this.move(Constant_1.Constant.KEY_LEFY);
                }
            });
        }
    }
    exports.Fighter = Fighter;
    class FighterUtils extends Component_1.ComponentUtils {
        constructor(canvas, fighters, weaponGroup) {
            super(canvas);
            this.fightersGroup = utils_1.arrayCopy(fighters);
            this.weaponsGroup = utils_1.arrayCopy(weaponGroup);
        }
        autoCreate(config) {
            this.extendDefault(config);
            for (let i = 0; i < config.quantity; i++) {
                this.addFighter(config, i);
            }
        }
        draw(delta, renderCount, render) {
            this.checkDestoryedFighter(render);
            this.fightersGroup.forEach((fighter, index) => {
                fighter.triggle('draw', [delta, renderCount, render]);
                this.canvas.context2d.drawImage(fighter.image, fighter.position.left, fighter.position.top, fighter.width, fighter.height);
                this.weaponsGroup[index] && this.weaponsGroup[index].draw(delta, renderCount, render);
            });
        }
        addFighter(config, i) {
            let enemy = new Fighter(config.width, config.height, config.originPosition[i] ?
                config.originPosition[i] :
                new Component_1.ComponentPosition(utils_1.rateRandom(-i % 5 * config.height, 0), utils_1.rateRandom(-i % 5 * config.width, 0)));
            let enemyWeapon = new Weapon_1.Weapon(enemy.position, config.weapon.autoFire, config.weapon.direction, config.weapon.shootInterval);
            let enemyWeaponUtils = new Weapon_1.WeaponUtils(config.canvas, enemyWeapon);
            enemy.setImage(config.image, false);
            enemy.setSpeed(config.speed);
            enemy.autoFollow(config.autoFollow.target, !!config.autoFollow.x[i], !!config.autoFollow.y[i], config.autoFollow.moveArea);
            enemy.roleAs(config.role).loadWeapon(enemyWeapon).targetTo(config.weapon.targetTo.getFighterGroup());
            this.fightersGroup.push(enemy);
            this.weaponsGroup.push(enemyWeaponUtils);
        }
        extendDefault(config) {
            utils_1.extend(config, {
                originPosition: [],
                width: Constant_1.FighterConstant.WIDTH,
                height: Constant_1.FighterConstant.HEIGHT,
                image: Constant_1.FighterConstant.ENEMY_IMG_PATH,
                speed: Constant_1.FighterConstant.ENEMY_DEFAULT_SPEED,
                type: Constant_1.FighterConstant.TYPE_ENEMY,
                autoFollow: {
                    target: null,
                    x: [true],
                    y: [],
                    moveArea: null
                },
                weapon: {
                    targetTo: null,
                    autoFire: true,
                    shootInterval: 60,
                    direction: Constant_1.ComponentConstant.DIRECTION_DOWN
                }
            });
            this.config = config;
        }
        checkDestoryedFighter(render) {
            let w = [];
            let f = this.fightersGroup.filter((fighter, index) => {
                if (fighter.health > 0) {
                    w.push(this.weaponsGroup[index]);
                    return true;
                }
                else {
                    render.once(CanvasAnimation_1.fighterBoom(fighter, this.canvas.context2d));
                    return false;
                }
            });
            this.fightersGroup.length = 0;
            this.weaponsGroup.length = 0;
            f.forEach((value, index) => {
                this.fightersGroup.push(value);
                this.weaponsGroup.push(w[index]);
            });
            if (this.config && this.fightersGroup.length < this.config.quantity) {
                this.addFighter(this.config, utils_1.rateRandom(0, this.config.quantity));
            }
        }
        fightersGroupPush(fighter) {
            this.fightersGroup.push(fighter);
        }
        getFighterGroup() {
            return this.fightersGroup;
        }
    }
    exports.FighterUtils = FighterUtils;
});
