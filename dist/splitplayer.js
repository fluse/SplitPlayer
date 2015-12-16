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
        maxVideos: 6,
        volume: 100
    }, settings);

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

    _onVideoDependeciesReady: function _onVideoDependeciesReady() {

        this.playerStateIs = playerState.loading;

        /* add initial declared videos */
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = this.videos[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var video = _step2.value;

                video.ready();
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

        console.info('api loaded');
    },

    addVideo: function addVideo(video) {

        // max videos check
        if (this.videos.length >= this.settings.maxVideos) {
            return console.info('video limit reached only %s allowed', this.settings.maxVideos);
        }

        var current = new SplitPlayerVideo[video.hoster](this, video);

        current.load(this._onVideoDependeciesReady.bind(this));

        this.videos.push(
        // create hoster specific video instance
        current);
    },

    destroyVideo: function destroyVideo(videoId) {
        // first remove video from player list
        var video = this.removeVideo(videoId);

        // destory video
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
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = this.videos[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var thisVideo = _step3.value;

                thisVideo.setPlayerDuration();
            }

            // and set readyCount one lower;
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
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = this.plugins[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var Plugin = _step4.value;

                if (Plugin.onReady) {
                    Plugin.onReady();
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

    onUpdate: function onUpdate() {
        // hook all plugins
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = this.plugins[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var Plugin = _step5.value;

                if (Plugin.onUpdate) {
                    Plugin.onUpdate();
                }
            }
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

        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = this.videos[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var video = _step6.value;

                video.play();
            }

            // hook onPlay for plugins
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

        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            for (var _iterator7 = this.plugins[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var Plugin = _step7.value;

                if (Plugin.onPlay) {
                    Plugin.onPlay();
                }
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

        this.playerStateIs = playerState.playing;

        return console.info('playing');
    },

    pause: function pause() {

        // stop ticker
        clearInterval(this.ticker);

        // abort if player not playing state
        if (this.playerStateIs === playerState.pause) {
            return console.info('allready pausing');
        }

        // pause all videos
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
            for (var _iterator8 = this.videos[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var video = _step8.value;

                video.pause();
            }

            // hook all plugins
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

        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
            for (var _iterator9 = this.plugins[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var Plugin = _step9.value;

                if (Plugin.onPause) {
                    Plugin.onPause();
                }
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

        // stop ticker
        clearInterval(this.ticker);

        // abort if player not in playing state
        if (this.playerStateIs !== playerState.pause && this.playerStateIs !== playerState.playing) {
            return;
        }

        // pause all videos
        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
            for (var _iterator10 = this.videos[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var video = _step10.value;

                video.stop();
            }

            // hook all plugins
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

        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
            for (var _iterator11 = this.plugins[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                var Plugin = _step11.value;

                if (Plugin.onStop) {
                    Plugin.onStop();
                }
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

        this.playerStateIs = playerState.unstarted;

        return console.info('stopped');
    },

    timeTo: function timeTo(time) {
        var _iteratorNormalCompletion12 = true;
        var _didIteratorError12 = false;
        var _iteratorError12 = undefined;

        try {
            for (var _iterator12 = this.videos[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                var video = _step12.value;

                video.timeTo(time);
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

    volumeTo: function volumeTo(percentage) {
        this.settings.volume = percentage;
        var _iteratorNormalCompletion13 = true;
        var _didIteratorError13 = false;
        var _iteratorError13 = undefined;

        try {
            for (var _iterator13 = this.videos[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                var video = _step13.value;

                video.volumeTo(percentage);
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
    },

    _videosInState: function _videosInState(state) {
        var inState = true;
        var _iteratorNormalCompletion14 = true;
        var _didIteratorError14 = false;
        var _iteratorError14 = undefined;

        try {
            for (var _iterator14 = this.videos[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                var video = _step14.value;

                if (video.getPlayerState() === state && inState) {
                    inState = false;
                }
            }
        } catch (err) {
            _didIteratorError14 = true;
            _iteratorError14 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion14 && _iterator14['return']) {
                    _iterator14['return']();
                }
            } finally {
                if (_didIteratorError14) {
                    throw _iteratorError14;
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

/* globals $ */

'use strict';

var SplitPlayerTimeDisplay = function SplitPlayerTimeDisplay(timeManager, settings) {
    this.timeManager = timeManager;
    this.$display = null;
    this.$duration = null;
    this.$current = null;

    // extend settings
    this.settings = $.extend({}, this.timeManager.settings, {
        area: null,
        template: '<i class="time-display"><time class="current">&nbsp;</time><time class="duration">&nbsp;</time></i>'
    }, settings);

    this._render();
    return this;
};

SplitPlayerTimeDisplay.prototype = {

    onReady: function onReady() {
        this.onSetTo(this.timeManager.getData());
    },

    onSetTo: function onSetTo(data) {
        this.$duration.html(data.durationFormatted);
        this.$current.html(data.playedTimeFormatted);
    },

    _render: function _render() {
        if (this.settings.area === null) {
            return console.error('no dropArea for timeDisplay defined');
        }

        this.$display = $(this.settings.area);
        this.$display.append(this.settings.template);

        this.$duration = this.$display.find('.duration');
        this.$current = this.$display.find('.current');
    }

};

/* globals $ */

'use strict';

var SplitPlayerTimeLine = function SplitPlayerTimeLine(timeManager, settings) {
    this.timeManager = timeManager;

    // register timeline inside timeManager
    this.timeManager.timeline = null;

    this.bar = null;

    // extend settings
    this.settings = $.extend({}, this.timeManager.settings, {
        template: '<div id="timeline"><i class="bar"></i></div>'
    }, settings);

    this._render();

    return this;
};

SplitPlayerTimeLine.prototype = {

    /*
     * player onReady hook
     */
    onReady: function onReady() {
        this.isActive = true;
    },

    /*
     * player onStop hook
     */
    onStop: function onStop() {
        this._reset();
    },

    /*
     * timeManager onSetTo hook
     */
    onSetTo: function onSetTo(data) {
        this.bar.css({
            width: data.percentage + '%'
        });
    },

    _reset: function _reset() {
        this.bar.css({
            width: 0
        });
    },

    _render: function _render() {
        var dom = $(this.settings.area).append(this.settings.template);

        this.timeManager.timeline = dom.find('#timeline');
        this.bar = this.timeManager.timeline.find('i');
    }
};

/* globals $ */

'use strict';

var SplitPlayerTimeManager = function SplitPlayerTimeManager(player, settings) {
    this.player = player;

    this.isActive = false;
    this.playedTime = 0;

    this.plugins = [];

    // extend player settings
    this.settings = $.extend({}, this.player.settings, {}, settings || {});

    return this;
};

SplitPlayerTimeManager.prototype = {

    /*
     * extend Module
     */
    extend: function extend(Module, settings) {
        Module = new Module(this, settings || {});

        // push internal
        this.plugins.push(Module);

        // push to player plugins for other hooks
        return this.player.plugins.push(Module);
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
        this.playedTime = 0;
    },

    /*
     * Set Time to
     */
    setTo: function setTo(playedTime) {
        this.playedTime = playedTime;

        // plugin
        var _iteratorNormalCompletion15 = true;
        var _didIteratorError15 = false;
        var _iteratorError15 = undefined;

        try {
            for (var _iterator15 = this.plugins[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                var Plugin = _step15.value;

                if (Plugin.onSetTo) {
                    Plugin.onSetTo(this.getData());
                }
            }
        } catch (err) {
            _didIteratorError15 = true;
            _iteratorError15 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion15 && _iterator15['return']) {
                    _iterator15['return']();
                }
            } finally {
                if (_didIteratorError15) {
                    throw _iteratorError15;
                }
            }
        }
    },

    /*
     * get all time data from player
     */
    getData: function getData() {
        // get percentage
        var percentage = this.playedTime * 100 / this.player.duration;
        // player duration
        var duration = this.player.duration;

        // formatted playedTime
        var playedTimeFormatted = this._formatTime(this.playedTime);
        // formatted duration
        var durationFormatted = this._formatTime(duration);

        return {
            percentage: percentage,
            playedTime: this.playedTime,
            playedTimeFormatted: playedTimeFormatted,
            duration: duration,
            durationFormatted: durationFormatted
        };
    },

    _formatTime: function _formatTime(timeInplayedTime) {
        // convert to minutes
        var minutes = Math.floor(timeInplayedTime / 60);
        // get playedTime;
        var playedTime = Math.round(timeInplayedTime - minutes * 60);

        if (playedTime < 10) {
            playedTime = '0' + playedTime;
        }

        return minutes + ':' + playedTime;
    }
};

/* globals $ */

'use strict';

var SplitPlayerTimePicker = function SplitPlayerTimePicker(timeManager, settings) {
    this.timeManager = timeManager;

    this.timeline = this.timeManager.timeline;

    this.previewedTime = 0;

    // extend settings
    this.settings = $.extend({}, this.timeManager.settings, {
        area: '#timeline',
        template: '<i class="preview-line"><time></time></i>'
    }, settings || {});

    this._render();
    this._setEvents();

    return this;
};

SplitPlayerTimePicker.prototype = {

    // set mousemove and click event
    _setEvents: function _setEvents() {
        this.timeline.on('mousemove', this._showTime.bind(this)).on('mouseup', this._setTime.bind(this));
    },

    // show time on mousemove
    _showTime: function _showTime(e) {

        var leftPos = e.pageX - this.timeline.offset().left;

        var percentage = leftPos * 100 / this.timeline.width();

        // set to 0 if negative value
        if (percentage < 0) {
            percentage = 0;
        }

        this.previewedTime = this.timeManager.player.duration / 100 * percentage;

        this.previewLine.width(percentage + '%').find('time').html(this.timeManager._formatTime(this.previewedTime));
    },

    // set time on click
    _setTime: function _setTime() {
        this.timeManager.player.stop();
        this.timeManager.player.timeTo(this.previewedTime);

        // wait for next tick
        setTimeout(this.timeManager.player.play.bind(this.timeManager.player), 100);
    },

    _render: function _render() {
        this.timeline.append(this.settings.template);
        this.previewLine = this.timeline.find('.preview-line');
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

    return this;
};

SplitPlayerVideo.youtube.prototype = {

    loadingDependencies: false,

    load: function load(callback) {

        if (this.loadingDependencies) {
            return;
        }

        this.loadingDependencies = true;

        $.getScript('//youtube.com/iframe_api', function () {
            window.onYouTubeIframeAPIReady = callback;
        });
    },

    ready: function ready() {
        this._render();
        this.create();
    },

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

        console.log(this.videoPlayer.getPlayerState());
        if (time >= this.getDuration()) {
            this.stop();
            return console.info('time for %s out of range', this.settings.videoId);
        }

        time = time + this.settings.startSeconds;

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
