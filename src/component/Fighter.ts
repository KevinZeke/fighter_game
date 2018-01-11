///<reference path="../canvas/CanvasRender.ts"/>
import {Component, ComponentPosition, ComponentUtils} from "./Component";
import {arrayCopy, extend, limitMoveRangeByCanvas, loadImageAsync, rateRandom} from "../utils/utils";
import {Constant, ComponentConstant, FighterConstant} from "../constant/Constant";
import {CanvasRender, RenderEvent} from "../canvas/CanvasRender";
import {Weapon, WeaponUtils} from "./Weapon";
import {ComponentException} from "../Exception/Exception";
import FighterAutoMoveException = ComponentException.FighterAutoMoveException;
import {Canvas} from "../canvas/Canvas";
import {KeyboardControl} from "../control/Control";
import {fighterBoom} from "../canvas/CanvasAnimation";

export class Fighter extends Component {

    private moveSpeed: number = FighterConstant.HERO_DEFAULT_SPEED;

    private weapon: Weapon;

    public health: number = FighterConstant.ENEMY_DEFAULT_HEALTH;

    public type: number = FighterConstant.TYPE_ENEMY;

    public move(keyCode: number): void {
        KeyboardControl.moveControlModel(keyCode, this.position, this.moveSpeed);
    }

    public limitMove(keyCode: number, canvas: Canvas) {
        this.move(keyCode);
        limitMoveRangeByCanvas(this, canvas);
    }

    public loadWeapon(weapon: Weapon): Weapon {
        this.weapon = weapon;
        weapon.type = this.type;
        return weapon;
    }

    public setSpeed(speed: number): void {
        this.moveSpeed = speed;
    }

    public underAttack(damage: number) {
        this.health -= damage;
        this.triggle('healthChange', [this.health, damage]);
    }


    public on(eventName: 'draw' | 'healthChange', callback: Function): void {
        super.on(eventName, callback);
    }

    public roleAs(role: 'hero' | 'enemy' | 'boss') {
        if (role == 'hero') {
            this.health = FighterConstant.HERO_DEFAULT_HEALTH;
            this.type = FighterConstant.TYPE_HERO;
        } else if (role == 'boss') {
            this.health = FighterConstant.BOSS_DEFAULT_HEALTH;
            this.type = FighterConstant.TYPE_BOSS;
        }
        return this;
    }

    //TODO
    public autoFollow(fighter: Fighter,
                      x: boolean = true,
                      y: boolean = false,
                      moveArea?: { x?: Array<number>, y?: Array<number> }): void {
        let randomX, randomY;
        if ((!fighter || !x) && (!moveArea || !moveArea.x || !moveArea.x.length))
            throw  new FighterAutoMoveException('x');
        if ((!fighter || !y) && (!moveArea || !moveArea.y || !moveArea.y.length))
            throw  new FighterAutoMoveException('y');
        if (moveArea.x) randomX = rateRandom(moveArea.x[0], moveArea.x[1]);
        if (moveArea.y) randomY = rateRandom(moveArea.y[0], moveArea.y[1]);

        this.on('draw',
            (delta: number, renderCount: number, render: CanvasRender): void => {
                let target = {top: fighter.position.top, left: fighter.position.left};
                let freq = render.renderFrequency(80);
                if (!x) {
                    if (freq) randomX = rateRandom(moveArea.x[0], moveArea.x[1]);
                    target.left = randomX;
                }
                if (!y) {
                    if (freq) randomY = rateRandom(moveArea.y[0], moveArea.y[1]);
                    target.top = randomY;
                }
                if (target.top > this.position.top) {
                    this.move(Constant.KEY_DOWN);
                } else {
                    this.move(Constant.KEY_UP);
                }
                if (target.left > this.position.left) {
                    this.move(Constant.KEY_RIGHT);
                } else {
                    this.move(Constant.KEY_LEFY);
                }
            });
    }

}

