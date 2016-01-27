module nurdz.game
{
    /**
     * This class represents the base class for any game object of any base type. This base class
     * implementation has a position and knows how to render itself.
     *
     */
    export class Actor
    {
        /**
         * The name of this actor type, for debugging purposes. There may be many actors with the same name.
         *
         * @type {string}
         */
        protected _name : string;

        /**
         * The stage that this actor is displayed on. This is used for rendering.
         *
         * @type {Stage}
         */
        protected _stage : Stage;

        /**
         * The position of this actor in the world. These coordinates are in pixel coordinates.
         *
         * @type {Point}
         */
        protected _position : Point;

        /**
         * The position of this actor in the tile map. These coordinates are in tiles.
         *
         * @type {Point}
         */
        protected _mapPosition : Point;

        /**
         * The sprite sheet associated with this actor; this defaults to null. If this is set, a
         * combination of this and _sprite is used in the rendering method to render this actor.
         */
        protected _sheet : SpriteSheet;

        /**
         * The sprite in the attached sprite sheet to use to render this actor in the render method. If
         * there is no sprite sheet attached, or this value is out of bounds for the given sheet, nothing
         * happens.
         */
        protected  _sprite : number;

        /**
         * The angle that the entity is rendered at. This is measured in degrees with 0 being to the
         * right, 90 degrees being downward and 270 being upward (due to the Y axis increasing in a
         * downward fashion).
         *
         * Note that the angle of an entity does not affect its collisions, currently.
         */
        protected _angle : number;

        /**
         * The origin of this Actor for rendering and collision detection purposes. The X and Y values
         * here are subtracted from the position when this entity is rendered or when it is considered for
         * any collision detection.
         *
         * A value of (0, 0) means that the position is relative to the top left corner, (width, height)
         * is the bottom right corner, and (width / 2, height / 2) represents the center.
         *
         * You can use larger or smaller values to position the sprite outside of its location if desired.
         *
         * In use, the values here should be subtracted from the position given in the render call in
         * order to render with the origin in the appropriate location.
         */
        protected _origin : Point;

        /**
         * The width of this actor, in pixels. This represents the bounding box.
         *
         * @type {number}
         */
        protected _width : number;

        /**
         * The height of this actor, in pixels. This represents the bounding box.
         *
         * @type {number}
         */
        protected _height : number;

        /**
         * The Z-ordering (layer) for this entity. When rendered, actors with a lower Z-Order are rendered
         * before actors with a higher Z-Order, allowing some to appear over others.
         *
         * @type {number}
         */
        protected _zOrder : number;

        /**
         * The color to render debug markings for this actor with.
         *
         * @type {string}
         */
        protected _debugColor : string;

        /**
         * The position of this actor in the tile map. These coordinates are in tiles.
         *
         * @returns {Point}
         */
        get mapPosition () : Point
        { return this._mapPosition; }

        /**
         * The position of this actor in the world. These coordinates are in pixel coordinates.
         *
         * @returns {Point}
         */
        get position () : Point
        { return this._position; }

        /**
         * Get the origin of this actor, which is the offset from its position that is used to determine
         * where it renders and its hit box is located.
         *
         * @returns {Point}
         */
        get origin () : Point
        { return this._origin; }

        /**
         * Get the width of this actor, in pixels.
         *
         * @returns {number}
         */
        get width () : number
        { return this._width; }

        /**
         * Get the height of this actor, in pixels.
         *
         * @returns {number}
         */
        get height () : number
        { return this._height; }

        /**
         * Get the layer (Z-Order) of this actor. When rendered, actors with a lower Z-Order are rendered
         * before actors with a higher Z-Order; thus this sets the rendering and display order for actors
         * by type.
         *
         * @returns {number}
         */
        get zOrder () : number
        { return this._zOrder; }

        /**
         * Set the layer (Z-Order) of this actor. When rendered, actors with a lower Z-Order are rendered
         * before actors with a higher Z-Order; thus this sets the rendering and display order for actors
         * by type.
         *
         * @param newZOrder the new zOrder value
         */
        set zOrder (newZOrder : number)
        { this._zOrder = newZOrder; }

        /**
         * Get the stage that owns this actor.
         *
         * @returns {Stage}
         */
        get stage () : Stage
        { return this._stage; }

        /**
         * The sprite sheet that is attached to this actor, or null if there is no sprite sheet currently
         * attached.
         *
         * @returns {SpriteSheet}
         */
        get sheet () : SpriteSheet
        { return this._sheet; }

        /**
         * Change the sprite sheet associated with this actor to the sheet passed in. Setting the sheet to
         * null turns off the sprite sheet for this actor.
         *
         * @param newSheet the new sprite sheet to attach or null to remove the current sprite sheet
         */
        set sheet (newSheet : SpriteSheet)
        { this._sheet = newSheet; }

        /**
         * Get the sprite index of the sprite in the attached sprite sheet that this actor uses to render
         * itself. This value has no meaning if no sprite sheet is currently attached to this actor.
         *
         * @returns {number}
         */
        get sprite () : number
        { return this._sprite; }

        /**
         * Change the sprite index of the sprite in the attached sprite sheet that this actor uses to
         * render itself. If there is no sprite sheet currently attached to this actor, or if the sprite
         * index is not valid, this has no effect.
         *
         * @param newSprite the new sprite value to use from the given sprite sheet.
         */
        set sprite (newSprite : number)
        { this._sprite = newSprite; }

        /**
         * Get the rotation angle that this Actor renders at (in degrees); 0 is to the right, 90 is
         * downward and 270 is upward (because the Y axis increases downward). This only affects rendering,
         * currently.
         *
         * @returns {number}
         */
        get angle () : number
        { return this._angle; }

        /**
         * Set the rotation angle that this Actor renders at (in degrees, does not affect collision
         * detection).
         *
         * The value is normalized to the range 0-359.
         *
         * @param newAngle the new angle to render at
         */
        set angle (newAngle : number)
        {
            newAngle %= 360;
            if (newAngle < 0)
                newAngle += 360;
            this._angle = newAngle % 360;
        }

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
        constructor (name : string, stage : Stage, x : number, y : number, width : number, height : number,
                     zOrder : number = 1, debugColor : string = 'white')
        {
            // Save the passed in values.
            this._name = name;
            this._stage = stage;
            this._width = width;
            this._height = height;
            this._zOrder = zOrder;
            this._debugColor = debugColor;

            // Default to the first sprite of a nonexistent sprite sheet and a rotation of 0.
            this._sheet = null;
            this._sprite = 0;
            this._angle = 0;

            // For position we save the passed in position and then make a reduced copy to turn it into
            // tile coordinates for the map position.
            this._position = new Point (x, y);
            this._mapPosition = this._position.copyReduced (TILE_SIZE);

            // The origin defaults to 0, 0 (upper left corner).
            this._origin = new Point (0, 0);
        }

        /**
         * Update internal stage for this actor. The default implementation does nothing.
         *
         * @param stage the stage that the actor is on
         * @param tick the game tick; this is a count of how many times the game loop has executed
         */
        update (stage : Stage, tick : number) : void
        {

        }

        /**
         * Render the bounding box and origin of this actor using the renderer provided. As in the render
         * method, the position provided represents the actual position of the Actor as realized on the
         * screen, which may be different from its actual position if scrolling or a viewport of some sort is
         * in use.
         *
         * The position provided here is adjusted by the origin of the actor so that the (x, y) provided
         * always represent the upper left corner of the area in which to render this Actor.
         *
         * This will render the bounding box of this actor by rendering a rectangle of the proper width
         * and height located at the provided location, and a dot representing the Actor origin point.
         *
         * @param x the x location of the upper left position to render the actor at, in stage coordinates
         * (NOT world), ignoring any origin that might be set
         * @param y the y location of he upper left position to render the actor at, in stage coordinates
         *     (NOT
         * world), ignoring any origin that might be set.
         * @param renderer the class to use to render the actor
         * @see Actor.render
         */
        renderBounds (x : number, y : number, renderer : Renderer) : void
        {
            // Draw a filled rectangle for actor using the debug color.
            renderer.strokeRect (x, y, this._width, this._height, this._debugColor, 1);

            // Now render the origin, which is an offset from where we have actually rendered.
            renderer.fillCircle (x + this._origin.x, y + this._origin.y, 4, this._debugColor);
        }

        /**
         * Render this actor using the renderer provided. The position provided represents the actual position
         * of the Actor as realized on the screen, which may be different from its actual position if
         * scrolling or a viewport of some sort is in use.
         *
         * The position provided here does not take the origin of the actor into account and is just a
         * representation of its actual position; thus your render code needs to take the origin into
         * account.
         *
         * Inside the render method, to get the adjusted position you can subtract the origin offset from
         * the values provided.
         *
         * This default method renders the current sprite in the attached sprite sheet if those values are
         * set and valid, or a bounding box with a dot that represents the origin offset if that is not
         * the case. This ensures that no matter what, the actor renders its position accurately on the
         * stage.
         *
         * @param x the x location to render the actor at, in stage coordinates (NOT world)
         * @param y the y location to render the actor at, in stage coordinates (NOT world)
         * @param renderer the class to use to render the actor
         */
        render (x : number, y : number, renderer : Renderer) : void
        {
            // Translate the canvas to be where our origin point is (which is an offset from the location
            // that we were given) and then rotate the canvas to the appropriate angle.
            renderer.translateAndRotate (x, y, this._angle);

            // If there is a sprite sheet attached AND the sprite index is valid for it, render it. If
            // not, we render our bounds instead. In both cases, we need to offset our rendering by our
            // origin point so that we render at the location that we expect to.
            if (this._sheet != null && this._sprite >= 0 && this._sprite < this._sheet.count)
                this._sheet.blit (this._sprite, -this._origin.x, -this._origin.y, renderer);
            else
                this.renderBounds (-this._origin.x, -this._origin.y, renderer);

            // Restore the context now.
            renderer.restore ();
        }

        /**
         * Set the position of this actor by setting its position on the stage in world coordinates. The
         * position of the actor on the map will automatically be updated as well.
         *
         * @param point the new position for this actor
         */
        setStagePosition (point : Point) : void
        {
            this.setStagePositionXY (point.x, point.y);
        }

        /**
         /**
         * Set the position of this actor by setting its position on the stage in world coordinates. The
         * position of the actor on the map will automatically be updated as well.
         *
         * @param x the new X coordinate for the actor
         * @param y the new Y coordinate for the actor
         */
        setStagePositionXY (x : number, y : number) : void
        {
            this._position.setToXY (x, y);
            this._mapPosition = this._position.copyReduced (TILE_SIZE);
        }

        /**
         * Set the position of this actor by setting its position on the map in ile coordinates. The
         * position of the actor in the world will automatically be updated as well.
         *
         * @param point the new position for this actor
         */
        setMapPosition (point : Point) : void
        {
            this.setMapPositionXY (point.x, point.y);
        }

        /**
         * Set the position of this actor by setting its position on the map in ile coordinates. The
         * position of the actor in the world will automatically be updated as well.
         *
         * @param x the new X coordinate for this actor
         * @param y the new Y coordinate for this actor
         */
        setMapPositionXY (x : number, y : number) : void
        {
            this._mapPosition.setToXY (x, y);
            this._position = this._mapPosition.copyScaled (TILE_SIZE);
        }

        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString () : string
        {
            return String.format ("[Actor name={0}]", this._name);
        }
    }
}
