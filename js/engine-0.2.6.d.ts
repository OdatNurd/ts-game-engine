/**
 * This little bit of trickery causes the TypeScript compiler to blend this interface with the one that it
 * ships with (in lib.d.ts) which describes the String constructor (the String static object).\
 *
 * This allows us to cram some extra static methods onto the class object.
 */
interface StringConstructor {
    format(formatString: string, ...params: any[]): string;
}
/**
 * As above, this allows us to cram a new extra static method into the Math namespace. Here these items
 * aren't included in TypeScript by default, which I think is because they're not standard enough or
 * something.
 */
interface Math {
    sign(x: number): number;
}
declare module nurdz {
    /**
     * In a browser non-specific way, watch to determine when the DOM is fully loaded and then invoke
     * the function that is provided.
     *
     * This code was written by Diego Perini (diego.perini at gmail.com) and was taken from the
     * following URL:
     *     http://javascript.nwbox.com/ContentLoaded/
     *
     * @param win reference to the browser window object
     * @param fn the function to invoke when the DOM is ready.
     */
    function contentLoaded(win: Window, fn: Function): void;
}
declare module nurdz.game {
    /**
     * The aspects of the engine that deal with tiles instead of pixels assume that this is the size of
     * tiles (in pixels). Tiles are assumed to be square.
     *
     * @const
     * @type {number}
     */
    const TILE_SIZE: number;
    /**
     * The width of the game stage (canvas) in pixels.
     *
     * @const
     * @type {number}
     */
    const STAGE_WIDTH: number;
    /**
     * The height of the game stage (canvas) in pixels.
     *
     * @const
     * @type {number}
     */
    const STAGE_HEIGHT: number;
    /**
     * The width of the game stage (canvas), in tiles.
     *
     * @const
     * @type {Number}
     */
    const STAGE_TILE_WIDTH: number;
    /**
     * The height of the game stage (canvas), in tiles.
     *
     * @const
     * @type {Number}
     */
    const STAGE_TILE_HEIGHT: number;
    /**
     * This enumeration contains key code constants for use in keyboard events. Not all useful keys are
     * implemented here just yet. Add as required.
     */
    enum KeyCodes {
        KEY_ENTER = 13,
        KEY_SPACEBAR = 32,
        KEY_LEFT = 37,
        KEY_UP = 38,
        KEY_RIGHT = 39,
        KEY_DOWN = 40,
        KEY_0 = 48,
        KEY_1 = 49,
        KEY_2 = 50,
        KEY_3 = 51,
        KEY_4 = 52,
        KEY_5 = 53,
        KEY_6 = 54,
        KEY_7 = 55,
        KEY_8 = 56,
        KEY_9 = 57,
        KEY_A = 65,
        KEY_B = 66,
        KEY_C = 67,
        KEY_D = 68,
        KEY_E = 69,
        KEY_F = 70,
        KEY_G = 71,
        KEY_H = 72,
        KEY_I = 73,
        KEY_J = 74,
        KEY_K = 75,
        KEY_L = 76,
        KEY_M = 77,
        KEY_N = 78,
        KEY_O = 79,
        KEY_P = 80,
        KEY_Q = 81,
        KEY_R = 82,
        KEY_S = 83,
        KEY_T = 84,
        KEY_U = 85,
        KEY_V = 86,
        KEY_W = 87,
        KEY_X = 88,
        KEY_Y = 89,
        KEY_Z = 90,
        KEY_F1 = 112,
        KEY_F2 = 113,
        KEY_F3 = 114,
        KEY_F4 = 115,
        KEY_F5 = 116,
        KEY_F6 = 117,
        KEY_F7 = 118,
        KEY_F8 = 119,
        KEY_F9 = 120,
        KEY_F10 = 121,
        KEY_F11 = 122,
        KEY_F12 = 123,
    }
}
declare module nurdz.game.Preloader {
    /**
     * The type of a callback function to invoke when all images and sound loading is complete. The
     * function takes no arguments and returns no value.
     */
    type DataPreloadCallback = () => void;
    /**
     * The type of a callback function to invoke when an image preload is completed. The function is passed as
     * an argument the handle to the loaded image element and returns no value.
     */
    type ImagePreloadCallback = (HTMLImageElement) => void;
    /**
     * The type of a callback function to invoke when a sound preload is completed. The function is passed as
     * an argument the handle to the loaded audio element and returns no value.
     */
    type SoundPreloadCallback = (Sound) => void;
    /**
     * Add the image filename specified to the list of images that will be preloaded. The "filename" is
     * assumed to be a path that is relative to the page that the game is being served from and inside of
     * an "images/" sub-folder.
     *
     * The (optional) callback function can be provided to let you know when the image is finally finished
     * loading, in case you need that information (e.g. for getting the dimensions). The callback is
     * guaranteed to be invoked before the callback that indicates that all preloads have completed.
     *
     * The return value is an image tag that can be used to render the image once it is loaded.
     *
     * @param filename the filename of the image to load; assumed to be relative to a images/ folder in
     * the same path as the page is in.
     * @param callback if non-null, this will be invoked when the image is fully loaded.
     * @returns {HTMLImageElement} the tag that the image will be loaded into.
     * @throws {Error} if an attempt is made to add an image to preload after preloading has already started
     */
    function addImage(filename: string, callback?: ImagePreloadCallback): HTMLImageElement;
    /**
     * Add the sound filename specified to the list of sounds that will be preloaded. The "filename" is
     * assumed to be in a path that is relative to the page that the game is being served from an inside
     * of a "sounds/" sub-folder.
     *
     * NOTE: Since different browsers support different file formats, you should provide both an MP3 and
     * an OGG version of the same file, and provide a filename that has no extension on it. The code in
     * this method will apply the correct extension based on the browser in use and load the appropriate
     * file.
     *
     * The (optional) callback function can be provided to let you know when the browser thinks that
     * enough of the file has loaded that playing would play right through. The callback is guaranteed to be
     * invoked before the callback that indicates that all preloads have completed.
     *
     * The return value is a sound object that can be used to play the sound once it's loaded.
     *
     * @param filename the filename of the sound to load; assumed to be relative to a sounds/ folder in
     * the same path as the page is in and to have no extension
     * @param callback if non-null, this will be invoked with the sound object when the load is finished.
     * @returns {Sound} the sound object that will (eventually) play the requested audio
     * @throws {Error} if an attempt is made to add a sound to preload after preloading has already started
     * @see addMusic
     */
    function addSound(filename: string, callback?: SoundPreloadCallback): Sound;
    /**
     * Add the music filename specified to the list of music that will be preloaded. The "filename" is
     * assumed to be in a path that is relative to the page that the game is being served from an inside
     * of a "music/" sub-folder.
     *
     * NOTE: Since different browsers support different file formats, you should provide both an MP3 and
     * an OGG version of the same file, and provide a filename that has no extension on it. The code in
     * this method will apply the correct extension based on the browser in use and load the appropriate file.
     *
     * The (optional) callback function can be provided to let you know when the browser thinks that
     * enough of the file has loaded that playing would play right through. The callback is guaranteed to be
     * invoked before the callback that indicates that all preloads have completed.
     *
     * This works identically to addSound() except that the sound returned is set to play looped by
     * default.
     *
     * @param filename the filename of the sound to load; assumed to be relative to a sounds/ folder in
     * the same path as the page is in and to have no extension
     * @param callback if non-null, this will be invoked with the sound object when the load is finished.
     * @returns {Sound} the sound object that will (eventually) play the requested audio
     * @throws {Error} if an attempt is made to add a sound to preload after preloading has already started
     * @see addSound
     */
    function addMusic(filename: string, callback?: SoundPreloadCallback): Sound;
    /**
     * Start the file preloads happening. Once all images and sound/music files requested are fully
     * loaded, the callback function provided will be invoked, which means that everything is ready to go.
     *
     * The preloader handles errors by logging them to the console and replacing the failed file with a
     * placeholder, either an image or a sound, which is embedded in the source and is guaranteed to work.
     *
     * If a stage is provided, the preloader will output the number of things still to preload to the
     * center of the stage, just so that you know that it's doing something.
     *
     * @param callback the callback to invoke when all of the preloading is completed
     * @param stage the stage that is hosting the game (optional).
     *
     * @throws {Error} if image preloading is already started
     */
    function commence(callback: DataPreloadCallback, stage?: Stage): void;
}
/**
 * This module exports various helper routines that might be handy in a game context but which don't
 * otherwise fit into a class.
 */
