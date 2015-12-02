module nurdz.game
{
    /**
     * This class represents the stage area in the page, which is where the game renders itself.
     *
     * The class knows how to create the stage and do some rendering. This is also where the core
     * rendering loop is contained.
     */
    export class Stage
    {
        /**
         * The width of the stage, in pixels. This is set at creation time and cannot change.
         *
         * @const
         * @type {number}
         */
        private width : number = STAGE_WIDTH;

        /**
         * The height of the stage, in pixels. This is set at creation time and cannot change.
         *
         * @const
         * @type {number}
         */
        private height : number = STAGE_HEIGHT;

        /**
         * The canvas that the stage renders itself to.
         *
         * @type {HTMLCanvasElement}
         */
        private canvas : HTMLCanvasElement;

        /**
         * The rendering context for our canvas. This is the gateway to rendering magic.
         *
         * @type {CanvasRenderingContext2D}
         */
        private canvasContext : CanvasRenderingContext2D;

        /**
         * The width of the stage, in pixels. This is set at creation time and cannot change.
         *
         * @type {number} the width of the stage area in pixels
         */
        get pixelWidth () : number { return this.width; }

        /**
         * The height of the stage, in pixels. This is set at creation time and cannot change.
         *
         * @type {number} the height of the stage area in pixels
         */
        get pixelHeight () : number { return this.height; }

        /**
         * Get the underlying rendering context for the stage.
         *
         * @returns {CanvasRenderingContext2D} the underlying rendering context for the stage
         */
        get context () : CanvasRenderingContext2D { return this.canvasContext; }

        /**
         * Get the underlying canvas object for the stage.
         *
         * @returns {HTMLCanvasElement} the underlying canvas element for the stage
         */
        get canvasObject () : HTMLCanvasElement { return this.canvas; }

        /**
         * Create the stage on which all rendering for the game will be done.
         *
         * A canvas will be created and inserted into the DOM as the last child of the container DIV with the
         * ID provided.
         *
         * The CSS of the DIV will be modified to have a width and height of the canvas, with options that
         * cause it to center itself.
         *
         * @param containerDivID the ID of the DIV that should contain the created canvas
         * @param initialColor the color to clear the canvas to once it is created
         * @constructor
         * @throws {ReferenceError} if there is no element with the ID provided
         */
        constructor (containerDivID : string, initialColor: string = 'black')
        {
            // Obtain the container element that we want to insert the canvas into.
            var container = document.getElementById (containerDivID);
            if (container == null)
                throw new ReferenceError ("Unable to create stage: No such element with ID '" + containerDivID + "'");

            // Create the canvas and give it the appropriate dimensions.
            this.canvas = document.createElement ("canvas");
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            // Modify the style of the container div to make it center horizontally.
            container.style.width = this.width + "px";
            container.style.height = this.height + "px";
            container.style.marginLeft = "auto";
            container.style.marginRight = "auto";

            // Get the context for the canvas and then clear it.
            this.canvasContext = this.canvas.getContext ('2d');
            this.clear (initialColor);

            // Append the canvas to the container
            container.appendChild (this.canvas);
        }

        /**
         * Clear the entire stage with the provided color.
         *
         * @param color the color to clear the stage with.
         */
        clear (color : string = 'black')
        {
            this.canvasContext.fillStyle = color;
            this.canvasContext.fillRect (0, 0, this.width, this.height);
        }

        fillRect (x: number, y: number, width: number, height: number, color : string)
        {

        }
    }
}
