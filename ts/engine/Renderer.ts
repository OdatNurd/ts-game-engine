module nurdz.game
{
    /**
     * This enum is used in the drawArrow method to determine what end of the line that makes up the arrow
     * a head should be drawn at.
     */
    export enum ArrowType
    {
        /**
         * Neither end of the line should have an arrow head. This is just basically a slightly more
         * expensive call to draw a simple line.
         */
        NONE = 0,

        /**
         * The start of the line should have an arrowhead.
         */
        START,

        /**
         * The end of the line should have an arrowhead.
         */
        END,

        /**
         * Both ends of the line should have an arrowhead.
         */
        BOTH
    }

    /**
     * This enum is used in the drawArrow method to determine what kind of arrow head to render onto the
     * arrow.
     *
     * Most of these provide an arrow with a curved head and just vary the method used to draw the curve,
     * which has subtle effects on how the curve appears.
     */
    export enum ArrowStyle
    {
        /**
         * The arrowhead is curved using a simple arc.
         */
        ARC = 0,

        /**
         * The arrowhead has a straight line end
         */
        STRAIGHT,

        /**
         * The arrowhead is unfilled with no end (it looks like a V)
         */
        UNFILLED,

        /**
         * The arrowhead is curved using a quadratic curve.
         */
        QUADRATIC,

        /**
         * The arrowhead is curbed using a bezier curve
         */
        BEZIER
    }

    /**
     * This represents a point in a polygon as defined by the Polygon API.
     *
     * In the general case, this is just an array of two numbers in X,Y order. These elements can optionally
     * be preceded by a string which describes what to do with the point:
     *   - 'm' executes a moveTo() for this point, for repositioning where the polygon lines start from
     *   - 'l' executes a lineTo() for this point, connecting this point with where the last polygon line
     *      ended.
     *   - 'c' executes a closePath(), to close off this sub path and start a new one.
     *
     * In practice, most points are going to be of the lineTo variety, and so the default if no string
     * element is present in the array is 'l'. However, as a special case, if the first point in a Polygon
     * does not have a string member, it is assumed to be an 'm' for a moveTo() and not an 'l' for a
     * lineTo(). This allows for a polygon to be self contained in an easier manner.
     *
     * Note that this point uses an array and not a Point instance because most polygons will probably be
     * defined as a static array and these are easier to construct. However, the Point class can turn
     * itself into an array representation.
     *
     * @see Point.toArray
     * @see Polygon
     */
    export type PolygonPoint = Array<number|string>;

    /**
     * This is a simple type that represents a polygon to be rendered or stroked. This is an array of
     * Point specifications that describe the polygon.
     *
     * The last point will implicitly connect to the first point when rendered, so it is not necessary to
     * include an end point that "closes" the polygon except in cases where you don't want the polygon to
     * end back where it started.
     *
     * @see PolygonPoint
     */
    export type Polygon = Array<PolygonPoint>;

    /**
     * This interface determines the rendering capabilities of the engine. Some class needs to be plugged
     * into the Stage that implements this interface.
     */
    export interface Renderer
    {
        /**
         * Obtain the width of the render area, in pixels. This should match the appropriate dimension of
         * the Stage.
         *
         * @returns {number} the width of the render area in pixels.
         */
        width : number;

        /**
         * Obtain the width of the render area, in pixels. This should match the appropriate dimension of
         * the Stage.
         *
         * @returns {number} the height of the render area in pixels.
         */
        height : number;

        /**
         * Clear the entire rendering area with the provided color.
         *
         * @param color the color to clear the stage with.
         */
        clear (color : string) : void

        /**
         * Render a filled rectangle with its upper left corner at the position provided and with the provided
         * dimensions.
         *
         * @param x X location of the upper left corner of the rectangle
         * @param y Y location of the upper left corner of the rectangle
         * @param width width of the rectangle to render
         * @param height height of the rectangle to render
         * @param color the color to fill the rectangle with
         */
        fillRect (x : number, y : number, width : number, height : number, color : string) : void;

        /**
         * Render an outlined rectangle with its upper left corner at the position provided and with the
         * provided dimensions.
         *
         * @param x X location of the upper left corner of the rectangle
         * @param y Y location of the upper left corner of the rectangle
         * @param width width of the rectangle to render
         * @param height height of the rectangle to render
         * @param color the color to stroke the rectangle with
         * @param lineWidth the thickness of the line to stroke with
         */
        strokeRect(x : number, y : number, width : number, height : number,
                   color : string, lineWidth : number) : void;

        /**
         * Render a filled circle with its center at the position provided.
         *
         * @param x X location of the center of the circle
         * @param y Y location of the center of the circle
         * @param radius radius of the circle to draw
         * @param color the color to fill the circle with
         */
        fillCircle (x : number, y : number, radius : number, color : string) : void;

        /**
         * Render a stroked circle with its center at the position provided.
         *
         * @param x X location of the center of the circle
         * @param y Y location of the center of the circle
         * @param radius radius of the circle to draw
         * @param color the color to stroke the circle with
         * @param lineWidth the thickness of the line to stroke with
         */
        strokeCircle (x : number, y : number, radius : number, color : string, lineWidth : number) : void;

        /**
         * Render an arbitrary polygon by connecting all of the points provided in the polygon and then
         * filling the result.
         *
         * The points should be in the polygon in clockwise order.
         *
         * @param pointList the list of points that describe the polygon to render.
         * @param color the color to fill the polygon with.
         */
        fillPolygon (pointList : Polygon, color : string) : void;

        /**
         * Render an arbitrary polygon by connecting all of the points provided in the polygon and then
         * stroking the result.
         *
         * The points should be in the polygon in clockwise order.
         *
         * @param pointList the list of points that describe the polygon to render.
         * @param color the color to fill the polygon with.
         * @param lineWidth the thickness of the line to stroke with
         */
        strokePolygon (pointList : Polygon, color : string, lineWidth : number) : void;

        /**
         * This helper method sets all of the styles necessary for rendering lines. This can be called before
         * drawing operations as a convenience to set all desired values in one call.
         *
         * NOTE: The values set here *do not* persist unless you never change them anywhere else. This
         * includes setting arrow styles.
         *
         * @param color the color to draw lines with
         * @param lineWidth] the pixel width of rendered lines
         * @param lineCap the line cap style to use for rendering lines
         * @see Render.setArrowStyle
         */
        setLineStyle (color : string, lineWidth : number, lineCap : string) : void;

        /**
         * Set the style for all subsequent drawArrow() calls to use when drawing arrows. This needs to be
         * called prior to drawing any arrows; the value does not persist. In particular, changing line
         * styles may also change arrow style.
         *
         * @param color the color to draw an arrow with
         * @param lineWidth the width of the arrow line
         * @see Render.setLineStyle
         */
        setArrowStyle (color : string, lineWidth : number) : void;

        /**
         * The basis of this code comes from:
         *     http://www.dbp-consulting.com/tutorials/canvas/CanvasArrow.html
         *
         * It has been modified to fit here, which includes things like assuming nobody is going to pass
         * strings, different method for specifying defaults, etc.
         *
         * This will render a line from x1,y1 to x2,y2 and then draw an arrow head on one or both ends of the
         * line in a few different styles.
         *
         * The which parameter determine which ends of the line get arrow heads drawn and the style
         * parameter controls what the drawn arrow head looks like.
         *
         * It is also possible to specify the angle that the arrow head makes from the end of the line and the
         * length of the sides of the arrow head.
         *
         * The arrow is drawn using the style set by setArrowStyle(), which is a combination of a stoke and
         * fill color and a line width.
         *
         * @param x1 the X coordinate of the start of the line
         * @param y1 the Y coordinate of the start of the line
         * @param x2 the X coordinate of the end of the line
         * @param y2 the Y coordinate of the end of the line
         * @param style the style of the arrowhead
         * @param which the end of the line that gets the arrow head(s)
         * @param angle the angle the arrow head makes from the end of the line
         * @param d the length (in pixels) of the edges of the arrow head
         * @see Render.setArrowStyle
         */
        drawArrow (x1 : number, y1 : number, x2 : number, y2 : number,
                   style : ArrowStyle, which : ArrowType, angle : number, d : number) : void;

        /**
         * Display text at the position provided. How the the text anchors to the point provided needs to be
         * set by you prior to calling. By default, the location specified is the top left corner.
         *
         * This method will set the color to the color provided but all other font properties will be as they
         * were last set (whenever that was).
         *
         * @param text the text to draw
         * @param x X location of the text
         * @param y Y location of the text
         * @param color the color to draw the text with
         */
        drawTxt (text : string, x : number, y : number, color : string) : void;

        /**
         * Displays a bitmap to the rendering area such that its upper left corner is at the point provided.
         *
         * @param bitmap the bitmap to display
         * @param x X location to display the bitmap at
         * @param y Y location to display the bitmap at
         * @see Stage.blitPart
         * @see Stage.blitCentered
         * @see Stage.blitPartCentered
         * @see Stage.blitPartCenteredRotated
         * @see Stage.blitCenteredRotated
         */
        blit (bitmap : HTMLImageElement, x : number, y : number) : void;

        /**
         * Displays a bitmap to the rendering area such that its center is at the point provided.
         *
         * @param bitmap the bitmap to display
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @see Stage.blit
         * @see Stage.blitPart
         * @see Stage.blitPartCentered
         * @see Stage.blitPartCenteredRotated
         * @see Stage.blitCenteredRotated
         */
        blitCentered (bitmap : HTMLImageElement, x : number, y : number) : void;

        /**
         * Display a bitmap to the rendering area such that its center is at the point provided. The bitmap is
         * also rotated according to the rotation value, which is an angle in degrees.
         *
         * @param bitmap the bitmap to display
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @param angle the angle to rotate the bitmap to (in degrees)
         * @see Stage.blit
         * @see Stage.blitPart
         * @see Stage.blitCentered
         * @see Stage.blitPartCentered
         * @see Stage.blitPartCenteredRotated
         */
        blitCenteredRotated (bitmap : HTMLImageElement, x : number, y : number, angle : number) : void;

        /**
         * Acts as blit() does, but instead of rendering the entire image, only a portion is displayed.
         * Specifically, an area of size width * height originating at offsX, offsY is displayed.
         *
         * @param bitmap the bitmap to display from
         * @param x X location to display at
         * @param y Y location to display at
         * @param offsX X offset in bitmap of area to blit
         * @param offsY Y offset in bitmap of area to blit
         * @param width width of bitmap area to display
         * @param height height of bitmap area to display
         * @see Stage.blit
         * @see Stage.blitCentered
         * @see Stage.blitPartCentered
         * @see Stage.blitPartCenteredRotated
         * @see Stage.blitCenteredRotated
         */
        blitPart (bitmap : HTMLImageElement, x : number, y : number,
                  offsX : number, offsY : number,
                  width : number, height : number) : void;

        /**
         * Acts as blitCentered() does, but instead of rendering the entire image, only a portion is
         * displayed. Specifically, an area of size width * height originating at offsX, offsY is displayed.
         *
         * @param bitmap the bitmap to display from
         * @param x the center oX location to display at
         * @param y the center Y location to display at
         * @param offsX X offset in bitmap of area to blit
         * @param offsY Y offset in bitmap of area to blit
         * @param width width of bitmap area to display
         * @param height height of bitmap area to display
         * @see Stage.blit
         * @see Stage.blitPart
         * @see Stage.blitCentered
         * @see Stage.blitPartCenteredRotated
         * @see Stage.blitCenteredRotated
         */
        blitPartCentered (bitmap : HTMLImageElement, x : number, y : number,
                          offsX : number, offsY : number,
                          width : number, height : number) : void;

        /**
         * Acts as blitCenteredRotated() does, but instead of rendering the entire image, only a portion is
         * displayed. Specifically, an area of size width * height originating at offsX, offsY is displayed.
         *
         * @param bitmap the bitmap to display from
         * @param x the center oX location to display at
         * @param y the center Y location to display at
         * @param angle the angle to rotate the bitmap to (in degrees)
         * @param offsX X offset in bitmap of area to blit
         * @param offsY Y offset in bitmap of area to blit
         * @param width width of bitmap area to display
         * @param height height of bitmap area to display
         * @see Stage.blit
         * @see Stage.blitPart
         * @see Stage.blitCentered
         * @see Stage.blitPartCentered
         * @see Stage.blitCenteredRotated
         */
        blitPartCenteredRotated (bitmap : HTMLImageElement, x : number, y : number, angle : number,
                          offsX : number, offsY : number,
                          width : number, height : number) : void;

        /**
         * Displays a sprite to the rendering area such that its upper left corner is at the point provided.
         *
         * @param sheet the sprite sheet containing the sprite to display
         * @param sprite the index of the sprite in the sprite sheet
         * @param x X location to display the bitmap at
         * @param y Y location to display the bitmap at
         * @see Stage.blitSpriteCentered
         * @see Stage.blitSpriteCenteredRotated
         */
        blitSprite (sheet : SpriteSheet, sprite : number, x : number, y : number) : void;

        /**
         * Displays a sprite to the rendering area such that its center is at the point provided.
         *
         * @param sheet the sprite sheet containing the sprite to display
         * @param sprite the index of the sprite in the sprite sheet
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @see Stage.blitSprite
         * @see Stage.blitSpriteCenteredRotated
         */
        blitSpriteCentered (sheet : SpriteSheet, sprite : number, x : number, y : number) : void;

        /**
         * Display a sprite to the rendering area such that its center is at the point provided. The sprite is
         * also rotated according to the rotation value, which is an angle in degrees.
         *
         * @param sheet the sprite sheet containing the sprite to display
         * @param sprite the index of the sprite in the sprite sheet
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @param angle the angle to rotate the bitmap to (in degrees)
         * @see Stage.blitSprite
         * @see Stage.blitSpriteCenteredRotated
         */
        blitSpriteCenteredRotated (sheet : SpriteSheet, sprite : number, x : number, y : number, angle : number) : void;

        /**
         * Do an (optional) translation and (optional) rotation of the rendering area. You can perform one or
         * both operations. This implicitly saves the current state on a stack so that it can be restored
         * later via a call to restore().
         *
         * When both an X and a Y value are provided, the rendering area is translated so that the origin is
         * moved in the translation direction given. One or both values can be null to indicate that no
         * translation is desired. Note that both X and Y have to be provided for a translation to happen.
         *
         * When the angle is not null, the rendering area is rotated by that many degrees around the
         * origin such that any further rendering will appear rotated.
         *
         * The order of operations is always translation first and rotation second, because once the rotation
         * happens, the direction of the axes are no longer what you expect. In particular this means that
         * you should be careful about invoking this function when the rendering area has already been
         * translated and/or rotated.
         *
         * Note that the current translation and rotation of the rendering area is held on a stack, so every
         * call to this method needs to be balanced with a call to the restore() method.
         *
         * @param x the amount to translate on the X axis or null for no translation
         * @param y the amount to translate on the Y axis or null for no translation
         * @param angle the angle to rotate the rendering area, in degrees or null for no translation
         * @see Render.restore
         */
        translateAndRotate (x : number, y : number, angle : number) : void;

        /**
         * Restore the canvas state that was in effect the last time that translateAndRotate was invoked. This
         * needs to be invoked the same number of times as that function was invoked because the canvas state
         * is stored on a stack.
         *
         * @see Render.translateAndRotate
         */
        restore () : void;
    }
}
