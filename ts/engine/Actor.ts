module nurdz.game
{
    /**
     * This class represents the base class for any game object of any base type. This base class
     * implementation has a position and knows how to render itself.
     *
     */
    export class Actor extends Collider
    {
        /**
         * The name of this actor type, for debugging purposes. There may be many actors with the same name.
         *
         * @type {string}
         */
        protected _name : string;

        /**
         * The position of this actor in the tile map. These coordinates are in tiles.
         *
         * @type {Point}
         */
        protected _mapPosition : Point;

        /**
         * The list of animations known to this Actor; this is null by default and only gets populated
         * when someone adds an animation.
         */
        protected _animations : AnimationList;

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
         * Get the animation list for this actor. This does not exist until the first time you query this
         * property.
         *
         * In order for animations to play, they must be added and a sprite sheet must be set as well.
         *
         * @returns {AnimationList}
         */
        get animations () : AnimationList
        {
            // Create the animation list if it doesn't exist.
            if (this._animations == null)
                this._animations = new AnimationList ();

            return this._animations;
        }

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
        { this._angle = Utils.normalizeDegrees (newAngle); }

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
            // Invoke the super to set things up.
            super (stage, ColliderType.RECTANGLE, x, y, width, height);

            // Save the other passed in values.
            this._name = name;
            this._zOrder = zOrder;
            this._debugColor = debugColor;

            // Default to the first sprite of a nonexistent sprite sheet
            this._sheet = null;
            this._sprite = 0;

            // Make a reduced copy of the given position to give this actor's map position.
            this._mapPosition = this._position.copyReduced (TILE_SIZE);
        }

        /**
         * Add a new animation with a textual name, which will run at the frames per second provided. The
         * animation can be set to loop or not as desired.
         *
         * The animation is made up of a list of frames to play in order from some sprite sheet.
         *
         * The first animation that is added is the one that the class plays by default. This can be
         * overridden by explicitly requesting playback of a null animation.
         *
         * Until this is invoked, there is no animation list.
         *
         * @param name textual name for this animation, which should be unique amongst all registered
         * animations for this actor
         * @param fps the frames per second to run the animation at
         * @param loop true to loop the animation when it is played back or false for one shot playback
         * @param frameList the list of frames that make up the animation
         * @see Actor.setAnimationLoop
         * @see Actor.setAnimationPingPong
         * @see Actor.playAnimation
         */
        addAnimation (name : string, fps : number, loop : boolean, frameList : Array<number>) : void
        {
            // Make sure there is an animation list.
            if (this._animations == null)
                this._animations = new AnimationList ();

            // Now add the animation.
            this._animations.add (name, fps, loop, frameList);
        }

        /**
         * Start playing the provided animation; this will take effect on the next call to the update method.
         *
         * @param name the name of the animation to play or null to stop all animations
         */
        playAnimation (name : string) : void
        {
            if (this._animations)
                this._animations.play (name);
        }

        /**
         * Update internal stage for this actor. The default implementation makes sure that any currently
         * running animation plays as expected.
         *
         * @param stage the stage that the actor is on
         * @param tick the game tick; this is a count of how many times the game loop has executed
         */
        update (stage : Stage, tick : number) : void
        {
            // If there is a sprite sheet and an animation list, then update our sprite using the animation.
            if (this._sheet && this._animations)
                this._sprite = this._animations.update ();
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
            // If there os a sprite sheet attached AND the sprite index is value for it, then render it.
            //
            // Failing that, render our bounds by invoke the super's renderVolume method.
            if (this._sheet != null && this._sprite >= 0 && this._sprite < this._sheet.count)
            {
                // Translate the canvas to be where our origin point is (which is an offset from the location
                // that we were given) and then rotate the canvas to the appropriate angle.
                renderer.translateAndRotate (x, y, this._angle);
                this._sheet.blit (this._sprite, -this._origin.x, -this._origin.y, renderer);
                renderer.restore ();
            }
            else
                this.renderVolume (x, y, this._debugColor, renderer);
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
