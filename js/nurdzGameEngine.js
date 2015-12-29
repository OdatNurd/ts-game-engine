// Only attempt to include this static method if it does not already exist. This of course means that if
// it DOES already exist, our code is going to be unhappy. However, I would rather make my own code
// unstable than someone else's in this situation because I (hopefully) understand what my own code does.
if (!String.format) {
    /**
     * Takes a format string and one or more other strings, and does a replacement, returning a copy of the
     * newly formatted string.
     *
     * The format string can contain sequences like {0} or {1} or {n}, where that text (including the braces)
     * will get replaced with the argument at that location.
     *
     * Example: String.format ("Hello, {0}", "Terence"); returns the string "Hello, Terence".
     *
     * Note that in TypeScript this sort of thing is already possible because TypeScript includes support for
     * EcmaScript 6 template strings, which it compiles down. However in some cases such strings are not
     * desirable from a readability standpoint, particularly when there are a lot of substitutions and/or the
     * expressions are lengthy.
     *
     * As such, this function is provided for use in such situations.
     *
     * @param formatString the template string to format
     * @param params the objects to use in the replacements
     * @returns {string} the formatted string
     */
    String.format = function (formatString) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return formatString.replace(/{(\d+)}/g, function (match, number) {
            return typeof params[number] != 'undefined'
                ? params[number]
                : match;
        });
    };
}
var nurdz;
(function (nurdz) {
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
    function contentLoaded(win, fn) {
        // The typecast below was added for TypeScript compatibility because HTMLElement doesn't include
        // the doScroll() method used below when the browser is IE.
        var done = false, top = true, doc = win.document, root = doc.documentElement, modern = doc.addEventListener, add = modern ? 'addEventListener' : 'attachEvent', rem = modern ? 'removeEventListener' : 'detachEvent', pre = modern ? '' : 'on', init = function (e) {
            if (e.type == 'readystatechange' && doc.readyState != 'complete')
                return;
            (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
            if (!done && (done = true))
                fn.call(win, e.type || e);
        }, poll = function () {
            try {
                root.doScroll('left');
            }
            catch (e) {
                setTimeout(poll, 50);
                return;
            }
            init('poll');
        };
        if (doc.readyState == 'complete')
            fn.call(win, 'lazy');
        else {
            if (!modern && root.doScroll) {
                try {
                    top = !win.frameElement;
                }
                catch (e) { }
                if (top)
                    poll();
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false);
        }
    }
    nurdz.contentLoaded = contentLoaded;
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * The aspects of the engine that deal with tiles instead of pixels assume that this is the size of
         * tiles (in pixels). Tiles are assumed to be square.
         *
         * @const
         * @type {number}
         */
        game.TILE_SIZE = 32;
        /**
         * The width of the game stage (canvas) in pixels.
         *
         * @const
         * @type {number}
         */
        game.STAGE_WIDTH = 800;
        /**
         * The height of the game stage (canvas) in pixels.
         *
         * @const
         * @type {number}
         */
        game.STAGE_HEIGHT = 600;
        /**
         * The width of the game stage (canvas), in tiles.
         *
         * @const
         * @type {Number}
         */
        game.STAGE_TILE_WIDTH = Math.floor(game.STAGE_WIDTH / game.TILE_SIZE);
        /**
         * The height of the game stage (canvas), in tiles.
         *
         * @const
         * @type {Number}
         */
        game.STAGE_TILE_HEIGHT = Math.floor(game.STAGE_HEIGHT / game.TILE_SIZE);
        /**
         * This enumeration contains key code constants for use in keyboard events. Not all useful keys are
         * implemented here just yet. Add as required.
         */
        (function (KeyCodes) {
            KeyCodes[KeyCodes["KEY_ENTER"] = 13] = "KEY_ENTER";
            KeyCodes[KeyCodes["KEY_SPACEBAR"] = 32] = "KEY_SPACEBAR";
            // Arrow keys
            KeyCodes[KeyCodes["KEY_LEFT"] = 37] = "KEY_LEFT";
            KeyCodes[KeyCodes["KEY_UP"] = 38] = "KEY_UP";
            KeyCodes[KeyCodes["KEY_RIGHT"] = 39] = "KEY_RIGHT";
            KeyCodes[KeyCodes["KEY_DOWN"] = 40] = "KEY_DOWN";
            // Number keys
            KeyCodes[KeyCodes["KEY_0"] = 48] = "KEY_0";
            KeyCodes[KeyCodes["KEY_1"] = 49] = "KEY_1";
            KeyCodes[KeyCodes["KEY_2"] = 50] = "KEY_2";
            KeyCodes[KeyCodes["KEY_3"] = 51] = "KEY_3";
            KeyCodes[KeyCodes["KEY_4"] = 52] = "KEY_4";
            KeyCodes[KeyCodes["KEY_5"] = 53] = "KEY_5";
            KeyCodes[KeyCodes["KEY_6"] = 54] = "KEY_6";
            KeyCodes[KeyCodes["KEY_7"] = 55] = "KEY_7";
            KeyCodes[KeyCodes["KEY_8"] = 56] = "KEY_8";
            KeyCodes[KeyCodes["KEY_9"] = 57] = "KEY_9";
            // Alpha keys; these are all a single case because shift state is tracked separately.
            KeyCodes[KeyCodes["KEY_A"] = 65] = "KEY_A";
            KeyCodes[KeyCodes["KEY_B"] = 66] = "KEY_B";
            KeyCodes[KeyCodes["KEY_C"] = 67] = "KEY_C";
            KeyCodes[KeyCodes["KEY_D"] = 68] = "KEY_D";
            KeyCodes[KeyCodes["KEY_E"] = 69] = "KEY_E";
            KeyCodes[KeyCodes["KEY_F"] = 70] = "KEY_F";
            KeyCodes[KeyCodes["KEY_G"] = 71] = "KEY_G";
            KeyCodes[KeyCodes["KEY_H"] = 72] = "KEY_H";
            KeyCodes[KeyCodes["KEY_I"] = 73] = "KEY_I";
            KeyCodes[KeyCodes["KEY_J"] = 74] = "KEY_J";
            KeyCodes[KeyCodes["KEY_K"] = 75] = "KEY_K";
            KeyCodes[KeyCodes["KEY_L"] = 76] = "KEY_L";
            KeyCodes[KeyCodes["KEY_M"] = 77] = "KEY_M";
            KeyCodes[KeyCodes["KEY_N"] = 78] = "KEY_N";
            KeyCodes[KeyCodes["KEY_O"] = 79] = "KEY_O";
            KeyCodes[KeyCodes["KEY_P"] = 80] = "KEY_P";
            KeyCodes[KeyCodes["KEY_Q"] = 81] = "KEY_Q";
            KeyCodes[KeyCodes["KEY_R"] = 82] = "KEY_R";
            KeyCodes[KeyCodes["KEY_S"] = 83] = "KEY_S";
            KeyCodes[KeyCodes["KEY_T"] = 84] = "KEY_T";
            KeyCodes[KeyCodes["KEY_U"] = 85] = "KEY_U";
            KeyCodes[KeyCodes["KEY_V"] = 86] = "KEY_V";
            KeyCodes[KeyCodes["KEY_W"] = 87] = "KEY_W";
            KeyCodes[KeyCodes["KEY_X"] = 88] = "KEY_X";
            KeyCodes[KeyCodes["KEY_Y"] = 89] = "KEY_Y";
            KeyCodes[KeyCodes["KEY_Z"] = 90] = "KEY_Z";
            // Function keys
            KeyCodes[KeyCodes["KEY_F1"] = 112] = "KEY_F1";
            KeyCodes[KeyCodes["KEY_F2"] = 113] = "KEY_F2";
            KeyCodes[KeyCodes["KEY_F3"] = 114] = "KEY_F3";
            KeyCodes[KeyCodes["KEY_F4"] = 115] = "KEY_F4";
            KeyCodes[KeyCodes["KEY_F5"] = 116] = "KEY_F5";
            KeyCodes[KeyCodes["KEY_F6"] = 117] = "KEY_F6";
            KeyCodes[KeyCodes["KEY_F7"] = 118] = "KEY_F7";
            KeyCodes[KeyCodes["KEY_F8"] = 119] = "KEY_F8";
            KeyCodes[KeyCodes["KEY_F9"] = 120] = "KEY_F9";
            KeyCodes[KeyCodes["KEY_F10"] = 121] = "KEY_F10";
            KeyCodes[KeyCodes["KEY_F11"] = 122] = "KEY_F11";
            KeyCodes[KeyCodes["KEY_F12"] = 123] = "KEY_F12";
        })(game.KeyCodes || (game.KeyCodes = {}));
        var KeyCodes = game.KeyCodes;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        var Preloader;
        (function (Preloader) {
            /**
             * This stores the extension that should be applied to sounds loaded by the preloader so that it loads
             * a file type that is appropriate for the current browser.
             *
             * @type {string}
             * @private
             */
            var _audioExtension = function () {
                var tag = document.createElement("audio");
                if (tag.canPlayType("audio/mp3"))
                    return ".mp3";
                else
                    return ".ogg";
            }();
            /**
             * This tracks whether or not preloading has already started or not. Once preloading has started, we
             * don't allow any more submissions to the preload queues.
             *
             * @type {boolean}
             * @private
             */
            var _preloadStarted = false;
            /**
             * The list of images to be preloaded.
             *
             * @type {Object<string,HTMLImageElement>}
             * @private
             */
            var _imagePreloadList = {};
            /**
             * The list of sounds (and music, which is a special case of sound) to be preloaded.
             * @type {Array<SoundPreload>}
             * @private
             */
            var _soundPreloadList = [];
            /**
             * The number of images that still need to be loaded before all images are considered loaded. This
             * gets incremented as preloads are added and decremented as loads are completed.
             *
             * @type {number}
             * @private
             */
            var _imagesToLoad = 0;
            /**
             * The number of sounds that still need to be loaded before all images are considered loaded. This
             * gets incremented as preloads are added and decremented as loads are completed.
             *
             * @type {number}
             * @private
             */
            var _soundsToLoad = 0;
            /**
             * The callback to invoke when preloading has started and all images and sounds are loaded.
             */
            var _completionCallback;
            /**
             * This gets invoked every time one of the images that we are preloading fully loads.
             */
            function imageLoaded() {
                // TODO This doesn't report image load errors. I don't know if that matters
                // One less image needs loading.
                _imagesToLoad--;
                // If everything is loaded, trigger the completion callback now.
                if (_imagesToLoad == 0 && _soundsToLoad == 0)
                    _completionCallback();
            }
            /**
             * This gets invoked when a sound is "loaded".
             *
             * In actuality, this tells us that based on the current download rate, enough of the audio has
             * already been downloaded that if you tried to play it right now, it would be able to finish playing
             * even though it may not be fully downloaded.
             */
            function soundLoaded() {
                // TODO This doesn't report load errors. I'm not even sure this ever triggers on an error.
                _soundsToLoad--;
                // If everything is loaded, trigger the completion callback now.
                if (_imagesToLoad == 0 && _soundsToLoad == 0)
                    _completionCallback();
            }
            /**
             * Add the image filename specified to the list of images that will be preloaded. The "filename" is
             * assumed to be a path that is relative to the page that the game is being served from and inside of
             * an "images/" sub-folder.
             *
             * The return value is an image tag that can be used to render the image once it is loaded.
             *
             * @param filename the filename of the image to load; assumed to be relative to a images/ folder in
             * the same path as the page is in.
             * @returns {HTMLImageElement} the tag that the image will be loaded into.
             * @throws {Error} if an attempt is made to add an image to preload after preloading has already started
             */
            function addImage(filename) {
                // Make sure that preloading has not started.
                if (_preloadStarted)
                    throw new Error("Cannot add images after preloading has already begun or started");
                // Create a key that is the URL that we will be loading, and then see if there is a tag already in
                // the preload dictionary that uses that URL.
                var key = "images/" + filename;
                var tag = _imagePreloadList[key];
                // If there is not already a tag, then we need to create a new one.
                if (tag == null) {
                    // Create a new tag, indicate the function to invoke when it is fully loaded, and then add it
                    // to the preload list.
                    tag = document.createElement("img");
                    tag.addEventListener("load", imageLoaded, false);
                    _imagePreloadList[key] = tag;
                    // This counts as an image that we are going to preload.
                    _imagesToLoad++;
                }
                // Return the tag back to the caller so that they know how to render later.
                return tag;
            }
            Preloader.addImage = addImage;
            /**
             * This does all of the work of actually adding a sound to the preload queue for sound files as
             * needed, returning back the audio tag that wraps the passed filename.
             *
             * This assumes that the filename is relative to a folder named subFolder inside the path that the game
             * page is in, and that it does not have an extension so that one can be properly selected.
             *
             * @param subFolder the subFolder that the filename is assumed to be in
             * @param filename the filename of the sound to load; assumed to be relative to a sounds/ folder in
             * the same path as the page is in and to have no extension
             * @returns {HTMLAudioElement} the sound object that will (eventually) play the requested audio
             * @throws {Error} if an attempt is made to add a sound to preload after preloading has already started
             */
            var doAddSound = function (subFolder, filename) {
                // Make sure that preloading has not started.
                if (_preloadStarted)
                    throw new Error("Cannot add sounds after preloading has already begun or started");
                // Create a sound preload object.
                var preload = {
                    src: subFolder + filename + _audioExtension,
                    tag: document.createElement("audio")
                };
                // Set up an event listener to ensure that once the sound can play through, we mark it as loaded
                // enough for our purposes.
                preload.tag.addEventListener("canplaythrough", soundLoaded);
                // Insert it into the sound preload list and count it as a sound to be preloaded.
                _soundPreloadList.push(preload);
                _soundsToLoad++;
                // Return the tag back to the caller so that they can play it later.
                return preload.tag;
            };
            /**
             * Add the sound filename specified to the list of sounds that will be preloaded. The "filename" is
             * assumed to be in a path that is relative to the page that the game is being served from an inside
             * of a "sounds/" sub-folder.
             *
             * NOTE: Since different browsers support different file formats, you should provide both an MP3 and
             * an OGG version of the same file, and provide a filename that has no extension on it. The code in
             * this method will apply the correct extension based on the browser in use and load the appropriate file.
             *
             * The return value is a sound object that can be used to play the sound once it's loaded.
             *
             * @param filename the filename of the sound to load; assumed to be relative to a sounds/ folder in
             * the same path as the page is in and to have no extension
             * @returns {Sound} the sound object that will (eventually) play the requested audio
             * @throws {Error} if an attempt is made to add a sound to preload after preloading has already started
             * @see addMusic
             */
            function addSound(filename) {
                // Use our helper to actually get the audio tag, then wrap it in a sound.
                return new game.Sound(doAddSound("sounds/", filename));
            }
            Preloader.addSound = addSound;
            /**
             * Add the music filename specified to the list of music that will be preloaded. The "filename" is
             * assumed to be in a path that is relative to the page that the game is being served from an inside
             * of a "music/" sub-folder.
             *
             * NOTE: Since different browsers support different file formats, you should provide both an MP3 and
             * an OGG version of the same file, and provide a filename that has no extension on it. The code in
             * this method will apply the correct extension based on the browser in use and load the appropriate file.
             *
             * This works identically to addSound() except that the sound returned is set to play looped by
             * default.
             *
             * @param filename the filename of the sound to load; assumed to be relative to a sounds/ folder in
             * the same path as the page is in and to have no extension
             * @returns {Sound} the sound object that will (eventually) play the requested audio
             * @throws {Error} if an attempt is made to add a sound to preload after preloading has already started
             * @see addSound
             */
            function addMusic(filename) {
                return new game.Sound(doAddSound("music/", filename), true);
            }
            Preloader.addMusic = addMusic;
            /**
             * Start the image preload happening.
             *
             * @throws {Error} if image preloading is already started
             */
            function commence(callback) {
                // Make sure that image preloading is not already started
                if (_preloadStarted)
                    throw new Error("Cannot start preloading; preloading is already started");
                // Save the callback and then indicate that the preload has started.
                _completionCallback = callback;
                _preloadStarted = true;
                // If there is nothing to preload, fire the callback now and leave.
                if (_imagesToLoad == 0 && _soundsToLoad == 0) {
                    _completionCallback();
                    return;
                }
                // Iterate over the entire preload list and set in the source to get the image from. This will start
                // the browser loading things.
                for (var key in _imagePreloadList) {
                    if (_imagePreloadList.hasOwnProperty(key))
                        _imagePreloadList[key].src = key;
                }
                // For sounds they're in an array instead of an object so that we can load duplicates.
                for (var i = 0; i < _soundPreloadList.length; i++)
                    _soundPreloadList[i].tag.src = _soundPreloadList[i].src;
            }
            Preloader.commence = commence;
        })(Preloader = game.Preloader || (game.Preloader = {}));
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
/**
 * This module exports various helper routines that might be handy in a game context but which don't
 * otherwise fit into a class.
 */
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        var Utils;
        (function (Utils) {
            /**
             * Return a random floating point number in the range of min to max, inclusive.
             *
             * @param min the minimum number to return, inclusive
             * @param max the maximum number to return, inclusive
             *
             * @returns {number} a random number somewhere in the range of min and max, inclusive
             */
            function randomFloatInRange(min, max) {
                return Math.random() * (max - min) + min;
            }
            Utils.randomFloatInRange = randomFloatInRange;
            /**
             * Return a random integer number in the range of min to max, inclusive.
             *
             * @param min the minimum number to return, inclusive
             * @param max the maximum number to return, inclusive
             *
             * @returns {number} a random number somewhere in the range of min and max, inclusive
             */
            function randomIntInRange(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            Utils.randomIntInRange = randomIntInRange;
            /**
             * Convert an angle in degrees to an angle in radians. Internally, the JavaScript math API assumes
             * radians, but in games we may want to use degrees as a simplification.
             *
             * @param degrees an angle in degrees to convert
             * @returns {number} the number of degrees, converted into radians.
             */
            function toRadians(degrees) {
                return degrees * Math.PI / 180;
            }
            Utils.toRadians = toRadians;
            /**
             * Convert an angle in radians to an angle in degrees. Internally, the JavaScript math API assumes
             * radians, but in games we may want to use degrees as a simplification.
             *
             * @param radians an angle in radians to convert
             * @returns {number} the number of radians, converted into degrees.
             */
            function toDegrees(radians) {
                return radians * 180 / Math.PI;
            }
            Utils.toDegrees = toDegrees;
            /**
             * Given some angle in degrees, normalize it so that it falls within the range of 0 <-> 359 degrees,
             * inclusive (i.e. 360 degrees becomes 0 and -1 degrees becomes 359, etc).
             *
             * @param degrees the angle in degrees to normalize
             * @returns {number} the normalized angle; it is always in the range of 0 to 359 degrees, inclusive
             */
            function normalizeDegrees(degrees) {
                degrees %= 360;
                if (degrees < 0)
                    degrees += 360;
                return degrees % 360;
            }
            Utils.normalizeDegrees = normalizeDegrees;
        })(Utils = game.Utils || (game.Utils = {}));
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents a single point as a pair of X,Y coordinates. This also includes simple operations
         * such as setting and clamping of values, as well as making copies and comparisons.
         *
         * Most API functions provided come in a variety that takes an X,Y and one that takes another point,
         * so that calling code can use whatever it most appropriate for the situation without having to box
         * or un-box values.
         */
        var Point = (function () {
            /**
             * Construct a new point that uses the provided X and Y values as its initial coordinate.
             *
             * @param x X-coordinate of this point
             * @param y Y-coordinate of this point
             * @constructor
             */
            function Point(x, y) {
                this._x = x;
                this._y = y;
            }
            Object.defineProperty(Point.prototype, "x", {
                /**
                 * X-coordinate of this point.
                 *
                 * @returns {number}
                 */
                get: function () { return this._x; },
                /**
                 * Set the x-coordinate of this point
                 *
                 * @param newX the new X to set.
                 */
                set: function (newX) { this._x = newX; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Point.prototype, "y", {
                /**
                 * Y-coordinate of this point.
                 *
                 * @returns {number}
                 */
                get: function () { return this._y; },
                /**
                 * Set the y-coordinate of this point
                 *
                 * @param newY the new y to set.
                 */
                set: function (newY) { this._y = newY; },
                enumerable: true,
                configurable: true
            });
            /**
             * Return a new point instance that is a copy of this point.
             *
             * @returns {Point} a duplicate of this point
             * @see Point.copyTranslatedXY
             */
            Point.prototype.copy = function () {
                return new Point(this._x, this._y);
            };
            /**
             * Return a new point instance that is a copy of this point, with its values translated by the values
             * passed in.
             *
             * @param translation the point to translate this point by
             * @returns {Point} a duplicate of this point, translated by the value passed in
             * @see Point.copy
             * @see Point.copyTranslatedXY
             */
            Point.prototype.copyTranslated = function (translation) {
                return this.copyTranslatedXY(translation._x, translation._y);
            };
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
            Point.prototype.copyTranslatedXY = function (x, y) {
                var retVal = this.copy();
                return retVal.translateXY(x, y);
            };
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
            Point.prototype.copyReduced = function (factor) {
                return this.copy().reduce(factor);
            };
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
            Point.prototype.copyScaled = function (scale) {
                return this.copy().scale(scale);
            };
            /**
             * Set the position of this point to the same as the point passed in.
             *
             * @param point the point to copy from
             * @returns {Point} this point after the operation completes, for chaining calls.
             */
            Point.prototype.setTo = function (point) {
                return this.setToXY(point._x, point._y);
            };
            /**
             * Set the position of this point to the same as the values passed in
             *
             * @param x new X-coordinate for this point
             * @param y new Y-coordinate for this point
             * @returns {Point} this point after the operation completes, for chaining calls.
             */
            Point.prototype.setToXY = function (x, y) {
                this._x = x;
                this._y = y;
                return this;
            };
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
            Point.prototype.setToArray = function (array) {
                if (array.length >= 2) {
                    this._x = array[0];
                    this._y = array[1];
                    return this;
                }
            };
            /**
             * Compares this point to the point passed in to determine if they represent the same point.
             *
             * @param other the point to compare to
             * @returns {boolean} true or false depending on equality
             */
            Point.prototype.equals = function (other) {
                return this._x == other._x && this._y == other._y;
            };
            /**
             * Compares this point to the values passed in to determine if they represent the same point.
             *
             * @param x the X-coordinate to compare to
             * @param y the Y-coordinate to compare to
             * @returns {boolean} true or false depending on equality
             */
            Point.prototype.equalsXY = function (x, y) {
                return this._x == x && this._y == y;
            };
            /**
             * Translate the location of this point using the values of the point passed in. No range checking is
             * done.
             *
             * @param delta the point that controls both delta values
             * @returns {Point} this point after the translation, for chaining calls.
             */
            Point.prototype.translate = function (delta) {
                return this.translateXY(delta._x, delta._y);
            };
            /**
             * Translate the location of this point using the values passed in. No range checking is done.
             *
             * @param deltaX the change in X-coordinate
             * @param deltaY the change in Y-coordinate
             * @returns {Point} this point after the translation, for chaining calls.
             */
            Point.prototype.translateXY = function (deltaX, deltaY) {
                this._x += deltaX;
                this._y += deltaY;
                return this;
            };
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
            Point.prototype.pointAtAngle = function (angle, distance) {
                // Convert the incoming angle to radians.
                angle *= (Math.PI / 180);
                // We treat this like a right angle triangle problem.
                //
                // Since we know that the cosine is the ratio between the lengths of the adjacent and hypotenuse
                // and the sine is the ratio between the opposite and the hypotenuse, we can calculate those
                // values for the angle we were given, realizing that the adjacent side is the X component and
                // the opposite is the Y component (draw it on paper if you need to).  By multiplying each value
                // with the distance required (the provided distance is the length of the hypotenuse in the
                // triangle), we determine what the actual X and Y values for the point is.  Note that these
                // calculations assume that the origin is the point from which the hypotenuse extends, and so we
                // need to translate the calculated values by the position of that point to get the final
                // location of where the end of the line falls.
                return new Point(Math.cos(angle), Math.sin(angle)).scale(distance).translate(this);
            };
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
            Point.prototype.reduce = function (factor) {
                this._x = Math.floor(this._x / factor);
                this._y = Math.floor(this._y / factor);
                return this;
            };
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
            Point.prototype.scale = function (scale) {
                this._x = Math.floor(this._x * scale);
                this._y = Math.floor(this._y * scale);
                return this;
            };
            /**
             * Clamp the value of the X-coordinate of this point so that it is between the min and max values
             * provided, inclusive.
             *
             * @param minX the minimum X-coordinate to allow
             * @param maxX the maximum Y-coordinate to allow
             * @returns {Point} this point after the clamp is completed, for chaining calls.
             */
            Point.prototype.clampX = function (minX, maxX) {
                if (this._x < minX)
                    this._x = minX;
                else if (this._x > maxX)
                    this._x = maxX;
                return this;
            };
            /**
             * Clamp the value of the Y-coordinate of this point so that it is between the min and max values
             * provided, inclusive.
             *
             * @param minY the minimum Y-coordinate to allow
             * @param maxY the maximum Y-coordinate to allow
             * @returns {Point} this point after the clamp is completed, for chaining calls.
             */
            Point.prototype.clampY = function (minY, maxY) {
                if (this._y < minY)
                    this._y = minY;
                else if (this._y > maxY)
                    this._y = maxY;
                return this;
            };
            /**
             * Clamp the X and Y values of the provided point so that they are within the bounds of the stage
             * provided.
             *
             * @param stage the stage to clamp to
             * @returns {Point} this point after the clamp is completed, for chaining calls.
             */
            Point.prototype.clampToStage = function (stage) {
                this.clampX(0, stage.width - 1);
                this.clampY(0, stage.height - 1);
                return this;
            };
            /**
             * Return a copy of this point as an array of two numbers in x, y ordering.
             *
             * @returns {Array<number>} the point as an array of two numbers.
             */
            Point.prototype.toArray = function () {
                return [this._x, this._y];
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Point.prototype.toString = function () {
                return String.format("[{0}, {1}]", this._x, this._y);
            };
            return Point;
        })();
        game.Point = Point;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents the base class for any game object of any base type. This base class
         * implementation has a position and knows how to render itself.
         *
         */
        var Actor = (function () {
            /**
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
             */
            function Actor(name, stage, x, y, width, height, zOrder, debugColor) {
                if (zOrder === void 0) { zOrder = 1; }
                if (debugColor === void 0) { debugColor = 'white'; }
                // Save the passed in values.
                this._name = name;
                this._stage = stage;
                this._width = width;
                this._height = height;
                this._zOrder = zOrder;
                this._debugColor = debugColor;
                // For position we save the passed in position and then make a reduced copy to turn it into
                // tile coordinates for the map position.
                this._position = new game.Point(x, y);
                this._mapPosition = this._position.copyReduced(game.TILE_SIZE);
            }
            Object.defineProperty(Actor.prototype, "mapPosition", {
                /**
                 * The position of this actor in the tile map. These coordinates are in tiles.
                 *
                 * @returns {Point}
                 */
                get: function () { return this._mapPosition; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Actor.prototype, "position", {
                /**
                 * The position of this actor in the world. These coordinates are in pixel coordinates.
                 *
                 * @returns {Point}
                 */
                get: function () { return this._position; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Actor.prototype, "width", {
                /**
                 * Get the width of this actor, in pixels.
                 *
                 * @returns {number}
                 */
                get: function () { return this._width; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Actor.prototype, "height", {
                /**
                 * Get the height of this actor, in pixels.
                 *
                 * @returns {number}
                 */
                get: function () { return this._height; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Actor.prototype, "zOrder", {
                /**
                 * Get the layer (Z-Order) of this actor. When rendered, actors with a lower Z-Order are rendered
                 * before actors with a higher Z-Order; thus this sets the rendering and display order for actors
                 * by type.
                 *
                 * @returns {number}
                 */
                get: function () { return this._zOrder; },
                /**
                 * Set the layer (Z-Order) of this actor. When rendered, actors with a lower Z-Order are rendered
                 * before actors with a higher Z-Order; thus this sets the rendering and display order for actors
                 * by type.
                 *
                 * @returns {number}
                 */
                set: function (newZOrder) { this._zOrder = newZOrder; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Actor.prototype, "stage", {
                /**
                 * Get the stage that owns this actor.
                 *
                 * @returns {Stage}
                 */
                get: function () { return this._stage; },
                enumerable: true,
                configurable: true
            });
            /**
             * Update internal stage for this actor. The default implementation does nothing.
             *
             * @param stage the stage that the actor is on
             * @param tick the game tick; this is a count of how many times the game loop has executed
             */
            Actor.prototype.update = function (stage, tick) {
            };
            /**
             * Render this actor to the stage provided. The default implementation renders a positioning box
             * for this actor using its position and size using the debug color set at construction time.
             *
             * @param x the x location to render the actor at, in stage coordinates (NOT world)
             * @param y the y location to render the actor at, in stage coordinates (NOT world)
             * @param renderer the class to use to render the actor
             */
            Actor.prototype.render = function (x, y, renderer) {
                // Draw a filled rectangle for actor using the debug color.
                renderer.strokeRect(x, y, this._width, this._height, this._debugColor, 1);
            };
            /**
             * Set the position of this actor by setting its position on the stage in world coordinates. The
             * position of the actor on the map will automatically be updated as well.
             *
             * @param point the new position for this actor
             */
            Actor.prototype.setStagePosition = function (point) {
                this.setStagePositionXY(point.x, point.y);
            };
            /**
             /**
             * Set the position of this actor by setting its position on the stage in world coordinates. The
             * position of the actor on the map will automatically be updated as well.
             *
             * @param x the new X coordinate for the actor
             * @param y the new Y coordinate for the actor
             */
            Actor.prototype.setStagePositionXY = function (x, y) {
                this._position.setToXY(x, y);
                this._mapPosition = this._position.copyReduced(game.TILE_SIZE);
            };
            /**
             * Set the position of this actor by setting its position on the map in ile coordinates. The
             * position of the actor in the world will automatically be updated as well.
             *
             * @param point the new position for this actor
             */
            Actor.prototype.setMapPosition = function (point) {
                this.setMapPositionXY(point.x, point.y);
            };
            /**
             * Set the position of this actor by setting its position on the map in ile coordinates. The
             * position of the actor in the world will automatically be updated as well.
             *
             * @param x the new X coordinate for this actor
             * @param y the new Y coordinate for this actor
             */
            Actor.prototype.setMapPositionXY = function (x, y) {
                this._mapPosition.setToXY(x, y);
                this._position = this._mapPosition.copyScaled(game.TILE_SIZE);
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Actor.prototype.toString = function () {
                return String.format("[Actor name={0}]", this._name);
            };
            return Actor;
        })();
        game.Actor = Actor;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
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
        var Entity = (function (_super) {
            __extends(Entity, _super);
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
            function Entity(name, stage, x, y, width, height, zOrder, properties, defaults, debugColor) {
                if (defaults === void 0) { defaults = {}; }
                if (debugColor === void 0) { debugColor = 'white'; }
                // Invoke the super class constructor.
                _super.call(this, name, stage, x, y, width, height, zOrder, debugColor);
                // Save our properties, apply defaults, and then validate them
                this._properties = properties;
                this.applyDefaultProperties(defaults);
                this.validateProperties();
            }
            Object.defineProperty(Entity.prototype, "properties", {
                /**
                 * The list of properties that is assigned to this entity.
                 *
                 * @returns {EntityProperties}
                 */
                get: function () { return this._properties; },
                enumerable: true,
                configurable: true
            });
            /**
             * This method is for use in modifying an entity property object to include defaults for properties
             * that don't already exist.
             *
             * In use, the list of defaults is walked, and for each such default that does not already have a
             * value in the properties object, the property will be copied over to the properties object.
             *
             * @param defaults default properties to apply to this entity
             */
            Entity.prototype.applyDefaultProperties = function (defaults) {
                for (var propertyName in defaults) {
                    if (defaults.hasOwnProperty(propertyName) && this._properties[propertyName] == null)
                        this._properties[propertyName] = defaults[propertyName];
                }
            };
            /**
             * Every time this method is invoked, it returns a new unique entity id string to apply to the id
             * property of an entity.
             *
             * @returns {string}
             */
            Entity.createDefaultID = function () {
                Entity.autoEntityID++;
                return "_ng_entity" + Entity.autoEntityID;
            };
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
            Entity.prototype.isPropertyValid = function (name, required, values) {
                if (values === void 0) { values = null; }
                // Get the value of the property (if any).
                var propertyValue = this._properties[name];
                // Does the property exist?
                if (propertyValue == null) {
                    // It does not. If it's not required, then return. Otherwise, complain that it's missing.
                    if (required)
                        throw new ReferenceError("Entity " + this._name + ": missing property '" + name + "'");
                    else
                        return;
                }
                // If we got a list of possible values and this property actually exists, make sure that the
                // value is one of them.
                if (values != null && propertyValue != null) {
                    for (var i = 0; i < values.length; i++) {
                        if (propertyValue == values[i])
                            return;
                    }
                    // If we get here, we did not find the value in the list of valid values.
                    throw new RangeError("Entity " + this._name + ": invalid value for property '" + name + "': not in allowable list");
                }
            };
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
            Entity.prototype.validateProperties = function () {
                // If there is not an id property, install it. We don't have to otherwise validate anything,
                // as this is the only property that we care about and the compiler ensures that its type is
                // correct so we don't have to do anything else.
                if (this._properties.id == null)
                    this._properties.id = Entity.createDefaultID();
            };
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
            Entity.prototype.blocksActorMovement = function (actor) {
                return true;
            };
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
            Entity.prototype.trigger = function (activator) {
                if (activator === void 0) { activator = null; }
            };
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
            Entity.prototype.triggerTouch = function (activator) {
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Entity.prototype.toString = function () {
                return String.format("[Entity name={0}]", this._name);
            };
            /**
             * Every time an entity ID is automatically generated, this value is appended to it to give it a
             * unique number.
             *
             * @type {number}
             */
            Entity.autoEntityID = 0;
            return Entity;
        })(game.Actor);
        game.Entity = Entity;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class is the base class for all scenes in a game. A Scene is just a simple wrapper around
         * specific handling for input handling as well as object update and rendering, which allows for better
         * object isolation.
         *
         * This base class defines the behaviour of a scene as it applies to a game; you should subclass it to
         * implement your own specific handling as needed.
         */
        var Scene = (function () {
            /**
             * Construct a new scene instances that has the given name and is managed by the provided stage.
             *
             * The new scene starts with an empty actor list.
             *
             * @param name the name of this scene for debug purposes
             * @param stage the stage that manages this scene
             * @constructor
             */
            function Scene(name, stage) {
                // Store the name and stage provided.
                this._name = name;
                this._stage = stage;
                this._renderer = stage.renderer;
                // Start with an empty actor list
                this._actorList = [];
            }
            /**
             * This method is invoked at the start of every game frame to allow this scene to update the state of
             * all objects that it contains.
             *
             * This base version invokes the update method for all actors that are currently registered with the
             * scene.
             *
             * @param tick the game tick; this is a count of how many times the game loop has executed
             */
            Scene.prototype.update = function (tick) {
                for (var i = 0; i < this._actorList.length; i++)
                    this._actorList[i].update(this._stage, tick);
            };
            /**
             * This method is invoked every frame after the update() method is invoked to allow this scene to
             * render to the stage everything that it visually wants to appear.
             *
             * This base version invokes the render method for all actors that are currently registered with the
             * stage.
             */
            Scene.prototype.render = function () {
                for (var i = 0; i < this._actorList.length; i++) {
                    var actor = this._actorList[i];
                    actor.render(actor.position.x, actor.position.y, this._renderer);
                }
            };
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
            Scene.prototype.activating = function (previousScene) {
                console.log("Scene activation:", this.toString());
            };
            /**
             * This method is invoked when this scene is being deactivated in favor of a different scene. This can
             * be used to persist any scene state or do any other house keeping.
             *
             * This gets invoked before the next scene gets told that it is becoming active. The parameter
             * passed in is the scene that will become active.
             *
             * @param nextScene the scene that is about to become active
             */
            Scene.prototype.deactivating = function (nextScene) {
                console.log("Scene deactivation:", this.toString());
            };
            /**
             * Add an actor to the list of actors that exist in this scene. This will cause the scene to
             * automatically invoke the update and render methods on this actor while this scene is active.
             *
             * @param actor the actor to add to the scene
             * @see Scene.addActorArray
             */
            Scene.prototype.addActor = function (actor) {
                this._actorList.push(actor);
            };
            /**
             * Add all of the actors from the passed in array to the list of actors that exist in this scene. This
             * will cause the scene to automatically invoke the update and render methods on these actors while
             * the scene is active.
             *
             * @param actorArray the list of actors to add
             * @see Scene.addActorArray
             */
            Scene.prototype.addActorArray = function (actorArray) {
                for (var i = 0; i < actorArray.length; i++)
                    this.addActor(actorArray[i]);
            };
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
            Scene.prototype.actorsAt = function (location) {
                return this.actorsAtXY(location.x, location.y);
            };
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
            Scene.prototype.actorsAtXY = function (x, y) {
                var retVal = [];
                for (var i = 0; i < this._actorList.length; i++) {
                    var actor = this._actorList[i];
                    if (actor.position.x == x && actor.position.y == y)
                        retVal.push(actor);
                }
                return retVal;
            };
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
            Scene.prototype.actorsAtMap = function (location) {
                return this.actorsAtMapXY(location.x, location.y);
            };
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
            Scene.prototype.actorsAtMapXY = function (x, y) {
                var retVal = [];
                for (var i = 0; i < this._actorList.length; i++) {
                    var actor = this._actorList[i];
                    if (actor.mapPosition.x == x && actor.mapPosition.y == y)
                        retVal.push(actor);
                }
                return retVal;
            };
            /**
             * This method will sort all of the actors that are currently attached to the scene by their current
             * internal Z-Order value, so that when they are iterated for rendering/updates, they get handled in
             * an appropriate order.
             *
             * Note that the sort used is not stable.
             */
            Scene.prototype.sortActors = function () {
                this._actorList.sort(function (left, right) { return left.zOrder - right.zOrder; });
            };
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
            Scene.prototype.inputKeyDown = function (eventObj) {
                // If the key pressed is the F5 key, take a screenshot.
                if (eventObj.keyCode == game.KeyCodes.KEY_F5) {
                    this._stage.screenshot();
                    return true;
                }
                return false;
            };
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
            Scene.prototype.inputKeyUp = function (eventObj) {
                return false;
            };
            /**
             * This gets triggered while the game is running, this scene is the current scene, and the mouse
             * moves over the stage.
             *
             * The method should return true if the mouse event was handled or false if it was not. The Stage
             * will prevent the default handling for all mouse events that are handled.
             *
             * @param eventObj the event object
             * @see Stage.calculateMousePos
             */
            Scene.prototype.inputMouseMove = function (eventObj) {
                return false;
            };
            /**
             * This gets triggered while the game is running, this scene is the current scene, and the mouse
             * is clicked on the stage.
             *
             * The method should return true if the mouse event was handled or false if it was not. The Stage
             * will prevent the default handling for all mouse events that are handled.
             *
             * @param eventObj the event object
             * @see Stage.calculateMousePos
             */
            Scene.prototype.inputMouseClick = function (eventObj) {
                return false;
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Scene.prototype.toString = function () {
                return String.format("[Scene name={0}]", this._name);
            };
            return Scene;
        })();
        game.Scene = Scene;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This enum is used in the drawArrow method to determine what end of the line that makes up the arrow
         * a head should be drawn at.
         */
        (function (ArrowType) {
            /**
             * Neither end of the line should have an arrow head. This is just basically a slightly more
             * expensive call to draw a simple line.
             */
            ArrowType[ArrowType["NONE"] = 0] = "NONE";
            /**
             * The start of the line should have an arrowhead.
             */
            ArrowType[ArrowType["START"] = 1] = "START";
            /**
             * The end of the line should have an arrowhead.
             */
            ArrowType[ArrowType["END"] = 2] = "END";
            /**
             * Both ends of the line should have an arrowhead.
             */
            ArrowType[ArrowType["BOTH"] = 3] = "BOTH";
        })(game.ArrowType || (game.ArrowType = {}));
        var ArrowType = game.ArrowType;
        /**
         * This enum is used in the drawArrow method to determine what kind of arrow head to render onto the
         * arrow.
         *
         * Most of these provide an arrow with a curved head and just vary the method used to draw the curve,
         * which has subtle effects on how the curve appears.
         */
        (function (ArrowStyle) {
            /**
             * The arrowhead is curved using a simple arc.
             */
            ArrowStyle[ArrowStyle["ARC"] = 0] = "ARC";
            /**
             * The arrowhead has a straight line end
             */
            ArrowStyle[ArrowStyle["STRAIGHT"] = 1] = "STRAIGHT";
            /**
             * The arrowhead is unfilled with no end (it looks like a V)
             */
            ArrowStyle[ArrowStyle["UNFILLED"] = 2] = "UNFILLED";
            /**
             * The arrowhead is curved using a quadratic curve.
             */
            ArrowStyle[ArrowStyle["QUADRATIC"] = 3] = "QUADRATIC";
            /**
             * The arrowhead is curbed using a bezier curve
             */
            ArrowStyle[ArrowStyle["BEZIER"] = 4] = "BEZIER";
        })(game.ArrowStyle || (game.ArrowStyle = {}));
        var ArrowStyle = game.ArrowStyle;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents the stage area in the page, which is where the game renders itself.
         *
         * The class knows how to create the stage and do some rendering. This is also where the core
         * rendering loop is contained.
         */
        var CanvasRenderer = (function () {
            /**
             * Construct an instance of the class that knows how to render to the canvas provided. All
             * rendering will be performed by this canvas.
             *
             * This class assumes that the canvas is the entire size of the stage.
             *
             * @param canvas the canvas to use for rendering
             */
            function CanvasRenderer(canvas) {
                // Set our internal canvas context based on the canvas we were given.
                this._canvasContext = canvas.getContext('2d');
            }
            Object.defineProperty(CanvasRenderer.prototype, "width", {
                /**
                 * The width of the stage, in pixels. This is set at creation time and cannot change.
                 *
                 * @type {number} the width of the stage area in pixels
                 */
                get: function () { return game.STAGE_WIDTH; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasRenderer.prototype, "height", {
                /**
                 * The height of the stage, in pixels. This is set at creation time and cannot change.
                 *
                 * @type {number} the height of the stage area in pixels
                 */
                get: function () { return game.STAGE_HEIGHT; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasRenderer.prototype, "context", {
                /**
                 * Get the underlying rendering context for the stage.
                 *
                 * @returns {CanvasRenderingContext2D} the underlying rendering context for the stage
                 */
                get: function () { return this._canvasContext; },
                enumerable: true,
                configurable: true
            });
            /**
             * Clear the entire rendering area with the provided color.
             *
             * @param color the color to clear the stage with.
             */
            CanvasRenderer.prototype.clear = function (color) {
                if (color === void 0) { color = 'black'; }
                this._canvasContext.fillStyle = color;
                this._canvasContext.fillRect(0, 0, game.STAGE_WIDTH, game.STAGE_HEIGHT);
            };
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
            CanvasRenderer.prototype.fillRect = function (x, y, width, height, color) {
                this._canvasContext.fillStyle = color;
                this._canvasContext.fillRect(x, y, width, height);
            };
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
            CanvasRenderer.prototype.strokeRect = function (x, y, width, height, color, lineWidth) {
                if (lineWidth === void 0) { lineWidth = 1; }
                this._canvasContext.strokeStyle = color;
                this._canvasContext.lineWidth = lineWidth;
                this._canvasContext.strokeRect(x, y, width, height);
            };
            /**
             * Render a filled circle with its center at the position provided.
             *
             * @param x X location of the center of the circle
             * @param y Y location of the center of the circle
             * @param radius radius of the circle to draw
             * @param color the color to fill the circle with
             */
            CanvasRenderer.prototype.fillCircle = function (x, y, radius, color) {
                this._canvasContext.fillStyle = color;
                this._canvasContext.beginPath();
                this._canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
                this._canvasContext.fill();
            };
            /**
             * Render a stroked circle with its center at the position provided.
             *
             * @param x X location of the center of the circle
             * @param y Y location of the center of the circle
             * @param radius radius of the circle to draw
             * @param color the color to stroke the circle with
             * @param lineWidth the thickness of the line to stroke with
             */
            CanvasRenderer.prototype.strokeCircle = function (x, y, radius, color, lineWidth) {
                if (lineWidth === void 0) { lineWidth = 1; }
                this._canvasContext.strokeStyle = color;
                this._canvasContext.lineWidth = lineWidth;
                this._canvasContext.beginPath();
                this._canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
                this._canvasContext.stroke();
            };
            /**
             * Perform the job of executing the commands that will render the polygon points listed.
             *
             * This begins a path, executes all of the commands, and then returns. It is up to the color to
             * set any styles needed and stroke or fill the path as desired.
             *
             * @param pointList the polygon to do something with.
             */
            CanvasRenderer.prototype.renderPolygon = function (pointList) {
                // Start the path now
                this._canvasContext.beginPath();
                // Iterate over all points and handle them.
                for (var i = 0; i < pointList.length; i++) {
                    // Alias the point
                    var point = pointList[i];
                    var cmd = void 0, x = void 0, y = void 0;
                    // If the first item is a string, then it is a command and the following parts are the
                    // point values (except for a 'c' command, which does not need them.
                    if (typeof point[0] == "string") {
                        cmd = point[0];
                        x = point[1];
                        y = point[2];
                    }
                    else {
                        // There are only two elements, so there is an implicit command. If this is the first
                        // point, the command is an implicit moveTo, otherwise it is an implicit lineTo.
                        cmd = (i == 0 ? 'm' : 'l');
                        x = point[0];
                        y = point[1];
                    }
                    switch (cmd) {
                        case 'm':
                            this._canvasContext.moveTo(x, y);
                            break;
                        case 'l':
                            this._canvasContext.lineTo(x, y);
                            break;
                        case 'c':
                            this._canvasContext.closePath();
                            break;
                    }
                }
                // Close the path now
                this._canvasContext.closePath();
            };
            /**
             * Render an arbitrary polygon by connecting all of the points provided in the polygon and then
             * filling the result.
             *
             * The points should be in the polygon in clockwise order.
             *
             * @param pointList the list of points that describe the polygon to render.
             * @param color the color to fill the polygon with.
             */
            CanvasRenderer.prototype.fillPolygon = function (pointList, color) {
                // Set the color, render and fill.
                this._canvasContext.fillStyle = color;
                this.renderPolygon(pointList);
                this._canvasContext.fill();
            };
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
            CanvasRenderer.prototype.strokePolygon = function (pointList, color, lineWidth) {
                if (lineWidth === void 0) { lineWidth = 1; }
                // Set the color and line width, render and stroke.
                this._canvasContext.strokeStyle = color;
                this._canvasContext.lineWidth = lineWidth;
                this.renderPolygon(pointList);
                this._canvasContext.stroke();
            };
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
            CanvasRenderer.prototype.setLineStyle = function (color, lineWidth, lineCap) {
                if (lineWidth === void 0) { lineWidth = 3; }
                if (lineCap === void 0) { lineCap = "round"; }
                this._canvasContext.strokeStyle = color;
                this._canvasContext.lineWidth = lineWidth;
                this._canvasContext.lineCap = lineCap;
            };
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
            CanvasRenderer.prototype.drawHead = function (x0, y0, x1, y1, x2, y2, style) {
                var backDistance;
                // First, the common drawing operations. Generate a line from the left of the arrow head to the
                // point of the arrow and then down the other side.
                this._canvasContext.save();
                this._canvasContext.beginPath();
                this._canvasContext.moveTo(x0, y0);
                this._canvasContext.lineTo(x1, y1);
                this._canvasContext.lineTo(x2, y2);
                // Now use the style to finish the arrow head.
                switch (style) {
                    // The arrow head has a curved line that connects the two sides together.
                    case 0:
                        backDistance = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
                        this._canvasContext.arcTo(x1, y1, x0, y0, .55 * backDistance);
                        this._canvasContext.fill();
                        break;
                    // The arrow head has a straight line that connects the two sides together.
                    case 1:
                        this._canvasContext.beginPath();
                        this._canvasContext.moveTo(x0, y0);
                        this._canvasContext.lineTo(x1, y1);
                        this._canvasContext.lineTo(x2, y2);
                        this._canvasContext.lineTo(x0, y0);
                        this._canvasContext.fill();
                        break;
                    // The arrow head is unfilled, so we're already done.
                    case 2:
                        this._canvasContext.stroke();
                        break;
                    // The arrow head has a curved line, but the arc is a quadratic curve instead of just a
                    // simple arc.
                    case 3:
                        var cpx = (x0 + x1 + x2) / 3;
                        var cpy = (y0 + y1 + y2) / 3;
                        this._canvasContext.quadraticCurveTo(cpx, cpy, x0, y0);
                        this._canvasContext.fill();
                        break;
                    // The arrow has a curved line, but the arc is a bezier curve instead of just a simple arc.
                    case 4:
                        var cp1x, cp1y, cp2x, cp2y;
                        var shiftAmt = 5;
                        if (x2 == x0) {
                            // Avoid a divide by zero if x2==x0
                            backDistance = y2 - y0;
                            cp1x = (x1 + x0) / 2;
                            cp2x = (x1 + x0) / 2;
                            cp1y = y1 + backDistance / shiftAmt;
                            cp2y = y1 - backDistance / shiftAmt;
                        }
                        else {
                            backDistance = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
                            var xBack = (x0 + x2) / 2;
                            var yBack = (y0 + y2) / 2;
                            var xMid = (xBack + x1) / 2;
                            var yMid = (yBack + y1) / 2;
                            var m = (y2 - y0) / (x2 - x0);
                            var dX = (backDistance / (2 * Math.sqrt(m * m + 1))) / shiftAmt;
                            var dY = m * dX;
                            cp1x = xMid - dX;
                            cp1y = yMid - dY;
                            cp2x = xMid + dX;
                            cp2y = yMid + dY;
                        }
                        this._canvasContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x0, y0);
                        this._canvasContext.fill();
                        break;
                }
                this._canvasContext.restore();
            };
            /**
             * Set the style for all subsequent drawArrow() calls to use when drawing arrows. This needs to be
             * called prior to drawing any arrows to ensure that the canvas style used to draw arrows is updated;
             * the value does not persist. In particular, changing line styles will also change this.
             *
             * @param color the color to draw an arrow with
             * @param lineWidth the width of the arrow line
             * @see Render.setLineStyle
             */
            CanvasRenderer.prototype.setArrowStyle = function (color, lineWidth) {
                if (lineWidth === void 0) { lineWidth = 2; }
                this._canvasContext.strokeStyle = color;
                this._canvasContext.fillStyle = color;
                this._canvasContext.lineWidth = lineWidth;
            };
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
            CanvasRenderer.prototype.drawArrow = function (x1, y1, x2, y2, style, which, angle, d) {
                if (style === void 0) { style = game.ArrowStyle.QUADRATIC; }
                if (which === void 0) { which = game.ArrowType.END; }
                if (angle === void 0) { angle = Math.PI / 8; }
                if (d === void 0) { d = 16; }
                // For ends with arrow we actually want to stop before we get to the arrow so that wide lines
                // won't put a flat end on the arrow caused by the rendered line end cap.
                var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
                var ratio = (dist - d / 3) / dist;
                var toX, toY, fromX, fromY;
                // When the first bit is set, the end point of the line gets an arrow.
                if ((which & 1) != 0) {
                    toX = Math.round(x1 + (x2 - x1) * ratio);
                    toY = Math.round(y1 + (y2 - y1) * ratio);
                }
                else {
                    toX = x2;
                    toY = y2;
                }
                // When the second bit is set, the start point of the line gets an arrow.
                if ((which & 2) != 0) {
                    fromX = x1 + (x2 - x1) * (1 - ratio);
                    fromY = y1 + (y2 - y1) * (1 - ratio);
                }
                else {
                    fromX = x1;
                    fromY = y1;
                }
                // Draw the shaft of the arrow
                this._canvasContext.beginPath();
                this._canvasContext.moveTo(fromX, fromY);
                this._canvasContext.lineTo(toX, toY);
                this._canvasContext.stroke();
                // Calculate the angle that the line is going so that we can align the arrow head properly.
                var lineAngle = Math.atan2(y2 - y1, x2 - x1);
                // Calculate the line length of the side of the arrow head. We know the length if the line was
                // straight, so we need to have its length when it's rotated to the angle that it is to be drawn
                // at. h is the line length of a side of the arrow head
                var h = Math.abs(d / Math.cos(angle));
                var angle1, angle2, topX, topY, botX, botY;
                // When the first bit is set, we want to draw an arrow head at the end of the line.
                if ((which & 1) != 0) {
                    angle1 = lineAngle + Math.PI + angle;
                    topX = x2 + Math.cos(angle1) * h;
                    topY = y2 + Math.sin(angle1) * h;
                    angle2 = lineAngle + Math.PI - angle;
                    botX = x2 + Math.cos(angle2) * h;
                    botY = y2 + Math.sin(angle2) * h;
                    this.drawHead(topX, topY, x2, y2, botX, botY, style);
                }
                // WHen the second bit is set, we want to draw an arrow head at the start of the line.
                if ((which & 2) != 0) {
                    angle1 = lineAngle + angle;
                    topX = x1 + Math.cos(angle1) * h;
                    topY = y1 + Math.sin(angle1) * h;
                    angle2 = lineAngle - angle;
                    botX = x1 + Math.cos(angle2) * h;
                    botY = y1 + Math.sin(angle2) * h;
                    this.drawHead(topX, topY, x1, y1, botX, botY, style);
                }
            };
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
            CanvasRenderer.prototype.drawTxt = function (text, x, y, color) {
                this._canvasContext.fillStyle = color;
                this._canvasContext.fillText(text, x, y);
            };
            /**
             * Displays a bitmap to the stage such that its upper left corner is at the point provided.
             *
             * @param bitmap the bitmap to display
             * @param x X location to display the bitmap at
             * @param y Y location to display the bitmap at
             * @see Render.blitCentered
             * @see Render.blitCenteredRotated
             */
            CanvasRenderer.prototype.blit = function (bitmap, x, y) {
                this._canvasContext.drawImage(bitmap, x, y);
            };
            /**
             * Displays a bitmap to the stage such that its center is at the point provided.
             *
             * @param bitmap the bitmap to display
             * @param x X location to display the center of the bitmap at
             * @param y Y location to display the center of the bitmap at
             * @see Render.blit
             * @see Render.blitCenteredRotated
             */
            CanvasRenderer.prototype.blitCentered = function (bitmap, x, y) {
                this.translateAndRotate(x, y);
                this._canvasContext.drawImage(bitmap, -(bitmap.width / 2), -(bitmap.height / 2));
                this._canvasContext.restore();
            };
            /**
             * Display a bitmap to the stage such that its center is at the point provided. The bitmap is also
             * rotated according to the rotation value, which is an angle in radians.
             *
             * @param bitmap the bitmap to display
             * @param x X location to display the center of the bitmap at
             * @param y Y location to display the center of the bitmap at
             * @param angle the angle to rotate the bitmap to (in degrees)
             * @see Render.blit
             * @see Render.blitCentered
             */
            CanvasRenderer.prototype.blitCenteredRotated = function (bitmap, x, y, angle) {
                this.translateAndRotate(x, y, angle);
                this._canvasContext.drawImage(bitmap, -(bitmap.width / 2), -(bitmap.height / 2));
                this._canvasContext.restore();
            };
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
            CanvasRenderer.prototype.translateAndRotate = function (x, y, angle) {
                if (x === void 0) { x = null; }
                if (y === void 0) { y = null; }
                if (angle === void 0) { angle = null; }
                // First, save the canvas context.
                this._canvasContext.save();
                // If we are translating, translate now.
                if (x != null && y != null)
                    this._canvasContext.translate(x, y);
                // If we are rotating, rotate now.
                if (angle != null)
                    this._canvasContext.rotate(angle * (Math.PI / 180));
            };
            /**
             * Restore the canvas state that was in effect the last time that translateAndRotate was invoked. This
             * needs to be invoked the same number of times as that function was invoked because the canvas state
             * is stored on a stack.
             *
             * @see Render.translateAndRotate
             */
            CanvasRenderer.prototype.restore = function () {
                this._canvasContext.restore();
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            CanvasRenderer.prototype.toString = function () {
                return String.format("[CanvasRenderer dimensions={0}x{1}, tileSize={2}]", game.STAGE_WIDTH, game.STAGE_HEIGHT, game.TILE_SIZE);
            };
            return CanvasRenderer;
        })();
        game.CanvasRenderer = CanvasRenderer;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * The FPS that the engine is currently running at. This is recalculated once per second so that
         * slow update times don't get averaged out over a longer run, which makes the number less useful.
         *
         * @type {number}
         */
        var _fps = 0;
        /**
         * When calculating FPS, this is the time that the most recent frame count started. Once we have
         * counted frames for an entire second, this is reset and the count starts again.
         *
         * @type {number}
         */
        var _startTime = 0;
        /**
         * When calculating FPS, this is the number of frames that we have seen over the last second. When
         * the startTime gets reset, so does this. This makes sure that spontaneous frame speed changes
         * (e.g. a scene bogging down) don't get averaged away.
         *
         * @type {number}
         */
        var _frameNumber = 0;
        /**
         * When the engine is running, this is the timer ID of the system timer that keeps the game loop
         * running. Otherwise, this is null.
         *
         * @type {number|null}
         */
        var _gameTimerID = null;
        /**
         * The number of update ticks that have occurred so far. This gets incremented every time the game
         * loop executes.
         *
         * @type {number}
         */
        var _updateTicks = 0;
        /**
         * Every time a screenshot is generated, this value is used in the filename. It is then incremented.
         *
         * @type {number}
         */
        var _ss_number = 0;
        /**
         * This template is used to determine the number at the end of a screenshot filename. The end
         * characters are replaced with the current number of the screenshot. This implicitly specifies
         * how many screenshots can be taken in the same session without the filename overflowing.
         *
         * @type {string}
         */
        var _ss_format = "0000";
        /**
         * This class represents the stage area in the page, which is where the game renders itself.
         *
         * The class knows how to create the stage and do some rendering. This is also where the core
         * rendering loop is contained.
         */
        var Stage = (function () {
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
            function Stage(containerDivID, initialColor) {
                var _this = this;
                if (initialColor === void 0) { initialColor = 'black'; }
                /**
                 * This function gets executed in a loop to run the game. Each execution will cause an update and
                 * render to be issued to the current scene.
                 *
                 * In practice, this gets invoked on a timer at the desired FPS that the game should run at.
                 */
                this.sceneLoop = function () {
                    // Get the current time for this frame and the elapsed time since we started.
                    var currentTime = new Date().getTime();
                    var elapsedTime = (currentTime - _startTime) / 1000;
                    // This counts as a frame.
                    _frameNumber++;
                    // Calculate the FPS now. We floor this here because if FPS is for displaying on the screen
                    // you probably don't need a billion digits of precision.
                    _fps = Math.round(_frameNumber / elapsedTime);
                    // If a second or more has elapsed, reset the count. We don't want an average over time, we want
                    // the most recent numbers so that we can see momentary drops.
                    if (elapsedTime > 1) {
                        _startTime = new Date().getTime();
                        _frameNumber = 0;
                    }
                    try {
                        // Before we start the frame update, make sure that the current scene is correct, in case
                        // anyone asked for an update to occur.
                        _this._sceneManager.checkSceneSwitch();
                        // Do the frame update now
                        _this._sceneManager.currentScene.update(_updateTicks++);
                        _this._sceneManager.currentScene.render();
                    }
                    catch (error) {
                        console.log("Caught exception in sceneLoop(), stopping the game");
                        clearInterval(_gameTimerID);
                        _gameTimerID = null;
                        throw error;
                    }
                };
                /**
                 * Handler for key down events. This gets triggered whenever the game is running and any key is
                 * pressed.
                 *
                 * @param evt the event object for this event
                 */
                this.keyDownEvent = function (evt) {
                    if (_this._sceneManager.currentScene.inputKeyDown(evt))
                        evt.preventDefault();
                };
                /**
                 * Handler for key up events. This gets triggered whenever the game is running and any key is
                 * released.
                 *
                 * @param evt the event object for this event
                 */
                this.keyUpEvent = function (evt) {
                    if (_this._sceneManager.currentScene.inputKeyUp(evt))
                        evt.preventDefault();
                };
                /**
                 * Handler for mouse movement events. This gets triggered whenever the game is running and the mouse
                 * moves over the stage.
                 *
                 * @param evt the event object for this event
                 */
                this.mouseMoveEvent = function (evt) {
                    if (_this._sceneManager.currentScene.inputMouseMove(evt))
                        evt.preventDefault();
                };
                /**
                 * Handler for mouse movement events. This gets triggered whenever the game is running and the mouse
                 * is clicked over the canvas.
                 *
                 * @param evt the event object for this event
                 */
                this.mouseClickEvent = function (evt) {
                    if (_this._sceneManager.currentScene.inputMouseClick(evt))
                        evt.preventDefault();
                };
                /**
                 * Turn on input handling for the game. This will capture keyboard events from the document and mouse
                 * events for the canvas provided.
                 *
                 * @param canvas the canvas to listen for mouse events on.
                 */
                this.enableInputEvents = function (canvas) {
                    // Mouse events are specific to the canvas.
                    canvas.addEventListener('mousemove', _this.mouseMoveEvent);
                    canvas.addEventListener('mousedown', _this.mouseClickEvent);
                    // Keyboard events are document wide because a canvas can't hold the input focus.
                    document.addEventListener('keydown', _this.keyDownEvent);
                    document.addEventListener('keyup', _this.keyUpEvent);
                };
                /**
                 * Turn off input handling for the game. This will turn off keyboard events from the document and
                 * mouse events for the canvas provided.
                 */
                this.disableInputEvents = function (canvas) {
                    canvas.removeEventListener('mousemove', _this.mouseMoveEvent);
                    canvas.removeEventListener('mousedown', _this.mouseClickEvent);
                    document.removeEventListener('keydown', _this.keyDownEvent);
                    document.removeEventListener('keyup', _this.keyUpEvent);
                };
                // We don't start off having done a preload.
                this._didPreload = false;
                // Set up the list of sounds.
                this._knownSounds = [];
                // Set up our scene manager object.
                this._sceneManager = new game.SceneManager(this);
                // Obtain the container element that we want to insert the canvas into.
                var container = document.getElementById(containerDivID);
                if (container == null)
                    throw new ReferenceError("Unable to create stage: No such element with ID '" + containerDivID + "'");
                // Create the canvas and give it the appropriate dimensions.
                this._canvas = document.createElement("canvas");
                this._canvas.width = game.STAGE_WIDTH;
                this._canvas.height = game.STAGE_HEIGHT;
                // Modify the style of the container div to make it center horizontally.
                container.style.width = game.STAGE_WIDTH + "px";
                container.style.height = game.STAGE_HEIGHT + "px";
                container.style.marginLeft = "auto";
                container.style.marginRight = "auto";
                // Create our rendering object and then use it to clear the stage.
                this._renderer = new game.CanvasRenderer(this._canvas);
                this._renderer.clear(initialColor);
                // Append the canvas to the container
                container.appendChild(this._canvas);
            }
            Object.defineProperty(Stage.prototype, "width", {
                /**
                 * The width of the stage, in pixels. This is set at creation time and cannot change.
                 *
                 * @type {number} the width of the stage area in pixels
                 */
                get: function () { return game.STAGE_WIDTH; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "height", {
                /**
                 * The height of the stage, in pixels. This is set at creation time and cannot change.
                 *
                 * @type {number} the height of the stage area in pixels
                 */
                get: function () { return game.STAGE_HEIGHT; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "canvas", {
                /**
                 * Get the underlying canvas object for the stage.
                 *
                 * @returns {HTMLCanvasElement} the underlying canvas element for the stage
                 */
                get: function () { return this._canvas; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "renderer", {
                /**
                 * Get the underlying rendering object for the stage. This is the object responsible for all
                 * rendering on the stage.
                 *
                 * @returns {Renderer} the underlying rendering object for the stage
                 */
                get: function () { return this._renderer; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "fps", {
                /**
                 * The stage keeps track of the current frame rate that the update loop is being called at, and this
                 * returns the most recently calculated value. The value is recalculated once per second so that
                 * it is always a near instantaneous read of the current fps and not an average over the life of
                 * the game.
                 *
                 * @returns {Number} the current fps, which is o when the game is stopped orr just started
                 */
                get: function () { return _fps; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "currentScene", {
                /**
                 * Determine what scene is the current scene on this stage.
                 *
                 * @returns {Scene}
                 */
                get: function () {
                    // When the game loop is not running, no scene switches can happen. Primarily this happens
                    // during engine setup.
                    //
                    // When that happens, if the scene manager thinks that there is an upcoming scene change, we
                    // report that to be the current scene because that is what WOULD be the current scene if we
                    // were running.
                    //
                    // When this is not the case, OR it is the case but there is no next scene, whatever the scene
                    // manager thinks is the current scene is good enough for us.
                    return _gameTimerID != null
                        ? this._sceneManager.currentScene
                        : (this._sceneManager.nextScene || this._sceneManager.currentScene);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "tick", {
                /**
                 * Obtain the current engine update tick. This is incremented once every time the frame update
                 * loop is invoked, and can be used to time things in a crude fashion.
                 *
                 * The frame update loop is invoked at a set frame rate.
                 *
                 * @returns {number}
                 */
                get: function () { return _updateTicks; },
                enumerable: true,
                configurable: true
            });
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
            Stage.prototype.run = function (fps) {
                var _this = this;
                if (fps === void 0) { fps = 30; }
                if (_gameTimerID != null)
                    throw new Error("Attempt to start the game running when it is already running");
                // When invoked, this starts the scene loop. We use the lambda syntax to capture the
                // appropriate this pointer so that everything works the way we want it to.
                var startSceneLoop = function () {
                    _this._didPreload = true;
                    // Reset the variables we use for frame counts.
                    _startTime = 0;
                    _frameNumber = 0;
                    // Fire off a timer to invoke our scene loop using an appropriate interval.
                    _gameTimerID = setInterval(_this.sceneLoop, 1000 / fps);
                    // Turn on input events.
                    _this.enableInputEvents(_this._canvas);
                };
                // If we already did a preload, just start the frame loop now. Otherwise, start the preload
                // and the preloader will start it once its done.
                //
                // When we pass the function to the preloader we need to set the implicit this using bind.
                if (this._didPreload)
                    startSceneLoop();
                else
                    game.Preloader.commence(startSceneLoop);
            };
            /**
             * Stop a running game. This halts the update loop but otherwise has no effect. Thus after this call,
             * the game just stops where it was.
             *
             * It is legal to start the game running again via another call to run(), so long as your scenes are
             * not time sensitive.
             *
             * @see Stage.run
             */
            Stage.prototype.stop = function () {
                // Make sure the game is running.
                if (_gameTimerID == null)
                    throw new Error("Attempt to stop the game when it is not running");
                // Stop it.
                clearInterval(_gameTimerID);
                _gameTimerID = null;
                // Turn off input events.
                this.disableInputEvents(this._canvas);
            };
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
             * This is just a proxy for the Preloader.addImage() method, placed here for convenience.
             *
             * @param filename the filename of the image to load
             * @returns {HTMLImageElement} the image element that will contain the image once it is loaded
             * @see Preloader.addImage
             */
            Stage.prototype.preloadImage = function (filename) {
                return game.Preloader.addImage(filename);
            };
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
             * This is just a simple proxy for the Preloader.addSound() method which invokes Stage.addSound() for
             * you.
             *
             * @param filename the filename of the sound to load
             * @returns {Sound} the preloaded sound object
             * @see Preloader.addSound
             * @see Stage.addSound
             */
            Stage.prototype.preloadSound = function (filename) {
                return this.addSound(game.Preloader.addSound(filename));
            };
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
             * This is just a simple proxy for the Preloader.addMusic() method which invokes Stage.addSound()
             * for you.
             *
             * @param filename the filename of the music to load
             * @returns {Sound} the preloaded sound object
             * @see Preloader.addMusic
             * @see Stage.addSound
             */
            Stage.prototype.preloadMusic = function (filename) {
                return this.addSound(game.Preloader.addMusic(filename));
            };
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
            Stage.prototype.addSound = function (sound) {
                this._knownSounds.push(sound);
                return sound;
            };
            /**
             * Iterate all of the sounds known to the stage and toggle their mute stage.
             *
             * For maximum confusion, this only affects registered sound objects that are set to not loop,
             * since such a sound is often used as music and we might want to mute the music separate from the
             * sound (or vice versa).
             *
             * The mute state of all such sounds is set to the state passed in.
             *
             * @param mute true to mute all sounds or false to un-mute all sounds
             */
            Stage.prototype.muteSounds = function (mute) {
                for (var i = 0; i < this._knownSounds.length; i++) {
                    if (this._knownSounds[i].loop == false)
                        this._knownSounds[i].muted = mute;
                }
            };
            /**
             * Iterate all of the sounds known to the stage and change their volume
             *
             * For maximum confusion, this only affects registered sound objects that are set to not loop,
             * since such a sound is often used as music and we might want to adjust the volume of the music
             * separate from the sound (or vice versa).
             *
             * The volume state of all such sounds is set to the state passed in.
             *
             * @param volume the new volume level for all sounds (0.0 to 1.0)
             */
            Stage.prototype.soundVolume = function (volume) {
                for (var i = 0; i < this._knownSounds.length; i++) {
                    if (this._knownSounds[i].loop == false)
                        this._knownSounds[i].volume = volume;
                }
            };
            /**
             * Iterate all of the music known to the stage and toggle their mute stage.
             *
             * This scans all of the registered sound objects and changes the mute state of any sound objects
             * that are set to loop, since such a sound is often used as music and we might want to mute the
             * music separate from the sound (or vice versa)
             *
             * The mute state of all such sounds is set to the state passed in.
             *
             * @param mute true to mute all music or false to un-mute all music
             */
            Stage.prototype.muteMusic = function (mute) {
                for (var i = 0; i < this._knownSounds.length; i++) {
                    if (this._knownSounds[i].loop == true)
                        this._knownSounds[i].muted = mute;
                }
            };
            /**
             * Iterate all of the music known to the stage and change their volume.
             *
             * This scans all of the registered sound objects and changes the volume of any sound objects
             * that are set to loop, since such a sound is often used as music and we might want to adjust the
             * volume of music separate from sound (or vice versa)
             *
             * The volume of all such sounds is set to the state passed in.
             *
             * @param volume the new volume level for all sounds (0.0 to 1.0)
             */
            Stage.prototype.musicVolume = function (volume) {
                for (var i = 0; i < this._knownSounds.length; i++) {
                    if (this._knownSounds[i].loop == true)
                        this._knownSounds[i].volume = volume;
                }
            };
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
            Stage.prototype.addScene = function (name, newScene) {
                if (newScene === void 0) { newScene = null; }
                this._sceneManager.addScene(name, newScene);
            };
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
            Stage.prototype.switchToScene = function (sceneName) {
                if (sceneName === void 0) { sceneName = null; }
                // Indicate that we want to switch to the scene provided.
                //
                // This tells the scene manager that the next time we call checkSceneSwitch() we want this to
                // be the active scene. That happens in the game loop, to make sure that it doesn't happen
                // mid-loop.
                this._sceneManager.switchToScene(sceneName);
            };
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
            Stage.prototype.screenshot = function (filename, windowTitle) {
                if (filename === void 0) { filename = Stage.screenshotFilenameBase; }
                if (windowTitle === void 0) { windowTitle = Stage.screenshotWindowTitle; }
                // Create a window to hold the screen shot.
                var wind = window.open("about:blank", "screenshot");
                // Create a special data URI which the browser will interpret as an image to display.
                var imageURL = this._canvas.toDataURL();
                // Append the screenshot number to the window title and also to the filename for the generated
                // image, then advance the screenshot counter for the next image.
                filename += ((_ss_format + _ss_number).slice(-_ss_format.length)) + ".png";
                windowTitle += " " + _ss_number;
                _ss_number++;
                // Now we need to write some HTML into the new document. The image tag using our data URL will
                // cause the browser to display the image. Wrapping it in the anchor tag with the same URL and a
                // download attribute is a hint to the browser that when the image is clicked, it should download
                // it using the name provided.
                //
                // This might not work in all browsers, in which case clicking the link just displays the image.
                // You can always save via a right click.
                wind.document.write("<head><title>" + windowTitle + "</title></head>");
                wind.document.write('<a href="' + imageURL + '" download="' + filename + '">');
                wind.document.write('<img src="' + imageURL + '" title="' + windowTitle + '"/>');
                wind.document.write('</a>');
            };
            /**
             * Given an event that represents a mouse event for the stage, calculate the position that the mouse
             * is actually at relative to the top left of the stage. This is needed because the position of mouse
             * events is normally relative to the document itself, which may be larger than the actual window.
             *
             * @param mouseEvent the mouse movement or click event
             * @returns {Point} the point of the mouse click/pointer position on the stage
             */
            Stage.prototype.calculateMousePos = function (mouseEvent) {
                // Some math has to be done because the mouse position is relative to document, which may have
                // dimensions larger than the current viewable area of the browser window.
                //
                // As a result, we need to ensure that we take into account the position of the canvas in the
                // document AND the scroll position of the document.
                var rect = this._canvas.getBoundingClientRect();
                var root = document.documentElement;
                var mouseX = mouseEvent.clientX - rect.left - root.scrollLeft;
                var mouseY = mouseEvent.clientY - rect.top - root.scrollTop;
                return new game.Point(mouseX, mouseY);
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Stage.prototype.toString = function () {
                return String.format("[Stage dimensions={0}x{1}, tileSize={2}]", game.STAGE_WIDTH, game.STAGE_HEIGHT, game.TILE_SIZE);
            };
            /**
             * This string is used as the default screenshot filename base in the screenshot method if none is
             * specified.
             *
             * @see screenshot
             * @type {string}
             */
            Stage.screenshotFilenameBase = "screenshot";
            /**
             * This string is used as the default window title for the screenshot window/tab if none is specified.
             *
             * @see screenshot
             * @type {string}
             */
            Stage.screenshotWindowTitle = "Screenshot";
            return Stage;
        })();
        game.Stage = Stage;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class wraps a list of known Scene instances and allows for switching between them and
         * querying/modifying the list of known scenes.
         *
         * This is used by the Stage class to manage the scenes in the game and switch between them.
         */
        var SceneManager = (function () {
            /**
             * Create a new instance of the Scene manager that will manage scenes for the passed in stage.
             *
             * @param stage the stage whose scenes we are managing.
             */
            function SceneManager(stage) {
                /**
                 * The currently active scene. This defaults to an empty instance initially so that all operations
                 * still work as expected while the engine is being set up, and to guard the developer from
                 * himself by forgetting to add one.
                 *
                 * @type {Scene}
                 */
                this._currentScene = null;
                /**
                 * The scene that should become active next (if any). When a scene change request happens, the
                 * scene to be switched to is stored in this value to ensure that the switch happens at the end of
                 * the current update cycle, which happens asynchronously.
                 *
                 * The value here is null when there is no scene change scheduled.
                 *
                 * @type {Scene|null}
                 */
                this._nextScene = null;
                /**
                 * A list of all of the registered scenes in the stage. The keys are a symbolic string name and
                 * the values are the actual Scene instance objects that the names represent.
                 *
                 * @type {Object<String,Scene>}
                 */
                this._sceneList = null;
                // Set up a default current scene, so that things work while setup is happening.
                this._currentScene = new game.Scene("defaultScene", stage);
                // The scene list starts out initially empty.
                this._sceneList = {};
            }
            Object.defineProperty(SceneManager.prototype, "currentScene", {
                /**
                 * The currently active scene in the game.
                 *
                 * @returns {Scene} the current scene
                 */
                get: function () { return this._currentScene; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SceneManager.prototype, "nextScene", {
                /**
                 * The scene that will imminently become active the next time a scene change check is scheduled.
                 *
                 * This value is null when there is no pending scene change yet.
                 *
                 * @returns {Scene}
                 */
                get: function () { return this._nextScene; },
                enumerable: true,
                configurable: true
            });
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
            SceneManager.prototype.addScene = function (name, newScene) {
                if (newScene === void 0) { newScene = null; }
                // If this name is in use and we were given a scene object, we should complain.
                if (this._sceneList[name] != null && newScene != null)
                    console.log("Warning: overwriting scene registration for scene named " + name);
                // Save the scene
                this._sceneList[name] = newScene;
            };
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
            SceneManager.prototype.switchToScene = function (sceneName) {
                if (sceneName === void 0) { sceneName = null; }
                // Get the actual new scene, which might be null if the scene named passed in is null.
                var newScene = sceneName != null ? this._sceneList[sceneName] : null;
                // If we were given a scene name and there was no such scene, complain before we leave.
                if (sceneName != null && newScene == null) {
                    console.log("Attempt to switch to unknown scene named " + sceneName);
                    return;
                }
                this._nextScene = newScene;
            };
            /**
             * Check to see if there is a pending scene switch that should happen, as requested by an
             * invocation to switchToScene().
             *
             * If there is, the current scene is switched, with the scenes being notified as appropriate. If
             * there isn't, then nothing else happens.
             *
             * @see SceneManager.switchToScene
             */
            SceneManager.prototype.checkSceneSwitch = function () {
                // If there is a scene change scheduled, change it now.
                if (this._nextScene != null && this._nextScene !== this._currentScene) {
                    // Tell the current scene that it is deactivating and what scene is coming next.
                    this._currentScene.deactivating(this._nextScene);
                    // Save the current scene, then swap to the new one
                    var previousScene = this._currentScene;
                    this._currentScene = this._nextScene;
                    // Now tell the current scene that it is activating, telling it what scene used to be in
                    // effect.
                    this._currentScene.activating(previousScene);
                    // Clear the flag now.
                    this._nextScene = null;
                }
            };
            return SceneManager;
        })();
        game.SceneManager = SceneManager;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents a Tile in a game, for games that require that. This encapsulates information as
         * to what the textual (for debugging) and numeric (for map data) ID's of a tile are, as well as the
         * ability to render to a stage and provide other information such as blocking.
         */
        var Tile = (function () {
            /**
             * Construct a new tile instance with the given name and ID values. This instance will render
             * itself using the debug color provided (as a filled rectangle).
             *
             * @param name the textual name of this tile type, for debugging purposes
             * @param internalID the numeric id of this tile type, for use in map data
             * @param debugColor the color to render as in debug mode
             */
            function Tile(name, internalID, debugColor) {
                if (debugColor === void 0) { debugColor = 'yellow'; }
                // Save the passed in values.
                this._name = name;
                this._tileID = internalID;
                this._debugColor = debugColor;
            }
            Object.defineProperty(Tile.prototype, "name", {
                /**
                 * Get the textual name of this tile.
                 *
                 * @returns {string}
                 */
                get: function () { return this._name; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Tile.prototype, "value", {
                /**
                 * Get the numeric id of this tile.
                 *
                 * @returns {number}
                 */
                get: function () { return this._tileID; },
                enumerable: true,
                configurable: true
            });
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
            Tile.prototype.blocksActorMovement = function (actor) {
                return true;
            };
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
            Tile.prototype.render = function (x, y, renderer) {
                renderer.fillRect(x, y, game.TILE_SIZE, game.TILE_SIZE, this._debugColor);
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Tile.prototype.toString = function () {
                return String.format("[Tile name={0} id={1}]", this._name, this._tileID);
            };
            return Tile;
        })();
        game.Tile = Tile;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents a Tileset in a game, which is basically just an array of Tile instances that
         * will be used to render a level. The class provides the ability to look up tiles based on either
         * their name or their numeric ID values, as well as validating whether or not tiles are valid.
         */
        var Tileset = (function () {
            /**
             * Construct a new tile instance with the given name and ID values. This instance will render
             * itself using the debug color provided (as a filled rectangle).
             *
             * @param name the textual name of this tile type, for debugging purposes
             * @param tiles the list of tiles that this tileset should contain
             */
            function Tileset(name, tiles) {
                // Save the name and the list of the tile length.
                this._name = name;
                this._length = tiles.length;
                // Set up our two cross reference object.
                this._tilesByName = {};
                this._tilesByValue = [];
                // Iterate and store all values. We don't just copy the tile array given as our tilesByValue
                // because we want to ensure that their indexes are their actual values.
                for (var i = 0; i < tiles.length; i++) {
                    var thisTile = tiles[i];
                    // If this tile has a name or numeric ID of an existing tile, generate a warning to the
                    // console so that the developer knows that he's boned something up.
                    if (this._tilesByName[thisTile.name] != null)
                        console.log("Duplicate tile with textual name '" + thisTile.name + "' found");
                    if (this._tilesByValue[thisTile.value] != null)
                        console.log("Duplicate tile with numeric id '" + thisTile.value + "' found");
                    this._tilesByName[thisTile.name] = thisTile;
                    this._tilesByValue[thisTile.value] = thisTile;
                }
            }
            /**
             * Given a tileID, return true if this tileset contains that tile or false if it does not.
             *
             * @param tileID the tileID to check.
             * @returns {boolean} true if the tileID given corresponds to a valid tile, false otherwise
             */
            Tileset.prototype.isValidTileID = function (tileID) {
                return this._tilesByValue[tileID] != null;
            };
            /**
             * Given a tile name, return back the tile object that represents this tile. The value will be null if
             * the tile name provided is not recognized.
             *
             * @param name the name of the tileID to search for
             * @returns {Tile} the tile with the provided name, or null if the name is invalid.
             */
            Tileset.prototype.tileForName = function (name) {
                return this._tilesByName[name];
            };
            /**
             * Given a tile id, return back the tile object that represents this tile. The value will be null
             * if the tile id provided is not recognized.
             *
             * @param id the numeric id value of the tile to search for
             * @returns {Tile} the tile with the provided value, or null if the name is invalid.
             */
            Tileset.prototype.tileForID = function (id) {
                return this._tilesByValue[id];
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Tileset.prototype.toString = function () {
                return String.format("[Tileset name={0} tileCount={1}]", this._name, this._length);
            };
            return Tileset;
        })();
        game.Tileset = Tileset;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents the raw map and entity data that represents a tile based level in a game.
         * Instances of this class hold the raw (and reusable) data used to represent a level.
         *
         * The map data is just a series of integer tile ID values that associate with the tile set that has
         * been provided, as well as a list of entities that are attached to the map.
         *
         * Various checks are done to ensure that the level data provided is actually valid.
         */
        var LevelData = (function () {
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
            function LevelData(name, width, height, levelData, entityList, tileset) {
                // Save the provided values.
                this._name = name;
                this._width = width;
                this._height = height;
                this._levelData = levelData;
                this._entities = entityList;
                this._tileset = tileset;
                // Set up the entity list that associates with entity ID values.
                this._entitiesByID = {};
                // Iterate over all entities. For each one, insert it into the entitiesByID table and so some
                // validation.
                for (var i = 0; i < this._entities.length; i++) {
                    // Get the entity and it's ID property. If there is no ID property, generate an error.
                    var entity = this._entities[i];
                    var entityID = entity.properties.id;
                    if (entityID == null)
                        throw new Error("LevelData passed an entity with no 'id' property");
                    // The entity needs to have a stage associated with it.
                    if (entity.stage == null)
                        throw new Error("LevelData passed an entity that has no stage, id=" + entityID);
                    // Now store this entity in the lookup table; generate a warning if such an ID already
                    // exists, as it will clobber.
                    if (this._entitiesByID[entityID])
                        console.log("LevelData has an entity with a duplicate 'id' property: " + entityID);
                    this._entitiesByID[entityID] = entity;
                }
                // Validate the data now
                this.validateData();
            }
            Object.defineProperty(LevelData.prototype, "width", {
                /**
                 * The width of this level data, in tiles.
                 *
                 * @returns {number} the width of the map data in tiles.
                 */
                get: function () { return this._width; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LevelData.prototype, "height", {
                /**
                 * The height of this level data, in tiles.
                 *
                 * @returns {number} the height of the map data in tiles
                 */
                get: function () { return this._height; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LevelData.prototype, "mapData", {
                /**
                 * The underlying map data that describes the map in this instance. This is an array of numbers
                 * that are interpreted as numeric tile ID values and is width * height numbers long.
                 *
                 * @returns {Array<number>} the underlying map data
                 */
                get: function () { return this._levelData; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LevelData.prototype, "tileset", {
                /**
                 * The tileset that is used to render the map in this level data; the data in the mapData array is
                 * verified to only contain tiles that appear in this tileset.
                 *
                 * @returns {Tileset} the tileset to use to render this map
                 */
                get: function () { return this._tileset; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LevelData.prototype, "entities", {
                /**
                 * The list of all entities that are associated with this particular level data instance. This is
                 * just an array of entity objects.
                 *
                 * @returns {Array<Entity>} the list of entities
                 * @see LevelData.entitiesByID
                 */
                get: function () { return this._entities; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LevelData.prototype, "entitiesByID", {
                /**
                 * A duplicate list of entities, where the entities are indexed by their ID values for faster
                 * lookup at runtime.
                 *
                 * @returns {Object<String,Entity>} an object which contains the entities, keyed by their id values.
                 * @see LevelData.entities
                 */
                get: function () { return this._entitiesByID; },
                enumerable: true,
                configurable: true
            });
            /**
             * A simple helper that handles a validation failure by throwing an error.
             *
             * @param message the error to throw
             */
            LevelData.prototype.error = function (message) {
                throw new Error(message);
            };
            /**
             * Validate the data that is contained in this level to ensure that it is as consistent as we can
             * determine.
             *
             * On error, an error is thrown. Otherwise this returns without incident.
             *
             * @throws {Error} if the level data is inconsistent in some way
             */
            LevelData.prototype.validateData = function () {
                // Ensure that the length of the level data agrees with the dimensions that we were given, to make
                // sure we didn't get sorted.
                if (this._levelData.length != this._width * this._height)
                    this.error("Level data '" + this._name + "' has an incorrect length given its dimensions");
                // For now, there is no scrolling of levels, so it is important that the dimensions be the same
                // as the constant for the viewport.
                if (this._width != game.STAGE_TILE_WIDTH || this._height != game.STAGE_TILE_HEIGHT)
                    this.error("Scrolling is not implemented; level '" + this._name + "' must be the same size as the viewport");
                // Validate that all tiles are valid.
                for (var y = 0; y < this._height; y++) {
                    for (var x = 0; x < this._width; x++) {
                        // Pull a tileID out of the level data, and validate that the tileset knows what it is.
                        var tileID = this._levelData[y * this._width + x];
                        if (this._tileset.isValidTileID(tileID) == false)
                            this.error("Invalid tileID '${tileID}' found at [${x}, ${y}] in level ${this.name}");
                    }
                }
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            LevelData.prototype.toString = function () {
                return String.format("[LevelData name={0}, size={1}x{2]]", this._name, this._width, this._height);
            };
            return LevelData;
        })();
        game.LevelData = LevelData;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents the idea of a level in a game based on a tile map. It takes an instance of a
         * LevelData class that gives it information about the layout of the level and its other contents, and
         * provides an API for rendering that map to the stage and for querying the map data in various ways.
         */
        var Level = (function () {
            /**
             * Construct a new level object that will display on the provided stage and which represents the
             * provided data.
             *
             * @param stage the stage that owns the level and will display it
             * @param levelData the data to display/wrap/query
             */
            function Level(stage, levelData) {
                // Save the provided values and alias into the LevelData itself.
                this._stage = stage;
                this._width = levelData.width;
                this._height = levelData.height;
                this._mapData = levelData.mapData;
                this._entities = levelData.entities;
                this._entitiesByID = levelData.entitiesByID;
                this._tileset = levelData.tileset;
            }
            /**
             * Given an entity type, return back a list of all entities of that type that the level data contains.
             * There could be 0 or more such entries.
             *
             * @param type the entity type to search for (pass the class object)
             * @returns {Array<Entity>} an array of entities of this type, which might be empty
             */
            Level.prototype.entitiesWithType = function (type) {
                // The return value.
                var retVal = [];
                for (var i = 0; i < this._entities.length; i++) {
                    var entity = this._entities[i];
                    if (entity instanceof type)
                        retVal.push(entity);
                }
                return retVal;
            };
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
            Level.prototype.entitiesAtMapXY = function (x, y) {
                // Return null if the coordinate is out of bounds.
                if (x < 0 || y < 0 || x >= this._width || y >= this._width)
                    return null;
                // Iterate over all entities to see if they are at the map location provided.
                var retVal = [];
                for (var i = 0; i < this._entities.length; i++) {
                    // Get the entity.
                    var entity = this._entities[i];
                    // If the location matches, add it to the array.
                    if (entity.mapPosition.equalsXY(x, y))
                        retVal.push(entity);
                }
                return retVal;
            };
            /**
             * Given coordinates in the map (e.g. tile based) domain, return back a list of all entities in the
             * level that exist at this location, which might be 0. This also detects when the coordinates are
             * outside of the world.
             *
             * @param  location the location in the map to check, in map coordinates
             * @returns {Array<Entity>} the entities at the provided location or null if the location is
             * invalid
             */
            Level.prototype.entitiesAtMapPosition = function (location) {
                return this.entitiesAtMapXY(location.x, location.y);
            };
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
            Level.prototype.entitiesAtMapXYFacing = function (x, y, facing) {
                // Based on the facing angle, adjust the map position as needed.
                switch (facing) {
                    case 0:
                        x++;
                        break;
                    case 90:
                        y++;
                        break;
                    case 180:
                        x--;
                        break;
                    case 270:
                        y--;
                        break;
                }
                // Now we can do a normal lookup.
                return this.entitiesAtMapXY(x, y);
            };
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
            Level.prototype.entitiesAtMapPositionFacing = function (location, facing) {
                return this.entitiesAtMapXYFacing(location.x, location.y, facing);
            };
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
            Level.prototype.entitiesWithIDs = function (idSpec) {
                var retVal = [];
                for (var i = 0; i < idSpec.length; i++) {
                    var entity = this._entitiesByID[idSpec[i]];
                    if (entity)
                        retVal.push(entity);
                }
                // This is just for debugging. We should get exactly as many things as were asked for. Less means
                // IDs were given that do not exist, more means that some objects have duplicate ID values, which
                // is also bad.
                if (retVal.length != idSpec.length)
                    console.log("Warning: entitiesWithIDs entity count mismatch. Broken level?");
                return retVal;
            };
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
            Level.prototype.triggerEntitiesWithIDs = function (idSpec, activator) {
                // If there is not an idSpec, do nothing.
                if (idSpec == null)
                    return;
                // Get the list of entities that match the idSpec provided and trigger them all.
                var entities = this.entitiesWithIDs(idSpec);
                for (var i = 0; i < entities.length; i++)
                    entities[i].trigger(activator);
            };
            /**
             * Given coordinates in the map (e.g. tile based) domain, return back the tile at that location. If
             * the coordinates are outside of the world, this is detected and null is returned back.
             *
             * @param {Number} x the X-coordinate to check, in map coordinates
             * @param {Number} y the Y-coordinate to check, in map coordinates
             * @returns {Tile} the tile at the provided location or null if the location is invalid
             */
            Level.prototype.tileAtXY = function (x, y) {
                // Bounds check the location.
                if (x < 0 || y < 0 || x >= this._width || y >= this._width)
                    return null;
                // This is safe because the level data validates that all of the tiles in its data are also
                // represented in its tileset.
                return this._tileset.tileForID(this._mapData[y * this._width + x]);
            };
            /**
             * Given coordinates in the map (e.g. tile based) domain, return back the tile at that location. If
             * the coordinates are outside of the world, this is detected and null is returned back.
             *
             * @param location the location to check, in map coordinates
             * @returns {Tile} the tile at the provided location or null if the location is invalid
             */
            Level.prototype.tileAt = function (location) {
                return this.tileAtXY(location.x, location.y);
            };
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
            Level.prototype.isBlockedAtXY = function (x, y, actor) {
                // Get the tile; it's blocked if it is out of bounds of the level.
                var tile = this.tileAtXY(x, y);
                if (tile == null)
                    return true;
                // If the tile at this location blocks actor movement, then the move is blocked.
                if (tile.blocksActorMovement(actor))
                    return true;
                // Get the list of entities that are at this location on the map. If there are any and any of them
                // blocks actor movement, the move is blocked.
                var entities = this.entitiesAtMapXY(x, y);
                if (entities != null) {
                    for (var i = 0; i < entities.length; i++) {
                        if (entities[i].blocksActorMovement(actor))
                            return true;
                    }
                }
                // Not blocked.
                return false;
            };
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
            Level.prototype.isBlockedAt = function (location, actor) {
                return this.isBlockedAtXY(location.x, location.y, actor);
            };
            /**
             * Render this level using the renderer provided. This is done by delegating the rendering of each
             * individual tile to the tile instance.
             *
             * Note that this only renders the level geometry and not the entities; it's up to the caller to
             * render those as needed and at the appropriate time.
             *
             * @param renderer the renderer to render with
             */
            Level.prototype.render = function (renderer) {
                // Iterate over the tiles.
                for (var y = 0; y < this._height; y++) {
                    for (var x = 0; x < this._width; x++) {
                        var tile = this.tileAtXY(x, y);
                        // Get the tile and render it.
                        if (tile != null)
                            tile.render(x * game.TILE_SIZE, y * game.TILE_SIZE, renderer);
                    }
                }
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Level.prototype.toString = function () {
                return String.format("[LevelData size={0}x{1}]", this._width, this._height);
            };
            return Level;
        })();
        game.Level = Level;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class wraps an HTML audio tag to provide an extended API for sound and music playing. This
         * shields the client code from having to work with the tag directly and provides an enhanced API.
         */
        var Sound = (function () {
            /**
             * Construct a new sound object, telling it to wrap the provided audio tag, which it will use for
             * its playback.
             *
             * @param audioTag the audio tag that represents the sound to be played.
             * @param playbackLooped true if this sound should loop when played (e.g. music), false otherwise
             */
            function Sound(audioTag, playbackLooped) {
                if (playbackLooped === void 0) { playbackLooped = false; }
                // Save the tag and set the loop flag.
                this._tag = audioTag;
                this._tag.loop = playbackLooped;
            }
            Object.defineProperty(Sound.prototype, "isPlaying", {
                /**
                 * Determines if this sound is currently playing or not.
                 *
                 * @returns {boolean}
                 */
                get: function () { return this._tag.paused == false; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sound.prototype, "volume", {
                /**
                 * Get the current volume that this sound is playing at. This ranges between 0 and 1.
                 *
                 * @returns {number}
                 */
                get: function () { return this._tag.volume; },
                /**
                 * Set the volume that this sound plays back on, which should be a value between 0 and 1.
                 *
                 * @param newVolume the new volume level for the sound (0.0 to 1.0)
                 */
                set: function (newVolume) {
                    this._tag.volume = newVolume;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sound.prototype, "loop", {
                /**
                 * Determines if this sound loops during playback or not.
                 *
                 * @returns {boolean}
                 */
                get: function () { return this._tag.loop; },
                /**
                 * Change the state of looping for this sound. When true, playback will loop continuously until
                 * told to stop.
                 *
                 * @param newLoop the new loop state (true to loop playback, false to play once and stop)
                 */
                set: function (newLoop) { this._tag.loop = newLoop; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sound.prototype, "muted", {
                /**
                 * Determine if this sound object is currently muted or not.
                 *
                 * @returns {boolean}
                 */
                get: function () { return this._tag.muted; },
                /**
                 * Change the mute state of this object.
                 *
                 * @param newMuted the new muted state (true for mute, false for un-muted)
                 */
                set: function (newMuted) { this._tag.muted = newMuted; },
                enumerable: true,
                configurable: true
            });
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
            Sound.prototype.play = function (restart) {
                if (restart === void 0) { restart = true; }
                // Change the current playback time if we were asked to.
                if (restart)
                    this._tag.currentTime = 0;
                // Play it now
                this._tag.play();
            };
            /**
             * Pause playback of the sound.
             */
            Sound.prototype.pause = function () {
                this._tag.pause();
            };
            /**
             * Toggle the play state of the sound; if it is currently playing, it will be paused, otherwise it
             * will start playing. The restart parameter can be used to cause paused playback to restart at
             * the beginning of the sound and has no effect if the sound is already playing.
             *
             * This method is generally used for longer sounds that you might want to cut off (e.g. music).
             *
             * @see Sound.play
             */
            Sound.prototype.toggle = function (restart) {
                if (restart === void 0) { restart = true; }
                if (this.isPlaying)
                    this.pause();
                else
                    this.play(restart);
            };
            return Sound;
        })();
        game.Sound = Sound;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var main;
    (function (main) {
        var KeyCodes = nurdz.game.KeyCodes;
        /**
         * Set up the button on the page to toggle the state of the game.
         *
         * @param stage the stage to control
         * @param buttonID the ID of the button to mark up to control the game state
         */
        function setupButton(stage, buttonID) {
            // True when the game is running, false when it is not. This state is toggled by the button. We
            // assume that the game is going to start running.
            var gameRunning = true;
            // Get the button.
            var button = document.getElementById(buttonID);
            if (button == null)
                throw new ReferenceError("No button found with ID '" + buttonID + "'");
            // Set up the button to toggle the stage.
            button.addEventListener("click", function () {
                // Try to toggle the game state. This will only throw an error if we try to put the game into
                // a state it is already in, which can only happen if the engine stops itself when we didn't
                // expect it.
                try {
                    if (gameRunning)
                        stage.stop();
                    else
                        stage.run();
                }
                // Log and then rethrow the error.
                catch (error) {
                    console.log("Exception generated while toggling game state");
                    throw error;
                }
                finally {
                    // No matter what, toggle the state.
                    gameRunning = !gameRunning;
                    button.innerHTML = gameRunning ? "Stop Game" : "Restart Game";
                }
            });
        }
        /**
         * This simple class represents a Dot on the screen. It starts in the center of the screen and bounces
         * around.
         */
        var Dot = (function (_super) {
            __extends(Dot, _super);
            /**
             * Construct an instance; it needs to know how it will be rendered.
             *
             * @param stage the stage that owns this actor.
             * @param image the image to render ourselves with
             * @param sound the sound to play when we bounce off the sides of the screen
             * @param properties the properties to apply to this entity
             */
            function Dot(stage, image, sound, properties) {
                if (properties === void 0) { properties = {}; }
                // Invoke the super to construct us. We position ourselves in the center of the stage.
                _super.call(this, "A dot", stage, stage.width / 2, stage.height / 2, 20, 20, 1, properties, {
                    xSpeed: nurdz.game.Utils.randomIntInRange(-5, 5),
                    ySpeed: nurdz.game.Utils.randomIntInRange(-5, 5),
                });
                // Our radius is half our width because our position is registered via the center of our own
                // bounds.
                this._radius = this._width / 2;
                // Save the image and sound we were given.
                this._image = image;
                this._sound = sound;
                // Show what we did in the console.
                console.log("Dot entity created with properties: ", this._properties);
            }
            Object.defineProperty(Dot.prototype, "properties", {
                /**
                 * We need to override the properties property as well to change the type, otherwise outside code
                 * will think our properties are EntityProperties, which is not very useful.
                 *
                 * @returns {DotProperties}
                 */
                get: function () { return this._properties; },
                enumerable: true,
                configurable: true
            });
            /**
             * This gets invoked by the Entity class constructor when it runs to allow us to validate that our
             * properties are OK.
             *
             * Here we make sure to fix up an X or Y speed that is 0 to be non-zero so that we always bounce
             * in a pleasing fashion.
             */
            Dot.prototype.validateProperties = function () {
                // Let the super class do its job.
                _super.prototype.validateProperties.call(this);
                // Make sure our xSpeed is valid.
                if (this._properties.xSpeed == 0) {
                    console.log("Fixing a 0 xSpeed");
                    this._properties.xSpeed = nurdz.game.Utils.randomFloatInRange(-1, 1) > 0 ? 1 : -1;
                }
                // Make sure our ySpeed is valid.
                if (this._properties.ySpeed == 0) {
                    console.log("Fixing a 0 ySpeed");
                    this._properties.ySpeed = nurdz.game.Utils.randomFloatInRange(-1, 1) > 0 ? 1 : -1;
                }
            };
            /**
             * Update our position on the stage.
             *
             * @param stage the stage we are on
             */
            Dot.prototype.update = function (stage) {
                // Translate;
                this._position.translateXY(this._properties.xSpeed, this._properties.ySpeed);
                // Bounce left and right
                if (this._position.x < this._radius || this._position.x >= stage.width - this._radius) {
                    this._properties.xSpeed *= -1;
                    this._sound.play();
                }
                // Bounce up and down.
                if (this._position.y < this._radius || this._position.y >= stage.height - this._radius) {
                    this._properties.ySpeed *= -1;
                    this._sound.play();
                }
            };
            /**
             * Render ourselves to the stage.
             *
             * @param x the x location to render the actor at, in stage coordinates (NOT world)
             * @param y the y location to render the actor at, in stage coordinates (NOT world)
             * @param renderer the renderer to render with
             */
            Dot.prototype.render = function (x, y, renderer) {
                renderer.blitCentered(this._image, x, y);
            };
            return Dot;
        })(nurdz.game.Entity);
        /**
         * This is a simple extension of the scene class; it displays the FPS on the screen.
         *
         * Notice that it also clears the stage; the base Scene class only renders actors but doesn't clear
         * the screen, so that when you override it you can get the actor rendering "for free" without it
         * making assumptions about when it gets invoked.
         */
        var TestScene = (function (_super) {
            __extends(TestScene, _super);
            /**
             * Create a new test scene to be managed by the provided stage.
             *
             * @param stage the stage to manage us/
             */
            function TestScene(stage) {
                _super.call(this, "A Scene", stage);
                // By default, we're playing music and sounds.
                this._playMusic = true;
                this._playSounds = true;
                // Preload some images.
                var ball1 = stage.preloadImage("ball_blue.png");
                var ball2 = stage.preloadImage("ball_yellow.png");
                // Preload a bounce sound
                var bounce = stage.preloadSound("bounce_wall");
                // Preload some music.
                this._music = stage.preloadMusic("WhoLikesToParty");
                // Create two actors and add them to ourselves. These use the images and sounds we said we
                // want to preload.
                this.addActor(new Dot(stage, ball1, bounce));
                this.addActor(new Dot(stage, ball2, bounce));
            }
            /**
             * Render the scene.
             */
            TestScene.prototype.render = function () {
                // Clear the screen, render any actors, and then display the FPS we're running at in the top
                // left corner.
                this._stage.renderer.clear("black");
                _super.prototype.render.call(this);
                this._stage.renderer.drawTxt("FPS: " + this._stage.fps, 16, 16, 'white');
            };
            /**
             * Invoked when we become the active scene
             *
             * @param previousScene the scene that used to be active
             */
            TestScene.prototype.activating = function (previousScene) {
                // Let the super report the scene change in a debug log, then start our music.
                _super.prototype.activating.call(this, previousScene);
                // Set the appropriate mute state for sounds and music.
                this._stage.muteMusic(!this._playMusic);
                this._stage.muteSounds(!this._playSounds);
                // Start music playing now (it might be muted).
                this._music.play();
            };
            /**
             * Invoked when we are no longer the active scene
             *
             * @param nextScene the scene that is going to become active
             */
            TestScene.prototype.deactivating = function (nextScene) {
                // Let the super report the scene change in a debug log, then stop our music.
                _super.prototype.deactivating.call(this, nextScene);
                this._music.pause();
            };
            /**
             * Invoked when a key is pressed.
             *
             * @param eventObj the key press event
             * @returns {boolean} true if we handled the event or false otherwise
             */
            TestScene.prototype.inputKeyDown = function (eventObj) {
                switch (eventObj.keyCode) {
                    // Toggle the mute state of the music
                    case KeyCodes.KEY_M:
                        this._playMusic = !this._playMusic;
                        this._stage.muteMusic(!this._playMusic);
                        return true;
                    // Toggle the mute state of the sound
                    case KeyCodes.KEY_S:
                        this._playSounds = !this._playSounds;
                        this._stage.muteSounds(!this._playSounds);
                        return true;
                    default:
                        // Let the super do what super does. This allows screen shots to still work as expected.
                        return _super.prototype.inputKeyDown.call(this, eventObj);
                }
            };
            return TestScene;
        })(nurdz.game.Scene);
        // Once the DOM is loaded, set things up.
        nurdz.contentLoaded(window, function () {
            try {
                // Set up the stage.
                var stage = new nurdz.game.Stage('gameContent');
                // Set up the default values used for creating a screen shot.
                nurdz.game.Stage.screenshotFilenameBase = "screenshot";
                nurdz.game.Stage.screenshotWindowTitle = "Screenshot";
                // Set up the button that will stop the game if something goes wrong.
                setupButton(stage, "controlBtn");
                // Register all of our scenes.
                stage.addScene("sceneName", new TestScene(stage));
                // Switch to the initial scene, add a dot to display and then run the game.
                stage.switchToScene("sceneName");
                stage.run();
            }
            catch (error) {
                console.log("Error starting the game");
                throw error;
            }
        });
    })(main = nurdz.main || (nurdz.main = {}));
})(nurdz || (nurdz = {}));
