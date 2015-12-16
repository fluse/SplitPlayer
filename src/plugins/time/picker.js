/* globals $ */

'use strict';

var SplitPlayerTimePicker = function (timeManager, settings) {
    this.timeManager = timeManager;

    this.timeline = this.timeManager.timeline;

    this.previewedTime = 0;

    // extend settings
    this.settings = $.extend({}, this.timeManager.settings, {
        area: '#timeline',
        template: '<i class="preview-line"><time></time></i>'
    }, settings || {});

    this._render();
    this._setEvents();
    
    return this;
};

SplitPlayerTimePicker.prototype = {

    // set mousemove and click event
    _setEvents() {
        this.timeline
            .on('mousemove', this._showTime.bind(this))
            .on('mouseup', this._setTime.bind(this));
    },

    // show time on mousemove
    _showTime(e) {

        let leftPos = (e.pageX - this.timeline.offset().left);

        let percentage = ((leftPos * 100) / this.timeline.width());

        this.previewedTime = ((this.timeManager.player.duration / 100) * percentage);

        this.previewLine.width(percentage + '%').find('time').html(
            this.timeManager._formatTime(this.previewedTime)
        );
    },

    // set time on click
    _setTime() {
        this.timeManager.player.stop();
        this.timeManager.player.timeTo(this.previewedTime);
        setTimeout(this.timeManager.player.play.bind(this.timeManager.player), 100);
    },

    _render() {
        this.timeline.append(this.settings.template);
        this.previewLine = this.timeline.find('.preview-line');
    }

};
