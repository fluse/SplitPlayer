/* globals $ */

'use strict';

var SplitPlayerTimeline = function (player) {
    this.player = player;
    this.cycler = null;
    return this;
};

SplitPlayerTimeline.prototype = {

    onReady() {
        this.render();
    },

    onPlay() {
        this.cycler = window.setInterval(this.getTime.bind(this), 50);

        return console.log('plugin on play');
    },

    onPause() {
        clearInterval(this.cycler);
        return console.log('plugin on pause');
    },

    onStop() {
        return console.log('plugin on stop');
    },

    getTime() {
        console.log((this.player.getPlayedTime() * 100) / this.player.duration);
    },

    render() {
        $(this.player.settings.area).append('<div id="timeline"><i></i></div>');
    }
};
