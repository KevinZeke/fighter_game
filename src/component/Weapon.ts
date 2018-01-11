import {Component, ComponentPosition, ComponentUtils} from "./Component";
import {CanvasRender, RenderEvent} from "../canvas/CanvasRender";
import {impact, propertoesDeepCopy} from "../utils/utils";
import {BulletConstant, ComponentConstant, Constant, FighterConstant} from "../constant/Constant";
import {Fighter} from "./Fighter";
import {Canvas} from "../canvas/Canvas";
import {EventListenTask, Listenable} from "./EventListenTask";


export class Bullet extends Component {

    public level: number;

    public direction: number;

    public damage: number = 4;

    public speed: number;

    constructor(level: number,
                width: number,
                height: number,
                pos?: ComponentPosition,
                imgPath?: string,
                direction?: number) {
        super(width, height, pos, imgPath);
        this.level = level;
        this.setDirection(direction);
    }

    public setDirection(direction?: number) {
        this.direction = direction ? direction : ComponentConstant.DIRECTION_DOWN;
        this.speed = 2 * this.direction;
    }

    public move(command?: any): void {
        this.position.top += this.speed;
    }

}

export class Weapon implements Listenable {

    public static readonly LEVEL_NOMAL: number = 0;
    public static readonly LEVEL_POWER: number = 1;
    public static readonly LEVEL_SHOTGUN: number = 2;
    public static readonly LEVEL_LASER: number = 3;

    public level: number = Weapon.LEVEL_NOMAL;

    public position: ComponentPosition;

    private eventTask: EventListenTask = new EventListenTask();

    public type: number;

    public autoFire: boolean = false;

    public direction;

    public shootInterval;

    private bullets: Array<Bullet> = [];

    private targetList: Array<Fighter> | null;

    constructor(position: ComponentPosition, autoFire: boolean, direction?: number, shootInterval?: number) {
        this.position = position;
        this.autoFire = autoFire;
        this.direction = direction ? direction : ComponentConstant.DIRECTION_DOWN;
        this.shootInterval = shootInterval ? shootInterval : 10;
        this.eventTask.add('hit', (bullet: Bullet, index: number) => {
            if (this.targetList && this.targetList.length) {
                this.targetList.forEach(target => {
                    if (impact(bullet, target)) {
                        target.underAttack(bullet.damage);
                        this.bullets.splice(index, 1);
                    }
                })
            }
        });
        this.eventTask.add('draw', (delta: number, renderCount: number, render: CanvasRender) => {
            this.bullets.forEach((bullet, index, bullets) => {
                bullet.move();
                this.eventTask.trigger('hit', [bullet, index]);
            });
            if (this.bullets.length > 300) this.bullets.splice(0, 150);
            if (this.autoFire && render.renderFrequency(this.shootInterval)) this.fire();
        })
    }

    public upgrade() {
        if (this.level < Weapon.LEVEL_LASER) {
            this.level++;
        }
    }

    public fire() {
        let bullet: Bullet = new Bullet(
            this.level,
            BulletConstant.NORMAL_WIDTH,
            BulletConstant.NORMAL_HEIGHT,
            propertoesDeepCopy(this.position) as ComponentPosition,
            (this.type == FighterConstant.TYPE_HERO) ? BulletConstant.HERO_IMG_PATH : BulletConstant.ENEMY_IMG_PATH,
            this.direction
        );
        this.bullets.push(bullet);
    }

    public eachBullet(callback?: Function): void {
        this.bullets.forEach((value, index, array) => {
            callback(value, index, array);
        });
    }

    targetTo(targetList?: Array<Fighter>) {
        this.targetList = targetList;
    }

    public on(eventName: string, callback: Function) {
        this.eventTask.add(eventName, callback);
    }

    public unbind(eventName: string, callback: Function) {
        this.eventTask.removeAll(eventName);
    }

    public triggle(eventName: string, args?: Array<any>) {
        this.eventTask.trigger(eventName, args);
    }

}

export class WeaponUtils extends ComponentUtils {

    private weapon: Weapon;

    constructor(canvas: Canvas, weapon: Weapon) {

        super(canvas);

        this.weapon = weapon;

    }

    public draw(delta: number, renderCount: number, render: CanvasRender): void {
        this.weapon.triggle('draw', [delta, renderCount, render]);
        this.weapon.eachBullet((value) => {
            this.canvas.context2d.drawImage(
                value.image,
                value.position.left + FighterConstant.WIDTH / 2,
                (this.weapon.direction == ComponentConstant.DIRECTION_DOWN) ?
                    value.position.top + FighterConstant.HEIGHT : value.position.top,
                value.width,
                value.height
            )
        })
    }
}