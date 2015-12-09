/* globals $ */

'use strict';

var SplitPlayerTimePicker = function (player, settings) {
    this.player = player;
    this.playedTime = 0;
    this.cycler = 0;
    this.paused = true;
    this.timeLine = null;
    return this;
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

    onReady() {

    },

    onPlay() {
        return console.log('plugin on play');
        this.paused = false;
        this.run();
    },

    onPause() {
        return console.log('plugin on pause');
        this.paused = true;
        clearTimeout(this.cycler);
    },

    onStop() {
        return console.log('plugin on stop');
        this.playedTime = 0;
        this.update();
    },

    setEvents() {
        var self = this;

        this.timeLine = $(this.settings.element);
        this.timeLine.attr('max', this.settings.duration).rangeslider({
            polyfill: false
        });

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

    run() {
        // pause
        if (this.playedTime >= this.settings.duration || this.paused) {
            return this.pause();
        }

        this.playedTime++;
        this.update();

        clearTimeout(this.cycler);
        this.cycler = setTimeout(this.run.bind(this), 1000);
    },

    update() {
        this.timeLine.val(this.playedTime).change();

        $(this.settings.currentTimeElement).html(this.formatTime(this.playedTime));
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
