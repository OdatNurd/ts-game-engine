module nurdz.game
{
    /**
     * This class represents a single point as a pair of X,Y coordinates. This also includes simple operations
     * such as setting and clamping of values, as well as making copies and comparisons.
     *
     * Most API functions provided come in a variety that takes an X,Y and one that takes another point,
     * so that calling code can use whatever it most appropriate for the situation without having to box
     * or un-box values.
     */
    export class Point
    {
        /**
         * X-coordinate of this point.
         *
         * @type {Number}
         */
        private _x : number;

        /**
         * Y-coordinate of this point.
         *
         * @type {Number}
         */
        private _y : number;

        /**
         * X-coordinate of this point.
         *
         * @returns {number}
         */
        get x () : number
        { return this._x; }

        /**
         * Set the x-coordinate of this point
         *
         * @param newX the new X to set.
         */
        set x (newX : number)
        { this._x = newX; }

        /**
         * Y-coordinate of this point.
         *
         * @returns {number}
         */
        get y () : number
        { return this._y; }

        /**
         * Set the y-coordinate of this point
         *
         * @param newY the new y to set.
         */
        set y (newY : number)
        { this._y = newY; }


        /**
         * Construct a new point that uses the provided X and Y values as its initial coordinate.
         *
         * @param x X-coordinate of this point
         * @param y Y-coordinate of this point
         * @constructor
         */
        constructor (x : number, y : number)
        {
            this._x = x;
            this._y = y;
        }

        /**
         * Return a new point instance that is a copy of this point.
         *
         * @returns {Point} a duplicate of this point
         * @see Point.copyTranslatedXY
         */
        copy () : Point
        {
            return new Point (this._x, this._y);
        }

        /**
         * Return a new point instance that is a copy of this point, with its values translated by the values
         * passed in.
         *
         * @param translation the point to translate this point by
         * @returns {Point} a duplicate of this point, translated by the value passed in
         * @see Point.copy
         * @see Point.copyTranslatedXY
         */
        copyTranslated (translation : Point) : Point
        {
            return this.copyTranslatedXY (translation._x, translation._y);
        }

        /**
         * Return a new point instance that is a copy of this point, with its values translated by the values
         * passed in.
         *
         * @param x the amount to translate the X value by
         * @param y the amount to translate the Y value by
         * @returns {Point} a duplicate of this point, translated by the value passed in
         * @see Point.copy
         * @see Point.copyTranslated
         */
        copyTranslatedXY (x : number, y : number) : Point
        {
            var retVal = this.copy ();
            return retVal.translateXY (x, y);
        }

        /**
         * Create and return a copy of this point in which each component is divided by the factor provided.
         * This allows for some simple coordinate conversions in a single step. After conversion the points
         * are rounded down to ensure that the coordinates remain integers.
         *
         * This is a special case of scale() that is more straight forward for use in some cases.
         *
         * @param factor the amount to divide each component of this point by
         * @returns {Point} a copy of this point with its values divided by the passed in factor
         * @see Point.scale
         * @see Point.copyScaled
         */
        copyReduced (factor : number) : Point
        {
            return this.copy ().reduce (factor);
        }

        /**
         * Create and return a copy of this point in which each component is scaled by the scale factor
         * provided. This allows for some simple coordinate conversions in a single step. After conversion the
         * points are rounded down to ensure that the coordinates remain integers.
         *
         * @param {Number} scale the amount to multiply each component of this point by
         * @returns {Point} a copy of this point with its values scaled by the passed in factor
         * @see Point.reduce
         * @see Point.copyReduced
         */
        copyScaled (scale : number) : Point
        {
            return this.copy ().scale (scale);
        }

        /**
         * Set the position of this point to the same as the point passed in.
         *
         * @param point the point to copy from
         * @returns {Point} this point after the operation completes, for chaining calls.
         */
        setTo (point : Point) : Point
        {
            return this.setToXY (point._x, point._y)
        }

        /**
         * Set the position of this point to the same as the values passed in
         *
         * @param x new X-coordinate for this point
         * @param y new Y-coordinate for this point
         * @returns {Point} this point after the operation completes, for chaining calls.
         */
        setToXY (x : number, y : number) : Point
        {
            this._x = x;
            this._y = y;
            return this;
        }

        /**
         * Set the position of this point to the first two values in the array passed in, where the first
         * value is treated as the X value and the second value is treated as the Y value.
         *
         * It is valid for the array to have more than two elements, but if it has fewer than two, nothing
         * happens.
         *
         * @param array the array to get the new values from.
         * @returns {Point} this point after the operation completes, for chaining calls.
         */
        setToArray (array : Array<number>) : Point
        {
            if (array.length >= 2)
            {
                this._x = array[0];
                this._y = array[1];
                return this;
            }
        }

        /**
         * Compares this point to the point passed in to determine if they represent the same point.
         *
         * @param other the point to compare to
         * @returns {boolean} true or false depending on equality
         */
        equals (other : Point) : boolean
        {
            return this._x == other._x && this._y == other._y;
        }

        /**
         * Compares this point to the values passed in to determine if they represent the same point.
         *
         * @param x the X-coordinate to compare to
         * @param y the Y-coordinate to compare to
         * @returns {boolean} true or false depending on equality
         */
        equalsXY (x : number, y : number) : boolean
        {
            return this._x == x && this._y == y;
        }

        /**
         * Translate the location of this point using the values of the point passed in. No range checking is
         * done.
         *
         * @param delta the point that controls both delta values
         * @returns {Point} this point after the translation, for chaining calls.
         */
        translate (delta : Point) : Point
        {
            return this.translateXY (delta._x, delta._y);
        }

        /**
         * Translate the location of this point using the values passed in. No range checking is done.
         *
         * @param deltaX the change in X-coordinate
         * @param deltaY the change in Y-coordinate
         * @returns {Point} this point after the translation, for chaining calls.
         */
        translateXY (deltaX : number, deltaY : number) : Point
        {
            this._x += deltaX;
            this._y += deltaY;
            return this;
        }

        /**
         * Calculate and return the value of the point that is some distance away from this point at the angle
         * provided.
         *
         * This works by using trig and assuming that the point desired is the point that describes the
         * hypotenuse of a right triangle.
         *
         * @param angle the angle desired, in degrees
         * @param distance the desired distance from this point
         * @returns {Point} the resulting point
         */
        pointAtAngle (angle : number, distance : number) : Point
        {
            // Convert the incoming angle to radians.
            angle *= (Math.PI / 180);

            // We treat this like a right angle triangle problem.
            //
            // Since we know that the cosine is the ratio between the lengths of the adjacent and hypotenuse
            // and the sine is the ratio between the opposite and the hypotenuse, we can calculate those
            // values for the angle we were given, realizing that the adjacent side is the X component and
            // the opposite is the Y component (draw it on paper if you need to).  By multiplying each value
            // with the distance required (the provided distance is the length of the hypotenuse in the
            // triangle), we determine what the actual X and Y values for the point is.  Note that these
            // calculations assume that the origin is the point from which the hypotenuse extends, and so we
            // need to translate the calculated values by the position of that point to get the final
            // location of where the end of the line falls.
            return new Point (Math.cos (angle), Math.sin (angle)).scale (distance).translate (this);
        }

        /**
         * Reduce the components in this point by dividing each by the factor provided. This allows for some
         * simple coordinate conversions in a single step. After conversion the points are rounded down to
         * ensure that the coordinates remain integers.
         *
         * This is a special case of scale() that is more straight forward for use in some cases.
         *
         * @param factor the amount to divide each component of this point by
         * @returns {Point} a copy of this point with its values divided by the passed in factor
         * @see Point.scale
         * @see Point.copyScaled
         */
        reduce (factor : number) : Point
        {
            this._x = Math.floor (this._x / factor);
            this._y = Math.floor (this._y / factor);
            return this;
        }

        /**
         * Scale the components in this point by multiplying each by the scale factor provided. This allows
         * for some simple coordinate conversions in a single step. After conversion the points are rounded
         * down to ensure that the coordinates remain integers.
         *
         * @param scale the amount to multiply each component of this point by
         * @returns {Point} this point after the scale, for chaining calls.
         * @see Point.reduce
         * @see Point.copyReduced
         */
        scale (scale : number) : Point
        {
            this._x = Math.floor (this._x * scale);
            this._y = Math.floor (this._y * scale);
            return this;
        }

        /**
         * Clamp the value of the X-coordinate of this point so that it is between the min and max values
         * provided, inclusive.
         *
         * @param minX the minimum X-coordinate to allow
         * @param maxX the maximum Y-coordinate to allow
         * @returns {Point} this point after the clamp is completed, for chaining calls.
         */
        clampX (minX : number, maxX : number) : Point
        {
            if (this._x < minX)
                this._x = minX;
            else if (this._x > maxX)
                this._x = maxX;
            return this;

        }

        /**
         * Clamp the value of the Y-coordinate of this point so that it is between the min and max values
         * provided, inclusive.
         *
         * @param minY the minimum Y-coordinate to allow
         * @param maxY the maximum Y-coordinate to allow
         * @returns {Point} this point after the clamp is completed, for chaining calls.
         */
        clampY (minY : number, maxY : number) : Point
        {
            if (this._y < minY)
                this._y = minY;
            else if (this._y > maxY)
                this._y = maxY;
            return this;
        }

        /**
         * Clamp the X and Y values of the provided point so that they are within the bounds of the stage
         * provided.
         *
         * @param stage the stage to clamp to
         * @returns {Point} this point after the clamp is completed, for chaining calls.
         */
        clampToStage (stage : Stage)
        {
            this.clampX (0, stage.width - 1);
            this.clampY (0, stage.height - 1);
            return this;
        }

        /**
         * Return a copy of this point as an array of two numbers in x, y ordering.
         *
         * @returns {Array<number>} the point as an array of two numbers.
         */
        toArray () : Array<number>
        {
            return [this._x, this._y];
        }

        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString () : string
        {
            return String.format ("[{0}, {1}]", this._x, this._y);
        }
    }
}
