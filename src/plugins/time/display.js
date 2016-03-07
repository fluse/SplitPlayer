/* globals $ */

var extend = require('extend');
var $ = require('domtastic');

'use strict';

var SplitPlayerTimeDisplay = function (timeManager, settings) {
    this.timeManager = timeManager;
    this.$display = null;
    this.$duration = null;
    this.$current = null;

    // extend settings
    this.settings = extend({}, this.timeManager.settings, {
        area: null,
        template: '<i class="time-display"><time class="current">&nbsp;</time><time class="duration">&nbsp;</time></i>'
    }, settings);

    this.mount();
    return this;
};

SplitPlayerTimeDisplay.prototype = {

    mount() {
        this._render();
    },

    onReady() {
        this.onsetTimeTo(this.timeManager.getData());
    },

    onsetTimeTo(data) {
        this.$duration.html(data.durationFormatted);
        this.$current.html(data.playedTimeFormatted);
    },

    _render() {
        if (this.settings.area === null) {
            return console.error('no dropArea for timeDisplay defined');
        }

        this.$display = $(this.settings.area);
        this.$display.append(this.settings.template);

        this.$duration = this.$display.find('.duration');
        this.$current = this.$display.find('.current');
    },

    destroy() {
        this.$display.remove();
    }

};

module.exports = SplitPlayerTimeDisplay;
