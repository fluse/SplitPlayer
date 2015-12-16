/*
this.playedTime = this.settings.startTime;

$(this.settings.durationElement).html(this.formatTime(this.settings.duration));
$(this.settings.currentTimeElement).html('0:00');
*/
/* globals $ */

'use strict';

var SplitPlayerTimeHud = function (timeline) {
    this.timeline = timeline;

    this.template = '<i class="preview-line"><time></time></i>';

    this._render();
    return this;
};

SplitPlayerTimeHud.prototype = {

    onReady() {

    },

    onUpdate() {
        
    },


    _render() {
        this.timeline.element.append(this.template);
        this.previewLine = this.timeline.element.find('.preview-line');
    }

};
