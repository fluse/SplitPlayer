var extend = require('extend');

'use strict';

var SplitPlayerAnalytics = function (player, settings) {
    this.player = player;

    // extend settings
    this.settings = extend({}, this.player.settings, {
    }, settings || {});

    return this;
};

SplitPlayerAnalytics.prototype = {

    onPlay() {
        this.track('play');
    },

    onPause() {
        this.track('pause');
    },

    onStop() {
        this.track('stop');
    },

    setTo(timeData) {
        this.track('setTimeTo', timeData.playedTime);
    },

    track(label, value) {
        if (typeof _trackEvent !== 'undefined') {
            _trackEvent('splitplayer', 'click', label, value || null);
        }
    }

};

module.exports = SplitPlayerAnalytics;
