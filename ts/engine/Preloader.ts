module nurdz.game.Preloader
{
    /**
     * The type of an image callback to invoke when all image loading is complete. The function takes no
     * arguments and returns no value.
     */
    export type ImagePreloadCallback = () => void;

    /**
     * This interface is used to shape entries in our preload list.
     */
    interface Preload
    {
        /**
         * The source that should be preloaded on the tag below. When preloading is started, this property
         * is copied to the source property of the tag below to start the load happening.
         */
        src : string;

        /**
         * The image tag that will do our actual loading. This was provided to the caller when they asked
         * for a preload to happen.
         */
        tag : HTMLImageElement;
    }

    /**
     * This tracks whether or not preloading has already started or not. Once preloading has started, we
     * don't allow any more submissions to the preload queue.
     *
     * @type {boolean}
     * @private
     */
    var _preloadStarted = false;

    /**
     * The list of items that are being preloaded.
     *
     * @type {Array<Preload>}
     * @private
     */
    var _preloadList : Array<Preload> = [];

    /**
     * The number of images that still need to be loaded before all images are considered loaded. This
     * gets incremented as preloads are added and decremented as loads are completed.
     *
     * @type {number}
     * @private
     */
    var _imagesToLoad = 0;

    /**
     * The callback to invoke when preloading has started and all images are loaded.
     */
    var _completionCallback : ImagePreloadCallback;

    /**
     * This gets invoked every time one of the images that we are preloading fully loads.
     */
    function imageLoaded ()
    {
        // TODO This doesn't report image load errors. I don't know if that matters
        // One less image needs loading.
        _imagesToLoad--;

        if (_imagesToLoad == 0)
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
    export function addImage (filename : string)
    {
        // Make sure that preloading has not started.
        if (_preloadStarted)
            throw new Error ("Cannot add images after preloading has already begun or started");

        // Count this as an image to load.
        _imagesToLoad++;

        // Create the tag that we will use to do the preload and set up the callback, and then add this as
        // an entry into the callback list along with the source. We can't set the source now because that
        // will trigger the browser into starting to load the image.
        let tag = document.createElement ("img");
        tag.onload = imageLoaded;
        _preloadList.push ({ src: "images/" + filename, tag: tag});

        // Return the tag back to the caller so that they know how to render later.
        return tag;
    }

    /**
     * Start the image preload happening.
     *
     * @throws {Error} if image preloading is already started
     */
    export function commence (callback : ImagePreloadCallback)
    {
        console.log ("Commence");
        // Make sure that image preloading is not already started
        if (_preloadStarted)
            throw new Error ("Cannot start preloading; preloading is already started");

        // Save the callback and then indicate that the preload has started.
        _completionCallback = callback;
        _preloadStarted = true;

        // If no images were requested to load, just fire the callback now and leave.
        if (_imagesToLoad == 0)
        {
            _completionCallback ();
            return;
        }

        // Iterate over the entire preload list and set in the source to get the image from. This will start
        // the browser loading things.
        for (let i = 0 ; i < _preloadList.length ; i++)
            _preloadList[i].tag.src = _preloadList[i].src;
    }
}
