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

    // ticker for onUpdate interval
    this.ticker = null;

    // dependencie loading status
    this._dependenciesLoaded = false;

    this.settings = $.extend({
        hoster: 'youtube',
        videos: [],
        area: null,
        maxVideos: 4,
        volume: 100
    }, settings);

    this._loadVideoDependencies();

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
        var _instance = new Plugin(this);
        this.plugins.push(_instance);
        return _instance;
    },

    /*
     * Load Video Dependecnies like youtubeIframeApi
     */
    _loadVideoDependencies: function _loadVideoDependencies() {

        if (this._dependenciesLoaded) {
            return;
        }

        SplitPlayerVideo[this.settings.hoster].load(this._onVideoDependeciesReady.bind(this));
    },

    _onVideoDependeciesReady: function _onVideoDependeciesReady() {

        this._dependenciesLoaded = true;

        this._render();

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
        new SplitPlayerVideo[this.settings.hoster](this, video));
    },

    destroyVideo: function destroyVideo(videoId) {
        // first remove video from player list
        var video = this.removeVideo(videoId);

        // destory video him
        video.destroy();
    },

    removeVideo: function removeVideo(videoId) {

        // get video from array
        var video = _.find(this.videos, function (video) {
            return video.settings.videoId === videoId;
        });

        // if there is a video
        if (!video) {
            return false;
        }

        // remove it from array
        this.videos = _.without(this.videos, video);

        // reinit playerDuration
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = this.videos[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var thisVideo = _step2.value;

                thisVideo.setPlayerDuration();
            }

            // and set readyCount one lower;
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

        this.readyCount--;

        return video;
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
        this.play();
        this.pause();
        this.playerStateIs = playerState.ready;

        // hook onReady for plugins
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = this.plugins[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var Plugin = _step3.value;

                if (Plugin.onReady) {
                    Plugin.onReady();
                }
            }
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
    },

    onUpdate: function onUpdate() {
        // hook all plugins
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = this.plugins[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var Plugin = _step4.value;

                if (Plugin.onUpdate) {
                    Plugin.onUpdate();
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
    },

    changeState: function changeState(state) {

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

        // start ticker
        this.ticker = window.setInterval(this.onUpdate.bind(this), 500);

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = this.videos[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var video = _step5.value;

                video.play();
            }

            // hook onPlay for plugins
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

                if (Plugin.onPlay) {
                    Plugin.onPlay();
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

        this.playerStateIs = playerState.playing;

        return console.info('playing');
    },

    pause: function pause() {

        // abort if player not playing state
        if (this.playerStateIs === playerState.pause) {
            return console.info('allready pausing');
        }

        // pause all videos
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            for (var _iterator7 = this.videos[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var video = _step7.value;

                video.pause();
            }

            // stop ticker
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

        clearInterval(this.ticker);

        // hook all plugins
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
            for (var _iterator8 = this.plugins[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var Plugin = _step8.value;

                if (Plugin.onPause) {
                    Plugin.onPause();
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

        this.playerStateIs = playerState.pause;

        return console.info('pause');
    },

    /*
     * Toggle Video from play to pause vice versa
     */
    toggle: function toggle() {
        if (this.playerStateIs === playerState.pause) {
            return this.play();
        }
        return this.pause();
    },

    stop: function stop() {

        // abort if player not playing state
        if (this.playerStateIs !== playerState.pause && this.playerStateIs !== playerState.playing) {
            return;
        }

        // pause all videos
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
            for (var _iterator9 = this.videos[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var video = _step9.value;

                video.stop();
            }

            // stop ticker
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

        clearInterval(this.ticker);

        // hook all plugins
        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
            for (var _iterator10 = this.plugins[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var Plugin = _step10.value;

                if (Plugin.onStop) {
                    Plugin.onStop();
                }
            }
        } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion10 && _iterator10['return']) {
                    _iterator10['return']();
                }
            } finally {
                if (_didIteratorError10) {
                    throw _iteratorError10;
                }
            }
        }

        this.playerStateIs = playerState.unstarted;

        return console.info('stopped');
    },

    timeTo: function timeTo(time) {
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
            for (var _iterator11 = this.videos[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                var video = _step11.value;

                video.timeTo(time);
            }
        } catch (err) {
            _didIteratorError11 = true;
            _iteratorError11 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion11 && _iterator11['return']) {
                    _iterator11['return']();
                }
            } finally {
                if (_didIteratorError11) {
                    throw _iteratorError11;
                }
            }
        }
    },

    volumeTo: function volumeTo(percentage) {
        this.settings.volume = percentage;
        var _iteratorNormalCompletion12 = true;
        var _didIteratorError12 = false;
        var _iteratorError12 = undefined;

        try {
            for (var _iterator12 = this.videos[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                var video = _step12.value;

                video.volumeTo(percentage);
            }
        } catch (err) {
            _didIteratorError12 = true;
            _iteratorError12 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion12 && _iterator12['return']) {
                    _iterator12['return']();
                }
            } finally {
                if (_didIteratorError12) {
                    throw _iteratorError12;
                }
            }
        }
    },

    _videosInState: function _videosInState(state) {
        var inState = true;
        var _iteratorNormalCompletion13 = true;
        var _didIteratorError13 = false;
        var _iteratorError13 = undefined;

        try {
            for (var _iterator13 = this.videos[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                var video = _step13.value;

                if (video.getPlayerState() === state && inState) {
                    inState = false;
                }
            }
        } catch (err) {
            _didIteratorError13 = true;
            _iteratorError13 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion13 && _iterator13['return']) {
                    _iterator13['return']();
                }
            } finally {
                if (_didIteratorError13) {
                    throw _iteratorError13;
                }
            }
        }

        return inState;
    },

    _render: function _render() {
        if (this.settings.area === null) {
            return console.info('no html parent defined', this.settings.area);
        }

        $(this.settings.area).prepend('<div id="SplitPlayer"></div>');
    }

};

