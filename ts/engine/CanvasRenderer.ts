module nurdz.game
{
    /**
     * This class represents the stage area in the page, which is where the game renders itself.
     *
     * The class knows how to create the stage and do some rendering. This is also where the core
     * rendering loop is contained.
     */
    export class CanvasRenderer implements Renderer
    {
        /**
         * The rendering context for our canvas. This is the gateway to rendering magic.
         *
         * @type {CanvasRenderingContext2D}
         */
        private _canvasContext : CanvasRenderingContext2D;

        /**
         * The width of the stage, in pixels. This is set at creation time and cannot change.
         *
         * @type {number} the width of the stage area in pixels
         */
        get width () : number
        { return STAGE_WIDTH; }

        /**
         * The height of the stage, in pixels. This is set at creation time and cannot change.
         *
         * @type {number} the height of the stage area in pixels
         */
        get height () : number
        { return STAGE_HEIGHT; }

        /**
         * Get the underlying rendering context for the stage.
         *
         * @returns {CanvasRenderingContext2D} the underlying rendering context for the stage
         */
        get context () : CanvasRenderingContext2D
        { return this._canvasContext; }

        /**
         * Construct an instance of the class that knows how to render to the canvas provided. All
         * rendering will be performed by this canvas.
         *
         * This class assumes that the canvas is the entire size of the stage.
         *
         * @param canvas the canvas to use for rendering
         */
        constructor (canvas : HTMLCanvasElement)
        {
            // Set our internal canvas context based on the canvas we were given.
            this._canvasContext = canvas.getContext ('2d');
        }

        /**
         * Clear the entire rendering area with the provided color.
         *
         * @param color the color to clear the stage with.
         */
        clear (color : string = 'black') : void
        {
            this._canvasContext.fillStyle = color;
            this._canvasContext.fillRect (0, 0, STAGE_WIDTH, STAGE_HEIGHT);
        }

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
        fillRect (x : number, y : number, width : number, height : number, color : string) : void
        {
            this._canvasContext.fillStyle = color;
            this._canvasContext.fillRect (x, y, width, height);
        }

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
        strokeRect (x : number, y : number, width : number, height : number,
                    color : string, lineWidth : number = 1) : void
        {
            this._canvasContext.strokeStyle = color;
            this._canvasContext.lineWidth = lineWidth;
            this._canvasContext.strokeRect (x, y, width, height);
        }

        /**
         * Render a filled circle with its center at the position provided.
         *
         * @param x X location of the center of the circle
         * @param y Y location of the center of the circle
         * @param radius radius of the circle to draw
         * @param color the color to fill the circle with
         */
        fillCircle (x : number, y : number, radius : number, color : string) : void
        {
            this._canvasContext.fillStyle = color;
            this._canvasContext.beginPath ();
            this._canvasContext.arc (x, y, radius, 0, Math.PI * 2, true);
            this._canvasContext.fill ();
        }

        /**
         * Render a stroked circle with its center at the position provided.
         *
         * @param x X location of the center of the circle
         * @param y Y location of the center of the circle
         * @param radius radius of the circle to draw
         * @param color the color to stroke the circle with
         * @param lineWidth the thickness of the line to stroke with
         */
        strokeCircle (x : number, y : number, radius : number, color : string, lineWidth : number = 1) : void
        {
            this._canvasContext.strokeStyle = color;
            this._canvasContext.lineWidth = lineWidth;
            this._canvasContext.beginPath ();
            this._canvasContext.arc (x, y, radius, 0, Math.PI * 2, true);
            this._canvasContext.stroke ();
        }

        /**
         * Perform the job of executing the commands that will render the polygon points listed.
         *
         * This begins a path, executes all of the commands, and then returns. It is up to the color to
         * set any styles needed and stroke or fill the path as desired.
         *
         * @param pointList the polygon to do something with.
         */
        private renderPolygon (pointList : Polygon)
        {
            // Start the path now
            this._canvasContext.beginPath ();

            // Iterate over all points and handle them.
            for (let i = 0 ; i < pointList.length ; i++)
            {
                // Alias the point
                let point = pointList[i];
                let cmd,x,y;

                // If the first item is a string, then it is a command and the following parts are the
                // point values (except for a 'c' command, which does not need them.
                if (typeof point[0] == "string")
                {
                    cmd = point[0];
                    x = point[1];
                    y = point[2];
                }
                else
                {
                    // There are only two elements, so there is an implicit command. If this is the first
                    // point, the command is an implicit moveTo, otherwise it is an implicit lineTo.
                    cmd = (i == 0 ? 'm' : 'l');
                    x = point[0];
                    y = point[1];
                }
                switch (cmd)
                {
                    case 'm':
                        this._canvasContext.moveTo (x, y);
                        break;

                    case 'l':
                        this._canvasContext.lineTo (x, y);
                        break;

                    case 'c':
                        this._canvasContext.closePath ();
                        break;
                }
            }

            // Close the path now
            this._canvasContext.closePath ();
        }

        /**
         * Render an arbitrary polygon by connecting all of the points provided in the polygon and then
         * filling the result.
         *
         * The points should be in the polygon in clockwise order.
         *
         * @param pointList the list of points that describe the polygon to render.
         * @param color the color to fill the polygon with.
         */
        fillPolygon (pointList : Polygon, color : string) : void
        {
            // Set the color, render and fill.
            this._canvasContext.fillStyle = color;
            this.renderPolygon (pointList);
            this._canvasContext.fill ();
        }

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
        strokePolygon (pointList : Polygon, color : string, lineWidth : number = 1) : void
        {
            // Set the color and line width, render and stroke.
            this._canvasContext.strokeStyle = color;
            this._canvasContext.lineWidth = lineWidth;
            this.renderPolygon (pointList);
            this._canvasContext.stroke ();
        }

        /**
         * This helper method sets all of the styles necessary for rendering lines to the stage. This can be
         * called before drawing operations as a convenience to set all desired values in one call.
         *
         * NOTE: The values set here *do not* persist unless you never change them anywhere else. This
         * includes setting arrow styles.
         *
         * @param color the color to draw lines with
         * @param lineWidth] the pixel width of rendered lines
         * @param lineCap the line cap style to use for rendering lines
         * @see Render.setArrowStyle
         */
        setLineStyle (color : string, lineWidth : number = 3, lineCap : string = "round") : void
        {
            this._canvasContext.strokeStyle = color;
            this._canvasContext.lineWidth = lineWidth;
            this._canvasContext.lineCap = lineCap;
        }

        /**
         * This helper method draws the actual arrow head onto the canvas for a line. It assumes that all
         * styles have been set.
         *
         * The original drawArrow code allows its style parameter to be an instance of a function with this
         * signature to allow for custom arrow drawing, but that was removed.
         *
         * The function takes three sets of coordinates, which represent the endpoint of the line that the
         * arrow head is being drawn for (which is where the tip of the arrow should be), and the two
         * endpoints for the ends of the arrow head. These three points connected together form the arrow
         * head, though you are free to join them in any way you like (lines, arcs, etc).
         *
         * @param x0 the X coordinate of the left end of the arrow head line
         * @param y0 the Y coordinate of the left end of the arrow head line
         * @param x1 the X coordinate of the end of the line
         * @param y1 the Y coordinate of the end of the line
         * @param x2 the X coordinate of the right end of the arrow head line
         * @param y2 the Y coordinate of the right end of the arrow head line
         * @param style the style of arrow to drw
         */
        private drawHead (x0 : number, y0 : number, x1 : number, y1 : number, x2 : number, y2 : number,
                          style : number) : void
        {
            var backDistance;

            // First, the common drawing operations. Generate a line from the left of the arrow head to the
            // point of the arrow and then down the other side.
            this._canvasContext.save ();
            this._canvasContext.beginPath ();
            this._canvasContext.moveTo (x0, y0);
            this._canvasContext.lineTo (x1, y1);
            this._canvasContext.lineTo (x2, y2);

            // Now use the style to finish the arrow head.
            switch (style)
            {
                // The arrow head has a curved line that connects the two sides together.
                case 0:
                    backDistance = Math.sqrt (((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
                    this._canvasContext.arcTo (x1, y1, x0, y0, .55 * backDistance);
                    this._canvasContext.fill ();
                    break;

                // The arrow head has a straight line that connects the two sides together.
                case 1:
                    this._canvasContext.beginPath ();
                    this._canvasContext.moveTo (x0, y0);
                    this._canvasContext.lineTo (x1, y1);
                    this._canvasContext.lineTo (x2, y2);
                    this._canvasContext.lineTo (x0, y0);
                    this._canvasContext.fill ();
                    break;

                // The arrow head is unfilled, so we're already done.
                case 2:
                    this._canvasContext.stroke ();
                    break;

                // The arrow head has a curved line, but the arc is a quadratic curve instead of just a
                // simple arc.
                case 3:
                    var cpx = (x0 + x1 + x2) / 3;
                    var cpy = (y0 + y1 + y2) / 3;
                    this._canvasContext.quadraticCurveTo (cpx, cpy, x0, y0);
                    this._canvasContext.fill ();
                    break;

                // The arrow has a curved line, but the arc is a bezier curve instead of just a simple arc.
                case 4:
                    var cp1x, cp1y, cp2x, cp2y;
                    var shiftAmt = 5;
                    if (x2 == x0)
                    {
                        // Avoid a divide by zero if x2==x0
                        backDistance = y2 - y0;
                        cp1x = (x1 + x0) / 2;
                        cp2x = (x1 + x0) / 2;
                        cp1y = y1 + backDistance / shiftAmt;
                        cp2y = y1 - backDistance / shiftAmt;
                    }
                    else
                    {
                        backDistance = Math.sqrt (((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
                        var xBack = (x0 + x2) / 2;
                        var yBack = (y0 + y2) / 2;
                        var xMid = (xBack + x1) / 2;
                        var yMid = (yBack + y1) / 2;

                        var m = (y2 - y0) / (x2 - x0);
                        var dX = (backDistance / (2 * Math.sqrt (m * m + 1))) / shiftAmt;
                        var dY = m * dX;
                        cp1x = xMid - dX;
                        cp1y = yMid - dY;
                        cp2x = xMid + dX;
                        cp2y = yMid + dY;
                    }

                    this._canvasContext.bezierCurveTo (cp1x, cp1y, cp2x, cp2y, x0, y0);
                    this._canvasContext.fill ();
                    break;
            }
            this._canvasContext.restore ();
        }

        /**
         * Set the style for all subsequent drawArrow() calls to use when drawing arrows. This needs to be
         * called prior to drawing any arrows to ensure that the canvas style used to draw arrows is updated;
         * the value does not persist. In particular, changing line styles will also change this.
         *
         * @param color the color to draw an arrow with
         * @param lineWidth the width of the arrow line
         * @see Render.setLineStyle
         */
        setArrowStyle (color : string, lineWidth : number = 2) : void
        {
            this._canvasContext.strokeStyle = color;
            this._canvasContext.fillStyle = color;
            this._canvasContext.lineWidth = lineWidth;
        }

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
         * The style parameter can be one of the following values:
         *   0: Arrowhead with an arc end
         *   1: Arrowhead with a straight line end
         *   2: Arrowhead that is unfilled with no end (looks like a V)
         *   3: Arrowhead with a quadratic curve end
         *   4: Arrowhead with a bezier curve end
         *
         * The which parameter indicates which end of the line gets an arrow head. This is a bit field where
         * the first bit indicates the end of the line and the second bit indicates the start of the line.
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
                   style : ArrowStyle = ArrowStyle.QUADRATIC,
                   which : ArrowType = ArrowType.END,
                   angle : number = Math.PI / 8, d : number = 16) : void
        {
            // For ends with arrow we actually want to stop before we get to the arrow so that wide lines
            // won't put a flat end on the arrow caused by the rendered line end cap.
            var dist = Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            var ratio = (dist - d / 3) / dist;
            var toX, toY, fromX, fromY;

            // When the first bit is set, the end point of the line gets an arrow.
            if ((which & 1) != 0)
            {
                toX = Math.round (x1 + (x2 - x1) * ratio);
                toY = Math.round (y1 + (y2 - y1) * ratio);
            }
            else
            {
                toX = x2;
                toY = y2;
            }

            // When the second bit is set, the start point of the line gets an arrow.
            if ((which & 2) != 0)
            {
                fromX = x1 + (x2 - x1) * (1 - ratio);
                fromY = y1 + (y2 - y1) * (1 - ratio);
            }
            else
            {
                fromX = x1;
                fromY = y1;
            }

            // Draw the shaft of the arrow
            this._canvasContext.beginPath ();
            this._canvasContext.moveTo (fromX, fromY);
            this._canvasContext.lineTo (toX, toY);
            this._canvasContext.stroke ();

            // Calculate the angle that the line is going so that we can align the arrow head properly.
            var lineAngle = Math.atan2 (y2 - y1, x2 - x1);

            // Calculate the line length of the side of the arrow head. We know the length if the line was
            // straight, so we need to have its length when it's rotated to the angle that it is to be drawn
            // at. h is the line length of a side of the arrow head
            var h = Math.abs (d / Math.cos (angle));

            var angle1, angle2, topX, topY, botX, botY;

            // When the first bit is set, we want to draw an arrow head at the end of the line.
            if ((which & 1) != 0)
            {
                angle1 = lineAngle + Math.PI + angle;
                topX = x2 + Math.cos (angle1) * h;
                topY = y2 + Math.sin (angle1) * h;
                angle2 = lineAngle + Math.PI - angle;
                botX = x2 + Math.cos (angle2) * h;
                botY = y2 + Math.sin (angle2) * h;
                this.drawHead (topX, topY, x2, y2, botX, botY, style);
            }

            // WHen the second bit is set, we want to draw an arrow head at the start of the line.
            if ((which & 2) != 0)
            {
                angle1 = lineAngle + angle;
                topX = x1 + Math.cos (angle1) * h;
                topY = y1 + Math.sin (angle1) * h;
                angle2 = lineAngle - angle;
                botX = x1 + Math.cos (angle2) * h;
                botY = y1 + Math.sin (angle2) * h;
                this.drawHead (topX, topY, x1, y1, botX, botY, style);
            }
        }

        /**
         * Display text to the stage at the position provided. How the the text anchors to the point provided
         * needs to be set by you prior to calling. By default, the location specified is the top left
         * corner.
         *
         * This method will set the color to the color provided but all other font properties will be as they
         * were last set for the canvas.
         *
         * @param text the text to draw
         * @param x X location of the text
         * @param y Y location of the text
         * @param color the color to draw the text with
         */
        drawTxt (text : string, x : number, y : number, color : string) : void
        {
            this._canvasContext.fillStyle = color;
            this._canvasContext.fillText (text, x, y);
        }

        /**
         * Displays a bitmap to the stage such that its upper left corner is at the point provided.
         *
         * @param bitmap the bitmap to display
         * @param x X location to display the bitmap at
         * @param y Y location to display the bitmap at
         * @see Render.blitCentered
         * @see Render.blitCenteredRotated
         */
        blit (bitmap : HTMLImageElement, x : number, y : number) : void
        {
            this._canvasContext.drawImage (bitmap, x, y);
        }

        /**
         * Displays a bitmap to the stage such that its center is at the point provided.
         *
         * @param bitmap the bitmap to display
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @see Render.blit
         * @see Render.blitCenteredRotated
         */
        blitCentered (bitmap : HTMLImageElement, x : number, y : number) : void
        {
            this.translateAndRotate (x, y);
            this._canvasContext.drawImage (bitmap, -(bitmap.width / 2), -(bitmap.height / 2));
        }

        /**
         * Display a bitmap to the stage such that its center is at the point provided. The bitmap is also
         * rotated according to the rotation value, which is an angle in radians.
         *
         * @param bitmap the bitmap to display
         * @param x X location to display the center of the bitmap at
         * @param y Y location to display the center of the bitmap at
         * @param angle the angle to rotate the bitmap to (in degrees)
         * @see Render.blit
         * @see Render.blitCentered
         */
        blitCenteredRotated (bitmap : HTMLImageElement, x : number, y : number, angle : number) : void
        {
            this.translateAndRotate (x, y, angle);
            this._canvasContext.drawImage (bitmap, -(bitmap.width / 2), -(bitmap.height / 2));
            this._canvasContext.restore ();
        }

        /**
         * Do an (optional) translation and (optional) rotation of the stage canvas. You can perform one or
         * both operations. This implicitly saves the current canvas state on a stack so that it can be
         * restored later via a call to restore().
         *
         * When both an X and a Y value are provided, the canvas is translated so that the origin is moved in
         * the translation direction given. One or both values can be null to indicate that no translation is
         * desired.
         *
         * When the angle is not null, the canvas is rotated by that many degrees around the origin.
         *
         * The order of operations is always translation first and rotation second, because once the rotation
         * happens, the direction of the axes are no longer what you expect. In particular this means that you
         * should be careful about invoking this function when the canvas has already been translated and/or
         * rotated.
         *
         * Note that the current translation and rotation of the canvas is held on a stack, so every call to
         * this method needs to be balanced with a call to the restore() method.
         *
         * @param x the amount to translate on the X axis or null for no translation
         * @param y the amount to translate on the Y axis or null for no translation
         * @param angle the angle to rotate the canvas, in degrees or null for no translation
         * @see Render.restore
         */
        translateAndRotate (x : number = null, y : number = null, angle : number = null) : void
        {
            // First, save the canvas context.
            this._canvasContext.save ();

            // If we are translating, translate now.
            if (x != null && y != null)
                this._canvasContext.translate (x, y);

            // If we are rotating, rotate now.
            if (angle != null)
                this._canvasContext.rotate (angle * (Math.PI / 180));
        }

        /**
         * Restore the canvas state that was in effect the last time that translateAndRotate was invoked. This
         * needs to be invoked the same number of times as that function was invoked because the canvas state
         * is stored on a stack.
         *
         * @see Render.translateAndRotate
         */
        restore () : void
        {
            this._canvasContext.restore ();
        }

        /**
         * Return a string representation of the object, for debugging purposes.
         *
         * @returns {String} a debug string representation
         */
        toString () : string
        {
            return String.format ("[CanvasRenderer dimensions={0}x{1}, tileSize={2}]",
                                  STAGE_WIDTH, STAGE_HEIGHT, TILE_SIZE);
        }
    }
}
