var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var nurdz;
(function (nurdz) {
    var main;
    (function (main) {
        // Import the key codes module so that we can easily get at the pressed key
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
         * A simple entity that represents a sprite idling and then running.
         */
        var GreyGuy = (function (_super) {
            __extends(GreyGuy, _super);
            /**
             * Create a new guy that will render on the current stage.
             * @param stage
             */
            function GreyGuy(stage) {
                _super.call(this, "A grey guy", stage, stage.width / 2, stage.height - 64, 64, 96, 1, {}, {});
                // Set up a sprite sheet and turn on debugging
                this._sheet = new nurdz.game.SpriteSheet(stage, "sprite_animation.png", 10, 2);
                this._properties.debug = true;
                // Change our origin.
                this._origin.setToXY(this._width / 2, this._height - 1);
                // Set animations up. The first animation becomes active automatically.
                this.addAnimation("idle", 5, true, nurdz.game.Utils.createRange(0, 9));
                this.addAnimation("walk", 15, true, nurdz.game.Utils.createRange(10, 19));
            }
            /**
             * Toggle between our animations whenever we are invoked.
             */
            GreyGuy.prototype.toggleAnimation = function () {
                // Play the animation that is not currently playing.
                this.playAnimation(this._animations.current == "idle" ? "walk" : "idle");
            };
            return GreyGuy;
        })(nurdz.game.Entity);
        /**
         * This simple class just displays an image and slowly rotates in place.
         */
        var Star = (function (_super) {
            __extends(Star, _super);
            /**
             * Construct an instance; it needs to know how it will be rendered.
             *
             * @param stage the stage that owns this actor.
             */
            function Star(stage) {
                // Invoke the super.
                _super.call(this, "A star", stage, stage.width / 2, stage.height / 2, 64, 64, 1, {}, {}, 'green');
                // Give ourselves a sprite sheet.
                this._sheet = new nurdz.game.SpriteSheet(stage, "star_green.png", 1);
                // Turn on our debug property so our bounds get rendered too.
                this._properties.debug = true;
                // Set our origin to be somewhere interesting.
                this.origin.setToXY(64 / 3, 64 / 3);
            }
            /**
             * In our simple update method, we just rotate slowly around.
             *
             * @param stage the stage that owns us
             * @param tick the current game tick
             */
            Star.prototype.update = function (stage, tick) {
                // Advance our angle by 5 degrees. The angle is normalized for us.
                this.angle = this.angle + 5;
            };
            return Star;
        })(nurdz.game.Entity);
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
             * @param sound the sound to play when we bounce off the sides of the screen
             * @param properties the properties to apply to this entity
             */
            function Dot(stage, sound, properties) {
                if (properties === void 0) { properties = {}; }
                // Invoke the super to construct us. We position ourselves in the center of the stage.
                _super.call(this, "A dot", stage, stage.width / 2, stage.height / 2, 20, 20, 1, properties, {
                    xSpeed: nurdz.game.Utils.randomIntInRange(-5, 5),
                    ySpeed: nurdz.game.Utils.randomIntInRange(-5, 5),
                }, 'red');
                // Our radius is half our width because our position is registered via the center of our own
                // bounds.
                this._radius = this._width / 2;
                // Set our origin to be the center of ourselves.
                this._origin.setToXY(this._width / 2, this._height / 2);
                // Save the sound we were given.
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
                var _this = this;
                _super.call(this, "A Scene", stage);
                /**
                 * This is invoked every time one of our images preloads; we get told which one has been loaded.
                 *
                 * @param image the image that loaded
                 */
                this.imageLoadComplete = function (image) {
                    console.log(_this._name, "finished loading", image.src);
                };
                /**
                 * This is invoked every time one of our sounds preloads; we get the sound object, from which we
                 * can get the tag and also a determination on whether or not it is music or a sound effect.
                 *
                 * @param sound the sound (or music) that loaded
                 */
                this.soundLoadComplete = function (sound) {
                    console.log(_this._name, "finished loading", sound.isMusic ? "music" : "sound", sound.tag.src);
                };
                // By default, we're playing music and sounds.
                this._playMusic = true;
                this._playSounds = true;
                // Preload a bounce sound
                var bounce = stage.preloadSound("bounce_wall", this.soundLoadComplete);
                // Preload some music.
                this._music = stage.preloadMusic("WhoLikesToParty", this.soundLoadComplete);
                // Create some dot entities.
                var dot1 = new Dot(stage, bounce, { debug: true });
                var dot2 = new Dot(stage, bounce, { debug: false });
                // Give the dots sprite sheets.
                dot1.sheet = new nurdz.game.SpriteSheet(stage, "ball_blue.png", 1);
                dot2.sheet = new nurdz.game.SpriteSheet(stage, "ball_yellow.png", 1);
                // Create the grey guy; he will set up his own sprite sheet.
                this._guy = new GreyGuy(stage);
                // Now add the dots entities and a star entity to ourselves so that they get updated and rendered.
                this.addActor(new Star(stage));
                this.addActor(this._guy);
                this.addActor(dot1);
                this.addActor(dot2);
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
                this._stage.renderer.fillCircle(400, 300, 2, 'red');
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
                    // Toggle the animation of the guy.
                    case KeyCodes.KEY_SPACEBAR:
                        this._guy.toggleAnimation();
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
