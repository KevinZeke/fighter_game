define(["require", "exports", "../utils/utils", "../constant/Constant", "./EventListenTask"], function (require, exports, utils_1, Constant_1, EventListenTask_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ComponentPosition {
        constructor(top = 0, left = 0) {
            this.top = top;
            this.left = left;
        }
    }
    exports.ComponentPosition = ComponentPosition;
    /**
     * 基础组件类
     */
    class Component {
        constructor(width, height, pos, imagePath) {
            this.eventTask = new EventListenTask_1.EventListenTask();
            this.image = new Image();
            this.direction = Constant_1.ComponentConstant.DIRECTION_UP;
            this.position = pos ? pos : new ComponentPosition();
            this.width = width;
            this.height = height;
            imagePath && this.setImage(imagePath, false);
        }
        /**
         * 组件移动函数
         * @param command 移动命令
         */
        move(command) {
        }
        /**
         * 添加该组件的事件监听
         * @param {string} eventName
         * @param {Function} callback
         */
        on(eventName, callback) {
            this.eventTask.add(eventName, callback);
        }
        /**
         * 移除该组件的事件监听
         * @param {string} eventName
         * @param {Function} callback
         */
        unbind(eventName, callback) {
            this.eventTask.removeAll(eventName);
        }
        triggle(eventName, args) {
            this.eventTask.trigger(eventName, args);
        }
        /**
         * 设置组件图片
         * @param {string} path
         * @param {boolean} async
         * @returns {Promise<any>}
         */
        setImage(path, async) {
            this.image.src = path;
            if (async)
                return utils_1.loadImageAsync(this.image);
            else
                return null;
        }
    }
    exports.Component = Component;
    class ComponentUtils {
        constructor(canvas) {
            this.canvas = canvas;
        }
        draw(delta, renderCount, render) {
        }
    }
    exports.ComponentUtils = ComponentUtils;
    class ComponentConfigBuilder {
        static baseConfigModel(canvas) {
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
                type: Constant_1.ComponentConstant.TYPE_NORMAL_COMPONENT
            };
        }
        //TODO
        static weaponConfigModel() {
            return null;
        }
        static extendDefault(config, canvas, options) {
            utils_1.extend(config, this.baseConfigModel(canvas));
        }
    }
    exports.ComponentConfigBuilder = ComponentConfigBuilder;
});
