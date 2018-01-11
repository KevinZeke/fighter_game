export class Constant {
    public static readonly BATTLE_GROUND_ID: string = '$canvas-battle-ground';

    public static readonly BG_ID = '$canvas-bg-ground'

    public static readonly CANVAS_WRAP_CLASS: string = '.container';

    public static readonly CANVAS_BG_IMG_PATH:string = '../image/sky2.jpeg';

    public static readonly KEY_UP = 38;

    public static readonly KEY_DOWN = 40;

    public static readonly KEY_LEFY = 37;

    public static readonly KEY_RIGHT = 39;

    public static reverseKeyCode(keyCode: number): number {
        if (keyCode + 2 > 40) {
            return keyCode - 2;
        } else {
            return keyCode + 2;
        }
    }

    private constructor() {
    }
}

export class ComponentConstant {

    public static readonly DIRECTION_UP = -1;

    public static readonly DIRECTION_DOWN = 1;

    public static readonly DEFAULT_MOVE_SPEED = 1;

    public static readonly TYPE_NORMAL_COMPONENT = 3;

    private constructor() {
    }


}

export class CloudConstant {
    public static readonly IMG_PATH = '../image/cloud/cloud2.png'
}

export class BulletConstant {
    public static readonly HERO_IMG_PATH = '../image/bullet.png';

    public static readonly ENEMY_IMG_PATH = '../image/bullet2.png';


    public static readonly NORMAL_WIDTH = 5;

    public static readonly NORMAL_HEIGHT = 5;

    private constructor() {
    }
}

export class FighterConstant {

    public static readonly HERO_DEFAULT_HEALTH = 100;

    public static readonly ENEMY_DEFAULT_HEALTH = 20;

    public static readonly BOSS_DEFAULT_HEALTH = 250;

    public static readonly TYPE_HERO = 1;

    public static readonly TYPE_ENEMY = 2;

    public static readonly TYPE_BOSS = 4;

    public static readonly HERO_IMG_PATH = '../image/falcon.png';

    public static readonly ENEMY_IMG_PATH = '../image/boos.png';

    public static readonly DEATHSTAR_IMG_PATH = '../image/deathStar.png';

    public static readonly HERO_DEFAULT_SPEED = 2;

    public static readonly ENEMY_DEFAULT_SPEED = 1;

    public static readonly WIDTH = 50;

    public static readonly HEIGHT = 50;

    private constructor() {
    }

}