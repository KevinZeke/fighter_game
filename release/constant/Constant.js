define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Constant {
        constructor() {
        }
        static reverseKeyCode(keyCode) {
            if (keyCode + 2 > 40) {
                return keyCode - 2;
            }
            else {
                return keyCode + 2;
            }
        }
    }
    Constant.BATTLE_GROUND_ID = '$canvas-battle-ground';
    Constant.BG_ID = '$canvas-bg-ground';
    Constant.CANVAS_WRAP_CLASS = '.container';
    Constant.CANVAS_BG_IMG_PATH = '../image/sky2.jpeg';
    Constant.KEY_UP = 38;
    Constant.KEY_DOWN = 40;
    Constant.KEY_LEFY = 37;
    Constant.KEY_RIGHT = 39;
    exports.Constant = Constant;
    class ComponentConstant {
        constructor() {
        }
    }
    ComponentConstant.DIRECTION_UP = -1;
    ComponentConstant.DIRECTION_DOWN = 1;
    ComponentConstant.DEFAULT_MOVE_SPEED = 1;
    ComponentConstant.TYPE_NORMAL_COMPONENT = 3;
    exports.ComponentConstant = ComponentConstant;
    class CloudConstant {
    }
    CloudConstant.IMG_PATH = '../image/cloud/cloud2.png';
    exports.CloudConstant = CloudConstant;
    class BulletConstant {
        constructor() {
        }
    }
    BulletConstant.HERO_IMG_PATH = '../image/bullet.png';
    BulletConstant.ENEMY_IMG_PATH = '../image/bullet2.png';
    BulletConstant.NORMAL_WIDTH = 5;
    BulletConstant.NORMAL_HEIGHT = 5;
    exports.BulletConstant = BulletConstant;
    class FighterConstant {
        constructor() {
        }
    }
    FighterConstant.HERO_DEFAULT_HEALTH = 100;
    FighterConstant.ENEMY_DEFAULT_HEALTH = 20;
    FighterConstant.BOSS_DEFAULT_HEALTH = 250;
    FighterConstant.TYPE_HERO = 1;
    FighterConstant.TYPE_ENEMY = 2;
    FighterConstant.TYPE_BOSS = 4;
    FighterConstant.HERO_IMG_PATH = '../image/falcon.png';
    FighterConstant.ENEMY_IMG_PATH = '../image/boos.png';
    FighterConstant.DEATHSTAR_IMG_PATH = '../image/deathStar.png';
    FighterConstant.HERO_DEFAULT_SPEED = 2;
    FighterConstant.ENEMY_DEFAULT_SPEED = 1;
    FighterConstant.WIDTH = 50;
    FighterConstant.HEIGHT = 50;
    exports.FighterConstant = FighterConstant;
});
