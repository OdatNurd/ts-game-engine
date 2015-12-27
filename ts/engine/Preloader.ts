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
        // This describes that to index this object you must provide a string, and that the value that
        // results is an HTML image.
        [index : string] : HTMLImageElement;
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
    var _preloadList : Preload = {};

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

        // Create a key that is the U
        // RL that we will be loading, and then see if there is a tag already in
        // the preload dictionary that uses that URL.
        let key = "images/" + filename;
        let tag = _preloadList[key];

        // If there is not already a tag, then we need to create a new one.
        if (tag == null)
        {
            // Create a new tag, indicate the function to invoke when it is fully loaded, and then add it
            // to the preload list.
            tag = document.createElement ("img");
            tag.onload = imageLoaded;
            _preloadList[key] = tag;

            // This counts as an image that we are going to preload.
            _imagesToLoad++;
        }

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
        for (var key in _preloadList)
        {
            if (_preloadList.hasOwnProperty(key))
                _preloadList[key].src = key;
        }
    }
}
