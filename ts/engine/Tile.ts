module nurdz.game
{
    /**
     * This class represents a Tile in a game, for games that require that. This encapsulates information as
     * to what the textual (for debugging) and numeric (for map data) ID's of a tile are, as well as the
     * ability to render to a stage and provide other information such as blocking.
     */
    export class Tile
    {
        /**
         * The textual name of this tile.
         *
         * @type {string}
         */
        protected _name : string;

        /**
         * The numeric tile ID of this tile.
         *
         * @type {number}
         */
        protected _tileID : number;

        /**
         * The color that the base class will use to render this tile if the method is not overridden.
         *
         * @type {string}
         */
        protected _debugColor : string;

        /**
         * Get the textual name of this tile.
         *
         * @returns {string}
         */
        get name () : string
        { return this._name; }

        /**
         * Get the numeric id of this tile.
         *
         * @returns {number}
         */
        get value () : number
        { return this._tileID; }

        /**
         * Construct a new tile instance with the given name and ID values. This instance will render
         * itself using the debug color provided (as a filled rectangle).
         *
         * @param name the textual name of this tile type, for debugging purposes
         * @param internalID the numeric id of this tile type, for use in map data
         * @param debugColor the color to render as in debug mode
         */
        constructor (name : string, internalID : number, debugColor : string = 'yellow')
        {
            // Save the passed in values.
            this._name = name;
            this._tileID = internalID;
            this._debugColor = debugColor;
        }

        /**
         * Query whether this tile blocks the movement of the provided actor on the map or not.
         *
         * By default all actors are blocked on this tile. Note that this means that there is no API contract
         * as far as the core engine code is concerned with regards to the actor value passed in being
         * non-null.
         *
         * @param actor the actor to check blocking for
         * @returns {boolean} true if the actor given cannot move over this tile, or false otherwise.
         */
        blocksActorMovement (actor : Actor) : boolean
        {
            return true;
        }

        /**
         * Render this tile to the location provided on the given stage.
         *
         * This default version of the method renders the tile as a solid rectangle of the appropriate
         * dimensions using the debug color given at construction time.
         *
         * @param x the x location to render the tile at, in stage coordinates (NOT world)
         * @param y the y location to render the tile at, in stage coordinates (NOT world)
         * @param renderer the renderer to use to render ourselves.
         */
        render (x : number, y : number, renderer : Renderer) : void
        {
            renderer.fillRect (x, y, TILE_SIZE, TILE_SIZE, this._debugColor);
        }

        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString () : string
        {
            return String.format ("[Tile name={0} id={1}]", this._name, this._tileID);
        }
    }
}
