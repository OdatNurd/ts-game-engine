var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * The aspects of the engine that deal with tiles instead of pixels assume that this is the size of
         * tiles (in pixels). Tiles are assumed to be square.
         *
         * @const
         * @type {number}
         */
        game.TILE_SIZE = 32;
        /**
         * The width of the game stage (canvas) in pixels.
         *
         * @const
         * @type {number}
         */
        game.STAGE_WIDTH = 800;
        /**
         * The height of the game stage (canvas) in pixels.
         *
         * @const
         * @type {number}
         */
        game.STAGE_HEIGHT = 600;
        /**
         * The width of the game stage (canvas), in tiles.
         *
         * @const
         * @type {Number}
         */
        game.STAGE_TILE_WIDTH = Math.floor(game.STAGE_WIDTH / game.TILE_SIZE);
        /**
         * The height of the game stage (canvas), in tiles.
         *
         * @const
         * @type {Number}
         */
        game.STAGE_TILE_HEIGHT = Math.floor(game.STAGE_HEIGHT / game.TILE_SIZE);
        /**
         * This enumeration contains key code constants for use in keyboard events. Not all useful keys are
         * implemented here just yet. Add as required.
         */
        (function (KeyCodes) {
            KeyCodes[KeyCodes["KEY_ENTER"] = 13] = "KEY_ENTER";
            KeyCodes[KeyCodes["KEY_SPACEBAR"] = 32] = "KEY_SPACEBAR";
            // Arrow keys
            KeyCodes[KeyCodes["KEY_LEFT"] = 37] = "KEY_LEFT";
            KeyCodes[KeyCodes["KEY_UP"] = 38] = "KEY_UP";
            KeyCodes[KeyCodes["KEY_RIGHT"] = 39] = "KEY_RIGHT";
            KeyCodes[KeyCodes["KEY_DOWN"] = 40] = "KEY_DOWN";
            // Alpha keys; these are all a single case because shift state is tracked separately.
            KeyCodes[KeyCodes["KEY_A"] = 65] = "KEY_A";
            KeyCodes[KeyCodes["KEY_B"] = 66] = "KEY_B";
            KeyCodes[KeyCodes["KEY_C"] = 67] = "KEY_C";
            KeyCodes[KeyCodes["KEY_D"] = 68] = "KEY_D";
            KeyCodes[KeyCodes["KEY_E"] = 69] = "KEY_E";
            KeyCodes[KeyCodes["KEY_F"] = 70] = "KEY_F";
            KeyCodes[KeyCodes["KEY_G"] = 71] = "KEY_G";
            KeyCodes[KeyCodes["KEY_H"] = 72] = "KEY_H";
            KeyCodes[KeyCodes["KEY_I"] = 73] = "KEY_I";
            KeyCodes[KeyCodes["KEY_J"] = 74] = "KEY_J";
            KeyCodes[KeyCodes["KEY_K"] = 75] = "KEY_K";
            KeyCodes[KeyCodes["KEY_L"] = 76] = "KEY_L";
            KeyCodes[KeyCodes["KEY_M"] = 77] = "KEY_M";
            KeyCodes[KeyCodes["KEY_N"] = 78] = "KEY_N";
            KeyCodes[KeyCodes["KEY_O"] = 79] = "KEY_O";
            KeyCodes[KeyCodes["KEY_P"] = 80] = "KEY_P";
            KeyCodes[KeyCodes["KEY_Q"] = 81] = "KEY_Q";
            KeyCodes[KeyCodes["KEY_R"] = 82] = "KEY_R";
            KeyCodes[KeyCodes["KEY_S"] = 83] = "KEY_S";
            KeyCodes[KeyCodes["KEY_T"] = 84] = "KEY_T";
            KeyCodes[KeyCodes["KEY_U"] = 85] = "KEY_U";
            KeyCodes[KeyCodes["KEY_V"] = 86] = "KEY_V";
            KeyCodes[KeyCodes["KEY_W"] = 87] = "KEY_W";
            KeyCodes[KeyCodes["KEY_X"] = 88] = "KEY_X";
            KeyCodes[KeyCodes["KEY_Y"] = 89] = "KEY_Y";
            KeyCodes[KeyCodes["KEY_Z"] = 90] = "KEY_Z";
            // Function keys
            KeyCodes[KeyCodes["KEY_F1"] = 112] = "KEY_F1";
            KeyCodes[KeyCodes["KEY_F2"] = 113] = "KEY_F2";
            KeyCodes[KeyCodes["KEY_F3"] = 114] = "KEY_F3";
            KeyCodes[KeyCodes["KEY_F4"] = 115] = "KEY_F4";
            KeyCodes[KeyCodes["KEY_F5"] = 116] = "KEY_F5";
            KeyCodes[KeyCodes["KEY_F6"] = 117] = "KEY_F6";
            KeyCodes[KeyCodes["KEY_F7"] = 118] = "KEY_F7";
            KeyCodes[KeyCodes["KEY_F8"] = 119] = "KEY_F8";
            KeyCodes[KeyCodes["KEY_F9"] = 120] = "KEY_F9";
            KeyCodes[KeyCodes["KEY_F10"] = 121] = "KEY_F10";
            KeyCodes[KeyCodes["KEY_F11"] = 122] = "KEY_F11";
            KeyCodes[KeyCodes["KEY_F12"] = 123] = "KEY_F12";
        })(game.KeyCodes || (game.KeyCodes = {}));
        var KeyCodes = game.KeyCodes;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents a single point as a pair of X,Y coordinates. This also includes simple operations
         * such as setting and clamping of values, as well as making copies and comparisons.
         *
         * Most API functions provided come in a variety that takes an X,Y and one that takes another point,
         * so that calling code can use whatever it most appropriate for the situation without having to box
         * or un-box values.
         */
        var Point = (function () {
            /**
             * Construct a new point that uses the provided X and Y values as its initial coordinate.
             *
             * @param x X-coordinate of this point
             * @param y Y-coordinate of this point
             * @constructor
             */
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            /**
             * Return a new point instance that is a copy of this point.
             *
             * @returns {Point} a duplicate of this point
             * @see Point.copyTranslatedXY
             */
            Point.prototype.copy = function () {
                return new Point(this.x, this.y);
            };
            /**
             * Return a new point instance that is a copy of this point, with its values translated by the values
             * passed in.
             *
             * @param translation the point to translate this point by
             * @returns {Point} a duplicate of this point, translated by the value passed in
             * @see Point.copy
             * @see Point.copyTranslatedXY
             */
            Point.prototype.copyTranslated = function (translation) {
                return this.copyTranslatedXY(translation.x, translation.y);
            };
            /**
             * Return a new point instance that is a copy of this point, with its values translated by the values
             * passed in.
             *
             * @param x the amount to translate the X value by
             * @param y the amount to translate the Y value by
             * @returns {Point} a duplicate of this point, translated by the value passed in
             * @see Point.copy
             * @see Point.copyTranslated
             */
            Point.prototype.copyTranslatedXY = function (x, y) {
                var retVal = this.copy();
                return retVal.translateXY(x, y);
            };
            /**
             * Create and return a copy of this point in which each component is divided by the factor provided.
             * This allows for some simple coordinate conversions in a single step. After conversion the points
             * are rounded down to ensure that the coordinates remain integers.
             *
             * This is a special case of scale() that is more straight forward for use in some cases.
             *
             * @param factor the amount to divide each component of this point by
             * @returns {Point} a copy of this point with its values divided by the passed in factor
             * @see Point.scale
             * @see Point.copyScaled
             */
            Point.prototype.copyReduced = function (factor) {
                return this.copy().reduce(factor);
            };
            /**
             * Create and return a copy of this point in which each component is scaled by the scale factor
             * provided. This allows for some simple coordinate conversions in a single step. After conversion the
             * points are rounded down to ensure that the coordinates remain integers.
             *
             * @param {Number} scale the amount to multiply each component of this point by
             * @returns {Point} a copy of this point with its values scaled by the passed in factor
             * @see Point.reduce
             * @see Point.copyReduced
             */
            Point.prototype.copyScaled = function (scale) {
                return this.copy().scale(scale);
            };
            /**
             * Set the position of this point to the same as the point passed in.
             *
             * @param point the point to copy from
             * @returns {Point} this point after the operation completes, for chaining calls.
             */
            Point.prototype.setTo = function (point) {
                return this.setToXY(point.x, point.y);
            };
            /**
             * Set the position of this point to the same as the values passed in
             *
             * @param x new X-coordinate for this point
             * @param y new Y-coordinate for this point
             * @returns {Point} this point after the operation completes, for chaining calls.
             */
            Point.prototype.setToXY = function (x, y) {
                this.x = x;
                this.y = y;
                return this;
            };
            /**
             * Compares this point to the point passed in to determine if they represent the same point.
             *
             * @param other the point to compare to
             * @returns {boolean} true or false depending on equality
             */
            Point.prototype.equals = function (other) {
                return this.x == other.x && this.y == other.y;
            };
            /**
             * Compares this point to the values passed in to determine if they represent the same point.
             *
             * @param x the X-coordinate to compare to
             * @param y the Y-coordinate to compare to
             * @returns {boolean} true or false depending on equality
             */
            Point.prototype.equalsXY = function (x, y) {
                return this.x == x && this.y == y;
            };
            /**
             * Translate the location of this point using the values of the point passed in. No range checking is
             * done.
             *
             * @param delta the point that controls both delta values
             * @returns {Point} this point after the translation, for chaining calls.
             */
            Point.prototype.translate = function (delta) {
                return this.translateXY(delta.x, delta.y);
            };
            /**
             * Translate the location of this point using the values passed in. No range checking is done.
             *
             * @param deltaX the change in X-coordinate
             * @param deltaY the change in Y-coordinate
             * @returns {Point} this point after the translation, for chaining calls.
             */
            Point.prototype.translateXY = function (deltaX, deltaY) {
                this.x += deltaX;
                this.y += deltaY;
                return this;
            };
            /**
             * Calculate and return the value of the point that is some distance away from this point at the angle
             * provided.
             *
             * This works by using trig and assuming that the point desired is the point that describes the
             * hypotenuse of a right triangle.
             *
             * @param angle the angle desired, in degrees
             * @param distance the desired distance from this point
             * @returns {Point} the resulting point
             */
            Point.prototype.pointAtAngle = function (angle, distance) {
                // Convert the incoming angle to radians.
                angle *= (Math.PI / 180);
                // We treat this like a right angle triangle problem.
                //
                // Since we know that the cosine is the ratio between the lengths of the adjacent and hypotenuse
                // and the sine is the ratio between the opposite and the hypotenuse, we can calculate those
                // values for the angle we were given, realizing that the adjacent side is the X component and
                // the opposite is the Y component (draw it on paper if you need to).  By multiplying each value
                // with the distance required (the provided distance is the length of the hypotenuse in the
                // triangle), we determine what the actual X and Y values for the point is.  Note that these
                // calculations assume that the origin is the point from which the hypotenuse extends, and so we
                // need to translate the calculated values by the position of that point to get the final
                // location of where the end of the line falls.
                return new Point(Math.cos(angle), Math.sin(angle)).scale(distance).translate(this);
            };
            /**
             * Reduce the components in this point by dividing each by the factor provided. This allows for some
             * simple coordinate conversions in a single step. After conversion the points are rounded down to
             * ensure that the coordinates remain integers.
             *
             * This is a special case of scale() that is more straight forward for use in some cases.
             *
             * @param factor the amount to divide each component of this point by
             * @returns {Point} a copy of this point with its values divided by the passed in factor
             * @see Point.scale
             * @see Point.copyScaled
             */
            Point.prototype.reduce = function (factor) {
                this.x = Math.floor(this.x / factor);
                this.y = Math.floor(this.y / factor);
                return this;
            };
            /**
             * Scale the components in this point by multiplying each by the scale factor provided. This allows
             * for some simple coordinate conversions in a single step. After conversion the points are rounded
             * down to ensure that the coordinates remain integers.
             *
             * @param scale the amount to multiply each component of this point by
             * @returns {Point} this point after the scale, for chaining calls.
             * @see Point.reduce
             * @see Point.copyReduced
             */
            Point.prototype.scale = function (scale) {
                this.x = Math.floor(this.x * scale);
                this.y = Math.floor(this.y * scale);
                return this;
            };
            /**
             * Clamp the value of the X-coordinate of this point so that it is between the min and max values
             * provided, inclusive.
             *
             * @param minX the minimum X-coordinate to allow
             * @param maxX the maximum Y-coordinate to allow
             * @returns {Point} this point after the clamp is completed, for chaining calls.
             */
            Point.prototype.clampX = function (minX, maxX) {
                if (this.x < minX)
                    this.x = minX;
                else if (this.x > maxX)
                    this.x = maxX;
                return this;
            };
            /**
             * Clamp the value of the Y-coordinate of this point so that it is between the min and max values
             * provided, inclusive.
             *
             * @param minY the minimum Y-coordinate to allow
             * @param maxY the maximum Y-coordinate to allow
             * @returns {Point} this point after the clamp is completed, for chaining calls.
             */
            Point.prototype.clampY = function (minY, maxY) {
                if (this.y < minY)
                    this.y = minY;
                else if (this.y > maxY)
                    this.y = maxY;
                return this;
            };
            /**
             * Clamp the X and Y values of the provided point so that they are within the bounds of the stage
             * provided.
             *
             * @param stage the stage to clamp to
             * @returns {Point} this point after the clamp is completed, for chaining calls.
             */
            Point.prototype.clampToStage = function (stage) {
                this.clampX(0, stage.pixelWidth - 1);
                this.clampY(0, stage.pixelHeight - 1);
                return this;
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Point.prototype.toString = function () {
                // TODO This looks kinda ugly to me, bring String.format over instead
                return "[" + this.x + ", " + this.y;
            };
            return Point;
        })();
        game.Point = Point;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents the base class for any game object of any base type. This base class
         * implementation has a position and knows how to render itself.
         *
         */
        var Actor = (function () {
            /**
             *
             * @param name the internal name for this actor instance, for debugging
             * @param stage the stage that will be used to display this actor
             * @param x X co-ordinate of the location for this actor, in world coordinates
             * @param y Y co-ordinate of the location for this actor, in world coordinates
             * @param width the width of this actor, in pixels
             * @param height the height of this actor, in pixels
             * @param zOrder the Z-order of this actor when rendered (smaller numbers render before larger ones)
             * @param debugColor the color specification to use in debug rendering for this actor
             * @constructor
             */
            function Actor(name, stage, x, y, width, height, zOrder, debugColor) {
                if (zOrder === void 0) { zOrder = 1; }
                if (debugColor === void 0) { debugColor = 'white'; }
                // Save the passed in values.
                this.name = name;
                this.stage = stage;
                this.width = width;
                this.height = height;
                this.zOrder = zOrder;
                this.debugColor = debugColor;
                // For position we save the passed in position and then make a reduced copy to turn it into
                // tile coordinates for the map position.
                this.position = new game.Point(x, y);
                this.mapPosition = this.position.copyReduced(game.TILE_SIZE);
            }
            Object.defineProperty(Actor.prototype, "layer", {
                /**
                 * Get the layer (Z-Order) of this actor. When rendered, actors with a lower Z-Order are rendered
                 * before actors with a higher Z-Order; thus this sets the rendering and display order for actors
                 * by type.
                 *
                 * @returns {number}
                 */
                get: function () { return this.zOrder; },
                enumerable: true,
                configurable: true
            });
            /**
             * Update internal stage for this actor. The default implementation does nothing.
             *
             * @param stage the stage that the actor is on
             */
            Actor.prototype.update = function (stage) {
            };
            /**
             * Render this actor to the stage provided. The default implementation renders a positioning box
             * for this actor using its position and size using the debug color set at construction time.
             *
             * @param stage the stage to render this actor to
             */
            Actor.prototype.render = function (stage) {
                // Draw a filled rectangle for actor using the debug color.
                stage.fillRect(this.position.x, this.position.y, this.width, this.height, this.debugColor);
            };
            /**
             * Set the position of this actor by setting its position on the stage in world coordinates. The
             * position of the actor on the map will automatically be updated as well.
             *
             * @param point the new position for this actor
             */
            Actor.prototype.setStagePosition = function (point) {
                this.setStagePositionXY(point.x, point.y);
            };
            /**
             /**
             * Set the position of this actor by setting its position on the stage in world coordinates. The
             * position of the actor on the map will automatically be updated as well.
             *
             * @param x the new X coordinate for the actor
             * @param y the new Y coordinate for the actor
             */
            Actor.prototype.setStagePositionXY = function (x, y) {
                this.position.setToXY(x, y);
                this.mapPosition = this.position.copyReduced(game.TILE_SIZE);
            };
            /**
             * Set the position of this actor by setting its position on the map in ile coordinates. The
             * position of the actor in the world will automatically be updated as well.
             *
             * @param point the new position for this actor
             */
            Actor.prototype.setMapPosition = function (point) {
                this.setMapPositionXY(point.x, point.y);
            };
            /**
             * Set the position of this actor by setting its position on the map in ile coordinates. The
             * position of the actor in the world will automatically be updated as well.
             *
             * @param x the new X coordinate for this actor
             * @param y the new Y coordinate for this actor
             */
            Actor.prototype.setMapPositionXY = function (x, y) {
                this.mapPosition.setToXY(x, y);
                this.position = this.mapPosition.copyScaled(game.TILE_SIZE);
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Actor.prototype.toString = function () {
                return "[Actor name=" + this.name + "]";
            };
            return Actor;
        })();
        game.Actor = Actor;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents an Entity, which is a specific subclass of Actor that is designed to be
         * interactive with other actors and entities. An entity contains properties that can help define its
         * runtime behaviour.
         *
         * The properties provided may be extended with default values, depending on the subclass. Subclasses
         * can set this.defaultProperties to a set of properties that should be applied if they do not already
         * exist in the property set.
         *
         * Each subclass of Entity is responsible for making sure to blend the defaults with those of their
         * parent class so that the chained constructor calls set up the properties as appropriate.
         *
         * By default, entities support the following properties:
         *   - 'id': string (default: auto generated value)
         *      - specifies the id of this entity for use in identifying/finding/triggering this entity.
         */
        var Entity = (function (_super) {
            __extends(Entity, _super);
            // TODO This does not have the notion of default properties to apply yet
            /**
             *
             * @param name the internal name for this entity instance, for debugging
             * @param stage the stage that will be used to display this entity
             * @param x X co-ordinate of the location for this entity, in world coordinates
             * @param y Y co-ordinate of the location for this entity, in world coordinates
             * @param width the width of this entity, in pixels
             * @param height the height of this entity, in pixels
             * @param properties entity specific properties to apply to this entity
             * @param zOrder the Z-order of this entity when rendered (smaller numbers render before larger ones)
             * @param debugColor the color specification to use in debug rendering for this entity
             * @constructor
             */
            function Entity(name, stage, x, y, width, height, properties, zOrder, debugColor) {
                if (zOrder === void 0) { zOrder = 1; }
                if (debugColor === void 0) { debugColor = 'white'; }
                // Invoke the super class constructor.
                _super.call(this, name, stage, x, y, width, height, zOrder, debugColor);
                // Save the properties we were given, then validate them.
                this.properties = properties;
                this.validateProperties();
            }
            /**
             * Every time this method is invoked, it returns a new unique entity id string to apply to the id
             * property of an entity.
             *
             * @returns {string}
             */
            Entity.createDefaultID = function () {
                Entity.autoEntityID++;
                return "_ng_entity" + Entity.autoEntityID;
            };
            /**
             * This helper method is for validating entity properties. The method checks if a property with
             * the name given exists and is also (optionally) of an expected type. You can also specify if the
             * property is required or not; a property that is not required only throws an error if it exists
             * but is not of the type provided.
             *
             * The value for the expected type (when not null) are whatever the typeof operator can return,
             * plus the extra type 'array' which indicates that the value must be an array.
             *
             * @param name the name of the property to validate.
             * @param expectedType the expected type of the value of the property, or null if we don't care.
             * @param required true when this property is required and false when it is optional
             * @param values either null or an array of contains all of the possible valid values for the property
             * @throws {Error} if the property is not valid for any reason
             */
            Entity.prototype.isPropertyValid = function (name, expectedType, required, values) {
                if (values === void 0) { values = null; }
                // Get the value of the property (if any).
                var propertyValue = this.properties[name];
                // Does the property exist?
                if (propertyValue == null) {
                    // It does not. If it's not required, then return. Otherwise, complain that it's missing.
                    if (required)
                        throw new ReferenceError("Entity " + this.name + ": missing property '" + name + "'");
                    else
                        return;
                }
                // If we got an expected type and it's not right, throw an error.
                if (expectedType != null) {
                    // Get the actual type of the value and see if it matched.
                    var actualType = (Array.isArray(propertyValue) ? "array" : typeof (propertyValue));
                    if (actualType != expectedType)
                        throw new TypeError("Entity " + this.name + ": invalid property '" + name + "': expected " + expectedType);
                }
                // If we got a list of possible values and this property actually exists, make sure that the
                // value is one of them.
                if (values != null && propertyValue != null) {
                    for (var i = 0; i < values.length; i++) {
                        if (propertyValue == values[i])
                            return;
                    }
                    // If we get here, we did not find the value in the list of valid values.
                    throw new RangeError("Entity " + this.name + ": invalid value for property '" + name + "': not in allowable list");
                }
            };
            /**
             * This method is automatically invoked at construction time to validate that the properties object
             * provided is valid as far as we can tell (i.e. needed properties exist and have a sensible value).
             *
             * This does not need to check if the values are valid as far as the other entities are concerned
             * (i.e. does a property that expects an entity id actually represent a valid entity) as that
             * happens elsewhere; further, that entity might not be created yet.
             *
             * This should throw an error if any properties are invalid.
             *
             * @throw {Error} if any properties in this entity are invalid
             */
            Entity.prototype.validateProperties = function () {
                // If there is not an id property, install it first.
                if (this.properties.id == null)
                    this.properties.id = Entity.createDefaultID();
                // Validate that the id property is a string (in case it was already there) and exists.
                this.isPropertyValid("id", "string", true);
            };
            /**
             * Query whether this entity blocks movement of actors or not. By default, all entities are solid.
             *
             * @returns {boolean}
             */
            Entity.prototype.blocksActorMovement = function () {
                return true;
            };
            /**
             * This method is invoked whenever this entity gets triggered by another entity. This can happen
             * programmatically or in response to interactions with other entities, which does not include
             * collision (see triggerTouch() for that).
             *
             * The method gets passed the Actor that caused the trigger to happen, although this can be null
             * depending on how the trigger happened.
             *
             * @param activator the actor that triggered this entity, or null if unknown
             * @see Entity.triggerTouch
             */
            Entity.prototype.trigger = function (activator) {
                if (activator === void 0) { activator = null; }
            };
            /**
             * This method is invoked whenever this entity gets triggered by another entity as a result of a
             * direct collision (touch). This can happen programmatically or in response to interactions with other
             * entities. This does not include non-collision interactions (see trigger() for that).
             *
             * The method gets passed the Actor that caused the trigger to happen.
             *
             * @param activator the actor that triggered this entity by touching (colliding) with it
             * @see Entity.trigger
             */
            Entity.prototype.triggerTouch = function (activator) {
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Entity.prototype.toString = function () {
                return "[Entity name=" + this.name + "]";
            };
            /**
             * Every time an entity ID is automatically generated, this value is appended to it to give it a
             * unique number.
             *
             * @type {number}
             */
            Entity.autoEntityID = 0;
            return Entity;
        })(game.Actor);
        game.Entity = Entity;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class is the base class for all scenes in a game. A Scene is just a simple wrapper around
         * specific handling for input handling as well as object update and rendering, which allows for better
         * object isolation.
         *
         * This base class defines the behaviour of a scene as it applies to a game; you should subclass it to
         * implement your own specific handling as needed.
         */
        var Scene = (function () {
            /**
             * Construct a new scene instances that has the given name and is managed by the provided stage.
             *
             * The new scene starts with an empty actor list.
             *
             * @param name the name of this scene for debug purposes
             * @param stage the stage that manages this scene
             * @constructor
             */
            function Scene(name, stage) {
                // Store the name and stage provided.
                this.name = name;
                this.stage = stage;
                // Start with an empty actor list
                this.actorList = [];
            }
            Object.defineProperty(Scene.prototype, "actors", {
                /**
                 * Get the complete list of actors that are currently registered with this scene.
                 *
                 * @returns {Array<Actor>}
                 */
                get: function () { return this.actorList; },
                enumerable: true,
                configurable: true
            });
            /**
             * This method is invoked at the start of every game frame to allow this scene to update the state of
             * all objects that it contains.
             *
             * This base version invokes the update method for all actors that are currently registered with the
             * scene.
             */
            Scene.prototype.update = function () {
                for (var i = 0; i < this.actorList.length; i++)
                    this.actorList[i].update(this.stage);
            };
            /**
             * This method is invoked every frame after the update() method is invoked to allow this scene to
             * render to the stage everything that it visually wants to appear.
             *
             * This base version invokes the render method for all actors that are currently registered with the
             * stage.
             */
            Scene.prototype.render = function () {
                for (var i = 0; i < this.actorList.length; i++)
                    this.actorList[i].render(this.stage);
            };
            /**
             * This method is invoked when this scene is becoming the active scene in the game. This can be used
             * to initialize (or re-initialize) anything in this scene that should be reset when it becomes
             * active.
             *
             * This gets invoked after the current scene is told that it is deactivating. The parameter passed in
             * is the scene that was previously active. This will be null if this is the first ever scene in the
             * game.
             *
             * The next call made of the scene will be its update method for the next frame.
             *
             * @param previousScene the previous scene, if any (the very first scene change in the game has no
             * previous scene)
             */
            Scene.prototype.activating = function (previousScene) {
                if (previousScene === void 0) { previousScene = null; }
                console.log("Scene activation:", this.toString());
            };
            /**
             * This method is invoked when this scene is being deactivated in favor of a different scene. This can
             * be used to persist any scene state or do any other house keeping.
             *
             * This gets invoked before the next scene gets told that it is becoming active. The parameter
             * passed in is the scene that will become active.
             *
             * @param nextScene the scene that is about to become active
             */
            Scene.prototype.deactivating = function (nextScene) {
                console.log("Scene deactivation:", this.toString());
            };
            /**
             * Add an actor to the list of actors that exist in this scene. This will cause the scene to
             * automatically invoke the update and render methods on this actor while this scene is active.
             *
             * @param actor the actor to add to the scene
             * @see Scene.addActorArray
             */
            Scene.prototype.addActor = function (actor) {
                this.actorList.push(actor);
            };
            /**
             * Add all of the actors from the passed in array to the list of actors that exist in this scene. This
             * will cause the scene to automatically invoke the update and render methods on these actors while
             * the scene is active.
             *
             * @param actorArray the list of actors to add
             * @see Scene.addActorArray
             */
            Scene.prototype.addActorArray = function (actorArray) {
                for (var i = 0; i < actorArray.length; i++)
                    this.addActor(actorArray[i]);
            };
            // TODO extend this API to also allow finding actors by map location
            /**
             * Return a list of actors whose position matches the position passed in. This is probably most useful
             * when actors are at rigidly defined locations, such as in a tile based game. Note that this
             * checks the world position of the actor and not its map position.
             *
             * @param location the location to search for actors at
             * @returns {Array<Actor>} the actors found at the given location, which may be none
             */
            Scene.prototype.actorsAt = function (location) {
                return this.actorsAtXY(location.x, location.y);
            };
            /**
             * Return a list of actors whose position matches the position passed in. This is probably most useful
             * when actors are at rigidly defined locations, such as in a tile based game. Note that this
             * checks the world position of the actor and not its map position.
             *
             * @param x the x coordinate to search for actors at
             * @param y the y coordinate to search for actors at
             *
             * @returns {Array<Actor>} the actors found at the given location, which may be none
             */
            Scene.prototype.actorsAtXY = function (x, y) {
                var retVal = [];
                for (var i = 0; i < this.actorList.length; i++) {
                    var actor = this.actorList[i];
                    if (actor.position.x == x && actor.position.y == y)
                        retVal.push(actor);
                }
                return retVal;
            };
            /**
             * This method will sort all of the actors that are currently attached to the scene by their current
             * internal Z-Order value, so that when they are iterated for rendering/updates, they get handled in
             * an appropriate order.
             *
             * Note that the sort used is not stable.
             */
            Scene.prototype.sortActors = function () {
                this.actorList.sort(function (left, right) { return left.layer - right.layer; });
            };
            /**
             * This gets triggered while the game is running, this scene is the current scene, and a key has been
             * pressed down.
             *
             * The method should return true if the key event was handled or false if it was not. The Stage will
             * prevent the default handling for all key events that are handled.
             *
             * @param eventObj the event object
             * @returns {boolean} true if the key event was handled, false otherwise
             */
            Scene.prototype.inputKeyDown = function (eventObj) {
                return false;
            };
            /**
             * This gets triggered while the game is running, this scene is the current scene, and a key has been
             * released.
             *
             * The method should return true if the key event was handled or false if it was not. The Stage will
             * prevent the default handling for all key events that are handled.
             *
             * @param eventObj the event object
             * @returns {boolean} true if the key event was handled, false otherwise
             */
            Scene.prototype.inputKeyUp = function (eventObj) {
                return false;
            };
            /**
             * This gets triggered while the game is running, this scene is the current scene, and the mouse
             * moves over the stage.
             *
             * @param eventObj the event object
             * @see Stage.calculateMousePos
             */
            Scene.prototype.inputMouseMove = function (eventObj) {
            };
            /**
             * This gets triggered while the game is running, this scene is the current scene, and the mouse
             * is clicked on the stage.
             *
             * @param eventObj the event object
             * @see Stage.calculateMousePos
             */
            Scene.prototype.inputMouseClick = function (eventObj) {
            };
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
             */
            Scene.prototype.screenshot = function (filename, windowTitle) {
                if (filename === void 0) { filename = "screenshot"; }
                if (windowTitle === void 0) { windowTitle = "Screenshot"; }
                // Create a window to hold the screen shot.
                var wind = window.open("about:blank", "screenshot");
                // Create a special data URI which the browser will interpret as an image to display.
                var imageURL = this.stage.canvasObject.toDataURL();
                // Append the screenshot number to the window title and also to the filename for the generated
                // image, then advance the screenshot counter for the next image.
                filename += ((Scene.ss_format + Scene.ss_number).slice(-Scene.ss_format.length)) + ".png";
                windowTitle += " " + Scene.ss_number;
                Scene.ss_number++;
                // Now we need to write some HTML into the new document. The image tag using our data URL will
                // cause the browser to display the image. Wrapping it in the anchor tag with the same URL and a
                // download attribute is a hint to the browser that when the image is clicked, it should download
                // it using the name provided.
                //
                // This might not work in all browsers, in which case clicking the link just displays the image.
                // You can always save via a right click.
                wind.document.write("<head><title>" + windowTitle + "</title></head>");
                wind.document.write('<a href="' + imageURL + '" download="' + filename + '">');
                wind.document.write('<img src="' + imageURL + '" title="' + windowTitle + '"/>');
                wind.document.write('</a>');
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Scene.prototype.toString = function () {
                return "[Scene name=" + this.name + "]";
            };
            /**
             * Every time a screenshot is generated, this value is used in the filename. It is then incremented.
             *
             * @type {number}
             */
            Scene.ss_number = 0;
            /**
             * This template is used to determine the number at the end of a screenshot filename. The end
             * characters are replaced with the current number of the screenshot. This implicitly specifies
             * how many screenshots can be taken in the same session without the filename overflowing.
             *
             * @type {string}
             */
            Scene.ss_format = "0000";
            return Scene;
        })();
        game.Scene = Scene;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
// TODO Several things in this class are static when they should just be private since there is only one Stage
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents the stage area in the page, which is where the game renders itself.
         *
         * The class knows how to create the stage and do some rendering. This is also where the core
         * rendering loop is contained.
         */
        var Stage = (function () {
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
            function Stage(containerDivID, initialColor) {
                if (initialColor === void 0) { initialColor = 'black'; }
                /**
                 * The width of the stage, in pixels. This is set at creation time and cannot change.
                 *
                 * @const
                 * @type {number}
                 */
                this.width = game.STAGE_WIDTH;
                /**
                 * The height of the stage, in pixels. This is set at creation time and cannot change.
                 *
                 * @const
                 * @type {number}
                 */
                this.height = game.STAGE_HEIGHT;
                // Obtain the container element that we want to insert the canvas into.
                var container = document.getElementById(containerDivID);
                if (container == null)
                    throw new ReferenceError("Unable to create stage: No such element with ID '" + containerDivID + "'");
                // Create the canvas and give it the appropriate dimensions.
                this.canvas = document.createElement("canvas");
                this.canvas.width = this.width;
                this.canvas.height = this.height;
                // Modify the style of the container div to make it center horizontally.
                container.style.width = this.width + "px";
                container.style.height = this.height + "px";
                container.style.marginLeft = "auto";
                container.style.marginRight = "auto";
                // Get the context for the canvas and then clear it.
                this.canvasContext = this.canvas.getContext('2d');
                this.clear(initialColor);
                // Append the canvas to the container
                container.appendChild(this.canvas);
            }
            Object.defineProperty(Stage.prototype, "pixelWidth", {
                /**
                 * The width of the stage, in pixels. This is set at creation time and cannot change.
                 *
                 * @type {number} the width of the stage area in pixels
                 */
                get: function () { return this.width; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "pixelHeight", {
                /**
                 * The height of the stage, in pixels. This is set at creation time and cannot change.
                 *
                 * @type {number} the height of the stage area in pixels
                 */
                get: function () { return this.height; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "context", {
                /**
                 * Get the underlying rendering context for the stage.
                 *
                 * @returns {CanvasRenderingContext2D} the underlying rendering context for the stage
                 */
                get: function () { return this.canvasContext; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "canvasObject", {
                /**
                 * Get the underlying canvas object for the stage.
                 *
                 * @returns {HTMLCanvasElement} the underlying canvas element for the stage
                 */
                get: function () { return this.canvas; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "fps", {
                /**
                 * The stage keeps track of the current frame rate that the update loop is being called at, and this
                 * returns the most recently calculated value. The value is recalculated once per second so that
                 * it is always a near instantaneous read of the current fps and not an average over the life of
                 * the game.
                 *
                 * @returns {Number} the current fps, which is o when the game is stopped orr just started
                 */
                get: function () { return Stage.fps; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "currentScene", {
                /**
                 * Determine what scene is the current scene on this stage.
                 *
                 * @returns {Scene}
                 */
                get: function () { return Stage.currentScene; },
                enumerable: true,
                configurable: true
            });
            /**
             * This function gets executed in a loop to run the game. Each execution will cause an update and
             * render to be issued to the current scene.
             *
             * In practice, this gets invoked on a timer at the desired FPS that the game should run at.
             */
            Stage.sceneLoop = function () {
                // Get the current time for this frame and the elapsed time since we started.
                var currentTime = new Date().getTime();
                var elapsedTime = (currentTime - Stage.startTime) / 1000;
                // This counts as a frame.
                Stage.frameNumber++;
                // Calculate the FPS now
                Stage.fps = Stage.frameNumber / elapsedTime;
                // If a second or more has elapsed, reset the count. We don't want an average over time, we want
                // the most recent numbers so that we can see momentary drops.
                if (elapsedTime > 1) {
                    Stage.startTime = new Date().getTime();
                    Stage.frameNumber = 0;
                }
                try {
                    // If there is a scene change scheduled, change it now.
                    if (Stage.nextScene != null && Stage.nextScene !== Stage.currentScene) {
                        // Tell the current scene that it is deactivating and what scene is coming next.
                        Stage.currentScene.deactivating(Stage.nextScene);
                        // Save the current scene, then swap to the new one
                        var previousScene = Stage.currentScene;
                        Stage.currentScene = Stage.nextScene;
                        // Now tell the current scene that it is activating, telling it what scene used to be in
                        // effect.
                        Stage.currentScene.activating(previousScene);
                        // Clear the flag now.
                        Stage.nextScene = null;
                    }
                    // Do the frame update now
                    Stage.currentScene.update();
                    Stage.currentScene.render();
                }
                catch (error) {
                    console.log("Caught exception in sceneLoop(), stopping the game");
                    clearInterval(Stage.gameTimerID);
                    Stage.gameTimerID = null;
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
            Stage.prototype.run = function (fps) {
                if (fps === void 0) { fps = 30; }
                if (Stage.gameTimerID != null)
                    throw new Error("Attempt to start the game running when it is already running");
                // Reset the variables we use for frame counts.
                Stage.startTime = 0;
                Stage.frameNumber = 0;
                // Fire off a timer to invoke our scene loop using an appropriate interval.
                Stage.gameTimerID = setInterval(Stage.sceneLoop, 1000 / fps);
                // Turn on input events.
                Stage.enableInputEvents(this.canvas);
            };
            /**
             * Stop a running game. This halts the update loop but otherwise has no effect. Thus after this call,
             * the game just stops where it was.
             *
             * It is legal to start the game running again via another call to run(), so long as your scenes are
             * not time sensitive.
             *
             * @see Stage.run
             */
            Stage.prototype.stop = function () {
                // Make sure the game is running.
                if (Stage.gameTimerID == null)
                    throw new Error("Attempt to stop the game when it is not running");
                // Stop it.
                clearInterval(Stage.gameTimerID);
                Stage.gameTimerID = null;
                // Turn off input events.
                Stage.disableInputEvents(this.canvas);
            };
            /**
             * Register a scene object with the stage using a textual name. This scene can then be switched to
             * via
             * the switchToScene method.
             *
             * You can invoke this with null as a scene object to remove a scene from the internal scene list.
             * You
             * can also register the same object multiple times with different names, if that's interesting to
             * you.
             *
             * It is an error to attempt to register a scene using the name of a scene that already exists.
             *
             * @param name the symbolic name to use for this scene
             * @param newScene the scene object to add
             * @see Scene.switchToScene
             */
            Stage.prototype.addScene = function (name, newScene) {
                if (newScene === void 0) { newScene = null; }
                // If this name is in use and we were given a scene object, we should complain.
                if (Stage.sceneList[name] != null && newScene != null)
                    console.log("Warning: overwriting scene registration for scene named " + name);
                // Save the scene
                Stage.sceneList[name] = newScene;
            };
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
            Stage.prototype.switchToScene = function (sceneName) {
                if (sceneName === void 0) { sceneName = null; }
                // Get the actual new scene, which might be null if the scene named passed in is null.
                var newScene = sceneName != null ? Stage.sceneList[sceneName] : null;
                // If we were given a scene name and there was no such scene, complain before we leave.
                if (sceneName != null && newScene == null) {
                    console.log("Attempt to switch to unknown scene named " + sceneName);
                    return;
                }
                Stage.nextScene = newScene;
            };
            /**
             * Clear the entire stage with the provided color.
             *
             * @param color the color to clear the stage with.
             */
            Stage.prototype.clear = function (color) {
                if (color === void 0) { color = 'black'; }
                this.canvasContext.fillStyle = color;
                this.canvasContext.fillRect(0, 0, this.width, this.height);
            };
            /**
             * Render a filled rectangle with its upper left corner at the position provided and with the provided
             * dimensions.
             *
             * @param x X location of the upper left corner of the rectangle
             * @param y Y location of the upper left corner of the rectangle
             * @param width width of the rectangle to render
             * @param height height of the rectangle to render
             * @param color the color to fill the rectangle with
             */
            Stage.prototype.fillRect = function (x, y, width, height, color) {
                this.canvasContext.fillStyle = color;
                this.canvasContext.fillRect(x, y, width, height);
            };
            /**
             * Render a filled circle with its center at the position provided.
             *
             * @param x X location of the center of the circle
             * @param y Y location of the center of the circle
             * @param radius radius of the circle to draw
             * @param color the color to fill the circle with
             */
            Stage.prototype.fillCircle = function (x, y, radius, color) {
                this.canvasContext.fillStyle = color;
                this.canvasContext.beginPath();
                this.canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
                this.canvasContext.fill();
            };
            /**
             * This helper method sets all of the styles necessary for rendering lines to the stage. This can be
             * called before drawing operations as a convenience to set all desired values in one call.
             *
             * NOTE: The values set here *do not* persist unless you never change them anywhere else. This
             * includes setting arrow styles.
             *
             * @param color the color to draw lines with
             * @param lineWidth] the pixel width of rendered lines
             * @param lineCap the line cap style to use for rendering lines
             * @see Stage.setArrowStyle
             */
            Stage.prototype.setLineStyle = function (color, lineWidth, lineCap) {
                if (lineWidth === void 0) { lineWidth = 3; }
                if (lineCap === void 0) { lineCap = "round"; }
                this.canvasContext.strokeStyle = color;
                this.canvasContext.lineWidth = lineWidth;
                this.canvasContext.lineCap = lineCap;
            };
            // TODO This can use an enum for the style now, to make code look nicer
            /**
             * This helper method draws the actual arrow head onto the canvas for a line. It assumes that all
             * styles have been set.
             *
             * The original drawArrow code allows its style parameter to be an instance of a function with this
             * signature to allow for custom arrow drawing, but that was removed.
             *
             * The function takes three sets of coordinates, which represent the endpoint of the line that the
             * arrow head is being drawn for (which is where the tip of the arrow should be), and the two
             * endpoints for the ends of the arrow head. These three points connected together form the arrow
             * head, though you are free to join them in any way you like (lines, arcs, etc).
             *
             * @param x0 the X coordinate of the left end of the arrow head line
             * @param y0 the Y coordinate of the left end of the arrow head line
             * @param x1 the X coordinate of the end of the line
             * @param y1 the Y coordinate of the end of the line
             * @param x2 the X coordinate of the right end of the arrow head line
             * @param y2 the Y coordinate of the right end of the arrow head line
             * @param style the style of arrow to drw
             */
            Stage.prototype.drawHead = function (x0, y0, x1, y1, x2, y2, style) {
                var backDistance;
                // First, the common drawing operations. Generate a line from the left of the arrow head to the
                // point of the arrow and then down the other side.
                this.canvasContext.save();
                this.canvasContext.beginPath();
                this.canvasContext.moveTo(x0, y0);
                this.canvasContext.lineTo(x1, y1);
                this.canvasContext.lineTo(x2, y2);
                // Now use the style to finish the arrow head.
                switch (style) {
                    // The arrow head has a curved line that connects the two sides together.
                    case 0:
                        backDistance = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
                        this.canvasContext.arcTo(x1, y1, x0, y0, .55 * backDistance);
                        this.canvasContext.fill();
                        break;
                    // The arrow head has a straight line that connects the two sides together.
                    case 1:
                        this.canvasContext.beginPath();
                        this.canvasContext.moveTo(x0, y0);
                        this.canvasContext.lineTo(x1, y1);
                        this.canvasContext.lineTo(x2, y2);
                        this.canvasContext.lineTo(x0, y0);
                        this.canvasContext.fill();
                        break;
                    // The arrow head is unfilled, so we're already done.
                    case 2:
                        this.canvasContext.stroke();
                        break;
                    // The arrow head has a curved line, but the arc is a quadratic curve instead of just a
                    // simple arc.
                    case 3:
                        var cpx = (x0 + x1 + x2) / 3;
                        var cpy = (y0 + y1 + y2) / 3;
                        this.canvasContext.quadraticCurveTo(cpx, cpy, x0, y0);
                        this.canvasContext.fill();
                        break;
                    // The arrow has a curved line, but the arc is a bezier curve instead of just a simple arc.
                    case 4:
                        var cp1x, cp1y, cp2x, cp2y;
                        var shiftAmt = 5;
                        if (x2 == x0) {
                            // Avoid a divide by zero if x2==x0
                            backDistance = y2 - y0;
                            cp1x = (x1 + x0) / 2;
                            cp2x = (x1 + x0) / 2;
                            cp1y = y1 + backDistance / shiftAmt;
                            cp2y = y1 - backDistance / shiftAmt;
                        }
                        else {
                            backDistance = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
                            var xBack = (x0 + x2) / 2;
                            var yBack = (y0 + y2) / 2;
                            var xMid = (xBack + x1) / 2;
                            var yMid = (yBack + y1) / 2;
                            var m = (y2 - y0) / (x2 - x0);
                            var dX = (backDistance / (2 * Math.sqrt(m * m + 1))) / shiftAmt;
                            var dY = m * dX;
                            cp1x = xMid - dX;
                            cp1y = yMid - dY;
                            cp2x = xMid + dX;
                            cp2y = yMid + dY;
                        }
                        this.canvasContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x0, y0);
                        this.canvasContext.fill();
                        break;
                }
                this.canvasContext.restore();
            };
            /**
             * Set the style for all subsequent drawArrow() calls to use when drawing arrows. This needs to be
             * called prior to drawing any arrows to ensure that the canvas style used to draw arrows is updated;
             * the value does not persist. In particular, changing line styles will also change this.
             *
             * @param color the color to draw an arrow with
             * @param lineWidth the width of the arrow line
             * @see Stage.setLineStyle
             */
            Stage.prototype.setArrowStyle = function (color, lineWidth) {
                if (lineWidth === void 0) { lineWidth = 2; }
                this.canvasContext.strokeStyle = color;
                this.canvasContext.fillStyle = color;
                this.canvasContext.lineWidth = lineWidth;
            };
            // TODO this can use Enums for the style and also the which
            /**
             * The basis of this code comes from:
             *     http://www.dbp-consulting.com/tutorials/canvas/CanvasArrow.html
             *
             * It has been modified to fit here, which includes things like assuming nobody is going to pass
             * strings, different method for specifying defaults, etc.
             *
             * This will render a line from x1,y1 to x2,y2 and then draw an arrow head on one or both ends of the
             * line in a few different styles.
             *
             * The style parameter can be one of the following values:
             *   0: Arrowhead with an arc end
             *   1: Arrowhead with a straight line end
             *   2: Arrowhead that is unfilled with no end (looks like a V)
             *   3: Arrowhead with a quadratic curve end
             *   4: Arrowhead with a bezier curve end
             *
             * The which parameter indicates which end of the line gets an arrow head. This is a bit field where
             * the first bit indicates the end of the line and the second bit indicates the start of the line.
             *
             * It is also possible to specify the angle that the arrow head makes from the end of the line and the
             * length of the sides of the arrow head.
             *
             * The arrow is drawn using the style set by setArrowStyle(), which is a combination of a stoke and
             * fill color and a line width.
             *
             * @param x1 the X coordinate of the start of the line
             * @param y1 the Y coordinate of the start of the line
             * @param x2 the X coordinate of the end of the line
             * @param y2 the Y coordinate of the end of the line
             * @param style the style of the arrowhead
             * @param which the end of the line that gets the arrow head(s)
             * @param angle the angle the arrow head makes from the end of the line
             * @param d the length (in pixels) of the edges of the arrow head
             * @see Stage.setArrowStyle
             */
            Stage.prototype.drawArrow = function (x1, y1, x2, y2, style, which, angle, d) {
                if (style === void 0) { style = 3; }
                if (which === void 0) { which = 1; }
                if (angle === void 0) { angle = Math.PI / 8; }
                if (d === void 0) { d = 16; }
                // For ends with arrow we actually want to stop before we get to the arrow so that wide lines
                // won't put a flat end on the arrow caused by the rendered line end cap.
                var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
                var ratio = (dist - d / 3) / dist;
                var toX, toY, fromX, fromY;
                // When the first bit is set, the end point of the line gets an arrow.
                if ((which & 1) != 0) {
                    toX = Math.round(x1 + (x2 - x1) * ratio);
                    toY = Math.round(y1 + (y2 - y1) * ratio);
                }
                else {
                    toX = x2;
                    toY = y2;
                }
                // When the second bit is set, the start point of the line gets an arrow.
                if ((which & 2) != 0) {
                    fromX = x1 + (x2 - x1) * (1 - ratio);
                    fromY = y1 + (y2 - y1) * (1 - ratio);
                }
                else {
                    fromX = x1;
                    fromY = y1;
                }
                // Draw the shaft of the arrow
                this.canvasContext.beginPath();
                this.canvasContext.moveTo(fromX, fromY);
                this.canvasContext.lineTo(toX, toY);
                this.canvasContext.stroke();
                // Calculate the angle that the line is going so that we can align the arrow head properly.
                var lineAngle = Math.atan2(y2 - y1, x2 - x1);
                // Calculate the line length of the side of the arrow head. We know the length if the line was
                // straight, so we need to have its length when it's rotated to the angle that it is to be drawn
                // at. h is the line length of a side of the arrow head
                var h = Math.abs(d / Math.cos(angle));
                var angle1, angle2, topX, topY, botX, botY;
                // When the first bit is set, we want to draw an arrow head at the end of the line.
                if ((which & 1) != 0) {
                    angle1 = lineAngle + Math.PI + angle;
                    topX = x2 + Math.cos(angle1) * h;
                    topY = y2 + Math.sin(angle1) * h;
                    angle2 = lineAngle + Math.PI - angle;
                    botX = x2 + Math.cos(angle2) * h;
                    botY = y2 + Math.sin(angle2) * h;
                    this.drawHead(topX, topY, x2, y2, botX, botY, style);
                }
                // WHen the second bit is set, we want to draw an arrow head at the start of the line.
                if ((which & 2) != 0) {
                    angle1 = lineAngle + angle;
                    topX = x1 + Math.cos(angle1) * h;
                    topY = y1 + Math.sin(angle1) * h;
                    angle2 = lineAngle - angle;
                    botX = x1 + Math.cos(angle2) * h;
                    botY = y1 + Math.sin(angle2) * h;
                    this.drawHead(topX, topY, x1, y1, botX, botY, style);
                }
            };
            /**
             * Display text to the stage at the position provided. How the the text anchors to the point provided
             * needs to be set by you prior to calling. By default, the location specified is the top left
             * corner.
             *
             * This method will set the color to the color provided but all other font properties will be as they
             * were last set for the canvas.
             *
             * @param text the text to draw
             * @param x X location of the text
             * @param y Y location of the text
             * @param color the color to draw the text with
             */
            Stage.prototype.drawTxt = function (text, x, y, color) {
                this.canvasContext.fillStyle = color;
                this.canvasContext.fillText(text, x, y);
            };
            /**
             * Displays a bitmap to the stage such that its upper left corner is at the point provided.
             *
             * @param bitmap the bitmap to display
             * @param x X location to display the bitmap at
             * @param y Y location to display the bitmap at
             * @see Stage.drawBmpCentered
             * @see Stage.drawBmpCenteredRotated
             */
            Stage.prototype.drawBmp = function (bitmap, x, y) {
                this.canvasContext.drawImage(bitmap, x, y);
            };
            // TODO this and the methods below should use our internal method for translation and/or rotation
            /**
             * Displays a bitmap to the stage such that its center is at the point provided.
             *
             * @param bitmap the bitmap to display
             * @param x X location to display the center of the bitmap at
             * @param y Y location to display the center of the bitmap at
             * @see Stage.drawBmp
             * @see Stage.drawBmpCenteredRotated
             */
            Stage.prototype.drawBmpCentered = function (bitmap, x, y) {
                this.canvasContext.save();
                this.canvasContext.translate(x, y);
                this.canvasContext.drawImage(bitmap, -(bitmap.width / 2), -(bitmap.height / 2));
                this.canvasContext.restore();
            };
            // TODO this should take the angle in degrees, or have a duplicate that takes them
            /**
             * Display a bitmap to the stage such that its center is at the point provided. The bitmap is also
             * rotated according to the rotation value, which is an angle in radians.
             *
             * @param bitmap the bitmap to display
             * @param x X location to display the center of the bitmap at
             * @param y Y location to display the center of the bitmap at
             * @param angle the angle to rotate the bitmap to (in radians)
             * @see Stage.drawBmp
             * @see Stage.drawBmpCentered
             */
            Stage.prototype.drawBmpCenteredRotated = function (bitmap, x, y, angle) {
                this.canvasContext.save();
                this.canvasContext.translate(x, y);
                this.canvasContext.rotate(angle);
                this.canvasContext.drawImage(bitmap, -(bitmap.width / 2), -(bitmap.height / 2));
                this.canvasContext.restore();
            };
            /**
             * Do an (optional) translation and (optional) rotation of the stage canvas. You can perform one or
             * both operations. This implicitly saves the current canvas state on a stack so that it can be
             * restored later via a call to restore().
             *
             * When both an X and a Y value are provided, the canvas is translated so that the origin is moved in
             * the translation direction given. One or both values can be null to indicate that no translation is
             * desired.
             *
             * When the angle is not null, the canvas is rotated by that many degrees around the origin.
             *
             * The order of operations is always translation first and rotation second, because once the rotation
             * happens, the direction of the axes are no longer what you expect. In particular this means that you
             * should be careful about invoking this function when the canvas has already been translated and/or
             * rotated.
             *
             * Note that the current translation and rotation of the canvas is held on a stack, so every call to
             * this method needs to be balanced with a call to the restore() method.
             *
             * @param x the amount to translate on the X axis or null for no translation
             * @param y the amount to translate on the Y axis or null for no translation
             * @param angle the angle to rotate the canvas, in degreesm or null for no translation
             * @see Stage.restore
             */
            Stage.prototype.translateAndRotate = function (x, y, angle) {
                if (x === void 0) { x = null; }
                if (y === void 0) { y = null; }
                if (angle === void 0) { angle = null; }
                // First, save the canvas context.
                this.canvasContext.save();
                // If we are translating, translate now.
                if (x != null && y != null)
                    this.canvasContext.translate(x, y);
                // If we are rotating, rotate now.
                if (angle != null)
                    this.canvasContext.rotate(angle * (Math.PI / 180));
            };
            /**
             * Restore the canvas state that was in effect the last time that translateAndRotate was invoked. This
             * needs to be invoked the same number of times as that function was invoked because the canvas state
             * is stored on a stack.
             *
             * @see Stage.translateAndRotate
             */
            Stage.prototype.restore = function () {
                this.canvasContext.restore();
            };
            /**
             * Given an event that represents a mouse event for the stage, calculate the position that the mouse
             * is actually at relative to the top left of the stage. This is needed because the position of mouse
             * events is normally relative to the document itself, which may be larger than the actual window.
             *
             * @param mouseEvent the mouse movement or click event
             * @returns {Point} the point of the mouse click/pointer position on the stage
             */
            Stage.prototype.calculateMousePos = function (mouseEvent) {
                // Some math has to be done because the mouse position is relative to document, which may have
                // dimensions larger than the current viewable area of the browser window.
                //
                // As a result, we need to ensure that we take into account the position of the canvas in the
                // document AND the scroll position of the document.
                var rect = this.canvas.getBoundingClientRect();
                var root = document.documentElement;
                var mouseX = mouseEvent.clientX - rect.left - root.scrollLeft;
                var mouseY = mouseEvent.clientY - rect.top - root.scrollTop;
                return new game.Point(mouseX, mouseY);
            };
            /**
             * Handler for key down events. This gets triggered whenever the game is running and any key is
             * pressed.
             *
             * @param evt the event object for this event
             */
            Stage.keyDownEvent = function (evt) {
                if (Stage.currentScene.inputKeyDown(evt))
                    evt.preventDefault();
            };
            /**
             * Handler for key up events. This gets triggered whenever the game is running and any key is
             * released.
             *
             * @param evt the event object for this event
             */
            Stage.keyUpEvent = function (evt) {
                if (Stage.currentScene.inputKeyUp(evt))
                    evt.preventDefault();
            };
            /**
             * Handler for mouse movement events. This gets triggered whenever the game is running and the mouse
             * moves over the stage.
             *
             * @param evt the event object for this event
             */
            Stage.mouseMoveEvent = function (evt) {
                Stage.currentScene.inputMouseMove(evt);
            };
            /**
             * Handler for mouse movement events. This gets triggered whenever the game is running and the mouse is
             * clicked over the canvas.
             *
             * @param evt the event object for this event
             */
            Stage.mouseClickEvent = function (evt) {
                Stage.currentScene.inputMouseClick(evt);
            };
            /**
             * Turn on input handling for the game. This will capture keyboard events from the document and mouse
             * events for the canvas provided.
             *
             * @param canvas the canvas to listen for mouse events on.
             */
            Stage.enableInputEvents = function (canvas) {
                // Mouse events are specific to the canvas.
                canvas.addEventListener('mousemove', Stage.mouseMoveEvent);
                canvas.addEventListener('mousedown', Stage.mouseClickEvent);
                // Keyboard events are document wide because a canvas can't hold the input focus.
                document.addEventListener('keydown', Stage.keyDownEvent);
                document.addEventListener('keyup', Stage.keyUpEvent);
            };
            /**
             * Turn off input handling for the game. This will turn off keyboard events from the document and
             * mouse events for the canvas provided.
             */
            Stage.disableInputEvents = function (canvas) {
                canvas.removeEventListener('mousemove', Stage.mouseMoveEvent);
                canvas.removeEventListener('mousedown', Stage.mouseClickEvent);
                document.removeEventListener('keydown', Stage.keyDownEvent);
                document.removeEventListener('keyup', Stage.keyUpEvent);
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Stage.prototype.toString = function () {
                return "[Stage dimensions=" + this.width + "x" + this.height + " tileSize=" + game.TILE_SIZE + "]";
            };
            /**
             * The currently active scene on the stage. This is the scene that gets all of the user input and
             * the one that the stage reflects all update and render calls to during the game loop.
             *
             * @type {Scene}
             */
            Stage.currentScene = new game.Scene("defaultScene", null);
            /**
             * The scene that should become active next (if any). When a scene change request happens, the
             * scene to be switched to is stored in this value to ensure that the switch happens at the end of
             * the current update cycle, which happens asynchronously.
             *
             * The value here is null when there is no scene change scheduled.
             *
             * @type {Scene|null}
             */
            Stage.nextScene = null;
            /**
             * A list of all of the registered scenes in the stage. The keys are a symbolic string name and
             * the values are the actual Scene instance objects that the names represent.
             *
             * @type {{}}
             */
            Stage.sceneList = {};
            /**
             * When the engine is running, this is the timer ID of the system timer that keeps the game loop
             * running. Otherwise, this is null.
             *
             * @type {number|null}
             */
            Stage.gameTimerID = null;
            /**
             * The FPS that the engine is currently running at. This is recalculated once per second so that
             * slow update times don't get averaged out over a longer run, which makes the number less useful.
             *
             * @type {number}
             */
            Stage.fps = 0;
            /**
             * When calculating FPS, this is the time that the most recent frame count started. Once we have
             * counted frames for an entire second, this is reset and the count starts again.
             *
             * @type {number}
             */
            Stage.startTime = 0;
            /**
             * When calculating FPS, this is the number of frames that we have seen over the last second. When
             * the startTime gets reset, so does this. This makes sure that spontaneous frame speed changes
             * (e.g. a scene bogging down) don't get averaged away.
             *
             * @type {number}
             */
            Stage.frameNumber = 0;
            return Stage;
        })();
        game.Stage = Stage;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
var nurdz;
(function (nurdz) {
    var game;
    (function (game) {
        /**
         * This class represents a Tile in a game, for games that require that. This encapsulates information as
         * to what the textual (for debugging) and numeric (for map data) ID's of a tile are, as well as the
         * ability to render to a stage and provide other information such as blocking.
         */
        var Tile = (function () {
            /**
             * Construct a new tile instance with the given name and ID values. This instance will render
             * itself using the debug color provided (as a filled rectangle).
             *
             * @param name the textual name of this tile type, for debugging purposes
             * @param internalID the numeric id of this tile type, for use in map data
             * @param debugColor the color to render as in debug mode
             */
            function Tile(name, internalID, debugColor) {
                if (debugColor === void 0) { debugColor = 'yellow'; }
                // Save the passed in values.
                this.name = name;
                this.tileID = internalID;
                this.debugColor = debugColor;
            }
            /**
             * Query whether this tile blocks the movement of actors on the map or not.
             *
             * @returns {boolean}
             */
            Tile.prototype.blocksActorMovement = function () {
                return true;
            };
            /**
             * Render this tile to the location provided on the given stage.
             *
             * This default version of the method renders the tile as a solid rectangle of the appropriate
             * dimensions using the debug color given at construction time.
             *
             * @param stage the stage to render onto
             * @param x the X coordinate to draw the tile at
             * @param y the Y coordinate to draw the tile at
             */
            Tile.prototype.render = function (stage, x, y) {
                stage.fillRect(x, y, game.TILE_SIZE, game.TILE_SIZE, this.debugColor);
            };
            /**
             * Return a string representation of the object, for debugging purposes.
             *
             * @returns {String} a debug string representation
             */
            Tile.prototype.toString = function () {
                return "[Tile name=" + this.name + " id=" + this.tileID + "]";
            };
            return Tile;
        })();
        game.Tile = Tile;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
