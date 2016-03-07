/* globals $ */

var extend = require('extend');
var $ = require('jquery');

'use strict';

var SplitPlayerTimePicker = function (timeManager, settings) {
    this.timeManager = timeManager;

    this.$previewLine = null;

    this.previewedTime = 0;

    // extend settings
    this.settings = extend({}, this.timeManager.settings, {
        area: '#timeline',
        template: '<i class="preview-line"><time></time></i>'
    }, settings || {});

    this.mount();

    return this;
};

SplitPlayerTimePicker.prototype = {

    mount() {
        this.$timeline = this.timeManager.$timeline;

        this._render();
        this._setEvents();
    },

    // set mousemove and click event
    _setEvents() {
        this.$timeline
            .on('mousemove', this._showTime.bind(this))
            .on('mouseup', this._setTime.bind(this));
    },

    // show time on mousemove
    _showTime(e) {

        var leftPos = (e.pageX - this.$timeline.offset().left);

        var percentage = ((leftPos * 100) / this.$timeline.width());

        // set to 0 if negative value
        if (percentage < 0) {
            percentage = 0;
        }

        this.previewedTime = ((this.timeManager.player.duration / 100) * percentage);

        this.$previewLine.width(percentage + '%').find('time').html(
            this.timeManager._formatTime(this.previewedTime)
        );
    },

    // set time on click
    _setTime() {
        this.timeManager.setTo(this.previewedTime);
        this.timeManager.player.timeTo(this.previewedTime);
    },

    _render() {
        this.$timeline.append(this.settings.template);
        this.$previewLine = this.$timeline.find('.preview-line');
    }

};

module.exports = SplitPlayerTimePicker;
