define(["require", "exports", "./component/Fighter", "./constant/Constant", "./canvas/CanvasRender", "./canvas/Canvas", "./component/Weapon", "./control/Control", "./component/Component", "./component/Cloud"], function (require, exports, Fighter_1, Constant_1, CanvasRender_1, Canvas_1, Weapon_1, Control_1, Component_1, Cloud_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * canvas对象
     * @type {Canvas}
     */
    let bgCanvas = new Canvas_1.Canvas(Constant_1.Constant.CANVAS_WRAP_CLASS, Constant_1.Constant.BG_ID);
    let battleGroundCanvas = new Canvas_1.Canvas(Constant_1.Constant.CANVAS_WRAP_CLASS, Constant_1.Constant.BATTLE_GROUND_ID);
    bgCanvas.bg(Constant_1.Constant.CANVAS_BG_IMG_PATH, -100, -100);
    /**
     * 背景云层管理对象
     * @type {CloudUtils}
     */
    let cloudUtils = new Cloud_1.CloudUtils(bgCanvas);
    /**
     * 主角机对象
     * @type {Fighter}
     */
    let hero = new Fighter_1.Fighter(Constant_1.FighterConstant.WIDTH, Constant_1.FighterConstant.HEIGHT, {
        top: battleGroundCanvas.height - Constant_1.FighterConstant.HEIGHT,
        left: battleGroundCanvas.width / 2 - Constant_1.FighterConstant.WIDTH / 2,
    }, Constant_1.FighterConstant.HERO_IMG_PATH);
    hero.on("healthChange", (health, damage) => {
        console.log(health);
    });
    hero.on("healthChange", (health, damage) => {
        console.log(damage);
    });
    /**
     * 主角机管理对象
     * @type {FighterUtils}
     */
    let heroController = new Control_1.KeyboardControl(hero);
    let weapon = new Weapon_1.Weapon(hero.position, true, Constant_1.ComponentConstant.DIRECTION_UP);
    let heroWeaponUtils = new Weapon_1.WeaponUtils(battleGroundCanvas, weapon);
    let heroUtils = new Fighter_1.FighterUtils(battleGroundCanvas, [hero], [heroWeaponUtils]);
    /**
     * BOSS对象
     * @type {Fighter}
     */
    let deathStar = new Fighter_1.Fighter(battleGroundCanvas.width, battleGroundCanvas.width, new Component_1.ComponentPosition(-battleGroundCanvas.width, 0), Constant_1.FighterConstant.DEATHSTAR_IMG_PATH);
    /**
     * 敌机管理对象
     * @type {FighterUtils}
     */
    let enemysUtils = new Fighter_1.FighterUtils(battleGroundCanvas);
    /**
     * 画布刷新控制类
     * @type {CanvasRender}
     */
    let render = new CanvasRender_1.CanvasRender();
    /**
     * 事件控制
     * @type {number}
     */
    let keyCodeCache = 0;
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
            moveArea: { x: [0, battleGroundCanvas.width], y: [0, battleGroundCanvas.height / 2] }
        },
        weapon: {
            targetTo: heroUtils,
            autoFire: true,
            shootInterval: 100,
            direction: Constant_1.ComponentConstant.DIRECTION_DOWN
        }
    });
    /**
     * 标记主角机
     */
    hero.roleAs("hero").loadWeapon(weapon).targetTo(enemysUtils.getFighterGroup());
    /**
     * 主角机添加键盘控制
     */
    heroController.control((e) => {
        keyCodeCache = e.keyCode;
    }, (e) => {
        // keyCodeCache = 0;
    });
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
        randomCreateArea: { top: [-bgCanvas.height * 2, -bgCanvas.height], left: [0, bgCanvas.width] },
        randomSpeedArea: [1, 4],
        randomWidthArea: [250, 350],
        randomHeightArea: [160, 220]
    });
    /**
     * 利用刷新类添加刷新任务并且开启执行
     */
    render.addTop('clearAll', () => {
        Canvas_1.CanvasUtils.clearAll(battleGroundCanvas);
        Canvas_1.CanvasUtils.clearAll(bgCanvas);
    })
        .add('heroMoveLimit', () => {
        hero.limitMove(keyCodeCache, battleGroundCanvas);
    })
        .add('drawHero', heroUtils.draw.bind(heroUtils))
        .add('drawEnemy', enemysUtils.draw.bind(enemysUtils))
        .add('drawBg', () => {
        bgCanvas.bgMove(Constant_1.Constant.reverseKeyCode(keyCodeCache)).drawBg();
    })
        .loop({
        name: "drawCloud",
        test() {
            return cloudUtils.getClouds().filter(cloud => {
                return cloud.position.top <= bgCanvas.height;
            }).length == 0;
        },
        yes() {
            cloudUtils.refreashList();
        },
        no(delta, rendercount, render) {
            cloudUtils.getClouds().forEach(cloud => {
                cloud.move(Constant_1.Constant.KEY_DOWN);
            });
            cloudUtils.draw(delta, rendercount, render);
        }
    })
        .open();
    console.log(render);
});
