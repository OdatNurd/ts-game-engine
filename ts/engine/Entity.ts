module nurdz.game
{
    /**
     * Objects that correspond to this interface (or some subclass of it) can be used as the property list
     * for an Entity.
     */
    export interface EntityProperties
    {
        /**
         * A unique identifying value for this entity. When not given, the Entity class will construct a
         * new unique value for this property.
         */
        id? : string;
    }

    /**
     * This class represents an Entity, which is a specific subclass of Actor that is designed to be
     * interactive with other actors and entities. An entity contains properties that can help define its
     * runtime behaviour.
     *
     * The properties provided may be extended with default values, depending on the subclass. Subclasses
     * can set this.defaultProperties to a set of properties that should be applied if they do not already
     * exist in the property set.
     *
     * Each subclass of Entity is responsible for making sure to blend the defaults with those of their
     * parent class so that the chained constructor calls set up the properties as appropriate.
     *
     * By default, entities support the following properties:
     *   - 'id': string (default: auto generated value)
     *      - specifies the id of this entity for use in identifying/finding/triggering this entity.
     */
    export class Entity extends Actor
    {
        /**
         * The list of entity specific properties that apply to this entity.
         *
         * @type {EntityProperties}
         */
        protected _properties : EntityProperties;

        /**
         * The list of properties that is assigned to this entity.
         *
         * @returns {EntityProperties}
         */
        get properties () : EntityProperties
        { return this._properties; }

        /**
         * Construct a new entity instance at a given location with given dimensions.
         *
         * All entities have properties that can control their activities at runtime, which are provided
         * in the constructor. In addition, a list of default properties may also be optionally provided.
         *
         * At construction time, any properties that appear in the default properties given that do not
         * already appear in the specific properties provided will be copied from the defaults provided.
         * This mechanism is meant to be used from a subclass as a way to have subclasses provide default
         * properties the way the Entity class itself does.
         *
         * Subclasses that require additional properties should create their own extended EntityProperties
         * interface to include the new properties, passing an instance to this constructor with a
         * typecast to its own type.
         *
         * @param name the internal name for this entity instance, for debugging
         * @param stage the stage that will be used to display this entity
         * @param x X co-ordinate of the location for this entity, in world coordinates
         * @param y Y co-ordinate of the location for this entity, in world coordinates
         * @param width the width of this entity, in pixels
         * @param height the height of this entity, in pixels
         * @param zOrder the Z-order of this entity when rendered (smaller numbers render before larger ones)
         * @param properties entity specific properties to apply to this entity
         * @param defaults default properties to apply to the instance for any required properties that do
         * not appear in the properties given
         * @param debugColor the color specification to use in debug rendering for this entity
         * @constructor
         */
        constructor (name : string, stage : Stage, x : number, y : number, width : number, height : number,
                     zOrder : number,
                     properties : EntityProperties, defaults : EntityProperties = {},
                     debugColor : string = 'white')
        {
            // Invoke the super class constructor.
            super (name, stage, x, y, width, height, zOrder, debugColor);

            // Save our properties, apply defaults, and then validate them
            this._properties = properties;
            this.applyDefaultProperties (defaults);
            this.validateProperties ();
        }

        /**
         * This method is for use in modifying an entity property object to include defaults for properties
         * that don't already exist.
         *
         * In use, the list of defaults is walked, and for each such default that does not already have a
         * value in the properties object, the property will be copied over to the properties object.
         *
         * @param defaults default properties to apply to this entity
         */
        protected applyDefaultProperties (defaults : EntityProperties) : void
        {
            for (var propertyName in defaults)
            {
                if (defaults.hasOwnProperty (propertyName) && this._properties[propertyName] == null)
                    this._properties[propertyName] = defaults[propertyName];
            }
        }

        /**
         * Every time an entity ID is automatically generated, this value is appended to it to give it a
         * unique number.
         *
         * @type {number}
         */
        static autoEntityID : number = 0;

        /**
         * Every time this method is invoked, it returns a new unique entity id string to apply to the id
         * property of an entity.
         *
         * @returns {string}
         */
        private static createDefaultID () : string
        {
            Entity.autoEntityID++;
            return "_ng_entity" + Entity.autoEntityID;
        }

        /**
         * This helper method is for validating entity properties. The method checks to see if a property
         * exists or not, if it is supposed to. It can also optionally confirm that the value is in some
         * range of valid values.
         *
         * The type is not checked because the TypeScript compiler already enforces that properties that
         * are known are of a valid type.
         *
         * Also note that some EntityProperty interface subclasses may specify that a property is not in
         * fact optional; when this is the case, this method is not needed except to validate values,
         * because the compiler is already validating that it's there.
         *
         * The "is required" checking here is intended for situations where properties are actually deemed
         * "always required" but which always have a default value that is forced in the Entity default
         * properties. In this case the interface would say that they're optional, but they're really not
         * and we just want to catch the developer forgetting to specify them.
         *
         * @param name the name of the property to validate.
         * @param required true when this property is required and false when it is optional
         * @param values either null or an array of contains all of the possible valid values for the
         * property. It's up to you to ensure that the type of the elements in the array matches the type
         * of the property being validated
         * @throws {Error} if the property is not valid for any reason
         */
        protected isPropertyValid (name : string, required : boolean, values : string[] = null) : void
        {
            // Get the value of the property (if any).
            var propertyValue : any = this._properties[name];

            // Does the property exist?
            if (propertyValue == null)
            {
                // It does not. If it's not required, then return. Otherwise, complain that it's missing.
                if (required)
                    throw new ReferenceError (`Entity ${this._name}: missing property '${name}'`);
                else
                    return;
            }

            // If we got a list of possible values and this property actually exists, make sure that the
            // value is one of them.
            if (values != null && propertyValue != null)
            {
                for (var i = 0 ; i < values.length ; i++)
                {
                    if (propertyValue == values[i])
                        return;
                }

                // If we get here, we did not find the value in the list of valid values.
                throw new RangeError (`Entity ${this._name}: invalid value for property '${name}': not in allowable list`);
            }
        }

        /**
         * This method is automatically invoked at construction time to validate that the properties object
         * provided is valid as far as we can tell (i.e. needed properties exist and have a sensible value).
         *
         * Do note that the TypeScript compiler will ensure that the types of any properties are correct,
         * so this is really only needed to vet values and also to ensure that optional properties that
         * are not really optional but only marked that way so that they can have defaults were actually
         * installed, as a protection to the developer.
         *
         * This does not need to check if the values are valid as far as the other entities are concerned
         * (i.e. does a property that expects an entity id actually represent a valid entity) as that
         * happens elsewhere; further, that entity might not be created yet.
         *
         * This should throw an error if any properties are invalid. Make sure you call the super method
         * in your subclass!
         *
         * @throw {Error} if any properties in this entity are invalid
         */
        protected validateProperties () : void
        {
            // If there is not an id property, install it. We don't have to otherwise validate anything,
            // as this is the only property that we care about and the compiler ensures that its type is
            // correct so we don't have to do anything else.
            if (this._properties.id == null)
                this._properties.id = Entity.createDefaultID ();
        }

        /**
         * Query whether this entity should block movement of the actor provided or not.
         *
         * By default, entities block all actor movement. Note that this means that there is no API contract
         * as far as the core engine code is concerned with regards to the actor value passed in being
         * non-null.
         *
         * @param actor the actor to check blocking for, or null if it doesn't matter
         * @returns {boolean}
         */
        blocksActorMovement (actor : Actor) : boolean
        {
            return true;
        }

        /**
         * This method is invoked whenever this entity gets triggered by another entity. This can happen
         * programmatically or in response to interactions with other entities, which does not include
         * collision (see triggerTouch() for that).
         *
         * The method gets passed the Actor that caused the trigger to happen, although this can be null
         * depending on how the trigger happened.
         *
         * @param activator the actor that triggered this entity, or null if unknown
         * @see Entity.triggerTouch
         */
        trigger (activator : Actor = null) : void
        {

        }

        /**
         * This method is invoked whenever this entity gets triggered by another entity as a result of a
         * direct collision (touch). This can happen programmatically or in response to interactions with
         * other entities. This does not include non-collision interactions (see trigger() for that).
         *
         * The method gets passed the Actor that caused the trigger to happen.
         *
         * @param activator the actor that triggered this entity by touching (colliding) with it
         * @see Entity.trigger
         */
        triggerTouch (activator : Actor) : void
        {

        }

        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString () : string
        {
            return String.format ("[Entity name={0}]", this._name);
        }
    }
}
