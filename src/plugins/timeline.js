/* globals $ */

'use strict';

var SplitPlayerTimeline = function (player, settings) {
    return this;
}

SplitPlayerTimeline.prototype = {

    onPlay() {
        return console.log('plugin on play');
    },

    onPause() {
        return console.log('plugin on pause');
    },

    onStop() {
        return console.log('plugin on stop');
    }
};
