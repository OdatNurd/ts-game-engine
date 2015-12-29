module nurdz.game
{
    /**
     * This class wraps an HTML audio tag to provide an extended API for sound and music playing. This
     * shields the client code from having to work with the tag directly and provides an enhanced API.
     */
    export class Sound
    {
        /**
         * The HTML Audio tag that we use to play our sound.
         */
        protected _tag : HTMLAudioElement;

        /**
         * Construct a new sound object, telling it to wrap the provided audio tag, which it will use for
         * its playback.
         *
         * @param audioTag the audio tag that represents the sound to be played.
         * @param playbackLooped true if this sound should loop when played (e.g. music), false otherwise
         */
        constructor (audioTag : HTMLAudioElement, playbackLooped : boolean = false)
        {
            // Save the tag and set the loop flag.
            this._tag = audioTag;
            this._tag.loop = playbackLooped;
        }

        /**
         * Determines if this sound is currently playing or not.
         *
         * @returns {boolean}
         */
        get isPlaying () : boolean
        { return this._tag.paused == false; }

        /**
         * Get the current volume that this sound is playing at. This ranges between 0 and 1.
         *
         * @returns {number}
         */
        get volume () : number
        { return this._tag.volume; }

        /**
         * Set the volume that this sound plays back on, which should be a value between 0 and 1.
         *
         * @param newVolume
         */
        set volume (newVolume : number)
        {
            this._tag.volume = newVolume;
        }

        /**
         * Determines if this sound loops during playback or not.
         *
         * @returns {boolean}
         */
        get loop () : boolean
        { return this._tag.loop; }

        /**
         * Change the state of looping for this sound. When true, playback will loop continuously until
         * told to stop.
         *
         * @param newLoop
         */
        set loop (newLoop : boolean)
        { this._tag.loop = newLoop; }

        /**
         * Start the sound playing, optionally also restarting the playback from the beginning if it is
         * already playing.
         *
         * The restart parameter can be used to restart playback from the beginning; this is useful if the
         * sound is already playing and you want it to immediately restart or if the sound is paused and
         * you want playback to start from the beginning and not the pause point.
         *
         *
         * When the sound is already playing and the parameter passed in is false, this call effectively
         * does nothing.
         *
         * @param restart true to start the sound playing from the beginning or false to leave the current
         * play position alone
         */
        play (restart : boolean = true) : void
        {
            // Change the current playback time if we were asked to.
            if (restart)
                this._tag.currentTime = 0;

            // Play it now
            this._tag.play ();
        }

        /**
         * Pause playback of the sound.
         */
        pause () : void
        {
            this._tag.pause ();
        }

        /**
         * Toggle the play state of the sound; if it is currently playing, it will be paused, otherwise it
         * will start playing. The restart parameter can be used to cause paused playback to restart at
         * the beginning of the sound and has no effect if the sound is already playing.
         *
         * This method is generally used for longer sounds that you might want to cut off (e.g. music).
         *
         * @see Sound.play
         */
        toggle (restart : boolean = true) : void
        {
            if (this.isPlaying)
                this.pause ();
            else
                this.play (restart);
        }
    }
}
