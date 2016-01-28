module nurdz.game
{
    /**
     * This interface represents the information that is used to track each individual animation.
     */
    interface AnimationInformation
    {
        /**
         * The textual name given to this animation at the time that it was created.
         */
        name : string;

        /**
         * The loop state of this animation; true if this animation is set to loop or false if it should
         * play once and then stop
         */
        loop : boolean;

        /**
         * The ping pong state of this animation; true if this animation is set to ping pong or false if
         * it should play from front to back.
         */
        pingPong : boolean;

        /**
         * The list of frames in this animation
         */
        frames : Array<number>;

        /**
         * The position in the frame list for the current frame
         */
        position : number;

        /** The direction of the animation; this is 1 if the animation is playing forwards and -1 if the
         * animation is set to ping pong and is currently playing backwards. The value is 0 if the
         * animation is not playing any longer (it is set to not loop and it has finished playing).
         */
        direction : number;

        /**
         * The number of times the update method needs to be invoked before the animation steps to the
         * next frame. This can be a fractional number.
         */
        ticksPerFrame : number;

        /**
         * The number of ticks that have elapsed since the animation started the current frame. This
         * increases by 1 every time the update() method is called, and when it is large enough, the frame
         * switches to the next in the animation.
         */
        elapsedTicks : number;
    }

    /**
     * This interface is used to associate a list of animations with their textual names.
     */
    interface AnimationHash
    {
        [index : string] : AnimationInformation;
    }

    /**
     * This class represents a list of animations, which are represented by a list of frames by numeric
     * ID. Generally this would be associated with a sprite sheet of some king.
     */
    export class AnimationList
    {
        /**
         * The list of all animations known in this animation list.
         */
        private _animations : AnimationHash;

        /**
         * The animation that is currently playing (if any).
         */
        private _current : AnimationInformation;

        /**
         * Get the name of the animation that is currently playing on this animation list (or selected to
         * play). The value is null if no animation is selected.
         *
         * @returns {string}
         */
        get current () : string
        {
            if (this._current != null)
                return this._current.name;
            else
                return null;
        }

        /**
         * Determine if the current animation is playing or not. The return value is always false if there
         * is no current animation.
         *
         * @returns {boolean}
         */
        get isPlaying () : boolean
        {
            // Is there a current animation?
            return this._current != null && this._current.direction != 0;
        }

        /**
         * Construct a new animation list
         */
        constructor ()
        {
            // Initialize our animation list and indicate that there is no current animation.
            this._animations = {};
            this._current = null;
        }

        /**
         * Given a frame rate and a frame list, create and return a newly initialized animation
         * information structure.
         *
         * @param name the name of the animation to create
         * @param fps the frames per second that this animation should run at
         * @param loop true to loop the animation when it is played back or false to play it once and then
         * stop
         * @param frameList the list of frames that make up this animation.
         */
        private createAnimation (name : string, fps : number, loop : boolean,
                                 frameList : Array<number>) : AnimationInformation
        {
            return {
                // Save the name given
                name: name,

                // Animations always loop by default.
                loop: loop,

                // Animations do not ping pong by default
                pingPong: false,

                // TODO This should query the stage and not assume a frame rate of 30
                // Currently this is not possible because the frame rate isn't known until run is called.

                // Calculate the number of ticks that need to elapse between frames. This can be a
                // floating point value.
                ticksPerFrame: 30 / fps,

                // Save the list of frames
                frames: frameList,

                // We are currently at the first frame of the animation, with no elapsed time, going
                // forward in the animation.
                position:     0,
                elapsedTicks: 0,
                direction:    1
            };
        }

        /**
         * Add a new animation with a textual name, which will run at the frames per second provided. The
         * animation can be set to loop or not as desired.
         *
         * The animation is made up of a list of frames to play in order from some sprite sheet.
         *
         * The first animation that is added is the one that the class plays by default. This can be
         * overridden by explicitely requesting playback of a null animation.
         *
         * @param name textual name for this animation, which should be unique amongst all registered
         * animations
         * @param fps the frames per second to run the animation at
         * @param loop true to loop the animation when it is played back or false for one shot playback
         * @param frameList the list of frames that make up the animation
         * @see AnimationList.setLoop
         * @see AnimationList.setPingPong
         * @see AnimationList.play
         */
        add (name : string, fps : number, loop : boolean, frameList : Array<number>) : void
        {
            // If there is already an animation with this name in our list, generate a warning to the
            // console and leave.
            if (this._animations[name] != null)
            {
                console.log (`Duplicate animation '${name}': ignoring definition`);
                return;
            }

            // Create the animation and put it in the list.
            this._animations[name] = this.createAnimation (name, fps, loop, frameList);

            // If there is no current animation, then play this one
            if (this._current == null)
                this.play (name);
        }

        /**
         * Fetch an animation by name from our internal animation list, specifying what is to be done with
         * it. If there is no such animation, null is returned and an error message is generated to the
         * console.
         *
         * @param name the name of the animation to fetch
         * @param purpose what is to be done with the animation; used in the log message
         * @returns {AnimationInformation} the animation information for the named animation, or null if
         * not found
         */
        private fetchAnimation (name : string, purpose : string) : AnimationInformation
        {
            let animation = this._animations[name];
            if (animation == null)
                console.log (`No such animation '${name}': cannot ${purpose}; ignoring`);

            return animation;
        }

        /**
         * Start playing the provided animation; this will take effect on the next call to the update method.
         *
         * @param name the name of the animation to play or null to stop all animations
         * @see Animation.update
         */
        play (name : string) : void
        {
            // If the name provided is null, then set our current animation to null and return immediately;
            // this is the user deciding to play no animation at all.
            if (name == null)
            {
                this._current = null;
                return;
            }

            // Set the current animation to the one named; leave if not found.
            this._current = this.fetchAnimation (name, "play");
            if (this._current == null)
                return;

            // Reset the elapsed ticks and position of the animation to 0.
            this._current.elapsedTicks = 0;
            this._current.position = 0;

            // Set the direction of the animation; it always plays in a forward direction unless there is
            // only a single frame; in that case the direction is set to 0 because there's no need to move
            // to a different frame.
            this._current.direction = (this._current.frames.length > 1 ? 1 : 0);
        }

        /**
         * Turn looping for this animation on or off; animations are created looping by default. When an
         * animation is looped, the last frame is followed by the first frame; when not looping the
         * animation freezes at the last frame.
         *
         * @param name the name of the animation to modify
         * @param shouldLoop true to set this animation to loop, false to turn off looping
         */
        setLoop (name : string, shouldLoop : boolean) : void
        {
            // Get the animation to change; leave if not found.
            let animation = this.fetchAnimation (name, "change loop state");
            if (animation == null)
                return;

            // Change the state
            animation.loop = shouldLoop;
        }

        /**
         * Allows you to check if an animation is set to loop or not. Animations are created to loop by
         * default.
         *
         * @param name the name of the animation to query
         * @returns {boolean} true if this animation is set to loop, or false otherwise
         */
        loops (name : string) : boolean
        {
            // Get the animation to query; leave if not found.
            let animation = this.fetchAnimation (name, "query loop state");
            if (animation == null)
                return true;

            // Query
            return animation.loop;
        }

        /**
         * Turn ping ponging for this animation on or off; animations are created to not ping pong by
         * default. When an animation is ping ponged, once the animation gets to the end of the frame
         * list, it goes back towards the front of the list again.
         *
         * @param name the name of the animation to modify
         * @param shouldPingPong true to turn on pingPong for this animation, false to turn it off
         */
        setPingPong (name : string, shouldPingPong : boolean) : void
        {
            // Get the animation to change; leave if not found.
            let animation = this.fetchAnimation (name, "change ping-pong state");
            if (animation == null)
                return;

            // Change the state
            animation.pingPong = shouldPingPong;

        }

        /**
         * Allows you to check if an animation is set to ping pong or not. Animations are created to not
         * ping pong by default.
         *
         * @param name the name of the animation to query
         * @returns {boolean} true if this animation is set to ping pong, or false otherwise
         */
        pingPongs (name : string) : boolean
        {
            // Get the animation to query; leave if not found.
            let animation = this.fetchAnimation (name, "query ping-pong state");
            if (animation == null)
                return false;

            // Query
            return animation.pingPong;
        }

        /**
         * This method drives the animation; This should be invoked once per game tick that this animation
         * is supposed to be played. The return value is the frame of the animation that should be played
         * next.
         *
         * This controls animation looping and ping ponging by updating internal state as needed; when an
         * animation stops looping, this keeps returning the last frame that was played.
         *
         * The return value is always 0 if there is no current animation playing.
         *
         * @returns {number} the next frame to play in the current animation
         */
        update () : number
        {
            // If there is no current animation, always return the 0 frame.
            if (this._current == null)
                return 0;

            // If the direction is not 0 the animation is still playing, in which case we need to handle
            // this update. Note that the play code ensures that the direction is 0 if the frame count is
            // 1, so a lot of the code in this big block of comments assumes there are at least 2 frames
            // to play.
            if (this._current.direction != 0)
            {
                // Count this as an elapsed tick for this animation.
                this._current.elapsedTicks++;

                // Have enough ticks elapsed to cause us to change the frame?
                if (this._current.elapsedTicks >= this._current.ticksPerFrame)
                {
                    // Subtract the ticks per frame from the elapsed ticks and then update the frame
                    // position based on the current direction of the animation.
                    this._current.elapsedTicks -= this._current.ticksPerFrame;
                    this._current.position += this._current.direction;

                    // If the current position is off the end of the frame list, then it is time to either
                    // change directions or stop it entirely.
                    if (this._current.position >= this._current.frames.length)
                    {
                        // If the animation is supposed to ping pong, then this is where we reverse the
                        // direction of playing; this requires us to set the position manually backwards
                        // from the end as well.
                        if (this._current.pingPong)
                        {
                            // Reverse the direction, and then set the position to be two smaller than the
                            // length of the list of frames; this skips us past the frame we were just at
                            // so that we don't play it a second time.
                            this._current.direction = -1;
                            this._current.position = this._current.frames.length - 2;
                        }

                        // Not ping ponging, but if the animation is supposed to loop, then this is where
                        // we reset the position back to the start of the animation.
                        else if (this._current.loop)
                        {
                            this._current.position = 0;
                        }

                        // Not ping ponging OR looping; in that case we need to set the frame back to the
                        // last one in the frame list and set the direction to 0 so that we no longer advance.
                        else
                        {
                            this._current.position = this._current.frames.length - 1;
                            this._current.direction = 0;
                        }
                    }

                    // If the current position is off the start of the array, the animation has ping
                    // ponged back to the start and it's time to either change direction or stop it entirely.
                    if (this._current.position < 0)
                    {
                        // If the animation is set to loop, then we need to set the direction back to 1
                        // and manually position the playback to be the second frame of the animation so
                        // that we don't repeat the frame that we just played.
                        if (this._current.loop)
                        {
                            this._current.direction = 1;
                            this._current.position = 1;
                        }

                        // If we're not looping, we've reached the end of a ping pong, so just freeze on
                        // the first frame.
                        else
                        {
                            this._current.direction = 0;
                            this._current.position = 0;
                        }
                    }
                }
            }

            // Return the current frame information
            return this._current.frames[this._current.position];
        }
    }
}
