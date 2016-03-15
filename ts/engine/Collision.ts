/**
 * This module exports various routines for the purpose of doing collision detection.
 */
    module nurdz.game.Collision
    {
        /**
         * Determine if a point provided falls within the rectangle made up of the corner point with the width
         * and height provided.
         *
         * @param pX the X coordinate of the point to test
         * @param pY the Y coordinate of the point to test
         * @param rectX the X coordinate of a corner of the rectangle
         * @param rectY the Y coordinate of a corner of the rectangle
         * @param width the width of the rectangle
         * @param height the height of the rectangle
         * @returns {boolean} true if the point falls within the rectangle, or false otherwise
         */
        export function pointInRect (pX : number, pY : number,
                                     rectX : number, rectY : number, width : number,
                                     height : number) : boolean
        {
            // The point falls inside of the rectangle if the components fall along the range of X and Y
            // values that make up the rectangle.
            return Utils.numberInRange (pX, rectX, rectX + width) &&
                Utils.numberInRange (pY, rectY, rectY + height);
        }

        /**
         * Determine if a point provided falls within the circle described by the given radius and centered at
         * the provided location.
         *
         * @param pX the X coordinate of the point to test
         * @param pY the Y coordinate of the point to test
         * @param circleX the X coordinate of the center of the circle
         * @param circleY the Y coordinate of the center of the circle
         * @param circleR the radius of the circle
         * @returns {boolean} true if the point falls within the circle, or false otherwise
         */
        export function pointInCircle (pX : number, pY : number,
                                       circleX : number, circleY : number, circleR : number) : boolean
        {
            // For the point to be in the circle, the distance between the point and the circle has to be
            // smaller than the radius. Here we do the comparison with the squares of the distances because we
            // don't care about what the distance ultimately is, only that it's close enough.
            return Utils.distanceSquaredBetweenXY (pX, pY, circleX, circleY) <= circleR * circleR;
        }

        /**
         * Determine if two rectangles intersect each other. Each rectangle is described by the position of
         * the upper left corner along with a width and a height.
         *
         * @param rect1X the X coordinate of the upper left corner of the first rectangle
         * @param rect1Y the Y coordinate of the upper left corner of the first rectangle
         * @param rect1W the width of the first rectangle
         * @param rect1H the height of the first rectangle
         * @param rect2X the X coordinate of the upper left corner of the second rectangle
         * @param rect2Y the Y coordinate of the upper left corner of the second rectangle
         * @param rect2W the width of the second rectangle
         * @param rect2H the height of the second rectangle
         * @returns {boolean} true if both rectangles intersect or false otherwise
         */
        export function rectInRect (rect1X : number, rect1Y : number, rect1W : number, rect1H : number,
                                    rect2X : number, rect2Y : number, rect2W : number,
                                    rect2H : number) : boolean
        {
            // If the range of X and Y values in both rectangles overlap each other, then the rectangles
            // intersect each other.
            return Utils.rangeInRange (rect1X, rect1X + rect1W, rect2X, rect2X + rect2W) &&
                Utils.rangeInRange (rect1Y, rect1Y + rect1H, rect2Y, rect2Y + rect2H);
        }

        /**
         * Determine if two circles intersect each other. Each circle is described by a point that represents
         * its center and a radius value.
         *
         * @param circle1X the X coordinate of the center of the first circle
         * @param circle1Y the Y coordinate of the center of the first circle
         * @param circle1R the radius of the first circle
         * @param circle2X the X coordinate of the center of the second circle
         * @param circle2Y the Y coordinate of the center of the second circle
         * @param circle2R the radius of the second circle
         * @returns {boolean} true if the two circles intersect or false otherwise
         */
        export function circleInCircle (circle1X : number, circle1Y : number, circle1R : number,
                                        circle2X : number, circle2Y : number, circle2R : number) : boolean
        {
            // Get the combined radius of both circles.
            let combinedR = circle1R + circle2R;

            // In order for the two circles to intersect, the distance between their center points has to be
            // no larger than the combination of both of their radii. Like in the point/circle collision, we
            // work with the squares here because they just need to be in range.
            return Utils.distanceSquaredBetweenXY (circle1X, circle1Y, circle2X,
                                                   circle2Y) <= combinedR * combinedR;
        }

        /**
         * Determine if the rectangle and circle provided intersect each other. The rectangle is described by
         * the position of its upper left corner and its dimensions while the circle is described by its
         * center point and radius.
         *
         * @param rectX the X coordinate of the upper left corner of the rectangle
         * @param rectY the Y coordinate of the upper left corner of the rectangle
         * @param rectW the width of the rectangle
         * @param rectH the height of the rectangle
         * @param circleX the X coordinate of the center of the circle
         * @param circleY the Y coordinate of the center of the circle
         * @param circleR the radius of the circle
         * @returns {boolean} true if the rectangle and circle intersect or false otherwise
         */
        export function rectInCircle (rectX : number, rectY : number, rectW : number, rectH : number,
                                      circleX : number, circleY : number, circleR : number) : boolean
        {
            // Determine the closest point on the rectangle to the center of the circle, and then see if that
            // point is within the circle or not using the other collision function.
            //
            // The clamping of the values finds the point on the perimeter of the rectangle that is
            // orthogonally closest to the center of the circle.
            return Collision.pointInCircle (Utils.clampToRange (circleX, rectX, rectX + rectW),
                                            Utils.clampToRange (circleY, rectY, rectY + rectH),
                                            circleX, circleY, circleR);
        }

        /**
         * Determine the intersection point between the line (p0, p1) and (p2, p3), if any can be found. In
         * particular, if the two lines are parallel to each other, no intersection is possible. Similarly,
         * if
         * both lines are collinear, there are an infinite number of intersection points.
         *
         * If result is non-null, the collision point is put into that point before it is returned. Otherwise
         * a new point is created if needed
         *
         * The function returns a point that represents the intersection point, or null if there is no
         * intersection available. When result is specified, the return value is that point if there is an
         * intersection; in the case where there is no intersection, the point is left as-is and null is
         * returned.
         *
         * Note that this method returns the intersection of the two lines as if they were infinitely
         * projected in both directions; to determine if the intersection is on the line segments as
         * specified, use the other method.
         *
         * @param p0 the first point of the first line
         * @param p1 the second point of the first line
         * @param p2 the first point of the second line
         * @param p3 the second point of the second line
         * @param result if non-null and there is an intersection, this point will contain the intersection
         * and becomes the return value; left untouched if provided and there is no intersection
         * @returns {Point} the point at which the two lines intersect, or null if there is no intersection
         * @see Collision.lineIntersectionXY
         * @see Collision.segmentIntersection
         * @see Collision.segmentIntersectionXY
         */
        export function lineIntersection (p0 : Point, p1 : Point, p2 : Point, p3 : Point,
                                          result : Point = null) : Point
        {
            // Use the other function to do the job
            return this.lineIntersectionXY (p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, result);
        }

        /**
         * Determine the intersection point between the line (p0, p1) and (p2, p3), if any can be found. In
         * particular, if the two lines are parallel to each other, no intersection is possible. Similarly,
         * if
         * both lines are collinear, there are an infinite number of intersection points.
         *
         * If result is non-null, the collision point is put into that point before it is returned. Otherwise
         * a new point is created if needed
         *
         * The function returns a point that represents the intersection point, or null if there is no
         * intersection available. When result is specified, the return value is that point if there is an
         * intersection; in the case where there is no intersection, the point is left as-is and null is
         * returned.
         *
         * Note that this method returns the intersection of the two lines as if they were infinitely
         * projected in both directions; to determine if the intersection is on the line segments as
         * specified, use the other method.
         *
         * @param x0 the X coordinate of the first point of the first line
         * @param y0 the Y coordinate of the first point of the first line
         * @param x1 the X coordinate of the second point of the first line
         * @param y1 the Y coordinate of the second point of the first line
         * @param x2 the X coordinate of the first point of the second line
         * @param y2 the Y coordinate of the first point of the second line
         * @param x3 the X coordinate of the second point of the second line
         * @param y3 the Y coordinate of the second point of the second line
         * @param result if non-null and there is an intersection, this point will contain the intersection
         * and becomes the return value; left untouched if provided and there is no intersection
         * @returns {Point} the point at which the two lines intersect, or null if there is no intersection
         * @see Collision.lineIntersection
         * @see Collision.segmentIntersection
         * @see Collision.segmentIntersectionXY
         */
        export function lineIntersectionXY (x0 : number, y0 : number, x1 : number, y1 : number,
                                            x2 : number, y2 : number, x3 : number, y3 : number,
                                            result : Point = null) : Point
        {
            // This function operates based on standard form equation of a line, which is:
            //   Ax + By = C; where A, B and C are integers and A is positive
            //
            // This basically decomposes the point-slope (the m in 'y = mx + b') into the terms that apply to
            // both the X and Y values separately; in particular: A = y2 - y1 B = x1 - x2 C = calculated as
            // Ax + By like the equation says, by inserting a point into the line  Note that the order of x1
            // and x2 is reversed in the equation for B; this is due to algebraic manipulation and
            // corresponds to the "mx" term of the point-slope form shifting to the left side of the equality
            // sign to convert the equation to 'y - mx = b'.  The function operates over four points, and
            // works by taking a system of two identical equations and solving them as one; doing this
            // determines the one point that satisfies both equations, which is the point at which those
            // lines intersect.  The algebra for that is outside the scope of these comments, but suffice it
            // to say that given the two equations (where here the 1 and 2 indicate the first and second
            // lines, respectively): A1X + B1Y = C1 A2X + B2Y = C2  The system can be worked out to the following two equations, isolating the terms for X and for Y:  X = ((C1 * B2) - (C2 * B1)) / ((A1 * B2) - (A2 * B1)) y = ((C2 * A1) - (C1 * A2)) / ((B2 * A1) - (B1 * A2))  Note that the denominator for both calculations is identical (although here the terms are represented in a slightly different order, A * B == B * A), so we only need to calculate that value once.

            // First, calculate the parts of the first line, which uses points 0 and 1
            let A1 = y1 - y0,
                B1 = x0 - x1,
                C1 = (A1 * x0) + (B1 * y0),

            // Now the parts for the second line, which uses points 2 and 3
                A2 = y3 - y2,
                B2 = x2 - x3,
                C2 = (A2 * x2) + (B2 * y2),

            // The denominator of both sides of the equation.
                denominator = (A1 * B2) - (A2 * B1),

            // the X intersection,
                xIntersect = ((C1 * B2) - (C2 * B1)) / denominator,

            // the Y intersection,
                yIntersect = ((C2 * A1) - (C1 * A2)) / denominator;

            // If either the X or Y value is not a finite number (NaN or Infinity), then the lines don't
            // intersect. In that case, return null; If interested, you could calculate the Y intercept
            // (b = y - mx) of both lines; if they are the same, the lines are collinear, otherwise they are
            // merely parallel.
            if (isFinite (xIntersect) == false || isFinite (yIntersect) == false)
                return null;

            // Set up the point with the values; create one if we don't already have one.
            if (result == null)
                return new Point (xIntersect, yIntersect);
            else
            {
                result.setToXY (xIntersect, yIntersect);
                return result;
            }
        }

        /**
         * Determine the intersection point between the line (p0, p1) and (p2, p3), if any can be found. In
         * particular, if the two lines are parallel to each other, no intersection is possible. Similarly,
         * if
         * both lines are collinear, there are an infinite number of intersection points.
         *
         * If result is non-null, the collision point is put into that point before it is returned. Otherwise
         * a new point is created if needed
         *
         * The function returns a point that represents the intersection point, or null if there is no
         * intersection available. When result is specified, the return value is that point if there is an
         * intersection; in the case where there is no intersection, the point is left as-is and null is
         * returned.
         *
         * This method, unlike the other method, returns the intersection of the two line segments directly;
         * if the two line segments do not directly intersect, null is returned.
         *
         * @param p0 the first point of the first line
         * @param p1 the second point of the first line
         * @param p2 the first point of the second line
         * @param p3 the second point of the second line
         * @param result if non-null and there is an intersection, this point will contain the intersection
         * and becomes the return value; left untouched if provided and there is no intersection
         * @returns {Point} the point at which the two lines intersect, or null if there is no intersection
         * @see Collision.lineIntersection
         * @see Collision.lineIntersectionXY
         * @see Collision.segmentIntersectionXY
         */
        export function segmentIntersection (p0 : Point, p1 : Point, p2 : Point, p3 : Point,
                                             result : Point = null) : Point
        {
            // Use the other function to do the job
            return this.segmentIntersectionXY (p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, result);
        }

        /**
         * Determine the intersection point between the line (p0, p1) and (p2, p3), if any can be found. In
         * particular, if the two lines are parallel to each other, no intersection is possible. Similarly,
         * if
         * both lines are collinear, there are an infinite number of intersection points.
         *
         * If result is non-null, the collision point is put into that point before it is returned. Otherwise
         * a new point is created if needed
         *
         * The function returns a point that represents the intersection point, or null if there is no
         * intersection available. When result is specified, the return value is that point if there is an
         * intersection; in the case where there is no intersection, the point is left as-is and null is
         * returned.
         *
         * This method, unlike the other method, returns the intersection of the two line segments directly;
         * if the two line segments do not directly intersect, null is returned.
         *
         * @param x0 the X coordinate of the first point of the first line
         * @param y0 the Y coordinate of the first point of the first line
         * @param x1 the X coordinate of the second point of the first line
         * @param y1 the Y coordinate of the second point of the first line
         * @param x2 the X coordinate of the first point of the second line
         * @param y2 the Y coordinate of the first point of the second line
         * @param x3 the X coordinate of the second point of the second line
         * @param y3 the Y coordinate of the second point of the second line
         * @param result if non-null and there is an intersection, this point will contain the intersection
         * and becomes the return value; left untouched if provided and there is no intersection
         * @returns {Point} the point at which the two lines intersect, or null if there is no intersection
         * @see Collision.lineIntersection
         * @see Collision.lineIntersectionXY
         * @see Collision.segmentIntersection
         */
        export function segmentIntersectionXY (x0 : number, y0 : number, x1 : number, y1 : number,
                                               x2 : number, y2 : number, x3 : number, y3 : number,
                                               result : Point = null) : Point
        {
            // Use the other method to determine if the intersection exists at all; if it does not, we can
            // return null right now.
            let retVal = this.lineIntersectionXY (x0, y0, x1, y1, x2, y2, x3, y3, result);
            if (retVal == null)
                return null;

            // There is an intersection point; in order to ensure that the intersection is actually on one of
            // the segments as defined, we further check to ensure that the point of intersection falls within
            // the bounding rectangles of both lines.
            if (this.pointInRect (retVal.x, retVal.y, x0, y0, x1 - x0, y1 - y0) &&
                this.pointInRect (retVal.x, retVal.y, x2, y2, x3 - x2, y3 - y2))
                return retVal;

            // No intersection
            return null;
        }
    }
