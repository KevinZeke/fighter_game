define(["require", "exports", "../utils/utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EventListenTask {
        constructor() {
            this.task = {};
            this.onceTaskList = [];
            this.taskName = [];
        }
        getTaskName() {
            return utils_1.arrayCopy(this.taskName);
        }
        taskExist(task) {
            return !!this.task[task];
        }
        add(taskName, taskCallback, isTaskTop = false) {
            if (this.taskExist(taskName)) {
                if (this.task[taskName].indexOf(taskCallback) == -1)
                    this.task[taskName].push(taskCallback);
                return this;
            }
            this.task[taskName] = [taskCallback];
            isTaskTop ? this.taskName.unshift(taskName) : this.taskName.push(taskName);
            return this;
        }
        addOnce(taskName, taskCallback) {
            taskCallback[EventListenTask.TASK_STATUS_PROPERTY_NAME] = EventListenTask.REMOVE;
            return this.add(taskName, taskCallback);
        }
        addOnceAsync(name, callback) {
            callback[EventListenTask.TASK_STATUS_PROPERTY_NAME] = EventListenTask.RENDERING;
            this.add(name, callback);
            return this;
        }
        markEnd(callback) {
            callback[EventListenTask.TASK_STATUS_PROPERTY_NAME] = EventListenTask.REMOVE;
        }
        overwriteTask(taskName, taskCallback) {
            if (this.taskExist(taskName)) {
                this.task[taskName] = [taskCallback];
            }
            else {
                this.add(taskName, taskCallback);
            }
            return this;
        }
        remove(name, func) {
            if (this.taskExist(name)) {
                this.task[name] = this.task[name].filter((callback) => {
                    return callback != func;
                });
            }
            return this;
        }
        removeAll(name) {
            if (this.task[name]) {
                this.taskName.splice(this.taskName.indexOf(name), 1);
                delete this.task[name];
            }
            return this;
        }
        trigger(name, args = []) {
            if (this.taskExist(name)) {
                this.checkAliveTask(name);
                this.task[name].forEach((callback) => {
                    callback(...args);
                });
            }
        }
        checkAliveTask(taskName) {
            this.task[taskName] = this.task[taskName].filter((callback) => {
                return callback[EventListenTask.TASK_STATUS_PROPERTY_NAME] != EventListenTask.REMOVE;
            });
        }
        triggerAll(args = []) {
            this.taskName.forEach(name => {
                this.trigger(name, args);
            });
        }
        triggerOnce(name, args) {
            this.trigger(name, args);
            this.removeAll(name);
        }
    }
    EventListenTask.ONCE_TASK_PREFIX = '$once_';
    EventListenTask.TASK_STATUS_PROPERTY_NAME = '__status__';
    EventListenTask.RENDERING = 1;
    EventListenTask.REMOVE = -1;
    exports.EventListenTask = EventListenTask;
});
