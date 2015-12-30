var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var nurdz;
(function (nurdz) {
    var main;
    (function (main) {
        var KeyCodes = nurdz.game.KeyCodes;
        /**
         * Set up the button on the page to toggle the state of the game.
         *
         * @param stage the stage to control
         * @param buttonID the ID of the button to mark up to control the game state
         */
        function setupButton(stage, buttonID) {
            // True when the game is running, false when it is not. This state is toggled by the button. We
            // assume that the game is going to start running.
            var gameRunning = true;
            // Get the button.
            var button = document.getElementById(buttonID);
            if (button == null)
                throw new ReferenceError("No button found with ID '" + buttonID + "'");
            // Set up the button to toggle the stage.
            button.addEventListener("click", function () {
                // Try to toggle the game state. This will only throw an error if we try to put the game into
                // a state it is already in, which can only happen if the engine stops itself when we didn't
                // expect it.
                try {
                    if (gameRunning) {
                        stage.muteMusic(true);
                        stage.muteSounds(true);
                        stage.stop();
                    }
                    else {
                        stage.muteMusic(false);
                        stage.muteSounds(false);
                        stage.run();
                    }
                }
                // Log and then rethrow the error.
                catch (error) {
                    console.log("Exception generated while toggling game state");
                    throw error;
                }
                finally {
                    // No matter what, toggle the state.
                    gameRunning = !gameRunning;
                    button.innerHTML = gameRunning ? "Stop Game" : "Restart Game";
                }
            });
        }
        /**
         * This simple class represents a Dot on the screen. It starts in the center of the screen and bounces
         * around.
         */
        var Dot = (function (_super) {
            __extends(Dot, _super);
            /**
             * Construct an instance; it needs to know how it will be rendered.
             *
             * @param stage the stage that owns this actor.
             * @param image the image to render ourselves with
             * @param sound the sound to play when we bounce off the sides of the screen
             * @param properties the properties to apply to this entity
             */
            function Dot(stage, image, sound, properties) {
                if (properties === void 0) { properties = {}; }
                // Invoke the super to construct us. We position ourselves in the center of the stage.
                _super.call(this, "A dot", stage, stage.width / 2, stage.height / 2, 20, 20, 1, properties, {
                    xSpeed: nurdz.game.Utils.randomIntInRange(-5, 5),
                    ySpeed: nurdz.game.Utils.randomIntInRange(-5, 5),
                });
                // Our radius is half our width because our position is registered via the center of our own
                // bounds.
                this._radius = this._width / 2;
                // Save the image and sound we were given.
                this._image = image;
                this._sound = sound;
                // Show what we did in the console.
                console.log("Dot entity created with properties: ", this._properties);
            }
            Object.defineProperty(Dot.prototype, "properties", {
                /**
                 * We need to override the properties property as well to change the type, otherwise outside code
                 * will think our properties are EntityProperties, which is not very useful.
                 *
                 * @returns {DotProperties}
                 */
                get: function () { return this._properties; },
                enumerable: true,
                configurable: true
            });
            /**
             * This gets invoked by the Entity class constructor when it runs to allow us to validate that our
             * properties are OK.
             *
             * Here we make sure to fix up an X or Y speed that is 0 to be non-zero so that we always bounce
             * in a pleasing fashion.
             */
            Dot.prototype.validateProperties = function () {
                // Let the super class do its job.
                _super.prototype.validateProperties.call(this);
                // Make sure our xSpeed is valid.
                if (this._properties.xSpeed == 0) {
                    console.log("Fixing a 0 xSpeed");
                    this._properties.xSpeed = nurdz.game.Utils.randomFloatInRange(-1, 1) > 0 ? 1 : -1;
                }
                // Make sure our ySpeed is valid.
                if (this._properties.ySpeed == 0) {
                    console.log("Fixing a 0 ySpeed");
                    this._properties.ySpeed = nurdz.game.Utils.randomFloatInRange(-1, 1) > 0 ? 1 : -1;
                }
            };
            /**
             * Update our position on the stage.
             *
             * @param stage the stage we are on
             */
            Dot.prototype.update = function (stage) {
                // Translate;
                this._position.translateXY(this._properties.xSpeed, this._properties.ySpeed);
                // Bounce left and right
                if (this._position.x < this._radius || this._position.x >= stage.width - this._radius) {
                    this._properties.xSpeed *= -1;
                    this._sound.play();
                }
                // Bounce up and down.
                if (this._position.y < this._radius || this._position.y >= stage.height - this._radius) {
                    this._properties.ySpeed *= -1;
                    this._sound.play();
                }
            };
            /**
             * Render ourselves to the stage.
             *
             * @param x the x location to render the actor at, in stage coordinates (NOT world)
             * @param y the y location to render the actor at, in stage coordinates (NOT world)
             * @param renderer the renderer to render with
             */
            Dot.prototype.render = function (x, y, renderer) {
                renderer.blitCentered(this._image, x, y);
            };
            return Dot;
        })(nurdz.game.Entity);
        /**
         * This is a simple extension of the scene class; it displays the FPS on the screen.
         *
         * Notice that it also clears the stage; the base Scene class only renders actors but doesn't clear
         * the screen, so that when you override it you can get the actor rendering "for free" without it
         * making assumptions about when it gets invoked.
         */
        var TestScene = (function (_super) {
            __extends(TestScene, _super);
            /**
             * Create a new test scene to be managed by the provided stage.
             *
             * @param stage the stage to manage us/
             */
            function TestScene(stage) {
                _super.call(this, "A Scene", stage);
                // By default, we're playing music and sounds.
                this._playMusic = true;
                this._playSounds = true;
                // Preload some images.
                var ball1 = stage.preloadImage("ball_blue.png");
                var ball2 = stage.preloadImage("ball_yellow.png");
                // Preload a bounce sound
                var bounce = stage.preloadSound("bounce_wall");
                // Preload some music.
                this._music = stage.preloadMusic("WhoLikesToParty");
                // Create two actors and add them to ourselves. These use the images and sounds we said we
                // want to preload.
                this.addActor(new Dot(stage, ball1, bounce));
                this.addActor(new Dot(stage, ball2, bounce));
            }
            /**
             * Render the scene.
             */
            TestScene.prototype.render = function () {
                // Clear the screen, render any actors, and then display the FPS we're running at in the top
                // left corner.
                this._stage.renderer.clear("black");
                _super.prototype.render.call(this);
                this._stage.renderer.drawTxt("FPS: " + this._stage.fps, 16, 16, 'white');
            };
            /**
             * Invoked when we become the active scene
             *
             * @param previousScene the scene that used to be active
             */
            TestScene.prototype.activating = function (previousScene) {
                // Let the super report the scene change in a debug log, then start our music.
                _super.prototype.activating.call(this, previousScene);
                // Set the appropriate mute state for sounds and music.
                this._stage.muteMusic(!this._playMusic);
                this._stage.muteSounds(!this._playSounds);
                // Start music playing now (it might be muted).
                this._music.play();
            };
            /**
             * Invoked when we are no longer the active scene
             *
             * @param nextScene the scene that is going to become active
             */
            TestScene.prototype.deactivating = function (nextScene) {
                // Let the super report the scene change in a debug log, then stop our music.
                _super.prototype.deactivating.call(this, nextScene);
                this._music.pause();
            };
            /**
             * Invoked when a key is pressed.
             *
             * @param eventObj the key press event
             * @returns {boolean} true if we handled the event or false otherwise
             */
            TestScene.prototype.inputKeyDown = function (eventObj) {
                switch (eventObj.keyCode) {
                    // Toggle the mute state of the music
                    case KeyCodes.KEY_M:
                        this._playMusic = !this._playMusic;
                        this._stage.muteMusic(!this._playMusic);
                        return true;
                    // Toggle the mute state of the sound
                    case KeyCodes.KEY_S:
                        this._playSounds = !this._playSounds;
                        this._stage.muteSounds(!this._playSounds);
                        return true;
                    default:
                        // Let the super do what super does. This allows screen shots to still work as expected.
                        return _super.prototype.inputKeyDown.call(this, eventObj);
                }
            };
            return TestScene;
        })(nurdz.game.Scene);
        // Once the DOM is loaded, set things up.
        nurdz.contentLoaded(window, function () {
            try {
                // Set up the stage.
                var stage = new nurdz.game.Stage('gameContent');
                // Set up the default values used for creating a screen shot.
                nurdz.game.Stage.screenshotFilenameBase = "screenshot";
                nurdz.game.Stage.screenshotWindowTitle = "Screenshot";
                // Set up the button that will stop the game if something goes wrong.
                setupButton(stage, "controlBtn");
                // Register all of our scenes.
                stage.addScene("sceneName", new TestScene(stage));
                // Switch to the initial scene, add a dot to display and then run the game.
                stage.switchToScene("sceneName");
                stage.run();
            }
            catch (error) {
                console.log("Error starting the game");
                throw error;
            }
        });
    })(main = nurdz.main || (nurdz.main = {}));
})(nurdz || (nurdz = {}));
