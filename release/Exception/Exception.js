define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ComponentException;
    (function (ComponentException) {
        class FighterAutoMoveException extends Error {
            constructor(pos) {
                super(`当未设置跟随目标或者设置跟随目标${pos}轴不跟随时，需要设置机体的${pos}移动范围, 参考格式 ：(..., {${pos}:[0,100]})`);
            }
        }
        ComponentException.FighterAutoMoveException = FighterAutoMoveException;
        class FollowObjectNotFound extends Error {
            constructor() {
                super("当前机体自动跟随目标未定义");
            }
        }
        ComponentException.FollowObjectNotFound = FollowObjectNotFound;
    })(ComponentException = exports.ComponentException || (exports.ComponentException = {}));
});
