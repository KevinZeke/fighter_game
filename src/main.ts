import {Fighter, FighterUtils} from "./component/Fighter";
import {ComponentConstant, Constant, FighterConstant} from "./constant/Constant";
import {CanvasRender} from "./canvas/CanvasRender";
import {Canvas, CanvasUtils} from "./canvas/Canvas";
import {Weapon, WeaponUtils} from "./component/Weapon";
import {KeyboardControl} from "./control/Control";
import {ComponentPosition} from "./component/Component";
import {CloudUtils} from "./component/Cloud";

/**
 * canvas对象
 * @type {Canvas}
 */
let bgCanvas: Canvas = new Canvas(
    Constant.CANVAS_WRAP_CLASS,
    Constant.BG_ID
);
let battleGroundCanvas: Canvas = new Canvas(
    Constant.CANVAS_WRAP_CLASS,
    Constant.BATTLE_GROUND_ID);
bgCanvas.bg(Constant.CANVAS_BG_IMG_PATH, -100, -100);
/**
 * 背景云层管理对象
 * @type {CloudUtils}
 */
let cloudUtils = new CloudUtils(bgCanvas);
/**
 * 主角机对象
 * @type {Fighter}
 */
let hero: Fighter = new Fighter(FighterConstant.WIDTH, FighterConstant.HEIGHT, {
    top: battleGroundCanvas.height - FighterConstant.HEIGHT,
    left: battleGroundCanvas.width / 2 - FighterConstant.WIDTH / 2,
}, FighterConstant.HERO_IMG_PATH);
hero.on("healthChange", (curHealth: number, damage: number) => {
    console.log(curHealth);
});
/**
 * 主角机管理对象
 * @type {FighterUtils}
 */
let heroController: KeyboardControl = new KeyboardControl(hero);
let weapon: Weapon = new Weapon(hero.position, true, ComponentConstant.DIRECTION_UP);
let heroWeaponUtils: WeaponUtils = new WeaponUtils(battleGroundCanvas, weapon);
let heroUtils: FighterUtils = new FighterUtils(battleGroundCanvas, [hero], [heroWeaponUtils]);
/**
 * BOSS对象
 * @type {Fighter}
 */
let deathStar = new Fighter(
    battleGroundCanvas.width,
    battleGroundCanvas.width,
    new ComponentPosition(-battleGroundCanvas.width, 0),
    FighterConstant.DEATHSTAR_IMG_PATH
);
/**
 * 敌机管理对象
 * @type {FighterUtils}
 */
let enemysUtils: FighterUtils = new FighterUtils(battleGroundCanvas);
/**
 * 画布刷新控制类
 * @type {CanvasRender}
 */
let render: CanvasRender = new CanvasRender();
/**
 * 事件控制
 * @type {number}
 */
let keyCodeCache: number = 0;
/**
 * 创建杂兵敌机
 */
enemysUtils.autoCreate({
    canvas: battleGroundCanvas,
    quantity: 7,
    role: "enemy",
    autoFollow: {
        target: hero,
        x: [true, false, true],
        moveArea: {x: [0, battleGroundCanvas.width], y: [0, battleGroundCanvas.height / 2]}
    },
    weapon: {
        targetTo: heroUtils,
        autoFire: true,
        shootInterval: 100,
        direction: ComponentConstant.DIRECTION_DOWN
    }
});
/**
 * 标记主角机
 */
hero.roleAs("hero").loadWeapon(weapon).targetTo(enemysUtils.getFighterGroup());
/**
 * 主角机添加键盘控制
 */
heroController.control(
    (e) => {
        keyCodeCache = e.keyCode;
    },
    (e) => {
        // keyCodeCache = 0;
    }
)
/**
 * 标记BOSS角色,设置BOSS移动和跟踪范围
 */
deathStar.autoFollow(hero, false, false, {
    x: [0, 0], y: [-battleGroundCanvas.width, 0]
});
deathStar.roleAs("boss");
deathStar.setSpeed(0.2);
/**
 * 将BOSS添加进入敌机管理组
 */
enemysUtils.fightersGroupPush(deathStar);
/**
 * 创建浮动云
 */
cloudUtils.autoCreate({
    quantity: 3,
    randomCreateArea: {top: [-bgCanvas.height * 2, -bgCanvas.height], left: [0, bgCanvas.width]},
    randomSpeedArea: [1, 4],
    randomWidthArea: [250, 350],
    randomHeightArea: [160, 220]
});
/**
 * 利用刷新类添加刷新任务并且开启执行
 */
render.addTop('clearAll', () => {
    CanvasUtils.clearAll(battleGroundCanvas);
    CanvasUtils.clearAll(bgCanvas);
})
    .add('heroMoveLimit', () => {
        hero.limitMove(keyCodeCache, battleGroundCanvas);
    })
    .add('drawHero', heroUtils.draw.bind(heroUtils))
    .add('drawEnemy', enemysUtils.draw.bind(enemysUtils))
    .add('drawBg', () => {
        bgCanvas.bgMove(Constant.reverseKeyCode(keyCodeCache)).drawBg();
    })
    .loop({
        name: "drawCloud",
        test() {
            return cloudUtils.getClouds().filter(cloud => {
                return cloud.position.top <= bgCanvas.height
            }).length == 0
        },
        yes() {
            cloudUtils.refreashList();
        },
        no(delta: number, rendercount: number, render: CanvasRender) {
            cloudUtils.getClouds().forEach(cloud => {
                cloud.move(Constant.KEY_DOWN);
            });
            cloudUtils.draw(delta, rendercount, render);
        }
    })
    .open();




