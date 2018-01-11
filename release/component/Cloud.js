define(["require", "exports", "./Component", "../control/Control", "../constant/Constant", "../utils/utils"], function (require, exports, Component_1, Control_1, Constant_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Cloud extends Component_1.Component {
        constructor(width, height, pos, imagePath, moveSpeed) {
            super(width, height, pos, imagePath);
            this.moveSpeed = Constant_1.ComponentConstant.DEFAULT_MOVE_SPEED;
            moveSpeed && (this.moveSpeed = moveSpeed);
        }
        move(command) {
            Control_1.KeyboardControl.moveControlModel(command, this.position, this.moveSpeed);
        }
    }
    exports.Cloud = Cloud;
    class CloudUtils extends Component_1.ComponentUtils {
        constructor(canvas, clouds) {
            super(canvas);
            this.clouds = [];
            this.clouds = utils_1.arrayCopy(clouds);
        }
        draw(delta, renderCount, render) {
            this.clouds.forEach(cloud => {
                this.canvas.context2d.drawImage(cloud.image, cloud.position.left, cloud.position.top, cloud.width, cloud.height);
            });
        }
        autoCreate(config) {
            Component_1.ComponentConfigBuilder.extendDefault(config, this.canvas);
            this.config = config;
            for (let i = 0; i < config.quantity; i++) {
                this.clouds.push(new Cloud(config.width[i] ? config.width[i] : utils_1.rateRandomByArray(config.randomWidthArea), config.height[i] ? config.height[i] : utils_1.rateRandomByArray(config.randomHeightArea), config.originPosition[i] ? config.originPosition[i] : new Component_1.ComponentPosition(utils_1.rateRandomByArray(config.randomCreateArea.top), utils_1.rateRandomByArray(config.randomCreateArea.left)), config.image[i] ? config.image[i] : Constant_1.CloudConstant.IMG_PATH, config.speed[i] ? config.speed[i] : utils_1.rateRandomByArray(config.randomSpeedArea)));
            }
        }
        getClouds() {
            return this.clouds;
        }
        refreashList() {
            this.clouds.length = 0;
            this.autoCreate(this.config);
        }
    }
    exports.CloudUtils = CloudUtils;
});
