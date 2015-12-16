/* globals $ */

'use strict';

var SplitPlayerTimeDisplay = function (timeManager, settings) {
    this.timeManager = timeManager;
    this.$display = null;
    this.$duration = null;
    this.$current = null;

    // extend settings
    this.settings = $.extend({}, this.timeManager.settings, {
        area: null,
        template: '<i class="time-display"><time class="current"></time><time class="duration"></time></i>'
    }, settings);

    this._render();
    return this;
};

SplitPlayerTimeDisplay.prototype = {

    onReady() {
        this.onSetTo(this.timeManager.getData());
    },

    onSetTo(data) {
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
    }

};
