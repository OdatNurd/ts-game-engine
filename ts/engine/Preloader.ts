module nurdz.game
{
    /**
     * This is a simple class whose purpose is to wrap an audio element to make it a little easier to work
     * with (and shield audio tag properties from modification).
     */
    export class Sound
    {
        /**
         * The HTML Audio tag that we use to play our sound.
         */
        protected _tag : HTMLAudioElement;

        /**
         * Construct a new sound object, telling it to wrap the provided audio tag, which it will use for
         * its playback.
         *
         * @param audioTag the audio tag that represents the sound to be played.
         */
        constructor (audioTag : HTMLAudioElement)
        {
            this._tag = audioTag;
        }

        /**
         * Determines if this sound is currently playing or not.
         *
         * @returns {boolean}
         */
        get isPlaying () : boolean
        { return this._tag.paused == false; }

        /**
         * Plays the sound. If it is already playing, it will be restarted.
         */
        play () : void
        {
            // Play the sound, but make sure that it starts at the beginning.
            this._tag.currentTime = 0;
            this._tag.play ();
        }

        /**
         * Pause playback of the sound.
         */
        pause () : void
        {
            this._tag.pause ();
        }

        /**
         * Toggle the state of the sound; if it is playing, it will be paused, otherwisse it will start
         * playing.
         *
         * When the sound restarts, it will be started at the beginning.
         *
         * This method is generally used for longer sounds that you might want to cut off (e.g. music).
         */
        toggle () : void
        {
            if (this.isPlaying)
                this.pause ();
            else
                this.play ();
        }
    }

    /**
     * This is a simple class whose purpose is to wrap an audio element that is meant to be used as music.
     * This has a slightly different API than a regular sound.
     */
    export class Music extends Sound
    {
        /**
         * Construct a new music object, telling it to wrap the provided audio tag as music, which it will
         * use for its playback.
         *
         * @param audioTag the audio tag that represents the music to play
         */
        constructor (audioTag : HTMLAudioElement)
        {
            // Invoke the super to set up, then make sure that this audio element loops when we play it.
            super (audioTag);
            this._tag.loop = true;
        }
    }
}

module nurdz.game.Preloader
{
    /**
     * The type of a callback function to invoke when all images and sound loading is complete. The
     * function takes no arguments and returns no value.
     */
    export type DataPreloadCallback = () => void;

    /**
     * This interface is used to shape entries in our preload list for images. It tells the TypeScript
     * compiler that objects of this type need to be indexed by a string and the result should be an HTML
     * image.
     */
    interface ImagePreload
    {
        [index : string] : HTMLImageElement;
    }

    /**
     * This interface is used to shape entries in our preload list for sounds. It tells the TypeScript
     * compiler that objects of this type need to be indexed by a string and that the result should be an
     * HTML audio tag.
     */
    interface SoundPreload
    {
        [index : string] : HTMLAudioElement;
    }

    /**
     * This stores the extension that should be applied to sounds loaded by the preloader so that it loads
     * a file type that is appropriate for the current browser.
     *
     * @type {string}
     * @private
     */
    var _audioExtension : string = function () : string
    {
        let tag = document.createElement ("audio");
        if (tag.canPlayType ("audio/mp3"))
            return ".mp3";
        else
            return ".ogg";
    } ();

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
    var _imagePreloadList : ImagePreload = {};

    /**
     * The list of sounds (and music, which is a special case of sound) to be preloaded.
     * @type {Object<string,HTMLAudioElement>}
     * @private
     */
    var _soundPreloadList : SoundPreload = {};

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
    var _completionCallback : DataPreloadCallback;

    /**
     * This gets invoked every time one of the images that we are preloading fully loads.
     */
    function imageLoaded ()
    {
        // TODO This doesn't report image load errors. I don't know if that matters
        // One less image needs loading.
        _imagesToLoad--;

        // If everything is loaded, trigger the completion callback now.
        if (_imagesToLoad == 0 && _soundsToLoad == 0)
            _completionCallback ();
    }

