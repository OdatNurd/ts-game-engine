module nurdz.game
{
    /**
     * This type is used to mark what kind of collision volume a Collider instance uses.
     *
     * Where positioning is concerned, all collision types are represented logically by a rectangular area
     * with the position referenced from the top left corner. This position is offset by an origin property,
     * allowing the referenced position to be anywhere inside the rectangle.
     *
     * Where actual collisions are concerned, the actual collision volume it somewhere inside of the
     * positioning rectangle as outlined in the description of the collider type below.
     */
    export enum ColliderType
    {
        /**
         * No collision volume at all; no collisions are possible with this collider type. All of the
         * collision methods will always return false no matter what.
         */
        NONE,

        /**
         * Rectangular bounding volume; the collision volume is the same as the positioning rectangle itself.
         *
         * The default origin for a rectangle collider is (0, 0) so that the position references the upper
         * left corner as one might expect by default.
         */
        RECTANGLE,

        /**
         * Circular bounding volume; the collision volume is a circle positioned inside the exact center
         * of the positioning rectangle itself, which is always a square with sides the same as the
         * diameter of the circle it contains.
         *
         * The default origin for a circle collider is (width/2, height/2) so that the position references
         * the center of the circle as one might expect. This can of course be changed if the position is
         * best referenced from some other point.
         */
        CIRCLE
    }

    /**
     * This class represents the basis of an object that can be positioned on the stage and can collide
     * with other such instances. Collider objects can be one of the types in the ColliderType enumeration,
     * which controls how they interact with each other.
     *
     * Collider objects have minimal rendering functionality that allows them to represent their volumes
     * on the stage for debugging purposes.
     *
     * @see ColliderType
     */
    export class Collider
    {
        /**
         * The type of collisions that this object allows.
         *
         * @type {ColliderType}
         */
        protected _type : ColliderType;

        /**
         * The stage that this collision object will be displayed on. This is used for rendering purposes
         * as well as for determining the dimensions of the area for collisions with the edges of the stage.
         *
         * @type {Stage}
         */
        protected _stage : Stage;

        /**
         * The angle that the collision object is rotated to. This is measured in degrees with 0 being to the
         * right and 90 degrees being downward (due to the y axis increasing in a downward fashion).
         *
         * Note that the angle of a rectangular collision object is not taken into account for collision
         * detection currently.
         */
        protected _angle : number;

        /**
         * The origin point of this collision object. This is an offset from the top left corner of the
         * position rectangle of this collider that describes where the actual position places this object.
         *
         * When the value of the origin is (0, 0), the position of the object is its direct position.
         *
         * @type {Point}
         */
        protected _origin : Point;

        /**
         * The position of this collision object in the world. These coordinates are in pixel coordinates; The
         * actual bounding volume (whatever its type) is referenced by this location, although the offset
         * from the position is given by the origin point.
         *
         * @type {Point}
         */
        protected _position : Point;

        /**
         * This property is interpreted in different ways for different collider types:
         *
         * For type RECTANGLE, this is the width of the collision rectangle, in pixels.
         *
         * For type CIRCLE, this is the radius of the collision circle, in pixels (and thus the positioning
         * box is twice this wide and twice this tall).
         *
         * @type {number}
         */
        protected _width : number;

        /**
         * This property is interpreted in different ways for different collider types:
         *
         * For type RECTANGLE, this is the height of the collision rectangle, in pixels.
         *
         * For type CIRCLE, this is the diameter of the collision circle, in pixels (and thus the positioning
         * box is this wide and this tall).
         *
         * @type {number}
         */
        protected _height : number;

        /**
         * Obtain the type of collision object that this is.
         *
         * @returns {ColliderType}
         */
        get type () : ColliderType
        { return this._type; }

        /**
         * Get the rotation angle of this collider (in degrees); 0 is to the right and 90 is downward (due
         * to the Y axis increasing downwards).
         *
         * @returns {number}
         */
        get angle () : number
        { return this._angle; }

        /**
         * Set the rotation angle of this collider (in degrees, does not affect collision
         * detection).
         *
         * The value is normalized to the range 0-359.
         *
         * @param newAngle the new angle to render at
         */
        set angle (newAngle : number)
        { this._angle = Utils.normalizeDegrees (newAngle); }

        /**
         * The origin of this collision object, which is an offset from its position and is used to
         * determine at what point inside the collision object the position represents.
         *
         * @returns {Point}
         */
        get origin () : Point
        { return this._origin; }

        /**
         * The position of this collision object in the world. These coordinates are in pixel coordinates.
         *
         * @returns {Point}
         */
        get position () : Point
        { return this._position; }

        /**
         * Obtain the radius of this collision object, in pixels.
         *
         * This only has meaning when the collider type is CIRCLE; in all other cases, this returns 0.
         *
         * @returns {number}
         */
        get radius () : number
        {
            return (this._type == ColliderType.CIRCLE) ? this._width : 0;
        }

        /**
         * Obtain the width of this collision object, in pixels. This represents how wide the collision
         * volume is at its widest point, even if the collision type itself is not rectangular.
         *
         * @returns {number}
         */
        get width () : number
        {
            // If the type is circular, then the width property is actually the radius and the height
            // indicates how wide this entity is; circular entities have a square positioning rectangle.
            return (this._type == ColliderType.CIRCLE) ? this._height : this._width;
        }

        /**
         * Obtain the height of this collision object, in pixels. This represents how tall the collision
         * volume is at its tallest point, even if the collision type itself is not rectangular.
         *
         * @returns {number}
         */
        get height () : number
        { return this._height; }

        /**
         * Construct a new collider object of a provided type with the given properties. The origin of the
         * object is set to a sensible default for the collider type provided.
         *
         * @param stage the stage that will manage this collider
         * @param type the type of collision volume to use for this object
         * @param x the X position of the collision object
         * @param y the Y position of the collision object
         * @param widthOrRadius the width of the collision bounds; for circular bounding volumes this is
         * instead the radius of the circle
         * @param height the height of the collision bounds; this is ignored for circular bounding volumes
         * since both dimensions of a circle are identical
         */
        constructor (stage : Stage, type : ColliderType, x : number, y : number,
                     widthOrRadius : number, height : number = 0)
        {
            // First, save the stage and simple values.
            this._stage = stage;
            this._type = type;
            this._position = new Point (x, y);

            // Default to no rotation
            this._angle = 0;

            // Set up the origin, width and height. How we do this depends on the type of the bounding
            // rectangle.
            if (this._type == ColliderType.CIRCLE)
            {
                // The width parameter is a radius. We ignore the height we were given and instead store
                // the diameter in the height instead.
                this._width = widthOrRadius;
                this._height = widthOrRadius * 2;

                // The origin is the logical center of the bounding rectangle; this turns off for this line
                // an inspection which gets mad that we are providing the width as the Y value.
                //noinspection JSSuspiciousNameCombination
                this._origin = new Point (this._width, this._width);
            }
            else
            {
                // Everything else is a rectangle; the origin is the upper left and we use the bounds we
                // were given.
                this._origin = new Point (0, 0);
                this._width = widthOrRadius;
                this._height = height;
            }
        }

        /**
         * Render the collision volume and origin of this collider using the renderer provided.
         *
         * The position provided to this method is the stage position of the collider object itself (which
         * may be adjusted for scrolling, for example).
         *
         * This will render the bounding volume as well as the the origin point.
         *
         * @param x the x location of the position to render the collider at, in stage coordinates (NOT world)
         * @param y the y location of the position to render the collider at, in stage coordinates (NOT world)
         * @param color the color specification to use to render the collision volume and origin
         * @param renderer the object to render with
         */
        renderVolume (x : number, y : number, color : string, renderer : Renderer) : void
        {
            // We get the actual position value that we're supposed to be at, so translate the canvas to
            // make the origin be at that location; this also rotates the canvas to the appropriate angle.
            renderer.translateAndRotate (x, y, this._angle);

            // Render the bounding volume itself. Now that the origin is the position to render at, we can
            // use our origin property to offset so that we are visualized as appropriate.
            switch (this._type)
            {
                // No volume; nothing to render.
                case ColliderType.NONE:
                    break;

                // For a rectangle, a box with our width and height with its upper left corner offset by
                // our origin offset is drawn (since 0, 0 represents our actual position).
                case ColliderType.RECTANGLE:
                    renderer.strokeRect (-this._origin.x, -this._origin.y,
                                         this._width, this._height, color, 1);
                    break;

                // For a circle, we need to do the same offset by our origin as for a rectangle, and then
                // add to that our radius; for circles, our position assumes that we are a square with
                // sides equal to our diameter; most of the time circles have an origin that places the
                // actual position in the center of this rectangle, but that is not required.
                case ColliderType.CIRCLE:
                    renderer.strokeCircle (-this._origin.x + this.radius,
                                           -this._origin.y + this.radius,
                                           this.radius, color, 1);
                    break;
            }

            // Now render a dot at the location which we are referenced from, which is the canvas origin
            // due to our translation above.
            renderer.fillCircle (0, 0, 4, color);

            // Restore the context now.
            renderer.restore ();
        }

        /**
         * Perform a collision check to see if the point provided falls within the bounding volume of this
         * collider.
         *
         * @param point the point to check
         * @returns {boolean} true if the point is within the bounding volume of this collision object or
         * false otherwise
         */
        contains (point : Point) : boolean
        {
            // Use the other version of the function
            return this.containsXY (point.x, point.y);
        }

        /**
         * Perform a collision check to see if the point provided falls within the bounding volume of this
         * collider.
         *
         * @param x the X coordinate of the point to check
         * @param y the Y coordinate of the point to check
         * @returns {boolean} true if the point is within the bounding volume of this collision object or
         * false otherwise
         */
        containsXY (x : number, y : number) : boolean
        {
            // Perform the check depending on type
            switch (this._type)
            {
                // No collision type means no collision.
                case ColliderType.NONE:
                    return false;

                // Collision with rectangle; check if the point is inside of our bounding rectangle, taking
                // the origin into account.
                case ColliderType.RECTANGLE:
                    return Collision.pointInRect (x, y,
                                                  this._position.x - this._origin.x,
                                                  this._position.y - this._origin.y,
                                                  this._width, this._height);

                // Collision with circle; check if the point is inside of our bounding circle, taking the
                // origin into account.
                case ColliderType.CIRCLE:
                    return Collision.pointInCircle (x, y,
                                                    this._position.x + this.radius - this._origin.x,
                                                    this._position.y + this.radius - this._origin.y,
                                                    this.radius);
            }

            // All other collider types don't collide with anything.
            return false;
        }

        /**
         * Perform a collision with the other object under the assumption that both us and the other
         * object are circles.
         *
         * @param other the other collision object, which needs to be a circle
         * @returns {boolean} true if we collide with this circle, or false otherwise
         */
        private circleCircleCollide (other : Collider) : boolean
        {
            return Collision.circleInCircle (
                // Their information
                other.position.x + other.radius - other.origin.x,
                other.position.y + other.radius - other.origin.y,
                other.radius,

                // Our information
                this._position.x + this.radius - this._origin.x,
                this._position.y + this.radius - this._origin.y,
                this.radius);
        }

        /**
         * Perform a collision with the other object under the assumption that both us and the other
         * object are rectangles.
         *
         * @param other the other collision object, which needs to be a rectangle
         * @returns {boolean} true if we collide with this rectangle, false otherwise
         */
        private rectRectCollide (other : Collider) : boolean
        {
            return Collision.rectInRect (
                // Their information
                other.position.x - other.origin.x,
                other.position.y - other.origin.y,
                other.width, other.height,

                // Our information
                this._position.x - this._origin.x,
                this._position.y - this._origin.y,
                this._width, this._height
            )
        }

        /**
         * Perform a collision with the other object under the assumption that one of us is a rectangle
         * and the other is a circle. Which is which does not matter, this works both ways.
         *
         * @param other the other collision object, which need to be either a rectangle or a circle
         * (whichever we are not)
         * @returns {boolean} true if we collide with this rectangle, false otherwise
         */
        private circleRectCollide (other : Collider) : boolean
        {
            // Determine which of us is the circle and which of us is the rectangle.
            let circle = (this._type == ColliderType.CIRCLE ? this : other);
            let rectangle = (this._type == ColliderType.CIRCLE ? other : this);

            // Now try the collision
            return Collision.rectInCircle (
                // The rectangle
                rectangle.position.x - rectangle.origin.x,
                rectangle.position.y - rectangle.origin.y,
                rectangle.width, rectangle.height,

                // The circle
                circle.position.x + circle.radius - circle.origin.x,
                circle.position.y + circle.radius - circle.origin.y,
                circle.radius
            );
        }

        /**
         * Perform a collision check between this collision object and some other collision object. This
         * takes into account the types of each object and collides them as appropriate.
         *
         * @param other the other object to collide with
         * @returns {boolean} true if these two objects are colliding, or false otherwise
         */
        collidesWith (other : Collider) : boolean
        {
            // If there is no other object, or one of the two of us is not able to collide with anything,
            // we can return false right now.
            if (this._type == ColliderType.NONE || other == null || other.type == ColliderType.NONE)
                return false;

            // Are we both the same type of object?
            if (this._type == other.type)
            {
                // Collide as either a circle or rectangle.
                switch (this._type)
                {
                    case ColliderType.CIRCLE:
                        return this.circleCircleCollide (other);

                    case ColliderType.RECTANGLE:
                        return this.rectRectCollide (other);
                }
            }

            // We are not the same type; thus, we need to intersect between a circle and a rectangle.
            return this.circleRectCollide (other);
        }

        /**
         * Calculate the first intersection point between the line that runs from the two points provided
         * and this collision object. Since it is possible that the line segment may intersect more than
         * once, the direction of the line is used to determine the direction of the intersection points.
         * As such, the order of the points is important.
         *
         * If the result parameter is non-null, it is filled with the intersection point (if any). Otherwise,
         * a new point is created if needed.
         *
         * The return value is null if there is no intersection or the point of intersection if there is;
         * in this case, this could be the new point created or the point passed in, depending on the
         * value of result.
         *
         * @param p0 the starting point of the line segment
         * @param p1 the ending point of the line segment
         * @param result the result point to store the intersection in or null to create a new point if
         *     needed
         * @returns {Point} the point of the intersection (if any) or null otherwise.
         * @see Collider.intersectWithSegmentXY
         */
        intersectWithSegment (p0 : Point, p1 : Point, result : Point = null) : Point
        {
            // Use the other method.
            return this.intersectWithSegmentXY (p0.x, p0.y, p1.x, p1.y, result);
        }

        /**
         * Calculate the first intersection point between the line that runs from the two points provided
         * and this collision object. Since it is possible that the line segment may intersect more than
         * once, the direction of the line is used to determine the direction of the intersection points.
         * As such, the order of the points is important.
         *
         * If the result parameter is non-null, it is filled with the intersection point (if any). Otherwise,
         * a new point is created if needed.
         *
         * The return value is null if there is no intersection or the point of intersection if there is;
         * in this case, this could be the new point created or the point passed in, depending on the
         * value of result.
         *
         * @param x0 the X coordinate of the starting point of the line segment
         * @param y0 the Y coordinate of the starting point of the line segment
         * @param x1 the X coordinate of the ending point of the line segment
         * @param y1 the Y coordinate of the ending point of the line segment
         * @param result the result point to store the intersection in or null to create a new point if
         *     needed
         * @returns {Point} the point of the intersection (if any) or null otherwise.
         * @see Collider.intersectWithSegment
         */
        intersectWithSegmentXY (x0 : number, y0 : number, x1 : number, y1 : number, result : Point = null)
        {
            // Collide based on the type of this object.
            switch (this._type)
            {
                // No possible intersection.
                case ColliderType.NONE:
                case ColliderType.CIRCLE:
                    return null;

                // Check to see where the segment intersects with our rectangle.
                case ColliderType.RECTANGLE:
                    return Collision.segmentRectangleIntersectionXY (x0, y0, x1, y1,
                                                                     this._position.x - this._origin.x,
                                                                     this._position.y - this._origin.y,
                                                                     this._width, this._height,
                                                                     result);
            }
        }
    }
}
