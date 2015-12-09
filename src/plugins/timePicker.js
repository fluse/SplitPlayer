/* globals $ */

'use strict';

var SplitPlayerTimePicker = function (timeline) {

    this.timeline = timeline;

    this.settings = $.extend({
        element: null,
        currentTimeElement: null,
        durationElement: null,
        startTime: 0,
        duration: 10000,
        previewLine: $('.preview-line')
    }, settings);

    this.playedTime = this.settings.startTime;

    this.setEvents();

    $(this.settings.durationElement).html(this.formatTime(this.settings.duration));
    $(this.settings.currentTimeElement).html('0:00');

    return this;
};

SplitPlayerTimePicker.prototype = {

    setEvents() {
        var self = this;

        this.timeLine = $(this.settings.element);


        $('.rangeslider').on('mousedown', function () {
            self.player.timeTo(self.playedTime);
        }).on('mousemove', function (e) {
            var leftPos = e.pageX - $(this).offset().left;
            var percentage = leftPos * 100 / $(this).width();
            var percentageRounded = Math.round(percentage);
            var playerTime = self.formatTime(self.settings.duration / 100 * percentageRounded);

            self.settings.previewLine.width(percentage + '%').find('time').html(playerTime);
        });

        $(document).on('input', 'input[type="range"]', function() {
            var val = $(this).val();
            self.playedTime = val;
            self.settings.onChange(val);
        });
    },
    formatTime(time) {
        var minutes = Math.floor(time / 60);
        var seconds = Math.round(time - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    }

};
