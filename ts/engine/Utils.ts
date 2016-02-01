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

    /**
     * Create and return an array that contains all numbers in the requested range, inclusive, using the
     * provided step.
     *
     * This works with both a positive and negative step, although if you pass a negative step you need to
     * pass from and to in the opposite order.
     *
     * @param from the starting value of the range
     * @param to the ending value of the range
     * @param step the step to go by
     * @returns {Array} the array with the generated values
     */
    export function createRange (from : number, to : number, step : number = 1) : Array<number>
    {
        let retVal = [];

        if (step > 0)
        {
            for (let i = from ; i <= to ; i += step)
                retVal.push (i);
        }
        else if (step < 0)
        {
            for (let i = from ; i >= to ; i += step)
                retVal.push (i);
        }
        return retVal;
    }

    /**
     * Determine if a numeric value falls inside of a certain range, with the endpoints being inclusive.
     * This is smart enough to allow for the min and max to be "reversed", such that min is larger than
     * max (for example, if the values are negative).
     *
     * @param value the value to compare
     * @param min the lower end of the range to check
     * @param max the higher end of the range to check
     * @returns {boolean} true if the value falls within the range given, or false otherwise
     */
    export function numberInRange (value : number, min : number, max : number) : boolean
    {
        // Ensure that the value falls within the range, even if the values provided are in the wrong order.
        return value >= Math.min (min, max) && value <= Math.max (min, max);
    }

    /**
     * Take a value and a range of numbers and clamp the value so that it fits into the range; when the
     * value falls outside of the range, the value becomes the respective range endpoint.
     *
     * @param value the value to clamp
     * @param min the minimum acceptable value
     * @param max the maximum acceptable value
     * @returns {number} the clamped value, which is either the value directly, min or max, depending on
     * the value.
     */
    export function clampToRange (value : number, min : number, max : number) : number
    {
        // This does the following:
        //   1) Find the smaller of the two values given as the range
        //   2) Find the larger of the value and the result from step #1
        //   3) Find the larger of the two values given as the range
        //   4) Find the smaller of the numbers from step 2 and 4 and return that
        //
        // This code appears semi-complicated because it allows for min and max to be passed in the wrong
        // order and still work.
        return Math.min (Math.max (value, Math.min (min, max)), Math.max (min, max));
    }

    /**
     * Given two ranges of numbers that range from min to max inclusive, determine if those two ranges
     * overlap each other.
     *
     * @param min1 the minimum value of the first range
     * @param max1 the maximum value of the first range
     * @param min2 the minimum value of the second range
     * @param max2 the maximum value of the second range
     * @returns {boolean} true if the two ranges intersect, or false if they don't.
     */
    export function rangeInRange (min1 : number, max1 : number, min2 : number, max2 : number) : boolean
    {
        // For the ranges to intersect each other, the largest value in the first range has to be larger
        // than the smallest value in the second range AND the smallest value in the first range needs to
        // be smaller than the larger value in the second range.
        return Math.max (min1, max1) >= Math.min (min2, max2) &&
            Math.min (min1, max1) <= Math.max (min2, max2);
    }

    /**
     * Calculate the distance between the two points provided.
     *
     * @param point1 the first point
     * @param point2 the second point
     * @returns {number} the distance between the two points
     */
    export function distanceBetween (point1 : Point, point2 : Point) : number
    {
        // Use the other function
        return this.distanceBetweenXY (point1.x, point1.y, point2.x, point2.y);
    }

    /**
     * Calculate the distance between the two points provided.
     *
     * @param x1 X coordinate of first point
     * @param y1 Y coordinate of first point
     * @param x2 X coordinate of second point
     * @param y2 Y coordinate of second point
     * @returns {number} the distance between the two points
     */
    export function distanceBetweenXY (x1 : number, y1 : number, x2 : number, y2 : number) : number
    {
        // Get the delta values between the two points.
        let dX = x2 - x1;
        let dY = y2 - y1;

        // Do that thing we all know what it does.
        return Math.sqrt ((dX * dX) + (dY * dY));
    }
}
