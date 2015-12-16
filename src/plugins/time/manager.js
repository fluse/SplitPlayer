/* globals $ */

'use strict';

var SplitPlayerTimeManager = function (player, settings) {
    this.player = player;

    this.isActive = false;
    this.seconds = 0;

    this.plugins = [];

    // extend player settings
    this.settings = $.extend({}, this.player.settings, {
    }, settings || {});

    return this;
};

SplitPlayerTimeManager.prototype = {

    /*
     * extend Module
     */
    extend(Module) {
        Module = new Module(this);

        // push internal
        this.plugins.push(Module);

        // push to player plugins for other hooks
        return this.player.plugins.push(Module);
    },

    /*
     * player onReady hook
     */
    onReady() {
        this.isActive = true;
    },

    /*
     * player onUpdate hook
     */
    onUpdate() {
        this.setTo(this.player.getPlayedTime());
    },

    /*
     * player onStop hook
     */
    onStop() {
        this.seconds = 0;
    },

    /*
     * Set Time to
     */
    setTo(seconds) {
        this.seconds = seconds;

        // plugin
        for (let Plugin of this.plugins) {
            if (Plugin.onSetTo) {
                Plugin.onSetTo(this.getData());
            }
        }
    },

    getData() {
        // get percentage
        const percentage = ((this.seconds * 100) / this.player.duration);

        // formatted seconds
        const formattedTime = this._formatTime(this.seconds);

        return {
            seconds: this.seconds,
            formattedTime: formattedTime,
            percentage: percentage
        };
    },

    _formatTime(timeInSeconds) {
        // convert to minutes
        let minutes = Math.floor(timeInSeconds / 60);
        // get seconds;
        let seconds = Math.round(timeInSeconds - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    }
};
