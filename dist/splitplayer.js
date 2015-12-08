/* globals _, $, SplitPlayerVideo */

'use strict';

// player state constants
var inactive = 0;
var loading = 1;
var ready = 2;
var buffering = 3;
var playing = 4;
var _pause = 5;

var SplitPlayer = function SplitPlayer(settings) {
    debugger;

    // video instances container
    this.videos = [];

    // plugin instances container
    this.plugins = [];

    // ready video count
    this.readyCount = 0;

    // global player state
    this.playerStateIs = inactive;

    // dependencie loading status
    this.dependenciesLoaded = inactive;

    this.settings = $.extend({
        hoster: 'youtube',
        videos: [],
        area: null,
        maxVideos: 2
    }, settings);

    this.loadVideoDependencies();

    return this;
};

SplitPlayer.prototype = {

    /*
     * Load Video Dependecnies like youtubeIframeApi
     */
    loadVideoDependencies: function loadVideoDependencies() {

        this.dependenciesLoaded = loading;

        SplitPlayerVideo[this.settings.hoster].load(this.onVideoDependeciesReady.bind(this));
    },

    /*
     * Load add Videos after Dependecnies Loaded
     */
    onVideoDependeciesReady: function onVideoDependeciesReady() {

        this.dependenciesLoaded = ready;

        this.render();

        /* add initial declared videos */
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.settings.videos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var video = _step.value;

                this.addVideo(video);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        this.playerStateIs = loading;
    },

    extend: function extend(Plugin) {
        this.plugins.push(new Plugin(this));
    },

    addVideo: function addVideo(video) {

        if (this.videos.length >= this.settings.maxVideos) {
            return false;
        }

        this.videos.push(new SplitPlayerVideo(this, {
            video: video
        }));
    },

    removeVideo: function removeVideo(video) {

        _.findWhere(this.videos, video).remove();

        this.videos = _.without(this.videos, _.findWhere(this.videos, video));

        this.readyCount--;
    },

    onReady: function onReady() {

        this.readyCount++;

        if (this.readyCount !== this.videos.length) {
            return false;
        }

        this.playerStateIs = ready;

        // hook onReady for plugins
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = this.plugins[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var Plugin = _step2.value;

                Plugin.onReady();
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                    _iterator2['return']();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    },

    play: function play() {

        if (this.readyCount !== this.videos.length) {
            return false;
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = this.videos[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var video = _step3.value;

                video.play();
            }

            // hook onPlay for plugins
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                    _iterator3['return']();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = this.plugins[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var plugin = _step4.value;

                plugin.onPlay();
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                    _iterator4['return']();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }
    },

    pause: function pause() {

        // abort if not all videos ready
        if (this.readyCount !== this.videos.length) {
            return false;
        }

        // abort if player not playing state
        if (this.playerStateIs !== playing) {
            return;
        }

        // pause all videos
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = this.videos[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var video = _step5.value;

                video.pause();
            }

            // hook all plugins
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                    _iterator5['return']();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }

        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = this.plugins[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var plugin = _step6.value;

                plugin.onPause();
            }

            // set pause state
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                    _iterator6['return']();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }

        this.playerStateIs = _pause;
    },

    timeTo: function timeTo(time) {
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {

            for (var _iterator7 = this.videos[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var video = _step7.value;

                video.timeTo(time);
            }
        } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion7 && _iterator7['return']) {
                    _iterator7['return']();
                }
            } finally {
                if (_didIteratorError7) {
                    throw _iteratorError7;
                }
            }
        }
    },

    render: function render() {

        if (this.settings.area === null) {
            return console.log('no html parent defined');
        }

        $(this.settings.area).html('<div id="SplitPlayer"></div>');
    }

};

/* globals $ */

'use strict';

var SplitPlayerTimeline = function SplitPlayerTimeline(player, settings) {
    this.player = player;
    this.playedTime = 0;
    this.cycler = 0;
    this.paused = true;
    this.timeLine = null;

    this.settings = $.extend({
        element: null,
        currentTimeElement: null,
        durationElement: null,
        startTime: 0,
        duration: 10000,
        previewLine: $('.preview-line'),
        onChange: function onChange() {}
    }, settings);

    this.playedTime = this.settings.startTime;

    this.setEvents();

    $(this.settings.durationElement).html(this.formatTime(this.settings.duration));
    $(this.settings.currentTimeElement).html('0:00');

    return this;
};

SplitPlayerTimeline.prototype = {

    onPlay: function onPlay() {
        this.paused = false;
        this.run();
    },

    onPause: function onPause() {
        this.paused = true;
        clearTimeout(this.cycler);
    },

    onStop: function onStop() {
        this.playedTime = 0;
        this.update();
    },

    setEvents: function setEvents() {
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

        $(document).on('input', 'input[type="range"]', function () {
            var val = $(this).val();
            self.playedTime = val;
            self.settings.onChange(val);
        });
    },

    run: function run() {
        // pause
        if (this.playedTime >= this.settings.duration || this.paused) {
            return this.pause();
        }

        this.playedTime++;
        this.update();

        clearTimeout(this.cycler);
        this.cycler = setTimeout(this.run.bind(this), 1000);
    },

    update: function update() {
        this.timeLine.val(this.playedTime).change();

        $(this.settings.currentTimeElement).html(this.formatTime(this.playedTime));
    },

    formatTime: function formatTime(time) {
        var minutes = Math.floor(time / 60);
        var seconds = Math.round(time - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    }

};

/* globals YT, $ */
'use strict';

var SplitPlayerVideo = SplitPlayerVideo || {};

SplitPlayerVideo.youtube = function (player, settings) {

    this.player = player;
    this.videoPlayer = null;

    this.settings = $.extend({
        video: null,
        type: 'youtube'
    }, settings);

    this.render();
    this.create();

    return this;
};

SplitPlayerVideo.youtube.prototype = {

    load: function load(callback) {
        $.getScript('https://www.youtube.com/iframe_api', function () {
            onYouTubeIframeAPIReady = function () {
                callback();
            };
        });
    },

    create: function create() {
        this.videoPlayer = new YT.Player('player' + this.settings.video.videoId, {
            width: '100%',
            height: '100%',
            videoId: this.settings.video.videoId,
            playerVars: {
                'controls': this.settings.active ? 1 : 0
            },
            events: {
                onReady: this.onReady.bind(this),
                onStateChange: this.onStateChange.bind(this)
            }
        });
    },

    onReady: function onReady() {

        this.timeTo(0);
        this.pause();

        this.player.onReady();
    },

    onStateChange: function onStateChange(event) {
        switch (event.data) {
            case YT.PlayerState.PLAYING:
                this.player.play();
                break;
            case YT.PlayerState.PAUSED:
                this.player.pause();
                break;
        }
    },

    remove: function remove() {
        this.player.removeVideo(this.settings.video);
        this.videoPlayer.destroy();
    },

    timeTo: function timeTo(time) {
        this.videoPlayer.seekTo(time + this.settings.video.startSeconds);
    },

    play: function play() {
        this.videoPlayer.playVideo();
    },

    pause: function pause() {
        this.videoPlayer.pauseVideo();
    },

    getDuration: function getDuration() {
        this.videoPlayer.getDuration();
    },

    render: function render() {
        $('#SplitPlayer').append('<div id="' + this.settings.video.videoId + '"><div>');
    }

};
//# sourceMappingURL=splitplayer.js.map
