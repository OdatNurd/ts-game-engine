module nurdz.game
{
    /**
     * This class is the base class for all scenes in a game. A Scene is just a simple wrapper around
     * specific handling for input handling as well as object update and rendering, which allows for better
     * object isolation.
     *
     * This base class defines the behaviour of a scene as it applies to a game; you should subclass it to
     * implement your own specific handling as needed.
     */
    export class Scene
    {
        /**
         * The name of the scene, as set from the constructor. This is essentially just for debugging
         * purposes.
         *
         * @type {string}
         */
        protected _name : string;

        /**
         * The stage that this scene is being displayed to. This is a reference to the stage given at the
         * time that the scene was created.
         *
         * @type {Stage}
         */
        protected _stage : Stage;

        /**
         * The renderer that should be used to render this scene. This comes from the stage that we're
         * given, but we use it so often that we cache its value.
         *
         * @type {Renderer}
         */
        protected _renderer : Renderer;

        /**
         * The list of all actors that are currently associated with this scene. These actors will get
         * their update and render methods called by the base implementation of the scene class.
         *
         * @type {Array<Actor>}
         */
        protected _actorList : Array<Actor>;

        /**
         * Every time a screenshot is generated, this value is used in the filename. It is then incremented.
         *
         * @type {number}
         */
        private static _ss_number : number = 0;

        /**
         * This template is used to determine the number at the end of a screenshot filename. The end
         * characters are replaced with the current number of the screenshot. This implicitly specifies
         * how many screenshots can be taken in the same session without the filename overflowing.
         *
         * @type {string}
         */
        private static _ss_format : string = "0000";

        /**
         * Construct a new scene instances that has the given name and is managed by the provided stage.
         *
         * The new scene starts with an empty actor list.
         *
         * @param name the name of this scene for debug purposes
         * @param stage the stage that manages this scene
         * @constructor
         */
        constructor (name : string, stage : Stage)
        {
            // Store the name and stage provided.
            this._name = name;
            this._stage = stage;
            this._renderer = stage.renderer;

            // Start with an empty actor list
            this._actorList = [];
        }

        /**
         * This method is invoked at the start of every game frame to allow this scene to update the state of
         * all objects that it contains.
         *
         * This base version invokes the update method for all actors that are currently registered with the
         * scene.
         */
        update () : void
        {
            for (var i = 0 ; i < this._actorList.length ; i++)
                this._actorList[i].update (this._stage);
        }

        /**
         * This method is invoked every frame after the update() method is invoked to allow this scene to
         * render to the stage everything that it visually wants to appear.
         *
         * This base version invokes the render method for all actors that are currently registered with the
         * stage.
         */
        render () : void
        {
            for (var i = 0 ; i < this._actorList.length ; i++)
            {
                var actor : Actor = this._actorList[i];
                actor.render (actor.position.x, actor.position.y, this._renderer);
            }
        }

        /**
         * This method is invoked when this scene is becoming the active scene in the game. This can be used
         * to initialize (or re-initialize) anything in this scene that should be reset when it becomes
         * active.
         *
         * This gets invoked after the current scene is told that it is deactivating. The parameter passed in
         * is the scene that was previously active. This will be null if this is the first ever scene in the
         * game.
         *
         * The next call made of the scene will be its update method for the next frame.
         *
         * @param previousScene the previous scene, if any (the very first scene change in the game has no
         * previous scene)
         */
        activating (previousScene : Scene = null) : void
        {
            console.log ("Scene activation:", this.toString ());
        }

        /**
         * This method is invoked when this scene is being deactivated in favor of a different scene. This can
         * be used to persist any scene state or do any other house keeping.
         *
         * This gets invoked before the next scene gets told that it is becoming active. The parameter
         * passed in is the scene that will become active.
         *
         * @param nextScene the scene that is about to become active
         */
        deactivating (nextScene : Scene) : void
        {
            console.log ("Scene deactivation:", this.toString ());
        }

        /**
         * Add an actor to the list of actors that exist in this scene. This will cause the scene to
         * automatically invoke the update and render methods on this actor while this scene is active.
         *
         * @param actor the actor to add to the scene
         * @see Scene.addActorArray
         */
        addActor (actor : Actor) : void
        {
            this._actorList.push (actor);
        }

        /**
         * Add all of the actors from the passed in array to the list of actors that exist in this scene. This
         * will cause the scene to automatically invoke the update and render methods on these actors while
         * the scene is active.
         *
         * @param actorArray the list of actors to add
         * @see Scene.addActorArray
         */
        addActorArray (actorArray : Array<Actor>) : void
        {
            for (var i = 0 ; i < actorArray.length ; i++)
                this.addActor (actorArray[i]);
        }

        /**
         * Return a list of actors whose position matches the position passed in. This is probably most useful
         * when actors are at rigidly defined locations, such as in a tile based game. Note that this
         * checks the world position of the actor and not its map position.
         *
         * @param location the location to search for actors at, in world coordinates
         * @returns {Array<Actor>} the actors found at the given location, which may be none
         * @see Scene.actorsAtXY
         * @see Scene.actorsAtMap
         * @see Scene.actorsAtMapXY
         */
        actorsAt (location : Point) : Array<Actor>
        {
            return this.actorsAtXY (location.x, location.y);
        }

        /**
         * Return a list of actors whose position matches the position passed in. This is probably most useful
         * when actors are at rigidly defined locations, such as in a tile based game. Note that this
         * checks the world position of the actor and not its map position.
         *
         * @param x the x coordinate to search for actors at, in world coordinates
         * @param y the y coordinate to search for actors at, in world coordinates
         * @returns {Array<Actor>} the actors found at the given location, which may be none
         * @see Scene.actorsAt
         * @see Scene.actorsAtMap
         * @see Scene.actorsAtMapXY
         */
        actorsAtXY (x : number, y : number) : Array<Actor>
        {
            var retVal = [];
            for (var i = 0 ; i < this._actorList.length ; i++)
            {
                var actor = this._actorList[i];
                if (actor.position.x == x && actor.position.y == y)
                    retVal.push (actor);
            }

            return retVal;
        }

        /**
         * Return a list of actors whose position matches the position passed in. This checks the map
         * position of entities, and so is probably more useful than actorsAt() is in the general case. In
         * particular, since the map position and the world position are maintained, this lets you find
         * entities that are positioned anywhere within the tile grid.
         *
         * @param location the location to search for actors at, in map coordinates
         *
         * @returns {Array<Actor>} the actors found at the given location, which may be none
         * @see Scene.actorsAt
         * @see Scene.actorsAtXY
         * @see Scene.actorsAtMapXY
         */
        actorsAtMap (location : Point) : Array<Actor>
        {
            return this.actorsAtMapXY (location.x, location.y);
        }

        /**
         * Return a list of actors whose position matches the position passed in. This checks the map
         * position of entities, and so is probably more useful than actorsAtXY() is in the general case. In
         * particular, since the map position and the world position are maintained, this lets you find
         * entities that are positioned anywhere within the tile grid.
         *
         * @param x the x coordinate to search for actors at, in map coordinates
         * @param y the y coordinate to search for actors at, in map coordinates
         * @returns {Array<Actor>} the actors found at the given location, which may be none
         * @see Scene.actorsAt
         * @see Scene.actorsAtXY
         * @see Scene.actorsAtMap
         */
        actorsAtMapXY (x : number, y : number) : Array<Actor>
        {
            var retVal = [];
            for (var i = 0 ; i < this._actorList.length ; i++)
            {
                var actor = this._actorList[i];
                if (actor.mapPosition.x == x && actor.mapPosition.y == y)
                    retVal.push (actor);
            }

            return retVal;
        }

        /**
         * This method will sort all of the actors that are currently attached to the scene by their current
         * internal Z-Order value, so that when they are iterated for rendering/updates, they get handled in
         * an appropriate order.
         *
         * Note that the sort used is not stable.
         */
        sortActors () : void
        {
            this._actorList.sort (function (left, right) { return left.zOrder - right.zOrder; });
        }

        /**
         * This gets triggered while the game is running, this scene is the current scene, and a key has been
         * pressed down.
         *
         * The method should return true if the key event was handled or false if it was not. The Stage will
         * prevent the default handling for all key events that are handled.
         *
         * @param eventObj the event object
         * @returns {boolean} true if the key event was handled, false otherwise
         */
        inputKeyDown (eventObj : KeyboardEvent) : boolean
        {
            return false;
        }

        /**
         * This gets triggered while the game is running, this scene is the current scene, and a key has been
         * released.
         *
         * The method should return true if the key event was handled or false if it was not. The Stage will
         * prevent the default handling for all key events that are handled.
         *
         * @param eventObj the event object
         * @returns {boolean} true if the key event was handled, false otherwise
         */
        inputKeyUp (eventObj : KeyboardEvent) : boolean
        {
            return false;
        }

        /**
         * This gets triggered while the game is running, this scene is the current scene, and the mouse
         * moves over the stage.
         *
         * The method should return true if the mouse event was handled or false if it was not. The Stage
         * will prevent the default handling for all mouse events that are handled.
         *
         * @param eventObj the event object
         * @see Stage.calculateMousePos
         */
        inputMouseMove (eventObj : MouseEvent) : boolean
        {
            return false;
        }

        /**
         * This gets triggered while the game is running, this scene is the current scene, and the mouse
         * is clicked on the stage.
         *
         * The method should return true if the mouse event was handled or false if it was not. The Stage
         * will prevent the default handling for all mouse events that are handled.
         *
         * @param eventObj the event object
         * @see Stage.calculateMousePos
         */
        inputMouseClick (eventObj : MouseEvent) : boolean
        {
            return false;
        }

        /**
         * Open a new tab/window that displays the current contents of the stage. The generated page will
         * display the image and is set up so that a click on the image will cause the browser to download
         * the file.
         *
         * The filename you provide is the filename that is automatically suggested for the image, and the
         * title passed in will be the title of the window opened and also the alternate text for the image
         * on the page.
         *
         * The filename provided will have an identifying number and an extension appended to the end. The
         * window title will also have the screenshot number appended to the end of it. This allows you to
         * easily distinguish multiple screenshots.
         *
         * This all requires support from the current browser. Some browsers may not support the notion of
         * automatically downloading the image on a click, some might not use the filename provided.
         *
         * In particular, the browser in use needs to support data URI's. I assume most decent ones do.
         *
         * @param filename the name of the screenshot image to create
         * @param windowTitle the title of the window
         */
        screenshot (filename : string = "screenshot", windowTitle : string = "Screenshot") : void
        {
            // Create a window to hold the screen shot.
            var wind = window.open ("about:blank", "screenshot");

            // Create a special data URI which the browser will interpret as an image to display.
            var imageURL = this._stage.canvas.toDataURL ();

            // Append the screenshot number to the window title and also to the filename for the generated
            // image, then advance the screenshot counter for the next image.
            filename += ((Scene._ss_format + Scene._ss_number).slice (-Scene._ss_format.length)) + ".png";
            windowTitle += " " + Scene._ss_number;
            Scene._ss_number++;

            // Now we need to write some HTML into the new document. The image tag using our data URL will
            // cause the browser to display the image. Wrapping it in the anchor tag with the same URL and a
            // download attribute is a hint to the browser that when the image is clicked, it should download
            // it using the name provided.
            //
            // This might not work in all browsers, in which case clicking the link just displays the image.
            // You can always save via a right click.
            wind.document.write ("<head><title>" + windowTitle + "</title></head>");
            wind.document.write ('<a href="' + imageURL + '" download="' + filename + '">');
            wind.document.write ('<img src="' + imageURL + '" title="' + windowTitle + '"/>');
            wind.document.write ('</a>');

        }

        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString () : string
        {
            return String.format ("[Scene name={0}]", this._name);
        }
    }
}
