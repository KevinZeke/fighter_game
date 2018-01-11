define(["require", "exports", "../utils/utils", "../component/Component", "../control/Control"], function (require, exports, utils_1, Component_1, Control_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CanvasUtils {
        static getContext2d(selector) {
            return document.querySelector(selector).getContext('2d');
        }
        static clearAll(canvas) {
            canvas.context2d.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    exports.CanvasUtils = CanvasUtils;
    class Canvas {
        constructor(parent, id) {
            this.background = {
                img: null,
                width: 0,
                height: 0,
                position: new Component_1.ComponentPosition(),
                moveSpeed: 1.5
            };
            let parentNode;
            if (typeof parent == "string") {
                parentNode = document.querySelector(parent);
            }
            else if (typeof parent.getElementById == "function") {
                parentNode = parent;
            }
            else {
                return null;
            }
            this.element = document.createElement('canvas');
            this.element.position = 'absolute';
            parentNode.appendChild(this.element);
            this.height = parentNode.offsetHeight;
            this.width = parentNode.offsetWidth;
            id = id ? id : '$canvas-' + utils_1.rateRandom(0, 100);
            this.element.id = id;
            this.id = id;
            this.element.height = parentNode.offsetHeight;
            this.element.width = parentNode.offsetWidth;
            this.context2d = this.element.getContext('2d');
        }
        bg(path, x = 0, y = 0, w, h) {
            let bgimg = new Image();
            bgimg.src = path;
            this.background.img = bgimg;
            utils_1.loadImageAsync(bgimg).then(() => {
                this.background.width = w ? w : bgimg.width;
                this.background.height = h ? h : bgimg.height;
                if (x)
                    this.background.position.left = x;
                if (y)
                    this.background.position.top = y;
                this.drawBg();
            });
        }
        drawBg() {
            this.context2d.drawImage(this.background.img, this.background.position.left, this.background.position.top, this.background.width, this.background.height);
        }
        limitBg() {
            if (this.background.position.left > 0) {
                this.background.position.left = 0;
            }
            else if (this.background.position.left < -(this.background.width - this.width)) {
                this.background.position.left = -(this.background.width - this.width);
            }
            if (this.background.position.top > 0) {
                this.background.position.top = 0;
            }
            else if (this.background.position.top < -(this.background.height - this.height)) {
                this.background.position.top = -(this.background.height - this.height);
            }
        }
        bgMove(keyCode) {
            if (this.background.width < this.width || this.background.height < this.height) {
                console.warn('背景小于画布面积，无法移动背景层');
                return this;
            }
            Control_1.KeyboardControl.moveControlModel(keyCode, this.background.position, this.background.moveSpeed);
            this.limitBg();
            return this;
        }
    }
    exports.Canvas = Canvas;
});
