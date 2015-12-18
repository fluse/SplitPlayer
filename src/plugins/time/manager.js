/* globals $, extend */

'use strict';

var SplitPlayerTimeManager = function (player, settings) {
    this.player = player;

    this.isActive = false;
    this.playedTime = 0;

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
    extend(Module, settings) {
        Module = new Module(this, settings || {});

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
        this.playedTime = 0;
    },

    /*
     * Set Time to
     */
    setTo(playedTime) {
        this.playedTime = playedTime;
        console.log(playedTime);
        // plugin
        for (let Plugin of this.plugins) {
            if (Plugin.onSetTo) {
                Plugin.onSetTo(this.getData());
            }
        }
    },

    /*
     * get all time data from player
     */
    getData() {
        // get percentage
        const percentage = ((this.playedTime * 100) / this.player.duration);
        // player duration
        const duration = this.player.duration;

        // formatted playedTime
        const playedTimeFormatted = this._formatTime(this.playedTime);
        // formatted duration
        const durationFormatted = this._formatTime(duration);

        return {
            percentage: percentage,
            playedTime: this.playedTime,
            playedTimeFormatted: playedTimeFormatted,
            duration: duration,
            durationFormatted: durationFormatted
        };
    },

    _formatTime(timeInplayedTime) {
        // convert to minutes
        let minutes = Math.floor(timeInplayedTime / 60);
        // get playedTime;
        let playedTime = Math.round(timeInplayedTime - minutes * 60);

        if (playedTime < 10) {
            playedTime = '0' + playedTime;
        }

        return minutes + ':' + playedTime;
    },

    destroy() {
        this.onStop();
    }
};