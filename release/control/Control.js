define(["require", "exports", "../constant/Constant"], function (require, exports, Constant_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class KeyboardControl {
        static moveControlModel(keyCode, position, speed) {
            switch (keyCode) {
                case (Constant_1.Constant.KEY_UP):
                    position.top -= speed;
                    break;
                case (Constant_1.Constant.KEY_DOWN):
                    position.top += speed;
                    break;
                case (Constant_1.Constant.KEY_LEFY):
                    position.left -= speed;
                    break;
                case (Constant_1.Constant.KEY_RIGHT):
                    position.left += speed;
                    break;
                default:
                    break;
            }
        }
        constructor(controlObj) {
            this.controlObj = controlObj;
        }
        control(keydown, keyup) {
            if (this.isControlableImpl()) {
                this.keydownHandel = function (event) {
                    this.controlObj.beforeControl(event);
                    keydown(event);
                    this.controlObj.afterControl(event);
                };
                this.keyupHandel = function (event) {
                    this.controlObj.beforeControl(event);
                    keydown(event);
                    this.controlObj.afterControl(event);
                };
            }
            else {
                this.keyupHandel = keyup;
                this.keydownHandel = keydown;
            }
            document.body.addEventListener('keyup', this.keyupHandel, false);
            document.body.addEventListener('keydown', this.keydownHandel, false);
        }
        removeControl(keydown = true, keyup = true) {
            keyup && document.body.removeEventListener('keyup', this.keyupHandel);
            keydown && document.body.removeEventListener('keydown', this.keydownHandel);
        }
        isControlableImpl() {
            return this.controlObj.afterControl && (typeof this.controlObj.afterControl == "function")
                && this.controlObj.beforeControl && (typeof this.controlObj.beforeControl == "function");
        }
    }
    exports.KeyboardControl = KeyboardControl;
});
