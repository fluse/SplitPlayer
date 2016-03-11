'use strict';

var extend = require('extend');

module.exports = class SplitPlayerAnalytics {

    constructor  (player, settings) {
        this.player = player;

        this.$volume = null;
        // extend settings
        this.settings = extend({}, this.player.settings, {
        }, settings || {});
    }

    onPlay() {
        this.track('play');
    }

    onPause() {
        this.track('pause');
    }

    onStop() {
        this.track('stop');
    }

    onTimeTo(timeData) {
        this.track('timeTo', timeData.playedTime);
    }

    onMute() {
        this.track('mute');
    }

    onVolumeChange(percentage) {
        this.track('volumeTo', percentage);
    }

    track(label, value) {
        if (typeof _trackEvent !== 'undefined') {
            _trackEvent('splitplayer', 'click', label, value || null);
        }
    }

};
