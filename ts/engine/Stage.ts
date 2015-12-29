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
         * Obtain the current engine update tick. This is incremented once every time the frame update
         * loop is invoked, and can be used to time things in a crude fashion.
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
         * The CSS of the DIV will be modified to have a width and height of the canvas, with options that
         * cause it to center itself.
         *
         * @param containerDivID the ID of the DIV that should contain the created canvas
         * @param initialColor the color to clear the canvas to once it is created
         * @constructor
         * @throws {ReferenceError} if there is no element with the ID provided
         */
        constructor (containerDivID : string, initialColor : string = 'black')
        {
            // We don't start off having done a preload.
            this._didPreload = false;

            // Set up the list of sounds.
            this._knownSounds = [];

            // Set up our scene manager object.
            this._sceneManager = new SceneManager (this);

            // Obtain the container element that we want to insert the canvas into.
            var container = document.getElementById (containerDivID);
            if (container == null)
                throw new ReferenceError ("Unable to create stage: No such element with ID '" + containerDivID + "'");

            // Create the canvas and give it the appropriate dimensions.
            this._canvas = document.createElement ("canvas");
            this._canvas.width = STAGE_WIDTH;
            this._canvas.height = STAGE_HEIGHT;

            // Modify the style of the container div to make it center horizontally.
            container.style.width = STAGE_WIDTH + "px";
            container.style.height = STAGE_HEIGHT + "px";
            container.style.marginLeft = "auto";
            container.style.marginRight = "auto";

            // Create our rendering object and then use it to clear the stage.
            this._renderer = new CanvasRenderer (this._canvas);
            this._renderer.clear (initialColor);

            // Append the canvas to the container
            container.appendChild (this._canvas);
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
                Preloader.commence (startSceneLoop);
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
         * This is just a proxy for the Preloader.addImage() method, placed here for convenience.
         *
         * @param filename the filename of the image to load
         * @returns {HTMLImageElement} the image element that will contain the image once it is loaded
         * @see Preloader.addImage
         */
        preloadImage (filename : string) : HTMLImageElement
        {
            return Preloader.addImage (filename);
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
         * This is just a simple proxy for the Preloader.addSound() method which invokes Stage.addSound() for
         * you.
         *
         * @param filename the filename of the sound to load
         * @returns {Sound} the preloaded sound object
         * @see Preloader.addSound
         * @see Stage.addSound
         */
        preloadSound (filename : string) : Sound
        {
            return this.addSound (Preloader.addSound (filename));
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
         * This is just a simple proxy for the Preloader.addMusic() method which invokes Stage.addSound()
         * for you.
         *
         * @param filename the filename of the music to load
         * @returns {Sound} the preloaded sound object
         * @see Preloader.addMusic
         * @see Stage.addSound
         */
        preloadMusic (filename : string) : Sound
        {
            return this.addSound (Preloader.addMusic (filename));
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
         * For maximum confusion, this only affects registered sound objects that are set to not loop,
         * since such a sound is often used as music and we might want to mute the music separate from the
         * sound (or vice versa).
         *
         * The mute state of all such sounds is set to the state passed in.
         *
         * @param mute true to mute all sounds or false to un-mute all sounds
         */
        muteSounds (mute : boolean) : void
        {
            for (let i = 0 ; i < this._knownSounds.length ; i++)
            {
                if (this._knownSounds[i].loop == false)
                    this._knownSounds[i].muted = mute;
            }
        }

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
        soundVolume (volume : number) : void
        {
            for (let i = 0 ; i < this._knownSounds.length ; i++)
            {
                if (this._knownSounds[i].loop == false)
                    this._knownSounds[i].volume = volume;
            }
        }

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
        muteMusic (mute : boolean) : void
        {
            for (let i = 0 ; i < this._knownSounds.length ; i++)
            {
                if (this._knownSounds[i].loop == true)
                    this._knownSounds[i].muted = mute;
            }
        }

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
        musicVolume (volume : number) : void
        {
            for (let i = 0 ; i < this._knownSounds.length ; i++)
            {
                if (this._knownSounds[i].loop == true)
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
         * @param mouseEvent the mouse movement or click event
         * @returns {Point} the point of the mouse click/pointer position on the stage
         */
        calculateMousePos (mouseEvent : MouseEvent) : Point
        {
            // Some math has to be done because the mouse position is relative to document, which may have
            // dimensions larger than the current viewable area of the browser window.
            //
            // As a result, we need to ensure that we take into account the position of the canvas in the
            // document AND the scroll position of the document.
            var rect = this._canvas.getBoundingClientRect ();
            var root = document.documentElement;
            var mouseX = mouseEvent.clientX - rect.left - root.scrollLeft;
            var mouseY = mouseEvent.clientY - rect.top - root.scrollTop;

            return new Point (mouseX, mouseY);
        }

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
         * Handler for mouse movement events. This gets triggered whenever the game is running and the mouse
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
         * Turn on input handling for the game. This will capture keyboard events from the document and mouse
         * events for the canvas provided.
         *
         * @param canvas the canvas to listen for mouse events on.
         */
        private enableInputEvents = (canvas : HTMLCanvasElement) : void =>
        {
            // Mouse events are specific to the canvas.
            canvas.addEventListener ('mousemove', this.mouseMoveEvent);
            canvas.addEventListener ('mousedown', this.mouseClickEvent);

            // Keyboard events are document wide because a canvas can't hold the input focus.
            document.addEventListener ('keydown', this.keyDownEvent);
            document.addEventListener ('keyup', this.keyUpEvent);
        };

        /**
         * Turn off input handling for the game. This will turn off keyboard events from the document and
         * mouse events for the canvas provided.
         */
        private disableInputEvents = (canvas : HTMLCanvasElement) : void =>
        {
            canvas.removeEventListener ('mousemove', this.mouseMoveEvent);
            canvas.removeEventListener ('mousedown', this.mouseClickEvent);
            document.removeEventListener ('keydown', this.keyDownEvent);
            document.removeEventListener ('keyup', this.keyUpEvent);
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
