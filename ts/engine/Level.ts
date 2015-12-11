module nurdz.game
{
    /**
     * This class represents the idea of a level in a game based on a tile map. It takes an instance of a
     * LevelData class that gives it information about the layout of the level and its other contents, and
     * provides an API for rendering that map to the stage and for querying the map data in various ways.
     */
    export class Level
    {
        /**
         * The stage that owns this level.
         *
         * @type {Stage}
         */
        protected _stage : Stage;

        /**
         * The width of the level that we represent, in tiles.
         *
         * @type {number}
         */
        protected _width : number;

        /**
         * The height of the level that we represent, in tiles.
         *
         * @type {number}
         */
        protected _height : number;

        /**
         * The raw level data that we are rendering. This is a series of numbers of length width * height
         * that contains tile ID's that indicate what tile to render.
         */
        protected _mapData : Array<number>;

        /**
         * The unordered list of entities contained on this level.
         *
         * @type {Array<Entity>}
         */
        protected _entities : Array<Entity>;

        /**
         * The list of entities keyed so that the key is the id property of the entity and the value is
         * the entity itself, to provide for faster lookup of specific entities.
         *
         * @type {Object<String,Entity>}
         */
        protected _entitiesByID : Object;

        /**
         * The tileset that represents the level data. This controls how the tiles are rendered onto the
         * stage.
         *
         * @type {Tileset}
         */
        protected _tileset : Tileset;

        /**
         * Construct a new level object that will display on the provided stage and which represents the
         * provided data.
         *
         * @param stage the stage that owns the level and will display it
         * @param levelData the data to display/wrap/query
         */
        constructor (stage : Stage, levelData : LevelData)
        {
            // Save the provided values and alias into the LevelData itself.
            this._stage = stage;
            this._width = levelData.width;
            this._height = levelData.height;
            this._mapData = levelData.mapData;
            this._entities = levelData.entities;
            this._entitiesByID = levelData.entitiesByID;
            this._tileset = levelData.tileset;
        }

        /**
         * Given an entity type, return back a list of all entities of that type that the level data contains.
         * There could be 0 or more such entries.
         *
         * @param type the entity type to search for (pass the class object)
         * @returns {Array<Entity>} an array of entities of this type, which might be empty
         */
        entitiesWithType (type : Function) : Array<Entity>
        {
            // The return value.
            var retVal = [];
            for (var i = 0 ; i < this._entities.length ; i++)
            {
                var entity = this._entities[i];
                if (entity instanceof type)
                    retVal.push (entity);
            }

            return retVal;
        }

        /**
         * Given coordinates in the map (e.g. tile based) domain, return back a list of all entities in the
         * level that exist at this location, which might be 0. This also detects when the coordinates are
         * outside of the world.
         *
         * @param x the X coordinate to search, in map coordinates
         * @param y the Y coordinate to search, in map coordinates
         * @returns {Array<Entity>} the entities at the provided location or null if the location is
         * invalid
         */
        entitiesAtMapXY (x : number, y : number) : Array<Entity>
        {
            // Return null if the coordinate is out of bounds.
            if (x < 0 || y < 0 || x >= this._width || y >= this._width)
                return null;

            // Iterate over all entities to see if they are at the map location provided.
            var retVal = [];
            for (var i = 0 ; i < this._entities.length ; i++)
            {
                // Get the entity.
                var entity = this._entities[i];

                // If the location matches, add it to the array.
                if (entity.mapPosition.equalsXY (x, y))
                    retVal.push (entity);
            }

            return retVal;
        }

        /**
         * Given coordinates in the map (e.g. tile based) domain, return back a list of all entities in the
         * level that exist at this location, which might be 0. This also detects when the coordinates are
         * outside of the world.
         *
         * @param  location the location in the map to check, in map coordinates
         * @returns {Array<Entity>} the entities at the provided location or null if the location is
         * invalid
         */
        entitiesAtMapPosition (location : Point) : Array<Entity>
        {
            return this.entitiesAtMapXY (location.x, location.y);
        }

        /**
         * Given coordinates in the map (e.g. tile based) domain and a facing, this calculates which map tile
         * is in the facing direction given and then returns back a list of all entities that exist at the
         * map tile that is adjacent in that direction, which might be 0. This also detects when either the
         * input or facing adjusted coordinates are outside of the world.
         *
         * @param x the X coordinate to search
         * @param y the Y coordinate to search
         * @param facing the facing to search (angle in degrees)
         * @returns {Array<Entity>} the entities at the provided location offset by the given facing or null
         * if the location is invalid (including if the location in the facing is invalid)
         */
        entitiesAtMapXYFacing (x : number, y : number, facing : number) : Array<Entity>
        {
            // Based on the facing angle, adjust the map position as needed.
            switch (facing)
            {
                case 0:
                    x++;
                    break;

                case 90:
                    y++;
                    break;

                case 180:
                    x--;
                    break;

                case 270:
                    y--;
                    break;
            }

            // Now we can do a normal lookup.
            return this.entitiesAtMapXY (x, y);
        }

        /**
         * Given coordinates in the map (e.g. tile based) domain and a facing, this calculates which map tile
         * is in the facing direction given and then returns back a list of all entities that exist at the
         * map
         * tile that is adjacent in that direction, which might be 0. This also detects when either the input
         * or facing adjusted coordinates are outside of the world.
         *
         * @param location the location in the map to check, in map coordinates
         * @param facing the facing to search (angle in degrees)
         * @returns {Array<Entity>} the entities at the provided location offset by the given facing or null
         * if the location is invalid (including if the location in the facing is invalid)
         */
        entitiesAtMapPositionFacing (location : Point, facing : number) : Array<Entity>
        {
            return this.entitiesAtMapXYFacing (location.x, location.y, facing);
        }

        /**
         * Scan over all entities in the level and return back a list of all entities with the id or ids
         * given, which may be an empty array.
         *
         * NOTE: No care is taken to not include duplicate entities if the entity list provided contains the
         * same entity ID more than once. It's also not an error if no such entity exists, although a warning
         * will be generated to the console in this case.
         *
         * @param idSpec the array of entity IDs to find
         * @returns {Array<Entity>} list of matching entities (may be an empty array)
         */
        entitiesWithIDs (idSpec : Array<String>) : Array<Entity>
        {
            var retVal = [];

            for (var i = 0 ; i < idSpec.length ; i++)
            {
                var entity = this._entitiesByID[<string>idSpec[i]];
                if (entity)
                    retVal.push (entity);
            }

            // This is just for debugging. We should get exactly as many things as were asked for. Less means
            // IDs were given that do not exist, more means that some objects have duplicate ID values, which
            // is also bad.
            if (retVal.length != idSpec.length)
                console.log ("Warning: entitiesWithIDs entity count mismatch. Broken level?");

            return retVal;
        }

        /**
         * Find all entities that match the id list passed in and then, for each such entity found, fire their
         * trigger method using the provided activator as the source of the trigger.
         *
         * As a convenience, if the idSpec provided is null, nothing happens. This allows for entities to use
         * this method without having to first verify that they actually have a trigger.
         *
         * @param idSpec the id or ids of entities to find or null too do nothing
         * @param activator the actor that is activating the entities, or null
         */
        triggerEntitiesWithIDs (idSpec : Array<string>, activator : Actor) : void
        {
            // If there is not an idSpec, do nothing.
            if (idSpec == null)
                return;

            // Get the list of entities that match the idSpec provided and trigger them all.
            var entities = this.entitiesWithIDs (idSpec);
            for (var i = 0 ; i < entities.length ; i++)
                entities[i].trigger (activator);
        }

        /**
         * Given coordinates in the map (e.g. tile based) domain, return back the tile at that location. If
         * the coordinates are outside of the world, this is detected and null is returned back.
         *
         * @param {Number} x the X-coordinate to check, in map coordinates
         * @param {Number} y the Y-coordinate to check, in map coordinates
         * @returns {Tile} the tile at the provided location or null if the location is invalid
         */
        tileAtXY (x : number, y : number) : Tile
        {
            // Bounds check the location.
            if (x < 0 || y < 0 || x >= this._width || y >= this._width)
                return null;

            // This is safe because the level data validates that all of the tiles in its data are also
            // represented in its tileset.
            return this._tileset.tileForID (this._mapData[y * this._width + x]);
        }

        /**
         * Given coordinates in the map (e.g. tile based) domain, return back the tile at that location. If
         * the coordinates are outside of the world, this is detected and null is returned back.
         *
         * @param location the location to check, in map coordinates
         * @returns {Tile} the tile at the provided location or null if the location is invalid
         */
        tileAt (location : Point) : Tile
        {
            return this.tileAtXY (location.x, location.y);
        }

        /**
         * Given coordinates in the map, return back a boolean that indicates if that space is blocked or not
         * as far as movement is concerned for the actor provided.
         *
         * The provided actor can be non-null, so long as all Tile and Entity instances being used in the
         * level are capable of determining blocking against a null tile reference. The default
         * implementations are capable of this.
         *
         * @param x the X-coordinate to check, in map coordinates
         * @param y the Y-coordinate to check, in map coordinates
         * @param actor the actor to check the blocking of
         * @returns {boolean} true if the level location is blocked for this actor and cannot be moved to, or
         * false otherwise.
         */
        isBlockedAtXY (x : number, y : number, actor : Actor) : boolean
        {
            // Get the tile; it's blocked if it is out of bounds of the level.
            var tile = this.tileAtXY (x, y);
            if (tile == null)
                return true;

            // If the tile at this location blocks actor movement, then the move is blocked.
            if (tile.blocksActorMovement (actor))
                return true;

            // Get the list of entities that are at this location on the map. If there are any and any of them
            // blocks actor movement, the move is blocked.
            var entities = this.entitiesAtMapXY (x, y);
            if (entities != null)
            {
                for (var i = 0 ; i < entities.length ; i++)
                {
                    if (entities[i].blocksActorMovement (actor))
                        return true;
                }
            }

            // Not blocked.
            return false;
        }

        /**
         * Given coordinates in the map, return back a boolean that indicates if that space is blocked or not
         * as far as movement is concerned for the actor provided.
         *
         * The provided actor can be non-null, so long as all Tile instances being used in the level are
         * capable of determining blocking against a null tile reference. The default Tile implementation
         * is capable of this.
         *
         * @param location the location to check, in map coordinates
         * @param actor the actor to check the blocking of
         * @returns {boolean} true if the level location is blocked for this actor and cannot be moved to, or
         * false otherwise.
         */
        isBlockedAt (location : Point, actor : Actor) : boolean
        {
            return this.isBlockedAtXY (location.x, location.y, actor);
        }

        /**
         * Render this level using the renderer provided. This is done by delegating the rendering of each
         * individual tile to the tile instance.
         *
         * Note that this only renders the level geometry and not the entities; it's up to the caller to
         * render those as needed and at the appropriate time.
         *
         * @param renderer the renderer to render with
         */
        render (renderer : Renderer) : void
        {
            // Iterate over the tiles.
            for (var y = 0 ; y < this._height ; y++)
            {
                for (var x = 0 ; x < this._width ; x++)
                {
                    var tile = this.tileAtXY (x, y);

                    // Get the tile and render it.
                    if (tile != null)
                        tile.render (x * TILE_SIZE, y * TILE_SIZE, renderer);
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
            return String.format ("[LevelData size={0}x{1}]", this._width, this._height);
        }
    }
}
