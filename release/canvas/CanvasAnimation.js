define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /***
     * 机体摧毁动画
     * @param {Component} componet
     * @param {CanvasRenderingContext2D} ctx2d
     * @returns {(delta: number, deltaCount: number, render: CanvasRender) => void}
     */
    let desImg = [];
    for (let i = 0; i < 4; i++) {
        let img = new Image();
        img.src = `../image/resource/bomb_${i}.png`;
        desImg.push(img);
    }
    function fighterBoom(componet, ctx2d) {
        let idx = 0, frequency = 5;
        function drawBoomMain(delta, deltaCount, render) {
            ctx2d.drawImage(desImg[idx], componet.position.left, componet.position.top, componet.width, componet.height);
            if (render.renderFrequency(frequency)) {
                idx++;
                if (idx > desImg.length - 1)
                    render.markEnd(drawBoomMain);
            }
        }
        return drawBoomMain;
    }
    exports.fighterBoom = fighterBoom;
});
