/* globals _, $, SplitPlayerVideo */

'use strict';

// player state constants
var playerState = {
    unstarted: -1,
    ended: 0,
    playing: 1,
    pause: 2,
    buffering: 3,
    loading: 6
};

var SplitPlayer = function SplitPlayer(settings) {

    this.duration = 0;

    this.readyCount = 0;

    // video instances container
    this.videos = [];

    // plugin instances container
    this.plugins = [];

    // global player state
    this.playerStateIs = playerState.inactive;

    // dependencie loading status
    this.dependenciesLoaded = false;

    this.settings = $.extend({
        hoster: 'youtube',
        videos: [],
        area: null,
        maxVideos: 4
    }, settings);

    this.loadVideoDependencies();

    return this;
};

SplitPlayer.prototype = {

    getPlayedTime: function getPlayedTime() {
        return 0;
    },

    /*
     * add Plugins
     */
    addPlugin: function addPlugin(Plugin) {
        this.plugins.push(new Plugin(this));
    },

    /*
     * Load Video Dependecnies like youtubeIframeApi
     */
    loadVideoDependencies: function loadVideoDependencies() {

        SplitPlayerVideo[this.settings.hoster].load(this.onVideoDependeciesReady.bind(this));
    },

    /*
     * Load add Videos after Dependecnies Loaded
     */
    onVideoDependeciesReady: function onVideoDependeciesReady() {

        this.dependenciesLoaded = true;

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

        this.playerStateIs = playerState.loading;

        console.info('api loaded');
    },

    addVideo: function addVideo(video) {

        // max videos check
        if (this.videos.length >= this.settings.maxVideos) {
            return console.info('video limit reached only %s allowed', this.settings.maxVideos);
        }

        this.videos.push(
        // create hoster specific video instance
        new SplitPlayerVideo[this.settings.hoster](this, {
            video: video
        }));
    },

    removeVideo: function removeVideo(video) {

        _.findWhere(this.videos, video).remove();

        this.videos = _.without(this.videos, _.findWhere(this.videos, video));

        this.readyCount--;
    },

    /*
     * called after all video player ready initialized
     */
    onReady: function onReady() {

        this.readyCount++;

        // prevent if not all videos ready
        if (this.readyCount !== this.videos.length) {
            return console.info('videos not ready yet');
        }

        console.info('player and videos ready');

        this.playerStateIs = playerState.ready;

        // hook onReady for plugins
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = this.plugins[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var Plugin = _step2.value;

                if (Plugin.onReady) {
                    Plugin.onReady();
                }
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

    changeState: function changeState(state) {

        console.info('state changed to %s', state);

        // prevent if not all videos ready
        if (this.readyCount !== this.videos.length) {
            return false;
        }

        if (state === playerState.buffering) {
            return this.pause();
        }

        if (state === playerState.pause) {
            return this.pause();
        }

        if (state === playerState.playing) {
            return this.play();
        }
    },

    play: function play() {

        // prevent play if videos not ready
        if (this.readyCount !== this.videos.length) {
            return console.info('play not ready yet');
        }

        // abort if is playing allready
        if (this.playerStateIs === playerState.playing) {
            return console.info('allready playing');
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
                var Plugin = _step4.value;

                if (Plugin.onPlay) {
                    Plugin.onPlay();
                }
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

        this.playerStateIs = playerState.playing;

        return console.info('playing');
    },

    pause: function pause() {
        // abort if not all videos ready
        if (this.readyCount !== this.videos.length) {
            return console.log('pause not ready yet');
        }

        // abort if player not playing state
        if (this.playerStateIs === playerState.pause) {
            return console.log('allready pausing');
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
                var Plugin = _step6.value;

                if (Plugin.onPause) {
                    Plugin.onPause();
                }
            }
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

        this.playerStateIs = playerState.pause;

        return console.info('pause');
    },

    stop: function stop() {
        // abort if not all videos ready
        if (this.readyCount !== this.videos.length) {
            return console.log('pause not ready yet');
        }

        // abort if player not playing state
        if (this.playerStateIs === playerState.unstarted) {
            return;
        }

        // pause all videos
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            for (var _iterator7 = this.videos[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var video = _step7.value;

                video.stop();
            }

            // hook all plugins
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

        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
            for (var _iterator8 = this.plugins[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var Plugin = _step8.value;

                if (Plugin.onStop) {
                    Plugin.onStop();
                }
            }
        } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion8 && _iterator8['return']) {
                    _iterator8['return']();
                }
            } finally {
                if (_didIteratorError8) {
                    throw _iteratorError8;
                }
            }
        }

        this.playerStateIs = playerState.unstarted;

        return console.info('stopped');
    },

    timeTo: function timeTo(time) {
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {

            for (var _iterator9 = this.videos[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var video = _step9.value;

                video.timeTo(time);
            }
        } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion9 && _iterator9['return']) {
                    _iterator9['return']();
                }
            } finally {
                if (_didIteratorError9) {
                    throw _iteratorError9;
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

var SplitPlayerTimePicker = function SplitPlayerTimePicker(player, settings) {
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

    onReady: function onReady() {},

    onPlay: function onPlay() {
        return console.log('plugin on play');
        this.paused = false;
        this.run();
    },

    onPause: function onPause() {
        return console.log('plugin on pause');
        this.paused = true;
        clearTimeout(this.cycler);
    },

    onStop: function onStop() {
        return console.log('plugin on stop');
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

/* globals $ */

'use strict';

var SplitPlayerTimeline = function SplitPlayerTimeline(player) {
    this.player = player;
    this.cycler = null;
    return this;
};

SplitPlayerTimeline.prototype = {

    onReady: function onReady() {
        this.render();
    },

    onPlay: function onPlay() {
        this.cycler = window.setInterval(this.getTime.bind(this), 50);

        return console.log('plugin on play');
    },

    onPause: function onPause() {
        clearInterval(this.cycler);
        return console.log('plugin on pause');
    },

    onStop: function onStop() {
        return console.log('plugin on stop');
    },

    getTime: function getTime() {
        console.log(this.player.getPlayedTime() * 100 / this.player.duration);
    },

    render: function render() {
        $(this.player.settings.area).append('<div id="timeline"><i></i></div>');
    }
};

/* globals playerState, YT, $ */
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

SplitPlayerVideo.youtube.load = function (callback) {
    $.getScript('//youtube.com/iframe_api', function () {
        window.onYouTubeIframeAPIReady = callback;
    });
};

SplitPlayerVideo.youtube.prototype = {

    create: function create() {

        var self = this;
        this.videoPlayer = new YT.Player(this.settings.video.videoId, {
            width: '100%',
            height: '100%',
            videoId: this.settings.video.videoId,
            startSeconds: this.settings.video.startSeconds,
            playerVars: {
                'controls': 1
            },
            events: {
                onReady: this.onReady.bind(this),
                onStateChange: function onStateChange(event) {
                    self.onStateChange(event);
                }
            }
        });
    },

    onReady: function onReady() {
        this.setPlayerDuration();
        this.stop();
        this.player.onReady();
    },

    onStateChange: function onStateChange(event) {

        if (event.data === YT.PlayerState.BUFFERING) {
            return this.player.changeState(playerState.buffering);
        }

        if (event.data === YT.PlayerState.PLAYING) {
            return this.player.changeState(playerState.playing);
        }

        if (event.data === YT.PlayerState.ENDED) {
            this.timeTo(0);
            return this.player.changeState(event.data);
        }

        if (event.data === YT.PlayerState.PAUSED) {
            return this.player.changeState(playerState.pause);
        }

        console.info('event %s not fetched', event.data);
    },

    remove: function remove() {
        this.player.removeVideo(this.settings.video);
        this.videoPlayer.destroy();
    },

    timeTo: function timeTo(time) {
        time = time + this.settings.video.startSeconds;
        console.log('set time to %s', time);
        this.videoPlayer.seekTo(time);
    },

    play: function play() {
        this.videoPlayer.playVideo();
    },

    pause: function pause() {
        this.videoPlayer.pauseVideo();
    },

    stop: function stop() {
        this.timeTo(0);
        this.pause();
    },

    getDuration: function getDuration() {
        return this.videoPlayer.getDuration() - this.settings.video.startSeconds;
    },

    setPlayerDuration: function setPlayerDuration() {
        var duration = this.getDuration();

        if (this.player.duration < duration) {
            this.player.duration = duration;
            this.player.getPlayedTime = this.getPlayedTime.bind(this);
        }
    },

    getPlayedTime: function getPlayedTime() {
        return this.videoPlayer.getCurrentTime() - this.settings.video.startSeconds;
    },

    render: function render() {
        $('#SplitPlayer').append('<div id="' + this.settings.video.videoId + '"><div>');
    },

    destroy: function destroy() {
        // remove youtube video iframe
        this.videoPlayer.destory();

        // remove this video
        this.player.removeVideo(this);
    }

};
//# sourceMappingURL=splitplayer.js.map
