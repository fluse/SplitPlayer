/* globals $ */

'use strict';

var SplitPlayerTimeline = function (player) {
    this.player = player;

    this.element = null;
    this.bar = null;
    this.cycler = null;
    this.modules = [];

    this.template = '<div id="timeline"><i class="bar"></i></div>';

    return this;
};

SplitPlayerTimeline.prototype = {

    /*
     * extend Module
     */
    extend (Module) {
        var instance = new Module(this);
        this.modules.push(instance);
        return instance;
    },

    /*
     * player onReady hook
     */
    onReady() {
        this.render();
    },

    /*
     * player onStop hook
     */
    onStop() {
        this.reset();
    },

    /*
     * player onUpdate hook
     */
    onUpdate() {
        var percentage = ((this.player.getPlayedTime() * 100) / this.player.duration);
        this.bar.css({
            width: percentage + '%'
        });
    },

    reset() {
        this.bar.css({
            width: 0
        });
    },

    formatTime(time) {
        var minutes = Math.floor(time / 60);
        var seconds = Math.round(time - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    },

    render() {
        var tmp = $(this.player.settings.area).append(this.template);
        this.element = tmp.find('#timeline');
        this.bar = this.element.find('i');
    }
};
