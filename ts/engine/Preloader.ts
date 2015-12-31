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
     * This interface is used to shape entries in our preload list for sounds.
     *
     * Unlike images where we coalesce all duplicate images into a single image tag, for sounds we don't
     * do this. If sounds share the same tag, then changes to the volume or loop of one instance would
     * affect all instances.
     *
     * As such, this type associates the source of a sound with the tag that wraps it so that we can store
     * the values in an array for preloading.
     */
    interface SoundPreload
    {
        /**
         * The source URL for this sound object.
         */
        src : string;

        /**
         * The tag element that will be preloaded.
         */
        tag : HTMLAudioElement;
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
     * @type {Array<SoundPreload>}
     * @private
     */
    var _soundPreloadList : Array<SoundPreload> = [];

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
    function preloadCallbackEvent (eventObj : Event) : void
    {
        // Get the element that is the target of the event. This requires a type cast since not all events
        // are targeted to DOM elements, but we know that load/error/canplaythrough are.
        let tag : HTMLImageElement|HTMLAudioElement = (<HTMLImageElement|HTMLAudioElement>eventObj.target);

        // Determine if this is an image or not so we can act accordingly.
        let isImage = tag.tagName.toLowerCase () == "img";

        // Set up an error event object if this is an error event.
        let errorEvent : ErrorEvent = (eventObj.type == "error") ? <ErrorEvent> eventObj : null;

        // To start with, remove ourselves as the handlers for load and error events.
        tag.removeEventListener ("load", preloadCallbackEvent, false);
        tag.removeEventListener ("error", preloadCallbackEvent, false);

        // Special handling if this is an error.
        if (errorEvent != null)
        {
            // Note the error in the console.
            console.log ("Preload error:", (isImage ? "image" : "sound"), tag.src);

            // Depending on the tag type, use a data URL to approximate the missing data.
            if (isImage)
                tag.src = MISSING_IMAGE;
            else
            {
                if (_audioExtension == ".mp3")
                    tag.src = MISSING_MP3;
                else
                    tag.src = MISSING_OGG;

                // For audio we want to make sure it doesn't loop.
                (<HTMLAudioElement> tag).loop = false;
            }
        }

        // Now decrement the appropriate count.
        if (isImage)
            _imagesToLoad--;
        else
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
            // Create a new tag, indicate the function to invoke when it is fully loaded or fails to load, and
            // then add it to the preload list.
            tag = document.createElement ("img");
            tag.addEventListener ("load", preloadCallbackEvent, false);
            tag.addEventListener ("error", preloadCallbackEvent, false);
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

        // Create a sound preload object.
        let preload : SoundPreload =
        {
            src: subFolder + filename + _audioExtension,
            tag: document.createElement ("audio")
        };

        // Create a new tag, indicate the function to invoke when it is fully loaded or fails to load, and
        // then add it to the preload list.
        preload.tag.addEventListener ("canplaythrough", preloadCallbackEvent);
        preload.tag.addEventListener ("error", preloadCallbackEvent);

        // Insert it into the sound preload list and count it as a sound to be preloaded.
        _soundPreloadList.push (preload);
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
     * This works identically to addSound() except that the sound returned is set to play looped by
     * default.
     *
     * @param filename the filename of the sound to load; assumed to be relative to a sounds/ folder in
     * the same path as the page is in and to have no extension
     * @returns {Sound} the sound object that will (eventually) play the requested audio
     * @throws {Error} if an attempt is made to add a sound to preload after preloading has already started
     * @see addSound
     */
    export function addMusic (filename : string) : Sound
    {
        return new Sound (doAddSound ("music/", filename), true);
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

        // For sounds they're in an array instead of an object so that we can load duplicates.
        for (let i = 0 ; i < _soundPreloadList.length ; i++)
            _soundPreloadList[i].tag.src = _soundPreloadList[i].src;
    }

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
    const MISSING_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IArs" +
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
    const MISSING_MP3 = "data:audio/mp3;base64,SUQzBAAAAAAAGVRTU0UAAAAPAAADTGF2ZjU0LjI1LjEwNQD/83AAAAAAAAAA" +
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
    const MISSING_OGG = "data:audio/ogg;base64,T2dnUwACAAAAAAAAAABUhPp7AAAAAAFv/AUBHgF2b3JiaXMAAAAAAfBVAAAA" +
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
}
