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
        private name : string;

        /**
         * The numeric tile ID of this tile.
         *
         * @type {number}
         */
        private tileID : number;

        /**
         * The color that the base class will use to render this tile if the method is not overridden.
         *
         * @type {string}
         */
        private debugColor : string;

        /**
         * Get the textual name of this tile.
         *
         * @returns {string}
         */
        get tileName () : string
        { return this.name; }

        /**
         * Get the numeric id of this tile.
         *
         * @returns {number}
         */
        get id () : number
        { return this.tileID; }

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
            this.name = name;
            this.tileID = internalID;
            this.debugColor = debugColor;
        }

        /**
         * Query whether this tile blocks the movement of actors on the map or not.
         *
         * @returns {boolean}
         */
        blocksActorMovement () : boolean
        {
            return true;
        }

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
        render (stage : Stage, x : number, y : number)
        {
            stage.fillRect (x, y, TILE_SIZE, TILE_SIZE, this.debugColor);
        }

        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString () : string
        {
            return `[Tile name=${this.name} id=${this.tileID}]`;
        }
    }
}
