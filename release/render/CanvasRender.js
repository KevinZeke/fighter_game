define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CanvasRender {
        constructor() {
            this.task = {};
            this.timer = null;
            this.delta = 0;
            this.date = new Date();
        }
        // private requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        //     window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        //
        // private cancelAnimationFrame = cancelAnimationFrame || window.mozCancelAnimationFrame;
        shutdown() {
            cancelAnimationFrame(this.timer);
        }
        open(callback) {
            this.animation(callback);
        }
        add(name, callback) {
            this.task[name] = callback;
        }
        remove(name) {
            if (this.task[name])
                delete this.task[name];
        }
        animation(callback) {
            this.timer = requestAnimationFrame(() => {
                let date = new Date();
                this.delta = date.getTime() - this.date.getTime();
                this.date = date;
                callback && callback(this.delta);
                this.animation(callback);
            });
        }
    }
    exports.CanvasRender = CanvasRender;
});
