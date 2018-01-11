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
        add(taskName, taskCallback) {
            if (this.taskExist(taskName)) {
                console.log(`任务队列中${taskName}任务已经存在`);
                return this;
            }
            ;
            this.taskName.push(taskName);
            this.task[taskName] = taskCallback;
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
            // console.log(callback[EventListenTask.TASK_STATUS_PROPERTY_NAME]);
            callback[EventListenTask.TASK_STATUS_PROPERTY_NAME] = EventListenTask.REMOVE;
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
        trigger(name, args = []) {
            if (this.taskExist(name)) {
                if (this.task[name][EventListenTask.TASK_STATUS_PROPERTY_NAME] == EventListenTask.REMOVE) {
                    this.remove(name);
                }
                else {
                    this.task[name](...args);
                }
            }
        }
        triggerAll(args = []) {
            this.taskName.forEach(name => {
                this.trigger(name, args);
            });
        }
        triggerOnce(name, args) {
            this.task[name](...args);
            this.remove(name);
        }
    }
    EventListenTask.ONCE_TASK_PREFIX = '$once_';
    EventListenTask.TASK_STATUS_PROPERTY_NAME = '__status__';
    EventListenTask.RENDERING = 1;
    EventListenTask.REMOVE = -1;
    exports.EventListenTask = EventListenTask;
});
