define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CanvasUtils {
        static getContext2d(selector) {
            return document.querySelector(selector).getContext('2d');
        }
        static clearAll(canvas, context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    exports.CanvasUtils = CanvasUtils;
});
