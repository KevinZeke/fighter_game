import {Canvas} from "../canvas/Canvas";
import {Component, ComponentPosition} from "../component/Component";

export function loadImageAsync(img: HTMLImageElement): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
        img.onload = function () {
            resolve(img);
        }
        img.onerror = function () {
            reject();
        }
    }))
}

export function propertoesDeepCopy(target: object): object {
    return JSON.parse(JSON.stringify(target));
}

export function rateRandom(min, max): number {
    var Range = max - min;
    var Rand = Math.random();
    var num = min + Math.round(Rand * Range); //四舍五入
    return num;
}

export function rateRandomByArray(arr: Array<number>): number {
    if (arr.length < 2) throw new Error("随机数生成取消上限和下限两个参数");
    return rateRandom(arr[0], arr[1]);
}

export function arrayCopy<T>(source: Array<T>): Array<T> {
    let newArr: Array<T> = [];
    if (source && source.length) {
        source.forEach(value => {
            newArr.push(value);
        });
    }
    return newArr;
}

export function extend(target, source): void {
    for (let key in source) {
        if (!target[key]) {
            if (typeof source[key] == "object")
                target[key] = propertoesDeepCopy(source[key]);
            else
                target[key] = source[key];
        } else if (typeof target[key] == "object") {
            extend(target[key], source[key]);
        }
    }
}

export function impact(obj1: Component, obj2: Component) {
    var o = {
        x: obj1.position.left,
        y: obj1.position.top,
        w: obj1.width,
        h: obj1.height
    }

    var d = {
        x: obj2.position.left - obj2.width / 2,
        y: obj2.position.top - obj2.height,
        w: obj2.width,
        h: obj2.height
    }
    var px, py;

    px = o.x <= d.x ? d.x : o.x;
    py = o.y <= d.y ? d.y : o.y;

    // 判断点是否都在两个对象中
    if (px >= o.x && px <= o.x + o.w && py >= o.y && py <= o.y + o.h && px >= d.x && px <= d.x + d.w && py >= d.y && py <= d.y + d.h) {
        return true;
    } else {
        return false;
    }
}

function inRate(num: number, rate: Array<number>): boolean {
    if (num >= rate[0] && num <= rate[1]) return true;
    return false;
}

export function limitMoveRangeByCanvas(target: Component, canvas: Canvas) {
    if (target.position.left < 0) {
        target.position.left = 0;
    }
    if (target.position.top < 0) {
        target.position.top = 0;
    }
    if (target.position.left > (canvas.width - target.width)) {
        target.position.left = canvas.width - target.width;
    }
    if (target.position.top > (canvas.height - target.height)) {
        target.position.top = canvas.height - target.height;
    }
}