module nurdz.main
{
    import KeyCodes = nurdz.game.KeyCodes;
    /**
     * Set up the button on the page to toggle the state of the game.
     *
     * @param stage the stage to control
     * @param buttonID the ID of the button to mark up to control the game state
     */
    function setupButton (stage, buttonID)
    {
        // True when the game is running, false when it is not. This state is toggled by the button. We
        // assume that the game is going to start running.
        var gameRunning = true;

        // Get the button.
        var button = document.getElementById (buttonID);
        if (button == null)
            throw new ReferenceError ("No button found with ID '" + buttonID + "'");

        // Set up the button to toggle the stage.
        button.addEventListener ("click", function ()
        {
            // Try to toggle the game state. This will only throw an error if we try to put the game into
            // a state it is already in, which can only happen if the engine stops itself when we didn't
            // expect it.
            try
            {
                if (gameRunning)
                    stage.stop ();
                else
                    stage.run ();
            }

                // Log and then rethrow the error.
            catch (error)
            {
                console.log ("Exception generated while toggling game state");
                throw error;
            }

                // No matter what, toggle the game state. This will put the button back into sync for the next
                // click if it got out of sync.
            finally
            {
                // No matter what, toggle the state.
                gameRunning = !gameRunning;
                button.innerHTML = gameRunning ? "Stop Game" : "Restart Game";
            }
        });
    }

    // This interface extends the properties of regular entities to provide the properties that a Dot
    // might need in order to operate.
    interface DotProperties extends nurdz.game.EntityProperties
    {
        /**
         * The X speed of this dot as it moves around. If it's not specified, a random default is provided.
         */
        xSpeed? : number;

        /**
         * The Y speed of this dot as it moves around. If it's not specified, a random default is provided.
         */
        ySpeed? : number;
    }

    /**
     * This simple class represents a Dot on the screen. It starts in the center of the screen and bounces
     * around.
     */
    class Dot extends nurdz.game.Entity
    {
        /**
         * The radius of the circle we use to render ourselves.
         *
         * @type {number}
         * @private
         */
        private _radius : number;

        /**
         * The image that we use to render ourselves.
         *
         * @type {HTMLImageElement}
         */
        private _image : HTMLImageElement;

        /**
         * The sound to play whenever we bounce off of the sides of the screen.
         */
        private _sound : game.Sound;

        /**
         * Our properties; This is an override to the version in the Entity base class which changes the
         * type to be our extended properties type.
         *
         * @type {DotProperties}
         * @protected
         */
        protected _properties : DotProperties;

        /**
         * We need to override the properties property as well to change the type, otherwise outside code
         * will think our properties are EntityProperties, which is not very useful.
         *
         * @returns {DotProperties}
         */
        get properties () : DotProperties
        { return this._properties; }

        /**
         * Construct an instance; it needs to know how it will be rendered.
         *
         * @param stage the stage that owns this actor.
         * @param image the image to render ourselves with
         * @param sound the sound to play when we bounce off the sides of the screen
         * @param properties the properties to apply to this entity
         */
        constructor (stage : game.Stage, image : HTMLImageElement, sound : game.Sound,
                     properties : DotProperties = {})
        {
            // Invoke the super to construct us. We position ourselves in the center of the stage.
            super ("A dot", stage, stage.width / 2, stage.height / 2, 20, 20, 1,
                   properties, <DotProperties> {
                    xSpeed: game.Utils.randomIntInRange (-5, 5),
                    ySpeed: game.Utils.randomIntInRange (-5, 5),
                });

            // Our radius is half our width because our position is registered via the center of our own
            // bounds.
            this._radius = this._width / 2;

            // Save the image and sound we were given.
            this._image = image;
            this._sound = sound;

            // Show what we did in the console.
            console.log ("Dot entity created with properties: ", this._properties);
        }

        /**
         * This gets invoked by the Entity class constructor when it runs to allow us to validate that our
         * properties are OK.
         *
         * Here we make sure to fix up an X or Y speed that is 0 to be non-zero so that we always bounce
         * in a pleasing fashion.
         */
        protected validateProperties ()
        {
            // Let the super class do its job.
            super.validateProperties ();

            // Make sure our xSpeed is valid.
            if (this._properties.xSpeed == 0)
            {
                console.log ("Fixing a 0 xSpeed");
                this._properties.xSpeed = game.Utils.randomFloatInRange (-1, 1) > 0 ? 1 : -1;
            }

            // Make sure our ySpeed is valid.
            if (this._properties.ySpeed == 0)
            {
                console.log ("Fixing a 0 ySpeed");
                this._properties.ySpeed = game.Utils.randomFloatInRange (-1, 1) > 0 ? 1 : -1;
            }
        }

