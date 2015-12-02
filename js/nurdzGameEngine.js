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
            Stage.prototype.fillRect = function (x, y, width, height, color) {
            };
            return Stage;
        })();
        game.Stage = Stage;
    })(game = nurdz.game || (nurdz.game = {}));
})(nurdz || (nurdz = {}));
