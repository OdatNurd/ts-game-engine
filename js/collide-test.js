var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
                // No matter what, toggle the game state. This will put the button back into sync for the next
                // click if it got out of sync.
                finally {
                    // No matter what, toggle the state.
                    gameRunning = !gameRunning;
                    button.innerHTML = gameRunning ? "Stop Game" : "Restart Game";
                }
            });
        }
        /**
         * The types of collisions that we support. This is used strictly to tell the scene what should be
         * following the mouse cursor as it moves around the scene, so that we know what object is in fact
         * colliding with things.
         */
        var CollisionTestType;
        (function (CollisionTestType) {
            /**
             * Collision by checking if a point is inside the object; a dot follows the mouse pointer and the
             * mouse position is used to check which objects collide with it.
             */
            CollisionTestType[CollisionTestType["POINT"] = 0] = "POINT";
            /**
             * Collision by checking if a circle intersects the object; a circle collider follows the mouse
             * pointer and that object is checked to see what it collides with.
             */
            CollisionTestType[CollisionTestType["CIRCLE"] = 1] = "CIRCLE";
            /**
             * Collision by checking if a rectangle intersects the object; a rectangle collider follows the
             * mouse pointer and that object is checked to see what it collides with.
             */
            CollisionTestType[CollisionTestType["RECTANGLE"] = 2] = "RECTANGLE";
        })(CollisionTestType || (CollisionTestType = {}));
        /**
         * This is a simple extension of the scene class; it displays the FPS on the screen.
         *
         * Notice that it also clears the stage; the base Scene class only renders actors but doesn't clear
         * the screen, so that when you override it you can get the actor rendering "for free" without it
         * making assumptions about when it gets invoked.
         */
        var Point = nurdz.game.Point;
        var Vector2D = nurdz.game.Vector2D;
        var Collider = nurdz.game.Collider;
        var ColliderType = nurdz.game.ColliderType;
        var TestScene = /** @class */ (function (_super) {
            __extends(TestScene, _super);
            /**
             * Create a new test scene to be managed by the provided stage.
             *
             * @param stage the stage to manage us/
             */
            function TestScene(stage) {
                var _this = _super.call(this, "A Scene", stage) || this;
                /**
                 * The intersection point or points (if any) between the vector ray and all of the static
                 * collision objects on the stage. This is always an array but it might be empty if there are no
                 * active intersections.
                 */
                _this._vectorIntersects = [];
                /**
                 * A list of origin points that we can use for our collision objects.
                 *
                 * @type {nurdz.game.Point[]}
                 * @private
                 */
                _this._originList = [new Point(0, 0),
                    new Point(64, 0),
                    new Point(64, 64),
                    new Point(0, 64),
                    new Point(32, 32)];
                // No mouse position by default, so set one up.
                _this._mouse = new Point(0, 0);
                // A list of locations to put actors down to keep them separated enough for easy hit testing.
                // The Y coordinate is translated after they're used to make room for the next row.
                var testPos = [new Point(128, 128),
                    new Point(320, 128),
                    new Point(448, 192),
                    new Point(512, 192),
                    new Point(672, 160)];
                // Create the array to hold our colliders.
                _this._colliders = [];
                // Set up all rectangles and their origins; once done we translate the point down for the next
                // row of actors.
                for (var i = 0; i < testPos.length; i++) {
                    // Alias the point
                    var point = testPos[i];
                    // Create the collider and set its origin
                    var collider = new Collider(stage, ColliderType.RECTANGLE, point.x, point.y, 64, 64);
                    collider.origin.setTo(_this._originList[i]);
                    // Store the collider into our array, and translate the point itself for the next row of
                    // items.
                    _this._colliders.push(collider);
                    point.translateXY(0, 192);
                }
                // Now we can do the circles; this works as above, only we don't need to translate the points
                // this time.
                for (var i = 0; i < testPos.length; i++) {
                    // Alias the point
                    var point = testPos[i];
                    // Create the collider and set its origin
                    var collider = new Collider(stage, ColliderType.CIRCLE, point.x, point.y, 32);
                    collider.origin.setTo(_this._originList[i]);
                    _this._colliders.push(collider);
                }
                // Create a rectangle and a circle to use to follow the mouse in the appropriate mode. These
                // aren't added to the actor list; we render them manually.
                _this._rect = new Collider(stage, ColliderType.RECTANGLE, 0, 0, 64, 64);
                _this._circle = new Collider(stage, ColliderType.CIRCLE, 0, 0, 32);
                // The points that control our lines for intersection testing; there is no dragged control
                // initially.
                _this._draggedControl = null;
                _this._lineControls = [];
                _this._lineControls[0] = new nurdz.game.Collider(stage, ColliderType.CIRCLE, 150, 450, 8);
                _this._lineControls[1] = new nurdz.game.Collider(stage, ColliderType.CIRCLE, 750, 550, 8);
                _this._lineControls[2] = new nurdz.game.Collider(stage, ColliderType.CIRCLE, 150, 550, 8);
                _this._lineControls[3] = new nurdz.game.Collider(stage, ColliderType.CIRCLE, 750, 450, 8);
                _this._lineControls[4] = new nurdz.game.Collider(stage, ColliderType.CIRCLE, 350, 250, 8);
                _this._lineControls[5] = new nurdz.game.Collider(stage, ColliderType.CIRCLE, 550, 250, 8);
                // Get the initial intersection (if any).
                _this.recalculateIntersect();
                // Default mode: point; the current collider is thus null.
                _this._mode = CollisionTestType.POINT;
                _this._currentCollider = null;
                return _this;
            }
            /**
             * Perform a calculation to see where our lines intersect; this only needs to be invoked when one
             * of the line endpoints changes.
             */
            TestScene.prototype.recalculateIntersect = function () {
                // Calculate the regular line intersection; this finds any intersection point as if the two
                // line segments project infinitely in both directions.
                this._lineIntersect = nurdz.game.Collision.lineIntersection(this._lineControls[0].position, this._lineControls[1].position, this._lineControls[2].position, this._lineControls[3].position, this._lineIntersect);
                // If we found an intersection, set the color to use to render it based on whether or not it
                // also intersects the line segments.
                if (this._lineIntersect != null) {
                    // Default the color to be red;
                    this._lineIntersectColor = 'red';
                    // Run the same intersection again, but using the segment intersection code instead. If
                    // this still returns a non-null value, then the intersection falls on the actual line
                    // segments, which causes us to change the color.
                    if (nurdz.game.Collision.segmentIntersection(this._lineControls[0].position, this._lineControls[1].position, this._lineControls[2].position, this._lineControls[3].position, this._lineIntersect) != null)
                        this._lineIntersectColor = 'green';
                }
                // Check for collisions between the single vector control line (the last two line control
                // points) and the collision shapes.
                //
                // This requires us to throw away the list of current vector intersects (if any) and push
                // copies of any found intersections into the array.
                var intersect = new Point(0, 0);
                this._vectorIntersects.length = 0;
                for (var i = 0; i < this._colliders.length; i++) {
                    if (this._colliders[i].intersectWithSegment(this._lineControls[4].position, this._lineControls[5].position, intersect) != null)
                        this._vectorIntersects.push(intersect.copy());
                }
            };
            /**
             * Render the appropriate collision object depending on what the mode currently is.
             */
            TestScene.prototype.renderCollisionObject = function () {
                // If we are actively dragging a line control component, then don't do anything here; don't
                // muddy the display while manipulating the line controls.
                if (this._draggedControl != null)
                    return;
                // If we have a collider, render its volume; otherwise, render a point at the mouse position.
                if (this._currentCollider != null)
                    this._currentCollider.renderVolume(this._mouse.x, this._mouse.y, 'green', this._renderer);
                else
                    this._stage.renderer.fillCircle(this._mouse.x, this._mouse.y, 3, 'white');
            };
            /**
             * Renders a line perpendicular to the third control line (points 4 and 5).
             *
             * This is essentially just a visualization for testing the new Vector code.
             */
            TestScene.prototype.renderPerpendicularLine = function () {
                // As a helper alias the two points that we're using. This makes the code a little easier to read.
                var p0 = this._lineControls[4].position;
                var p1 = this._lineControls[5].position;
                // Create a vector version of the line that originates at the first point and extends in the
                // direction of the second point. Once we do that we make it orthogonal to itself with a
                // leftward direction. Lastly, we set its magnitude to be 32.
                var v0 = Vector2D.fromPoint(p1, p0).orthogonalize(true);
                v0.magnitude = 32;
                // Render the vector as a line that is anchored on the first point.
                this._renderer.drawArrow(p0.x, p0.y, p0.x + v0.x, p0.y + v0.y, nurdz.game.ArrowStyle.UNFILLED, nurdz.game.ArrowType.END, Math.PI / 8, 16);
            };
            /**
             * Render the scene.
             */
            TestScene.prototype.render = function () {
                // Clear the screen and invoke the super to render any actors that might be registered, then
                // display the FPS we're running at.
                this._stage.renderer.clear("black");
                _super.prototype.render.call(this);
                this._stage.renderer.drawTxt("FPS: " + this._stage.fps, 16, 16, 'white');
                // Iterate through all of the colliders. We will render them in different colors based on
                // whether or not they are currently colliding.
                for (var i = 0; i < this._colliders.length; i++) {
                    // Get this collision object and then check to see if it's colliding or not.
                    //
                    // If there is a collider, we collide with it, otherwise we collide with the mouse position
                    // (assuming there is one). We don't collide interactively while controlling a line point.
                    var collider = this._colliders[i];
                    var collides = false;
                    if (this._draggedControl == null)
                        collides = (this._currentCollider == null)
                            ? collider.contains(this._mouse)
                            : collider.collidesWith(this._currentCollider);
                    // Render it, using the color determined by whether there is a collision or not.
                    collider.renderVolume(collider.position.x, collider.position.y, collides ? 'red' : 'white', this._renderer);
                }
                // Render the line points.
                this._renderer.setArrowStyle('white', 1);
                for (var i = 0; i < this._lineControls.length; i++) {
                    var control = this._lineControls[i];
                    control.renderVolume(control.position.x, control.position.y, 'gray', this._renderer);
                    // Every second point, render an arrow between the previous point and this point. Our
                    // arrow will have heads on both ends, except for the directional line used for line/shape
                    // intersections, which has a head only on the end so that it is easier to visualize the
                    // direction of the line for testing.
                    if (i % 2 == 1)
                        this._renderer.drawArrow(this._lineControls[i - 1].position.x, this._lineControls[i - 1].position.y, this._lineControls[i].position.x, this._lineControls[i].position.y, nurdz.game.ArrowStyle.UNFILLED, (i == 5 ? nurdz.game.ArrowType.END : nurdz.game.ArrowType.BOTH), Math.PI / 8, 16);
                    // If this is the third (fourth) point, change the color style for the rest of the lines.
                    if (i == 3)
                        this._renderer.setArrowStyle('yellow', 1);
                }
                // Render the temporary perpendicular line to the third line; this is only for testing purposes.
                this.renderPerpendicularLine();
                // If there is an intersection for our line, display it.
                if (this._lineIntersect != null)
                    this._renderer.fillCircle(this._lineIntersect.x, this._lineIntersect.y, 5, this._lineIntersectColor);
                // Render any intersections between the intersection vector and the collision shapes. There
                // can be any number of these, including 0.
                if (this._vectorIntersects.length > 0) {
                    for (var i = 0; i < this._vectorIntersects.length; i++)
                        this._renderer.fillCircle(this._vectorIntersects[i].x, this._vectorIntersects[i].y, 5, 'red');
                }
                // Now we can render the collision object that follows the mouse, and an indication of where
                // the center of the screen is.
                this.renderCollisionObject();
                this._stage.renderer.fillCircle(400, 300, 2, 'red');
            };
            /**
             * Triggers when the mouse is pressed down while on the stage
             *
             * @param eventObj the event that tracks the mouse position
             * @returns {boolean} true if we handle the event, false otherwise
             */
            TestScene.prototype.inputMouseDown = function (eventObj) {
                // Get the position of the mouse at this location. If it's inside any of the line controls,
                // set that control to be the dragged control; this picks the first one found out of expediency.
                var mousePos = this._stage.calculateMousePos(eventObj);
                for (var i = 0; i < this._lineControls.length; i++) {
                    if (this._lineControls[i].contains(mousePos)) {
                        this._draggedControl = this._lineControls[i];
                        return true;
                    }
                }
                // Assume we handled this; it stops the browser from doing its own drag handling.
                return true;
            };
            /**
             * Triggers when the mouse is released; this happens everywhere, not just over the stage.
             *
             * @param eventObj the event that tracks the mouse position
             * @returns {boolean} true if we handle the event, false otherwise
             */
            TestScene.prototype.inputMouseUp = function (eventObj) {
                // Set the dragged control to null to end the drag; if there isn't one, this does nothing.
                this._draggedControl = null;
                return true;
            };
            /**
             * When the mouse moves, magic happens.
             *
             * @param eventObj the mouse event object
             * @returns {boolean} whether or not we handled it
             */
            TestScene.prototype.inputMouseMove = function (eventObj) {
                // Get the mouse position
                this._mouse = this._stage.calculateMousePos(eventObj, this._mouse);
                // Set this position to the position of our collision shapes.
                this._rect.position.setTo(this._mouse);
                this._circle.position.setTo(this._mouse);
                // If we are dragging, then also set the position of the dragged component, and then
                // recalculate the line intersection information.
                if (this._draggedControl != null) {
                    this._draggedControl.position.setTo(this._mouse);
                    this.recalculateIntersect();
                }
                return true;
            };
            /**
             * Triggers every time a key is pressed
             * @param eventObj
             * @returns {boolean}
             */
            TestScene.prototype.inputKeyDown = function (eventObj) {
                switch (eventObj.keyCode) {
                    case KeyCodes.KEY_1:
                    case KeyCodes.KEY_2:
                    case KeyCodes.KEY_3:
                    case KeyCodes.KEY_4:
                    case KeyCodes.KEY_5:
                        this._circle.origin.setTo(this._originList[eventObj.keyCode - KeyCodes.KEY_0 - 1]);
                        this._rect.origin.setTo(this._originList[eventObj.keyCode - KeyCodes.KEY_0 - 1]);
                        return true;
                    case KeyCodes.KEY_P:
                        this._mode = CollisionTestType.POINT;
                        this._currentCollider = null;
                        return true;
                    case KeyCodes.KEY_C:
                        this._mode = CollisionTestType.CIRCLE;
                        this._currentCollider = this._circle;
                        return true;
                    // For the R key, don't say we handled it if the control key was pressed, since that is
                    // the reload key.
                    case KeyCodes.KEY_R:
                        this._mode = CollisionTestType.RECTANGLE;
                        this._currentCollider = this._rect;
                        return !eventObj.ctrlKey;
                    // For the F key, toggle between full screen mode and windowed mode.
                    case KeyCodes.KEY_F:
                        this._stage.toggleFullscreen();
                        return true;
                }
                // Let the default happen
                return _super.prototype.inputKeyDown.call(this, eventObj);
            };
            return TestScene;
        }(nurdz.game.Scene));
        // Once the DOM is loaded, set things up.
        nurdz.contentLoaded(window, function () {
            try {
                // Set up the stage.
                var stage = new nurdz.game.Stage('gameContent', 'black', true, '#a0a0a0');
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
