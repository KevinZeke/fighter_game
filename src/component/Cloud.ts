import {Component, ComponentConfigBuilder, ComponentPosition, ComponentUtils} from "./Component";
import {KeyboardControl} from "../control/Control";
import {CloudConstant, ComponentConstant, Constant} from "../constant/Constant";
import {CanvasRender, RenderEvent} from "../canvas/CanvasRender";
import {arrayCopy, extend, rateRandom, rateRandomByArray} from "../utils/utils";
import {Canvas} from "../canvas/Canvas";

export class Cloud extends Component {

    public moveSpeed: number = ComponentConstant.DEFAULT_MOVE_SPEED;


    constructor(width: number,
                height: number,
                pos?: ComponentPosition,
                imagePath?: string,
                moveSpeed?: number) {
        super(width, height, pos, imagePath);
        moveSpeed && (this.moveSpeed = moveSpeed);
    }

    public move(command: any): void {
        KeyboardControl.moveControlModel(command, this.position, this.moveSpeed);
    }
}

export class CloudUtils extends ComponentUtils {

    private clouds: Array<Cloud> = [];

    private config;

    constructor(canvas: Canvas, clouds?: Array<Cloud>) {
        super(canvas);
        this.clouds = arrayCopy(clouds);
    }

    public draw(delta: number, renderCount: number, render: CanvasRender): void {
        this.clouds.forEach(cloud => {
            this.canvas.context2d.drawImage(
                cloud.image,
                cloud.position.left,
                cloud.position.top,
                cloud.width,
                cloud.height
            );
        })
    }

    public autoCreate(config: {
        quantity: number,
        originPosition?: Array<ComponentPosition>,
        randomCreateArea?: { top: Array<number>, left: Array<number> },
        width?: Array<number>,
        randomWidthArea?: Array<number>,
        height?: Array<number>,
        randomHeightArea?: Array<number>,
        speed?: Array<number>,
        randomSpeedArea?: Array<number>,
        image?: Array<string>,
    }) {
        ComponentConfigBuilder.extendDefault(config, this.canvas);
        this.config = config;
        for (let i = 0; i < config.quantity; i++) {
            this.clouds.push(
                new Cloud(
                    config.width[i] ? config.width[i] : rateRandomByArray(config.randomWidthArea),
                    config.height[i] ? config.height[i] : rateRandomByArray(config.randomHeightArea),
                    config.originPosition[i] ? config.originPosition[i] : new ComponentPosition(
                        rateRandomByArray(config.randomCreateArea.top),
                        rateRandomByArray(config.randomCreateArea.left)
                    ),
                    config.image[i] ? config.image[i] : CloudConstant.IMG_PATH,
                    config.speed[i] ? config.speed[i] : rateRandomByArray(config.randomSpeedArea)
                )
            )
        }
    }

    public getClouds() {
        return this.clouds;
    }

    public refreashList() {
        this.clouds.length = 0;
        this.autoCreate(this.config);
    }
}