        /**
         * Update our position on the stage.
         *
         * @param stage the stage we are on
         */
        update (stage : game.Stage)
        {
            // Translate;
            this._position.translateXY (this._properties.xSpeed, this._properties.ySpeed);

            // Bounce left and right
            if (this._position.x < this._radius || this._position.x >= stage.width - this._radius)
            {
                this._properties.xSpeed *= -1;
                this._sound.play ();
            }

            // Bounce up and down.
            if (this._position.y < this._radius || this._position.y >= stage.height - this._radius)
            {
                this._properties.ySpeed *= -1;
                this._sound.play ();
            }
        }

        /**
         * Render ourselves to the stage.
         *
         * @param x the x location to render the actor at, in stage coordinates (NOT world)
         * @param y the y location to render the actor at, in stage coordinates (NOT world)
         * @param renderer the renderer to render with
         */
        render (x : number, y : number, renderer : game.Renderer)
        {
            renderer.blitCentered (this._image, x, y);
        }
    }

    /**
     * This is a simple extension of the scene class; it displays the FPS on the screen.
     *
     * Notice that it also clears the stage; the base Scene class only renders actors but doesn't clear
     * the screen, so that when you override it you can get the actor rendering "for free" without it
     * making assumptions about when it gets invoked.
     */
    class TestScene extends game.Scene
    {
        /**
         * The music we play in our scene.
         */
        private _music : game.Sound;

        /**
         * True if we should play music or false otherwise.
         */
        private _playMusic : boolean;

        /**
         * True if we should play sounds or false otherwise.
         */
        private _playSounds : boolean;

        /**
         * Create a new test scene to be managed by the provided stage.
         *
         * @param stage the stage to manage us/
         */
        constructor (stage : game.Stage)
        {
            super ("A Scene", stage);

            // By default, we're playing music and sounds.
            this._playMusic = true;
            this._playSounds = true;

            // Preload some images.
            let ball1 = stage.preloadImage ("ball_blue.png");
            let ball2 = stage.preloadImage ("ball_yellow.png");

            // Preload a bounce sound
            let bounce = stage.preloadSound ("bounce_wall");

            // Preload some music.
            this._music = stage.preloadMusic ("WhoLikesToParty");

            // Create two actors and add them to ourselves. These use the images and sounds we said we
            // want to preload.
            this.addActor (new Dot (stage, ball1, bounce));
            this.addActor (new Dot (stage, ball2, bounce));
        }

        /**
         * Render the scene.
         */
        render ()
        {
            // Clear the screen, render any actors, and then display the FPS we're running at in the top
            // left corner.
            this._stage.renderer.clear ("black");
            super.render ();
            this._stage.renderer.drawTxt (`FPS: ${this._stage.fps}`, 16, 16, 'white');
        }

        /**
         * Invoked when we become the active scene
         *
         * @param previousScene the scene that used to be active
         */
        activating (previousScene : game.Scene) : void
        {
            // Let the super report the scene change in a debug log, then start our music.
            super.activating (previousScene);

            // Set the appropriate mute state for sounds and music.
            this._stage.muteMusic (!this._playMusic);
            this._stage.muteSounds (!this._playSounds);

            // Start music playing now (it might be muted).
            this._music.play ();
        }

        /**
         * Invoked when we are no longer the active scene
         *
         * @param nextScene the scene that is going to become active
         */
        deactivating (nextScene : game.Scene) : void
        {
            // Let the super report the scene change in a debug log, then stop our music.
            super.deactivating (nextScene);
            this._music.pause ();
        }

        /**
         * Invoked when a key is pressed.
         *
         * @param eventObj the key press event
         * @returns {boolean} true if we handled the event or false otherwise
         */
        inputKeyDown (eventObj : KeyboardEvent) : boolean
        {
            switch (eventObj.keyCode)
            {
                // Toggle the mute state of the music
                case KeyCodes.KEY_M:
                    this._playMusic = !this._playMusic;
                    this._stage.muteMusic (!this._playMusic);
                    return true;

                // Toggle the mute state of the sound
                case KeyCodes.KEY_S:
                    this._playSounds = !this._playSounds;
                    this._stage.muteSounds (!this._playSounds);
                    return true;

                default:
                    // Let the super do what super does. This allows screen shots to still work as expected.
                    return super.inputKeyDown (eventObj);
            }
        }
    }

    // Once the DOM is loaded, set things up.
    nurdz.contentLoaded (window, function ()
    {
        try
        {
            // Set up the stage.
            var stage = new game.Stage ('gameContent');

            // Set up the default values used for creating a screen shot.
            game.Stage.screenshotFilenameBase = "screenshot";
            game.Stage.screenshotWindowTitle = "Screenshot";

            // Set up the button that will stop the game if something goes wrong.
            setupButton (stage, "controlBtn");

            // Register all of our scenes.
            stage.addScene ("sceneName", new TestScene (stage));

            // Switch to the initial scene, add a dot to display and then run the game.
            stage.switchToScene ("sceneName");
            stage.run ();
        }
        catch (error)
        {
            console.log ("Error starting the game");
            throw error;
        }
    });
}