/*
this.playedTime = this.settings.startTime;

$(this.settings.durationElement).html(this.formatTime(this.settings.duration));
$(this.settings.currentTimeElement).html('0:00');
*/
/* globals $ */

'use strict';

var SplitPlayerTimeHud = function SplitPlayerTimeHud(timeline) {
    this.timeline = timeline;

    this.template = '<i class="preview-line"><time></time></i>';

    this._render();
    return this;
};

SplitPlayerTimeHud.prototype = {

    onReady: function onReady() {},

    onUpdate: function onUpdate() {},

    _render: function _render() {
        this.timeline.element.append(this.template);
        this.previewLine = this.timeline.element.find('.preview-line');
    }

};

/* globals $ */

'use strict';

var SplitPlayerTimeline = function SplitPlayerTimeline(player) {
    this.player = player;
    this.element = null;
    this.bar = null;
    this.isActive = false;

    this.template = '<div id="timeline"><i class="bar"></i></div>';

    this._render();

    return this;
};

SplitPlayerTimeline.prototype = {

    /*
     * extend Module
     */
    extend: function extend(Module) {
        return this.player.plugins.push(new Module(this));
    },

    /*
     * player onReady hook
     */
    onReady: function onReady() {
        this.isActive = true;
    },

    /*
     * player onUpdate hook
     */
    onUpdate: function onUpdate() {
        this.setTo(this.player.getPlayedTime());
    },

    /*
     * player onStop hook
     */
    onStop: function onStop() {
        this._reset();
    },

    /*
     * Set Time to
     */
    setTo: function setTo(seconds) {
        var percentage = seconds * 100 / this.player.duration;

        this.bar.css({
            width: percentage + '%'
        });
    },

    _reset: function _reset() {
        this.bar.css({
            width: 0
        });
    },

    _formatTime: function _formatTime(time) {
        var minutes = Math.floor(time / 60);
        var seconds = Math.round(time - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    },

    _render: function _render() {
        var tmp = $(this.player.settings.area).append(this.template);

        this.element = $(tmp).find('#timeline');
        this.bar = this.element.find('i');
    }
};

/* globals $ */

'use strict';

var SplitPlayerTimePicker = function SplitPlayerTimePicker(timeline) {
    this.timeline = timeline;

    this.template = '<i class="preview-line"><time></time></i>';
    this.previewedTime = 0;

    this._render();
    this._setEvents();
    return this;
};

SplitPlayerTimePicker.prototype = {

    onReady: function onReady() {},

    _setEvents: function _setEvents() {
        this.timeline.element.on('mousemove', this._showTime.bind(this)).on('mouseup', this._setTime.bind(this));
    },

    _showTime: function _showTime(e) {
        var leftPos = e.pageX - this.timeline.element.offset().left;
        var percentage = leftPos * 100 / this.timeline.element.width();
        this.previewedTime = this.timeline.player.duration / 100 * percentage;

        this.previewLine.width(percentage + '%').find('time').html(this._formatTime(this.previewedTime));
    },

    _setTime: function _setTime() {
        this.timeline.player.stop();
        this.timeline.player.timeTo(this.previewedTime);
        this.timeline.setTo(this.previewedTime);
        this.timeline.player.play();
    },

    _formatTime: function _formatTime(time) {
        var minutes = Math.floor(time / 60);
        var seconds = Math.round(time - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    },

    _render: function _render() {
        this.timeline.element.append(this.template);
        this.previewLine = this.timeline.element.find('.preview-line');
    }

};

/* globals playerState, YT, $ */
'use strict';

var SplitPlayerVideo = SplitPlayerVideo || {};

SplitPlayerVideo.youtube = function (player, settings) {

    this.player = player;
    this.videoPlayer = null;

    this.settings = $.extend({
        videoId: null,
        startSeconds: 0,
        isMuted: false
    }, settings);

    this.isMuted = this.settings.isMuted;

    this._render();
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

        this.videoPlayer = new YT.Player('replacer' + this.settings.videoId, {
            width: '100%',
            height: '100%',
            videoId: this.settings.videoId,
            startSeconds: this.settings.startSeconds,
            playerVars: {
                'controls': 1
            },
            events: {
                onReady: this.onReady.bind(this),
                onStateChange: this.onStateChange.bind(this),
                onError: this.onError.bind(this)
            }
        });
    },

    onReady: function onReady() {
        this.setPlayerDuration();
        this.mute();
        this.player.onReady();
    },

    onError: function onError(err) {
        var code = err.data;
        if (code === 100 || code === 150) {
            console.error('Video %s Not Found', this.settings.videoId);
        }

        this.noVideo();
    },

    onStateChange: function onStateChange(event) {

        if (event.data === YT.PlayerState.BUFFERING) {
            return this.player.changeState(playerState.buffering);
        }

        if (event.data === YT.PlayerState.PLAYING) {
            return this.player.changeState(playerState.playing);
        }

        if (event.data === YT.PlayerState.PAUSED) {
            return this.player.changeState(playerState.pause);
        }

        console.info('state %s not fetched', event.data);
    },

    getPlayerState: function getPlayerState() {
        return this.videoPlayer.getPlayerState();
    },

    remove: function remove() {
        this.videoPlayer.destroy();
    },

    timeTo: function timeTo(time) {

        if (time >= this.getDuration()) {
            this.videoPlayer.seekTo(0);
            return console.info('time for %s out of range', this.settings.videoId);
        }

        time = time + this.settings.startSeconds;

        console.log('set time to %s', time);

        this.videoPlayer.seekTo(time);
    },

    volumeTo: function volumeTo(percentage) {
        if (this.isMuted) {
            return false;
        }

        this.videoPlayer.setVolume(percentage);
        return true;
    },

    mute: function mute() {
        if (!this.isMuted) {
            return false;
        }

        this.videoPlayer.mute();
        this.isMuted = true;
        return true;
    },

    unMute: function unMute() {
        if (!this.isMuted) {
            return false;
        }

        this.isMuted = false;
        this.volumeTo(this.player.settings.volume);

        return true;
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
        return this.videoPlayer.getDuration() - this.settings.startSeconds;
    },

    setPlayerDuration: function setPlayerDuration() {
        var _duration = this.getDuration();

        if (this.player.duration < _duration) {
            this.player.duration = _duration;
            this.player.getPlayedTime = this.getPlayedTime.bind(this);
        }
    },

    getPlayedTime: function getPlayedTime() {
        return this.videoPlayer.getCurrentTime() - this.settings.startSeconds;
    },

    _render: function _render() {
        $('#SplitPlayer').append('<div id="' + this.settings.videoId + '"><div id="replacer' + this.settings.videoId + '"><div></div>');
    },

    noVideo: function noVideo() {
        this.player.removeVideo(this.settings.videoId);
        $('#' + this.settings.videoId).html('<div class="no-video"></div>');
    },

    destroy: function destroy() {
        // remove youtube video iframe
        $('#' + this.settings.videoId).remove();
    }

};
