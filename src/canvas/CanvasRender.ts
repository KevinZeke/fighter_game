import {Component} from "../component/Component";
import {rateRandom} from "../utils/utils";
import {EventListenTask} from "../component/EventListenTask";

export interface RenderEvent {
    onRender(delta: number, renderCount: number, canvasRneder: CanvasRender);
}

export class CanvasRender {

    public static MAX_RENDER_COUNT: number = 65535;

    public static ONCE_TASK_PREFIX = '$once_';

    private event: EventListenTask = new EventListenTask();

    private timer: number | null = null;

    private delta: number = 0;

    private date: Date = new Date();

    private renderCount: number = 0;

    //TODO
    private listeners = [];

    public getTaskName() {
        return this.event.getTaskName();
    }

    public shutdown(): CanvasRender {
        cancelAnimationFrame(this.timer);
        return this;
    }

    public listen(components: Array<RenderEvent>): CanvasRender {
        this.event.add('renderEvent', () => {
            components.forEach(component => {
                component.onRender(this.delta, this.renderCount, this);
            });
        });
        return this;
    }

    public open(callback?: Function): CanvasRender {
        this.animation(callback);
        return this;
    }

    public taskExist(name: string): boolean {
        return !!this.event.taskExist(name);
    }

    public add(taskName: string, taskCallback: Function): CanvasRender {
        this.event.add(taskName, taskCallback);
        return this;
    }

    public once(callback): CanvasRender {
        this.event.addOnceAsync(CanvasRender.ONCE_TASK_PREFIX + this.date.getTime(), callback)
        return this;
    }

    public markEnd(callback): void {
        this.event.markEnd(callback);
    }

    public overwriteTask(taskName: string, taskCallback: Function): CanvasRender {
        this.event.overwriteTask(taskName, taskCallback);
        return this;
    }

    public addTop(taskName: string, taskCallback: Function): CanvasRender {
        this.event.add(taskName, taskCallback, true);
        return this;
    }

    public remove(name: string): CanvasRender {
        this.event.removeAll(name);
        return this;
    }

    public loop(loopConfig: { name: string, test: Function, yes: Function, no: Function }): CanvasRender {
        this.add(loopConfig.name, (delta: number, renderCount: number, render: CanvasRender) => {
            if (loopConfig.test(delta, renderCount, render)) {
                loopConfig.yes(delta, renderCount, render);
            } else {
                loopConfig.no(delta, renderCount, render);
            }
        })
        return this;
    }

    private animation(callback?: Function): CanvasRender {
        this.timer = requestAnimationFrame(() => {
            this.refreashRenderInfo();
            callback && callback(this.delta, this.renderCount, this);
            // this.taskName.forEach(item => {
            //     this.task[item](this.delta, this.renderCount, this)
            // });
            this.event.triggerAll([this.delta, this.renderCount, this])
            // this.onceTaskList = this.onceTaskList.filter(callback => {
            //     // console.log(callback.__status__);
            //     return callback.__status__ != CanvasRender.REMOVE;
            // })
            // this.onceTaskList.forEach(callback => {
            //     callback(this.delta, this.renderCount, this);
            // });
            // console.log(this.onceTaskList);
            this.animation(callback);
        })
        return this;
    }

    private refreashRenderInfo(): void {
        this.renderCount++;
        if (this.renderCount > CanvasRender.MAX_RENDER_COUNT) this.renderCount = 0;
        let date = new Date();
        this.delta = date.getTime() - this.date.getTime();
        this.date = date;
    }

    public renderFrequency(frequency: number) {
        return (this.renderCount % frequency == 0);
    }
}