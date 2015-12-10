/**
 * This module exports various helper routines that might be handy in a game context but which don't
 * otherwise fit into a class.
 */
module nurdz.game.Utils
{
    /**
     * Return a random floating point number in the range of min to max, inclusive.
     *
     * @param min the minimum number to return, inclusive
     * @param max the maximum number to return, inclusive
     *
     * @returns {number} a random number somewhere in the range of min and max, inclusive
     */
    export function randomFloatInRange (min : number, max : number) : number
    {
        return Math.random () * (max - min) + min;
    }

    /**
     * Return a random integer number in the range of min to max, inclusive.
     *
     * @param min the minimum number to return, inclusive
     * @param max the maximum number to return, inclusive
     *
     * @returns {number} a random number somewhere in the range of min and max, inclusive
     */
    export function randomIntInRange (min : number, max : number) : number
    {
        return Math.floor (Math.random () * (max - min + 1)) + min;
    }

    /**
     * Convert an angle in degrees to an angle in radians. Internally, the JavaScript math API assumes
     * radians, but in games we may want to use degrees as a simplification.
     *
     * @param degrees an angle in degrees to convert
     * @returns {number} the number of degrees, converted into radians.
     */
    export function toRadians (degrees : number) : number
    {
        return degrees * Math.PI / 180;
    }

    /**
     * Convert an angle in radians to an angle in degrees. Internally, the JavaScript math API assumes
     * radians, but in games we may want to use degrees as a simplification.
     *
     * @param radians an angle in radians to convert
     * @returns {number} the number of radians, converted into degrees.
     */
    export function toDegrees (radians : number) : number
    {
        return radians * 180 / Math.PI;
    }

    /**
     * Given some angle in degrees, normalize it so that it falls within the range of 0 <-> 359 degrees,
     * inclusive (i.e. 360 degrees becomes 0 and -1 degrees becomes 359, etc).
     *
     * @param degrees the angle in degrees to normalize
     * @returns {number} the normalized angle; it is always in the range of 0 to 359 degrees, inclusive
     */
    export function normalizeDegrees (degrees : number) : number
    {
        degrees %= 360;
        if (degrees < 0)
            degrees += 360;
        return degrees % 360;
    }
}
