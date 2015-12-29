module nurdz.game
{
    /**
     * This class wraps a list of known Scene instances and allows for switching between them and
     * querying/modifying the list of known scenes.
     *
     * This is used by the Stage class to manage the scenes in the game and switch between them.
     */
    export class SceneManager
    {
        /**
         * The currently active scene. This defaults to an empty instance initially so that all operations
         * still work as expected while the engine is being set up, and to guard the developer from
         * himself by forgetting to add one.
         *
         * @type {Scene}
         */
        private _currentScene : Scene = null;

        /**
         * The scene that should become active next (if any). When a scene change request happens, the
         * scene to be switched to is stored in this value to ensure that the switch happens at the end of
         * the current update cycle, which happens asynchronously.
         *
         * The value here is null when there is no scene change scheduled.
         *
         * @type {Scene|null}
         */
        private  _nextScene : Scene = null;

        /**
         * A list of all of the registered scenes in the stage. The keys are a symbolic string name and
         * the values are the actual Scene instance objects that the names represent.
         *
         * @type {Object<String,Scene>}
         */
        private  _sceneList : Object = null;

        /**
         * The currently active scene in the game.
         *
         * @returns {Scene} the current scene
         */
        get currentScene () : Scene
        { return this._currentScene; }

        /**
         * The scene that will imminently become active the next time a scene change check is scheduled.
         *
         * This value is null when there is no pending scene change yet.
         *
         * @returns {Scene}
         */
        get nextScene () : Scene
        { return this._nextScene; }

        /**
         * Create a new instance of the Scene manager that will manage scenes for the passed in stage.
         *
         * @param stage the stage whose scenes we are managing.
         */
        constructor (stage : Stage)
        {
            // Set up a default current scene, so that things work while setup is happening.
            this._currentScene = new Scene ("defaultScene", stage);

            // The scene list starts out initially empty.
            this._sceneList = {};
        }

        /**
         * Register a scene object using a textual name for reference. This scene can then be switched to
         * via the switchToScene method.
         *
         * You can invoke this with null as a scene object to remove a scene from the internal scene list or
         * register the same object multiple times with different names, if that's interesting to you.
         *
         * It is an error to attempt to register a scene using the name of a scene that already exists.
         *
         * @param name the symbolic name to use for this scene
         * @param newScene the scene object to add
         * @see Scene.switchToScene
         */
        addScene (name : string, newScene : Scene = null) : void
        {
            // If this name is in use and we were given a scene object, we should complain.
            if (this._sceneList[name] != null && newScene != null)
                console.log ("Warning: overwriting scene registration for scene named " + name);

            // Save the scene
            this._sceneList[name] = newScene;
        }

        /**
         * Register a request to change the current scene to a different scene.
         *
         * NOTE: Such a change will not occur until the next call to checkSceneSwitch(), which you should
         * do prior to any frame update. This means sure that the frame update keeps the same scene active
         * throughout (e.g. calling into one scene for update and another for render).
         *
         * If null is provided, a pending scene change will be cancelled out.
         *
         * This method has no effect if the scene specified is already the current scene, is already going to
         * be switched to, or has a name that we do not recognize. In that last case, a console log is
         * generated to indicate why the scene change is not happening.
         *
         * @param {String} sceneName the name of the new scene to change to, or null to cancel a pending
         * change
         */
        switchToScene (sceneName : string = null) : void
        {
            // Get the actual new scene, which might be null if the scene named passed in is null.
            var newScene = sceneName != null ? this._sceneList[sceneName] : null;

            // If we were given a scene name and there was no such scene, complain before we leave.
            if (sceneName != null && newScene == null)
            {
                console.log ("Attempt to switch to unknown scene named " + sceneName);
                return;
            }

            this._nextScene = newScene;
        }

        /**
         * Check to see if there is a pending scene switch that should happen, as requested by an
         * invocation to switchToScene().
         *
         * If there is, the current scene is switched, with the scenes being notified as appropriate. If
         * there isn't, then nothing else happens.
         *
         * @see SceneManager.switchToScene
         */
        checkSceneSwitch () : void
        {
            // If there is a scene change scheduled, change it now.
            if (this._nextScene != null && this._nextScene !== this._currentScene)
            {
                // Tell the current scene that it is deactivating and what scene is coming next.
                this._currentScene.deactivating (this._nextScene);

                // Save the current scene, then swap to the new one
                var previousScene = this._currentScene;
                this._currentScene = this._nextScene;

                // Now tell the current scene that it is activating, telling it what scene used to be in
                // effect.
                this._currentScene.activating (previousScene);

                // Clear the flag now.
                this._nextScene = null;
            }
        }
    }
}
