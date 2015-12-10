module nurdz.game
{
    /**
     * This class represents the raw map and entity data that represents a tile based level in a game.
     * Instances of this class hold the raw (and reusable) data used to represent a level.
     *
     * The map data is just a series of integer tile ID values that associate with the tile set that has
     * been provided, as well as a list of entities that are attached to the map.
     *
     * Various checks are done to ensure that the level data provided is actually valid.
     */
    export class LevelData
    {
        /**
         * The textual name of this level data.
         *
         * @type {string}
         */
        protected _name : string;

        /**
         * The width of this level data, in tiles.
         *
         * @type {number}
         */
        protected _width : number;

        /**
         * The height of this level data, in tiles.
         *
         * @type {number}
         */
        protected _height : number;

        /**
         * The underlying level data that describes the map. This is an array of numbers that are
         * interpreted as numeric tile ID values.
         *
         * @type {Array<number>}
         */
        protected _levelData : Array<number>;

        /**
         * The list of all entities that are associated with this particular level data instance. This is
         * just an array of entity objects.
         *
         * @type {Array<Entity>}
         */
        protected _entities : Array<Entity>;

        /**
         * A duplicate list of entities, where the entities are indexed by their ID values for faster lookup.
         *
         * @type {Object<String,Entity>}
         */
        protected _entitiesByID : Object;

        /**
         * The tileset that is used to render this level data; the data in the levelData array is verified
         * to only contain tiles that appear in this tileset.
         *
         * @type {Tileset}
         */
        protected _tileset : Tileset;

        /**
         * The width of this level data, in tiles.
         *
         * @returns {number} the width of the map data in tiles.
         */
        get width () : number
        { return this._width; }

        /**
         * The height of this level data, in tiles.
         *
         * @returns {number} the height of the map data in tiles
         */
        get height () : number
        { return this._height; }

        /**
         * The underlying map data that describes the map in this instance. This is an array of numbers
         * that are interpreted as numeric tile ID values and is width * height numbers long.
         *
         * @returns {Array<number>} the underlying map data
         */
        get mapData () : Array<number>
        { return this._levelData; }

        /**
         * The tileset that is used to render the map in this level data; the data in the mapData array is
         * verified to only contain tiles that appear in this tileset.
         *
         * @returns {Tileset} the tileset to use to render this map
         */
        get tileset () : Tileset
        { return this._tileset; }

        /**
         * The list of all entities that are associated with this particular level data instance. This is
         * just an array of entity objects.
         *
         * @returns {Array<Entity>} the list of entities
         * @see LevelData.entitiesByID
         */
        get entities () : Array<Entity>
        { return this._entities; }

        /**
         * A duplicate list of entities, where the entities are indexed by their ID values for faster
         * lookup at runtime.
         *
         * @returns {Object<String,Entity>} an object which contains the entities, keyed by their id values.
         * @see LevelData.entities
         */
        get entitiesByID () : Object
        { return this._entitiesByID; }

        /**
         * Construct a new level data object with the provided properties.
         *
         * @param name the name of this level for debug purposes
         * @param width the width of the level in tiles
         * @param height the height of the level in tiles
         * @param levelData the actual data that represents the map for this level
         * @param entityList the list of entities that are contained in the map (may be empty)
         * @param tileset the tileset that this level is using.
         * @throws {Error} if the level data is inconsistent in some way
         */
        constructor (name : string, width : number, height : number, levelData : Array<number>,
                     entityList : Array<Entity>, tileset : Tileset)
        {
            // Save the provided values.
            this._name = name;
            this._width = width;
            this._height = height;
            this._levelData = levelData;
            this._entities = entityList;
            this._tileset = tileset;

            // Set up the entity list that associates with entity ID values.
            this._entitiesByID = {};

            // Iterate over all entities. For each one, insert it into the entitiesByID table and so some
            // validation.
            for (var i = 0 ; i < this._entities.length ; i++)
            {
                // Get the entity and it's ID property. If there is no ID property, generate an error.
                var entity = this._entities[i];
                var entityID = entity.properties.id;

                if (entityID == null)
                    throw new Error ("LevelData passed an entity with no 'id' property");

                // The entity needs to have a stage associated with it.
                if (entity.stage == null)
                    throw new Error ("LevelData passed an entity that has no stage, id=" + entityID);

                // Now store this entity in the lookup table; generate a warning if such an ID already
                // exists, as it will clobber.
                if (this._entitiesByID[entityID])
                    console.log ("LevelData has an entity with a duplicate 'id' property: " + entityID);

                this._entitiesByID[entityID] = entity;
            }

            // Validate the data now
            this.validateData ();
        }

        /**
         * A simple helper that handles a validation failure by throwing an error.
         *
         * @param message the error to throw
         */
        private error (message : string)
        {
            throw new Error (message);
        }

        /**
         * Validate the data that is contained in this level to ensure that it is as consistent as we can
         * determine.
         *
         * On error, an error is thrown. Otherwise this returns without incident.
         *
         * @throws {Error} if the level data is inconsistent in some way
         */
        private validateData ()
        {
            // Ensure that the length of the level data agrees with the dimensions that we were given, to make
            // sure we didn't get sorted.
            if (this._levelData.length != this._width * this._height)
                this.error ("Level data '" + this._name + "' has an incorrect length given its dimensions");

            // For now, there is no scrolling of levels, so it is important that the dimensions be the same
            // as the constant for the viewport.
            if (this._width != STAGE_TILE_WIDTH || this._height != STAGE_TILE_HEIGHT)
                this.error (`Scrolling is not implemented; level '${this._name}' must be the same size as the viewport`);

            // Validate that all tiles are valid.
            for (var y = 0 ; y < this._height ; y++)
            {
                for (var x = 0 ; x < this._width ; x++)
                {
                    // Pull a tileID out of the level data, and validate that the tileset knows what it is.
                    var tileID = this._levelData[y * this._width + x];
                    if (this._tileset.isValidTileID (tileID) == false)
                        this.error ("Invalid tileID '${tileID}' found at [${x}, ${y}] in level ${this.name}");
                }
            }
        }

        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString () : string
        {
            return String.format ("[LevelData name={0}, size={1}x{2]]",
                                  this._name, this._width, this._height);
        }
    }
}
