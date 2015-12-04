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
        private name : string;

        /**
         * The width of this level data, in tiles.
         *
         * @type {number}
         */
        width : number;

        /**
         * The height of this level data, in tiles.
         *
         * @type {number}
         */
        height : number;

        /**
         * The underlying level data that describes the map. This is an array of numbers that are
         * interpreted as numeric tile ID values.
         *
         * @type {Array<number>}
         */
        levelData : Array<number>;

        /**
         * The list of all entities that are associated with this particular level data instance. This is
         * just an array of entity objects.
         *
         * @type {Array<Entity>}
         */
        entities : Array<Entity>;

        /**
         * A duplicate list of entities, where the entities are indexed by their ID values for faster lookup.
         *
         * @type {Object<String,Entity>}
         */
        entitiesByID : Object;

        /**
         * The tileset that is used to render this level data; the data in the levelData array is verified
         * to only contain tiles that appear in this tileset.
         *
         * @type {Tileset}
         */
        tileset : Tileset;

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
            this.name = name;
            this.width = width;
            this.height = height;
            this.levelData = levelData;
            this.entities = entityList;
            this.tileset = tileset;

            // Set up the entity list that associates with entity ID values.
            this.entitiesByID = {};

            // Iterate over all entities. For each one, insert it into the entitiesByID table and so some
            // validation.
            for (var i = 0 ; i < this.entities.length ; i++)
            {
                // Get the entity and it's ID property. If there is no ID property, generate an error.
                var entity = this.entities[i];
                var entityID = entity.properties.id;

                if (entityID == null)
                    throw new Error ("LevelData passed an entity with no 'id' property");

                // The entity needs to have a stage associated with it.
                if (entity.stage == null)
                    throw new Error ("LevelData passed an entity that has no stage, id=" + entityID);

                // Now store this entity in the lookup table; generate a warning if such an ID already
                // exists, as it will clobber.
                if (this.entitiesByID[entityID])
                    console.log ("LevelData has an entity with a duplicate 'id' property: " + entityID);

                this.entitiesByID[entityID] = entity;
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
            if (this.levelData.length != this.width * this.height)
                this.error ("Level data '" + this.name + "' has an incorrect length given its dimensions");

            // For now, there is no scrolling of levels, so it is important that the dimensions be the same
            // as the constant for the viewport.
            if (this.width != nurdz.game.STAGE_TILE_WIDTH || this.height != nurdz.game.STAGE_TILE_HEIGHT)
                this.error (`Scrolling is not implemented; level '${this.name}' must be the same size as the viewport`);

            // Validate that all tiles are valid.
            for (var y = 0 ; y < this.height ; y++)
            {
                for (var x = 0 ; x < this.width ; x++)
                {
                    // Pull a tileID out of the level data, and validate that the tileset knows what it is.
                    var tileID = this.levelData[y * this.width + x];
                    if (this.tileset.isValidTileID(tileID) == false)
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
            return String.format ("[LevelData name={0}, size={1}x{2]]", this.name, this.width, this.height);
        }
    }
}