export class FighterUtils extends ComponentUtils {

    private fightersGroup: Array<Fighter>;

    private weaponsGroup: Array<WeaponUtils>;

    private config: any;

    constructor(canvas: Canvas,
                fighters?: Array<any>,
                weaponGroup?: Array<WeaponUtils>) {
        super(canvas);
        this.fightersGroup = arrayCopy<Fighter>(fighters);
        this.weaponsGroup = arrayCopy<WeaponUtils>(weaponGroup);
    }

    public autoCreate(config: {
        canvas: Canvas,
        quantity: number,
        originPosition?: Array<ComponentPosition>,
        width?: number,
        height?: number,
        speed?: number,
        image?: string,
        autoFollow?: {
            target?: Fighter,
            x?: Array<boolean>,
            y?: Array<boolean>,
            moveArea?: { x?: Array<number>, y?: Array<number> }
        },
        role?: 'enemy' | 'hero' | 'boss',
        weapon?: {
            targetTo?: FighterUtils,
            autoFire?: boolean,
            direction?: number,
            shootInterval?: number
        }
    }) {
        this.extendDefault(config);
        for (let i = 0; i < config.quantity; i++) {
            this.addFighter(config, i);
        }
    }

    public draw(delta: number, renderCount: number, render: CanvasRender): void {
        this.checkDestoryedFighter(render);
        this.fightersGroup.forEach((fighter, index) => {
            fighter.triggle('draw', [delta, renderCount, render]);
            this.canvas.context2d.drawImage(
                fighter.image,
                fighter.position.left,
                fighter.position.top,
                fighter.width,
                fighter.height
            );
            this.weaponsGroup[index] && this.weaponsGroup[index].draw(delta, renderCount, render);
        })

    }

    public addFighter(config, i): void {
        let enemy: Fighter = new Fighter(
            config.width,
            config.height,
            config.originPosition[i] ?
                config.originPosition[i] :
                new ComponentPosition(
                    rateRandom(-i % 5 * config.height, 0),
                    rateRandom(-i % 5 * config.width, 0))
        );
        let enemyWeapon: Weapon = new Weapon(enemy.position, config.weapon.autoFire, config.weapon.direction, config.weapon.shootInterval);
        let enemyWeaponUtils: WeaponUtils = new WeaponUtils(config.canvas, enemyWeapon);
        enemy.setImage(config.image, false);
        enemy.setSpeed(config.speed);
        enemy.autoFollow(
            config.autoFollow.target,
            !!config.autoFollow.x[i],
            !!config.autoFollow.y[i],
            config.autoFollow.moveArea);
        enemy.roleAs(config.role).loadWeapon(enemyWeapon).targetTo(config.weapon.targetTo.getFighterGroup());
        this.fightersGroup.push(enemy);
        this.weaponsGroup.push(enemyWeaponUtils);
    }

    private extendDefault(config) {
        extend(config, {
            originPosition: [],
            width: FighterConstant.WIDTH,
            height: FighterConstant.HEIGHT,
            image: FighterConstant.ENEMY_IMG_PATH,
            speed: FighterConstant.ENEMY_DEFAULT_SPEED,
            type: FighterConstant.TYPE_ENEMY,
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
                direction: ComponentConstant.DIRECTION_DOWN
            }
        });
        this.config = config;
    }

    public checkDestoryedFighter(render: CanvasRender) {
        let w = [];
        let f = this.fightersGroup.filter((fighter, index) => {
            if (fighter.health > 0) {
                w.push(this.weaponsGroup[index]);
                return true;
            } else {
                render.once(fighterBoom(fighter, this.canvas.context2d))
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
            this.addFighter(this.config, rateRandom(0, this.config.quantity));
        }
    }

    public fightersGroupPush(fighter: Fighter): void {
        this.fightersGroup.push(fighter);
    }

    public getFighterGroup() {
        return this.fightersGroup;
    }

}