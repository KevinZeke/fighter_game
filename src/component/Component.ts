import {arrayCopy, extend, loadImageAsync} from "../utils/utils";
import {ComponentConstant} from "../constant/Constant";
import {CanvasRender} from "../canvas/CanvasRender";
import {Canvas} from "../canvas/Canvas";
import {EventListenTask, Listenable} from "./EventListenTask";

export class ComponentPosition {
    public top: number;
    public left: number;

    constructor(top: number = 0, left: number = 0) {
        this.top = top;
        this.left = left;
    }
}

/**
 * 基础组件类
 */
export class Component implements Listenable {

    private eventTask: EventListenTask = new EventListenTask();

    public position: ComponentPosition;

    public width: number;

    public height: number;

    public image: HTMLImageElement = new Image();

    public direction: number = ComponentConstant.DIRECTION_UP;

    constructor(width: number, height: number, pos?: ComponentPosition, imagePath?: string) {
        this.position = pos ? pos : new ComponentPosition();
        this.width = width;
        this.height = height;
        imagePath && this.setImage(imagePath, false);
    }

    /**
     * 组件移动函数
     * @param command 移动命令
     */
    public move(command?: any): void {
    }

    /**
     * 添加该组件的事件监听
     * @param {string} eventName
     * @param {Function} callback
     */
    public on(eventName: string, callback: Function) {
        this.eventTask.add(eventName, callback);
    }

    /**
     * 移除该组件的事件监听
     * @param {string} eventName
     * @param {Function} callback
     */
    public unbind(eventName: string, callback: Function) {
        this.eventTask.removeAll(eventName);
    }

    public triggle(eventName: string, args?: Array<any>) {
        this.eventTask.trigger(eventName, args);
    }

    /**
     * 设置组件图片
     * @param {string} path
     * @param {boolean} async
     * @returns {Promise<any>}
     */
    public setImage(path: string, async?: boolean): Promise<any> {
        this.image.src = path;
        if (async)
            return loadImageAsync(this.image);
        else
            return null;
    }
}

export abstract class ComponentUtils {
    public canvas: Canvas;


    constructor(canvas: Canvas) {
        this.canvas = canvas;
    }

    public draw(delta: number, renderCount: number, render: CanvasRender): void {
    }
}

export class ComponentConfigBuilder {
    public static baseConfigModel(canvas: Canvas): {
        originPosition?: Array<ComponentPosition>,
        randomCreateArea?: { top: Array<number>, left: Array<number> },
        width?: Array<number>,
        randomWidthArea: Array<number>,
        height?: Array<number>,
        randomHeightArea: Array<number>,
        speed?: Array<number>,
        randomSpeedArea?: Array<number>,
        image?: Array<string>,
        type?: number
    } {
        return {
            originPosition: [],
            randomCreateArea: {
                top: [0, canvas.height],
                left: [0, canvas.width]
            },
            width: [],
            randomWidthArea: [0, canvas.width / 5],
            height: [],
            randomHeightArea: [0, canvas.width / 5],
            speed: [],
            randomSpeedArea: [0, canvas.width / 100],
            image: [],
            type: ComponentConstant.TYPE_NORMAL_COMPONENT
        };
    }

    //TODO
    public static weaponConfigModel(): {} {
        return null;
    }

    public static extendDefault(config: object, canvas: Canvas, options?: { weapon: boolean }) {
        extend(config, this.baseConfigModel(canvas));
    }
}