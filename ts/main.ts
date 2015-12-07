module nurdz.main
{
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
         * Our properties; This is an override to the version in the Entity base class which changes the
         * type to be our extended properties type.
         *
         * @type {DotProperties}
         * @protected
         */
        protected _properties : DotProperties;

        /**
         * Construct an instance; it needs to know how it will be rendered.
         *
         * @param stage the stage that owns this actor.
         * @param properties the properties to apply to this entity
         */
        constructor (stage : nurdz.game.Stage, properties : DotProperties = {})
        {
            // Invoke the super to construct us. We position ourselves in the center of the stage.
            super ("A dot", stage, stage.width / 2, stage.height / 2, game.TILE_SIZE, game.TILE_SIZE, 1,
                   properties, <DotProperties> {
                    xSpeed: game.Utils.randomIntInRange (-5, 5),
                    ySpeed: game.Utils.randomIntInRange (-5, 5)
                });

            // Our radius is half our width because our position is registered via the center of our own
            // bounds.
            this._radius = this._width / 2;

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
            super.validateProperties();

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
        update (stage : nurdz.game.Stage)
        {
            // Translate;
            this._position.translateXY (this._properties.xSpeed, this._properties.ySpeed);

            // Bounce left and right
            if (this._position.x < this._radius || this._position.x >= stage.width - this._radius)
                this._properties.xSpeed *= -1;

            // Bounce up and down.
            if (this._position.y < this._radius || this._position.y >= stage.height - this._radius)
                this._properties.ySpeed *= -1;
        }

        /**
         * Render ourselves to the stage.
         *
         * @param stage the stage to render onto
         */
        render (stage : nurdz.game.Stage)
        {
            stage.renderer.fillCircle(this._position.x, this._position.y, this._radius, this._debugColor);
        }
    }

    /**
     * This is a simple extension of the scene class; it displays the FPS on the screen.
     *
     * Notice that it also clears the stage; the base Scene class only renders actors but doesn't clear
     * the screen, so that when you override it you can get the actor rendering "for free" without it
     * making assumptions about when it gets invoked.
     */
    class TestScene extends nurdz.game.Scene
    {
        /**
         * Render the scene.
         */
        render ()
        {
            // Clear the screen, render any actors, and then display the FPS we're running at in the top
            // left corner.
            this._stage.renderer.clear ("black");
            super.render ();
            this._stage.renderer.drawTxt(`FPS: ${this._stage.fps}`, 16, 16, 'white');
        }
    }

    // Once the DOM is loaded, set things up.
    nurdz.contentLoaded (window, function ()
    {
        try
        {
            // Set up the stage.
            var stage = new game.Stage ('gameContent');

            // Set up the button that will stop the game if something goes wrong.
            setupButton (stage, "controlBtn");

            // Register all of our scenes.
            stage.addScene ("sceneName", new TestScene ("A Scene", stage));

            // Switch to the initial scene, add a dot to display and then run the game.
            stage.switchToScene ("sceneName");
            stage.currentScene.addActor (new Dot (stage));
            stage.currentScene.addActor (new Dot (stage));
            stage.run ();
        }
        catch (error)
        {
            console.log ("Error starting the game");
            throw error;
        }
    });
}
