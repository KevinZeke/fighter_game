import {Constant} from "../constant/Constant";
import {ComponentPosition} from "../component/Component";

export interface Controlable {
    beforeControl(event: Event);

    afterControl(event: Event);
}

export class KeyboardControl {

    public static moveControlModel(keyCode: number, position: ComponentPosition, speed: number) {
        switch (keyCode) {
            case (Constant.KEY_UP):
                position.top -= speed;
                break;
            case (Constant.KEY_DOWN):
                position.top += speed;
                break;
            case (Constant.KEY_LEFY):
                position.left -= speed;
                break;
            case (Constant.KEY_RIGHT):
                position.left += speed;
                break;
            default:
                break;
        }
    }

    private controlObj: any;

    private keydownHandel: any;

    private keyupHandel: any;

    constructor(controlObj: any) {
        this.controlObj = controlObj;
    }

    public control(keydown: Function, keyup: Function): any {
        if (this.isControlableImpl()) {
            this.keydownHandel = function (event: Event) {
                this.controlObj.beforeControl(event);
                keydown(event);
                this.controlObj.afterControl(event);
            }
            this.keyupHandel = function (event: Event) {
                this.controlObj.beforeControl(event);
                keydown(event);
                this.controlObj.afterControl(event);
            }
        } else {
            this.keyupHandel = keyup;
            this.keydownHandel = keydown;
        }
        document.body.addEventListener('keyup', this.keyupHandel, false);
        document.body.addEventListener('keydown', this.keydownHandel, false);
    }

    public removeControl(keydown: boolean = true, keyup: boolean = true) {
        keyup && document.body.removeEventListener('keyup', this.keyupHandel);
        keydown && document.body.removeEventListener('keydown', this.keydownHandel);
    }


    private isControlableImpl() {
        return this.controlObj.afterControl && (typeof this.controlObj.afterControl == "function")
            && this.controlObj.beforeControl && (typeof this.controlObj.beforeControl == "function");
    }
}