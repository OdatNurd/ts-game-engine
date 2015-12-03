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
        protected name : string;

        /**
         * The stage that this actor is displayed on. This is used for rendering.
         *
         * @type {Stage}
         */
        protected stage : Stage;

        /**
         * The position of this actor in the world. These coordinates are in pixel coordinates.
         *
         * @type {Point}
         */
        public position : Point;

        /**
         * The position of this actor in the tile map. These coordinates are in tiles.
         *
         * @type {Point}
         */
        public mapPosition : Point;

        /**
         * The width of this actor, in pixels.
         *
         * @type {number}
         */
        protected width : number;

        /**
         * THe height of this actor, in pixels.
         *
         * @type {number}
         */
        protected height : number;

        /**
         * The Z-ordering (layer) for this entity. When rendered, actors with a lower Z-Order are rendered
         * before actors with a higher Z-Order, allowing some to appear over others.
         *
         * @type {number}
         */
        protected zOrder : number;

        /**
         * The color to render debug markings for this actor with.
         *
         * @type {string}
         */
        protected debugColor : string;

        /**
         * Get the layer (Z-Order) of this actor. When rendered, actors with a lower Z-Order are rendered
         * before actors with a higher Z-Order; thus this sets the rendering and display order for actors
         * by type.
         *
         * @returns {number}
         */
        get layer () : number
        { return this.zOrder; }

        /**
         * Get the stage that owns this actor.
         *
         * @returns {Stage}
         */
        get owningStage () : Stage
        { return this.stage; }

        /**
         * Set the stage that owns this actor.
         *
         * @param newStage
         */
        set owningStage (newStage : Stage)
        { this.stage = newStage; }

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
            this.name = name;
            this.stage = stage;
            this.width = width;
            this.height = height;
            this.zOrder = zOrder;
            this.debugColor = debugColor;

            // For position we save the passed in position and then make a reduced copy to turn it into
            // tile coordinates for the map position.
            this.position = new Point (x, y);
            this.mapPosition = this.position.copyReduced (TILE_SIZE);
        }

        /**
         * Update internal stage for this actor. The default implementation does nothing.
         *
         * @param stage the stage that the actor is on
         */
        update (stage : Stage)
        {

        }

        /**
         * Render this actor to the stage provided. The default implementation renders a positioning box
         * for this actor using its position and size using the debug color set at construction time.
         *
         * @param stage the stage to render this actor to
         */
        render (stage : Stage)
        {
            // Draw a filled rectangle for actor using the debug color.
            stage.fillRect (this.position.x, this.position.y, this.width, this.height, this.debugColor);
        }

        /**
         * Set the position of this actor by setting its position on the stage in world coordinates. The
         * position of the actor on the map will automatically be updated as well.
         *
         * @param point the new position for this actor
         */
        setStagePosition (point : Point)
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
        setStagePositionXY (x : number, y : number)
        {
            this.position.setToXY (x, y);
            this.mapPosition = this.position.copyReduced (TILE_SIZE);
        }

        /**
         * Set the position of this actor by setting its position on the map in ile coordinates. The
         * position of the actor in the world will automatically be updated as well.
         *
         * @param point the new position for this actor
         */
        setMapPosition (point : Point)
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
        setMapPositionXY (x : number, y : number)
        {
            this.mapPosition.setToXY (x, y);
            this.position = this.mapPosition.copyScaled (TILE_SIZE);
        }

        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString () : string
        {
            return String.format ("[Actor name={0}]", this.name);
        }
    }
}
