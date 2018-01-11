define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CanvasRender {
        constructor() {
            this.task = {};
            this.onceTaskList = [];
            this.taskName = [];
            this.timer = null;
            this.delta = 0;
            this.date = new Date();
            this.renderCount = 0;
            //TODO
            this.listeners = [];
        }
        getTaskName() {
            return this.taskName;
        }
        shutdown() {
            cancelAnimationFrame(this.timer);
            return this;
        }
        listen(components) {
            this.addTop('renderEvent', () => {
                components.forEach(component => {
                    component.onRender(this.delta, this.renderCount, this);
                });
            });
            return this;
        }
        open(callback) {
            this.animation(callback);
            return this;
        }
        taskExist(name) {
            return !!this.task[name];
        }
        add(taskName, taskCallback) {
            if (this.taskExist(taskName))
                return;
            this.taskName.push(taskName);
            this.task[taskName] = taskCallback;
            return this;
        }
        once(callback) {
            callback.__status__ = CanvasRender.RENDERING;
            this.onceTaskList.push(callback);
            return this;
        }
        markEnd(callback) {
            console.log(callback.__status__);
            callback.__status__ = CanvasRender.REMOVE;
        }
        overwriteTask(taskName, taskCallback) {
            if (this.taskExist(taskName)) {
                this.task[taskName] = taskCallback;
            }
            else {
                this.add(taskName, taskCallback);
            }
            return this;
        }
        addTop(taskName, taskCallback) {
            this.taskName.unshift(taskName);
            this.task[taskName] = taskCallback;
            return this;
        }
        remove(name) {
            if (this.task[name]) {
                this.taskName.splice(this.taskName.indexOf(name), 1);
                delete this.task[name];
            }
            return this;
        }
        loop(loopConfig) {
            this.add(loopConfig.name, (delta, renderCount, render) => {
                if (loopConfig.test(delta, renderCount, render)) {
                    loopConfig.yes(delta, renderCount, render);
                }
                else {
                    loopConfig.no(delta, renderCount, render);
                }
            });
            return this;
        }
        animation(callback) {
            this.timer = requestAnimationFrame(() => {
                this.refreashRenderInfo();
                callback && callback(this.delta, this.renderCount, this);
                this.taskName.forEach(item => {
                    this.task[item](this.delta, this.renderCount, this);
                });
                this.onceTaskList = this.onceTaskList.filter(callback => {
                    // console.log(callback.__status__);
                    return callback.__status__ != CanvasRender.REMOVE;
                });
                this.onceTaskList.forEach(callback => {
                    callback(this.delta, this.renderCount, this);
                });
                // console.log(this.onceTaskList);
                this.animation(callback);
            });
            return this;
        }
        refreashRenderInfo() {
            this.renderCount++;
            if (this.renderCount > CanvasRender.MAX_RENDER_COUNT)
                this.renderCount = 0;
            let date = new Date();
            this.delta = date.getTime() - this.date.getTime();
            this.date = date;
        }
        renderFrequency(frequency) {
            return (this.renderCount % frequency == 0);
        }
    }
    CanvasRender.MAX_RENDER_COUNT = 65535;
    CanvasRender.ONCE_TASK_PREFIX = '$once_';
    CanvasRender.RENDERING = 1;
    CanvasRender.REMOVE = -1;
    exports.CanvasRender = CanvasRender;
});
