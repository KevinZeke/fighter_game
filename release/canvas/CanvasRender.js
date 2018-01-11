define(["require", "exports", "../component/EventListenTask"], function (require, exports, EventListenTask_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CanvasRender {
        constructor() {
            this.event = new EventListenTask_1.EventListenTask();
            this.timer = null;
            this.delta = 0;
            this.date = new Date();
            this.renderCount = 0;
            //TODO
            this.listeners = [];
        }
        getTaskName() {
            return this.event.getTaskName();
        }
        shutdown() {
            cancelAnimationFrame(this.timer);
            return this;
        }
        listen(components) {
            this.event.add('renderEvent', () => {
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
            return !!this.event.taskExist(name);
        }
        add(taskName, taskCallback) {
            this.event.add(taskName, taskCallback);
            return this;
        }
        once(callback) {
            this.event.addOnceAsync(CanvasRender.ONCE_TASK_PREFIX + this.date.getTime(), callback);
            return this;
        }
        markEnd(callback) {
            this.event.markEnd(callback);
        }
        overwriteTask(taskName, taskCallback) {
            this.event.overwriteTask(taskName, taskCallback);
            return this;
        }
        addTop(taskName, taskCallback) {
            this.event.add(taskName, taskCallback, true);
            return this;
        }
        remove(name) {
            this.event.removeAll(name);
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
                // this.taskName.forEach(item => {
                //     this.task[item](this.delta, this.renderCount, this)
                // });
                this.event.triggerAll([this.delta, this.renderCount, this]);
                // this.onceTaskList = this.onceTaskList.filter(callback => {
                //     // console.log(callback.__status__);
                //     return callback.__status__ != CanvasRender.REMOVE;
                // })
                // this.onceTaskList.forEach(callback => {
                //     callback(this.delta, this.renderCount, this);
                // });
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
    exports.CanvasRender = CanvasRender;
});
