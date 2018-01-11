import {Fighter, FighterUtils} from "./component/Fighter";
import {ComponentConstant, Constant, FighterConstant} from "./constant/Constant";
import {CanvasRender} from "./canvas/CanvasRender";
import {Canvas, CanvasUtils} from "./canvas/Canvas";
import {Weapon, WeaponUtils} from "./component/Weapon";
import {KeyboardControl} from "./control/Control";
import {Component, ComponentPosition} from "./component/Component";
import {loadImageAsync, rateRandomByArray} from "./utils/utils";
import {CloudUtils} from "./component/Cloud";
import {EventListenTask} from "./component/EventListenTask";

/**
 * canvas对象
 * @type {Canvas}
 */
let bgCanvas: Canvas = new Canvas(
    Constant.CANVAS_WRAP_CLASS,
    Constant.BG_ID
);
bgCanvas.bg('../image/sky2.jpeg', -100, -100);
let battleGroundCanvas: Canvas = new Canvas(
    Constant.CANVAS_WRAP_CLASS,
    Constant.BATTLE_GROUND_ID);


let deathStar = new Fighter(
    battleGroundCanvas.width,
    battleGroundCanvas.width,
    new ComponentPosition(-battleGroundCanvas.width, 0),
    '../image/deathStar.png'
);
let deathStarUtils = new FighterUtils(battleGroundCanvas, [deathStar]);

let hero: Fighter = new Fighter(FighterConstant.WIDTH, FighterConstant.HEIGHT, {
    top: battleGroundCanvas.height - FighterConstant.HEIGHT,
    left: battleGroundCanvas.width / 2 - FighterConstant.WIDTH / 2,
}, FighterConstant.HERO_IMG_PATH);

deathStar.autoFollow(hero, false, false, {
    x: [0, 0], y: [-battleGroundCanvas.width, 0]
});

deathStar.setSpeed(0.2);

console.log(rateRandomByArray([-10, 2]));

/**
 * 画布刷新控制类
 * @type {CanvasRender}
 */
let render: CanvasRender = new CanvasRender();

// render.addTop('clearAll', () => {
//     CanvasUtils.clearAll(battleGroundCanvas);
//     CanvasUtils.clearAll(bgCanvas);
// })
//     .add('drawDeathStar', (delta: number, renderCont: number, render: CanvasRender) => {
//
//         deathStarUtils.draw(delta, renderCont, render);
//     })
//     .open();


let event = new EventListenTask();

event.add('test', function (a, b, c) {
    console.log(a, b, c);
}).add('test2', (a) => {
    console.log(a);
})

console.log(event);
event.triggerAll([1, 2, 3]);

console.log(event);

