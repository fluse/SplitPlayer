/* globals $, extend */

'use strict';

var SplitPlayerTimeSync = function (timeManager, settings) {
    this.timeManager = timeManager;

    this.timeline = this.timeManager.timeline;

    this.previewedTime = 0;

    // extend settings
    this.settings = extend({}, this.timeManager.settings, {
        area: '#timeline',
        template: '<i class="preview-line"><time></time></i>'
    }, settings || {});

    this._render();
    this._setEvents();

    return this;
};

SplitPlayerTimeSync.prototype = {

    seconds: {},
    stepValue: 0.1,
    interval: null,

    setEvents() {
        var self = this;
        $('.time-set-button-up')
            .off('mousedown').on('mousedown', function (e) {
                e.preventDefault();

                self.start('increase', $(this).attr('videoId'));
            })
            .off('mouseup').on('mouseup', function (e) {
                e.preventDefault();

                self.stop();
            })
            .off('mouseleave').on('mouseleave', this.stop.bind(this));

        $('.time-set-button-down')
            .off('mousedown').on('mousedown', function (e) {
                e.preventDefault();

                self.start('decrease', $(this).attr('videoId'));
            })
            .off('mouseup').on('mouseup', function (e) {
                e.preventDefault();

                self.stop();
            })
            .off('mouseleave').on('mouseleave', this.stop.bind(this));

        $('.time-set-input').change(function () {
            var videoId = $(this).attr('videoId');

            self.seconds[videoId] = parseFloat($(this).val());

            // set seconds
            var video = sp.player.getVideoByVideoId(videoId);
            video.player.seekTo(self.seconds[videoId]);
            self.setStartSeconds(videoId, self.seconds[videoId]);
        });
    },

    // start auto increasing
    start(action, videoId) {
        var self = this;
        self[action](videoId);

        // action = increase or decrease
        this.interval = window.setInterval(function () {
            self[action](videoId);
        }, 100);
    },

    // stop auto increasing
    stop() {
        window.clearInterval(this.interval);
    },

    increase(videoId) {

        if (typeof this.seconds[videoId] === 'undefined') {
            this.seconds[videoId] = this.stepValue;
        } else {
            this.seconds[videoId] = parseFloat(this.seconds[videoId]) + parseFloat(this.stepValue);
        }

        // round to decimal
        this.seconds[videoId] = this.roundDecimal(this.seconds[videoId]);

        this.setStartSeconds(videoId, this.seconds[videoId]);
    },

    decrease(videoId) {

        // prevent if is 0
        if (this.seconds[videoId] === 0) {
            return false;
        }

        // set default value if no is defined
        if (typeof this.seconds[videoId] === 'undefined') {
            this.seconds[videoId] = 0;

        // increase
        } else {
            if (this.seconds[videoId] > 0) {
                this.seconds[videoId] = parseFloat(this.seconds[videoId]) - parseFloat(this.stepValue);
            }
        }

        // round to decimal
        this.seconds[videoId] = this.roundDecimal(this.seconds[videoId]);

        this.setStartSeconds(videoId, this.seconds[videoId]);
    },

    roundDecimal(val) {
        return parseFloat(Math.round(val * 100) / 100);
    },

    setStartSeconds(videoId, startSeconds) {

        var video = sp.player.getVideoByVideoId(videoId);
        video.startSeconds = startSeconds;

        // write to input
        $('#' + videoId + 'Number').val(startSeconds);

        this.sync();
    },

    sync() {
        // sort videos by startSeconds ASC
        var sortedArray = _.sortBy(sp.player.selectedVideos, 'startSeconds');

        var time = parseFloat(
            parseFloat(
                parseFloat(sortedArray[0].player.getCurrentTime()) - parseFloat(sortedArray[0].startSeconds)
            )
        );

        sp.player.setTime(time);

        console.log('video time: %s', time);
    }
};