declare module nurdz.game.Utils {
    /**
     * Return a random floating point number in the range of min to max, inclusive.
     *
     * @param min the minimum number to return, inclusive
     * @param max the maximum number to return, inclusive
     *
     * @returns {number} a random number somewhere in the range of min and max, inclusive
     */
    function randomFloatInRange(min: number, max: number): number;
    /**
     * Return a random integer number in the range of min to max, inclusive.
     *
     * @param min the minimum number to return, inclusive
     * @param max the maximum number to return, inclusive
     *
     * @returns {number} a random number somewhere in the range of min and max, inclusive
     */
    function randomIntInRange(min: number, max: number): number;
    /**
     * Convert an angle in degrees to an angle in radians. Internally, the JavaScript math API assumes
     * radians, but in games we may want to use degrees as a simplification.
     *
     * @param degrees an angle in degrees to convert
     * @returns {number} the number of degrees, converted into radians.
     */
    function toRadians(degrees: number): number;
    /**
     * Convert an angle in radians to an angle in degrees. Internally, the JavaScript math API assumes
     * radians, but in games we may want to use degrees as a simplification.
     *
     * @param radians an angle in radians to convert
     * @returns {number} the number of radians, converted into degrees.
     */
    function toDegrees(radians: number): number;
    /**
     * Given some angle in degrees, normalize it so that it falls within the range of 0 <-> 359 degrees,
     * inclusive (i.e. 360 degrees becomes 0 and -1 degrees becomes 359, etc).
     *
     * @param degrees the angle in degrees to normalize
     * @returns {number} the normalized angle; it is always in the range of 0 to 359 degrees, inclusive
     */
    function normalizeDegrees(degrees: number): number;
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
    function createRange(from: number, to: number, step?: number): Array<number>;
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
    function numberInRange(value: number, min: number, max: number): boolean;
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
    function clampToRange(value: number, min: number, max: number): number;
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
    function rangeInRange(min1: number, max1: number, min2: number, max2: number): boolean;
    /**
     * Calculate the distance between the two points provided.
     *
     * @param point1 the first point
     * @param point2 the second point
     * @returns {number} the distance between the two points
     */
    function distanceBetween(point1: Point, point2: Point): number;
    /**
     * Calculate the square of the distance between the two points provided.
     *
     * @param point1 the first point
     * @param point2 the second point
     * @returns {number} the square of the distance between the two points
     */
    function distanceSquaredBetween(point1: Point, point2: Point): number;
    /**
     * Calculate the distance between the two points provided.
     *
     * @param x1 X coordinate of first point
     * @param y1 Y coordinate of first point
     * @param x2 X coordinate of second point
     * @param y2 Y coordinate of second point
     * @returns {number} the distance between the two points
     */
    function distanceBetweenXY(x1: number, y1: number, x2: number, y2: number): number;
    /**
     * Calculate the square of the distance between the two points provided.
     *
     * @param x1 X coordinate of first point
     * @param y1 Y coordinate of first point
     * @param x2 X coordinate of second point
     * @param y2 Y coordinate of second point
     * @returns {number} the square of the distance between the two points
     */
    function distanceSquaredBetweenXY(x1: number, y1: number, x2: number, y2: number): number;
    /**
     * Normalize the value passed in for the range provided, returning the normalized value. The value is
     * normalized such that when value == min, 0 is returned and when value == max, max is returned.
     *
     * The value itself can fall outside of the range, in which case it will be smaller than 0 or larger
     * than 1 using the same linear range.
     *
     * @param value the value to normalize
     * @param min the minimum value in the range
     * @param max the maximum value in the range
     * @returns {number} the normalized value, which is between 0.0 and 1.0 assuming that the value falls
     * within the range or its endpoints.
     */
    function normalize(value: number, min: number, max: number): number;
    /**
     * Do a linear interpolation for the normalized value into the range given. The returned value will be
     * min when normal == 0 or max when normal == 1.
     *
     * The normalized value can fall outside of the range of min to max, in which case it will be smaller
     * than min or larger than max using the same linear range.
     *
     * @param normal the normalized value (usually 0.0 to 1.0 inclusive)
     * @param min the minimum value in the range
     * @param max the maximum value in the range
     * @returns {number} an interpolation of the value between the ranged endpoints
     */
    function linearInterpolate(normal: number, min: number, max: number): number;
}
declare module nurdz.game {
    /**
     * This class represents a single point as a pair of X,Y coordinates. This also includes simple operations
     * such as setting and clamping of values, as well as making copies and comparisons.
     *
     * Most API functions provided come in a variety that takes an X,Y and one that takes another point,
     * so that calling code can use whatever it most appropriate for the situation without having to box
     * or un-box values.
     */
    class Point {
        /**
         * X-coordinate of this point.
         *
         * @type {Number}
         */
        private _x;
        /**
         * Y-coordinate of this point.
         *
         * @type {Number}
         */
        private _y;
        /**
         * X-coordinate of this point.
         *
         * @returns {number}
         */
        /**
         * Set the x-coordinate of this point
         *
         * @param newX the new X to set.
         */
        x: number;
        /**
         * Y-coordinate of this point.
         *
         * @returns {number}
         */
        /**
         * Set the y-coordinate of this point
         *
         * @param newY the new y to set.
         */
        y: number;
        /**
         * Construct a new point that uses the provided X and Y values as its initial coordinate.
         *
         * @param x X-coordinate of this point
         * @param y Y-coordinate of this point
         * @constructor
         */
        constructor(x: number, y: number);
        /**
         * Create and return a new point based on a given vector, optionally translating the values by the
         * origin point provided; this is a fast way to turn a point and a vector into the result of
         * following that vector.
         *
         * When no origin point is provided, it is assumed to be the point (0, 0).
         *
         * @param vector the point to convert into a point
         * @param origin the point to consider the origin for the purposes of the conversion; if not
         * given, (0, 0) is assumed
         */
        static fromPoint(vector: Vector2D, origin?: Point): Point;
        /**
         * Return a new point instance that is a copy of this point.
         *
         * @returns {Point} a duplicate of this point
         * @see Point.copyTranslatedXY
         */
        copy(): Point;
        /**
         * Return a new point instance that is a copy of this point, with its values translated by the values
         * passed in.
         *
         * @param translation the point to translate this point by
         * @returns {Point} a duplicate of this point, translated by the value passed in
         * @see Point.copy
         * @see Point.copyTranslatedXY
         */
        copyTranslated(translation: Point): Point;
        /**
         * Return a new point instance that is a copy of this point, with its values translated by the values
         * passed in.
         *
         * @param x the amount to translate the X value by
         * @param y the amount to translate the Y value by
         * @returns {Point} a duplicate of this point, translated by the value passed in
         * @see Point.copy
         * @see Point.copyTranslated
         */
        copyTranslatedXY(x: number, y: number): Point;
        /**
         * Create and return a copy of this point in which each component is divided by the factor provided.
         * This allows for some simple coordinate conversions in a single step. After conversion the points
         * are rounded down to ensure that the coordinates remain integers.
         *
         * This is a special case of scale() that is more straight forward for use in some cases.
         *
         * @param factor the amount to divide each component of this point by
         * @returns {Point} a copy of this point with its values divided by the passed in factor
         * @see Point.scale
         * @see Point.copyScaled
         */
        copyReduced(factor: number): Point;
        /**
         * Create and return a copy of this point in which each component is scaled by the scale factor
         * provided. This allows for some simple coordinate conversions in a single step. After conversion the
         * points are rounded down to ensure that the coordinates remain integers.
         *
         * @param {Number} scale the amount to multiply each component of this point by
         * @returns {Point} a copy of this point with its values scaled by the passed in factor
         * @see Point.reduce
         * @see Point.copyReduced
         */
        copyScaled(scale: number): Point;
        /**
         * Set the position of this point to the same as the point passed in.
         *
         * @param point the point to copy from
         * @returns {Point} this point after the operation completes, for chaining calls.
         */
        setTo(point: Point): Point;
        /**
         * Set the position of this point to the same as the values passed in
         *
         * @param x new X-coordinate for this point
         * @param y new Y-coordinate for this point
         * @returns {Point} this point after the operation completes, for chaining calls.
         */
        setToXY(x: number, y: number): Point;
        /**
         * Set the position of this point to the first two values in the array passed in, where the first
         * value is treated as the X value and the second value is treated as the Y value.
         *
         * It is valid for the array to have more than two elements, but if it has fewer than two, nothing
         * happens.
         *
         * @param array the array to get the new values from.
         * @returns {Point} this point after the operation completes, for chaining calls.
         */
        setToArray(array: Array<number>): Point;
        /**
         * Compares this point to the point passed in to determine if they represent the same point.
         *
         * @param other the point to compare to
         * @returns {boolean} true or false depending on equality
         */
        equals(other: Point): boolean;
        /**
         * Compares this point to the values passed in to determine if they represent the same point.
         *
         * @param x the X-coordinate to compare to
         * @param y the Y-coordinate to compare to
         * @returns {boolean} true or false depending on equality
         */
        equalsXY(x: number, y: number): boolean;
        /**
         * Translate the location of this point using the values of the point passed in. No range checking is
         * done.
         *
         * @param delta the point that controls both delta values
         * @returns {Point} this point after the translation, for chaining calls.
         */
        translate(delta: Point): Point;
        /**
         * Translate the location of this point using the values passed in. No range checking is done.
         *
         * @param deltaX the change in X-coordinate
         * @param deltaY the change in Y-coordinate
         * @returns {Point} this point after the translation, for chaining calls.
         */
        translateXY(deltaX: number, deltaY: number): Point;
        /**
         * Calculate and return the value of the point that is some distance away from this point at the angle
         * provided.
         *
         * This works by using trig and assuming that the point desired is the point that describes the
         * hypotenuse of a right triangle.
         *
         * @param angle the angle desired, in degrees
         * @param distance the desired distance from this point
         * @returns {Point} the resulting point
         */
        pointAtAngle(angle: number, distance: number): Point;
        /**
         * Given some other coordinate value, calculate the angle between this point and that point, in
         * degrees. 0 degrees faces to the right and 90 degrees is down instead of up (because it faces in
         * the direction of positive Y, which increases downwards).
         *
         * @param x the X-coordinate to calculate the angle to
         * @param y the Y-coordinate to calculate the angle to
         * @returns {number} the angle (in degrees) between this point and the passed in point.
         * @see Point.angleTo
         */
        angleToXY(x: number, y: number): number;
        /**
         * Given some other coordinate value, calculate the angle between this point and that point, in
         * degrees. 0 degrees faces to the right and 90 degrees is down instead of up (because it faces in
         * the direction of positive Y, which increases downwards).
         *
         * @param other the point to calculate the angle to
         * @returns {number} the angle (in degrees) between this point and the passed in point.
         * @see Point.angleToXY
         */
        angleTo(other: Point): number;
        /**
         * Calculate and return the distance between this point and the coordinates provided.
         *
         * @param x the X-coordinate to calculate the distance to
         * @param y the Y-coordinate to calculate the distance to
         * @returns {number} the distance between this point and the location provided
         * @see Point.distance
         * @see Point.distanceSquared
         * @see Point.distanceSquaredXY
         */
        distanceXY(x: number, y: number): number;
        /**
         * Calculate and return the square of the distance between this point and the coordinates
         * provided.
         *
         * This is meant for purposes where a lot of distances are being compared without requiring the
         * actual computed distance; this saves a costly square root function.
         *
         * @param x the X-coordinate to calculate the distance to
         * @param y the Y-coordinate to calculate the distance to
         * @returns {number} the squared distance between this point and the location provided
         * @see Point.distance
         * @see Point.distanceXY
         * @see Point.distanceSquared
         */
        distanceSquaredXY(x: number, y: number): number;
        /**
         * Calculate and return the distance between this point and the point passed in.
         *
         * @param other the other point to calculate the distance to
         * @returns {number} the distance between this point and the other point
         * @see Point.distanceXY
         * @see Point.distanceSquared
         * @see Point.distanceSquaredXY
         */
        distance(other: Point): number;
        /**
         * Calculate and return the square of the distance between this point and the coordinates
         * provided.
         *
         * This is meant for purposes where a lot of distances are being compared without requiring the
         * actual computed distance; this saves a costly square root function.
         *
         * @param other the other point to calculate the distance to
         * @returns {number} the squared distance between this point and the other point
         * @see Point.distance
         * @see Point.distanceXY
         * @see Point.distanceSquaredXY
         */
        distanceSquared(other: Point): number;
        /**
         * Reduce the components in this point by dividing each by the factor provided. This allows for some
         * simple coordinate conversions in a single step. After conversion the points are rounded down to
         * ensure that the coordinates remain integers.
         *
         * This is a special case of scale() that is more straight forward for use in some cases.
         *
         * @param factor the amount to divide each component of this point by
         * @returns {Point} a copy of this point with its values divided by the passed in factor
         * @see Point.scale
         * @see Point.copyScaled
         */
        reduce(factor: number): Point;
        /**
         * Scale the components in this point by multiplying each by the scale factor provided. This allows
         * for some simple coordinate conversions in a single step. After conversion the points are rounded
         * down to ensure that the coordinates remain integers.
         *
         * @param scale the amount to multiply each component of this point by
         * @returns {Point} this point after the scale, for chaining calls.
         * @see Point.reduce
         * @see Point.copyReduced
         */
        scale(scale: number): Point;
        /**
         * Clamp the value of the X-coordinate of this point so that it is between the min and max values
         * provided, inclusive.
         *
         * @param minX the minimum X-coordinate to allow
         * @param maxX the maximum Y-coordinate to allow
         * @returns {Point} this point after the clamp is completed, for chaining calls.
         */
        clampX(minX: number, maxX: number): Point;
        /**
         * Clamp the value of the Y-coordinate of this point so that it is between the min and max values
         * provided, inclusive.
         *
         * @param minY the minimum Y-coordinate to allow
         * @param maxY the maximum Y-coordinate to allow
         * @returns {Point} this point after the clamp is completed, for chaining calls.
         */
        clampY(minY: number, maxY: number): Point;
        /**
         * Clamp the X and Y values of the provided point so that they are within the bounds of the stage
         * provided.
         *
         * @param stage the stage to clamp to
         * @returns {Point} this point after the clamp is completed, for chaining calls.
         */
        clampToStage(stage: Stage): Point;
        /**
         * Return a copy of this point as an array of two numbers in x, y ordering.
         *
         * @returns {Array<number>} the point as an array of two numbers.
         */
        toArray(): Array<number>;
        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString(): string;
    }
}
declare module nurdz.game {
    /**
     * This class represents a 2-Dimensional vector.
     *
     * A vector is a geometric entity which has two properties; length (magnitude) and direction. They are
     * objects which are inherently an offset or displacement from some other point.
     *
     * Vectors can operate in any number of dimensions, but this class operates only with 2 dimensional
     * vectors due to the nature of the engine that it's used in.
     *
     * Note also that mathematically vectors are represented as a column matrix, which stops you from
     * confusing them with points. We take the lazy approach of representing them in comments here and
     * elsewhere as row matrices instead. Normally you would include a T superscript to indicate that this ia
     * a row matrix which should be Transposed, but we're not doing that here due to the aforementioned
     * laziness.
     */
    class Vector2D {
        /**
         * The amount of offset that we have in the X direction; positive X values face right while negative X
         * values face left. A value of 0 is going either up or down as determined by the Y value.
         */
        protected _x: number;
        /**
         * The amount of offset that we have in the Y direction; positive Y values face downward while
         * negative Y values face upward. A value of 0 is either either right or left and determined by the
         * X value.
         *
         * Note that the sense of what is up and what is down is reversed what what you would expect in
         * standard geometry because on our canvas the Y values increase downward and not upwards as they
         * normally would.
         */
        protected _y: number;
        /**
         * The x component of this vector.
         *
         * @returns {number}
         */
        /**
         * Set the x component of this vector.
         *
         * @param newX the new X to set.
         */
        x: number;
        /**
         * The y component of this vector.
         *
         * @returns {number}
         */
        /**
         * Set the y component of this vector.
         *
         * @param newY the new y to set.
         */
        y: number;
        /**
         * Get the magnitude of this vector.
         *
         * @returns {number} the length of this vector
         */
        /**
         * Set the magnitude of this vector. This retains the current direction of the vector but modifies
         * the components so that the magnitude is the new magnitude.
         *
         * Setting the magnitude to 1 is a shortcut for normalizing it.
         *
         * @param newMagnitude the new magnitude for the vector
         */
        magnitude: number;
        /**
         * Get the angle (in degrees) that this vector is currently pointing.
         *
         * A rotation angle of 0 represents the right, and the rest of the angles go in a clockwise direction.
         *
         * Note that this is different from what you might expect (e.g. an angle pointing up and to the right
         * is not 45 degrees but is instead 315 degrees) because the Y axis increases downward and not
         * upward.
         *
         * The return is always a value in the range of 0-359 inclusive.
         *
         * The Zero vector (a vector with all components 0) is assumed to point in the direction with angle 0
         * (to the right).
         *
         * @returns {number} the angle in degrees that the vector is pointing.
         */
        /**
         * Set the angle (in degrees) that this vector points. This keeps the current magnitude of the
         * vector intact.
         *
         * A rotation angle of 0 represents the right, and the rest of the angles go in a clockwise direction.
         *
         * Note that this is different from what you might expect (e.g. an angle pointing up and to the right
         * is not 45 degrees but is instead 315 degrees) because the Y axis increases downward and not
         * upward.
         *
         * @param newDirection
         */
        direction: number;
        /**
         * Get the squared magnitude of this vector. The true magnitude is the square root of this value,
         * which can be a costly operation; for comparison purposes you may want to skip that portion of
         * the operation.
         *
         * @returns {number}
         */
        magnitudeSquared: number;
        /**
         * Construct a new 2D vector, optionally also providing one or both components of the vector itself.
         *
         * As a vector is an offset from some location, it is important to note that the X and Y provided are
         * not POSITIONS, but are in fact the amount of OFFSET on each axis from some other (externally
         * defined) position.
         *
         * @param x the amount of X offset for this vector
         * @param y the amount of Y offset for this vector
         */
        constructor(x?: number, y?: number);
        /**
         * Given a direction and a magnitude, return back a vector object that represents those values. This
         * calculates the appropriate X and Y displacements required in order to obtain a vector with these
         * properties.
         *
         * @param direction the direction the vector is pointing (in degrees)
         * @param magnitude the magnitude of the vector
         */
        static fromDisplacement(direction: number, magnitude: number): Vector2D;
        /**
         * Create and return a new vector based on a given point, optionally translating the values at the
         * same time to turn the point into a proper displacement from some known origin point.
         *
         * The function assumes that both the point provided and the origin point are using the same frame
         * of reference, and so the position of the point will be translated by the inverse of the origin
         * point provided.
         *
         * When no origin point is provided, it is assumed to be the point (0, 0); thus in this case the
         * point you provide is deemed to already be a vector.
         *
         * @param point the point to convert into a vector
         * @param origin the point to consider the origin for the purposes of the conversion; if not
         * given, (0, 0) is assumed
         */
        static fromPoint(point: Point, origin?: Point): Vector2D;
        /**
         * Return a new vector instance that is a copy of this vector
         *
         * @returns {Vector2D} a duplicate of this vector
         */
        copy(): Vector2D;
        /**
         * Return a new vector instance that is a copy of this vector after it has been normalized.
         *
         * @returns {Vector2D} a duplicate of the normalized form of this vector.
         */
        copyNormalized(): Vector2D;
        /**
         * Return a new vector instance that is a copy of this vector after it has been reversed to point in
         * the opposite direction of this vector
         *
         * @returns {Vector2D} a duplicate of the reversed form of this vector
         */
        copyReversed(): Vector2D;
        /**
         * Return a new vector instance that is a copy of this vector after it has been rotated 90
         * degrees to the left or right.
         *
         * @param left true to rotate the copied vector to the left or false to rotate it to the right
         */
        copyOrthogonal(left?: boolean): Vector2D;
        /**
         * Reverse the direction of the vector by rotating it 180 degrees from the direction that it is
         * currently pointing.
         *
         * @returns {Vector2D} this vector after being reversed.
         */
        reverse(): Vector2D;
        /**
         * Normalize this vector to convert it to a unit vector.
         *
         * A normalized vector is one which has a magnitude of 1; as such the components of the vector are
         * modified but it's orientation will remain the same.
         *
         * Note that this is just a specialized case of scaling the vector by its current magnitude.
         * Additionally, don't confuse a normalized vector (vector with magnitude of 1) with a "normal
         * vector", which is a vector that is perpendicular to a surface but may or may not have a magnitude
         * of 1.
         *
         * @see Vector2D.scale
         * @returns {Vector2D} this vector after being normalized.
         */
        normalize(): Vector2D;
        /**
         * Calculate the dot product between two vectors.
         *
         * Geometrically, the dot product is defined as:
         *
         *    U . V = ||U|| * ||V|| * cos (theta)
         *
         * Which means "the dot product between two vectors U and V is the same as the magnitude of each
         * vector multiplied  by the cosine of the angle between them, where "the angle between them" is the
         * angle that one of the vectors would need to be rotated in order to be pointing in the same
         * direction of the other one.
         *
         * For the case of normalized unit vectors (whose magnitude is always 1) the dot product tells you
         * directly the cosine of the angle between the vectors. For non-unit vectors, you can obtain this by
         * dividing the dot product by the multiple of the magnitudes of both vectors (which cancels them
         * out). This is generally costly which is why we generally work with unit vectors in this case, which
         * allow us to assume the magnitude.
         *
         * Properties of the dot product:
         *   A) When both are pointing in the same direction, the angle between them is 0, and cos(0) is 1.
         *   B) When each points in the opposite direction, the angle between them is 180, and cos(180) is -1.
         *   C) When the two are perpendicular, the angle between them is 90, and cos(90) = 0.
         *   D) Due to the way the dot product is calculated, the dot product of a vector and itself is always
         *      the square of the magnitude, which may be interesting for various algebraic and/or geometric
         *     reasons.
         *
         * @param other the other vector to calculate the dot product with.
         * @returns {number} the dot product between this vector and the other vector
         */
        dot(other: Vector2D): number;
        /**
         * Rotate this vector 90 degrees to the left or right by 90 degrees to make it orthogonal to its
         * current direction. This leaves the magnitude intact.
         *
         * The parameter allows you to select the orientation of the new vector, either pointing to the left
         * of this vector (true) or the right of it (false).
         *
         * Although this is possible via the rotate() method, the version here does not require the use of
         * any trig functions in order to perform the rotation, and so runs faster, should that be needed.
         *
         * @param left true to return a vector rotated 90 degrees to the left (counter-clockwise) or false to
         * rotate clockwise instead.
         * @returns {Vector2D} the vector after it has been rotated
         * @see Vector2D.rotate
         */
        orthogonalize(left?: boolean): Vector2D;
        /**
         * Add the provided vector to this vector, returning this vector.
         *
         * @param other the vector to add to this vector
         * @returns {Vector2D} this vector after the other vector has been added to it
         */
        add(other: Vector2D): Vector2D;
        /**
         * Subtract the provided vector from this vector, returning this vector
         *
         * @param other the vector to subtract from this vector
         * @returns {Vector2D} this vector after the other vector has been subtracted from it
         */
        sub(other: Vector2D): Vector2D;
        /**
         * Negate the components of this vector by flipping the sign of all of its components. The vector is
         * returned to allow chaining this as required.
         *
         * This is useful for purposes of turning a vector subtraction into a vector addition, since vector
         * addition is commutative but subtraction is not. This can make some calculations visually easier to
         * follow, even if it does complicate the code and slow it down.
         *
         * @returns {Vector2D} this vector after the negation has been computed
         */
        negate(): Vector2D;
        /**
         * Rotate the direction of this vector by the specified angle (in degrees), returning the vector after
         * the rotation has completed.
         *
         * Positive angle rotate in a clockwise fashion while negative angles rotate in a counterclockwise
         * fashion. This is inverted to what you might expect due to the Y axis increasing downwards and not
         * upwards.
         *
         * For the special case of rotating the vector 90 degrees to the left or right, the getOrthogonal()
         * method can be used to return a new vector that is so rotated without the expense of the trig
         * functions that are used by this method.
         *
         * @param angle the angle to rotate by, in degrees
         * @returns {Vector2D} this vector after the rotation has been completed
         * @see Vector2D.getOrthogonal
         */
        rotate(angle: number): Vector2D;
        /**
         * Rotate this vector so that it points at the angle provided.
         *
         * @param angle the absolute angle to point the vector in, in degrees
         * @returns {Vector2D} this vector after the rotation has been accomplished
         */
        rotateTo(angle: number): Vector2D;
        /**
         * Scale this vector by the scale factor provided. This alters the magnitude of the vector (and thus
         * also the displacement) but leaves the direction untouched.
         *
         * Scaling by the current magnitude of the vector will normalize it into a unit vector. There is a
         * normalize() method that does this for you, for convenience.
         *
         * @param factor the scale factor to apply to the vector
         * @returns {Vector2D} this vector after it has been scaled
         * @see Vector2D.normalize
         */
        scale(factor: number): Vector2D;
        /**
         * Display a string version of the vector for debugging purposes.
         *
         * This displays the displacement values as well as the direction and magnitude. All values are set to
         * a fixed level 0f 3 digits after the decimal point.
         *
         * @returns {string}
         */
        toString(): string;
    }
}
declare module nurdz.game {
    /**
     * The type of a callback function to invoke when a SpriteSheet has been fully loaded; i.e. when it
     * has enough information to fully determine the dimensions of all of the sprites contained in it.
     *
     * This gets invoked after the SpriteSheet has finished setting up its internal state regarding the
     * size and location of all sprites in the sheet. For SpriteSheets that need to preload their images
     * first, this happens after the preload is finished, while for other SpriteSheets it will get invoked
     * before the constructor of the SpriteSheet returns.
     */
    type SpriteSheetSetupCallback = (SpriteSheet) => void;
    /**
     * This class represents the basics of a sprite sheet; this takes the URL to an image, and will
     * preload that image and internally slice it into sprites at given size boundaries for later rendering.
     *
     * This version of the class requires all sprites in the same sprite sheet to have the same dimensions.
     */
    class SpriteSheet {
        /**
         * The image that underlies us; this is what holds all of our sprites.
         */
        protected _image: HTMLImageElement;
        /**
         * The width of each sprite in the sprite sheet, in pixels.
         */
        protected _spriteWidth: number;
        /**
         * The height of each sprite in the sprite sheet, in pixels.
         */
        protected _spriteHeight: number;
        /**
         * The number of sprites across in the sprite sheet.
         */
        protected _spritesAcross: number;
        /**
         * The number of sprites down in the sprite sheet.
         */
        protected _spritesDown: number;
        /**
         * The number of sprites total in this sprite sheet.
         */
        protected _spriteCount: number;
        /**
         * An array that contains the starting positions of all of the sprites in the sheet, so that they
         * don't need to be calculated every time one is displayed.
         */
        protected _spritePos: Array<Point>;
        /**
         * If this is non-null, when we finish out internal setup, this is invoked to give the caller
         * information as to the dimensions of the sprites, etc.
         */
        protected _callback: SpriteSheetSetupCallback;
        /**
         * Obtain the width of sprites that are present in this sprite sheet; this is not available until
         * the sprite sheet has finished loading the underlying image.
         *
         * @returns {number}
         */
        width: number;
        /**
         * Obtain the height of sprites that are present in this sprite sheet; this is not available until
         * the sprite sheet has finished loading the underlying image.
         *
         * @returns {number}
         */
        height: number;
        /**
         * Obtain the total number of sprites available in this sprite sheet; this is not available until
         * the sprite sheet has finished loading the underlying image.
         *
         * @returns {number}
         */
        count: number;
        /**
         * Construct a new sprite sheet either from a previously loaded image or by preloading an image.
         *
         * In the first case, the image needs to have been loaded enough to have dimension information
         * available at the very least, so that the sprites can be pulled from it. This means that you
         * should really only invoke this from the completion handler of your own preload (or after
         * pulling the image from somewhere else).
         *
         * In the second case, the class will preload the image itself. Here images are expected to be in a
         * folder named "images/" inside of the folder that the game page is served from, so only a filename
         * and extension is required.
         *
         * The constructor is passed two dimensions, an "across" and a "down", plus a boolean flag which
         * is used to determine how the dimension parameters are interpreted.
         *
         * When asSprites is true (the default), the across and down are interpreted as the number of
         * sprites across and down in the sprite sheet. In this case, the actual dimensions of the sprites
         * are determined based on the size of the incoming image and the number of sprites in the sprite
         * sheet is across x down.
         *
         * When asSprites is false, the across and down are interpreted as the pixel width and height of
         * each individual sprite in the sprite sheet. In this case, the actual dimensions of the sprites
         * is given directly and the number of total sprites is determined based on the size of the
         * incoming image.
         *
         * The constructor can be passed a callback function; this will be invoked once all information

         * necessary has been obtained (i.e. image preloads).
         *
         * @param stage the stage that will display this sprite sheet
         * @param image the image to use for this sprite sheet, either a filename of an image or a
         * previously fully loaded image
         * @param across number of sprites across (asSprites == true) or pixel width of each sprite
         * @param down number of sprites down (asSprites == true) or pixel height of each sprite
         * @param asSprites true if across/down specifies the size of the sprite sheet in sprites, or
         * false if across/down is specifying the size of the sprites explicitly.
         * @param callback if provided, this function is invoked once the SpriteSheet has finished setting
         * up; its invoked with this SpriteSheet object as a parameter.
         */
        constructor(stage: Stage, image: string | HTMLImageElement, across: number, down?: number, asSprites?: boolean, callback?: SpriteSheetSetupCallback);
        /**
         * This gets invoked when our image is fully loaded, which means its dimensions are known. This
         * kicks off setting up the rest of the information needed for this sprite sheet.
         *
         * @param image the image that was loaded.
         */
        private imageLoadComplete;
        /**
         * Render a sprite from this sprite sheet at the provided location. The sprite will be positioned
         * with its upper left corner at the provided location.
         *
         * @param sprite the sprite to render
         * @param x the x location to render the actor at, in stage coordinates (NOT world)
         * @param y the y location to render the actor at, in stage coordinates (NOT world)
         * @param renderer the class to use to render the actor
         */
        blit(sprite: number, x: number, y: number, renderer: Renderer): void;
        /**
         * Render a sprite from this sprite sheet at the provided location. The sprite will be positioned
         * with its center at the provided location.
         *
         * @param sprite the sprite to render
         * @param x the x location to render the actor at, in stage coordinates (NOT world)
         * @param y the y location to render the actor at, in stage coordinates (NOT world)
         * @param renderer the class to use to render the actor
         */
        blitCentered(sprite: number, x: number, y: number, renderer: Renderer): void;
        /**
         * Render a sprite from this sprite sheet at the provided location. The sprite will be positioned
         * with its center at the provided location and will be rotated at the provided angle.
         *
         * @param sprite the sprite to render
         * @param x the x location to render the actor at, in stage coordinates (NOT world)
         * @param y the y location to render the actor at, in stage coordinates (NOT world)
         * @param angle the angle to rotate the sprite by (in degrees)
         * @param renderer the class to use to render the actor
         */
        blitCenteredRotated(sprite: number, x: number, y: number, angle: number, renderer: Renderer): void;
    }
}
declare module nurdz.game {
    /**
     * This class represents a list of animations, which are represented by a list of frames by numeric
     * ID. Generally this would be associated with a sprite sheet of some king.
     */
    class AnimationList {
        /**
         * The list of all animations known in this animation list.
         */
        private _animations;
        /**
         * The animation that is currently playing (if any).
         */
        private _current;
        /**
         * Get the name of the animation that is currently playing on this animation list (or selected to
         * play). The value is null if no animation is selected.
         *
         * @returns {string}
         */
        current: string;
        /**
         * Determine if the current animation is playing or not. The return value is always false if there
         * is no current animation.
         *
         * @returns {boolean}
         */
        isPlaying: boolean;
        /**
         * Construct a new animation list
         */
        constructor();
        /**
         * Given a frame rate and a frame list, create and return a newly initialized animation
         * information structure.
         *
         * @param name the name of the animation to create
         * @param fps the frames per second that this animation should run at
         * @param loop true to loop the animation when it is played back or false to play it once and then
         * stop
         * @param frameList the list of frames that make up this animation.
         */
        private createAnimation(name, fps, loop, frameList);
        /**
         * Add a new animation with a textual name, which will run at the frames per second provided. The
         * animation can be set to loop or not as desired.
         *
         * The animation is made up of a list of frames to play in order from some sprite sheet.
         *
         * The first animation that is added is the one that the class plays by default. This can be
         * overridden by explicitely requesting playback of a null animation.
         *
         * @param name textual name for this animation, which should be unique amongst all registered
         * animations
         * @param fps the frames per second to run the animation at
         * @param loop true to loop the animation when it is played back or false for one shot playback
         * @param frameList the list of frames that make up the animation
         * @see AnimationList.setLoop
         * @see AnimationList.setPingPong
         * @see AnimationList.play
         */
        add(name: string, fps: number, loop: boolean, frameList: Array<number>): void;
        /**
         * Fetch an animation by name from our internal animation list, specifying what is to be done with
         * it. If there is no such animation, null is returned and an error message is generated to the
         * console.
         *
         * @param name the name of the animation to fetch
         * @param purpose what is to be done with the animation; used in the log message
         * @returns {AnimationInformation} the animation information for the named animation, or null if
         * not found
         */
        private fetchAnimation(name, purpose);
        /**
         * Start playing the provided animation; this will take effect on the next call to the update method.
         *
         * @param name the name of the animation to play or null to stop all animations
         * @see Animation.update
         */
        play(name: string): void;
        /**
         * Turn looping for this animation on or off. When an animation is looped, the last frame is followed
         * by the first frame; when not looping the animation freezes at the last frame.
         *
         * @param name the name of the animation to modify
         * @param shouldLoop true to set this animation to loop, false to turn off looping
         */
        setLoop(name: string, shouldLoop: boolean): void;
        /**
         * Allows you to check if an animation is set to loop or not.
         *
         * @param name the name of the animation to query
         * @returns {boolean} true if this animation is set to loop, or false otherwise
         */
        loops(name: string): boolean;
        /**
         * Turn ping ponging for this animation on or off; animations are created to not ping pong by
         * default. When an animation is ping ponged, once the animation gets to the end of the frame
         * list, it goes back towards the front of the list again.
         *
         * @param name the name of the animation to modify
         * @param shouldPingPong true to turn on pingPong for this animation, false to turn it off
         */
        setPingPong(name: string, shouldPingPong: boolean): void;
        /**
         * Allows you to check if an animation is set to ping pong or not. Animations are created to not
         * ping pong by default.
         *
         * @param name the name of the animation to query
         * @returns {boolean} true if this animation is set to ping pong, or false otherwise
         */
        pingPongs(name: string): boolean;
        /**
         * This method drives the animation; This should be invoked once per game tick that this animation
         * is supposed to be played. The return value is the frame of the animation that should be played
         * next.
         *
         * This controls animation looping and ping ponging by updating internal state as needed; when an
         * animation stops looping, this keeps returning the last frame that was played.
         *
         * The return value is always 0 if there is no current animation playing.
         *
         * @returns {number} the next frame to play in the current animation
         */
        update(): number;
    }
}
declare module nurdz.game {
    /**
     * This type is used to mark what kind of collision volume a Collider instance uses.
     *
     * Where positioning is concerned, all collision types are represented logically by a rectangular area
     * with the position referenced from the top left corner. This position is offset by an origin property,
     * allowing the referenced position to be anywhere inside the rectangle.
     *
     * Where actual collisions are concerned, the actual collision volume it somewhere inside of the
     * positioning rectangle as outlined in the description of the collider type below.
     */
    enum ColliderType {
        /**
         * No collision volume at all; no collisions are possible with this collider type. All of the
         * collision methods will always return false no matter what.
         */
        NONE = 0,
        /**
         * Rectangular bounding volume; the collision volume is the same as the positioning rectangle itself.
         *
         * The default origin for a rectangle collider is (0, 0) so that the position references the upper
         * left corner as one might expect by default.
         */
        RECTANGLE = 1,
        /**
         * Circular bounding volume; the collision volume is a circle positioned inside the exact center
         * of the positioning rectangle itself, which is always a square with sides the same as the
         * diameter of the circle it contains.
         *
         * The default origin for a circle collider is (width/2, height/2) so that the position references
         * the center of the circle as one might expect. This can of course be changed if the position is
         * best referenced from some other point.
         */
        CIRCLE = 2,
    }
    /**
     * This class represents the basis of an object that can be positioned on the stage and can collide
     * with other such instances. Collider objects can be one of the types in the ColliderType enumeration,
     * which controls how they interact with each other.
     *
     * Collider objects have minimal rendering functionality that allows them to represent their volumes
     * on the stage for debugging purposes.
     *
     * @see ColliderType
     */
    class Collider {
        /**
         * The type of collisions that this object allows.
         *
         * @type {ColliderType}
         */
        protected _type: ColliderType;
        /**
         * The stage that this collision object will be displayed on. This is used for rendering purposes
         * as well as for determining the dimensions of the area for collisions with the edges of the stage.
         *
         * @type {Stage}
         */
        protected _stage: Stage;
        /**
         * The angle that the collision object is rotated to. This is measured in degrees with 0 being to the
         * right and 90 degrees being downward (due to the y axis increasing in a downward fashion).
         *
         * Note that the angle of a rectangular collision object is not taken into account for collision
         * detection currently.
         */
        protected _angle: number;
        /**
         * The origin point of this collision object. This is an offset from the top left corner of the
         * position rectangle of this collider that describes where the actual position places this object.
         *
         * When the value of the origin is (0, 0), the position of the object is its direct position.
         *
         * @type {Point}
         */
        protected _origin: Point;
        /**
         * The position of this collision object in the world. These coordinates are in pixel coordinates; The
         * actual bounding volume (whatever its type) is referenced by this location, although the offset
         * from the position is given by the origin point.
         *
         * @type {Point}
         */
        protected _position: Point;
        /**
         * This property is interpreted in different ways for different collider types:
         *
         * For type RECTANGLE, this is the width of the collision rectangle, in pixels.
         *
         * For type CIRCLE, this is the radius of the collision circle, in pixels (and thus the positioning
         * box is twice this wide and twice this tall).
         *
         * @type {number}
         */
        protected _width: number;
        /**
         * This property is interpreted in different ways for different collider types:
         *
         * For type RECTANGLE, this is the height of the collision rectangle, in pixels.
         *
         * For type CIRCLE, this is the diameter of the collision circle, in pixels (and thus the positioning
         * box is this wide and this tall).
         *
         * @type {number}
         */
        protected _height: number;
        /**
         * Obtain the type of collision object that this is.
         *
         * @returns {ColliderType}
         */
        type: ColliderType;
        /**
         * Get the rotation angle of this collider (in degrees); 0 is to the right and 90 is downward (due
         * to the Y axis increasing downwards).
         *
         * @returns {number}
         */
        /**
         * Set the rotation angle of this collider (in degrees, does not affect collision
         * detection).
         *
         * The value is normalized to the range 0-359.
         *
         * @param newAngle the new angle to render at
         */
        angle: number;
        /**
         * The origin of this collision object, which is an offset from its position and is used to
         * determine at what point inside the collision object the position represents.
         *
         * @returns {Point}
         */
        origin: Point;
        /**
         * The position of this collision object in the world. These coordinates are in pixel coordinates.
         *
         * @returns {Point}
         */
        position: Point;
        /**
         * Obtain the radius of this collision object, in pixels.
         *
         * This only has meaning when the collider type is CIRCLE; in all other cases, this returns 0.
         *
         * @returns {number}
         */
        radius: number;
        /**
         * Obtain the width of this collision object, in pixels. This represents how wide the collision
         * volume is at its widest point, even if the collision type itself is not rectangular.
         *
         * @returns {number}
         */
        width: number;
        /**
         * Obtain the height of this collision object, in pixels. This represents how tall the collision
         * volume is at its tallest point, even if the collision type itself is not rectangular.
         *
         * @returns {number}
         */
        height: number;
        /**
         * Construct a new collider object of a provided type with the given properties. The origin of the
         * object is set to a sensible default for the collider type provided.
         *
         * @param stage the stage that will manage this collider
         * @param type the type of collision volume to use for this object
         * @param x the X position of the collision object
         * @param y the Y position of the collision object
         * @param widthOrRadius the width of the collision bounds; for circular bounding volumes this is
         * instead the radius of the circle
         * @param height the height of the collision bounds; this is ignored for circular bounding volumes
         * since both dimensions of a circle are identical
         */
        constructor(stage: Stage, type: ColliderType, x: number, y: number, widthOrRadius: number, height?: number);
        /**
         * Render the collision volume and origin of this collider using the renderer provided.
         *
         * The position provided to this method is the stage position of the collider object itself (which
         * may be adjusted for scrolling, for example).
         *
         * This will render the bounding volume as well as the the origin point.
         *
         * @param x the x location of the position to render the collider at, in stage coordinates (NOT world)
         * @param y the y location of the position to render the collider at, in stage coordinates (NOT world)
         * @param color the color specification to use to render the collision volume and origin
         * @param renderer the object to render with
         */
        renderVolume(x: number, y: number, color: string, renderer: Renderer): void;
        /**
         * Perform a collision check to see if the point provided falls within the bounding volume of this
         * collider.
         *
         * @param point the point to check
         * @returns {boolean} true if the point is within the bounding volume of this collision object or
         * false otherwise
         */
        contains(point: Point): boolean;
        /**
         * Perform a collision check to see if the point provided falls within the bounding volume of this
         * collider.
         *
         * @param x the X coordinate of the point to check
         * @param y the Y coordinate of the point to check
         * @returns {boolean} true if the point is within the bounding volume of this collision object or
         * false otherwise
         */
        containsXY(x: number, y: number): boolean;
        /**
         * Perform a collision with the other object under the assumption that both us and the other
         * object are circles.
         *
         * @param other the other collision object, which needs to be a circle
         * @returns {boolean} true if we collide with this circle, or false otherwise
         */
        private circleCircleCollide(other);
        /**
         * Perform a collision with the other object under the assumption that both us and the other
         * object are rectangles.
         *
         * @param other the other collision object, which needs to be a rectangle
         * @returns {boolean} true if we collide with this rectangle, false otherwise
         */
        private rectRectCollide(other);
        /**
         * Perform a collision with the other object under the assumption that one of us is a rectangle
         * and the other is a circle. Which is which does not matter, this works both ways.
         *
         * @param other the other collision object, which need to be either a rectangle or a circle
         * (whichever we are not)
         * @returns {boolean} true if we collide with this rectangle, false otherwise
         */
        private circleRectCollide(other);
        /**
         * Perform a collision check between this collision object and some other collision object. This
         * takes into account the types of each object and collides them as appropriate.
         *
         * @param other the other object to collide with
         * @returns {boolean} true if these two objects are colliding, or false otherwise
         */
        collidesWith(other: Collider): boolean;
        /**
         * Calculate the first intersection point between the line that runs from the two points provided
         * and this collision object. Since it is possible that the line segment may intersect more than
         * once, the direction of the line is used to determine the direction of the intersection points.
         * As such, the order of the points is important.
         *
         * If the result parameter is non-null, it is filled with the intersection point (if any). Otherwise,
         * a new point is created if needed.
         *
         * The return value is null if there is no intersection or the point of intersection if there is;
         * in this case, this could be the new point created or the point passed in, depending on the
         * value of result.
         *
         * @param p0 the starting point of the line segment
         * @param p1 the ending point of the line segment
         * @param result the result point to store the intersection in or null to create a new point if
         *     needed
         * @returns {Point} the point of the intersection (if any) or null otherwise.
         * @see Collider.intersectWithSegmentXY
         */
        intersectWithSegment(p0: Point, p1: Point, result?: Point): Point;
        /**
         * Calculate the first intersection point between the line that runs from the two points provided
         * and this collision object. Since it is possible that the line segment may intersect more than
         * once, the direction of the line is used to determine the direction of the intersection points.
         * As such, the order of the points is important.
         *
         * If the result parameter is non-null, it is filled with the intersection point (if any). Otherwise,
         * a new point is created if needed.
         *
         * The return value is null if there is no intersection or the point of intersection if there is;
         * in this case, this could be the new point created or the point passed in, depending on the
         * value of result.
         *
         * @param x0 the X coordinate of the starting point of the line segment
         * @param y0 the Y coordinate of the starting point of the line segment
         * @param x1 the X coordinate of the ending point of the line segment
         * @param y1 the Y coordinate of the ending point of the line segment
         * @param result the result point to store the intersection in or null to create a new point if
         *     needed
         * @returns {Point} the point of the intersection (if any) or null otherwise.
         * @see Collider.intersectWithSegment
         */
        intersectWithSegmentXY(x0: number, y0: number, x1: number, y1: number, result?: Point): Point;
    }
}
declare module nurdz.game {
    /**
     * This class represents the base class for any game object of any base type. This base class
     * implementation has a position and knows how to render itself.
     *
     */
    class Actor extends Collider {
        /**
         * The name of this actor type, for debugging purposes. There may be many actors with the same name.
         *
         * @type {string}
         */
        protected _name: string;
        /**
         * The position of this actor in the tile map. These coordinates are in tiles.
         *
         * @type {Point}
         */
        protected _mapPosition: Point;
        /**
         * The list of animations known to this Actor; this is null by default and only gets populated
         * when someone adds an animation.
         */
        protected _animations: AnimationList;
        /**
         * The sprite sheet associated with this actor; this defaults to null. If this is set, a
         * combination of this and _sprite is used in the rendering method to render this actor.
         */
        protected _sheet: SpriteSheet;
        /**
         * The sprite in the attached sprite sheet to use to render this actor in the render method. If
         * there is no sprite sheet attached, or this value is out of bounds for the given sheet, nothing
         * happens.
         */
        protected _sprite: number;
        /**
         * The Z-ordering (layer) for this entity. When rendered, actors with a lower Z-Order are rendered
         * before actors with a higher Z-Order, allowing some to appear over others.
         *
         * @type {number}
         */
        protected _zOrder: number;
        /**
         * The color to render debug markings for this actor with.
         *
         * @type {string}
         */
        protected _debugColor: string;
        /**
         * The position of this actor in the tile map. These coordinates are in tiles.
         *
         * @returns {Point}
         */
        mapPosition: Point;
        /**
         * The position of this actor in the world. These coordinates are in pixel coordinates.
         *
         * @returns {Point}
         */
        position: Point;
        /**
         * Get the origin of this actor, which is the offset from its position that is used to determine
         * where it renders and its hit box is located.
         *
         * @returns {Point}
         */
        origin: Point;
        /**
         * Get the width of this actor, in pixels.
         *
         * @returns {number}
         */
        width: number;
        /**
         * Get the height of this actor, in pixels.
         *
         * @returns {number}
         */
        height: number;
        /**
         * Get the layer (Z-Order) of this actor. When rendered, actors with a lower Z-Order are rendered
         * before actors with a higher Z-Order; thus this sets the rendering and display order for actors
         * by type.
         *
         * @returns {number}
         */
        /**
         * Set the layer (Z-Order) of this actor. When rendered, actors with a lower Z-Order are rendered
         * before actors with a higher Z-Order; thus this sets the rendering and display order for actors
         * by type.
         *
         * @param newZOrder the new zOrder value
         */
        zOrder: number;
        /**
         * Get the stage that owns this actor.
         *
         * @returns {Stage}
         */
        stage: Stage;
        /**
         * Get the animation list for this actor. This does not exist until the first time you query this
         * property.
         *
         * In order for animations to play, they must be added and a sprite sheet must be set as well.
         *
         * @returns {AnimationList}
         */
        animations: AnimationList;
        /**
         * The sprite sheet that is attached to this actor, or null if there is no sprite sheet currently
         * attached.
         *
         * @returns {SpriteSheet}
         */
        /**
         * Change the sprite sheet associated with this actor to the sheet passed in. Setting the sheet to
         * null turns off the sprite sheet for this actor.
         *
         * @param newSheet the new sprite sheet to attach or null to remove the current sprite sheet
         */
        sheet: SpriteSheet;
        /**
         * Get the sprite index of the sprite in the attached sprite sheet that this actor uses to render
         * itself. This value has no meaning if no sprite sheet is currently attached to this actor.
         *
         * @returns {number}
         */
        /**
         * Change the sprite index of the sprite in the attached sprite sheet that this actor uses to
         * render itself. If there is no sprite sheet currently attached to this actor, or if the sprite
         * index is not valid, this has no effect.
         *
         * @param newSprite the new sprite value to use from the given sprite sheet.
         */
        sprite: number;
        /**
         * Get the rotation angle that this Actor renders at (in degrees); 0 is to the right, 90 is
         * downward and 270 is upward (because the Y axis increases downward). This only affects rendering,
         * currently.
         *
         * @returns {number}
         */
        /**
         * Set the rotation angle that this Actor renders at (in degrees, does not affect collision
         * detection).
         *
         * The value is normalized to the range 0-359.
         *
         * @param newAngle the new angle to render at
         */
        angle: number;
        /**
         * Construct a new actor instance at the given position with the provided width and height.
         *
         * This defaults the Actor object to a rectangular bounding region for collisions (the most common)
         * with the width and height as provided and an origin in the upper left corner.
         *
         * If desired, the makeCircle method can be used to convert the actor to a circular bounding region
         * for collisions.
         *
         * @param name the internal name for this actor instance, for debugging
         * @param stage the stage that will be used to display this actor
         * @param x X co-ordinate of the location for this actor, in world coordinates
         * @param y Y co-ordinate of the location for this actor, in world coordinates
         * @param width the width of this actor, in pixels
         * @param height the height of this actor, in pixels
         * @param zOrder the Z-order of this actor when rendered (smaller numbers render before larger ones)
         * @param debugColor the color specification to use in debug rendering for this actor
         * @constructor
         * @see Actor.makeRectangle
         * @see Actor.makeCircle
         */
        constructor(name: string, stage: Stage, x: number, y: number, width: number, height: number, zOrder?: number, debugColor?: string);
        /**
         * Convert this actor to use a rectangular collision boundary with the given width and height as the
         * dimensions of the collider. If desired, this can also reset the origin to be the upper left corner
         * (the default for rectangular colliders).
         *
         * Actors are created as rectangles, so this is generally not needed unless you want to swap an
         * actor between circular and rectangular collision boundaries.
         *
         * @param width the width of the collision bounding box
         * @param height the height of the collision bounding box
         * @param resetOrigin if true, reset the origin to be (0, 0) (the upper left corner). When false, the
         *     origin is left as it currently is.
         * @see Actor.makeCircle
         */
        makeRectangle(width: number, height: number, resetOrigin?: boolean): void;
        /**
         * Convert this actor to use a circular collision boundary with the given radius as the dimensions.
         * If desired, this can also reset the origin to be the center of the circle (the default for
         * circular colliders).
         *
         * Actors are created as rectangles, so this can be used to convert them to circles if desired.
         *
         * @param radius the radius of the circular collider
         * @param resetOrigin if true, reset the origin point to be the center of the circle. WHen false, the
         *     origin is left as it currently is.
         * @see Actor.makeCircle
         */
        makeCircle(radius: number, resetOrigin?: boolean): void;
        /**
         * Add a new animation with a textual name, which will run at the frames per second provided. The
         * animation can be set to loop or not as desired.
         *
         * The animation is made up of a list of frames to play in order from some sprite sheet.
         *
         * The first animation that is added is the one that the class plays by default. This can be
         * overridden by explicitly requesting playback of a null animation.
         *
         * Until this is invoked, there is no animation list.
         *
         * @param name textual name for this animation, which should be unique amongst all registered
         * animations for this actor
         * @param fps the frames per second to run the animation at
         * @param loop true to loop the animation when it is played back or false for one shot playback
         * @param frameList the list of frames that make up the animation
         * @see Actor.setAnimationLoop
         * @see Actor.setAnimationPingPong
         * @see Actor.playAnimation
         */
        addAnimation(name: string, fps: number, loop: boolean, frameList: Array<number>): void;
        /**
         * Start playing the provided animation; this will take effect on the next call to the update method.
         *
         * @param name the name of the animation to play or null to stop all animations
         */
        playAnimation(name: string): void;
        /**
         * Update internal stage for this actor. The default implementation makes sure that any currently
         * running animation plays as expected.
         *
         * @param stage the stage that the actor is on
         * @param tick the game tick; this is a count of how many times the game loop has executed
         */
        update(stage: Stage, tick: number): void;
        /**
         * Render this actor using the renderer provided. The position provided represents the actual position
         * of the Actor as realized on the screen, which may be different from its actual position if
         * scrolling or a viewport of some sort is in use.
         *
         * The position provided here does not take the origin of the actor into account and is just a
         * representation of its actual position; thus your render code needs to take the origin into
         * account.
         *
         * Inside the render method, to get the adjusted position you can subtract the origin offset from
         * the values provided.
         *
         * This default method renders the current sprite in the attached sprite sheet if those values are
         * set and valid, or a bounding box with a dot that represents the origin offset if that is not
         * the case. This ensures that no matter what, the actor renders its position accurately on the
         * stage.
         *
         * @param x the x location to render the actor at, in stage coordinates (NOT world)
         * @param y the y location to render the actor at, in stage coordinates (NOT world)
         * @param renderer the class to use to render the actor
         */
        render(x: number, y: number, renderer: Renderer): void;
        /**
         * Set the position of this actor by setting its position on the stage in world coordinates. The
         * position of the actor on the map will automatically be updated as well.
         *
         * @param point the new position for this actor
         */
        setStagePosition(point: Point): void;
        /**
         /**
         * Set the position of this actor by setting its position on the stage in world coordinates. The
         * position of the actor on the map will automatically be updated as well.
         *
         * @param x the new X coordinate for the actor
         * @param y the new Y coordinate for the actor
         */
        setStagePositionXY(x: number, y: number): void;
        /**
         * Set the position of this actor by setting its position on the map in ile coordinates. The
         * position of the actor in the world will automatically be updated as well.
         *
         * @param point the new position for this actor
         */
        setMapPosition(point: Point): void;
        /**
         * Set the position of this actor by setting its position on the map in ile coordinates. The
         * position of the actor in the world will automatically be updated as well.
         *
         * @param x the new X coordinate for this actor
         * @param y the new Y coordinate for this actor
         */
        setMapPositionXY(x: number, y: number): void;
        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString(): string;
    }
}
declare module nurdz.game {
    /**
     * Objects that correspond to this interface (or some subclass of it) can be used as the property list
     * for an Entity.
     */
    interface EntityProperties {
        /**
         * A unique identifying value for this entity. When not given, the Entity class will construct a
         * new unique value for this property.
         */
        id?: string;
        /**
         * Turn on debugging for this entity. This can do anything you want, but by default this causes
         * the render method to render a bounding box that shows where the entity is currently positioned.
         *
         * To take advantage of this, you need to invoke the Entity render method from inside your derived
         * class's render method.
         */
        debug?: boolean;
    }
    /**
     * This class represents an Entity, which is a specific subclass of Actor that is designed to be
     * interactive with other actors and entities. An entity contains properties that can help define its
     * runtime behaviour.
     *
     * The properties provided may be extended with default values, depending on the subclass. Subclasses
     * can set this.defaultProperties to a set of properties that should be applied if they do not already
     * exist in the property set.
     *
     * Each subclass of Entity is responsible for making sure to blend the defaults with those of their
     * parent class so that the chained constructor calls set up the properties as appropriate.
     *
     * By default, entities support the following properties:
     *   - 'id': string (default: auto generated value)
     *      - specifies the id of this entity for use in identifying/finding/triggering this entity.
     */
    class Entity extends Actor {
        /**
         * The list of entity specific properties that apply to this entity.
         *
         * @type {EntityProperties}
         */
        protected _properties: EntityProperties;
        /**
         * The list of properties that is assigned to this entity.
         *
         * @returns {EntityProperties}
         */
        properties: EntityProperties;
        /**
         * Construct a new entity instance at a given location with given dimensions.
         *
         * All entities have properties that can control their activities at runtime, which are provided
         * in the constructor. In addition, a list of default properties may also be optionally provided.
         *
         * At construction time, any properties that appear in the default properties given that do not
         * already appear in the specific properties provided will be copied from the defaults provided.
         * This mechanism is meant to be used from a subclass as a way to have subclasses provide default
         * properties the way the Entity class itself does.
         *
         * Subclasses that require additional properties should create their own extended EntityProperties
         * interface to include the new properties, passing an instance to this constructor with a
         * typecast to its own type.
         *
         * @param name the internal name for this entity instance, for debugging
         * @param stage the stage that will be used to display this entity
         * @param x X co-ordinate of the location for this entity, in world coordinates
         * @param y Y co-ordinate of the location for this entity, in world coordinates
         * @param width the width of this entity, in pixels
         * @param height the height of this entity, in pixels
         * @param zOrder the Z-order of this entity when rendered (smaller numbers render before larger ones)
         * @param properties entity specific properties to apply to this entity
         * @param defaults default properties to apply to the instance for any required properties that do
         * not appear in the properties given
         * @param debugColor the color specification to use in debug rendering for this entity
         * @constructor
         */
        constructor(name: string, stage: Stage, x: number, y: number, width: number, height: number, zOrder: number, properties: EntityProperties, defaults?: EntityProperties, debugColor?: string);
        /**
         * This method is for use in modifying an entity property object to include defaults for properties
         * that don't already exist.
         *
         * In use, the list of defaults is walked, and for each such default that does not already have a
         * value in the properties object, the property will be copied over to the properties object.
         *
         * @param defaults default properties to apply to this entity
         */
        protected applyDefaultProperties(defaults: EntityProperties): void;
        /**
         * Every time an entity ID is automatically generated, this value is appended to it to give it a
         * unique number.
         *
         * @type {number}
         */
        static autoEntityID: number;
        /**
         * Every time this method is invoked, it returns a new unique entity id string to apply to the id
         * property of an entity.
         *
         * @returns {string}
         */
        private static createDefaultID();
        /**
         * This helper method is for validating entity properties. The method checks to see if a property
         * exists or not, if it is supposed to. It can also optionally confirm that the value is in some
         * range of valid values.
         *
         * The type is not checked because the TypeScript compiler already enforces that properties that
         * are known are of a valid type.
         *
         * Also note that some EntityProperty interface subclasses may specify that a property is not in
         * fact optional; when this is the case, this method is not needed except to validate values,
         * because the compiler is already validating that it's there.
         *
         * The "is required" checking here is intended for situations where properties are actually deemed
         * "always required" but which always have a default value that is forced in the Entity default
         * properties. In this case the interface would say that they're optional, but they're really not
         * and we just want to catch the developer forgetting to specify them.
         *
         * @param name the name of the property to validate.
         * @param required true when this property is required and false when it is optional
         * @param values either null or an array of contains all of the possible valid values for the
         * property. It's up to you to ensure that the type of the elements in the array matches the type
         * of the property being validated
         * @throws {Error} if the property is not valid for any reason
         */
        protected isPropertyValid(name: string, required: boolean, values?: string[]): void;
        /**
         * This method is automatically invoked at construction time to validate that the properties object
         * provided is valid as far as we can tell (i.e. needed properties exist and have a sensible value).
         *
         * Do note that the TypeScript compiler will ensure that the types of any properties are correct,
         * so this is really only needed to vet values and also to ensure that optional properties that
         * are not really optional but only marked that way so that they can have defaults were actually
         * installed, as a protection to the developer.
         *
         * This does not need to check if the values are valid as far as the other entities are concerned
         * (i.e. does a property that expects an entity id actually represent a valid entity) as that
         * happens elsewhere; further, that entity might not be created yet.
         *
         * This should throw an error if any properties are invalid. Make sure you call the super method
         * in your subclass!
         *
         * @throw {Error} if any properties in this entity are invalid
         */
        protected validateProperties(): void;
        /**
         * Query whether this entity should block movement of the actor provided or not.
         *
         * By default, entities block all actor movement. Note that this means that there is no API contract
         * as far as the core engine code is concerned with regards to the actor value passed in being
         * non-null.
         *
         * @param actor the actor to check blocking for, or null if it doesn't matter
         * @returns {boolean}
         */
        blocksActorMovement(actor: Actor): boolean;
        /**
         * This method is invoked whenever this entity gets triggered by another entity. This can happen
         * programmatically or in response to interactions with other entities, which does not include
         * collision (see triggerTouch() for that).
         *
         * The method gets passed the Actor that caused the trigger to happen, although this can be null
         * depending on how the trigger happened.
         *
         * @param activator the actor that triggered this entity, or null if unknown
         * @see Entity.triggerTouch
         */
        trigger(activator?: Actor): void;
        /**
         * This method is invoked whenever this entity gets triggered by another entity as a result of a
         * direct collision (touch). This can happen programmatically or in response to interactions with
         * other entities. This does not include non-collision interactions (see trigger() for that).
         *
         * The method gets passed the Actor that caused the trigger to happen.
         *
         * @param activator the actor that triggered this entity by touching (colliding) with it
         * @see Entity.trigger
         */
        triggerTouch(activator: Actor): void;
        /**
         * Render this actor using the renderer provided. The position provided represents the actual position
         * of the Actor as realized on the screen, which may be different from its actual position if
         * scrolling or a viewport of some sort is in use.
         *
         * The position provided here does not take the origin of the actor into account and is just a
         * representation of its actual position; thus your render code needs to take the origin into
         * account.
         *
         * Inside the render method, to get the adjusted position you can subtract the origin offset from
         * the values provided.
         *
         * This default method will do what Actor does and render the current sprite of the current sprite
         * sheet, if it can. Additionally, if the debug property is set to true, the bounding information
         * and origin is rendered for this entity overlapping the sprite.
         *
         * @param x the x location to render the actor at, in stage coordinates (NOT world)
         * @param y the y location to render the actor at, in stage coordinates (NOT world)
         * @param renderer the class to use to render the actor
         */
        render(x: number, y: number, renderer: nurdz.game.Renderer): void;
        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString(): string;
    }
}
declare module nurdz.game.Collision {
    /**
     * Determine if a point provided falls within the rectangle made up of the corner point with the width
     * and height provided.
     *
     * @param pX the X coordinate of the point to test
     * @param pY the Y coordinate of the point to test
     * @param rectX the X coordinate of a corner of the rectangle
     * @param rectY the Y coordinate of a corner of the rectangle
     * @param width the width of the rectangle
     * @param height the height of the rectangle
     * @returns {boolean} true if the point falls within the rectangle, or false otherwise
     */
    function pointInRect(pX: number, pY: number, rectX: number, rectY: number, width: number, height: number): boolean;
    /**
     * Determine if a point provided falls within the circle described by the given radius and centered at
     * the provided location.
     *
     * @param pX the X coordinate of the point to test
     * @param pY the Y coordinate of the point to test
     * @param circleX the X coordinate of the center of the circle
     * @param circleY the Y coordinate of the center of the circle
     * @param circleR the radius of the circle
     * @returns {boolean} true if the point falls within the circle, or false otherwise
     */
    function pointInCircle(pX: number, pY: number, circleX: number, circleY: number, circleR: number): boolean;
    /**
     * Determine if two rectangles intersect each other. Each rectangle is described by the position of
     * the upper left corner along with a width and a height.
     *
     * @param rect1X the X coordinate of the upper left corner of the first rectangle
     * @param rect1Y the Y coordinate of the upper left corner of the first rectangle
     * @param rect1W the width of the first rectangle
     * @param rect1H the height of the first rectangle
     * @param rect2X the X coordinate of the upper left corner of the second rectangle
     * @param rect2Y the Y coordinate of the upper left corner of the second rectangle
     * @param rect2W the width of the second rectangle
     * @param rect2H the height of the second rectangle
     * @returns {boolean} true if both rectangles intersect or false otherwise
     */
    function rectInRect(rect1X: number, rect1Y: number, rect1W: number, rect1H: number, rect2X: number, rect2Y: number, rect2W: number, rect2H: number): boolean;
    /**
     * Determine if two circles intersect each other. Each circle is described by a point that represents
     * its center and a radius value.
     *
     * @param circle1X the X coordinate of the center of the first circle
     * @param circle1Y the Y coordinate of the center of the first circle
     * @param circle1R the radius of the first circle
     * @param circle2X the X coordinate of the center of the second circle
     * @param circle2Y the Y coordinate of the center of the second circle
     * @param circle2R the radius of the second circle
     * @returns {boolean} true if the two circles intersect or false otherwise
     */
    function circleInCircle(circle1X: number, circle1Y: number, circle1R: number, circle2X: number, circle2Y: number, circle2R: number): boolean;
    /**
     * Determine if the rectangle and circle provided intersect each other. The rectangle is described by
     * the position of its upper left corner and its dimensions while the circle is described by its
     * center point and radius.
     *
     * @param rectX the X coordinate of the upper left corner of the rectangle
     * @param rectY the Y coordinate of the upper left corner of the rectangle
     * @param rectW the width of the rectangle
     * @param rectH the height of the rectangle
     * @param circleX the X coordinate of the center of the circle
     * @param circleY the Y coordinate of the center of the circle
     * @param circleR the radius of the circle
     * @returns {boolean} true if the rectangle and circle intersect or false otherwise
     */
    function rectInCircle(rectX: number, rectY: number, rectW: number, rectH: number, circleX: number, circleY: number, circleR: number): boolean;
    /**
     * Determine the intersection point between the line (p0, p1) and (p2, p3), if any can be found. In
     * particular, if the two lines are parallel to each other, no intersection is possible. Similarly,
     * if both lines are collinear, there are an infinite number of intersection points.
     *
     * If result is non-null, the collision point is put into that point before it is returned. Otherwise
     * a new point is created if needed
     *
     * The function returns a point that represents the intersection point, or null if there is no
     * intersection available. When result is specified, the return value is that point if there is an
     * intersection; in the case where there is no intersection, the point is left as-is and null is
     * returned.
     *
     * Note that this method returns the intersection of the two lines as if they were infinitely
     * projected in both directions; to determine if the intersection is on the line segments as
     * specified, use the other method.
     *
     * @param p0 the first point of the first line
     * @param p1 the second point of the first line
     * @param p2 the first point of the second line
     * @param p3 the second point of the second line
     * @param result if non-null and there is an intersection, this point will contain the intersection
     * and becomes the return value; left untouched if provided and there is no intersection
     * @returns {Point} the point at which the two lines intersect, or null if there is no intersection
     * @see Collision.lineIntersectionXY
     * @see Collision.segmentIntersection
     * @see Collision.segmentIntersectionXY
     */
    function lineIntersection(p0: Point, p1: Point, p2: Point, p3: Point, result?: Point): Point;
    /**
     * Determine the intersection point between the line (p0, p1) and (p2, p3), if any can be found. In
     * particular, if the two lines are parallel to each other, no intersection is possible. Similarly,
     * if both lines are collinear, there are an infinite number of intersection points.
     *
     * If result is non-null, the collision point is put into that point before it is returned. Otherwise
     * a new point is created if needed
     *
     * The function returns a point that represents the intersection point, or null if there is no
     * intersection available. When result is specified, the return value is that point if there is an
     * intersection; in the case where there is no intersection, the point is left as-is and null is
     * returned.
     *
     * Note that this method returns the intersection of the two lines as if they were infinitely
     * projected in both directions; to determine if the intersection is on the line segments as
     * specified, use the other method.
     *
     * @param x0 the X coordinate of the first point of the first line
     * @param y0 the Y coordinate of the first point of the first line
     * @param x1 the X coordinate of the second point of the first line
     * @param y1 the Y coordinate of the second point of the first line
     * @param x2 the X coordinate of the first point of the second line
     * @param y2 the Y coordinate of the first point of the second line
     * @param x3 the X coordinate of the second point of the second line
     * @param y3 the Y coordinate of the second point of the second line
     * @param result if non-null and there is an intersection, this point will contain the intersection
     * and becomes the return value; left untouched if provided and there is no intersection
     * @returns {Point} the point at which the two lines intersect, or null if there is no intersection
     * @see Collision.lineIntersection
     * @see Collision.segmentIntersection
     * @see Collision.segmentIntersectionXY
     */
    function lineIntersectionXY(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, result?: Point): Point;
    /**
     * Determine the intersection point between the line (p0, p1) and (p2, p3), if any can be found. In
     * particular, if the two lines are parallel to each other, no intersection is possible. Similarly,
     * if both lines are collinear, there are an infinite number of intersection points.
     *
     * If result is non-null, the collision point is put into that point before it is returned. Otherwise
     * a new point is created if needed
     *
     * The function returns a point that represents the intersection point, or null if there is no
     * intersection available. When result is specified, the return value is that point if there is an
     * intersection; in the case where there is no intersection, the point is left as-is and null is
     * returned.
     *
     * This method, unlike the other method, returns the intersection of the two line segments directly
     * (i.e. the lines are not infinitely projected); if the two line segments do not directly intersect,
     * null is returned.
     *
     * @param p0 the first point of the first line
     * @param p1 the second point of the first line
     * @param p2 the first point of the second line
     * @param p3 the second point of the second line
     * @param result if non-null and there is an intersection, this point will contain the intersection
     * and becomes the return value; left untouched if provided and there is no intersection
     * @returns {Point} the point at which the two lines intersect, or null if there is no intersection
     * @see Collision.lineIntersection
     * @see Collision.lineIntersectionXY
     * @see Collision.segmentIntersectionXY
     */
    function segmentIntersection(p0: Point, p1: Point, p2: Point, p3: Point, result?: Point): Point;
    /**
     * Determine the intersection point between the line (p0, p1) and (p2, p3), if any can be found. In
     * particular, if the two lines are parallel to each other, no intersection is possible. Similarly,
     * if both lines are collinear, there are an infinite number of intersection points.
     *
     * If result is non-null, the collision point is put into that point before it is returned. Otherwise
     * a new point is created if needed
     *
     * The function returns a point that represents the intersection point, or null if there is no
     * intersection available. When result is specified, the return value is that point if there is an
     * intersection; in the case where there is no intersection, the point is left as-is and null is
     * returned.
     *
     * This method, unlike the other method, returns the intersection of the two line segments directly
     * (i.e. the lines are not infinitely projected); if the two line segments do not directly intersect,
     * null is returned.
     *
     * @param x0 the X coordinate of the first point of the first line
     * @param y0 the Y coordinate of the first point of the first line
     * @param x1 the X coordinate of the second point of the first line
     * @param y1 the Y coordinate of the second point of the first line
     * @param x2 the X coordinate of the first point of the second line
     * @param y2 the Y coordinate of the first point of the second line
     * @param x3 the X coordinate of the second point of the second line
     * @param y3 the Y coordinate of the second point of the second line
     * @param result if non-null and there is an intersection, this point will contain the intersection
     * and becomes the return value; left untouched if provided and there is no intersection
     * @returns {Point} the point at which the two lines intersect, or null if there is no intersection
     * @see Collision.lineIntersection
     * @see Collision.lineIntersectionXY
     * @see Collision.segmentIntersection
     */
    function segmentIntersectionXY(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, result?: Point): Point;
    /**
     * Given a line segment that originates at (x0, y0) and ends at(x1, y1), determine the first
     * intersection between the line and the rectangle whose left corner is at (rectX, rectY) with the
     * dimensions given.
     *
     * The order of the points determines the direction that the line segment is assumed to be
     * pointing for the purposes of determining which of two possible intersection points is the first
     * intersection.
     *
     * The return value is null if there is no collision, or the point of the first intersection
     * between the line and the rectangle (based on directionality). If the result variable is null, a
     * new point object is created and returned; otherwise, the result object given is modified to
     * contain the collision location and is then returned.
     *
     * @param p0 the first point of the line segment
     * @param p1 the second point of the line segment
     * @param rectPos the upper left corner of the rectangle
     * @param rectW the width of the rectangle
     * @param rectH the height of the rectangle
     * @param result a point to store the result value in, or null to create a new one
     * @returns {Point} null if the line segment and the rectangle do not intersect, or the point at
     * which the first intersection happens
     * @see Collision.segmentRectangleIntersectionXY
     */
    function segmentRectangleIntersection(p0: Point, p1: Point, rectPos: Point, rectW: number, rectH: number, result?: Point): Point;
    /**
     * Given a line segment that originates at (x0, y0) and ends at(x1, y1), determine the first
     * intersection between the line and the rectangle whose left corner is at (rectX, rectY) with the
     * dimensions given.
     *
     * The order of the points determines the direction that the line segment is assumed to be
     * pointing for the purposes of determining which of two possible intersection points is the first
     * intersection.
     *
     * The return value is null if there is no collision, or the point of the first intersection
     * between the line and the rectangle (based on directionality). If the result variable is null, a
     * new point object is created and returned; otherwise, the result object given is modified to
     * contain the collision location and is then returned.
     *
     * @param x0 the X coordinate of the first point of the line segment
     * @param y0 the Y coordinate of the first point of the line segment
     * @param x1 the X coordinate of the second point of the line segment
     * @param y1 the Y coordinate of the second point of the line segment
     * @param rectX the X coordinate of the upper left corner of the rectangle
     * @param rectY the Y coordinate of the upper left corner of the rectangle
     * @param rectW the width of the rectangle
     * @param rectH the height of the rectangle
     * @param result a point to store the result value in, or null to create a new one
     * @returns {Point} null if the line segment and the rectangle do not intersect, or the point at
     * which the first intersection happens
     * @see Collision.segmentRectangleIntersection
     */
    function segmentRectangleIntersectionXY(x0: number, y0: number, x1: number, y1: number, rectX: number, rectY: number, rectW: number, rectH: number, result?: Point): Point;
}
declare module nurdz.game {
    /**
     * This class is the base class for all scenes in a game. A Scene is just a simple wrapper around
     * specific handling for input handling as well as object update and rendering, which allows for better
     * object isolation.
     *
     * This base class defines the behaviour of a scene as it applies to a game; you should subclass it to
     * implement your own specific handling as needed.
     */
    class Scene {
        /**
         * The name of the scene, as set from the constructor. This is essentially just for debugging
         * purposes.
         *
         * @type {string}
         */
        protected _name: string;
        /**
         * The stage that this scene is being displayed to. This is a reference to the stage given at the
         * time that the scene was created.
         *
         * @type {Stage}
         */
        protected _stage: Stage;
        /**
         * The renderer that should be used to render this scene. This comes from the stage that we're
         * given, but we use it so often that we cache its value.
         *
         * @type {Renderer}
         */
        protected _renderer: Renderer;
        /**
         * The list of all actors that are currently associated with this scene. These actors will get
         * their update and render methods called by the base implementation of the scene class.
         *
         * @type {Array<Actor>}
         */
        protected _actorList: Array<Actor>;
        /**
         * Construct a new scene instances that has the given name and is managed by the provided stage.
         *
         * The new scene starts with an empty actor list.
         *
         * @param name the name of this scene for debug purposes
         * @param stage the stage that manages this scene
         * @constructor
         */
        constructor(name: string, stage: Stage);
        /**
         * This method is invoked at the start of every game frame to allow this scene to update the state of
         * all objects that it contains.
         *
         * This base version invokes the update method for all actors that are currently registered with the
         * scene.
         *
         * @param tick the game tick; this is a count of how many times the game loop has executed
         */
        update(tick: number): void;
        /**
         * This method is invoked every frame after the update() method is invoked to allow this scene to
         * render to the stage everything that it visually wants to appear.
         *
         * This base version invokes the render method for all actors that are currently registered with the
         * stage.
         */
        render(): void;
        /**
         * This method is invoked when this scene is becoming the active scene in the game. This can be used
         * to initialize (or re-initialize) anything in this scene that should be reset when it becomes
         * active.
         *
         * This gets invoked after the current scene is told that it is deactivating. The parameter passed in
         * is the scene that was previously active. This will be null if this is the first ever scene in the
         * game.
         *
         * The next call made of the scene will be its update method for the next frame.
         *
         * @param previousScene the previous scene, if any (the very first scene change in the game has no
         * previous scene)
         */
        activating(previousScene: Scene): void;
        /**
         * This method is invoked when this scene is being deactivated in favor of a different scene. This can
         * be used to persist any scene state or do any other house keeping.
         *
         * This gets invoked before the next scene gets told that it is becoming active. The parameter
         * passed in is the scene that will become active.
         *
         * @param nextScene the scene that is about to become active
         */
        deactivating(nextScene: Scene): void;
        /**
         * Add an actor to the list of actors that exist in this scene. This will cause the scene to
         * automatically invoke the update and render methods on this actor while this scene is active.
         *
         * @param actor the actor to add to the scene
         * @see Scene.addActorArray
         */
        addActor(actor: Actor): void;
        /**
         * Add all of the actors from the passed in array to the list of actors that exist in this scene. This
         * will cause the scene to automatically invoke the update and render methods on these actors while
         * the scene is active.
         *
         * @param actorArray the list of actors to add
         * @see Scene.addActorArray
         */
        addActorArray(actorArray: Array<Actor>): void;
        /**
         * Return a list of actors whose position matches the position passed in. This is probably most useful
         * when actors are at rigidly defined locations, such as in a tile based game. Note that this
         * checks the world position of the actor and not its map position.
         *
         * @param location the location to search for actors at, in world coordinates
         * @returns {Array<Actor>} the actors found at the given location, which may be none
         * @see Scene.actorsAtXY
         * @see Scene.actorsAtMap
         * @see Scene.actorsAtMapXY
         */
        actorsAt(location: Point): Array<Actor>;
        /**
         * Return a list of actors whose position matches the position passed in. This is probably most useful
         * when actors are at rigidly defined locations, such as in a tile based game. Note that this
         * checks the world position of the actor and not its map position.
         *
         * @param x the x coordinate to search for actors at, in world coordinates
         * @param y the y coordinate to search for actors at, in world coordinates
         * @returns {Array<Actor>} the actors found at the given location, which may be none
         * @see Scene.actorsAt
         * @see Scene.actorsAtMap
         * @see Scene.actorsAtMapXY
         */
        actorsAtXY(x: number, y: number): Array<Actor>;
        /**
         * Return a list of actors whose position matches the position passed in. This checks the map
         * position of entities, and so is probably more useful than actorsAt() is in the general case. In
         * particular, since the map position and the world position are maintained, this lets you find
         * entities that are positioned anywhere within the tile grid.
         *
         * @param location the location to search for actors at, in map coordinates
         *
         * @returns {Array<Actor>} the actors found at the given location, which may be none
         * @see Scene.actorsAt
         * @see Scene.actorsAtXY
         * @see Scene.actorsAtMapXY
         */
        actorsAtMap(location: Point): Array<Actor>;
        /**
         * Return a list of actors whose position matches the position passed in. This checks the map
         * position of entities, and so is probably more useful than actorsAtXY() is in the general case. In
         * particular, since the map position and the world position are maintained, this lets you find
         * entities that are positioned anywhere within the tile grid.
         *
         * @param x the x coordinate to search for actors at, in map coordinates
         * @param y the y coordinate to search for actors at, in map coordinates
         * @returns {Array<Actor>} the actors found at the given location, which may be none
         * @see Scene.actorsAt
         * @see Scene.actorsAtXY
         * @see Scene.actorsAtMap
         */
        actorsAtMapXY(x: number, y: number): Array<Actor>;
        /**
         * This method will sort all of the actors that are currently attached to the scene by their current
         * internal Z-Order value, so that when they are iterated for rendering/updates, they get handled in
         * an appropriate order.
         *
         * Note that the sort used is not stable.
         */
        sortActors(): void;
        /**
         * This gets triggered while the game is running, this scene is the current scene, and a key has been
         * pressed down.
         *
         * The method should return true if the key event was handled or false if it was not. The Stage will
         * prevent the default handling for all key events that are handled.
         *
         * The base scene method handles this by intercepting F5 to take a screenshot with default settings;
         * you can chain to the super to inherit this behaviour if desired.
         *
         * @param eventObj the event object
         * @returns {boolean} true if the key event was handled, false otherwise
         */
        inputKeyDown(eventObj: KeyboardEvent): boolean;
        /**
         * This gets triggered while the game is running, this scene is the current scene, and a key has been
         * released.
         *
         * The method should return true if the key event was handled or false if it was not. The Stage will
         * prevent the default handling for all key events that are handled.
         *
         * @param eventObj the event object
         * @returns {boolean} true if the key event was handled, false otherwise
         */
        inputKeyUp(eventObj: KeyboardEvent): boolean;
        /**
         * This gets triggered while the game is running, this scene is the current scene, and the mouse
         * moves over the stage.
         *
         * The method should return true if the mouse event was handled or false if it was not. The Stage
         * will prevent the default handling for all mouse events that are handled.
         *
         * @param eventObj the event object
         * @returns {boolean} true if the mouse event was handled, false otherwise
         * @see Stage.calculateMousePos
         */
        inputMouseMove(eventObj: MouseEvent): boolean;
        /**
         * This gets triggered while the game is running, this scene is the current scene, and a mouse button
         * is clicked on the stage. This triggers after the mouse has been pressed and then released, two
         * events you can capture separately if desired.
         *
         * The method should return true if the mouse event was handled or false if it was not. The Stage
         * will prevent the default handling for all mouse events that are handled.
         *
         * @param eventObj the event object
         * @returns {boolean} true if the mouse event was handled, false otherwise
         * @see Stage.calculateMousePos
         * @see Stage.inputMouseDown
         * @see Stage.inputMouseUp
         */
        inputMouseClick(eventObj: MouseEvent): boolean;
        /**
         * This gets triggered while the game is running, this scene is the current scene, and a mouse button
         * is pressed on the stage. This will only trigger once, to let you know that the mouse button was
         * depressed. There is a separate event to track when the mouse button is released or clicked.
         *
         * The method should return true if the mouse event was handled or false if it was not. The Stage
         * will prevent the default handling for all mouse events that are handled.
         *
         * @param eventObj the event object
         * @returns {boolean} true if the mouse event was handled, false otherwise
         * @see Stage.calculateMousePos
         * @see Stage.inputMouseUp
         * @see Stage.inputMouseClick
         */
        inputMouseDown(eventObj: MouseEvent): boolean;
        /**
         * This gets triggered while the game is running, this scene is the current scene, and a mouse button
         * is released.
         *
         * Unlike the other mouse events, this gets triggered even if the mouse cursor is not currently
         * over the stage. This allows you to detect when a mouse button is released after it was pressed
         * even if the mouse exits the stage in the interim.
         *
         * As a result of the above, when calculating the mouse position, the position reported is outside
         * of the bounds of the stage if the mouse was outside the stage at the time; either negative or
         * larger than the extends, depending on the relative position.
         *
         * The method should return true if the mouse event was handled or false if it was not. The Stage
         * will prevent the default handling for all mouse events that are handled.
         *
         * @param eventObj the event object
         * @returns {boolean} true if the mouse event was handled, false otherwise
         * @see Stage.calculateMousePos
         */
        inputMouseUp(eventObj: MouseEvent): boolean;
        /**
         * This gets triggered while the game is running, this scene is the current scene, and the mouse
         * is double clicked on the stage.
         *
         * NOTE: As the browser does not know if a click is a single or double click, this event, when
         * delivered, is followed by two back to back single click events. Thus if you wish to handle
         * single and double clicks your code needs to take care. In this case you may want to do your own
         * double click handling.
         *
         * The method should return true if the mouse event was handled or false if it was not. The Stage
         * will prevent the default handling for all mouse events that are handled.
         *
         * @param eventObj the event object
         * @returns {boolean} true if the mouse event was handled, false otherwise
         * @see Stage.calculateMousePos
         */
        inputMouseDblClick(eventObj: MouseEvent): boolean;
        /**
         * This gets triggered while the game is running, this scene is the current scene, and the mouse
         * wheel is rolled while the mouse is over the stage.
         *
         * NOTE: Older browsers may not support this event (e.g. older versions of Chrome); it's also not
         * portable to mobile, if that matters.
         *
         * The method should return true if the mouse event was handled or falss if it was not. The Stage
         * will prevent the default handling for all mouse events that are handled.
         *
         * @param eventObj the event object
         * @returns {boolean} true if the mouse event was handled, false otherwise

         * @returns {boolean}
         */
        inputMouseWheel(eventObj: MouseWheelEvent): boolean;
        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString(): string;
    }
}
declare module nurdz.game {
    /**
     * This enum is used in the drawArrow method to determine what end of the line that makes up the arrow
     * a head should be drawn at.
     */
    enum ArrowType {
        /**
         * Neither end of the line should have an arrow head. This is just basically a slightly more
         * expensive call to draw a simple line.
         */
        NONE = 0,
        /**
         * The end of the line should have an arrowhead.
         */
        END = 1,
        /**
         * The start of the line should have an arrowhead.
         */
        START = 2,
        /**
         * Both ends of the line should have an arrowhead.
         */
        BOTH = 3,
    }
    /**
     * This enum is used in the drawArrow method to determine what kind of arrow head to render onto the
     * arrow.
     *
     * Most of these provide an arrow with a curved head and just vary the method used to draw the curve,
     * which has subtle effects on how the curve appears.
     */
    enum ArrowStyle {
        /**
         * The arrowhead is curved using a simple arc.
         */
        ARC = 0,
        /**
         * The arrowhead has a straight line end
         */
        STRAIGHT = 1,
        /**
         * The arrowhead is unfilled with no end (it looks like a V)
         */
        UNFILLED = 2,
        /**
         * The arrowhead is curved using a quadratic curve.
         */
        QUADRATIC = 3,
        /**
         * The arrowhead is curbed using a bezier curve
         */
        BEZIER = 4,
    }
    /**
     * This represents a point in a polygon as defined by the Polygon API.
     *
     * In the general case, this is just an array of two numbers in X,Y order. These elements can optionally
     * be preceded by a string which describes what to do with the point:
     *   - 'm' executes a moveTo() for this point, for repositioning where the polygon lines start from
     *   - 'l' executes a lineTo() for this point, connecting this point with where the last polygon line
     *      ended.
     *   - 'c' executes a closePath(), to close off this sub path and start a new one.
     *
     * In practice, most points are going to be of the lineTo variety, and so the default if no string
     * element is present in the array is 'l'. However, as a special case, if the first point in a Polygon
     * does not have a string member, it is assumed to be an 'm' for a moveTo() and not an 'l' for a
     * lineTo(). This allows for a polygon to be self contained in an easier manner.
     *
     * Note that this point uses an array and not a Point instance because most polygons will probably be
     * defined as a static array and these are easier to construct. However, the Point class can turn
     * itself into an array representation.
     *
     * @see Point.toArray
     * @see Polygon
     */
    type PolygonPoint = Array<number | string>;
    /**
     * This is a simple type that represents a polygon to be rendered or stroked. This is an array of
     * Point specifications that describe the polygon.
     *
     * The last point will implicitly connect to the first point when rendered, so it is not necessary to
     * include an end point that "closes" the polygon except in cases where you don't want the polygon to
     * end back where it started.
     *
     * @see PolygonPoint
     */
    type Polygon = Array<PolygonPoint>;
    /**
     * This interface determines the rendering capabilities of the engine. Some class needs to be plugged
     * into the Stage that implements this interface.
     */
    interface Renderer {
        /**
         * Obtain the width of the render area, in pixels. This should match the appropriate dimension of
         * the Stage.
         *
         * @returns {number} the width of the render area in pixels.
         */
        width: number;
        /**
         * Obtain the width of the render area, in pixels. This should match the appropriate dimension of
         * the Stage.
         *
         * @returns {number} the height of the render area in pixels.
         */
        height: number;
        /**
         * Clear the entire rendering area with the provided color.
         *
         * @param color the color to clear the stage with.
         */
        clear(color: string): void;
        /**
         * Render a filled rectangle with its upper left corner at the position provided and with the provided
         * dimensions.
         *
         * @param x X location of the upper left corner of the rectangle
         * @param y Y location of the upper left corner of the rectangle
         * @param width width of the rectangle to render
         * @param height height of the rectangle to render
         * @param color the color to fill the rectangle with
         */
        fillRect(x: number, y: number, width: number, height: number, color: string): void;
        /**
         * Render an outlined rectangle with its upper left corner at the position provided and with the
         * provided dimensions.
         *
         * @param x X location of the upper left corner of the rectangle
         * @param y Y location of the upper left corner of the rectangle
         * @param width width of the rectangle to render
         * @param height height of the rectangle to render
         * @param color the color to stroke the rectangle with
         * @param lineWidth the thickness of the line to stroke with
         */
        strokeRect(x: number, y: number, width: number, height: number, color: string, lineWidth: number): void;
        /**
         * Render a filled circle with its center at the position provided.
         *
         * @param x X location of the center of the circle
         * @param y Y location of the center of the circle
         * @param radius radius of the circle to draw
         * @param color the color to fill the circle with
         */
        fillCircle(x: number, y: number, radius: number, color: string): void;
        /**
         * Render a stroked circle with its center at the position provided.
         *
         * @param x X location of the center of the circle
         * @param y Y location of the center of the circle
         * @param radius radius of the circle to draw
         * @param color the color to stroke the circle with
         * @param lineWidth the thickness of the line to stroke with
         */
        strokeCircle(x: number, y: number, radius: number, color: string, lineWidth: number): void;
        /**
         * Render an arbitrary polygon by connecting all of the points provided in the polygon and then
         * filling the result.
         *
         * The points should be in the polygon in clockwise order.
         *
         * @param pointList the list of points that describe the polygon to render.
         * @param color the color to fill the polygon with.
         */
        fillPolygon(pointList: Polygon, color: string): void;
        /**
         * Render an arbitrary polygon by connecting all of the points provided in the polygon and then
         * stroking the result.
         *
         * The points should be in the polygon in clockwise order.
         *
         * @param pointList the list of points that describe the polygon to render.
         * @param color the color to fill the polygon with.
         * @param lineWidth the thickness of the line to stroke with
         */
        strokePolygon(pointList: Polygon, color: string, lineWidth: number): void;
        /**
         * This helper method sets all of the styles necessary for rendering lines. This can be called before
         * drawing operations as a convenience to set all desired values in one call.
         *
         * NOTE: The values set here *do not* persist unless you never change them anywhere else. This
         * includes setting arrow styles.
         *
         * @param color the color to draw lines with
         * @param lineWidth] the pixel width of rendered lines
         * @param lineCap the line cap style to use for rendering lines
         * @see Render.setArrowStyle
         */
        setLineStyle(color: string, lineWidth: number, lineCap: string): void;
        /**
         * Set the style for all subsequent drawArrow() calls to use when drawing arrows. This needs to be
         * called prior to drawing any arrows; the value does not persist. In particular, changing line
         * styles may also change arrow style.
         *
         * @param color the color to draw an arrow with
         * @param lineWidth the width of the arrow line
         * @see Render.setLineStyle
         */
        setArrowStyle(color: string, lineWidth: number): void;
        /**
         * The basis of this code comes from:
         *     http://www.dbp-consulting.com/tutorials/canvas/CanvasArrow.html
         *
         * It has been modified to fit here, which includes things like assuming nobody is going to pass
         * strings, different method for specifying defaults, etc.
         *
         * This will render a line from x1,y1 to x2,y2 and then draw an arrow head on one or both ends of the
         * line in a few different styles.
         *
         * The which parameter determine which ends of the line get arrow heads drawn and the style
         * parameter controls what the drawn arrow head looks like.
         *
         * It is also possible to specify the angle that the arrow head makes from the end of the line and the
         * length of the sides of the arrow head.
         *
         * The arrow is drawn using the style set by setArrowStyle(), which is a combination of a stoke and
         * fill color and a line width.
         *
         * @param x1 the X coordinate of the start of the line
         * @param y1 the Y coordinate of the start of the line
         * @param x2 the X coordinate of the end of the line
         * @param y2 the Y coordinate of the end of the line
         * @param style the style of the arrowhead
         * @param which the end of the line that gets the arrow head(s)
         * @param angle the angle the arrow head makes from the end of the line
         * @param d the length (in pixels) of the edges of the arrow head
         * @see Render.setArrowStyle
         */
        drawArrow(x1: number, y1: number, x2: number, y2: number, style: ArrowStyle, which: ArrowType, angle: number, d: number): void;
        /**
         * Display text at the position provided. How the the text anchors to the point provided needs to be
         * set by you prior to calling. By default, the location specified is the top left corner.
         *
         * This method will set the color to the color provided but all other font properties will be as they
         * were last set (whenever that was).
         *
         * @param text the text to draw
         * @param x X location of the text
         * @param y Y location of the text
         * @param color the color to draw the text with
         */
        drawTxt(text: string, x: number, y: number, color: string): void;
        /**
         * Displays a bitmap to the rendering area such that its upper left corner is at the point provided.
         *
         * @param bitmap the bitmap to display
         * @param x X location to display the bitmap at
         * @param y Y location to display the bitmap at
         * @see Stage.blitPart
         * @see Stage.blitCentered
         * @see Stage.blitPartCentered
         * @see Stage.blitPartCenteredRotated
         * @see Stage.blitCenteredRotated
         */
        blit(bitmap: HTMLImageElement, x: number, y: number): void;
        /**
         * Displays a bitmap to the rendering area such that its center is at the point provided.
         *
         * @param bitmap the bitmap to display
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @see Stage.blit
         * @see Stage.blitPart
         * @see Stage.blitPartCentered
         * @see Stage.blitPartCenteredRotated
         * @see Stage.blitCenteredRotated
         */
        blitCentered(bitmap: HTMLImageElement, x: number, y: number): void;
        /**
         * Display a bitmap to the rendering area such that its center is at the point provided. The bitmap is
         * also rotated according to the rotation value, which is an angle in degrees.
         *
         * @param bitmap the bitmap to display
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @param angle the angle to rotate the bitmap to (in degrees)
         * @see Stage.blit
         * @see Stage.blitPart
         * @see Stage.blitCentered
         * @see Stage.blitPartCentered
         * @see Stage.blitPartCenteredRotated
         */
        blitCenteredRotated(bitmap: HTMLImageElement, x: number, y: number, angle: number): void;
        /**
         * Acts as blit() does, but instead of rendering the entire image, only a portion is displayed.
         * Specifically, an area of size width * height originating at offsX, offsY is displayed.
         *
         * @param bitmap the bitmap to display from
         * @param x X location to display at
         * @param y Y location to display at
         * @param offsX X offset in bitmap of area to blit
         * @param offsY Y offset in bitmap of area to blit
         * @param width width of bitmap area to display
         * @param height height of bitmap area to display
         * @see Stage.blit
         * @see Stage.blitCentered
         * @see Stage.blitPartCentered
         * @see Stage.blitPartCenteredRotated
         * @see Stage.blitCenteredRotated
         */
        blitPart(bitmap: HTMLImageElement, x: number, y: number, offsX: number, offsY: number, width: number, height: number): void;
        /**
         * Acts as blitCentered() does, but instead of rendering the entire image, only a portion is
         * displayed. Specifically, an area of size width * height originating at offsX, offsY is displayed.
         *
         * @param bitmap the bitmap to display from
         * @param x the center oX location to display at
         * @param y the center Y location to display at
         * @param offsX X offset in bitmap of area to blit
         * @param offsY Y offset in bitmap of area to blit
         * @param width width of bitmap area to display
         * @param height height of bitmap area to display
         * @see Stage.blit
         * @see Stage.blitPart
         * @see Stage.blitCentered
         * @see Stage.blitPartCenteredRotated
         * @see Stage.blitCenteredRotated
         */
        blitPartCentered(bitmap: HTMLImageElement, x: number, y: number, offsX: number, offsY: number, width: number, height: number): void;
        /**
         * Acts as blitCenteredRotated() does, but instead of rendering the entire image, only a portion is
         * displayed. Specifically, an area of size width * height originating at offsX, offsY is displayed.
         *
         * @param bitmap the bitmap to display from
         * @param x the center oX location to display at
         * @param y the center Y location to display at
         * @param angle the angle to rotate the bitmap to (in degrees)
         * @param offsX X offset in bitmap of area to blit
         * @param offsY Y offset in bitmap of area to blit
         * @param width width of bitmap area to display
         * @param height height of bitmap area to display
         * @see Stage.blit
         * @see Stage.blitPart
         * @see Stage.blitCentered
         * @see Stage.blitPartCentered
         * @see Stage.blitCenteredRotated
         */
        blitPartCenteredRotated(bitmap: HTMLImageElement, x: number, y: number, angle: number, offsX: number, offsY: number, width: number, height: number): void;
        /**
         * Displays a sprite to the rendering area such that its upper left corner is at the point provided.
         *
         * @param sheet the sprite sheet containing the sprite to display
         * @param sprite the index of the sprite in the sprite sheet
         * @param x X location to display the bitmap at
         * @param y Y location to display the bitmap at
         * @see Stage.blitSpriteCentered
         * @see Stage.blitSpriteCenteredRotated
         */
        blitSprite(sheet: SpriteSheet, sprite: number, x: number, y: number): void;
        /**
         * Displays a sprite to the rendering area such that its center is at the point provided.
         *
         * @param sheet the sprite sheet containing the sprite to display
         * @param sprite the index of the sprite in the sprite sheet
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @see Stage.blitSprite
         * @see Stage.blitSpriteCenteredRotated
         */
        blitSpriteCentered(sheet: SpriteSheet, sprite: number, x: number, y: number): void;
        /**
         * Display a sprite to the rendering area such that its center is at the point provided. The sprite is
         * also rotated according to the rotation value, which is an angle in degrees.
         *
         * @param sheet the sprite sheet containing the sprite to display
         * @param sprite the index of the sprite in the sprite sheet
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @param angle the angle to rotate the bitmap to (in degrees)
         * @see Stage.blitSprite
         * @see Stage.blitSpriteCenteredRotated
         */
        blitSpriteCenteredRotated(sheet: SpriteSheet, sprite: number, x: number, y: number, angle: number): void;
        /**
         * Do an (optional) translation and (optional) rotation of the rendering area. You can perform one or
         * both operations. This implicitly saves the current state on a stack so that it can be restored
         * later via a call to restore().
         *
         * When both an X and a Y value are provided, the rendering area is translated so that the origin is
         * moved in the translation direction given. One or both values can be null to indicate that no
         * translation is desired. Note that both X and Y have to be provided for a translation to happen.
         *
         * When the angle is not null, the rendering area is rotated by that many degrees around the
         * origin such that any further rendering will appear rotated.
         *
         * The order of operations is always translation first and rotation second, because once the rotation
         * happens, the direction of the axes are no longer what you expect. In particular this means that
         * you should be careful about invoking this function when the rendering area has already been
         * translated and/or rotated.
         *
         * Note that the current translation and rotation of the rendering area is held on a stack, so every
         * call to this method needs to be balanced with a call to the restore() method.
         *
         * @param x the amount to translate on the X axis or null for no translation
         * @param y the amount to translate on the Y axis or null for no translation
         * @param angle the angle to rotate the rendering area, in degrees or null for no translation
         * @see Render.restore
         */
        translateAndRotate(x: number, y: number, angle: number): void;
        /**
         * Restore the canvas state that was in effect the last time that translateAndRotate was invoked. This
         * needs to be invoked the same number of times as that function was invoked because the canvas state
         * is stored on a stack.
         *
         * @see Render.translateAndRotate
         */
        restore(): void;
    }
}
declare module nurdz.game {
    /**
     * This class represents the stage area in the page, which is where the game renders itself.
     *
     * The class knows how to create the stage and do some rendering. This is also where the core
     * rendering loop is contained.
     */
    class CanvasRenderer implements Renderer {
        /**
         * The rendering context for our canvas. This is the gateway to rendering magic.
         *
         * @type {CanvasRenderingContext2D}
         */
        private _canvasContext;
        /**
         * The width of the stage, in pixels. This is set at creation time and cannot change.
         *
         * @type {number} the width of the stage area in pixels
         */
        width: number;
        /**
         * The height of the stage, in pixels. This is set at creation time and cannot change.
         *
         * @type {number} the height of the stage area in pixels
         */
        height: number;
        /**
         * Get the underlying rendering context for the stage.
         *
         * @returns {CanvasRenderingContext2D} the underlying rendering context for the stage
         */
        context: CanvasRenderingContext2D;
        /**
         * Construct an instance of the class that knows how to render to the canvas provided. All
         * rendering will be performed by this canvas.
         *
         * This class assumes that the canvas is the entire size of the stage.
         *
         * @param canvas the canvas to use for rendering
         */
        constructor(canvas: HTMLCanvasElement);
        /**
         * Clear the entire rendering area with the provided color.
         *
         * @param color the color to clear the stage with.
         */
        clear(color?: string): void;
        /**
         * Render a filled rectangle with its upper left corner at the position provided and with the provided
         * dimensions.
         *
         * @param x X location of the upper left corner of the rectangle
         * @param y Y location of the upper left corner of the rectangle
         * @param width width of the rectangle to render
         * @param height height of the rectangle to render
         * @param color the color to fill the rectangle with
         */
        fillRect(x: number, y: number, width: number, height: number, color: string): void;
        /**
         * Render an outlined rectangle with its upper left corner at the position provided and with the
         * provided dimensions.
         *
         * @param x X location of the upper left corner of the rectangle
         * @param y Y location of the upper left corner of the rectangle
         * @param width width of the rectangle to render
         * @param height height of the rectangle to render
         * @param color the color to stroke the rectangle with
         * @param lineWidth the thickness of the line to stroke with
         */
        strokeRect(x: number, y: number, width: number, height: number, color: string, lineWidth?: number): void;
        /**
         * Render a filled circle with its center at the position provided.
         *
         * @param x X location of the center of the circle
         * @param y Y location of the center of the circle
         * @param radius radius of the circle to draw
         * @param color the color to fill the circle with
         */
        fillCircle(x: number, y: number, radius: number, color: string): void;
        /**
         * Render a stroked circle with its center at the position provided.
         *
         * @param x X location of the center of the circle
         * @param y Y location of the center of the circle
         * @param radius radius of the circle to draw
         * @param color the color to stroke the circle with
         * @param lineWidth the thickness of the line to stroke with
         */
        strokeCircle(x: number, y: number, radius: number, color: string, lineWidth?: number): void;
        /**
         * Perform the job of executing the commands that will render the polygon points listed.
         *
         * This begins a path, executes all of the commands, and then returns. It is up to the color to
         * set any styles needed and stroke or fill the path as desired.
         *
         * @param pointList the polygon to do something with.
         */
        private renderPolygon(pointList);
        /**
         * Render an arbitrary polygon by connecting all of the points provided in the polygon and then
         * filling the result.
         *
         * The points should be in the polygon in clockwise order.
         *
         * @param pointList the list of points that describe the polygon to render.
         * @param color the color to fill the polygon with.
         */
        fillPolygon(pointList: Polygon, color: string): void;
        /**
         * Render an arbitrary polygon by connecting all of the points provided in the polygon and then
         * stroking the result.
         *
         * The points should be in the polygon in clockwise order.
         *
         * @param pointList the list of points that describe the polygon to render.
         * @param color the color to fill the polygon with.
         * @param lineWidth the thickness of the line to stroke with
         */
        strokePolygon(pointList: Polygon, color: string, lineWidth?: number): void;
        /**
         * This helper method sets all of the styles necessary for rendering lines to the stage. This can be
         * called before drawing operations as a convenience to set all desired values in one call.
         *
         * NOTE: The values set here *do not* persist unless you never change them anywhere else. This
         * includes setting arrow styles.
         *
         * @param color the color to draw lines with
         * @param lineWidth] the pixel width of rendered lines
         * @param lineCap the line cap style to use for rendering lines
         * @see Render.setArrowStyle
         */
        setLineStyle(color: string, lineWidth?: number, lineCap?: string): void;
        /**
         * This helper method draws the actual arrow head onto the canvas for a line. It assumes that all
         * styles have been set.
         *
         * The original drawArrow code allows its style parameter to be an instance of a function with this
         * signature to allow for custom arrow drawing, but that was removed.
         *
         * The function takes three sets of coordinates, which represent the endpoint of the line that the
         * arrow head is being drawn for (which is where the tip of the arrow should be), and the two
         * endpoints for the ends of the arrow head. These three points connected together form the arrow
         * head, though you are free to join them in any way you like (lines, arcs, etc).
         *
         * @param x0 the X coordinate of the left end of the arrow head line
         * @param y0 the Y coordinate of the left end of the arrow head line
         * @param x1 the X coordinate of the end of the line
         * @param y1 the Y coordinate of the end of the line
         * @param x2 the X coordinate of the right end of the arrow head line
         * @param y2 the Y coordinate of the right end of the arrow head line
         * @param style the style of arrow to drw
         */
        private drawHead(x0, y0, x1, y1, x2, y2, style);
        /**
         * Set the style for all subsequent drawArrow() calls to use when drawing arrows. This needs to be
         * called prior to drawing any arrows to ensure that the canvas style used to draw arrows is updated;
         * the value does not persist. In particular, changing line styles will also change this.
         *
         * @param color the color to draw an arrow with
         * @param lineWidth the width of the arrow line
         * @see Render.setLineStyle
         */
        setArrowStyle(color: string, lineWidth?: number): void;
        /**
         * The basis of this code comes from:
         *     http://www.dbp-consulting.com/tutorials/canvas/CanvasArrow.html
         *
         * It has been modified to fit here, which includes things like assuming nobody is going to pass
         * strings, different method for specifying defaults, etc.
         *
         * This will render a line from x1,y1 to x2,y2 and then draw an arrow head on one or both ends of the
         * line in a few different styles.
         *
         * The style parameter can be one of the following values:
         *   0: Arrowhead with an arc end
         *   1: Arrowhead with a straight line end
         *   2: Arrowhead that is unfilled with no end (looks like a V)
         *   3: Arrowhead with a quadratic curve end
         *   4: Arrowhead with a bezier curve end
         *
         * The which parameter indicates which end of the line gets an arrow head. This is a bit field where
         * the first bit indicates the end of the line and the second bit indicates the start of the line.
         *
         * It is also possible to specify the angle that the arrow head makes from the end of the line and the
         * length of the sides of the arrow head.
         *
         * The arrow is drawn using the style set by setArrowStyle(), which is a combination of a stoke and
         * fill color and a line width.
         *
         * @param x1 the X coordinate of the start of the line
         * @param y1 the Y coordinate of the start of the line
         * @param x2 the X coordinate of the end of the line
         * @param y2 the Y coordinate of the end of the line
         * @param style the style of the arrowhead
         * @param which the end of the line that gets the arrow head(s)
         * @param angle the angle the arrow head makes from the end of the line
         * @param d the length (in pixels) of the edges of the arrow head
         * @see Render.setArrowStyle
         */
        drawArrow(x1: number, y1: number, x2: number, y2: number, style?: ArrowStyle, which?: ArrowType, angle?: number, d?: number): void;
        /**
         * Display text to the stage at the position provided. How the the text anchors to the point provided
         * needs to be set by you prior to calling. By default, the location specified is the top left
         * corner.
         *
         * This method will set the color to the color provided but all other font properties will be as they
         * were last set for the canvas.
         *
         * @param text the text to draw
         * @param x X location of the text
         * @param y Y location of the text
         * @param color the color to draw the text with
         */
        drawTxt(text: string, x: number, y: number, color: string): void;
        /**
         * Displays a bitmap to the rendering area such that its upper left corner is at the point provided.
         *
         * @param bitmap the bitmap to display
         * @param x X location to display the bitmap at
         * @param y Y location to display the bitmap at
         * @see Stage.blitPart
         * @see Stage.blitCentered
         * @see Stage.blitPartCentered
         * @see Stage.blitPartCenteredRotated
         * @see Stage.blitCenteredRotated
         */
        blit(bitmap: HTMLImageElement, x: number, y: number): void;
        /**
         * Displays a bitmap to the rendering area such that its center is at the point provided.
         *
         * @param bitmap the bitmap to display
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @see Stage.blit
         * @see Stage.blitPart
         * @see Stage.blitPartCentered
         * @see Stage.blitPartCenteredRotated
         * @see Stage.blitCenteredRotated
         */
        blitCentered(bitmap: HTMLImageElement, x: number, y: number): void;
        /**
         * Display a bitmap to the rendering area such that its center is at the point provided. The bitmap is
         * also rotated according to the rotation value, which is an angle in degrees.
         *
         * @param bitmap the bitmap to display
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @param angle the angle to rotate the bitmap to (in radians)
         * @see Stage.blit
         * @see Stage.blitPart
         * @see Stage.blitCentered
         * @see Stage.blitPartCentered
         * @see Stage.blitPartCenteredRotated
         */
        blitCenteredRotated(bitmap: HTMLImageElement, x: number, y: number, angle: number): void;
        /**
         * Acts as blit() does, but instead of rendering the entire image, only a portion is displayed.
         * Specifically, an area of size width * height originating at offsX, offsY is displayed.
         *
         * @param bitmap the bitmap to display from
         * @param x X location to display at
         * @param y Y location to display at
         * @param offsX X offset in bitmap of area to blit
         * @param offsY Y offset in bitmap of area to blit
         * @param width width of bitmap area to display
         * @param height height of bitmap area to display
         * @see Stage.blit
         * @see Stage.blitCentered
         * @see Stage.blitPartCentered
         * @see Stage.blitPartCenteredRotated
         * @see Stage.blitCenteredRotated
         */
        blitPart(bitmap: HTMLImageElement, x: number, y: number, offsX: number, offsY: number, width: number, height: number): void;
        /**
         * Acts as blitCentered() does, but instead of rendering the entire image, only a portion is
         * displayed. Specifically, an area of size width * height originating at offsX, offsY is displayed.
         *
         * @param bitmap the bitmap to display from
         * @param x the center oX location to display at
         * @param y the center Y location to display at
         * @param offsX X offset in bitmap of area to blit
         * @param offsY Y offset in bitmap of area to blit
         * @param width width of bitmap area to display
         * @param height height of bitmap area to display
         * @see Stage.blit
         * @see Stage.blitPart
         * @see Stage.blitCentered
         * @see Stage.blitPartCenteredRotated
         * @see Stage.blitCenteredRotated
         */
        blitPartCentered(bitmap: HTMLImageElement, x: number, y: number, offsX: number, offsY: number, width: number, height: number): void;
        /**
         * Acts as blitCenteredRotated() does, but instead of rendering the entire image, only a portion is
         * displayed. Specifically, an area of size width * height originating at offsX, offsY is displayed.
         *
         * @param bitmap the bitmap to display from
         * @param x the center oX location to display at
         * @param y the center Y location to display at
         * @param angle the angle to rotate the bitmap to (in radians)
         * @param offsX X offset in bitmap of area to blit
         * @param offsY Y offset in bitmap of area to blit
         * @param width width of bitmap area to display
         * @param height height of bitmap area to display
         * @see Stage.blit
         * @see Stage.blitPart
         * @see Stage.blitCentered
         * @see Stage.blitPartCentered
         * @see Stage.blitCenteredRotated
         */
        blitPartCenteredRotated(bitmap: HTMLImageElement, x: number, y: number, angle: number, offsX: number, offsY: number, width: number, height: number): void;
        /**
         * Displays a sprite to the rendering area such that its upper left corner is at the point provided.
         *
         * @param sheet the sprite sheet containing the sprite to display
         * @param sprite the index of the sprite in the sprite sheet
         * @param x X location to display the bitmap at
         * @param y Y location to display the bitmap at
         * @see Stage.blitSpriteCentered
         * @see Stage.blitSpriteCenteredRotated
         */
        blitSprite(sheet: SpriteSheet, sprite: number, x: number, y: number): void;
        /**
         * Displays a sprite to the rendering area such that its center is at the point provided.
         *
         * @param sheet the sprite sheet containing the sprite to display
         * @param sprite the index of the sprite in the sprite sheet
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @see Stage.blitSprite
         * @see Stage.blitSpriteCenteredRotated
         */
        blitSpriteCentered(sheet: SpriteSheet, sprite: number, x: number, y: number): void;
        /**
         * Display a sprite to the rendering area such that its center is at the point provided. The sprite is
         * also rotated according to the rotation value, which is an angle in degrees.
         *
         * @param sheet the sprite sheet containing the sprite to display
         * @param sprite the index of the sprite in the sprite sheet
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @param angle the angle to rotate the bitmap to (in degrees)
         * @see Stage.blitSprite
         * @see Stage.blitSpriteCenteredRotated
         */
        blitSpriteCenteredRotated(sheet: SpriteSheet, sprite: number, x: number, y: number, angle: number): void;
        /**
         * Do an (optional) translation and (optional) rotation of the stage canvas. You can perform one or
         * both operations. This implicitly saves the current canvas state on a stack so that it can be
         * restored later via a call to restore().
         *
         * When both an X and a Y value are provided, the canvas is translated so that the origin is moved in
         * the translation direction given. One or both values can be null to indicate that no translation is
         * desired.
         *
         * When the angle is not null, the canvas is rotated by that many degrees around the origin.
         *
         * The order of operations is always translation first and rotation second, because once the rotation
         * happens, the direction of the axes are no longer what you expect. In particular this means that you
         * should be careful about invoking this function when the canvas has already been translated and/or
         * rotated.
         *
         * Note that the current translation and rotation of the canvas is held on a stack, so every call to
         * this method needs to be balanced with a call to the restore() method.
         *
         * @param x the amount to translate on the X axis or null for no translation
         * @param y the amount to translate on the Y axis or null for no translation
         * @param angle the angle to rotate the canvas, in degrees or null for no translation
         * @see Render.restore
         */
        translateAndRotate(x?: number, y?: number, angle?: number): void;
        /**
         * Restore the canvas state that was in effect the last time that translateAndRotate was invoked. This
         * needs to be invoked the same number of times as that function was invoked because the canvas state
         * is stored on a stack.
         *
         * @see Render.translateAndRotate
         */
        restore(): void;
        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString(): string;
    }
}
declare module nurdz.game {
    /**
     * This class represents the stage area in the page, which is where the game renders itself.
     *
     * The class knows how to create the stage and do some rendering. This is also where the core
     * rendering loop is contained.
     */
    class Stage {
        /**
         * This string is used as the default screenshot filename base in the screenshot method if none is
         * specified.
         *
         * @see screenshot
         * @type {string}
         */
        static screenshotFilenameBase: string;
        /**
         * This string is used as the default window title for the screenshot window/tab if none is specified.
         *
         * @see screenshot
         * @type {string}
         */
        static screenshotWindowTitle: string;
        /**
         * The canvas that the stage renders itself to.
         *
         * @type {HTMLCanvasElement}
         */
        private _canvas;
        /**
         * The object responsible for rendering to our canvas.
         *
         * This is a simple wrapper around the canvas context and is the gateway to Rendering Magic (tm).
         *
         * @type {CanvasRenderingContext2D}
         */
        private _renderer;
        /**
         * The object that manages our list of scenes for us.
         *
         * @type {SceneManager}
         */
        private _sceneManager;
        /**
         * This is false when we have never told the preloader to preload, and true if we have. This is
         * used to guard against repeated attempts to preload.
         *
         * @type {boolean}
         */
        private _didPreload;
        /**
         * A list of all sound objects that are known to the stage, either because we were the proxy for
         * preloading them or because they were registered with us.
         *
         * This is the list of sounds that our API functions for sound can affect
         */
        private _knownSounds;
        /**
         * The width of the stage, in pixels. This is set at creation time and cannot change.
         *
         * @type {number} the width of the stage area in pixels
         */
        width: number;
        /**
         * The height of the stage, in pixels. This is set at creation time and cannot change.
         *
         * @type {number} the height of the stage area in pixels
         */
        height: number;
        /**
         * Get the underlying canvas object for the stage.
         *
         * @returns {HTMLCanvasElement} the underlying canvas element for the stage
         */
        canvas: HTMLCanvasElement;
        /**
         * Get the underlying rendering object for the stage. This is the object responsible for all
         * rendering on the stage.
         *
         * @returns {Renderer} the underlying rendering object for the stage
         */
        renderer: Renderer;
        /**
         * The stage keeps track of the current frame rate that the update loop is being called at, and this
         * returns the most recently calculated value. The value is recalculated once per second so that
         * it is always a near instantaneous read of the current fps and not an average over the life of
         * the game.
         *
         * @returns {Number} the current fps, which is o when the game is stopped orr just started
         */
        fps: number;
        /**
         * When the game is running (i.e. the run() method has been invoked), this indicates the tick
         * speed of the update loop, which is the parameter given to the run() method.
         *
         * While the game is not running, this returns 0 to indicate that the update loop is not being
         * called at all. THIS INCLUDES WHILE THE GAME IS STILL SETTING ITSELF UP PRIOR TO THE RUN METHOD
         * AND PRELOAD BEING COMPLETED! This means that you can only rely on this value while the game is
         * running and not during setup.
         *
         * This value is essentially the number of ticks per second that the update() method is invoked at.
         *
         * NOTE:
         *
         * @returns {number}
         * @see Stage.run
         */
        tickSpeed: number;
        /**
         * Determine what scene is the current scene on this stage.
         *
         * @returns {Scene}
         */
        currentScene: Scene;
        /**
         * Obtain the current engine update tick. This is incremented once every time the frame update
         * loop is invoked, and can be used to time things in a crude fashion.
         *
         * The frame update loop is invoked at a set frame rate.
         *
         * @returns {number}
         */
        tick: number;
        /**
         * Create the stage on which all rendering for the game will be done.
         *
         * A canvas will be created and inserted into the DOM as the last child of the container DIV with the
         * ID provided.
         *
         * The CSS of the DIV will be modified to have a width and height of the canvas, with options that
         * cause it to center itself.
         *
         * @param containerDivID the ID of the DIV that should contain the created canvas
         * @param initialColor the color to clear the canvas to once it is created
         * @constructor
         * @throws {ReferenceError} if there is no element with the ID provided
         */
        constructor(containerDivID: string, initialColor?: string);
        /**
         * This function gets executed in a loop to run the game. Each execution will cause an update and
         * render to be issued to the current scene.
         *
         * In practice, this gets invoked on a timer at the desired FPS that the game should run at.
         */
        private sceneLoop;
        /**
         * Start the game running. This will start with the scene that is currently set. The game will run
         * (or attempt to) at the frame rate you provide.
         *
         * When the stage is created, a default empty scene is initialized that will do nothing.
         *
         * @see Scene.switchToScene.
         * @see Stage.stop
         * @param fps the FPS to attempt to run at
         */
        run(fps?: number): void;
        /**
         * Stop a running game. This halts the update loop but otherwise has no effect. Thus after this call,
         * the game just stops where it was.
         *
         * It is legal to start the game running again via another call to run(), so long as your scenes are
         * not time sensitive.
         *
         * @see Stage.run
         */
        stop(): void;
        /**
         * Request preloading of an image filename. When the run() method is invoked, the game loop will
         * not start until all images requested by this method call are available.
         *
         * Images are expected to be in a folder named "images/" inside of the folder that the game page
         * is served from, so only a filename and extension is required.
         *
         * Requests for preloads of the same image multiple times cause the same image element to be
         * returned each time, since image drawing is non-destructive.
         *
         * You may optionally provide a callback function to be invoked when the image has finished
         * loading; the callback receives the actual loaded image. The callback is guaranteed to be
         * invoked before the stage starts the initial scene running.
         *
         * This is just a proxy for the Preloader.addImage() method, placed here for convenience.
         *
         * @param filename the filename of the image to load
         * @param callback optional callback to be invoked when the image loads
         * @returns {HTMLImageElement} the image element that will contain the image once it is loaded
         * @see Preloader.addImage
         */
        preloadImage(filename: string, callback?: Preloader.ImagePreloadCallback): HTMLImageElement;
        /**
         * Request that the stage preload a sound file for later playback and also implicitly add it to the
         * list of known sounds for later sound manipulation with the stage sound API.
         *
         * Sounds are expected to be in a folder named "sounds/" inside of the folder that the game page is
         * served from. You should not specify an extension on the filename as the system will determine what
         * the browser can play and load the appropriate file for you.
         *
         * Unlike images, requests for sound preloads of the same sound do not share the same tag so that the
         * playback properties of individual sounds can be manipulated individually.
         *
         * If a callback is provided (i.e. non-null) it specifies a function to invoke when the sound is
         * loaded. The actual sound object as returned from this method will be provided as an argument.
         * Note that for sounds, the preload is considered finished when the browser decides that it has
         * loaded enough of the sound that you can expect it to play through if you start it now, even if
         * it is not fully loaded.
         *
         * Additionally, the callback is guaranteed to be called before the stage starts the initial scene
         * running.
         *
         * This is just a simple proxy for the Preloader.addSound() method which invokes Stage.addSound() for
         * you.
         *
         * @param filename the filename of the sound to load
         * @param callback if given, this will be invoked when the sound has loaded (see above)
         * @returns {Sound} the preloaded sound object
         * @see Preloader.addSound
         * @see Stage.addSound
         */
        preloadSound(filename: string, callback?: Preloader.SoundPreloadCallback): Sound;
        /**
         * Request that the stage preload a music file for later playback and also implicitly add it to the
         * list of known sounds for later sound manipulation with the stage sound API.
         *
         * NOTE: Music is just a regular Sound object that is set to loop by default
         *
         * Music is expected to be in a folder named "music/" inside of the folder that the game page is
         * served from. You should not specify an extension on the filename as the system will determine what
         * the browser can play and load the appropriate file for you.
         *
         * Unlike images, requests for music preloads of the same music do not share the same tag so that
         * the playback properties of individual songs can be manipulated individually.
         *
         * If a callback is provided (i.e. non-null) it specifies a function to invoke when the music is
         * loaded. The actual sound object as returned from this method will be provided as an argument.
         * Note that for sounds, the preload is considered finished when the browser decides that it has
         * loaded enough of the sound that you can expect it to play through if you start it now, even if
         * it is not fully loaded.
         *
         * Additionally, the callback is guaranteed to be called before the stage starts the initial scene
         * running.
         *
         * This is just a simple proxy for the Preloader.addMusic() method which invokes Stage.addSound()
         * for you.
         *
         * @param filename the filename of the music to load
         * @param callback if given, this will be invoked when the sound has loaded (see above)
         * @returns {Sound} the preloaded sound object
         * @see Preloader.addMusic
         * @see Stage.addSound
         */
        preloadMusic(filename: string, callback?: Preloader.SoundPreloadCallback): Sound;
        /**
         * Add a sound object to the list of sound objects known by the stage. Only sound objects that the
         * stage knows about will be manipulated by the stage sound API functions.
         *
         * This is invoked automatically for sounds that you have asked the stage to preload for you, but
         * you need to invoke it manually if you use the preloader directly.
         *
         * This does not do a check to see if the sound object provided is already managed by the stage.
         *
         * @param sound the sound object to register with the stage
         * @returns {Sound} the sound object that was registered, for convenience in chained method calls
         * @see Stage.preloadSound
         * @see Stage.preloadMusic
         * @see Preloader.addSound
         * @see Preloader.addMusic
         */
        addSound(sound: Sound): Sound;
        /**
         * Iterate all of the sounds known to the stage and toggle their mute stage.
         *
         * This only mutes known sound objects which are not flagged as being music so that the mute state of
         * music and sound can be toggled independently.
         *
         * The mute state of all such sounds is set to the state passed in.
         *
         * @param mute true to mute all sounds or false to un-mute all sounds
         */
        muteSounds(mute: boolean): void;
        /**
         * Iterate all of the sounds known to the stage and change their volume
         *
         * This only changes the volume of sounds which are not flagged as being music so that the volume
         * of music and sound can be changed independently.
         *
         * @param volume the new volume level for all sounds (0.0 to 1.0)
         */
        soundVolume(volume: number): void;
        /**
         * Iterate all of the music known to the stage and toggle their mute stage.
         *
         * This only mutes known sound objects which are flagged as being music so that the mute state of
         * music and sound an be toggled independently.
         *
         * @param mute true to mute all music or false to un-mute all music
         */
        muteMusic(mute: boolean): void;
        /**
         * Iterate all of the music known to the stage and change their volume.
         *
         * This only changes the volume of sounds which are flagged as being music so that the volume of
         * music and sound can be changed independently.
         *
         * @param volume the new volume level for all sounds (0.0 to 1.0)
         */
        musicVolume(volume: number): void;
        /**
         * Register a scene object with the stage using a textual name. This scene can then be switched to
         * via the switchToScene method.
         *
         * You can invoke this with null as a scene object to remove a scene from the internal scene list.
         * You can also register the same object multiple times with different names, if that's interesting
         * to you.
         *
         * It is an error to attempt to register a scene using the name of a scene that already exists.
         *
         * @param name the symbolic name to use for this scene
         * @param newScene the scene object to add
         * @see Scene.switchToScene
         */
        addScene(name: string, newScene?: Scene): void;
        /**
         * Register a request to change the current scene to a different scene. The change will take effect at
         * the start of the next frame.
         *
         * If null is provided, a pending scene change will be cancelled.
         *
         * This method has no effect if the scene specified is already the current scene, is already going to
         * be switched to, or has a name that we do not recognize.
         *
         * @param {String} sceneName the name of the new scene to change to, or null to cancel a pending
         * change
         */
        switchToScene(sceneName?: string): void;
        /**
         * Open a new tab/window that displays the current contents of the stage. The generated page will
         * display the image and is set up so that a click on the image will cause the browser to download
         * the file.
         *
         * The filename you provide is the filename that is automatically suggested for the image, and the
         * title passed in will be the title of the window opened and also the alternate text for the image
         * on the page.
         *
         * The filename provided will have an identifying number and an extension appended to the end. The
         * window title will also have the screenshot number appended to the end of it. This allows you to
         * easily distinguish multiple screenshots.
         *
         * This all requires support from the current browser. Some browsers may not support the notion of
         * automatically downloading the image on a click, some might not use the filename provided.
         *
         * In particular, the browser in use needs to support data URI's. I assume most decent ones do.
         *
         * @param filename the name of the screenshot image to create
         * @param windowTitle the title of the window
         * @see screenshotFilenameBase
         * @see screenshotWindowTitle
         */
        screenshot(filename?: string, windowTitle?: string): void;
        /**
         * Given an event that represents a mouse event for the stage, calculate the position that the mouse
         * is actually at relative to the top left of the stage. This is needed because the position of mouse
         * events is normally relative to the document itself, which may be larger than the actual window.
         *
         * When a point parameter is provided, its value is modified to be the mouse location, and this
         * point is also returned.
         *
         * If no point parameter is provided, a new point is created and returned instead.
         *
         * @param mouseEvent the mouse movement or click event
         * @param point the point to store the location into, or null to create and return a new point
         * @returns {Point} the point of the mouse click/pointer position on the stage; either newly
         * created or the one provided
         */
        calculateMousePos(mouseEvent: MouseEvent, point?: Point): Point;
        /**
         * Handler for key down events. This gets triggered whenever the game is running and any key is
         * pressed.
         *
         * @param evt the event object for this event
         */
        private keyDownEvent;
        /**
         * Handler for key up events. This gets triggered whenever the game is running and any key is
         * released.
         *
         * @param evt the event object for this event
         */
        private keyUpEvent;
        /**
         * Handler for mouse movement events. This gets triggered whenever the game is running and the mouse
         * moves over the stage.
         *
         * @param evt the event object for this event
         */
        private mouseMoveEvent;
        /**
         * Handle for mouse down events. This gets triggered whenever the game is running and a mouse
         * button is actively being held down
         *
         * @param evt the event object for this event.
         */
        private mouseDownEvent;
        /**
         * Handle for mouse up events. This gets triggered whenever the game is running and a mouse
         * button is released
         *
         * @param evt the event object for this event.
         */
        private mouseUpEvent;
        /**
         * Handler for mouse click events. This gets triggered whenever the game is running and the mouse
         * is clicked over the canvas.
         *
         * @param evt the event object for this event
         */
        private mouseClickEvent;
        /**
         * Handler for mouse double click events. This gets triggered whenever the game is running and the
         * mouse is double clicked over the canvas.
         *
         * @param evt the event object for this event
         */
        private mouseDblClickEvent;
        /**
         * Handler for mouse wheel events. This gets triggered whenever the game is running and the mouse
         * wheel is scrolled over the canvas.
         *
         * @param evt the event object for this event.
         */
        private mouseWheelEvent;
        /**
         * Turn on input handling for the game. This will capture keyboard events from the document and mouse
         * events for the canvas provided.
         *
         * @param canvas the canvas to listen for mouse events on.
         */
        private enableInputEvents;
        /**
         * Turn off input handling for the game. This will turn off keyboard events from the document and
         * mouse events for the canvas provided.
         */
        private disableInputEvents;
        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString(): string;
    }
}
declare module nurdz.game {
    /**
     * This class wraps a list of known Scene instances and allows for switching between them and
     * querying/modifying the list of known scenes.
     *
     * This is used by the Stage class to manage the scenes in the game and switch between them.
     */
    class SceneManager {
        /**
         * The currently active scene. This defaults to an empty instance initially so that all operations
         * still work as expected while the engine is being set up, and to guard the developer from
         * himself by forgetting to add one.
         *
         * @type {Scene}
         */
        private _currentScene;
        /**
         * The scene that should become active next (if any). When a scene change request happens, the
         * scene to be switched to is stored in this value to ensure that the switch happens at the end of
         * the current update cycle, which happens asynchronously.
         *
         * The value here is null when there is no scene change scheduled.
         *
         * @type {Scene|null}
         */
        private _nextScene;
        /**
         * A list of all of the registered scenes in the stage. The keys are a symbolic string name and
         * the values are the actual Scene instance objects that the names represent.
         *
         * @type {Object<String,Scene>}
         */
        private _sceneList;
        /**
         * The currently active scene in the game.
         *
         * @returns {Scene} the current scene
         */
        currentScene: Scene;
        /**
         * The scene that will imminently become active the next time a scene change check is scheduled.
         *
         * This value is null when there is no pending scene change yet.
         *
         * @returns {Scene}
         */
        nextScene: Scene;
        /**
         * Create a new instance of the Scene manager that will manage scenes for the passed in stage.
         *
         * @param stage the stage whose scenes we are managing.
         */
        constructor(stage: Stage);
        /**
         * Register a scene object using a textual name for reference. This scene can then be switched to
         * via the switchToScene method.
         *
         * You can invoke this with null as a scene object to remove a scene from the internal scene list or
         * register the same object multiple times with different names, if that's interesting to you.
         *
         * It is an error to attempt to register a scene using the name of a scene that already exists.
         *
         * @param name the symbolic name to use for this scene
         * @param newScene the scene object to add
         * @see Scene.switchToScene
         */
        addScene(name: string, newScene?: Scene): void;
        /**
         * Register a request to change the current scene to a different scene.
         *
         * NOTE: Such a change will not occur until the next call to checkSceneSwitch(), which you should
         * do prior to any frame update. This means sure that the frame update keeps the same scene active
         * throughout (e.g. calling into one scene for update and another for render).
         *
         * If null is provided, a pending scene change will be cancelled out.
         *
         * This method has no effect if the scene specified is already the current scene, is already going to
         * be switched to, or has a name that we do not recognize. In that last case, a console log is
         * generated to indicate why the scene change is not happening.
         *
         * @param {String} sceneName the name of the new scene to change to, or null to cancel a pending
         * change
         */
        switchToScene(sceneName?: string): void;
        /**
         * Check to see if there is a pending scene switch that should happen, as requested by an
         * invocation to switchToScene().
         *
         * If there is, the current scene is switched, with the scenes being notified as appropriate. If
         * there isn't, then nothing else happens.
         *
         * @see SceneManager.switchToScene
         */
        checkSceneSwitch(): void;
    }
}
declare module nurdz.game {
    /**
     * This class represents a Tile in a game, for games that require that. This encapsulates information as
     * to what the textual (for debugging) and numeric (for map data) ID's of a tile are, as well as the
     * ability to render to a stage and provide other information such as blocking.
     */
    class Tile {
        /**
         * The textual name of this tile.
         *
         * @type {string}
         */
        protected _name: string;
        /**
         * The numeric tile ID of this tile.
         *
         * @type {number}
         */
        protected _tileID: number;
        /**
         * The color that the base class will use to render this tile if the method is not overridden.
         *
         * @type {string}
         */
        protected _debugColor: string;
        /**
         * Get the textual name of this tile.
         *
         * @returns {string}
         */
        name: string;
        /**
         * Get the numeric id of this tile.
         *
         * @returns {number}
         */
        value: number;
        /**
         * Construct a new tile instance with the given name and ID values. This instance will render
         * itself using the debug color provided (as a filled rectangle).
         *
         * @param name the textual name of this tile type, for debugging purposes
         * @param internalID the numeric id of this tile type, for use in map data
         * @param debugColor the color to render as in debug mode
         */
        constructor(name: string, internalID: number, debugColor?: string);
        /**
         * Query whether this tile blocks the movement of the provided actor on the map or not.
         *
         * By default all actors are blocked on this tile. Note that this means that there is no API contract
         * as far as the core engine code is concerned with regards to the actor value passed in being
         * non-null.
         *
         * @param actor the actor to check blocking for
         * @returns {boolean} true if the actor given cannot move over this tile, or false otherwise.
         */
        blocksActorMovement(actor: Actor): boolean;
        /**
         * Render this tile to the location provided on the given stage.
         *
         * This default version of the method renders the tile as a solid rectangle of the appropriate
         * dimensions using the debug color given at construction time.
         *
         * @param x the x location to render the tile at, in stage coordinates (NOT world)
         * @param y the y location to render the tile at, in stage coordinates (NOT world)
         * @param renderer the renderer to use to render ourselves.
         */
        render(x: number, y: number, renderer: Renderer): void;
        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString(): string;
    }
}
declare module nurdz.game {
    /**
     * This class represents a Tileset in a game, which is basically just an array of Tile instances that
     * will be used to render a level. The class provides the ability to look up tiles based on either
     * their name or their numeric ID values, as well as validating whether or not tiles are valid.
     */
    class Tileset {
        /**
         * The textual name of this tileset.
         *
         * @type {string}
         */
        private _name;
        /**
         * The number of tiles that this tileset contains.
         *
         * @type {number}
         */
        private _length;
        /**
         * The tiles in this tileset keyed according to their textual names.
         *
         * @type {Object.<String, Tile>}
         */
        private _tilesByName;
        /**
         * The tiles in this tileset, ordered according to their internal numeric tile ID's.
         *
         * @type {Array<Tile>}
         */
        private _tilesByValue;
        /**
         * Construct a new tile instance with the given name and ID values. This instance will render
         * itself using the debug color provided (as a filled rectangle).
         *
         * @param name the textual name of this tile type, for debugging purposes
         * @param tiles the list of tiles that this tileset should contain
         */
        constructor(name: string, tiles: Array<Tile>);
        /**
         * Given a tileID, return true if this tileset contains that tile or false if it does not.
         *
         * @param tileID the tileID to check.
         * @returns {boolean} true if the tileID given corresponds to a valid tile, false otherwise
         */
        isValidTileID(tileID: number): boolean;
        /**
         * Given a tile name, return back the tile object that represents this tile. The value will be null if
         * the tile name provided is not recognized.
         *
         * @param name the name of the tileID to search for
         * @returns {Tile} the tile with the provided name, or null if the name is invalid.
         */
        tileForName(name: string): Tile;
        /**
         * Given a tile id, return back the tile object that represents this tile. The value will be null
         * if the tile id provided is not recognized.
         *
         * @param id the numeric id value of the tile to search for
         * @returns {Tile} the tile with the provided value, or null if the name is invalid.
         */
        tileForID(id: number): Tile;
        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString(): string;
    }
}
declare module nurdz.game {
    /**
     * This class represents the raw map and entity data that represents a tile based level in a game.
     * Instances of this class hold the raw (and reusable) data used to represent a level.
     *
     * The map data is just a series of integer tile ID values that associate with the tile set that has
     * been provided, as well as a list of entities that are attached to the map.
     *
     * Various checks are done to ensure that the level data provided is actually valid.
     */
    class LevelData {
        /**
         * The textual name of this level data.
         *
         * @type {string}
         */
        protected _name: string;
        /**
         * The width of this level data, in tiles.
         *
         * @type {number}
         */
        protected _width: number;
        /**
         * The height of this level data, in tiles.
         *
         * @type {number}
         */
        protected _height: number;
        /**
         * The underlying level data that describes the map. This is an array of numbers that are
         * interpreted as numeric tile ID values.
         *
         * @type {Array<number>}
         */
        protected _levelData: Array<number>;
        /**
         * The list of all entities that are associated with this particular level data instance. This is
         * just an array of entity objects.
         *
         * @type {Array<Entity>}
         */
        protected _entities: Array<Entity>;
        /**
         * A duplicate list of entities, where the entities are indexed by their ID values for faster lookup.
         *
         * @type {Object<String,Entity>}
         */
        protected _entitiesByID: Object;
        /**
         * The tileset that is used to render this level data; the data in the levelData array is verified
         * to only contain tiles that appear in this tileset.
         *
         * @type {Tileset}
         */
        protected _tileset: Tileset;
        /**
         * The width of this level data, in tiles.
         *
         * @returns {number} the width of the map data in tiles.
         */
        width: number;
        /**
         * The height of this level data, in tiles.
         *
         * @returns {number} the height of the map data in tiles
         */
        height: number;
        /**
         * The underlying map data that describes the map in this instance. This is an array of numbers
         * that are interpreted as numeric tile ID values and is width * height numbers long.
         *
         * @returns {Array<number>} the underlying map data
         */
        mapData: Array<number>;
        /**
         * The tileset that is used to render the map in this level data; the data in the mapData array is
         * verified to only contain tiles that appear in this tileset.
         *
         * @returns {Tileset} the tileset to use to render this map
         */
        tileset: Tileset;
        /**
         * The list of all entities that are associated with this particular level data instance. This is
         * just an array of entity objects.
         *
         * @returns {Array<Entity>} the list of entities
         * @see LevelData.entitiesByID
         */
        entities: Array<Entity>;
        /**
         * A duplicate list of entities, where the entities are indexed by their ID values for faster
         * lookup at runtime.
         *
         * @returns {Object<String,Entity>} an object which contains the entities, keyed by their id values.
         * @see LevelData.entities
         */
        entitiesByID: Object;
        /**
         * Construct a new level data object with the provided properties.
         *
         * @param name the name of this level for debug purposes
         * @param width the width of the level in tiles
         * @param height the height of the level in tiles
         * @param levelData the actual data that represents the map for this level
         * @param entityList the list of entities that are contained in the map (may be empty)
         * @param tileset the tileset that this level is using.
         * @throws {Error} if the level data is inconsistent in some way
         */
        constructor(name: string, width: number, height: number, levelData: Array<number>, entityList: Array<Entity>, tileset: Tileset);
        /**
         * A simple helper that handles a validation failure by throwing an error.
         *
         * @param message the error to throw
         */
        private error(message);
        /**
         * Validate the data that is contained in this level to ensure that it is as consistent as we can
         * determine.
         *
         * On error, an error is thrown. Otherwise this returns without incident.
         *
         * @throws {Error} if the level data is inconsistent in some way
         */
        private validateData();
        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString(): string;
    }
}
declare module nurdz.game {
    /**
     * This class represents the idea of a level in a game based on a tile map. It takes an instance of a
     * LevelData class that gives it information about the layout of the level and its other contents, and
     * provides an API for rendering that map to the stage and for querying the map data in various ways.
     */
    class Level {
        /**
         * The stage that owns this level.
         *
         * @type {Stage}
         */
        protected _stage: Stage;
        /**
         * The width of the level that we represent, in tiles.
         *
         * @type {number}
         */
        protected _width: number;
        /**
         * The height of the level that we represent, in tiles.
         *
         * @type {number}
         */
        protected _height: number;
        /**
         * The raw level data that we are rendering. This is a series of numbers of length width * height
         * that contains tile ID's that indicate what tile to render.
         */
        protected _mapData: Array<number>;
        /**
         * The unordered list of entities contained on this level.
         *
         * @type {Array<Entity>}
         */
        protected _entities: Array<Entity>;
        /**
         * The list of entities keyed so that the key is the id property of the entity and the value is
         * the entity itself, to provide for faster lookup of specific entities.
         *
         * @type {Object<String,Entity>}
         */
        protected _entitiesByID: Object;
        /**
         * The tileset that represents the level data. This controls how the tiles are rendered onto the
         * stage.
         *
         * @type {Tileset}
         */
        protected _tileset: Tileset;
        /**
         * Construct a new level object that will display on the provided stage and which represents the
         * provided data.
         *
         * @param stage the stage that owns the level and will display it
         * @param levelData the data to display/wrap/query
         */
        constructor(stage: Stage, levelData: LevelData);
        /**
         * Given an entity type, return back a list of all entities of that type that the level data contains.
         * There could be 0 or more such entries.
         *
         * @param type the entity type to search for (pass the class object)
         * @returns {Array<Entity>} an array of entities of this type, which might be empty
         */
        entitiesWithType(type: Function): Array<Entity>;
        /**
         * Given coordinates in the map (e.g. tile based) domain, return back a list of all entities in the
         * level that exist at this location, which might be 0. This also detects when the coordinates are
         * outside of the world.
         *
         * @param x the X coordinate to search, in map coordinates
         * @param y the Y coordinate to search, in map coordinates
         * @returns {Array<Entity>} the entities at the provided location or null if the location is
         * invalid
         */
        entitiesAtMapXY(x: number, y: number): Array<Entity>;
        /**
         * Given coordinates in the map (e.g. tile based) domain, return back a list of all entities in the
         * level that exist at this location, which might be 0. This also detects when the coordinates are
         * outside of the world.
         *
         * @param  location the location in the map to check, in map coordinates
         * @returns {Array<Entity>} the entities at the provided location or null if the location is
         * invalid
         */
        entitiesAtMapPosition(location: Point): Array<Entity>;
        /**
         * Given coordinates in the map (e.g. tile based) domain and a facing, this calculates which map tile
         * is in the facing direction given and then returns back a list of all entities that exist at the
         * map tile that is adjacent in that direction, which might be 0. This also detects when either the
         * input or facing adjusted coordinates are outside of the world.
         *
         * @param x the X coordinate to search
         * @param y the Y coordinate to search
         * @param facing the facing to search (angle in degrees)
         * @returns {Array<Entity>} the entities at the provided location offset by the given facing or null
         * if the location is invalid (including if the location in the facing is invalid)
         */
        entitiesAtMapXYFacing(x: number, y: number, facing: number): Array<Entity>;
        /**
         * Given coordinates in the map (e.g. tile based) domain and a facing, this calculates which map tile
         * is in the facing direction given and then returns back a list of all entities that exist at the
         * map
         * tile that is adjacent in that direction, which might be 0. This also detects when either the input
         * or facing adjusted coordinates are outside of the world.
         *
         * @param location the location in the map to check, in map coordinates
         * @param facing the facing to search (angle in degrees)
         * @returns {Array<Entity>} the entities at the provided location offset by the given facing or null
         * if the location is invalid (including if the location in the facing is invalid)
         */
        entitiesAtMapPositionFacing(location: Point, facing: number): Array<Entity>;
        /**
         * Scan over all entities in the level and return back a list of all entities with the id or ids
         * given, which may be an empty array.
         *
         * NOTE: No care is taken to not include duplicate entities if the entity list provided contains the
         * same entity ID more than once. It's also not an error if no such entity exists, although a warning
         * will be generated to the console in this case.
         *
         * @param idSpec the array of entity IDs to find
         * @returns {Array<Entity>} list of matching entities (may be an empty array)
         */
        entitiesWithIDs(idSpec: Array<String>): Array<Entity>;
        /**
         * Find all entities that match the id list passed in and then, for each such entity found, fire their
         * trigger method using the provided activator as the source of the trigger.
         *
         * As a convenience, if the idSpec provided is null, nothing happens. This allows for entities to use
         * this method without having to first verify that they actually have a trigger.
         *
         * @param idSpec the id or ids of entities to find or null too do nothing
         * @param activator the actor that is activating the entities, or null
         */
        triggerEntitiesWithIDs(idSpec: Array<string>, activator: Actor): void;
        /**
         * Given coordinates in the map (e.g. tile based) domain, return back the tile at that location. If
         * the coordinates are outside of the world, this is detected and null is returned back.
         *
         * @param {Number} x the X-coordinate to check, in map coordinates
         * @param {Number} y the Y-coordinate to check, in map coordinates
         * @returns {Tile} the tile at the provided location or null if the location is invalid
         */
        tileAtXY(x: number, y: number): Tile;
        /**
         * Given coordinates in the map (e.g. tile based) domain, return back the tile at that location. If
         * the coordinates are outside of the world, this is detected and null is returned back.
         *
         * @param location the location to check, in map coordinates
         * @returns {Tile} the tile at the provided location or null if the location is invalid
         */
        tileAt(location: Point): Tile;
        /**
         * Given coordinates in the map, return back a boolean that indicates if that space is blocked or not
         * as far as movement is concerned for the actor provided.
         *
         * The provided actor can be non-null, so long as all Tile and Entity instances being used in the
         * level are capable of determining blocking against a null tile reference. The default
         * implementations are capable of this.
         *
         * @param x the X-coordinate to check, in map coordinates
         * @param y the Y-coordinate to check, in map coordinates
         * @param actor the actor to check the blocking of
         * @returns {boolean} true if the level location is blocked for this actor and cannot be moved to, or
         * false otherwise.
         */
        isBlockedAtXY(x: number, y: number, actor: Actor): boolean;
        /**
         * Given coordinates in the map, return back a boolean that indicates if that space is blocked or not
         * as far as movement is concerned for the actor provided.
         *
         * The provided actor can be non-null, so long as all Tile instances being used in the level are
         * capable of determining blocking against a null tile reference. The default Tile implementation
         * is capable of this.
         *
         * @param location the location to check, in map coordinates
         * @param actor the actor to check the blocking of
         * @returns {boolean} true if the level location is blocked for this actor and cannot be moved to, or
         * false otherwise.
         */
        isBlockedAt(location: Point, actor: Actor): boolean;
        /**
         * Render this level using the renderer provided. This is done by delegating the rendering of each
         * individual tile to the tile instance.
         *
         * Note that this only renders the level geometry and not the entities; it's up to the caller to
         * render those as needed and at the appropriate time.
         *
         * @param renderer the renderer to render with
         */
        render(renderer: Renderer): void;
        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString(): string;
    }
}
declare module nurdz.game {
    /**
     * This class wraps an HTML audio tag to provide an extended API for sound and music playing. This
     * shields the client code from having to work with the tag directly and provides an enhanced API.
     */
    class Sound {
        /**
         * The HTML Audio tag that we use to play our sound.
         */
        protected _tag: HTMLAudioElement;
        /**
         * True if this sound is flagged as being music, false otherwise.
         */
        protected _isMusic: boolean;
        /**
         * Construct a new sound object, telling it to wrap the provided audio tag, which it will use for
         * its playback.
         *
         * You can specify if this sound is meant to be used as music, in which case it will loop by default.
         *
         * @param audioTag the audio tag that represents the sound to be played.
         * @param isMusic true if this sound will be used to play back music
         */
        constructor(audioTag: HTMLAudioElement, isMusic?: boolean);
        /**
         * Obtain the underlying audio tag used for this sound object.
         *
         * @returns {HTMLAudioElement}
         */
        tag: HTMLAudioElement;
        /**
         * Determine if this sound represents music or not.
         *
         * @returns {boolean}
         */
        isMusic: boolean;
        /**
         * Determines if this sound is currently playing or not.
         *
         * @returns {boolean}
         */
        isPlaying: boolean;
        /**
         * Get the current volume that this sound is playing at. This ranges between 0 and 1.
         *
         * @returns {number}
         */
        /**
         * Set the volume that this sound plays back on, which should be a value between 0 and 1.
         *
         * @param newVolume the new volume level for the sound (0.0 to 1.0)
         */
        volume: number;
        /**
         * Determines if this sound loops during playback or not.
         *
         * @returns {boolean}
         */
        /**
         * Change the state of looping for this sound. When true, playback will loop continuously until
         * told to stop.
         *
         * @param newLoop the new loop state (true to loop playback, false to play once and stop)
         */
        loop: boolean;
        /**
         * Determine if this sound object is currently muted or not.
         *
         * @returns {boolean}
         */
        /**
         * Change the mute state of this object.
         *
         * @param newMuted the new muted state (true for mute, false for un-muted)
         */
        muted: boolean;
        /**
         * Start the sound playing, optionally also restarting the playback from the beginning if it is
         * already playing.
         *
         * The restart parameter can be used to restart playback from the beginning; this is useful if the
         * sound is already playing and you want it to immediately restart or if the sound is paused and
         * you want playback to start from the beginning and not the pause point.
         *
         *
         * When the sound is already playing and the parameter passed in is false, this call effectively
         * does nothing.
         *
         * @param restart true to start the sound playing from the beginning or false to leave the current
         * play position alone
         */
        play(restart?: boolean): void;
        /**
         * Pause playback of the sound.
         */
        pause(): void;
        /**
         * Toggle the play state of the sound; if it is currently playing, it will be paused, otherwise it
         * will start playing. The restart parameter can be used to cause paused playback to restart at
         * the beginning of the sound and has no effect if the sound is already playing.
         *
         * This method is generally used for longer sounds that you might want to cut off (e.g. music).
         *
         * @see Sound.play
         */
        toggle(restart?: boolean): void;
    }
}
