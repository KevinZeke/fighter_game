define(["require", "exports", "./component/Fighter", "./constant/Constant", "./canvas/CanvasRender", "./canvas/Canvas", "./component/Component", "./utils/utils", "./component/EventListenTask"], function (require, exports, Fighter_1, Constant_1, CanvasRender_1, Canvas_1, Component_1, utils_1, EventListenTask_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * canvas对象
     * @type {Canvas}
     */
    let bgCanvas = new Canvas_1.Canvas(Constant_1.Constant.CANVAS_WRAP_CLASS, Constant_1.Constant.BG_ID);
    bgCanvas.bg('../image/sky2.jpeg', -100, -100);
    let battleGroundCanvas = new Canvas_1.Canvas(Constant_1.Constant.CANVAS_WRAP_CLASS, Constant_1.Constant.BATTLE_GROUND_ID);
    let deathStar = new Fighter_1.Fighter(battleGroundCanvas.width, battleGroundCanvas.width, new Component_1.ComponentPosition(-battleGroundCanvas.width, 0), '../image/deathStar.png');
    let deathStarUtils = new Fighter_1.FighterUtils(battleGroundCanvas, [deathStar]);
    let hero = new Fighter_1.Fighter(Constant_1.FighterConstant.WIDTH, Constant_1.FighterConstant.HEIGHT, {
        top: battleGroundCanvas.height - Constant_1.FighterConstant.HEIGHT,
        left: battleGroundCanvas.width / 2 - Constant_1.FighterConstant.WIDTH / 2,
    }, Constant_1.FighterConstant.HERO_IMG_PATH);
    deathStar.autoFollow(hero, false, false, {
        x: [0, 0], y: [-battleGroundCanvas.width, 0]
    });
    deathStar.setSpeed(0.2);
    console.log(utils_1.rateRandomByArray([-10, 2]));
    /**
     * 画布刷新控制类
     * @type {CanvasRender}
     */
    let render = new CanvasRender_1.CanvasRender();
    // render.addTop('clearAll', () => {
    //     CanvasUtils.clearAll(battleGroundCanvas);
    //     CanvasUtils.clearAll(bgCanvas);
    // })
    //     .add('drawDeathStar', (delta: number, renderCont: number, render: CanvasRender) => {
    //
    //         deathStarUtils.draw(delta, renderCont, render);
    //     })
    //     .open();
    let event = new EventListenTask_1.EventListenTask();
    event.add('test', function (a, b, c) {
        console.log(a, b, c);
    }).add('test2', (a) => {
        console.log(a);
    });
    console.log(event);
    event.triggerAll([1, 2, 3]);
    console.log(event);
});
