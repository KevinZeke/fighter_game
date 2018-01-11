import {arrayCopy} from "../utils/utils";

export interface Listenable {
    /**
     * 添加该组件的事件监听
     * @param {string} eventName
     * @param {Function} callback
     */
    on(eventName: string, callback: Function);

    /**
     * 移除该组件的事件监听
     * @param {string} eventName
     * @param {Function} callback
     */
    unbind(eventName: string, callback: Function);

    /**
     * 触发事件
     * @param eventName
     */
    triggle(eventName: string, args?: Array<any>);
}

export class EventListenTask {

    public static ONCE_TASK_PREFIX = '$once_';

    public static TASK_STATUS_PROPERTY_NAME = '__status__';

    public static RENDERING = 1;

    public static REMOVE = -1;

    private task: {} = {};

    private onceTaskList = [];

    private taskName: Array<string> = [];

    public getTaskName(): Array<string> {
        return arrayCopy(this.taskName);
    }

    public taskExist(task: string): boolean {
        return !!this.task[task];
    }

    public add(taskName: string, taskCallback: Function, isTaskTop: boolean = false): EventListenTask {
        if (this.taskExist(taskName)) {
            if (this.task[taskName].indexOf(taskCallback) == -1)
                this.task[taskName].push(taskCallback);
            return this;
        }
        this.task[taskName] = [taskCallback];
        isTaskTop ? this.taskName.unshift(taskName) : this.taskName.push(taskName);
        return this;
    }

    public addOnce(taskName: string, taskCallback: Function): EventListenTask {
        taskCallback[EventListenTask.TASK_STATUS_PROPERTY_NAME] = EventListenTask.REMOVE;
        return this.add(taskName, taskCallback);
    }

    public addOnceAsync(name, callback): EventListenTask {
        callback[EventListenTask.TASK_STATUS_PROPERTY_NAME] = EventListenTask.RENDERING;
        this.add(name, callback);
        return this;
    }

    public markEnd(callback): void {
        callback[EventListenTask.TASK_STATUS_PROPERTY_NAME] = EventListenTask.REMOVE;
    }

    public overwriteTask(taskName: string, taskCallback: Function): EventListenTask {
        if (this.taskExist(taskName)) {
            this.task[taskName] = [taskCallback];
        } else {
            this.add(taskName, taskCallback);
        }
        return this;
    }

    public remove(name: string, func: Function): EventListenTask {
        if (this.taskExist(name)) {
            this.task[name] = this.task[name].filter((callback) => {
                return callback != func;
            })
        }
        return this;
    }

    public removeAll(name: string): EventListenTask {
        if (this.task[name]) {
            this.taskName.splice(this.taskName.indexOf(name), 1);
            delete this.task[name];
        }
        return this;
    }

    public trigger(name: string, args: Array<any> = []) {
        if (this.taskExist(name)) {
            this.checkAliveTask(name);
            this.task[name].forEach((callback) => {
                callback(...args);
            });

        }
    }

    private checkAliveTask(taskName: string) {
        this.task[taskName] = this.task[taskName].filter((callback) => {
            return callback[EventListenTask.TASK_STATUS_PROPERTY_NAME] != EventListenTask.REMOVE
        })
    }

    public triggerAll(args: Array<any> = []) {
        this.taskName.forEach(name => {
            this.trigger(name, args);
        })
    }

    public triggerOnce(name, args: Array<any>) {
        this.trigger(name, args);
        this.removeAll(name);
    }
}