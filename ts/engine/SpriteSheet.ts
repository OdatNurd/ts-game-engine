module nurdz.game
{
    /**
     * This class represents the basics of a sprite sheet; this takes the URL to an image, and will
     * preload that image and internally slice it into sprites at given size boundaries for later rendering.
     *
     * This version of the class requires all sprites in the same sprite sheet to have the same dimensions.
     */
    export class SpriteSheet
    {
        /**
         * The image that underlies us; this is what holds all of our sprites.
         */
        protected _image : HTMLImageElement;

        /**
         * The width of each sprite in the sprite sheet, in pixels.
         */
        protected _spriteWidth : number;

        /**
         * The height of each sprite in the sprite sheet, in pixels.
         */
        protected _spriteHeight : number;

        /**
         * The number of sprites across in the sprite sheet.
         */
        protected _spritesAcross : number;

        /**
         * The number of sprites down in the sprite sheet.
         */
        protected _spritesDown : number;

        /**
         * The number of sprites total in this sprite sheet.
         */
        protected _spriteCount : number;

        /**
         * An array that contains the starting positions of all of the sprites in the sheet, so that they
         * don't need to be calculated every time one is displayed.
         */
        protected _spritePos : Array<Point>;

        /**
         * Obtain the width of sprites that are present in this sprite sheet; this is not available until
         * the sprite sheet has finished loading the underlying image.
         *
         * @returns {number}
         */
        get width () : number
        { return this._spriteWidth; }

        /**
         * Obtain the height of sprites that are present in this sprite sheet; this is not available until
         * the sprite sheet has finished loading the underlying image.
         *
         * @returns {number}
         */
        get height () : number
        { return this._spriteHeight; }

        /**
         * Obtain the total number of sprites available in this sprite sheet; this is not available until
         * the sprite sheet has finished loading the underlying image.
         *
         * @returns {number}
         */
        get count () : number
        { return this._spriteCount; }

        /**
         * Construct a new sprite sheet either from a previously loaded image or by preloading an image.
         *
         * In the first case, the image needs to have been loaded enough to have dimension information
         * available at the very least, so that the sprites can be pulled from it. This means that you
         * should really only invoke this from the completion handler of your own preload (or after
         * pulling the image from somewhere else).
         *
         * In the second case, the class will preload the image itself. Here images are expected to be in a
         * folder named "images/" inside of the folder that the game page is served from, so only a filename
         * and extension is required.
         *
         * The constructor is passed two dimensions, an "across" and a "down", plus a boolean flag which
         * is used to determine how the dimension parameters are interpreted.
         *
         * When asSprites is true (the default), the across and down are interpreted as the number of
         * sprites across and down in the sprite sheet. In this case, the actual dimensions of the sprites
         * are determined based on the size of the incoming image and the number of sprites in the sprite
         * sheet is across x down.
         *
         * When asSprites is false, the across and down are interpreted as the pixel width and height of
         * each individual sprite in the sprite sheet. In this case, the actual dimensions of the sprites
         * is given directly and the number of total sprites is determined based on the size of the
         * incoming image.
         *
         * @param stage the stage that will display this sprite sheet
         * @param image the image to use for this sprite sheet, either a filename of an image or a
         * previously fully loaded image
         * @param across number of sprites across (asSprites == true) or pixel width of each sprite
         * @param down number of sprites down (asSprites == true) or pixel height of each sprite
         * @param asSprites true if across/down specifies the size of the sprite sheet in sprites, or
         * false if across/down is specifying the size of the sprites explicitly.
         */
        constructor (stage : Stage, image : string|HTMLImageElement, across : number, down : number = 1,
                     asSprites : boolean = true)
        {
            // Set up either sprite width and height or sprites across and down, depending on our boolean
            // flag.
            this._spriteWidth = (asSprites ? -1 : across);
            this._spriteHeight = (asSprites ? -1 : down);
            this._spritesAcross = (asSprites ? across : -1);
            this._spritesDown = (asSprites ? down : -1);

            // If the value passed in is a string, then we need to preload the image and do the rest of
            // our work in the handler when the preload finishes. This doesn't use instanceof because
            // constant strings aren't instances of class String for some obscure reason; sadly this also
            // requires
            if (typeof (image) == "string")
                this._image = stage.preloadImage (<string>image, this.imageLoadComplete);

            // If we got an actual image, then we can set up right now (theoretically).
            else if (image instanceof HTMLImageElement)
            {
                // Here we were given an image and not a filename; ensure that it was actually already loaded.
                if (image.complete == false || image.naturalWidth == 0)
                    throw new TypeError ("SpriteSheet provided an image that is not already loaded");

                // Save the image and then invoke the handler as if a preload just finished.
                this._image = image;
                this.imageLoadComplete (image);
            }

            else
                throw new TypeError ("Somehow SpriteSheet constructor was passed an invalid value");
        }

        /**
         * This gets invoked when our image is fully loaded, which means its dimensions are known. This
         * kicks off setting up the rest of the information needed for this sprite sheet.
         *
         * @param image the image that was loaded.
         */
        private imageLoadComplete = (image : HTMLImageElement) =>
        {
            // Now calculate either the dimensions of our sprites or the number of sprites across and
            // down, depending on which way we were constructed; only one of those two values is currently
            // available.
            if (this._spriteWidth == -1)
            {
                this._spriteWidth = image.width / this._spritesAcross;
                this._spriteHeight = image.height / this._spritesDown;
            }
            else
            {
                this._spritesAcross = image.width / this._spriteWidth;
                this._spritesDown = image.height / this._spriteHeight;
            }

            // Now calculate the total number of sprites in the sheet.
            this._spriteCount = this._spritesAcross * this._spritesDown;

            // Set up the sprite position array.
            this._spritePos = [];
            for (let spriteIndex = 0 ; spriteIndex < this._spriteCount ; spriteIndex++)
            {
                // Calculate the X and Y location that this sprite is positioned at, and then store it
                // into the position array.
                let x = (spriteIndex % this._spritesAcross) * this._spriteWidth;
                let y = Math.floor (spriteIndex / this._spritesAcross) * this._spriteHeight;
                this._spritePos.push (new Point (x, y));
            }
        };

        /**
         * Render a sprite from this sprite sheet at the provided location. The sprite will be positioned
         * with its upper left corner at the provided location.
         *
         * @param sprite the sprite to render
         * @param x the x location to render the actor at, in stage coordinates (NOT world)
         * @param y the y location to render the actor at, in stage coordinates (NOT world)
         * @param renderer the class to use to render the actor
         */
        blit (sprite : number, x : number, y : number, renderer : Renderer) : void
        {
            let position = this._spritePos[sprite];
            renderer.blitPart (this._image, x, y,
                               position.x, position.y,
                               this._spriteWidth, this._spriteHeight);
        }

        /**
         * Render a sprite from this sprite sheet at the provided location. The sprite will be positioned
         * with its center at the provided location.
         *
         * @param sprite the sprite to render
         * @param x the x location to render the actor at, in stage coordinates (NOT world)
         * @param y the y location to render the actor at, in stage coordinates (NOT world)
         * @param renderer the class to use to render the actor
         */
        blitCentered (sprite : number, x : number, y : number, renderer : Renderer) : void
        {
            let position = this._spritePos[sprite];
            renderer.blitPartCentered (this._image, x, y,
                                       position.x, position.y,
                                       this._spriteWidth, this._spriteHeight);
        }

        /**
         * Render a sprite from this sprite sheet at the provided location. The sprite will be positioned
         * with its center at the provided location and will be rotated at the provided angle.
         *
         * @param sprite the sprite to render
         * @param x the x location to render the actor at, in stage coordinates (NOT world)
         * @param y the y location to render the actor at, in stage coordinates (NOT world)
         * @param angle the angle to rotate the sprite by (in degrees)
         * @param renderer the class to use to render the actor
         */
        blitCenteredRotated (sprite : number, x : number, y : number, angle : number,
                             renderer : Renderer) : void
        {
            let position = this._spritePos[sprite];
            renderer.blitPartCenteredRotated (this._image, x, y, angle,
                                              position.x, position.y,
                                              this._spriteWidth, this._spriteHeight);
        }
    }
}
