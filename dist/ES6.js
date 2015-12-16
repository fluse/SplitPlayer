/* globals _, $, SplitPlayerVideo */

'use strict';

// player state constants
const playerState = {
    unstarted: -1,
    ended: 0,
    playing: 1,
    pause: 2,
    buffering: 3,
    loading: 6
};

var SplitPlayer = function (settings) {

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

    this._render();

    /* add initial declared videos */
    for (let video of this.settings.videos) {
        this.addVideo(video);
    }

    return this;
};

SplitPlayer.prototype = {

    getPlayedTime () {
        return 0;
    },

    /*
     * add Plugins
     */
    addPlugin (Plugin) {
        let _instance = new Plugin(this);
        this.plugins.push(_instance);
        return _instance;
    },

    _onVideoDependeciesReady() {

        this.playerStateIs = playerState.loading;

        /* add initial declared videos */
        for (let video of this.videos) {
            video.ready();
        }

        console.info('api loaded');
    },

    addVideo(video) {

        // max videos check
        if (this.videos.length >= this.settings.maxVideos) {
            return console.info('video limit reached only %s allowed', this.settings.maxVideos);
        }

        var current = new SplitPlayerVideo[video.hoster](this, video);

        current.load(
            this._onVideoDependeciesReady.bind(this)
        );

        this.videos.push(
            // create hoster specific video instance
            current
        );

    },

    destroyVideo(videoId) {
        // first remove video from player list
        var video = this.removeVideo(videoId);

        // destory video
        video.destroy();
    },

    removeVideo(videoId) {

        // get video from array
        var video = _.find(this.videos, function(video) {
            return video.settings.videoId === videoId;
        });

        // if there is a video
        if (!video) {
            return false;
        }

        // remove it from array
        this.videos = _.without(
            this.videos,
            video
        );

        // reinit playerDuration
        for (let thisVideo of this.videos) {
            thisVideo.setPlayerDuration();
        }

        // and set readyCount one lower;
        this.readyCount--;

        return video;
    },

    /*
     * called after all video player ready initialized
     */
    onReady() {

        this.readyCount++;

        // prevent if not all videos ready
        if (this.readyCount !== this.videos.length) {
            return console.info('videos not ready yet');
        }
        this.play();
        this.pause();
        this.playerStateIs = playerState.ready;

        // hook onReady for plugins
        for (let Plugin of this.plugins) {
            if (Plugin.onReady) {
                Plugin.onReady();
            }
        }
    },

    onUpdate() {
        // hook all plugins
        for (let Plugin of this.plugins) {
            if (Plugin.onUpdate) {
                Plugin.onUpdate();
            }
        }
    },

    changeState(state) {

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

    play() {

        // start ticker
        this.ticker = window.setInterval(this.onUpdate.bind(this), 500);

        for (let video of this.videos) {
            video.play();
        }

        // hook onPlay for plugins
        for (let Plugin of this.plugins) {
            if (Plugin.onPlay) {
                Plugin.onPlay();
            }
        }

        this.playerStateIs = playerState.playing;

        return console.info('playing');
    },

    pause() {

        // stop ticker
        clearInterval(this.ticker);

        // abort if player not playing state
        if (this.playerStateIs === playerState.pause) {
            return console.info('allready pausing');
        }

        // pause all videos
        for (let video of this.videos) {
            video.pause();
        }

        // hook all plugins
        for (let Plugin of this.plugins) {
            if (Plugin.onPause) {
                Plugin.onPause();
            }
        }

        this.playerStateIs = playerState.pause;

        return console.info('pause');
    },

    /*
     * Toggle Video from play to pause vice versa
     */
    toggle() {
        if (this.playerStateIs === playerState.pause) {
            return this.play();
        }
        return this.pause();
    },

    stop() {

        // stop ticker
        clearInterval(this.ticker);

        // abort if player not in playing state
        if (this.playerStateIs !== playerState.pause && this.playerStateIs !== playerState.playing) {
            return;
        }

        // pause all videos
        for (let video of this.videos) {
            video.stop();
        }

        // hook all plugins
        for (let Plugin of this.plugins) {
            if (Plugin.onStop) {
                Plugin.onStop();
            }
        }

        this.playerStateIs = playerState.unstarted;

        return console.info('stopped');
    },

    timeTo(time) {
        for (let video of this.videos) {
            video.timeTo(time);
        }
    },

    volumeTo(percentage) {
        this.settings.volume = percentage;
        for (let video of this.videos) {
            video.volumeTo(percentage);
        }
    },

    _videosInState(state) {
        let inState = true;
        for (let video of this.videos) {
            if (video.getPlayerState() === state && inState) {
                inState = false;
            }
        }

        return inState;
    },

    _render() {
        if (this.settings.area === null) {
            return console.info('no html parent defined', this.settings.area);
        }

        $(this.settings.area).prepend('<div id="SplitPlayer"></div>');

    }

};


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

/* globals $ */

'use strict';

var SplitPlayerTimeLine = function (timeManager, settings) {
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
    onReady() {
        this.isActive = true;
    },

    /*
     * player onStop hook
     */
    onStop() {
        this._reset();
    },

    /*
     * timeManager onSetTo hook
     */
    onSetTo(data) {
        this.bar.css({
            width: data.percentage + '%'
        });
    },

    _reset() {
        this.bar.css({
            width: 0
        });
    },

    _render() {
        let dom = $(this.settings.area).append(this.settings.template);

        this.timeManager.timeline = dom.find('#timeline');
        this.bar = this.timeManager.timeline .find('i');
    }
};

/* globals $ */

'use strict';

var SplitPlayerTimeManager = function (player, settings) {
    this.player = player;

    this.isActive = false;
    this.seconds = 0;

    this.plugins = [];

    // extend player settings
    this.settings = $.extend({}, this.player.settings, {
    }, settings || {});

    return this;
};

SplitPlayerTimeManager.prototype = {

    /*
     * extend Module
     */
    extend(Module) {
        Module = new Module(this);

        // push internal
        this.plugins.push(Module);

        // push to player plugins for other hooks
        return this.player.plugins.push(Module);
    },

    /*
     * player onReady hook
     */
    onReady() {
        this.isActive = true;
    },

    /*
     * player onUpdate hook
     */
    onUpdate() {
        this.setTo(this.player.getPlayedTime());
    },

    /*
     * player onStop hook
     */
    onStop() {
        this.seconds = 0;
    },

    /*
     * Set Time to
     */
    setTo(seconds) {
        this.seconds = seconds;

        // plugin
        for (let Plugin of this.plugins) {
            if (Plugin.onSetTo) {
                Plugin.onSetTo(this.getData());
            }
        }
    },

    getData() {
        // get percentage
        const percentage = ((this.seconds * 100) / this.player.duration);

        // formatted seconds
        const formattedTime = this._formatTime(this.seconds);

        return {
            seconds: this.seconds,
            formattedTime: formattedTime,
            percentage: percentage
        };
    },

    _formatTime(timeInSeconds) {
        // convert to minutes
        let minutes = Math.floor(timeInSeconds / 60);
        // get seconds;
        let seconds = Math.round(timeInSeconds - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    }
};

/* globals $ */

'use strict';

var SplitPlayerTimePicker = function (timeManager, settings) {
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
    _setEvents() {
        this.timeline
            .on('mousemove', this._showTime.bind(this))
            .on('mouseup', this._setTime.bind(this));
    },

    // show time on mousemove
    _showTime(e) {

        let leftPos = (e.pageX - this.timeline.offset().left);

        let percentage = ((leftPos * 100) / this.timeline.width());

        this.previewedTime = ((this.timeManager.player.duration / 100) * percentage);

        this.previewLine.width(percentage + '%').find('time').html(
            this.timeManager._formatTime(this.previewedTime)
        );
    },

    // set time on click
    _setTime() {
        this.timeManager.player.stop();
        this.timeManager.player.timeTo(this.previewedTime);
        setTimeout(this.timeManager.player.play.bind(this.timeManager.player), 100);
    },

    _render() {
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

    load(callback) {

        if (this.loadingDependencies) {
            return;
        }

        this.loadingDependencies = true;

        $.getScript('//youtube.com/iframe_api', function () {
            window.onYouTubeIframeAPIReady = callback;
        });
    },

    ready() {
        this._render();
        this.create();
    },

    create() {

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

    onReady() {
        this.setPlayerDuration();
        this.mute();
        this.player.onReady();
    },

    onError(err) {
        var code = err.data;
        if (code === 100 || code === 150) {
            console.error('Video %s Not Found', this.settings.videoId);
        }

        this.noVideo();
    },

    onStateChange(event) {

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

    getPlayerState() {
        return this.videoPlayer.getPlayerState();
    },

    remove() {
        this.videoPlayer.destroy();
    },

    timeTo(time) {

        console.log(this.videoPlayer.getPlayerState());
        if (time >= this.getDuration()) {
            this.stop();
            return console.info('time for %s out of range', this.settings.videoId);
        }

        time = (time + this.settings.startSeconds);

        this.videoPlayer.seekTo(time);
    },

    volumeTo(percentage) {
        if (this.isMuted) {
            return false;
        }

        this.videoPlayer.setVolume(percentage);
        return true;
    },

    mute() {
        if (!this.isMuted) {
            return false;
        }

        this.videoPlayer.mute();
        this.isMuted = true;
        return true;
    },

    unMute() {
        if (!this.isMuted) {
            return false;
        }

        this.isMuted = false;
        this.volumeTo(this.player.settings.volume);

        return true;
    },

    play() {
        this.videoPlayer.playVideo();
    },

    pause() {
        this.videoPlayer.pauseVideo();
    },

    stop() {
        this.timeTo(0);
        this.pause();
    },

    getDuration() {
        return this.videoPlayer.getDuration() - this.settings.startSeconds;
    },

    setPlayerDuration() {
        let _duration = this.getDuration();

        if (this.player.duration < _duration) {
            this.player.duration = _duration;
            this.player.getPlayedTime = this.getPlayedTime.bind(this);
        }
    },

    getPlayedTime() {
        return this.videoPlayer.getCurrentTime() - this.settings.startSeconds;
    },

    _render() {
        $('#SplitPlayer').append('<div id="' + this.settings.videoId + '"><div id="replacer' + this.settings.videoId + '"><div></div>');
    },

    noVideo() {
        this.player.removeVideo(this.settings.videoId);
        $('#' + this.settings.videoId).html('<div class="no-video"></div>');
    },

    destroy() {
        // remove youtube video iframe
        $('#' + this.settings.videoId).remove();
    }

};
