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
     * This class represents the stage area in the page, which is where the game renders itself.
     *
     * The class knows how to create the stage and do some rendering. This is also where the core
     * rendering loop is contained.
     */
    export class Stage
    {
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
        { return this._sceneManager.currentScene; }

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

            // Reset the variables we use for frame counts.
            _startTime = 0;
            _frameNumber = 0;

            // Fire off a timer to invoke our scene loop using an appropriate interval.
            _gameTimerID = setInterval (this.sceneLoop, 1000 / fps);

            // Turn on input events.
            this.enableInputEvents (this._canvas);
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
            this._sceneManager.switchToScene (sceneName);

            // If the game is not currently running, then perform the switch right now; external code
            // might want to switch the scene while the game is not running and we want the currentScene
            // property to track property.
            if (_gameTimerID == null)
                this._sceneManager.checkSceneSwitch ();
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
