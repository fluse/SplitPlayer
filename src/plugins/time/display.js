/* globals $ */

'use strict';

var SplitPlayerTimeDisplay = function (timeline) {
    this.timeline = timeline;

    this.template = '<i class="preview-line"><time></time></i>';

    //this._render();
    return this;
};

SplitPlayerTimeDisplay.prototype = {

    onReady() {

    },

    onUpdate() {
        /*
        this.playedTime = this.settings.startTime;

        $(this.settings.durationElement).html(this.formatTime(this.settings.duration));
        $(this.settings.currentTimeElement).html('0:00');
        */
    },


    _render() {
        this.timeline.element.append(this.template);
        this.previewLine = this.timeline.element.find('.preview-line');
    }

};
