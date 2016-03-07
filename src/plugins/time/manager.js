var extend = require('extend');

'use strict';

var SplitPlayerTimeManager = function (player, settings) {
    this.player = player;

    this.isActive = false;
    this.playedTime = 0;

    this.plugins = [];

    // extend player settings
    this.settings = extend({}, this.player.settings, {
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
        this.setTimeTo(0);
    },

    /*
     * player onUpdate hook
     */
    onUpdate() {
        this.setTimeTo(this.player.getPlayedTime());
    },

    /*
     * player onStop hook
     */
    onStop() {
        this.setTimeTo(0);
    },

    /*
     * Set Time to
     */
    setTimeTo(playedTime) {
        this.playedTime = playedTime;
        // plugin
        for (var Plugin of this.plugins) {
            if (Plugin.onsetTimeTo) {
                Plugin.onsetTimeTo(this.getData());
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
        var minutes = Math.floor(timeInplayedTime / 60);
        // convert seconds
        var seconds = Math.round(timeInplayedTime - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        if (seconds === 60) {
            seconds = '00';
            minutes++;
        }

        return minutes + ':' + seconds;
    },

    destroy() {
        this.onStop();
    }
};

module.exports = SplitPlayerTimeManager;
