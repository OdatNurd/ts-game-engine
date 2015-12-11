module nurdz.game
{
    /**
     * The aspects of the engine that deal with tiles instead of pixels assume that this is the size of
     * tiles (in pixels). Tiles are assumed to be square.
     *
     * @const
     * @type {number}
     */
    export const TILE_SIZE : number = 32;

    /**
     * The width of the game stage (canvas) in pixels.
     *
     * @const
     * @type {number}
     */
    export const STAGE_WIDTH : number = 800;

    /**
     * The height of the game stage (canvas) in pixels.
     *
     * @const
     * @type {number}
     */
    export const STAGE_HEIGHT : number = 600;

    /**
     * The width of the game stage (canvas), in tiles.
     *
     * @const
     * @type {Number}
     */
    export const STAGE_TILE_WIDTH : number = Math.floor (STAGE_WIDTH / TILE_SIZE);

    /**
     * The height of the game stage (canvas), in tiles.
     *
     * @const
     * @type {Number}
     */
    export const STAGE_TILE_HEIGHT = Math.floor (STAGE_HEIGHT / TILE_SIZE);

    /**
     * This enumeration contains key code constants for use in keyboard events. Not all useful keys are
     * implemented here just yet. Add as required.
     */
    export enum KeyCodes
    {
        KEY_ENTER = 13,
        KEY_SPACEBAR = 32,

        // Arrow keys
        KEY_LEFT = 37,
        KEY_UP,
        KEY_RIGHT,
        KEY_DOWN,

        // Number keys
        KEY_0 = 48,
        KEY_1,
        KEY_2,
        KEY_3,
        KEY_4,
        KEY_5,
        KEY_6,
        KEY_7,
        KEY_8,
        KEY_9,

        // Alpha keys; these are all a single case because shift state is tracked separately.
        KEY_A = 65,
        KEY_B,
        KEY_C,
        KEY_D,
        KEY_E,
        KEY_F,
        KEY_G,
        KEY_H,
        KEY_I,
        KEY_J,
        KEY_K,
        KEY_L,
        KEY_M,
        KEY_N,
        KEY_O,
        KEY_P,
        KEY_Q,
        KEY_R,
        KEY_S,
        KEY_T,
        KEY_U,
        KEY_V,
        KEY_W,
        KEY_X,
        KEY_Y,
        KEY_Z,

        // Function keys
        KEY_F1 = 112,
        KEY_F2,
        KEY_F3,
        KEY_F4,
        KEY_F5,
        KEY_F6,
        KEY_F7,
        KEY_F8,
        KEY_F9,
        KEY_F10,
        KEY_F11,
        KEY_F12
    }
}
