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
         * @returns {number}
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
         * Render this actor using the renderer provided. The position provided represents the actual position
         * of the Actor as realized on the screen, which may be different from its actual position if
         * scrolling or a viewport of some sort is in use.
         *
         * The position provided here is adjusted by the origin of the actor so that the (x, y) provided
         * always represent the upper left corner of the area in which to render this Actor.
         *
         * Inside the render method, to obtain the actual position where the origin is located, add the
         * origin to the values provided.
         *
         * This default method renders a bounding box with a dot that represents the position of the origin.
         *
         * @param x the x location of the upper left position to render the actor at, in stage coordinates
         * (NOT world), ignoring any origin that might be set
         * @param y the y location of he upper left position to render the actor at, in stage coordinates (NOT
         * world), ignoring any origin that might be set.
         * @param renderer the class to use to render the actor
         */
        render (x : number, y : number, renderer : Renderer) : void
        {
            // Draw a filled rectangle for actor using the debug color.
            renderer.strokeRect (x, y, this._width, this._height, this._debugColor, 1);

            // Now render the origin, which is an offset from where we have actually rendered.
            renderer.fillCircle (x + this._origin.x, y + this._origin.y, 4, this._debugColor);
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
