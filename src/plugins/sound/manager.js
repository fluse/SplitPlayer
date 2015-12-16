/* globals $ */

'use strict';

var SplitPlayerSoundManager = function (player, settings) {
    this.player = player;

    this.$volume = null;

    // extend settings
    this.settings = $.extend({}, this.player.settings, {
        area: null,
        template: '<i class="preview-line"><time></time></i>'
    }, settings || {});
    return;
    this._render();
    this._setEvents();

    return this;
};

SplitPlayerSoundManager.prototype = {

    // set mousemove and click event
    _setEvents() {
        this.$volume
            .on('change', this._setSound.bind(this));
    },

    // show time on mousemove
    _showTime(e) {

        let leftPos = (e.pageX - this.timeline.offset().left);

        let percentage = ((leftPos * 100) / this.timeline.width());

        // set to 0 if negative value
        if (percentage < 0) {
            percentage = 0;
        }

        this.previewedTime = ((this.timeManager.player.duration / 100) * percentage);

        this.previewLine.width(percentage + '%').find('time').html(
            this.timeManager._formatTime(this.previewedTime)
        );
    },

    // set time on click
    _setTime() {
        this.timeManager.player.stop();
        this.timeManager.player.timeTo(this.previewedTime);

        // wait for next tick
        setTimeout(this.timeManager.player.play.bind(this.timeManager.player), 100);
    },

    _render() {
        if (this.settings.area === null) {
            return console.error('no dropArea for timeDisplay defined');
        }

        this.settings.area.append(this.settings.template);
        this.previewLine = this.timeline.find('.preview-line');
    }

};
