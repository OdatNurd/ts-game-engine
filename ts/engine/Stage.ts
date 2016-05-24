module nurdz.game
{
    /**
     * The FPS that the engine is currently running at. This is recalculated once per second so that
     * slow update times don't get averaged out over a longer run, which makes the number less useful.
     *
     * @type {number}
     */
    var _fps : number = 0;

    /**
     * When calculating FPS, this is the time that the most recent frame count started. Once we have
     * counted frames for an entire second, this is reset and the count starts again.
     *
     * @type {number}
     */
    var _startTime : number = 0;

    /**
     * When calculating FPS, this is the number of frames that we have seen over the last second. When
     * the startTime gets reset, so does this. This makes sure that spontaneous frame speed changes
     * (e.g. a scene bogging down) don't get averaged away.
     *
     * @type {number}
     */
    var _frameNumber : number = 0;

    /**
     * When the engine is running, this is the timer ID of the system timer that keeps the game loop
     * running. Otherwise, this is null.
     *
     * @type {number|null}
     */
    var _gameTimerID : number = null;

    /**
     * When the engine is running, this is the frames per second that was requested of the run() method.
     * This can be queried at run time to determine how many ticks per second the update() method will be
     * called.
     *
     * @type {number}
     * @private
     */
    var _ticksPerSec : number = 0;

    /**
     * The number of update ticks that have occurred so far. This gets incremented every time the game
     * loop executes.
     *
     * @type {number}
     */
    var _updateTicks : number = 0;

    /**
     * Every time a screenshot is generated, this value is used in the filename. It is then incremented.
     *
     * @type {number}
     */
    var _ss_number : number = 0;

    /**
     * This template is used to determine the number at the end of a screenshot filename. The end
     * characters are replaced with the current number of the screenshot. This implicitly specifies
     * how many screenshots can be taken in the same session without the filename overflowing.
     *
     * @type {string}
     */
    var _ss_format : string = "0000";

    /**
     * This class represents the stage area in the page, which is where the game renders itself.
     *
     * The class knows how to create the stage and do some rendering. This is also where the core
     * rendering loop is contained.
     */
    export class Stage
    {
        /**
         * This string is used as the default screenshot filename base in the screenshot method if none is
         * specified.
         *
         * @see screenshot
         * @type {string}
         */
        static screenshotFilenameBase = "screenshot";

        /**
         * This string is used as the default window title for the screenshot window/tab if none is specified.
         *
         * @see screenshot
         * @type {string}
         */
        static screenshotWindowTitle = "Screenshot";

        /**
         * The canvas that the stage renders itself to.
         *
         * @type {HTMLCanvasElement}
         */
        private _canvas : HTMLCanvasElement;

        /**
         * The element that contains the canvas element; this is used to control the position of the
         * canvas in the page.
         *
         * @type {HTMLElement}
         */
        private _container: HTMLElement;

        /**
         * Controls whether the stage automatically scales itself to fill the
         * window or not.
         *
         * When this is false, the stage is of a specific size, and although it
         * will keep itself centered in the page, it will remain that size.
         *
         * When this is true, the canvas will expand itself to try and fill
         * the entire page body (less the header and footer) while maintaining
         * aspect.
         *
         * @type {Boolean}
         */
        private _canScale: Boolean;

        /**
         * The object responsible for rendering to our canvas.
         *
         * This is a simple wrapper around the canvas context and is the gateway to Rendering Magic (tm).
         *
         * @type {CanvasRenderingContext2D}
         */
        private _renderer : Renderer;

        /**
         * The object that manages our list of scenes for us.
         *
         * @type {SceneManager}
         */
        private _sceneManager : SceneManager;

        /**
         * This is false when we have never told the preloader to preload, and true if we have. This is
         * used to guard against repeated attempts to preload.
         *
         * @type {boolean}
         */
        private _didPreload : boolean;

        /**
         * A list of all sound objects that are known to the stage, either because we were the proxy for
         * preloading them or because they were registered with us.
         *
         * This is the list of sounds that our API functions for sound can affect
         */
        private _knownSounds : Array<Sound>;

        /**
         * The width of the stage, in pixels. This is set at creation time and cannot change.
         *
         * @type {number} the width of the stage area in pixels
         */
        get width () : number
        { return STAGE_WIDTH; }

        /**
         * The height of the stage, in pixels. This is set at creation time and cannot change.
         *
         * @type {number} the height of the stage area in pixels
         */
        get height () : number
        { return STAGE_HEIGHT; }

        /**
         * Get the underlying canvas object for the stage.
         *
         * @returns {HTMLCanvasElement} the underlying canvas element for the stage
         */
        get canvas () : HTMLCanvasElement
        { return this._canvas; }

        /**
         * Get the underlying rendering object for the stage. This is the object responsible for all
         * rendering on the stage.
         *
         * @returns {Renderer} the underlying rendering object for the stage
         */
        get renderer () : Renderer
        { return this._renderer; }

        /**
         * The stage keeps track of the current frame rate that the update loop is being called at, and this
         * returns the most recently calculated value. The value is recalculated once per second so that
         * it is always a near instantaneous read of the current fps and not an average over the life of
         * the game.
         *
         * @returns {Number} the current fps, which is o when the game is stopped orr just started
         */
        get fps () : number
        { return _fps; }

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
        get tickSpeed () : number
        { return _ticksPerSec; }

        /**
         * Determine what scene is the current scene on this stage.
         *
         * @returns {Scene}
         */
        get currentScene () : Scene
        {
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
        }

        /**
         * Obtain the current engine update tick. This is incremented once every time the frame update loop is
         * invoked, and can be used to time things in a crude fashion.
         *
         * The frame update loop is invoked at a set frame rate.
         *
         * @returns {number}
         */
        get tick () : number
        { return _updateTicks; }

        /**
         * Create the stage on which all rendering for the game will be done.
         *
         * A canvas will be created and inserted into the DOM as the last child of the container DIV with the
         * ID provided.
         *
         * The style of the div will be modified so that the canvas is properly contained and positioned in
         * the page.
         *
         * @param containerDivID the ID of the DIV that should contain the created canvas
         * @param initialColor the color to clear the canvas to once it is created
         * @param surroundColor the color to set the page area that surrounds the canvas or null to leave the
         * page as is
         *
         * @constructor
         *
         * @throws {ReferenceError} if there is no element with the ID provided
         */
        constructor (containerDivID : string, initialColor : string = 'black', canScale : boolean = true, surroundColor : string = null)
        {
            // We don't start off having done a preload.
            this._didPreload = false;

            // Set up the list of sounds.
            this._knownSounds = [];

            // Set up our scene manager object.
            this._sceneManager = new SceneManager (this);

            // Save the scale setting we were given.
            this._canScale = canScale;

            // Obtain the container element that we want to insert the canvas into.
            this._container = document.getElementById (containerDivID);
            if (this._container == null)
                throw new ReferenceError ("Unable to create stage: No such element with ID '" + containerDivID + "'");

            // Create the canvas and give it the appropriate dimensions. The dimensions set here are the ones
            // that determine the size of the rendering area of the canvas.
            this._canvas = document.createElement ("canvas");
            this._canvas.width = STAGE_WIDTH;
            this._canvas.height = STAGE_HEIGHT;

            // Create our rendering object to wrap this canvas, and then use the given color to clear the
            // stage. We also set the background color of the page if requested.
            this._renderer = new CanvasRenderer (this._canvas);
            this._renderer.clear (initialColor);
            if (surroundColor)
                document.body.style.backgroundColor = surroundColor;

            // Append the canvas to the container; this makes it visible.
            this._container.appendChild (this._canvas);

            // Add in event listeners that will check to determine when the window size changes for any reason
            // or when the orientation changes (mobile devices), and invoke a handler that will scale and
            // reposition the canvas in the containing page as needed.
            //
            // This event handler gets set here because it should always be active, even if the game is not
            // run ing.
            //
            // Once that's done, invoke the handler manually to set the initial size and position of the
            // canvas.
            window.addEventListener('resize', this.changeCanvasScale, false);
            window.addEventListener('orientationchange', this.changeCanvasScale, false);
            this.changeCanvasScale();

            // Set the global stage object to be us, for debugging or other nefarious purposes.
            nurdz.stage = this;
        }

        /**
         * This function gets executed in a loop to run the game. Each execution will cause an update and
         * render to be issued to the current scene.
         *
         * In practice, this gets invoked on a timer at the desired FPS that the game should run at.
         */
        private sceneLoop = () : void =>
        {
            // Get the current time for this frame and the elapsed time since we started.
            var currentTime = new Date ().getTime ();
            var elapsedTime = (currentTime - _startTime) / 1000;

            // This counts as a frame.
            _frameNumber++;

            // Calculate the FPS now. We floor this here because if FPS is for displaying on the screen
            // you probably don't need a billion digits of precision.
            _fps = Math.round (_frameNumber / elapsedTime);

            // If a second or more has elapsed, reset the count. We don't want an average over time, we want
            // the most recent numbers so that we can see momentary drops.
            if (elapsedTime > 1)
            {
                _startTime = new Date ().getTime ();
                _frameNumber = 0;
            }

            try
            {
                // Before we start the frame update, make sure that the current scene is correct, in case
                // anyone asked for an update to occur.
                this._sceneManager.checkSceneSwitch ();

                // Do the frame update now
                this._sceneManager.currentScene.update (_updateTicks++);
                this._sceneManager.currentScene.render ();
            }
            catch (error)
            {
                console.log ("Caught exception in sceneLoop(), stopping the game");
                clearInterval (_gameTimerID);
                _gameTimerID = null;
                throw error;
            }
        };

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
        run (fps : number = 30) : void
        {
            if (_gameTimerID != null)
                throw new Error ("Attempt to start the game running when it is already running");

            // When invoked, this starts the scene loop. We use the lambda syntax to capture the
            // appropriate this pointer so that everything works the way we want it to.
            var startSceneLoop = () =>
            {
                this._didPreload = true;

                // Reset the variables we use for frame counts.
                _startTime = 0;
                _frameNumber = 0;

                // Save the number of frames per second requested.
                _ticksPerSec = fps;

                // Fire off a timer to invoke our scene loop using an appropriate interval.
                _gameTimerID = setInterval (this.sceneLoop, 1000 / fps);

                // Turn on input events.
                this.enableInputEvents (this._canvas);
            };

            // If we already did a preload, just start the frame loop now. Otherwise, start the preload
            // and the preloader will start it once its done.
            //
            // When we pass the function to the preloader we need to set the implicit this using bind.
            if (this._didPreload)
                startSceneLoop ();
            else
                Preloader.commence (startSceneLoop, this);
        }

        /**
         * Stop a running game. This halts the update loop but otherwise has no effect. Thus after this call,
         * the game just stops where it was.
         *
         * It is legal to start the game running again via another call to run(), so long as your scenes are
         * not time sensitive.
         *
         * @see Stage.run
         */
        stop () : void
        {
            // Make sure the game is running.
            if (_gameTimerID == null)
                throw new Error ("Attempt to stop the game when it is not running");

            // Stop it.
            clearInterval (_gameTimerID);
            _gameTimerID = null;

            // Reset the ticks per second; it's not valid any longer.
            _ticksPerSec = 0;

            // Turn off input events.
            this.disableInputEvents (this._canvas);
        }

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
        preloadImage (filename : string, callback : Preloader.ImagePreloadCallback = null) : HTMLImageElement
        {
            return Preloader.addImage (filename, callback);
        }

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
        preloadSound (filename : string, callback : Preloader.SoundPreloadCallback = null) : Sound
        {
            return this.addSound (Preloader.addSound (filename, callback));
        }

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
        preloadMusic (filename : string, callback : Preloader.SoundPreloadCallback = null) : Sound
        {
            return this.addSound (Preloader.addMusic (filename, callback));
        }

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
        addSound (sound : Sound) : Sound
        {
            this._knownSounds.push (sound);
            return sound;
        }

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
        muteSounds (mute : boolean) : void
        {
            for (let i = 0 ; i < this._knownSounds.length ; i++)
            {
                if (this._knownSounds[i].isMusic == false)
                    this._knownSounds[i].muted = mute;
            }
        }

        /**
         * Iterate all of the sounds known to the stage and change their volume
         *
         * This only changes the volume of sounds which are not flagged as being music so that the volume
         * of music and sound can be changed independently.
         *
         * @param volume the new volume level for all sounds (0.0 to 1.0)
         */
        soundVolume (volume : number) : void
        {
            for (let i = 0 ; i < this._knownSounds.length ; i++)
            {
                if (this._knownSounds[i].isMusic == false)
                    this._knownSounds[i].volume = volume;
            }
        }

        /**
         * Iterate all of the music known to the stage and toggle their mute stage.
         *
         * This only mutes known sound objects which are flagged as being music so that the mute state of
         * music and sound an be toggled independently.
         *
         * @param mute true to mute all music or false to un-mute all music
         */
        muteMusic (mute : boolean) : void
        {
            for (let i = 0 ; i < this._knownSounds.length ; i++)
            {
                if (this._knownSounds[i].isMusic == true)
                    this._knownSounds[i].muted = mute;
            }
        }

        /**
         * Iterate all of the music known to the stage and change their volume.
         *
         * This only changes the volume of sounds which are flagged as being music so that the volume of
         * music and sound can be changed independently.
         *
         * @param volume the new volume level for all sounds (0.0 to 1.0)
         */
        musicVolume (volume : number) : void
        {
            for (let i = 0 ; i < this._knownSounds.length ; i++)
            {
                if (this._knownSounds[i].isMusic == true)
                    this._knownSounds[i].volume = volume;
            }
        }

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
        addScene (name : string, newScene : Scene = null) : void
        {
            this._sceneManager.addScene (name, newScene);
        }

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
        switchToScene (sceneName : string = null) : void
        {
            // Indicate that we want to switch to the scene provided.
            //
            // This tells the scene manager that the next time we call checkSceneSwitch() we want this to
            // be the active scene. That happens in the game loop, to make sure that it doesn't happen
            // mid-loop.
            this._sceneManager.switchToScene (sceneName);
        }

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
        screenshot (filename : string = Stage.screenshotFilenameBase,
                    windowTitle : string = Stage.screenshotWindowTitle) : void
        {
            // Create a window to hold the screen shot.
            var wind = window.open ("about:blank", "screenshot");

            // Create a special data URI which the browser will interpret as an image to display.
            var imageURL = this._canvas.toDataURL ();

            // Append the screenshot number to the window title and also to the filename for the generated
            // image, then advance the screenshot counter for the next image.
            filename += ((_ss_format + _ss_number).slice (-_ss_format.length)) + ".png";
            windowTitle += " " + _ss_number;
            _ss_number++;

            // Now we need to write some HTML into the new document. The image tag using our data URL will
            // cause the browser to display the image. Wrapping it in the anchor tag with the same URL and a
            // download attribute is a hint to the browser that when the image is clicked, it should download
            // it using the name provided.
            //
            // This might not work in all browsers, in which case clicking the link just displays the image.
            // You can always save via a right click.
            wind.document.write ("<head><title>" + windowTitle + "</title></head>");
            wind.document.write ('<a href="' + imageURL + '" download="' + filename + '">');
            wind.document.write ('<img src="' + imageURL + '" title="' + windowTitle + '"/>');
            wind.document.write ('</a>');
        }

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
        calculateMousePos (mouseEvent : MouseEvent, point : Point = null) : Point
        {
            // Some math has to be done because the mouse position is relative to document, which may have
            // dimensions larger than the current viewable area of the browser window.
            //
            // As a result, we need to ensure that we take into account the position of the canvas in the
            // document AND the scroll position of the document.
            let rect = this._canvas.getBoundingClientRect ();
            let root = document.documentElement;
            let mouseX = mouseEvent.clientX - rect.left - root.scrollLeft;
            let mouseY = mouseEvent.clientY - rect.top - root.scrollTop;

            // Since the canvas bounds are not the same as the canvas rendering area, we need to adjust the
            // coordinates that we ended up with by our scale factor in both dimensions to put things back
            // into the proper scale.
            mouseX = Math.floor (mouseX / (rect.width / STAGE_WIDTH));
            mouseY = Math.floor (mouseY / (rect.height / STAGE_HEIGHT));

            // Create a new point or reuse the existing one, as desired.
            if (point == null)
                return new Point (mouseX, mouseY);
            else
            {
                point.setToXY (mouseX, mouseY);
                return point;
            }
        }

        /**
         * Recalculate the size of the current window and the scale factor that should be applied to the
         * canvas and its container so that the canvas is maximized inside the client area of the containing
         * page.
         *
         * This requires that the canvas and its container already exist, and that the canvas is a child of
         * the container. Various styles are also required on the container.
         */
        private changeCanvasScale = (): void =>
        {
            // Obtain the viewable size of the window our document is being displayed in.
            let windowWidth = document.documentElement.clientWidth;
            let windowHeight = document.documentElement.clientHeight;

            // Now get the top and bottom margins for the document body. These tell us how much of the space
            // at the top and the bottom of the window are taken up by page navigation.
            //
            // As far as I can tell, when computing the style the units used are always pixels, even if the
            // CSS specifies the margins in another format like em.
            let bodyStyle = window.getComputedStyle(document.body, null);
            let marginTop = parseInt(bodyStyle.getPropertyValue("margin-top"));
            let marginBottom = parseInt(bodyStyle.getPropertyValue("margin-bottom"));

            // Modify the height of thw window by the margins given; this tells us the usable window size.
            windowHeight -= marginTop + marginBottom;

            // Calculate the aspect ratio of the canvas object and of the current window.
            let canvasAspect = this._canvas.width / this._canvas.height;
            let windowAspect = windowWidth / windowHeight;

            // These will store the new canvas size; they default to the usable size of the window if we
            // are allowed to scale the canvas to the window, or just the stage size otherwise.
            let newWidth = this._canScale ? windowWidth : STAGE_WIDTH;
            let newHeight = this._canScale ? windowHeight : STAGE_HEIGHT;

            // If we have scaling turned on, check to see if we need to change the canvas size. In theory this
            // will the canvas untouched if scaling is turned off because the canvas aspect is changed
            // relative to itself. However, small rounding errors can make things look a little hinky, so it's
            // visually more pleasing to just not noodle the numbers.
            if (this._canScale)
            {
                if (windowAspect > canvasAspect)
                    // The window is too wide relative to the aspect ratio of our canvas, so modify the width to
                    // be correctly sized based on the height we got.
                    newWidth = newHeight * canvasAspect;
                else
                    // THe window height is too tall relative to the aspect ratio of our canvas, so modify the
                    // height of the canvas relative to the width.
                    newHeight = newWidth / canvasAspect;
            }

            // Modify the style of the container div to make it center horizontally and vertically.
            this._container.style.width = newWidth + "px";
            this._container.style.height = newHeight + "px";
            this._container.style.marginLeft = (-newWidth / 2) + "px";
            this._container.style.marginTop = (-newHeight / 2) + "px";

            // Now we can use the new width and height to set the CSS style for our canvas. This changes its
            // size on the page, which might alter the scale factor that things draw at if it doesn't
            // match the rendering size.
            this._canvas.style.width = newWidth + "px";
            this._canvas.style.height = newHeight + "px";
        };

        /**
         * Handler for key down events. This gets triggered whenever the game is running and any key is
         * pressed.
         *
         * @param evt the event object for this event
         */
        private keyDownEvent = (evt : KeyboardEvent) : void =>
        {
            if (this._sceneManager.currentScene.inputKeyDown (evt))
                evt.preventDefault ();
        };

        /**
         * Handler for key up events. This gets triggered whenever the game is running and any key is
         * released.
         *
         * @param evt the event object for this event
         */
        private keyUpEvent = (evt : KeyboardEvent) : void =>
        {
            if (this._sceneManager.currentScene.inputKeyUp (evt))
                evt.preventDefault ();
        };

        /**
         * Handler for mouse movement events. This gets triggered whenever the game is running and the mouse
         * moves over the stage.
         *
         * @param evt the event object for this event
         */
        private mouseMoveEvent = (evt : MouseEvent) : void =>
        {
            if (this._sceneManager.currentScene.inputMouseMove (evt))
                evt.preventDefault ();
        };

        /**
         * Handle for mouse down events. This gets triggered whenever the game is running and a mouse
         * button is actively being held down
         *
         * @param evt the event object for this event.
         */
        private mouseDownEvent = (evt : MouseEvent) : void =>
        {
            if (this._sceneManager.currentScene.inputMouseDown (evt))
                evt.preventDefault ();
        };

        /**
         * Handle for mouse up events. This gets triggered whenever the game is running and a mouse
         * button is released
         *
         * @param evt the event object for this event.
         */
        private mouseUpEvent = (evt : MouseEvent) : void =>
        {
            if (this._sceneManager.currentScene.inputMouseUp (evt))
                evt.preventDefault ();
        };


        /**
         * Handler for mouse click events. This gets triggered whenever the game is running and the mouse
         * is clicked over the canvas.
         *
         * @param evt the event object for this event
         */
        private mouseClickEvent = (evt : MouseEvent) : void =>
        {
            if (this._sceneManager.currentScene.inputMouseClick (evt))
                evt.preventDefault ();
        };

        /**
         * Handler for mouse double click events. This gets triggered whenever the game is running and the
         * mouse is double clicked over the canvas.
         *
         * @param evt the event object for this event
         */
        private mouseDblClickEvent = (evt : MouseEvent) : void =>
        {
            if (this._sceneManager.currentScene.inputMouseDblClick (evt))
                evt.preventDefault ();
        };

        /**
         * Handler for mouse wheel events. This gets triggered whenever the game is running and the mouse
         * wheel is scrolled over the canvas.
         *
         * @param evt the event object for this event.
         */
        private mouseWheelEvent = (evt : MouseWheelEvent) : void =>
        {
            if (this._sceneManager.currentScene.inputMouseWheel (evt))
                evt.preventDefault ();
        };

        /**
         * Perform a simple check to see if the given touch event is happening within the bounds of the
         * canvas (regardless of its scale).
         */
        private touchInCanvas(touch: Touch): boolean
        {
            // Calculate where the canvas is and where the touch happened.
            let rect = this._canvas.getBoundingClientRect();
            let root = document.documentElement;
            let touchX = touch.clientX - rect.left - root.scrollLeft;
            let touchY = touch.clientY - rect.top - root.scrollTop;

            // Did the touch happen inside the canvas? Our rect value tells us
            // the document coordinates that the canvas is taking up, but our calculated
            // position is in canvas coordinates.
            return touchX >= 0 && touchY >= 0 &&
                touchX <= rect.width && touchY <= rect.height;
        }

        /**
         * Handler for touch events. When a touch event is triggered, it is handled by converting the touch
         * event into an appropriate mouse event and then dispatching the mouse event. Thus on touch enabled
         * devices (e.g. tablets), touching works as a mouse does.
         *
         * @param evt the event object for this event.
         */
        private touchEvent = (evt : TouchEvent) : void =>
        {
            // Get the list of touches, and then the first touch.
            let touches = evt.changedTouches,
                first = touches[0],
                type = "";

            // Based on the type of touch event, attempt to map it to an appropriate mosue event; if this
            // fails, just leave.
            switch (evt.type)
            {
                case "touchstart": type = "mousedown"; break;
                case "touchmove": type = "mousemove"; break;
                case "touchend": type = "mouseup"; break;
                default: return;
            }

            // Ignore a mouse movement event that is outside of the canvas. This mimics how the mousemove
            // event is bound to the canvas element and not the document. The touchmove event is bound to the
            // document so that we can block all moves in the document to stop page scrolls from happening
            // even if outside of the canvas.
            if (type == "mousemove" && this.touchInCanvas(first) == false)
                return;

            // Create and initialize a Mouse event using the event information from the touch event (primarily
            // the location of the touch).
            let simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1,
                first.screenX, first.screenY,
                first.clientX, first.clientY, false,
                false, false, false, 0, null);

            // Dispatch the event now. If this is a touch move (or "mouse move", now), then stop the default
            // handling from triggering. This will stop the touch from scrolling the display while the game
            // is running; it's still possible to do so by stopping the game first.
            //
            // Note also that if we prevent the default on other events, then the browser's simulation of
            // events (e.g. for clicking on links) will also be blocked, which is not what we want.
            first.target.dispatchEvent(simulatedEvent);
            if (type == "mousemove")
                event.preventDefault();
        };

        /**
         * Turn on input handling for the game. This will capture keyboard events from the document and mouse
         * events for the canvas provided.
         *
         * @param canvas the canvas to listen for mouse events on.
         */
        private enableInputEvents = (canvas : HTMLCanvasElement) : void =>
        {
            // Mouse events are specific to the canvas.
            canvas.addEventListener ('mousemove', this.mouseMoveEvent);
            canvas.addEventListener ('mousedown', this.mouseDownEvent);
            canvas.addEventListener ('click', this.mouseClickEvent);
            canvas.addEventListener ('dblclick', this.mouseDblClickEvent);
            canvas.addEventListener ('wheel', this.mouseWheelEvent);

            // This one has to be on the document, or else pressing the mouse and moving outside of the canvas
            // and letting go of the button will not be captured.
            document.addEventListener ('mouseup', this.mouseUpEvent);

            // Keyboard events are document wide because a canvas can't hold the input focus.
            document.addEventListener ('keydown', this.keyDownEvent);
            document.addEventListener ('keyup', this.keyUpEvent);

            // These ones are on the document, and translate touch events to mouse events. The touch event for
            // touchmove is bound to the document instead of just the canvas because our handler for it blocks
            // the default handling for it so that the screen doesn't scroll. We want that to happen even if
            // the touch originates outside of the canvas.
            document.addEventListener('touchstart', this.touchEvent);
            document.addEventListener('touchmove', this.touchEvent);
            document.addEventListener('touchend', this.touchEvent);
            document.addEventListener('touchcancel', this.touchEvent);
        };

        /**
         * Turn off input handling for the game. This will turn off keyboard events from the document and
         * mouse events for the canvas provided.
         */
        private disableInputEvents = (canvas : HTMLCanvasElement) : void =>
        {
            canvas.removeEventListener ('mousemove', this.mouseMoveEvent);
            canvas.addEventListener ('mousedown', this.mouseDownEvent);
            canvas.removeEventListener ('click', this.mouseClickEvent);
            canvas.removeEventListener ('dblclick', this.mouseDblClickEvent);
            canvas.removeEventListener ('wheel', this.mouseWheelEvent);
            document.addEventListener ('mouseup', this.mouseUpEvent);
            document.removeEventListener ('keydown', this.keyDownEvent);
            document.removeEventListener ('keyup', this.keyUpEvent);
            document.removeEventListener('touchstart', this.touchEvent);
            document.removeEventListener('touchmove', this.touchEvent);
            document.removeEventListener('touchend', this.touchEvent);
            document.removeEventListener('touchcancel', this.touchEvent);
        };

        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString () : string
        {
            return String.format ("[Stage dimensions={0}x{1}, tileSize={2}]",
                                  STAGE_WIDTH, STAGE_HEIGHT, TILE_SIZE);
        }
    }
}
