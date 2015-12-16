/* globals $ */

'use strict';

var SplitPlayerTimeline = function (player) {
    this.player = player;
    this.element = null;
    this.bar = null;
    this.isActive = false;

    this.template = '<div id="timeline"><i class="bar"></i></div>';

    this._render();

    return this;
};

SplitPlayerTimeline.prototype = {

    /*
     * extend Module
     */
    extend(Module) {
        return this.player.plugins.push(new Module(this));
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
        this._reset();
    },

    /*
     * Set Time to
     */
    setTo(seconds) {
        let percentage = ((seconds * 100) / this.player.duration);

        this.bar.css({
            width: percentage + '%'
        });
    },

    _reset() {
        this.bar.css({
            width: 0
        });
    },

    _formatTime(time) {
        let minutes = Math.floor(time / 60);
        let seconds = Math.round(time - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    },

    _render() {
        let tmp = $(this.player.settings.area).append(this.template);

        this.element = $(tmp).find('#timeline');
        this.bar = this.element.find('i');
    }
};
