var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
if (!Math.sign) {
    /**
     * Given a number, return a value that indicates the sign of the value. The return value is -1 for
     * negative values, 1 for positive values, or 0/NaN as appropriate based on the input
     *
     * @param x the number to test
     * @returns -1, 0, 1 or NaN to indicate the sign of the number provided
     */
    Math.sign = function (x) {
        x = +x;
        if (x === 0 || isNaN(x))
            return x;
        return x > 0 ? 1 : -1;
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
             * The stage passed to the commence method (if any). If this is set, every time the number of items to
             * preload changes, the stage is updated to reflect it.
             *
             * @type {Stage}
             * @private
             */
            var _stage = null;
            /**
             * The callback to invoke when preloading has started and all images and sounds are loaded.
             */
            var _completionCallback;
            /**
             * If we have a stage, this centers some text on it that tells us how many items we have left to
             * preload. It gets update every time the number of items left to preload changes.
             */
            function updatePreloadProgress() {
                // If there is no stage, just leave.
                if (_stage == null)
                    return;
                // Get the canvas context out, save its state and then set up our rendering.
                var _context = _stage.renderer.context;
                _context.save();
                _context.textAlign = "center";
                _context.textBaseline = "middle";
                _context.font = "32px monospace";
                // Clear the stage and draw the text now.
                var text = "Preloading files, " + (_imagesToLoad + _soundsToLoad) + " left to go";
                _stage.renderer.clear('black');
                _stage.renderer.drawTxt(text, _stage.width / 2, _stage.height / 2, 'white');
                // Done now
                _context.restore();
            }
            /**
             * This gets invoked as the event handler function for all of our preloads of all file types. For
             * images this is one of "load" or "error", while for sounds it is one of "canplaythrough" or "error".
             *
             * Regardless of the event type, this removes itself as the event handler for events of the given
             * type, counts down the preloaded file, and calls the main preload callback once everything is
             * handled (error or not).
             *
             * Additionally, when an error happens, the file that is missing is logged to the console and a data
             * URL is applied to the element so that everything still works. For images this is a red X in a box
             * while for audio elements it is a small segment of silence.
             *
             * @param eventObj the event object being handled (one of "load", "error" or "canplaythrough"
             */
            function preloadCallbackEvent(eventObj) {
                // Get the element that is the target of the event. This requires a type cast since not all events
                // are targeted to DOM elements, but we know that load/error/canplaythrough are.
                var tag = eventObj.target;
                // Determine if this is an image or not so we can act accordingly.
                var isImage = tag.tagName.toLowerCase() == "img";
                // Set up an error event object if this is an error event.
                var errorEvent = (eventObj.type == "error") ? eventObj : null;
                // To start with, remove ourselves as the handlers for load and error events. We use a load event
                // for an image but a canplaythrough event for audio.
                if (isImage)
                    tag.removeEventListener("load", preloadCallbackEvent, false);
                else
                    tag.removeEventListener("canplaythrough", preloadCallbackEvent, false);
                tag.removeEventListener("error", preloadCallbackEvent, false);
                // Special handling if this is an error.
                if (errorEvent != null) {
                    // Note the error in the console.
                    console.log("Preload error:", (isImage ? "image" : "sound"), tag.src);
                    // Depending on the tag type, use a data URL to approximate the missing data.
                    if (isImage)
                        tag.src = MISSING_IMAGE;
                    else {
                        if (_audioExtension == ".mp3")
                            tag.src = MISSING_MP3;
                        else
                            tag.src = MISSING_OGG;
                        // For audio we want to make sure it doesn't loop.
                        tag.loop = false;
                    }
                }
                // Check now for preload callbacks the caller may have specified for this item.
                //
                // Multiple requests to preload the same image load it only once and share the same tag, so for
                // images the callbacks are an array that contains the callback functions, although this array can
                // be empty if nobody cared (the array is created when the tag is).
                //
                // For sound/music, requests do not share tags. As a result, for items of this type the callback
                // property either does not exist or is the function to invoke.
                //
                // Image callbacks take the image element but sound/music callbacks take the Sound() instance that
                // wraps the element. For this reason the audio elements are augmented not only with a callback
                // but a reference to the owning Sound() instance.
                if (isImage) {
                    // If there are any callbacks on this element, invoke them now.
                    if (tag["_ng_callback"].length != 0) {
                        var list = tag["_ng_callback"];
                        for (var i = 0; i < list.length; i++)
                            list[i](tag);
                    }
                }
                else {
                    // If there is a callback, invoke it.
                    if (tag["_ng_callback"] != null)
                        tag["_ng_callback"](tag["_ng_sndObj"]);
                }
                // Now decrement the appropriate count.
                if (isImage)
                    _imagesToLoad--;
                else
                    _soundsToLoad--;
                // If everything is loaded, trigger the completion callback now. Otherwise, update our progress text.
                if (_imagesToLoad == 0 && _soundsToLoad == 0)
                    _completionCallback();
                else
                    updatePreloadProgress();
            }
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
            function addImage(filename, callback) {
                if (callback === void 0) { callback = null; }
                // Make sure that preloading has not started.
                if (_preloadStarted)
                    throw new Error("Cannot add images after preloading has already begun or started");
                // Create a key that is the URL that we will be loading, and then see if there is a tag already in
                // the preload dictionary that uses that URL.
                var key = "images/" + filename;
                var tag = _imagePreloadList[key];
                // If there is not already a tag, then we need to create a new one.
                if (tag == null) {
                    // Create a new tag, indicate the function to invoke when it is fully loaded or fails to load, and
                    // then add it to the preload list.
                    tag = document.createElement("img");
                    tag.addEventListener("load", preloadCallbackEvent, false);
                    tag.addEventListener("error", preloadCallbackEvent, false);
                    _imagePreloadList[key] = tag;
                    // Set in a new property in the tag that lists callbacks that might be registered for this
                    // element.
                    tag["_ng_callback"] = [];
                    // This counts as an image that we are going to preload.
                    _imagesToLoad++;
                }
                // If a callback has been provided, add it to the callback list.
                if (callback != null)
                    tag["_ng_callback"].push(callback);
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
             * The callback function can be provided to let you know when the sound is finally finished loading, in
             * case you need that information.
             *
             * @param subFolder the subFolder that the filename is assumed to be in
             * @param filename the filename of the sound to load; assumed to be relative to a sounds/ folder in
             * the same path as the page is in and to have no extension
             * @param callback if non-null, this will be invoked when the sound is fully loaded.
             * @returns {HTMLAudioElement} the sound object that will (eventually) play the requested audio
             * @throws {Error} if an attempt is made to add a sound to preload after preloading has already started
             */
            var doAddSound = function (subFolder, filename, callback) {
                // Make sure that preloading has not started.
                if (_preloadStarted)
                    throw new Error("Cannot add sounds after preloading has already begun or started");
                // Create a sound preload object.
                var preload = {
                    src: subFolder + filename + _audioExtension,
                    tag: document.createElement("audio")
                };
                // Create a new tag, indicate the function to invoke when it is fully loaded or fails to load, and
                // then add it to the preload list.
                preload.tag.addEventListener("canplaythrough", preloadCallbackEvent);
                preload.tag.addEventListener("error", preloadCallbackEvent);
                // Audio tags don't reuse a previous tag when a preload happens (so that playback can be controlled
                // individually).
                //
                // For callbacks on loaded audio we just set the callback directly to the function if one is present.
                // The absence of this property on the object means no callback.
                if (callback != null)
                    preload.tag["_ng_callback"] = callback;
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
            function addSound(filename, callback) {
                if (callback === void 0) { callback = null; }
                // Get the audio tag and wrap it in a sound object.
                var audioTag = doAddSound("sounds/", filename, callback);
                var snd = new game.Sound(audioTag);
                // If there was a callback provided, we need to tell the audio tag what the sound object is so
                // that it can be provided to the callback.
                if (callback != null)
                    audioTag["_ng_sndObj"] = snd;
                // If there is a callback,
                return snd;
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
            function addMusic(filename, callback) {
                if (callback === void 0) { callback = null; }
                // Get the audio tag and wrap it in a sound object.
                var audioTag = doAddSound("music/", filename, callback);
                var snd = new game.Sound(audioTag, true);
                // If there was a callback provided, we need to tell the audio tag what the sound object is so
                // that it can be provided to the callback.
                if (callback != null)
                    audioTag["_ng_sndObj"] = snd;
                // If there is a callback,
                return snd;
            }
            Preloader.addMusic = addMusic;
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
            function commence(callback, stage) {
                if (stage === void 0) { stage = null; }
                // Make sure that image preloading is not already started
                if (_preloadStarted)
                    throw new Error("Cannot start preloading; preloading is already started");
                // Save the callback and stage and then indicate that the preload has started.
                _stage = stage;
                _completionCallback = callback;
                _preloadStarted = true;
                // If there is nothing to preload, fire the callback now and leave.
                if (_imagesToLoad == 0 && _soundsToLoad == 0) {
                    _completionCallback();
                    return;
                }
                // Update the stage to say how many things are left.
                updatePreloadProgress();
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
            //noinspection SpellCheckingInspection
            /**
             * In case there is an image missing, this data URL is used to represent the image so that things can
             * proceed, albeit in a broken manner. This aids in prototyping.
             *
             * This was drawn by me (which explains its quality) and is a 64x64 pixel image of a red X in a square
             * with a white background.
             *
             * @type {string}
             */
            var MISSING_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IArs" +
                "4c6QAAABVQTFRF////zDMz/8zMzGZmzJmZ/5mZ/2ZmAD7C7QAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAH" +
                "dElNRQffDB8VMBekTnw9AAAAHWlUWHRDb21tZW50AAAAAABDcmVhdGVkIHdpdGggR0lNUGQuZQcAAAE4SURBVEjH5ZVNEoIwDI" +
                "WxoGsRdS03gBvoDeQGev9LOEn/XtIGFu60C2bafg0v6Qs0/cZotoFmdfwa4JNOY6HpDYG44kdHs5OIsKOlVwRGmt0FsI9naDia" +
                "XJRIWhsw3KQAFJFhAPKpps16AAARc04ZC5Xiol4EkogHqgEgiuAcz5W7iJFTkYrLCiKwIBJgEZiuBnjrSTle635gEQM9joZhUj" +
                "PcDGAJ+yfLcrsigAL2fv9sm9YDkw0sokgVYJQ5lsCsctAAO2ntFXORpQS6fiOLsSykAFy8icEAOMB7pdR8WLaoAA685ezbDN3S" +
                "C0MB0KKna4aJ3XIwLNdFIzjpiARw5KfqXABcLpBorAToj8NRA+8cV4oIQIvlESICMGPyle7uRFQhwgOPlGMhggGnTIAi/u6fZQ" +
                "Pf/v0/eDU21RARJ0gAAAAASUVORK5CYII=";
            //noinspection SpellCheckingInspection
            /**
             * In case there is a sound missing in MP3 format, this data URL is used to represent it. It
             * represents 0.03 seconds of silence in MP3 format as generated by:
             *
             * ffmpeg -ar 22000 -t 0.01 -f s16le -acodec pcm_s16le -ac 2 -i /dev/zero -acodec libmp3lame missing.mp3
             *
             * @type {string}
             */
            var MISSING_MP3 = "data:audio/mp3;base64,SUQzBAAAAAAAGVRTU0UAAAAPAAADTGF2ZjU0LjI1LjEwNQD/83AAAAAAAAAA" +
                "AAAAAAAAAAAAAABJbmZvAAAABwAAAAMAAAMoAHt7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e729vb29vb29vb29vb" +
                "29vb29vb29vb29vb29vb29vb29vf///////////////////////////////////////////0xhdmY1NC4yNS4xMDUAAAAAAAAA" +
                "ACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/zgGQAAAABpAAAAAAAAANIAAAAAExBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVV" +
                "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV" +
                "VVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV" +
                "VVVVVVVVVVVVVVVVX/84JkQwAAAaQAAAAAAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV" +
                "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV" +
                "VVVVVVVVVVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV" +
                "Vf/zgmRDAAABpAAAAAAAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV" +
                "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV" +
                "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
            //noinspection SpellCheckingInspection
            /**
             * In case there is a sound missing in Ogg format, this data URL is used to represent it. It
             * represents 0.03 seconds of silence in Ogg format.
             *
             * This was generated similarly to the MP3 version above by generating a wav file instead (-acodec
             * copy) and using oggenc at the lowest possible quality, downsampling to mono.
             *
             * @type {string}
             */
            var MISSING_OGG = "data:audio/ogg;base64,T2dnUwACAAAAAAAAAABUhPp7AAAAAAFv/AUBHgF2b3JiaXMAAAAAAfBVAAAA" +
                "AAAAgD4AAAAAAACqAU9nZ1MAAAAAAAAAAAAAVIT6ewEAAADNTe8JDj3///////////////+aA3ZvcmJpcy0AAABYaXBoLk9yZy" +
                "BsaWJWb3JiaXMgSSAyMDEwMTEwMSAoU2NoYXVmZW51Z2dldCkAAAAAAQV2b3JiaXMiQkNWAQAIAACAIAoZxoDQkFUAABAAAEKI" +
                "RsZQp5QEl4KFEEfEUIeQ81Bq6SB4SmHJmPQUaxBCCN97z7333nsgNGQVAAAEAEAYBQ5i4DEJQgihGMUJUZwpCEIIYTkJlnIeOg" +
                "lC9yCEEC7n3nLuvfceCA1ZBQAAAgAwCCGEEEIIIYQQQgoppRRSiimmmGLKMcccc8wxyCCDDDropJNOMqmkk44yyaij1FpKLcUU" +
                "U2y5xVhrrTXn3GtQyhhjjDHGGGOMMcYYY4wxxghCQ1YBACAAAIRBBhlkEEIIIYUUUoopphxzzDHHgNCQVQAAIACAAAAAAEeRFM" +
                "mRHMmRJEmyJEvSJM/yLM/yLE8TNVFTRVV1Vdu1fduXfdt3ddm3fdl2dVmXZVl3bVuXdVfXdV3XdV3XdV3XdV3XdV3XdSA0ZBUA" +
                "IAEAoCM5jiM5jiM5kiMpkgKEhqwCAGQAAAQA4CiO4jiSIzmWY0mWpEma5Vme5WmeJmqiB4SGrAIAAAEABAAAAAAAoCiK4iiOI0" +
                "mWpWma56meKIqmqqqiaaqqqpqmaZqmaZqmaZqmaZqmaZqmaZqmaZqmaZqmaZqmaZqmaZpAaMgqAEACAEDHcRzHURzHcRzJkSQJ" +
                "CA1ZBQDIAAAIAMBQFEeRHMuxJM3SLM/yNNEzPVeUTd3UVRsIDVkFAAACAAgAAAAAAMDxHM/xHE/yJM/yHM/xJE/SNE3TNE3TNE" +
                "3TNE3TNE3TNE3TNE3TNE3TNE3TNE3TNE3TNE3TNE3TNE3TgNCQVQAAAgAAIIhChjEgNGQVAAAEAIAQopEx1CklwaVgIcQRMdQh" +
                "5DyUWjoInlJYMiY9xRqEEML33nPvvfceCA1ZBQAAAQAQRoGDGHhMghBCKEZxQhRnCoIQQlhOgqWch06C0D0IIYTLubece++9B0" +
                "JDVgEAgAAADEIIIYQQQgghhJBCSimFlGKKKaaYcswxxxxzDDLIIIMOOumkk0wq6aSjTDLqKLWWUksxxRRbbjHWWmvNOfcalDLG" +
                "GGOMMcYYY4wxxhhjjDGC0JBVAAAIAABhkEEGGYQQQkghhZRiiinHHHPMMSA0ZBUAAAgAIAAAAMBRJEVyJEdyJEmSLMmSNMmzPM" +
                "uzPMvTRE3UVFFVXdV2bd/2Zd/2XV32bV+2XV3WZVnWXdvWZd3VdV3XdV3XdV3XdV3XdV3XdR0IDVkFAEgAAOhIjuNIjuNIjuRI" +
                "iqQAoSGrAAAZAAABADiKoziO5EiO5ViSJWmSZnmWZ3map4ma6AGhIasAAEAAAAEAAAAAACiKojiK40iSZWma5nmqJ4qiqaqqaJ" +
                "qqqqqmaZqmaZqmaZqmaZqmaZqmaZqmaZqmaZqmaZqmaZqmaZomEBqyCgCQAADQcRzHcRTHcRxHciRJAkJDVgEAMgAAAgAwFMVR" +
                "JMdyLEmzNMuzPE30TM8VZVM3ddUGQkNWAQCAAAACAAAAAABwPMdzPMeTPMmzPMdzPMmTNE3TNE3TNE3TNE3TNE3TNE3TNE3TNE" +
                "3TNE3TNE3TNE3TNE3TNE3TNE3TNCA0ZCUAAAQAgCDHtIMkCYSgguQZxBzEpBmFoILkOgYlxeQhp6Bi5DnJmEHkgtJFpiIIDVkR" +
                "AEQBAADGIMYQc8g5J6WTFDnnpHRSGgihpY5SZ6m0WmLMKJXaUq0NhI5SSC2jVGItrXbUSq0ltgIAAAIcAAACLIRCQ1YEAFEAAI" +
                "QxSCmkFGKMOcgcRIwx6BhkhjEGIXNOQccchVQqBx11UFLDGHOOQaigg1Q6R5WDUFJHnQAAgAAHAIAAC6HQkBUBQJwAgEGSNM3S" +
                "NM+zNM/zPFFUVU8UVdUSPdP0TFNVPdNUVVM1ZVdUTVm2PNE0PdNUVc80VVU0Vdk1TdV1PVW1ZdNVdVl0Vd12bdm3XVkWbk9VZV" +
                "tUXVs3VVfWVVm2fVe2bV8SRVUVVdV1PVV1XdV1ddt0XV33VFV2TdeVZdN1bdl1ZVtXZVn4NVWVZdN1bdl0Xdl2ZVe3VVnWbdF1" +
                "fV2VZeE3Zdn3ZVvXfVm3lWF0XdtXZVn3TVkWftmWhd3VdV+YRFFVPVWVXVFVXdd0XVtXXde2NdWUXdN1bdlUXVlWZVn3XVfWdU" +
                "1VZdmUZds2XVeWVVn2dVeWdVt0XV03ZVn4VVfWdVe3jWO2bV8YXVf3TVnWfVWWdV/WdWGYddvXNVXVfVN2feF0ZV3Yfd8YZl0X" +
                "js91fV+VbeFYZdn4deEXllvXhd9zXV9XbdkYVtk2ht33jWH2feNYddsYZls3urpOGH5hOG7fOKq2LXR1W1he3Tbqxk+4jd+oqa" +
                "qvm65r/KYs+7qs28Jw+75yfK7r+6osG78q28Jv67py7L5P+VzXF1ZZFobVloVh1nVh2YVhqdq6Mry6bxyvrSvD7QuN31eGqm0b" +
                "y6vbwjD7tvDbwm8cu7EzBgAADDgAAASYUAYKDVkRAMQJAFgkyfMsyxJFy7JEUTRFVRVFUVUtTTNNTfNMU9M80zRNU3VF01RdS9" +
                "NMU/M009Q8zTRN1XRV0zRlUzRN1zVV03ZFVZVl1ZVlWXVdXRZN05VF1XRl01RdWXVdV1ZdV5YlTTNNzfNMU/M80zRV05VNU3Vd" +
                "y/NUU/NE0/VEUVVVU1VdU1VlV/M8U/VETzU9UVRV0zVl1VRVWTZV05ZNU5Vl01Vt2VVlV5Zd2bZNVZVlUzVd2XRd13Zd13Zd2R" +
                "V2SdNMU/M809Q8TzVNU3VdU1Vd2fI81fREUVU1TzRVVVVd1zRVV7Y8z1Q9UVRVTdRU03RdWVZVU1ZF1bRlVVV12TRVWXZl2bZd" +
                "1XVlU1Vd2VRdWTZVU3ZdV7a5siqrnmnKsqmqtmyqquzKtm3rruvqtqiasmuaqmyrqqq7smvrvizLtiyqquuarirLpqrKtizLui" +
                "7LtrCrrmvbpurKuivLdFm1Xd/2bbrquravyq6vu7Js667t6rJu277vmaYsm6op26aqyrIsu7Zty7IvjKbp2qar2rKpurLtuq6u" +
                "y7Js26JpyrKpuq5tqqYsy7Js+7Is27bqyrrs2rLtu64s27JtC7vsCrOvurKtu7JtC6ur2rbs2z5bV3VVAADAgAMAQIAJZaDQkJ" +
                "UAQBQAAGAMY4xBaJRyzjkIjVLOOQchcw5CCKlkzkEIoaTMOQilpJQ5B6GUlEIIpaTUWgihlJRaKwAAoMABACDABk2JxQEKDVkJ" +
                "AKQCABgcR9NM03Vl2RgWyxJFVZVl2zaGxbJEUVVl2baFYxNFVZVl29Z1NFFUVVm2bd1XjlNVZdm2fV04MlVVlm1b130jVZZtW9" +
                "eFoZIqy7Zt675RSbZtXTeG46gk27bu+75xLPGFobAslfCVXzgqgQAA8AQHAKACG1ZHOCkaCyw0ZCUAkAEAABiklFFKKaOUUkop" +
                "xpRSjAkAABhwAAAIMKEMFBqyIgCIAgAAnHPOOeecc84555xzzjnnnHPOOecYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMc" +
                "YEAOxEOADsRFgIhYasBADCAQAAhBSCklIppZQSOeeklFJKKaWUyEEIpZRSSimlRNJJKaWUUkoppXFQSimllFJKKaGUUkoppZRS" +
                "SgmllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZ" +
                "RSSimllFJKKaWUUkoBACYPDgBQCTbOsJJ0VjgaXGjISgAgNwAAUIo5xiSUkEpIJYQQSuUYhM5JCSm1VkIKrYQKOmido5BSS62V" +
                "lEpJmYQQQiihhFJaKSW1UjIIoYRQSgghpVJKCaFlUEIKJZSUUkkttFRKySCEUFoJqZXUWgollZRBKamEklIqrbWUSkqtg9JSKa" +
                "211kpKIZWWUgelpJZSKaW1FkprrbVOUiktpNZSa62VVkopnaWUSkmttZZaaymlVkIprbTSWikltdZSay2V1FpLraXWUmutpdZK" +
                "KSWlllprrbWWWioptZRCKaWVkkJqqaXWSiothNBSSaWVVlprKaWUSigllZRaKqm1llJopYXSSkklpZZKKiml1FIqoZQSUiqhld" +
                "RSa6mllkoqLbXUUiuplJZKSqkUAAB04AAAEGBEpYXYacaVR+CIQoYJKAAAEAQAGIiQmUCgAAoMZADAAUKCFABQWGAoXeiCECJI" +
                "F0EWD1w4ceOJG07o0AYAGIiQmQChGCIkZAPABEWFdACwuMAoXeiCECJIF0EWD1w4ceOJG07o0AIBAAAAAMABAB8AAAcGEBHRXI" +
                "bGBkeHxwdIiAgAAAAAAAAAAAAAAIBPZ2dTAAQABAAAAAAAAFSE+nsCAAAAN7BaJQMBAQEAAAA=";
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
            function createRange(from, to, step) {
                if (step === void 0) { step = 1; }
                var retVal = [];
                if (step > 0) {
                    for (var i = from; i <= to; i += step)
                        retVal.push(i);
                }
                else if (step < 0) {
                    for (var i = from; i >= to; i += step)
                        retVal.push(i);
                }
                return retVal;
            }
            Utils.createRange = createRange;
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
            function numberInRange(value, min, max) {
                // Ensure that the value falls within the range, even if the values provided are in the wrong order.
                return value >= Math.min(min, max) && value <= Math.max(min, max);
            }
            Utils.numberInRange = numberInRange;
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
            function clampToRange(value, min, max) {
                // This does the following:
                //   1) Find the smaller of the two values given as the range
                //   2) Find the larger of the value and the result from step #1
                //   3) Find the larger of the two values given as the range
                //   4) Find the smaller of the numbers from step 2 and 4 and return that
                //
                // This code appears semi-complicated because it allows for min and max to be passed in the wrong
                // order and still work.
                return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
            }
            Utils.clampToRange = clampToRange;
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
            function rangeInRange(min1, max1, min2, max2) {
                // For the ranges to intersect each other, the largest value in the first range has to be larger
                // than the smallest value in the second range AND the smallest value in the first range needs to
                // be smaller than the larger value in the second range.
                return Math.max(min1, max1) >= Math.min(min2, max2) &&
                    Math.min(min1, max1) <= Math.max(min2, max2);
            }
            Utils.rangeInRange = rangeInRange;
            /**
             * Calculate the distance between the two points provided.
             *
             * @param point1 the first point
             * @param point2 the second point
             * @returns {number} the distance between the two points
             */
            function distanceBetween(point1, point2) {
                // Use the other function
                return this.distanceBetweenXY(point1.x, point1.y, point2.x, point2.y);
            }
            Utils.distanceBetween = distanceBetween;
            /**
             * Calculate the square of the distance between the two points provided.
             *
             * @param point1 the first point
             * @param point2 the second point
             * @returns {number} the square of the distance between the two points
             */
            function distanceSquaredBetween(point1, point2) {
                // Use the other function
                return this.distanceSquaredBetweenXY(point1.x, point1.y, point2.x, point2.y);
            }
            Utils.distanceSquaredBetween = distanceSquaredBetween;
            /**
             * Calculate the distance between the two points provided.
             *
             * @param x1 X coordinate of first point
             * @param y1 Y coordinate of first point
             * @param x2 X coordinate of second point
             * @param y2 Y coordinate of second point
             * @returns {number} the distance between the two points
             */
            function distanceBetweenXY(x1, y1, x2, y2) {
                // Get the delta values between the two points.
                var dX = x2 - x1;
                var dY = y2 - y1;
                // Do that thing we all know what it does.
                return Math.sqrt((dX * dX) + (dY * dY));
            }
            Utils.distanceBetweenXY = distanceBetweenXY;
            /**
             * Calculate the square of the distance between the two points provided.
             *
             * @param x1 X coordinate of first point
             * @param y1 Y coordinate of first point
             * @param x2 X coordinate of second point
             * @param y2 Y coordinate of second point
             * @returns {number} the square of the distance between the two points
             */
            function distanceSquaredBetweenXY(x1, y1, x2, y2) {
                // Get the delta values between the two points.
                var dX = x2 - x1;
                var dY = y2 - y1;
                // Do that thing we all know what it does but without that other part that we also know what it does.
                return (dX * dX) + (dY * dY);
            }
            Utils.distanceSquaredBetweenXY = distanceSquaredBetweenXY;
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
            function normalize(value, min, max) {
                return (value - min) / (max - min);
            }
            Utils.normalize = normalize;
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
            function linearInterpolate(normal, min, max) {
                return min + (max - min) * normal;
            }
            Utils.linearInterpolate = linearInterpolate;
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
            Point.fromPoint = function (vector, origin) {
                if (origin === void 0) { origin = null; }
                var retVal = new Point(vector.x, vector.y);
                if (origin != null)
                    retVal.translate(origin);
                return retVal;
            };
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
             * Given some other coordinate value, calculate the angle between this point and that point, in
             * degrees. 0 degrees faces to the right and 90 degrees is down instead of up (because it faces in
             * the direction of positive Y, which increases downwards).
             *
             * @param x the X-coordinate to calculate the angle to
             * @param y the Y-coordinate to calculate the angle to
             * @returns {number} the angle (in degrees) between this point and the passed in point.
             * @see Point.angleTo
             */
            Point.prototype.angleToXY = function (x, y) {
                // Get the angle and convert it to degrees on the way out.
                return Math.atan2(y - this._y, x - this._x) * (180 / Math.PI);
            };
            /**
             * Given some other coordinate value, calculate the angle between this point and that point, in
             * degrees. 0 degrees faces to the right and 90 degrees is down instead of up (because it faces in
             * the direction of positive Y, which increases downwards).
             *
             * @param other the point to calculate the angle to
             * @returns {number} the angle (in degrees) between this point and the passed in point.
             * @see Point.angleToXY
             */
            Point.prototype.angleTo = function (other) {
                return this.angleToXY(other._x, other._y);
            };
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
            Point.prototype.distanceXY = function (x, y) {
                // Take the square of our squared distance
                return Math.sqrt(this.distanceSquaredXY(x, y));
            };
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
            Point.prototype.distanceSquaredXY = function (x, y) {
                // Save the actual distance between the two points
                var offsX = this._x - x;
                var offsY = this._y - y;
                // Calculate by using pythagoras and skipping the square root portion
                return (offsX * offsX) + (offsY * offsY);
            };
            /**
             * Calculate and return the distance between this point and the point passed in.
             *
             * @param other the other point to calculate the distance to
             * @returns {number} the distance between this point and the other point
             * @see Point.distanceXY
             * @see Point.distanceSquared
             * @see Point.distanceSquaredXY
             */
            Point.prototype.distance = function (other) {
                return Math.sqrt(this.distanceSquaredXY(other._x, other._y));
            };
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
            Point.prototype.distanceSquared = function (other) {
                return this.distanceSquaredXY(other._x, other._y);
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
        }());
        game.Point = Point;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
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
        var Vector2D = (function () {
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
            function Vector2D(x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this._x = x;
                this._y = y;
            }
            Object.defineProperty(Vector2D.prototype, "x", {
                /**
                 * The x component of this vector.
                 *
                 * @returns {number}
                 */
                get: function () { return this._x; },
                /**
                 * Set the x component of this vector.
                 *
                 * @param newX the new X to set.
                 */
                set: function (newX) { this._x = newX; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vector2D.prototype, "y", {
                /**
                 * The y component of this vector.
                 *
                 * @returns {number}
                 */
                get: function () { return this._y; },
                /**
                 * Set the y component of this vector.
                 *
                 * @param newY the new y to set.
                 */
                set: function (newY) { this._y = newY; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vector2D.prototype, "magnitude", {
                /**
                 * Get the magnitude of this vector.
                 *
                 * @returns {number} the length of this vector
                 */
                get: function () {
                    // Take the square root of our squared magnitude.
                    return Math.sqrt(this.magnitudeSquared);
                },
                /**
                 * Set the magnitude of this vector. This retains the current direction of the vector but modifies
                 * the components so that the magnitude is the new magnitude.
                 *
                 * Setting the magnitude to 1 is a shortcut for normalizing it.
                 *
                 * @param newMagnitude the new magnitude for the vector
                 */
                set: function (newMagnitude) {
                    // Get the current angle of vector and convert it to radians.
                    var direction = this.direction * (Math.PI / 180);
                    // Now use a little trig to set the X and Y to the new length.
                    this._x = Math.cos(direction) * newMagnitude;
                    this._y = Math.sin(direction) * newMagnitude;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vector2D.prototype, "direction", {
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
                get: function () {
                    // Calculate the actual angle in degrees. This calculates the angle as something between -180 and
                    // 180 (anything with a negative Y value is a negative angle).
                    var angle = Math.atan2(this._y, this._x) * (180 / Math.PI);
                    // Normalize the angle to be in the range of 0 - 359 instead
                    return (angle < 0) ? angle + 360 : angle;
                },
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
                set: function (newDirection) {
                    // Convert the angle given from degrees to radians.
                    newDirection = newDirection * (Math.PI / 180);
                    // Now using a little trig, calculate what the new X and Y values should be in order to get to
                    // that direction while maintaining the length.
                    var currentLength = this.magnitude;
                    this._x = Math.cos(newDirection) * currentLength;
                    this._y = Math.sin(newDirection) * currentLength;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vector2D.prototype, "magnitudeSquared", {
                /**
                 * Get the squared magnitude of this vector. The true magnitude is the square root of this value,
                 * which can be a costly operation; for comparison purposes you may want to skip that portion of
                 * the operation.
                 *
                 * @returns {number}
                 */
                get: function () {
                    // A vector is really just the hypotenuse of a right triangle, so this is easily calculated.
                    // We don't take the square root here.
                    return (this._x * this._x) + (this._y * this._y);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Given a direction and a magnitude, return back a vector object that represents those values. This
             * calculates the appropriate X and Y displacements required in order to obtain a vector with these
             * properties.
             *
             * @param direction the direction the vector is pointing (in degrees)
             * @param magnitude the magnitude of the vector
             */
            Vector2D.fromDisplacement = function (direction, magnitude) {
                // Convert the angle from degrees to radians.
                direction *= (Math.PI / 180);
                // This is a classic right angle situation; the cosine of the direction is the ratio of the X
                // portion and the sine is the ratio of the Y direction. We need to multiply those results by the
                // actual magnitude that we were given in order to scale them appropriately.
                return new Vector2D(Math.cos(direction) * magnitude, Math.sin(direction) * magnitude);
            };
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
            Vector2D.fromPoint = function (point, origin) {
                if (origin === void 0) { origin = null; }
                if (origin == null)
                    return new Vector2D(point.x, point.y);
                else
                    return new Vector2D(point.x - origin.x, point.y - origin.y);
            };
            /**
             * Return a new vector instance that is a copy of this vector
             *
             * @returns {Vector2D} a duplicate of this vector
             */
            Vector2D.prototype.copy = function () {
                return new Vector2D(this._x, this._y);
            };
            /**
             * Return a new vector instance that is a copy of this vector after it has been normalized.
             *
             * @returns {Vector2D} a duplicate of the normalized form of this vector.
             */
            Vector2D.prototype.copyNormalized = function () {
                return this.copy().normalize();
            };
            /**
             * Return a new vector instance that is a copy of this vector after it has been reversed to point in
             * the opposite direction of this vector
             *
             * @returns {Vector2D} a duplicate of the reversed form of this vector
             */
            Vector2D.prototype.copyReversed = function () {
                return this.copy().reverse();
            };
            /**
             * Return a new vector instance that is a copy of this vector after it has been rotated 90
             * degrees to the left or right.
             *
             * @param left true to rotate the copied vector to the left or false to rotate it to the right
             */
            Vector2D.prototype.copyOrthogonal = function (left) {
                if (left === void 0) { left = true; }
                return this.copy().orthogonalize(left);
            };
            /**
             * Flip the X component of this vector to reverse its direction in the left/right sense, leaving
             * the magnitude unchanged.
             */
            Vector2D.prototype.flipX = function () {
                this._x *= -1;
            };
            /**
             * Flip the Y component of this vector to reverse its direction in the left/right sense, leaving
             * the magnitude unchanged.
             */
            Vector2D.prototype.flipY = function () {
                this._y *= -1;
            };
            /**
             * Reverse the direction of the vector by rotating it 180 degrees from the direction that it is
             * currently pointing.
             *
             * @returns {Vector2D} this vector after being reversed.
             */
            Vector2D.prototype.reverse = function () {
                // Reversing the direction of the vector is as simple as changing the sign of both of the
                // components so that they face the other way.
                this.flipX();
                this.flipY();
                return this;
            };
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
            Vector2D.prototype.normalize = function () {
                // First, get the magnitude. We cache this here because it is otherwise calculated every time
                // we access the property.
                var magnitude = this.magnitude;
                // If the magnitude is 0, we will set ourselves to be a magnitude of 1. The zero vector has a
                // direction of 0, so we can easily get the dimension we want while at the same time maintaining
                // that direction.
                if (magnitude == 0) {
                    this._x = 1;
                    this._y = 0;
                }
                else {
                    // Dividing a number by itself always results in 1, so dividing each of the components of the
                    // vector by its current length causes the final magnitude to be 1 due to the magic of math.
                    this._x /= magnitude;
                    this._y /= magnitude;
                }
                return this;
            };
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
            Vector2D.prototype.dot = function (other) {
                // Our vectors are represented via matrices, so the dot product is a matrix multiplication. That
                // means that we multiply each index in the first matrix with the corresponding index in the
                // second matrix, and them sum all of the products together.
                //
                // In our general case for 2D vectors, this is just x*x + y*y. Note that this means that the
                // result of the dot product between a vector and itself is the square of its length.
                return (this._x * other._x) + (this._y * other._y);
            };
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
            Vector2D.prototype.orthogonalize = function (left) {
                if (left === void 0) { left = true; }
                // The magic of the dot product tells us that the dot product of two perpendicular vectors is 0
                // because the cosine of 90 degrees is 0.
                //
                // Taking mathematical advantage of this and knowing how the dot product is calculated (summing
                // the products of the X and Y parts of two vectors), it should (hopefully) be easy to see that if
                // you swap the X and Y components and make one of them negative, the two sums will cancel each
                // other out, which means that the angle between them is 90, which means they are perpendicular.
                //
                // The term that you negate controls the direction which the apparent "rotation" has occurred,
                // which we control here via a boolean.
                var newX = this._y * (left ? 1 : -1);
                var newY = this._x * (left ? -1 : 1);
                this._x = newX;
                this._y = newY;
                return this;
            };
            /**
             * Add the provided vector to this vector, returning this vector.
             *
             * @param other the vector to add to this vector
             * @returns {Vector2D} this vector after the other vector has been added to it
             */
            Vector2D.prototype.add = function (other) {
                this._x += other._x;
                this._y += other._y;
                return this;
            };
            /**
             * Subtract the provided vector from this vector, returning this vector
             *
             * @param other the vector to subtract from this vector
             * @returns {Vector2D} this vector after the other vector has been subtracted from it
             */
            Vector2D.prototype.sub = function (other) {
                this._x -= other._x;
                this._y -= other._y;
                return this;
            };
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
            Vector2D.prototype.negate = function () {
                // This is identical to reversing the direction of the vector.
                return this.reverse();
            };
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
            Vector2D.prototype.rotate = function (angle) {
                // Convert degrees to radians
                angle *= Math.PI / 180;
                // Pre-calculate the cos and sin, since we need each one twice.
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                // Calculate the rotation of the end of the vector by using a simple 2D rotation matrix.
                var newX = (this._x * cos) - (this._y * sin);
                var newY = (this._x * sin) + (this._y * cos);
                // Set in the new points now
                this._x = newX;
                this._y = newY;
                return this;
            };
            /**
             * Rotate this vector so that it points at the angle provided.
             *
             * @param angle the absolute angle to point the vector in, in degrees
             * @returns {Vector2D} this vector after the rotation has been accomplished
             */
            Vector2D.prototype.rotateTo = function (angle) {
                return this.rotate(angle - this.direction);
            };
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
            Vector2D.prototype.scale = function (factor) {
                // To scale the vector we just modify the values by the scale value provided. This keeps the ratio
                // between the two the same (which keeps the direction the same) but modifies the displacement of
                // both parts appropriately.
                this._x *= factor;
                this._y *= factor;
                return this;
            };
            /**
             * Display a string version of the vector for debugging purposes.
             *
             * This displays the displacement values as well as the direction and magnitude. All values are set to
             * a fixed level 0f 3 digits after the decimal point.
             *
             * @returns {string}
             */
            Vector2D.prototype.toString = function () {
                return ("V<(" + this._x.toFixed(3) + "," + this._y.toFixed(3) + "), ") +
                    (this.direction.toFixed(3) + "\u00B0, " + this.magnitude.toFixed(3) + ">");
            };
            return Vector2D;
        }());
        game.Vector2D = Vector2D;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents the basics of a sprite sheet; this takes the URL to an image, and will
         * preload that image and internally slice it into sprites at given size boundaries for later rendering.
         *
         * This version of the class requires all sprites in the same sprite sheet to have the same dimensions.
         */
        var SpriteSheet = (function () {
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
            function SpriteSheet(stage, image, across, down, asSprites, callback) {
                var _this = this;
                if (down === void 0) { down = 1; }
                if (asSprites === void 0) { asSprites = true; }
                if (callback === void 0) { callback = null; }
                /**
                 * This gets invoked when our image is fully loaded, which means its dimensions are known. This
                 * kicks off setting up the rest of the information needed for this sprite sheet.
                 *
                 * @param image the image that was loaded.
                 */
                this.imageLoadComplete = function (image) {
                    // Now calculate either the dimensions of our sprites or the number of sprites across and
                    // down, depending on which way we were constructed; only one of those two values is currently
                    // available.
                    if (_this._spriteWidth == -1) {
                        _this._spriteWidth = image.width / _this._spritesAcross;
                        _this._spriteHeight = image.height / _this._spritesDown;
                    }
                    else {
                        _this._spritesAcross = image.width / _this._spriteWidth;
                        _this._spritesDown = image.height / _this._spriteHeight;
                    }
                    // Now calculate the total number of sprites in the sheet.
                    _this._spriteCount = _this._spritesAcross * _this._spritesDown;
                    // Set up the sprite position array.
                    _this._spritePos = [];
                    for (var spriteIndex = 0; spriteIndex < _this._spriteCount; spriteIndex++) {
                        // Calculate the X and Y location that this sprite is positioned at, and then store it
                        // into the position array.
                        var x = (spriteIndex % _this._spritesAcross) * _this._spriteWidth;
                        var y = Math.floor(spriteIndex / _this._spritesAcross) * _this._spriteHeight;
                        _this._spritePos.push(new game.Point(x, y));
                    }
                    // If there is a callback, invoke it now.
                    if (_this._callback)
                        _this._callback(_this);
                };
                // Set up either sprite width and height or sprites across and down, depending on our boolean
                // flag.
                this._spriteWidth = (asSprites ? -1 : across);
                this._spriteHeight = (asSprites ? -1 : down);
                this._spritesAcross = (asSprites ? across : -1);
                this._spritesDown = (asSprites ? down : -1);
                // Save the callback, if any.
                this._callback = callback;
                // If the value passed in is a string, then we need to preload the image and do the rest of
                // our work in the handler when the preload finishes. This doesn't use instanceof because
                // constant strings aren't instances of class String for some obscure reason; sadly this also
                // requires
                if (typeof (image) == "string")
                    this._image = stage.preloadImage(image, this.imageLoadComplete);
                else if (image instanceof HTMLImageElement) {
                    // Here we were given an image and not a filename; ensure that it was actually already loaded.
                    if (image.complete == false || image.naturalWidth == 0)
                        throw new TypeError("SpriteSheet provided an image that is not already loaded");
                    // Save the image and then invoke the handler as if a preload just finished.
                    this._image = image;
                    this.imageLoadComplete(image);
                }
                else
                    throw new TypeError("Somehow SpriteSheet constructor was passed an invalid value");
            }
            Object.defineProperty(SpriteSheet.prototype, "width", {
                /**
                 * Obtain the width of sprites that are present in this sprite sheet; this is not available until
                 * the sprite sheet has finished loading the underlying image.
                 *
                 * @returns {number}
                 */
                get: function () { return this._spriteWidth; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteSheet.prototype, "height", {
                /**
                 * Obtain the height of sprites that are present in this sprite sheet; this is not available until
                 * the sprite sheet has finished loading the underlying image.
                 *
                 * @returns {number}
                 */
                get: function () { return this._spriteHeight; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteSheet.prototype, "count", {
                /**
                 * Obtain the total number of sprites available in this sprite sheet; this is not available until
                 * the sprite sheet has finished loading the underlying image.
                 *
                 * @returns {number}
                 */
                get: function () { return this._spriteCount; },
                enumerable: true,
                configurable: true
            });
            /**
             * Render a sprite from this sprite sheet at the provided location. The sprite will be positioned
             * with its upper left corner at the provided location.
             *
             * @param sprite the sprite to render
             * @param x the x location to render the actor at, in stage coordinates (NOT world)
             * @param y the y location to render the actor at, in stage coordinates (NOT world)
             * @param renderer the class to use to render the actor
             */
            SpriteSheet.prototype.blit = function (sprite, x, y, renderer) {
                var position = this._spritePos[sprite];
                renderer.blitPart(this._image, x, y, position.x, position.y, this._spriteWidth, this._spriteHeight);
            };
            /**
             * Render a sprite from this sprite sheet at the provided location. The sprite will be positioned
             * with its center at the provided location.
             *
             * @param sprite the sprite to render
             * @param x the x location to render the actor at, in stage coordinates (NOT world)
             * @param y the y location to render the actor at, in stage coordinates (NOT world)
             * @param renderer the class to use to render the actor
             */
            SpriteSheet.prototype.blitCentered = function (sprite, x, y, renderer) {
                var position = this._spritePos[sprite];
                renderer.blitPartCentered(this._image, x, y, position.x, position.y, this._spriteWidth, this._spriteHeight);
            };
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
            SpriteSheet.prototype.blitCenteredRotated = function (sprite, x, y, angle, renderer) {
                var position = this._spritePos[sprite];
                renderer.blitPartCenteredRotated(this._image, x, y, angle, position.x, position.y, this._spriteWidth, this._spriteHeight);
            };
            return SpriteSheet;
        }());
        game.SpriteSheet = SpriteSheet;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents a list of animations, which are represented by a list of frames by numeric
         * ID. Generally this would be associated with a sprite sheet of some king.
         */
        var AnimationList = (function () {
            /**
             * Construct a new animation list
             */
            function AnimationList() {
                // Initialize our animation list and indicate that there is no current animation.
                this._animations = {};
                this._current = null;
            }
            Object.defineProperty(AnimationList.prototype, "current", {
                /**
                 * Get the name of the animation that is currently playing on this animation list (or selected to
                 * play). The value is null if no animation is selected.
                 *
                 * @returns {string}
                 */
                get: function () {
                    if (this._current != null)
                        return this._current.name;
                    else
                        return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AnimationList.prototype, "isPlaying", {
                /**
                 * Determine if the current animation is playing or not. The return value is always false if there
                 * is no current animation.
                 *
                 * @returns {boolean}
                 */
                get: function () {
                    // Is there a current animation?
                    return this._current != null && this._current.direction != 0;
                },
                enumerable: true,
                configurable: true
            });
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
            AnimationList.prototype.createAnimation = function (name, fps, loop, frameList) {
                return {
                    // Save the name given
                    name: name,
                    // Animations always loop by default.
                    loop: loop,
                    // Animations do not ping pong by default
                    pingPong: false,
                    // TODO This should query the stage and not assume a frame rate of 30
                    // Currently this is not possible because the frame rate isn't known until run is called.
                    // Calculate the number of ticks that need to elapse between frames. This can be a
                    // floating point value.
                    ticksPerFrame: 30 / fps,
                    // Save the list of frames
                    frames: frameList,
                    // We are currently at the first frame of the animation, with no elapsed time, going
                    // forward in the animation.
                    position: 0,
                    elapsedTicks: 0,
                    direction: 1
                };
            };
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
            AnimationList.prototype.add = function (name, fps, loop, frameList) {
                // If there is already an animation with this name in our list, generate a warning to the
                // console and leave.
                if (this._animations[name] != null) {
                    console.log("Duplicate animation '" + name + "': ignoring definition");
                    return;
                }
                // Create the animation and put it in the list.
                this._animations[name] = this.createAnimation(name, fps, loop, frameList);
                // If there is no current animation, then play this one
                if (this._current == null)
                    this.play(name);
            };
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
            AnimationList.prototype.fetchAnimation = function (name, purpose) {
                var animation = this._animations[name];
                if (animation == null)
                    console.log("No such animation '" + name + "': cannot " + purpose + "; ignoring");
                return animation;
            };
            /**
             * Start playing the provided animation; this will take effect on the next call to the update method.
             *
             * @param name the name of the animation to play or null to stop all animations
             * @see Animation.update
             */
            AnimationList.prototype.play = function (name) {
                // If the name provided is null, then set our current animation to null and return immediately;
                // this is the user deciding to play no animation at all.
                if (name == null) {
                    this._current = null;
                    return;
                }
                // Set the current animation to the one named; leave if not found.
                this._current = this.fetchAnimation(name, "play");
                if (this._current == null)
                    return;
                // Reset the elapsed ticks and position of the animation to 0.
                this._current.elapsedTicks = 0;
                this._current.position = 0;
                // Set the direction of the animation; it always plays in a forward direction unless there is
                // only a single frame; in that case the direction is set to 0 because there's no need to move
                // to a different frame.
                this._current.direction = (this._current.frames.length > 1 ? 1 : 0);
            };
            /**
             * Turn looping for this animation on or off. When an animation is looped, the last frame is followed
             * by the first frame; when not looping the animation freezes at the last frame.
             *
             * @param name the name of the animation to modify
             * @param shouldLoop true to set this animation to loop, false to turn off looping
             */
            AnimationList.prototype.setLoop = function (name, shouldLoop) {
                // Get the animation to change; leave if not found.
                var animation = this.fetchAnimation(name, "change loop state");
                if (animation == null)
                    return;
                // Change the state
                animation.loop = shouldLoop;
            };
            /**
             * Allows you to check if an animation is set to loop or not.
             *
             * @param name the name of the animation to query
             * @returns {boolean} true if this animation is set to loop, or false otherwise
             */
            AnimationList.prototype.loops = function (name) {
                // Get the animation to query; leave if not found.
                var animation = this.fetchAnimation(name, "query loop state");
                if (animation == null)
                    return false;
                // Query
                return animation.loop;
            };
            /**
             * Turn ping ponging for this animation on or off; animations are created to not ping pong by
             * default. When an animation is ping ponged, once the animation gets to the end of the frame
             * list, it goes back towards the front of the list again.
             *
             * @param name the name of the animation to modify
             * @param shouldPingPong true to turn on pingPong for this animation, false to turn it off
             */
            AnimationList.prototype.setPingPong = function (name, shouldPingPong) {
                // Get the animation to change; leave if not found.
                var animation = this.fetchAnimation(name, "change ping-pong state");
                if (animation == null)
                    return;
                // Change the state
                animation.pingPong = shouldPingPong;
            };
            /**
             * Allows you to check if an animation is set to ping pong or not. Animations are created to not
             * ping pong by default.
             *
             * @param name the name of the animation to query
             * @returns {boolean} true if this animation is set to ping pong, or false otherwise
             */
            AnimationList.prototype.pingPongs = function (name) {
                // Get the animation to query; leave if not found.
                var animation = this.fetchAnimation(name, "query ping-pong state");
                if (animation == null)
                    return false;
                // Query
                return animation.pingPong;
            };
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
            AnimationList.prototype.update = function () {
                // If there is no current animation, always return the 0 frame.
                if (this._current == null)
                    return 0;
                // If the direction is not 0 the animation is still playing, in which case we need to handle
                // this update. Note that the play code ensures that the direction is 0 if the frame count is
                // 1, so a lot of the code in this big block of comments assumes there are at least 2 frames
                // to play.
                if (this._current.direction != 0) {
                    // Count this as an elapsed tick for this animation.
                    this._current.elapsedTicks++;
                    // Have enough ticks elapsed to cause us to change the frame?
                    if (this._current.elapsedTicks >= this._current.ticksPerFrame) {
                        // Subtract the ticks per frame from the elapsed ticks and then update the frame
                        // position based on the current direction of the animation.
                        this._current.elapsedTicks -= this._current.ticksPerFrame;
                        this._current.position += this._current.direction;
                        // If the current position is off the end of the frame list, then it is time to either
                        // change directions or stop it entirely.
                        if (this._current.position >= this._current.frames.length) {
                            // If the animation is supposed to ping pong, then this is where we reverse the
                            // direction of playing; this requires us to set the position manually backwards
                            // from the end as well.
                            if (this._current.pingPong) {
                                // Reverse the direction, and then set the position to be two smaller than the
                                // length of the list of frames; this skips us past the frame we were just at
                                // so that we don't play it a second time.
                                this._current.direction = -1;
                                this._current.position = this._current.frames.length - 2;
                            }
                            else if (this._current.loop) {
                                this._current.position = 0;
                            }
                            else {
                                this._current.position = this._current.frames.length - 1;
                                this._current.direction = 0;
                            }
                        }
                        // If the current position is off the start of the array, the animation has ping
                        // ponged back to the start and it's time to either change direction or stop it entirely.
                        if (this._current.position < 0) {
                            // If the animation is set to loop, then we need to set the direction back to 1
                            // and manually position the playback to be the second frame of the animation so
                            // that we don't repeat the frame that we just played.
                            if (this._current.loop) {
                                this._current.direction = 1;
                                this._current.position = 1;
                            }
                            else {
                                this._current.direction = 0;
                                this._current.position = 0;
                            }
                        }
                    }
                }
                // Return the current frame information
                return this._current.frames[this._current.position];
            };
            return AnimationList;
        }());
        game.AnimationList = AnimationList;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
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
        (function (ColliderType) {
            /**
             * No collision volume at all; no collisions are possible with this collider type. All of the
             * collision methods will always return false no matter what.
             */
            ColliderType[ColliderType["NONE"] = 0] = "NONE";
            /**
             * Rectangular bounding volume; the collision volume is the same as the positioning rectangle itself.
             *
             * The default origin for a rectangle collider is (0, 0) so that the position references the upper
             * left corner as one might expect by default.
             */
            ColliderType[ColliderType["RECTANGLE"] = 1] = "RECTANGLE";
            /**
             * Circular bounding volume; the collision volume is a circle positioned inside the exact center
             * of the positioning rectangle itself, which is always a square with sides the same as the
             * diameter of the circle it contains.
             *
             * The default origin for a circle collider is (width/2, height/2) so that the position references
             * the center of the circle as one might expect. This can of course be changed if the position is
             * best referenced from some other point.
             */
            ColliderType[ColliderType["CIRCLE"] = 2] = "CIRCLE";
        })(game.ColliderType || (game.ColliderType = {}));
        var ColliderType = game.ColliderType;
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
        var Collider = (function () {
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
            function Collider(stage, type, x, y, widthOrRadius, height) {
                if (height === void 0) { height = 0; }
                // First, save the stage and simple values.
                this._stage = stage;
                this._type = type;
                this._position = new game.Point(x, y);
                // Default to no rotation
                this._angle = 0;
                // Set up the origin, width and height. How we do this depends on the type of the bounding
                // rectangle.
                if (this._type == ColliderType.CIRCLE) {
                    // The width parameter is a radius. We ignore the height we were given and instead store
                    // the diameter in the height instead.
                    this._width = widthOrRadius;
                    this._height = widthOrRadius * 2;
                    // The origin is the logical center of the bounding rectangle; this turns off for this line
                    // an inspection which gets mad that we are providing the width as the Y value.
                    //noinspection JSSuspiciousNameCombination
                    this._origin = new game.Point(this._width, this._width);
                }
                else {
                    // Everything else is a rectangle; the origin is the upper left and we use the bounds we
                    // were given.
                    this._origin = new game.Point(0, 0);
                    this._width = widthOrRadius;
                    this._height = height;
                }
            }
            Object.defineProperty(Collider.prototype, "type", {
                /**
                 * Obtain the type of collision object that this is.
                 *
                 * @returns {ColliderType}
                 */
                get: function () { return this._type; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collider.prototype, "angle", {
                /**
                 * Get the rotation angle of this collider (in degrees); 0 is to the right and 90 is downward (due
                 * to the Y axis increasing downwards).
                 *
                 * @returns {number}
                 */
                get: function () { return this._angle; },
                /**
                 * Set the rotation angle of this collider (in degrees, does not affect collision
                 * detection).
                 *
                 * The value is normalized to the range 0-359.
                 *
                 * @param newAngle the new angle to render at
                 */
                set: function (newAngle) { this._angle = game.Utils.normalizeDegrees(newAngle); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collider.prototype, "origin", {
                /**
                 * The origin of this collision object, which is an offset from its position and is used to
                 * determine at what point inside the collision object the position represents.
                 *
                 * @returns {Point}
                 */
                get: function () { return this._origin; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collider.prototype, "position", {
                /**
                 * The position of this collision object in the world. These coordinates are in pixel coordinates.
                 *
                 * @returns {Point}
                 */
                get: function () { return this._position; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collider.prototype, "radius", {
                /**
                 * Obtain the radius of this collision object, in pixels.
                 *
                 * This only has meaning when the collider type is CIRCLE; in all other cases, this returns 0.
                 *
                 * @returns {number}
                 */
                get: function () {
                    return (this._type == ColliderType.CIRCLE) ? this._width : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collider.prototype, "width", {
                /**
                 * Obtain the width of this collision object, in pixels. This represents how wide the collision
                 * volume is at its widest point, even if the collision type itself is not rectangular.
                 *
                 * @returns {number}
                 */
                get: function () {
                    // If the type is circular, then the width property is actually the radius and the height
                    // indicates how wide this entity is; circular entities have a square positioning rectangle.
                    return (this._type == ColliderType.CIRCLE) ? this._height : this._width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collider.prototype, "height", {
                /**
                 * Obtain the height of this collision object, in pixels. This represents how tall the collision
                 * volume is at its tallest point, even if the collision type itself is not rectangular.
                 *
                 * @returns {number}
                 */
                get: function () { return this._height; },
                enumerable: true,
                configurable: true
            });
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
            Collider.prototype.renderVolume = function (x, y, color, renderer) {
                // We get the actual position value that we're supposed to be at, so translate the canvas to
                // make the origin be at that location; this also rotates the canvas to the appropriate angle.
                renderer.translateAndRotate(x, y, this._angle);
                // Render the bounding volume itself. Now that the origin is the position to render at, we can
                // use our origin property to offset so that we are visualized as appropriate.
                switch (this._type) {
                    // No volume; nothing to render.
                    case ColliderType.NONE:
                        break;
                    // For a rectangle, a box with our width and height with its upper left corner offset by
                    // our origin offset is drawn (since 0, 0 represents our actual position).
                    case ColliderType.RECTANGLE:
                        renderer.strokeRect(-this._origin.x, -this._origin.y, this._width, this._height, color, 1);
                        break;
                    // For a circle, we need to do the same offset by our origin as for a rectangle, and then
                    // add to that our radius; for circles, our position assumes that we are a square with
                    // sides equal to our diameter; most of the time circles have an origin that places the
                    // actual position in the center of this rectangle, but that is not required.
                    case ColliderType.CIRCLE:
                        renderer.strokeCircle(-this._origin.x + this.radius, -this._origin.y + this.radius, this.radius, color, 1);
                        break;
                }
                // Now render a dot at the location which we are referenced from, which is the canvas origin
                // due to our translation above.
                renderer.fillCircle(0, 0, 4, color);
                // Restore the context now.
                renderer.restore();
            };
            /**
             * Perform a collision check to see if the point provided falls within the bounding volume of this
             * collider.
             *
             * @param point the point to check
             * @returns {boolean} true if the point is within the bounding volume of this collision object or
             * false otherwise
             */
            Collider.prototype.contains = function (point) {
                // Use the other version of the function
                return this.containsXY(point.x, point.y);
            };
            /**
             * Perform a collision check to see if the point provided falls within the bounding volume of this
             * collider.
             *
             * @param x the X coordinate of the point to check
             * @param y the Y coordinate of the point to check
             * @returns {boolean} true if the point is within the bounding volume of this collision object or
             * false otherwise
             */
            Collider.prototype.containsXY = function (x, y) {
                // Perform the check depending on type
                switch (this._type) {
                    // No collision type means no collision.
                    case ColliderType.NONE:
                        return false;
                    // Collision with rectangle; check if the point is inside of our bounding rectangle, taking
                    // the origin into account.
                    case ColliderType.RECTANGLE:
                        return game.Collision.pointInRect(x, y, this._position.x - this._origin.x, this._position.y - this._origin.y, this._width, this._height);
                    // Collision with circle; check if the point is inside of our bounding circle, taking the
                    // origin into account.
                    case ColliderType.CIRCLE:
                        return game.Collision.pointInCircle(x, y, this._position.x + this.radius - this._origin.x, this._position.y + this.radius - this._origin.y, this.radius);
                }
                // All other collider types don't collide with anything.
                return false;
            };
            /**
             * Perform a collision with the other object under the assumption that both us and the other
             * object are circles.
             *
             * @param other the other collision object, which needs to be a circle
             * @returns {boolean} true if we collide with this circle, or false otherwise
             */
            Collider.prototype.circleCircleCollide = function (other) {
                return game.Collision.circleInCircle(
                // Their information
                other.position.x + other.radius - other.origin.x, other.position.y + other.radius - other.origin.y, other.radius, 
                // Our information
                this._position.x + this.radius - this._origin.x, this._position.y + this.radius - this._origin.y, this.radius);
            };
            /**
             * Perform a collision with the other object under the assumption that both us and the other
             * object are rectangles.
             *
             * @param other the other collision object, which needs to be a rectangle
             * @returns {boolean} true if we collide with this rectangle, false otherwise
             */
            Collider.prototype.rectRectCollide = function (other) {
                return game.Collision.rectInRect(
                // Their information
                other.position.x - other.origin.x, other.position.y - other.origin.y, other.width, other.height, 
                // Our information
                this._position.x - this._origin.x, this._position.y - this._origin.y, this._width, this._height);
            };
            /**
             * Perform a collision with the other object under the assumption that one of us is a rectangle
             * and the other is a circle. Which is which does not matter, this works both ways.
             *
             * @param other the other collision object, which need to be either a rectangle or a circle
             * (whichever we are not)
             * @returns {boolean} true if we collide with this rectangle, false otherwise
             */
            Collider.prototype.circleRectCollide = function (other) {
                // Determine which of us is the circle and which of us is the rectangle.
                var circle = (this._type == ColliderType.CIRCLE ? this : other);
                var rectangle = (this._type == ColliderType.CIRCLE ? other : this);
                // Now try the collision
                return game.Collision.rectInCircle(
                // The rectangle
                rectangle.position.x - rectangle.origin.x, rectangle.position.y - rectangle.origin.y, rectangle.width, rectangle.height, 
                // The circle
                circle.position.x + circle.radius - circle.origin.x, circle.position.y + circle.radius - circle.origin.y, circle.radius);
            };
            /**
             * Perform a collision check between this collision object and some other collision object. This
             * takes into account the types of each object and collides them as appropriate.
             *
             * @param other the other object to collide with
             * @returns {boolean} true if these two objects are colliding, or false otherwise
             */
            Collider.prototype.collidesWith = function (other) {
                // If there is no other object, or one of the two of us is not able to collide with anything,
                // we can return false right now.
                if (this._type == ColliderType.NONE || other == null || other.type == ColliderType.NONE)
                    return false;
                // Are we both the same type of object?
                if (this._type == other.type) {
                    // Collide as either a circle or rectangle.
                    switch (this._type) {
                        case ColliderType.CIRCLE:
                            return this.circleCircleCollide(other);
                        case ColliderType.RECTANGLE:
                            return this.rectRectCollide(other);
                    }
                }
                // We are not the same type; thus, we need to intersect between a circle and a rectangle.
                return this.circleRectCollide(other);
            };
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
            Collider.prototype.intersectWithSegment = function (p0, p1, result) {
                if (result === void 0) { result = null; }
                // Use the other method.
                return this.intersectWithSegmentXY(p0.x, p0.y, p1.x, p1.y, result);
            };
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
            Collider.prototype.intersectWithSegmentXY = function (x0, y0, x1, y1, result) {
                if (result === void 0) { result = null; }
                // Collide based on the type of this object.
                switch (this._type) {
                    // No possible intersection.
                    case ColliderType.NONE:
                    case ColliderType.CIRCLE:
                        return null;
                    // Check to see where the segment intersects with our rectangle.
                    case ColliderType.RECTANGLE:
                        return game.Collision.segmentRectangleIntersectionXY(x0, y0, x1, y1, this._position.x - this._origin.x, this._position.y - this._origin.y, this._width, this._height, result);
                }
            };
            return Collider;
        }());
        game.Collider = Collider;
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
        var Actor = (function (_super) {
            __extends(Actor, _super);
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
            function Actor(name, stage, x, y, width, height, zOrder, debugColor) {
                if (zOrder === void 0) { zOrder = 1; }
                if (debugColor === void 0) { debugColor = 'white'; }
                // Invoke the super to set things up.
                _super.call(this, stage, game.ColliderType.RECTANGLE, x, y, width, height);
                // Save the other passed in values.
                this._name = name;
                this._zOrder = zOrder;
                this._debugColor = debugColor;
                // Default to the first sprite of a nonexistent sprite sheet
                this._sheet = null;
                this._sprite = 0;
                // Make a reduced copy of the given position to give this actor's map position.
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
            Object.defineProperty(Actor.prototype, "origin", {
                /**
                 * Get the origin of this actor, which is the offset from its position that is used to determine
                 * where it renders and its hit box is located.
                 *
                 * @returns {Point}
                 */
                get: function () { return this._origin; },
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
                 * @param newZOrder the new zOrder value
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
            Object.defineProperty(Actor.prototype, "animations", {
                /**
                 * Get the animation list for this actor. This does not exist until the first time you query this
                 * property.
                 *
                 * In order for animations to play, they must be added and a sprite sheet must be set as well.
                 *
                 * @returns {AnimationList}
                 */
                get: function () {
                    // Create the animation list if it doesn't exist.
                    if (this._animations == null)
                        this._animations = new game.AnimationList();
                    return this._animations;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Actor.prototype, "sheet", {
                /**
                 * The sprite sheet that is attached to this actor, or null if there is no sprite sheet currently
                 * attached.
                 *
                 * @returns {SpriteSheet}
                 */
                get: function () { return this._sheet; },
                /**
                 * Change the sprite sheet associated with this actor to the sheet passed in. Setting the sheet to
                 * null turns off the sprite sheet for this actor.
                 *
                 * @param newSheet the new sprite sheet to attach or null to remove the current sprite sheet
                 */
                set: function (newSheet) { this._sheet = newSheet; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Actor.prototype, "sprite", {
                /**
                 * Get the sprite index of the sprite in the attached sprite sheet that this actor uses to render
                 * itself. This value has no meaning if no sprite sheet is currently attached to this actor.
                 *
                 * @returns {number}
                 */
                get: function () { return this._sprite; },
                /**
                 * Change the sprite index of the sprite in the attached sprite sheet that this actor uses to
                 * render itself. If there is no sprite sheet currently attached to this actor, or if the sprite
                 * index is not valid, this has no effect.
                 *
                 * @param newSprite the new sprite value to use from the given sprite sheet.
                 */
                set: function (newSprite) { this._sprite = newSprite; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Actor.prototype, "angle", {
                /**
                 * Get the rotation angle that this Actor renders at (in degrees); 0 is to the right, 90 is
                 * downward and 270 is upward (because the Y axis increases downward). This only affects rendering,
                 * currently.
                 *
                 * @returns {number}
                 */
                get: function () { return this._angle; },
                /**
                 * Set the rotation angle that this Actor renders at (in degrees, does not affect collision
                 * detection).
                 *
                 * The value is normalized to the range 0-359.
                 *
                 * @param newAngle the new angle to render at
                 */
                set: function (newAngle) { this._angle = game.Utils.normalizeDegrees(newAngle); },
                enumerable: true,
                configurable: true
            });
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
            Actor.prototype.makeRectangle = function (width, height, resetOrigin) {
                if (resetOrigin === void 0) { resetOrigin = false; }
                // Set the collision type to rectangle and set up the bounds
                this._type = game.ColliderType.RECTANGLE;
                this._width = width;
                this._height = height;
                // If asked, make the origin be the upper left corner (default for rectangle colliders).
                if (resetOrigin)
                    this._origin.setToXY(0, 0);
            };
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
            Actor.prototype.makeCircle = function (radius, resetOrigin) {
                if (resetOrigin === void 0) { resetOrigin = false; }
                // Set the collision type to circle and set up the bounds. For a circle, the radius is kept in
                // the width and the height is the diameter
                this._type = game.ColliderType.CIRCLE;
                this._width = radius;
                this._height = radius * 2;
                // If asked, make the origin be the center (default for circle colliders)
                if (resetOrigin)
                    this._origin.setToXY(radius, radius);
            };
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
            Actor.prototype.addAnimation = function (name, fps, loop, frameList) {
                // Make sure there is an animation list.
                if (this._animations == null)
                    this._animations = new game.AnimationList();
                // Now add the animation.
                this._animations.add(name, fps, loop, frameList);
            };
            /**
             * Start playing the provided animation; this will take effect on the next call to the update method.
             *
             * @param name the name of the animation to play or null to stop all animations
             */
            Actor.prototype.playAnimation = function (name) {
                if (this._animations)
                    this._animations.play(name);
            };
            /**
             * Update internal stage for this actor. The default implementation makes sure that any currently
             * running animation plays as expected.
             *
             * @param stage the stage that the actor is on
             * @param tick the game tick; this is a count of how many times the game loop has executed
             */
            Actor.prototype.update = function (stage, tick) {
                // If there is a sprite sheet and an animation list, then update our sprite using the animation.
                if (this._sheet && this._animations)
                    this._sprite = this._animations.update();
            };
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
            Actor.prototype.render = function (x, y, renderer) {
                // If there os a sprite sheet attached AND the sprite index is value for it, then render it.
                //
                // Failing that, render our bounds by invoke the super's renderVolume method.
                if (this._sheet != null && this._sprite >= 0 && this._sprite < this._sheet.count) {
                    // Translate the canvas to be where our origin point is (which is an offset from the location
                    // that we were given) and then rotate the canvas to the appropriate angle.
                    renderer.translateAndRotate(x, y, this._angle);
                    this._sheet.blit(this._sprite, -this._origin.x, -this._origin.y, renderer);
                    renderer.restore();
                }
                else
                    this.renderVolume(x, y, this._debugColor, renderer);
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
        }(game.Collider));
        game.Actor = Actor;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
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
                // If there is no debug field, set it to be false.
                if (this._properties.debug == null)
                    this._properties.debug = false;
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
            Entity.prototype.render = function (x, y, renderer) {
                // First, let the super do what it wants to do. This will render our current sprite (if there
                // is one to display), or it will render our bounds if there is not a sprite.
                _super.prototype.render.call(this, x, y, renderer);
                // If we're supposed to render debug information AND the super has not already rendered it,
                // then render our bounds now.
                //
                // The super class only renders bounds when there is no sprite sheet to display or the sprite
                // in it is invalid. Thus, if there is a sprite sheet and the sprite is valid, we don't need
                // to do this.
                if (this._properties.debug &&
                    (this._sheet != null && this._sprite >= 0 && this._sprite < this._sheet.count)) {
                    this.renderVolume(x, y, this._debugColor, renderer);
                }
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
        }(game.Actor));
        game.Entity = Entity;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        var Collision;
        (function (Collision) {
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
            function pointInRect(pX, pY, rectX, rectY, width, height) {
                // The point falls inside of the rectangle if the components fall along the range of X and Y
                // values that make up the rectangle.
                return game.Utils.numberInRange(pX, rectX, rectX + width) &&
                    game.Utils.numberInRange(pY, rectY, rectY + height);
            }
            Collision.pointInRect = pointInRect;
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
            function pointInCircle(pX, pY, circleX, circleY, circleR) {
                // For the point to be in the circle, the distance between the point and the circle has to be
                // smaller than the radius. Here we do the comparison with the squares of the distances because we
                // don't care about what the distance ultimately is, only that it's close enough.
                return game.Utils.distanceSquaredBetweenXY(pX, pY, circleX, circleY) <= circleR * circleR;
            }
            Collision.pointInCircle = pointInCircle;
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
            function rectInRect(rect1X, rect1Y, rect1W, rect1H, rect2X, rect2Y, rect2W, rect2H) {
                // If the range of X and Y values in both rectangles overlap each other, then the rectangles
                // intersect each other.
                return game.Utils.rangeInRange(rect1X, rect1X + rect1W, rect2X, rect2X + rect2W) &&
                    game.Utils.rangeInRange(rect1Y, rect1Y + rect1H, rect2Y, rect2Y + rect2H);
            }
            Collision.rectInRect = rectInRect;
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
            function circleInCircle(circle1X, circle1Y, circle1R, circle2X, circle2Y, circle2R) {
                // Get the combined radius of both circles.
                var combinedR = circle1R + circle2R;
                // In order for the two circles to intersect, the distance between their center points has to be
                // no larger than the combination of both of their radii. Like in the point/circle collision, we
                // work with the squares here because they just need to be in range.
                return game.Utils.distanceSquaredBetweenXY(circle1X, circle1Y, circle2X, circle2Y) <= combinedR * combinedR;
            }
            Collision.circleInCircle = circleInCircle;
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
            function rectInCircle(rectX, rectY, rectW, rectH, circleX, circleY, circleR) {
                // Determine the closest point on the rectangle to the center of the circle, and then see if that
                // point is within the circle or not using the other collision function.
                //
                // The clamping of the values finds the point on the perimeter of the rectangle that is
                // orthogonally closest to the center of the circle.
                return Collision.pointInCircle(game.Utils.clampToRange(circleX, rectX, rectX + rectW), game.Utils.clampToRange(circleY, rectY, rectY + rectH), circleX, circleY, circleR);
            }
            Collision.rectInCircle = rectInCircle;
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
            function lineIntersection(p0, p1, p2, p3, result) {
                if (result === void 0) { result = null; }
                // Use the other function to do the job
                return this.lineIntersectionXY(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, result);
            }
            Collision.lineIntersection = lineIntersection;
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
            function lineIntersectionXY(x0, y0, x1, y1, x2, y2, x3, y3, result) {
                // This function operates based on standard form equation of a line, which is:
                //   Ax + By = C; where A, B and C are integers and A is positive
                //
                // This basically decomposes the point-slope (the m in 'y = mx + b') into the terms that apply to
                // both the X and Y values separately; in particular: A = y2 - y1 B = x1 - x2 C = calculated as
                // Ax + By like the equation says, by inserting a point into the line  Note that the order of x1
                // and x2 is reversed in the equation for B; this is due to algebraic manipulation and
                // corresponds to the "mx" term of the point-slope form shifting to the left side of the equality
                // sign to convert the equation to 'y - mx = b'.  The function operates over four points, and
                // works by taking a system of two identical equations and solving them as one; doing this
                // determines the one point that satisfies both equations, which is the point at which those
                // lines intersect.  The algebra for that is outside the scope of these comments, but suffice it
                // to say that given the two equations (where here the 1 and 2 indicate the first and second
                // lines, respectively): A1X + B1Y = C1 A2X + B2Y = C2  The system can be worked out to the
                // following two equations, isolating the terms for X and for Y:  X = ((C1 * B2) - (C2 * B1)) /
                // ((A1 * B2) - (A2 * B1)) y = ((C2 * A1) - (C1 * A2)) / ((B2 * A1) - (B1 * A2))  Note that the
                // denominator for both calculations is identical (although here the terms are represented in a
                // slightly different order, A * B == B * A), so we only need to calculate that value once.
                if (result === void 0) { result = null; }
                // First, calculate the parts of the first line, which uses points 0 and 1
                var A1 = y1 - y0, B1 = x0 - x1, C1 = (A1 * x0) + (B1 * y0), 
                // Now the parts for the second line, which uses points 2 and 3
                A2 = y3 - y2, B2 = x2 - x3, C2 = (A2 * x2) + (B2 * y2), 
                // The denominator of both sides of the equation.
                denominator = (A1 * B2) - (A2 * B1), 
                // the X intersection,
                xIntersect = ((C1 * B2) - (C2 * B1)) / denominator, 
                // the Y intersection,
                yIntersect = ((C2 * A1) - (C1 * A2)) / denominator;
                // If either the X or Y value is not a finite number (NaN or Infinity), then the lines don't
                // intersect. In that case, return null; If interested, you could calculate the Y intercept
                // (b = y - mx) of both lines; if they are the same, the lines are collinear, otherwise they are
                // merely parallel.
                if (isFinite(xIntersect) == false || isFinite(yIntersect) == false)
                    return null;
                // Set up the point with the values; create one if we don't already have one.
                if (result == null)
                    return new game.Point(xIntersect, yIntersect);
                else {
                    result.setToXY(xIntersect, yIntersect);
                    return result;
                }
            }
            Collision.lineIntersectionXY = lineIntersectionXY;
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
            function segmentIntersection(p0, p1, p2, p3, result) {
                if (result === void 0) { result = null; }
                // Use the other function to do the job
                return this.segmentIntersectionXY(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, result);
            }
            Collision.segmentIntersection = segmentIntersection;
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
            function segmentIntersectionXY(x0, y0, x1, y1, x2, y2, x3, y3, result) {
                if (result === void 0) { result = null; }
                // Use the other method to determine if the intersection exists at all; if it does not, we can
                // return null right now.
                var retVal = this.lineIntersectionXY(x0, y0, x1, y1, x2, y2, x3, y3, result);
                if (retVal == null)
                    return null;
                // There is an intersection point; in order to ensure that the intersection is actually on one of
                // the segments as defined, we further check to ensure that the point of intersection falls within
                // the bounding rectangles of both lines.
                if (this.pointInRect(retVal.x, retVal.y, x0, y0, x1 - x0, y1 - y0) &&
                    this.pointInRect(retVal.x, retVal.y, x2, y2, x3 - x2, y3 - y2))
                    return retVal;
                // No intersection
                return null;
            }
            Collision.segmentIntersectionXY = segmentIntersectionXY;
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
            function segmentRectangleIntersection(p0, p1, rectPos, rectW, rectH, result) {
                if (result === void 0) { result = null; }
                // Use the other method to do the hard work
                return this.segmentRectangleIntersectionXY(p0.x, p0.y, p1.x, p1.y, rectPos.x, rectPos.y, rectW, rectH, result);
            }
            Collision.segmentRectangleIntersection = segmentRectangleIntersection;
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
            function segmentRectangleIntersectionXY(x0, y0, x1, y1, rectX, rectY, rectW, rectH, result) {
                if (result === void 0) { result = null; }
                // As a first test of collision, treat the line as a rectangular bounding volume and see if it
                // intersects with the rectangle. If it doesn't, then we can stop right now; it's only possible
                // for the line to intersect if the bounds overlap.
                if (this.rectInRect(x0, y0, x1 - x0, y1 - y0, rectX, rectY, rectW, rectH) == false)
                    return null;
                // Now we know that there is at least some possibility of collision between the line segment and the
                // rectangle; In order to determine if there ACTUALLY is (and if so, where), we decompose the
                // rectangle to be 4 line segments, and test each of them for collision. There can be anywhere
                // from 0 to two of them.
                var collisions = [];
                var intersect = new game.Point(0, 0);
                // First, test the top of the rectangle.
                if (this.segmentIntersectionXY(x0, y0, x1, y1, rectX, rectY, rectX + rectW, rectY, intersect) != null)
                    collisions.push(intersect.copy());
                // Next, the bottom.
                if (this.segmentIntersectionXY(x0, y0, x1, y1, rectX, rectY + rectH, rectX + rectW, rectY + rectH, intersect) != null)
                    collisions.push(intersect.copy());
                // Now the left side.
                if (this.segmentIntersectionXY(x0, y0, x1, y1, rectX, rectY, rectX, rectY + rectH, intersect) != null)
                    collisions.push(intersect.copy());
                // Finally the right side
                if (this.segmentIntersectionXY(x0, y0, x1, y1, rectX + rectW, rectY, rectX + rectW, rectY + rectH, intersect) != null)
                    collisions.push(intersect.copy());
                // If there are no collisions at this point, return null to indicate that.
                if (collisions.length == 0)
                    return null;
                // We know that there is going to be a returned value, so make sure that result is a point
                // object.
                if (result == null)
                    result = new game.Point(0, 0);
                // If there is a single collision value, that is what we will return.
                if (collisions.length == 1)
                    result.setTo(collisions[0]);
                else {
                    // Here there are two collision objects. In that case, we need to select which one of them is the
                    // first collision. To do this, we take advantage of knowing that the two collisions form a line
                    // that is collinear with the line segment we were given.
                    //
                    // We treat both the original line segment as well as the two collision points as vectors, and
                    // test to see if the direction between collision 0 and 1 is the same as the direction of the
                    // line. The only possibilities are that it is the same direction or that it is the opposite
                    // direction.
                    //
                    // We know from vector math that to reverse a vector you flip the sign of both offsets.
                    // Thus here we test to see if the sign of both offsets is the same or not; if it is,
                    // they're in the same direction and the first collision is the one we want; otherwise
                    // it's the second one.
                    if (Math.sign(x1 - x0) == Math.sign(collisions[1].x - collisions[0].x) &&
                        Math.sign(y1 - y0) == Math.sign(collisions[1].y - collisions[0].y))
                        result.setTo(collisions[0]);
                    else
                        result.setTo(collisions[1]);
                }
                // Return it now.
                return result;
            }
            Collision.segmentRectangleIntersectionXY = segmentRectangleIntersectionXY;
        })(Collision = game.Collision || (game.Collision = {}));
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
                    // Invoke the render method for all of the actors registered. The render method gets the
                    // current position attribute and must take the origin into account on its own.
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
             * @returns {boolean} true if the mouse event was handled, false otherwise
             * @see Stage.calculateMousePos
             */
            Scene.prototype.inputMouseMove = function (eventObj) {
                return false;
            };
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
            Scene.prototype.inputMouseClick = function (eventObj) {
                return false;
            };
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
            Scene.prototype.inputMouseDown = function (eventObj) {
                return false;
            };
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
            Scene.prototype.inputMouseUp = function (eventObj) {
                return false;
            };
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
            Scene.prototype.inputMouseDblClick = function (eventObj) {
                return false;
            };
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
            Scene.prototype.inputMouseWheel = function (eventObj) {
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
        }());
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
             * The end of the line should have an arrowhead.
             */
            ArrowType[ArrowType["END"] = 1] = "END";
            /**
             * The start of the line should have an arrowhead.
             */
            ArrowType[ArrowType["START"] = 2] = "START";
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
            CanvasRenderer.prototype.blit = function (bitmap, x, y) {
                this._canvasContext.drawImage(bitmap, x, y);
            };
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
            CanvasRenderer.prototype.blitCentered = function (bitmap, x, y) {
                this.translateAndRotate(x, y);
                this._canvasContext.drawImage(bitmap, -(bitmap.width / 2), -(bitmap.height / 2));
                this._canvasContext.restore();
            };
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
            CanvasRenderer.prototype.blitCenteredRotated = function (bitmap, x, y, angle) {
                this.translateAndRotate(x, y, angle);
                this._canvasContext.drawImage(bitmap, -(bitmap.width / 2), -(bitmap.height / 2));
                this._canvasContext.restore();
            };
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
            CanvasRenderer.prototype.blitPart = function (bitmap, x, y, offsX, offsY, width, height) {
                this._canvasContext.drawImage(bitmap, offsX, offsY, width, height, x, y, width, height);
            };
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
            CanvasRenderer.prototype.blitPartCentered = function (bitmap, x, y, offsX, offsY, width, height) {
                this.translateAndRotate(x, y);
                this._canvasContext.drawImage(bitmap, offsX, offsY, width, height, -(width / 2), -(height / 2), width, height);
                this._canvasContext.restore();
            };
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
            CanvasRenderer.prototype.blitPartCenteredRotated = function (bitmap, x, y, angle, offsX, offsY, width, height) {
                this.translateAndRotate(x, y, angle);
                this._canvasContext.drawImage(bitmap, offsX, offsY, width, height, -(width / 2), -(height / 2), width, height);
                this._canvasContext.restore();
            };
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
            CanvasRenderer.prototype.blitSprite = function (sheet, sprite, x, y) {
                sheet.blit(sprite, x, y, this);
            };
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
            CanvasRenderer.prototype.blitSpriteCentered = function (sheet, sprite, x, y) {
                sheet.blitCentered(sprite, x, y, this);
            };
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
            CanvasRenderer.prototype.blitSpriteCenteredRotated = function (sheet, sprite, x, y, angle) {
                sheet.blitCenteredRotated(sprite, x, y, angle, this);
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
        }());
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
         * When the engine is running, this is the frames per second that was requested of the run() method.
         * This can be queried at run time to determine how many ticks per second the update() method will be
         * called.
         *
         * @type {number}
         * @private
         */
        var _ticksPerSec = 0;
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
                 * Handle for mouse down events. This gets triggered whenever the game is running and a mouse
                 * button is actively being held down
                 *
                 * @param evt the event object for this event.
                 */
                this.mouseDownEvent = function (evt) {
                    if (_this._sceneManager.currentScene.inputMouseDown(evt))
                        evt.preventDefault();
                };
                /**
                 * Handle for mouse up events. This gets triggered whenever the game is running and a mouse
                 * button is released
                 *
                 * @param evt the event object for this event.
                 */
                this.mouseUpEvent = function (evt) {
                    if (_this._sceneManager.currentScene.inputMouseUp(evt))
                        evt.preventDefault();
                };
                /**
                 * Handler for mouse click events. This gets triggered whenever the game is running and the mouse
                 * is clicked over the canvas.
                 *
                 * @param evt the event object for this event
                 */
                this.mouseClickEvent = function (evt) {
                    if (_this._sceneManager.currentScene.inputMouseClick(evt))
                        evt.preventDefault();
                };
                /**
                 * Handler for mouse double click events. This gets triggered whenever the game is running and the
                 * mouse is double clicked over the canvas.
                 *
                 * @param evt the event object for this event
                 */
                this.mouseDblClickEvent = function (evt) {
                    if (_this._sceneManager.currentScene.inputMouseDblClick(evt))
                        evt.preventDefault();
                };
                /**
                 * Handler for mouse wheel events. This gets triggered whenever the game is running and the mouse
                 * wheel is scrolled over the canvas.
                 *
                 * @param evt the event object for this event.
                 */
                this.mouseWheelEvent = function (evt) {
                    if (_this._sceneManager.currentScene.inputMouseWheel(evt))
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
                    canvas.addEventListener('mousedown', _this.mouseDownEvent);
                    canvas.addEventListener('click', _this.mouseClickEvent);
                    canvas.addEventListener('dblclick', _this.mouseDblClickEvent);
                    canvas.addEventListener('wheel', _this.mouseWheelEvent);
                    // This one has to be on the document, or else pressing the mouse and moving outside of the
                    // canvas and letting go of the button will not be captured.
                    document.addEventListener('mouseup', _this.mouseUpEvent);
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
                    canvas.addEventListener('mousedown', _this.mouseDownEvent);
                    canvas.removeEventListener('click', _this.mouseClickEvent);
                    canvas.removeEventListener('dblclick', _this.mouseDblClickEvent);
                    canvas.removeEventListener('wheel', _this.mouseWheelEvent);
                    document.addEventListener('mouseup', _this.mouseUpEvent);
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
            Object.defineProperty(Stage.prototype, "tickSpeed", {
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
                get: function () { return _ticksPerSec; },
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
                    // Save the number of frames per second requested.
                    _ticksPerSec = fps;
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
                    game.Preloader.commence(startSceneLoop, this);
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
                // Reset the ticks per second; it's not valid any longer.
                _ticksPerSec = 0;
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
            Stage.prototype.preloadImage = function (filename, callback) {
                if (callback === void 0) { callback = null; }
                return game.Preloader.addImage(filename, callback);
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
            Stage.prototype.preloadSound = function (filename, callback) {
                if (callback === void 0) { callback = null; }
                return this.addSound(game.Preloader.addSound(filename, callback));
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
            Stage.prototype.preloadMusic = function (filename, callback) {
                if (callback === void 0) { callback = null; }
                return this.addSound(game.Preloader.addMusic(filename, callback));
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
             * This only mutes known sound objects which are not flagged as being music so that the mute state of
             * music and sound can be toggled independently.
             *
             * The mute state of all such sounds is set to the state passed in.
             *
             * @param mute true to mute all sounds or false to un-mute all sounds
             */
            Stage.prototype.muteSounds = function (mute) {
                for (var i = 0; i < this._knownSounds.length; i++) {
                    if (this._knownSounds[i].isMusic == false)
                        this._knownSounds[i].muted = mute;
                }
            };
            /**
             * Iterate all of the sounds known to the stage and change their volume
             *
             * This only changes the volume of sounds which are not flagged as being music so that the volume
             * of music and sound can be changed independently.
             *
             * @param volume the new volume level for all sounds (0.0 to 1.0)
             */
            Stage.prototype.soundVolume = function (volume) {
                for (var i = 0; i < this._knownSounds.length; i++) {
                    if (this._knownSounds[i].isMusic == false)
                        this._knownSounds[i].volume = volume;
                }
            };
            /**
             * Iterate all of the music known to the stage and toggle their mute stage.
             *
             * This only mutes known sound objects which are flagged as being music so that the mute state of
             * music and sound an be toggled independently.
             *
             * @param mute true to mute all music or false to un-mute all music
             */
            Stage.prototype.muteMusic = function (mute) {
                for (var i = 0; i < this._knownSounds.length; i++) {
                    if (this._knownSounds[i].isMusic == true)
                        this._knownSounds[i].muted = mute;
                }
            };
            /**
             * Iterate all of the music known to the stage and change their volume.
             *
             * This only changes the volume of sounds which are flagged as being music so that the volume of
             * music and sound can be changed independently.
             *
             * @param volume the new volume level for all sounds (0.0 to 1.0)
             */
            Stage.prototype.musicVolume = function (volume) {
                for (var i = 0; i < this._knownSounds.length; i++) {
                    if (this._knownSounds[i].isMusic == true)
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
            Stage.prototype.calculateMousePos = function (mouseEvent, point) {
                if (point === void 0) { point = null; }
                // Some math has to be done because the mouse position is relative to document, which may have
                // dimensions larger than the current viewable area of the browser window.
                //
                // As a result, we need to ensure that we take into account the position of the canvas in the
                // document AND the scroll position of the document.
                var rect = this._canvas.getBoundingClientRect();
                var root = document.documentElement;
                var mouseX = mouseEvent.clientX - rect.left - root.scrollLeft;
                var mouseY = mouseEvent.clientY - rect.top - root.scrollTop;
                // Create a new point or reuse the existing one, as desired.
                if (point == null)
                    return new game.Point(mouseX, mouseY);
                else {
                    point.setToXY(mouseX, mouseY);
                    return point;
                }
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
        }());
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
        }());
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
        }());
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
        }());
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
        }());
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
        }());
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
             * You can specify if this sound is meant to be used as music, in which case it will loop by default.
             *
             * @param audioTag the audio tag that represents the sound to be played.
             * @param isMusic true if this sound will be used to play back music
             */
            function Sound(audioTag, isMusic) {
                if (isMusic === void 0) { isMusic = false; }
                // Save the tag and type
                this._tag = audioTag;
                this._isMusic = isMusic;
                // If this is music, set us to loop by default
                if (isMusic)
                    this._tag.loop = true;
            }
            Object.defineProperty(Sound.prototype, "tag", {
                /**
                 * Obtain the underlying audio tag used for this sound object.
                 *
                 * @returns {HTMLAudioElement}
                 */
                get: function () { return this._tag; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sound.prototype, "isMusic", {
                /**
                 * Determine if this sound represents music or not.
                 *
                 * @returns {boolean}
                 */
                get: function () { return this._isMusic; },
                enumerable: true,
                configurable: true
            });
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
        }());
        game.Sound = Sound;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
