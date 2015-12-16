/* globals $ */

'use strict';

var SplitPlayerTimePicker = function (timeline) {
    this.timeline = timeline;

    this.template = '<i class="preview-line"><time></time></i>';
    this.previewedTime = 0;

    this._render();
    this._setEvents();
    return this;
};

SplitPlayerTimePicker.prototype = {

    onReady() {


    },

    _setEvents() {
        this.timeline.element
            .on('mousemove', this._showTime.bind(this))
            .on('mouseup', this._setTime.bind(this));
    },

    _showTime(e) {
        let leftPos = (e.pageX - this.timeline.element.offset().left);
        let percentage = ((leftPos * 100) / this.timeline.element.width());
        this.previewedTime = ((this.timeline.player.duration / 100) * percentage);

        this.previewLine.width(percentage + '%').find('time').html(this._formatTime(this.previewedTime));
    },

    _setTime() {
        this.timeline.player.stop();
        this.timeline.player.timeTo(this.previewedTime);
        this.timeline.setTo(this.previewedTime);
        this.timeline.player.play();
    },

    _formatTime(time) {
        var minutes = Math.floor(time / 60);
        var seconds = Math.round(time - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    },

    _render() {
        this.timeline.element.append(this.template);
        this.previewLine = this.timeline.element.find('.preview-line');
    }

};
