module nurdz.main
{
    // Import the key codes module so that we can easily get at the pressed key
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
                {
                    stage.muteMusic (true);
                    stage.muteSounds (true);
                    stage.stop ();
                }
                else
                {
                    stage.muteMusic (false);
                    stage.muteSounds (false);
                    stage.run ();
                }
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
     * A simple entity that represents a sprite idling and then running.
     */
    class GreyGuy extends nurdz.game.Entity
    {
        /**
         * Create a new guy that will render on the current stage.
         * @param stage
         */
        constructor (stage : nurdz.game.Stage)
        {
            super ("A grey guy", stage, stage.width / 2, stage.height - 64, 64, 96, 1, {}, {});

            // Set up a sprite sheet and turn on debugging
            this._sheet = new game.SpriteSheet (stage, "sprite_animation.png", 10, 2, true, this.sheetLoaded);
            this._properties.debug = true;

            // Set animations up. The first animation becomes active automatically.
            this.addAnimation ("idle", 5, true, game.Utils.createRange (0, 9));
            this.addAnimation ("walk", 15, true, game.Utils.createRange (10, 19));
        }

        /**
         * This gets invoked once the sprite sheet is fully loaded; here we can determine the dimensions
         * of the underlying sprites (if we didn't already know).
         * @param sheet
         */
        private sheetLoaded = (sheet : game.SpriteSheet) =>
        {
            // Set our dimensions to be the dimensions of sprites in this sprite sheet and our origin to
            // be between the "feet" of the sprite.
            this._width = sheet.width;
            this._height = sheet.height;
            this._origin.setToXY (this._width / 2, this._height - 1);
        };

        /**
         * Toggle between our animations whenever we are invoked.
         */
        toggleAnimation () : void
        {
            // Play the animation that is not currently playing.
            this.playAnimation (this._animations.current == "idle" ? "walk" : "idle");
        }

    }

    /**
     * This simple class just displays an image and slowly rotates in place.
     */
    class Star extends nurdz.game.Entity
    {
        /**
         * Construct an instance; it needs to know how it will be rendered.
         *
         * @param stage the stage that owns this actor.
         */
        constructor (stage : game.Stage)
        {
            // Invoke the super.
            super ("A star", stage, stage.width / 2, stage.height / 2, 64, 64, 1, {}, {}, 'green');

            // Give ourselves a sprite sheet.
            this._sheet = new game.SpriteSheet (stage, "star_green.png", 1);

            // Turn on our debug property so our bounds get rendered too.
            this._properties.debug = true;

            // Set our origin to be somewhere interesting.
            this.origin.setToXY (64 / 3, 64 / 3);
        }

        /**
         * In our simple update method, we just rotate slowly around.
         *
         * @param stage the stage that owns us
         * @param tick the current game tick
         */
        update (stage : nurdz.game.Stage, tick : number) : void
        {
            // Advance our angle by 5 degrees. The angle is normalized for us.
            this.angle = this.angle + 5;
        }
    }

    /**
     * This simple class represents a Dot on the screen. It starts in the center of the screen and bounces
     * around.
     */
    class Dot extends nurdz.game.Entity
    {
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
         * @param sound the sound to play when we bounce off the sides of the screen
         * @param properties the properties to apply to this entity
         */
        constructor (stage : game.Stage, sound : game.Sound, properties : DotProperties = {})
        {
            // Invoke the super to construct us. We position ourselves in the center of the stage.
            super ("A dot", stage, stage.width / 2, stage.height / 2, 0, 0, 1,
                   properties, <DotProperties> {
                    xSpeed: game.Utils.randomIntInRange (-5, 5),
                    ySpeed: game.Utils.randomIntInRange (-5, 5),
                }, 'red');

            // Convert to a circular bounding box with a radius of 10.
            this.makeCircle (10, true);

            // Save the sound we were given.
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
            if (this._position.x < this.radius || this._position.x >= stage.width - this.radius)
            {
                this._properties.xSpeed *= -1;
                this._sound.play ();
            }

            // Bounce up and down.
            if (this._position.y < this.radius || this._position.y >= stage.height - this.radius)
            {
                this._properties.ySpeed *= -1;
                this._sound.play ();
            }
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
         * The grey guy actor; we will fiddle its animations based on key presses.
         */
        private _guy : GreyGuy;

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

            // Preload a bounce sound
            let bounce = stage.preloadSound ("bounce_wall", this.soundLoadComplete);

            // Preload some music.
            this._music = stage.preloadMusic ("WhoLikesToParty", this.soundLoadComplete);

            // Create some dot entities.
            let dot1 = new Dot (stage, bounce, {debug: true});
            let dot2 = new Dot (stage, bounce, {debug: false});

            // Give the dots sprite sheets.
            dot1.sheet = new game.SpriteSheet (stage, "ball_blue.png", 1);
            dot2.sheet = new game.SpriteSheet (stage, "ball_yellow.png", 1);

            // Create the grey guy; he will set up his own sprite sheet.
            this._guy = new GreyGuy (stage);

            // Now add the dots entities and a star entity to ourselves so that they get updated and rendered.
            this.addActor (new Star (stage));
            this.addActor (this._guy);
            this.addActor (dot1);
            this.addActor (dot2);
        }

        /**
         * This is invoked every time one of our images preloads; we get told which one has been loaded.
         *
         * @param image the image that loaded
         */
        private imageLoadComplete = (image : HTMLImageElement) =>
        {
            console.log (this._name, "finished loading", image.src);
        };

        /**
         * This is invoked every time one of our sounds preloads; we get the sound object, from which we
         * can get the tag and also a determination on whether or not it is music or a sound effect.
         *
         * @param sound the sound (or music) that loaded
         */
        private soundLoadComplete = (sound : game.Sound) =>
        {
            console.log (this._name, "finished loading", sound.isMusic ? "music" : "sound", sound.tag.src);
        };

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
            this._stage.renderer.fillCircle (400, 300, 2, 'red');
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

                // Toggle the animation of the guy.
                case KeyCodes.KEY_SPACEBAR:
                    this._guy.toggleAnimation ();
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
            var stage = new game.Stage ('gameContent', 'black', true);

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
