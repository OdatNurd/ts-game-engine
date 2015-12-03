module nurdz.game
{
    /**
     * This class represents a Tileset in a game, which is basically just an array of Tile instances that
     * will be used to render a level. The class provides the ability to look up tiles based on either
     * their name or their numeric ID values, as well as validating whether or not tiles are valid.
     */
    export class Tileset
    {
        /**
         * The textual name of this tileset.
         *
         * @type {string}
         */
        private name : string;

        /**
         * The number of tiles that this tileset contains.
         *
         * @type {number}
         */
        private length : number;

        /**
         * The tiles in this tileset keyed according to their textual names.
         *
         * @type {Object.<String, Tile>}
         */
        private tilesByName : Object;

        /**
         * The tiles in this tileset, ordered according to their internal numeric tile ID's.
         *
         * @type {Array<Tile>}
         */
        private tilesByValue : Array<Tile>;

        /**
         * Construct a new tile instance with the given name and ID values. This instance will render
         * itself using the debug color provided (as a filled rectangle).
         *
         * @param name the textual name of this tile type, for debugging purposes
         * @param tiles the list of tiles that this tileset should contain
         */
        constructor (name : string, tiles : Array<Tile>)
        {
            // Save the name and the list of the tile length.
            this.name = name;
            this.length = tiles.length;

            // Set up our two cross reference object.
            this.tilesByName = {};
            this.tilesByValue = [];

            // Iterate and store all values. We don't just copy the tile array given as our tilesByValue
            // because we want to ensure that their indexes are their actual values.
            for (var i = 0 ; i < tiles.length ; i++)
            {
                var thisTile = tiles[i];

                // If this tile has a name or numeric ID of an existing tile, generate a warning to the
                // console so that the developer knows that he's boned something up.
                if (this.tilesByName[thisTile.tileName] != null)
                    console.log (`Duplicate tile with textual name '${thisTile.tileName}' found`);

                if (this.tilesByValue[thisTile.id] != null)
                    console.log (`Duplicate tile with numeric id '${thisTile.id}' found`);

                this.tilesByName[thisTile.tileName] = thisTile;
                this.tilesByValue[thisTile.id] = thisTile;
            }
        }

        /**
         * Given a tileID, return true if this tileset contains that tile or false if it does not.
         *
         * @param tileID the tileID to check.
         * @returns {boolean} true if the tileID given corresponds to a valid tile, false otherwise
         */
        isValidTileID (tileID : number) : boolean
        {
            return this.tilesByValue[tileID] != null;
        }

        /**
         * Given a tile name, return back the tile object that represents this tile. The value will be null if
         * the tile name provided is not recognized.
         *
         * @param name the name of the tileID to search for
         * @returns {Tile} the tile with the provided name, or null if the name is invalid.
         */
        tileForName (name : string) : Tile
        {
            return this.tilesByName[name];
        }

        /**
         * Given a tile id, return back the tile object that represents this tile. The value will be null
         * if the tile id provided is not recognized.
         *
         * @param id the numeric id value of the tile to search for
         * @returns {Tile} the tile with the provided value, ornull if the name is invalid.
         */
        tileForID (id : number) : Tile
        {
            return this.tilesByValue[id];
        }

        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString () : string
        {
            return String.format ("[Tileset name={0} tileCount={1}]", this.name, this.length);
        }
    }
}