    /**
     * This gets invoked when a sound is "loaded".
     *
     * In actuality, this tells us that based on the current download rate, enough of the audio has
     * already been downloaded that if you tried to play it right now, it would be able to finish playing
     * even though it may not be fully downloaded.
     */
    function soundLoaded ()
    {
        // TODO This doesn't report load errors. I'm not even sure this ever triggers on an error.
        _soundsToLoad--;

        // If everything is loaded, trigger the completion callback now.
        if (_imagesToLoad == 0 && _soundsToLoad == 0)
            _completionCallback ();
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
    export function addImage (filename : string) : HTMLImageElement
    {
        // Make sure that preloading has not started.
        if (_preloadStarted)
            throw new Error ("Cannot add images after preloading has already begun or started");

        // Create a key that is the URL that we will be loading, and then see if there is a tag already in
        // the preload dictionary that uses that URL.
        let key = "images/" + filename;
        let tag = _imagePreloadList[key];

        // If there is not already a tag, then we need to create a new one.
        if (tag == null)
        {
            // Create a new tag, indicate the function to invoke when it is fully loaded, and then add it
            // to the preload list.
            tag = document.createElement ("img");
            tag.addEventListener ("load", imageLoaded, false);
            _imagePreloadList[key] = tag;

            // This counts as an image that we are going to preload.
            _imagesToLoad++;
        }

        // Return the tag back to the caller so that they know how to render later.
        return tag;
    }

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
    var doAddSound = function (subFolder : string, filename : string) : HTMLAudioElement
    {
        // Make sure that preloading has not started.
        if (_preloadStarted)
            throw new Error ("Cannot add sounds after preloading has already begun or started");

        // Create a key that is the URL that we will be loading, and then see if there is a tag already in
        // the preload dictionary that uses that URL.
        let key = subFolder + filename + _audioExtension;
        let tag = _soundPreloadList[key];

        // If there is not already a tag, then we need to create a new one.
        if (tag == null)
        {
            // Create a new tag, indicate the function to invoke when it is fully loaded, and then add it
            // to the preload list.
            tag = document.createElement ("audio");
            tag.addEventListener ("canplaythrough", soundLoaded);
            _soundPreloadList[key] = tag;
            // This counts as a sound that we are going to preload.
            _soundsToLoad++;
        }

        // Return the tag back to the caller so that they can play it later.
        return tag;
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
    export function addSound (filename : string) : Sound
    {
        // Use our helper to actually get the audio tag, then wrap it in a sound.
        return new Sound (doAddSound ("sounds/", filename));
    }

    /**
     * Add the music filename specified to the list of music that will be preloaded. The "filename" is
     * assumed to be in a path that is relative to the page that the game is being served from an inside
     * of a "music/" sub-folder.
     *
     * NOTE: Since different browsers support different file formats, you should provide both an MP3 and
     * an OGG version of the same file, and provide a filename that has no extension on it. The code in
     * this method will apply the correct extension based on the browser in use and load the appropriate file.
     *
     * The return value is a music object that can be used to play the music once it's loaded.
     *
     * @param filename the filename of the sound to load; assumed to be relative to a sounds/ folder in
     * the same path as the page is in and to have no extension
     * @returns {Sound} the sound object that will (eventually) play the requested audio
     * @throws {Error} if an attempt is made to add a sound to preload after preloading has already started
     * @see addSound
     */
    export function addMusic (filename : string) : Music
    {
        return new Music (doAddSound ("music/", filename));
    }

    /**
     * Start the image preload happening.
     *
     * @throws {Error} if image preloading is already started
     */
    export function commence (callback : DataPreloadCallback)
    {
        // Make sure that image preloading is not already started
        if (_preloadStarted)
            throw new Error ("Cannot start preloading; preloading is already started");

        // Save the callback and then indicate that the preload has started.
        _completionCallback = callback;
        _preloadStarted = true;

        // If there is nothing to preload, fire the callback now and leave.
        if (_imagesToLoad == 0 && _soundsToLoad == 0)
        {
            _completionCallback ();
            return;
        }

        // Iterate over the entire preload list and set in the source to get the image from. This will start
        // the browser loading things.
        for (let key in _imagePreloadList)
        {
            if (_imagePreloadList.hasOwnProperty (key))
                _imagePreloadList[key].src = key;
        }

        for (let key in _soundPreloadList)
        {
            if (_soundPreloadList.hasOwnProperty (key))
                _soundPreloadList[key].src = key;
        }
    }
}
