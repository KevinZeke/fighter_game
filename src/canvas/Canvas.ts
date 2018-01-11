import {loadImageAsync, rateRandom} from "../utils/utils";
import {ComponentPosition} from "../component/Component";
import {Constant} from "../constant/Constant";
import {KeyboardControl} from "../control/Control";

export class CanvasUtils {
    public static getContext2d(selector: string): CanvasRenderingContext2D {
        return (document.querySelector(selector) as any).getContext('2d');
    }

    public static clearAll(canvas: Canvas): void {
        canvas.context2d.clearRect(0, 0, canvas.width, canvas.height);
    }

}

export class Canvas {

    public width: number;
    public height: number;
    public element: any;
    public id: string;
    public context2d: CanvasRenderingContext2D;
    public background = {
        img: null,
        width: 0,
        height: 0,
        position: new ComponentPosition(),
        moveSpeed: 1.5
    };

    constructor(parent: any, id?: string) {
        let parentNode;
        if (typeof parent == "string") {
            parentNode = document.querySelector(parent);
        } else if (typeof parent.getElementById == "function") {
            parentNode = parent;
        } else {
            return null;
        }
        this.element = document.createElement('canvas');
        this.element.position = 'absolute';
        parentNode.appendChild(this.element);
        this.height = parentNode.offsetHeight;
        this.width = parentNode.offsetWidth;
        id = id ? id : '$canvas-' + rateRandom(0, 100);
        this.element.id = id;
        this.id = id;
        this.element.height = parentNode.offsetHeight;
        this.element.width = parentNode.offsetWidth;
        this.context2d = this.element.getContext('2d');
    }

    public bg(path: string, x: number = 0, y: number = 0, w?: number, h?: number) {
        let bgimg = new Image();
        bgimg.src = path;
        this.background.img = bgimg;
        loadImageAsync(bgimg).then(() => {
            this.background.width = w ? w : bgimg.width;
            this.background.height = h ? h : bgimg.height;
            if (x) this.background.position.left = x;
            if (y) this.background.position.top = y;
            this.drawBg();
        })
    }

    public drawBg() {
        this.context2d.drawImage(
            this.background.img,
            this.background.position.left,
            this.background.position.top,
            this.background.width,
            this.background.height
        );
    }

    public limitBg() {
        if (this.background.position.left > 0) {
            this.background.position.left = 0;
        } else if (this.background.position.left < -(this.background.width - this.width)) {
            this.background.position.left = -(this.background.width - this.width);
        }

        if (this.background.position.top > 0) {
            this.background.position.top = 0;
        } else if (this.background.position.top < -(this.background.height - this.height)) {
            this.background.position.top = -(this.background.height - this.height);
        }
    }

    public bgMove(keyCode: number): Canvas {
        if (this.background.width < this.width || this.background.height < this.height) {
            console.warn('背景小于画布面积，无法移动背景层');
            return this;
        }
        KeyboardControl.moveControlModel(keyCode, this.background.position, this.background.moveSpeed);
        this.limitBg();
        return this;
    }
}