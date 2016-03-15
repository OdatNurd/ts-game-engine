module nurdz.game
{
    /**
     * This class represents a 2-Dimensional vector.
     *
     * A vector is a geometric entity which has two properties; length (magnitude) and direction. They are
     * objects which are inherently an offset or displacement from some other point.
     *
     * Vectors can operate in any number of dimensions, but this class operates only with 2 dimensional
     * vectors due to the nature of the engine that it's used in.
     *
     * Note also that mathematically vectors are represented as a column matrix, which stops you from
     * confusing them with points. We take the lazy approach of representing them in comments here and
     * elsewhere as row matrices instead. Normally you would include a T superscript to indicate that this ia
     * a row matrix which should be Transposed, but we're not doing that here due to the aforementioned
     * laziness.
     */
    export class Vector2D
    {
        /**
         * The amount of offset that we have in the X direction; positive X values face right while negative X
         * values face left. A value of 0 is going either up or down as determined by the Y value.
         */
        protected _x : number;

        /**
         * The amount of offset that we have in the Y direction; positive Y values face downward while
         * negative Y values face upward. A value of 0 is either either right or left and determined by the
         * X value.
         *
         * Note that the sense of what is up and what is down is reversed what what you would expect in
         * standard geometry because on our canvas the Y values increase downward and not upwards as they
         * normally would.
         */
        protected _y : number;

        /**
         * The x component of this vector.
         *
         * @returns {number}
         */
        get x () : number
        { return this._x; }

        /**
         * Set the x component of this vector.
         *
         * @param newX the new X to set.
         */
        set x (newX : number)
        { this._x = newX; }

        /**
         * The y component of this vector.
         *
         * @returns {number}
         */
        get y () : number
        { return this._y; }

        /**
         * Set the y component of this vector.
         *
         * @param newY the new y to set.
         */
        set y (newY : number)
        { this._y = newY; }

        /**
         * Get the magnitude of this vector.
         *
         * @returns {number} the length of this vector
         */
        get magnitude () : number
        {
            // Take the square root of our squared magnitude.
            return Math.sqrt (this.magnitudeSquared);
        }

        /**
         * Set the magnitude of this vector. This retains the current direction of the vector but modifies
         * the components so that the magnitude is the new magnitude.
         *
         * Setting the magnitude to 1 is a shortcut for normalizing it.
         *
         * @param newMagnitude the new magnitude for the vector
         */
        set magnitude (newMagnitude : number)
        {
            // In order to set the magnitude of the vector, we first need to normalize it, and then scale
            // it according to the magnitude provided.
            this.normalize ().scale (newMagnitude);
        }

        /**
         * Get the squared magnitude of this vector. The true magnitude is the square root of this value,
         * which can be a costly operation; for comparison purposes you may want to skip that portion of
         * the operation.
         *
         * @returns {number}
         */
        get magnitudeSquared () : number
        {
            // A vector is really just the hypotenuse of a right triangle, so this is easily calculated.
            // We don't take the square root here.
            return (this._x * this._x) + (this._y * this._y);
        }
        
        /**
         * Construct a new 2D vector, optionally also providing one or both components of the vector itself.
         *
         * As a vector is an offset from some location, it is important to note that the X and Y provided are
         * not POSITIONS, but are in fact the amount of OFFSET on each axis from some other (externally
         * defined) position.
         *
         * @param x the amount of X offset for this vector
         * @param y the amount of Y offset for this vector
         */
        constructor (x : number = 0, y : number = 0)
        {
            this._x = x;
            this._y = y;
        }

        /**
         * Given a direction and a magnitude, return back a vector object that represents those values. This
         * calculates the appropriate X and Y displacements required in order to obtain a vector with these
         * properties.
         *
         * @param direction the direction the vector is pointing (in degrees)
         * @param magnitude the magnitude of the vector
         */
        static fromDisplacement (direction : number, magnitude : number) : Vector2D
        {
            // Convert the angle from degrees to radians.
            direction *= (Math.PI / 180);

            // This is a classic right angle situation; the cosine of the direction is the ratio of the X
            // portion and the sine is the ratio of the Y direction. We need to multiply those results by the
            // actual magnitude that we were given in order to scale them appropriately.
            return new Vector2D (Math.cos (direction) * magnitude, Math.sin (direction) * magnitude);
        }

        /**
         * Create and return a new vector based on a given point, optionally translating the values at the
         * same time to turn the point into a proper displacement from some known origin point.
         *
         * The function assumes that both the point provided and the origin point are using the same frame
         * of reference, and so the position of the point will be translated by the inverse of the origin
         * point provided.
         *
         * When no origin point is provided, it is assumed to be the point (0, 0); thus in this case the
         * point you provide is deemed to already be a vector.
         *
         * @param point the point to convert into a vector
         * @param origin the point to consider the origin for the purposes of the conversion; if not
         * given, (0, 0) is assumed
         */
        static fromPoint (point : Point, origin : Point = null)
        {
            if (origin == null)
                return new Vector2D (point.x, point.y);
            else
                return new Vector2D (point.x - origin.x, point.y - origin.y);
        }

        /**
         * Return a new vector instance that is a copy of this vector
         *
         * @returns {Vector2D} a duplicate of this vector
         */
        copy () : Vector2D
        {
            return new Vector2D (this._x, this._y);
        }

        /**
         * Return a new vector instance that is a copy of this vector after it has been normalized.
         *
         * @returns {Vector2D} a duplicate of the normalized form of this vector.
         */
        copyNormalized () : Vector2D
        {
            return this.copy ().normalize ();
        }

        /**
         * Return a new vector instance that is a copy of this vector after it has been reversed to point in
         * the opposite direction of this vector
         *
         * @returns {Vector2D} a duplicate of the reversed form of this vector
         */
        copyReversed () : Vector2D
        {
            return this.copy ().reverse ();
        }

        /**
         * Return a new vector instance that is a copy of this vector after it has been rotated 90
         * degrees to the left or right.
         *
         * @param left true to rotate the copied vector to the left or false to rotate it to the right
         */
        copyOrthogonal (left : boolean = true) : Vector2D
        {
            return this.copy ().orthogonalize (left);
        }

        /**
         * Reverse the direction of the vector by rotating it 180 degrees from the direction that it is
         * currently pointing.
         *
         * @returns {Vector2D} this vector after being reversed.
         */
        reverse () : Vector2D
        {
            // Reversing the direction of the vector is as simple as changing the sign of both of the
            // components so that they face the other way.
            //
            // This does not change the magnitude (if we have calculated it) because the length doesn't
            // change when this happens.
            this._x *= -1;
            this._y *= -1;
            return this;
        }

        /**
         * Normalize this vector to convert it to a unit vector.
         *
         * A normalized vector is one which has a magnitude of 1; as such the components of the vector are
         * modified but it's orientation will remain the same.
         *
         * Note that this is just a specialized case of scaling the vector by its current magnitude.
         * Additionally, don't confuse a normalized vector (vector with magnitude of 1) with a "normal
         * vector", which is a vector that is perpendicular to a surface but may or may not have a magnitude
         * of 1.
         *
         * @see Vector2D.scale
         * @returns {Vector2D} this vector after being normalized.
         */
        normalize () : Vector2D
        {
            // First, get the magnitude. We cache this here because it is otherwise calculated every time
            // we access the property.
            let magnitude = this.magnitude;

            // If the magnitude is 0, we will set ourselves to be a magnitude of 1. The zero vector has a
            // direction of 0, so we can easily get the dimension we want while at the same time maintaining
            // that direction.
            if (magnitude == 0)
            {
                this._x = 1;
                this._y = 0;
            }
            else
            {
                // Dividing a number by itself always results in 1, so dividing each of the components of the
                // vector by its current length causes the final magnitude to be 1 due to the magic of math.
                this._x /= magnitude;
                this._y /= magnitude;
            }

            return this;
        }

        /**
         * Calculate the dot product between two vectors.
         *
         * Geometrically, the dot product is defined as:
         *
         *    U . V = ||U|| * ||V|| * cos (theta)
         *
         * Which means "the dot product between two vectors U and V is the same as the magnitude of each
         * vector multiplied  by the cosine of the angle between them, where "the angle between them" is the
         * angle that one of the vectors would need to be rotated in order to be pointing in the same
         * direction of the other one.
         *
         * For the case of normalized unit vectors (whose magnitude is always 1) the dot product tells you
         * directly the cosine of the angle between the vectors. For non-unit vectors, you can obtain this by
         * dividing the dot product by the multiple of the magnitudes of both vectors (which cancels them
         * out). This is generally costly which is why we generally work with unit vectors in this case, which
         * allow us to assume the magnitude.
         *
         * Properties of the dot product:
         *   A) When both are pointing in the same direction, the angle between them is 0, and cos(0) is 1.
         *   B) When each points in the opposite direction, the angle between them is 180, and cos(180) is -1.
         *   C) When the two are perpendicular, the angle between them is 90, and cos(90) = 0.
         *   D) Due to the way the dot product is calculated, the dot product of a vector and itself is always
         *      the square of the magnitude, which may be interesting for various algebraic and/or geometric
         *     reasons.
         *
         * @param other the other vector to calculate the dot product with.
         * @returns {number} the dot product between this vector and the other vector
         */
        dot (other : Vector2D) : number
        {
            // Our vectors are represented via matrices, so the dot product is a matrix multiplication. That
            // means that we multiply each index in the first matrix with the corresponding index in the
            // second matrix, and them sum all of the products together.
            //
            // In our general case for 2D vectors, this is just x*x + y*y. Note that this means that the
            // result of the dot product between a vector and itself is the square of its length.
            return (this._x * other._x) + (this._y * other._y);
        }

        /**
         * Rotate this vector 90 degrees to the left or right by 90 degrees to make it orthogonal to its
         * current direction. This leaves the magnitude intact.
         *
         * The parameter allows you to select the orientation of the new vector, either pointing to the left
         * of this vector (true) or the right of it (false).
         *
         * Although this is possible via the rotate() method, the version here does not require the use of
         * any trig functions in order to perform the rotation, and so runs faster, should that be needed.
         *
         * @param left true to return a vector rotated 90 degrees to the left (counter-clockwise) or false to
         * rotate clockwise instead.
         * @returns {Vector2D} the vector after it has been rotated
         * @see Vector2D.rotate
         */
        orthogonalize (left : boolean = true) : Vector2D
        {
            // The magic of the dot product tells us that the dot product of two perpendicular vectors is 0
            // because the cosine of 90 degrees is 0.
            //
            // Taking mathematical advantage of this and knowing how the dot product is calculated (summing
            // the products of the X and Y parts of two vectors), it should (hopefully) be easy to see that if
            // you swap the X and Y components and make one of them negative, the two sums will cancel each
            // other out, which means that the angle between them is 90, which means they are perpendicular.
            //
            // The term that you negate controls the direction which the apparent "rotation" has occurred,
            // which we control here via a boolean.
            let newX = this._y * (left ? 1 : -1);
            let newY = this._x * (left ? -1 : 1);

            this._x = newX;
            this._y = newY;
            return this;
        }

        /**
         * Add the provided vector to this vector, returning this vector.
         *
         * @param other the vector to add to this vector
         * @returns {Vector2D} this vector after the other vector has been added to it
         */
        add (other : Vector2D) : Vector2D
        {
            this._x += other._x;
            this._y += other._y;
            return this;
        }

        /**
         * Subtract the provided vector from this vector, returning this vector
         *
         * @param other the vector to subtract from this vector
         * @returns {Vector2D} this vector after the other vector has been subtracted from it
         */
        sub (other : Vector2D) : Vector2D
        {
            this._x -= other._x;
            this._y -= other._y;
            return this;
        }

        /**
         * Negate the components of this vector by flipping the sign of all of its components. The vector is
         * returned to allow chaining this as required.
         *
         * This is useful for purposes of turning a vector subtraction into a vector addition, since vector
         * addition is commutative but subtraction is not. This can make some calculations visually easier to
         * follow, even if it does complicate the code and slow it down.
         *
         * @returns {Vector2D} this vector after the negation has been computed
         */
        negate () : Vector2D
        {
            // This is identical to reversing the direction of the vector.
            return this.reverse ();
        }

        /**
         * Calculate and return the angle (in degrees) that this vector is currently pointing. A rotation
         * angle of 0 represents the right, and the rest of the angles go in a clockwise direction.
         *
         * Note that this is different from what you might expect (e.g. an angle pointing up and to the right
         * is not 45 degrees but is instead 315 degrees) because the Y axis increases downward and not
         * upward.
         *
         * The return is always a value in the range of 0-359 inclusive.
         *
         * The Zero vector (a vector with all components 0) is assumed to point in the direction with angle 0
         * (to the right).
         *
         * @returns {number} the angle in degrees that the vector is pointing.
         */
        direction () : number
        {
            // Calculate the actual angle in degrees. This calculates the angle as something between -180 and
            // 180 (anything with a negative Y value is a negative angle).
            let angle = Math.atan2 (this._y, this._x) * (180 / Math.PI);

            // Normalize the angle to be in the range of 0 - 359 instead
            return (angle < 0) ? angle + 360 : angle;
        }

        /**
         * Rotate the direction of this vector by the specified angle (in degrees), returning the vector after
         * the rotation has completed.
         *
         * Positive angle rotate in a clockwise fashion while negative angles rotate in a counterclockwise
         * fashion. This is inverted to what you might expect due to the Y axis increasing downwards and not
         * upwards.
         *
         * For the special case of rotating the vector 90 degrees to the left or right, the getOrthogonal()
         * method can be used to return a new vector that is so rotated without the expense of the trig
         * functions that are used by this method.
         *
         * @param angle the angle to rotate by, in degrees
         * @returns {Vector2D} this vector after the rotation has been completed
         * @see Vector2D.getOrthogonal
         */
        rotate (angle : number) : Vector2D
        {
            // Convert degrees to radians
            angle *= Math.PI / 180;

            // Pre-calculate the cos and sin, since we need each one twice.
            let cos = Math.cos (angle);
            let sin = Math.sin (angle);

            // Calculate the rotation of the end of the vector by using a simple 2D rotation matrix.
            let newX = (this._x * cos) - (this._y * sin);
            let newY = (this._x * sin) + (this._y * cos);

            // Set in the new points now
            this._x = newX;
            this._y = newY;
            return this;
        }

        /**
         * Rotate this vector so that it points at the angle provided.
         *
         * @param angle the absolute angle to point the vector in, in degrees
         * @returns {Vector2D} this vector after the rotation has been accomplished
         */
        rotateTo (angle : number) : Vector2D
        {
            return this.rotate (angle - this.direction ());
        }

        /**
         * Scale this vector by the scale factor provided. This alters the magnitude of the vector (and thus
         * also the displacement) but leaves the direction untouched.
         *
         * Scaling by the current magnitude of the vector will normalize it into a unit vector. There is a
         * normalize() method that does this for you, for convenience.
         *
         * @param factor the scale factor to apply to the vector
         * @returns {Vector2D} this vector after it has been scaled
         * @see Vector2D.normalize
         */
        scale (factor : number) : Vector2D
        {
            // To scale the vector we just modify the values by the scale value provided. This keeps the ratio
            // between the two the same (which keeps the direction the same) but modifies the displacement of
            // both parts appropriately.
            this._x *= factor;
            this._y *= factor;
            return this;
        }

        /**
         * Display a string version of the vector for debugging purposes.
         *
         * This displays the displacement values as well as the direction and magnitude. All values are set to
         * a fixed level 0f 3 digits after the decimal point.
         *
         * @returns {string}
         */
        toString () : string
        {
            return `V<(${this._x.toFixed (3)},${this._y.toFixed (3)}), ` +
                `${this.direction ().toFixed (3)}\xB0, ${this.magnitude.toFixed (3)}>`;
        }
    }
}
