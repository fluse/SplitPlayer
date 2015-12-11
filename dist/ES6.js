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
        maxVideos: 4
    }, settings) ;

    this._loadVideoDependencies();

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

    /*
     * Load Video Dependecnies like youtubeIframeApi
     */
    _loadVideoDependencies() {

        if (this._dependenciesLoaded) {
            return;
        }

        SplitPlayerVideo[this.settings.hoster].load(
            this._onVideoDependeciesReady.bind(this)
        );

    },

    _onVideoDependeciesReady() {

        this._dependenciesLoaded = true;

        this._render();

        /* add initial declared videos */
        for (let video of this.settings.videos) {
            this.addVideo(video);
        }

        this.playerStateIs = playerState.loading;

        console.info('api loaded');
    },

    addVideo(video) {

        // max videos check
        if (this.videos.length >= this.settings.maxVideos) {
            return console.info('video limit reached only %s allowed', this.settings.maxVideos);
        }

        this.videos.push(
            // create hoster specific video instance
            new SplitPlayerVideo[this.settings.hoster](this, {
                video: video
            })
        );

    },

    removeVideo(videoId) {

        var video = _.find(this.videos, function(item) {
            return item.settings.video.videoId === videoId;
        });

        if (!video) {
            return false;
        }

        video.destroy();

        this.videos = _.without(
            this.videos,
            video
        );

        // reinit playerDuration
        for (let thisVideo of this.videos) {
            thisVideo.setPlayerDuration();
        }

        this.readyCount--;
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

        if (this.isFreezed) {
            return false;
        }

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
        // abort if not all videos ready
        if (this.readyCount !== this.videos.length) {
            return console.info('pause not ready yet');
        }

        // abort if player not playing state
        if (this.playerStateIs === playerState.pause) {
            return console.info('allready pausing');
        }

        // pause all videos
        for (let video of this.videos) {
            video.pause();
        }

        // stop ticker
        clearInterval(this.ticker);

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
        // abort if not all videos ready
        if (this.readyCount !== this.videos.length) {
            return console.info('stop not ready yet');
        }

        // abort if player not playing state
        if (this.playerStateIs === playerState.unstarted) {
            return;
        }

        // pause all videos
        for (let video of this.videos) {
            video.stop();
        }

        // stop ticker
        clearInterval(this.ticker);

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

        $(this.settings.area).html('<div id="SplitPlayer"></div>');

    }

};

/* globals $ */

'use strict';

var SplitPlayerTimePicker = function (timeline) {
    this.timeline = timeline;

    this.template = '<i class="preview-line"><time></time></i>';
    this.previewedTime = 0;
    /*
    this.playedTime = this.settings.startTime;

    $(this.settings.durationElement).html(this.formatTime(this.settings.duration));
    $(this.settings.currentTimeElement).html('0:00');
    */
    return this;
};

SplitPlayerTimePicker.prototype = {

    onReady() {
        this.render();
        this._setEvents();
    },

    _setEvents() {
        this.timeline.element
            .on('mousemove', this._showTime.bind(this))
            .on('mouseup', this._setTime.bind(this));
    },

    _showTime(e) {
        let leftPos = (e.pageX - this.timeline.element.offset().left);
        let percentage = ((leftPos * 100) / this.timeline.element.width());
        this.previewedTime = ((this.timeline.player.duration / 100) * percentage);

        this.previewLine.width(percentage + '%').find('time').html(this._formatTime(this.previewedTime));
    },

    _setTime() {
        this.timeline.player.pause();
        this.timeline.player.timeTo(this.previewedTime);
        this.timeline.setTo(this.previewedTime);
        this.timeline.player.play();
    },

    _formatTime(time) {
        var minutes = Math.floor(time / 60);
        var seconds = Math.round(time - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    },

    render() {
        this.timeline.element.append(this.template);
        this.previewLine = this.timeline.element.find('.preview-line');
    }

};

/* globals $ */

'use strict';

var SplitPlayerTimeline = function (player) {
    this.player = player;

    this.element = null;
    this.bar = null;

    this.template = '<div id="timeline"><i class="bar"></i></div>';

    return this;
};

SplitPlayerTimeline.prototype = {

    /*
     * extend Module
     */
    extend(Module) {
        return this.player.plugins.push(new Module(this));
    },

    /*
     * player onReady hook
     */
    onReady() {
        this._render();
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
        this._reset();
    },

    /*
     * Set Time to
     */
    setTo(seconds) {
        let percentage = ((seconds * 100) / this.player.duration);
        this.bar.css({
            width: percentage + '%'
        });
    },

    _reset() {
        this.bar.css({
            width: 0
        });
    },

    _formatTime(time) {
        let minutes = Math.floor(time / 60);
        let seconds = Math.round(time - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    },

    _render() {
        let tmp = $(this.player.settings.area).append(this.template);
        this.element = tmp.find('#timeline');
        this.bar = this.element.find('i');
    }
};


/* globals playerState, YT, $ */
'use strict';

var SplitPlayerVideo = SplitPlayerVideo || {};

SplitPlayerVideo.youtube = function (player, settings) {

    this.player = player;
    this.videoPlayer = null;

    this.isSilent = false;

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

    create() {

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
                onStateChange: this.onStateChange.bind(this)
            }
        });
    },

    onReady() {
        this.setPlayerDuration();
        this.stop();
        this.player.onReady();
    },

    onStateChange(event) {

        if (this.isSilence) {
            return;
        }
        console.log(event.data);

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

        console.info('state %s not fetched', event.data);
    },

    getPlayerState() {
        return this.videoPlayer.getPlayerState();
    },

    remove() {
        this.player.removeVideo(this.settings.video);
        this.videoPlayer.destroy();
    },

    timeTo(time) {
        debugger;

        if (this.getDuration() === 0) {
            this.isSilent = true;
            this.stop();
            this.isSilent = false;
            return;
        }

        if (time >= this.getDuration()) {
            this.videoPlayer.seekTo(0);
            return console.info('time for %s out of range', this.settings.video.videoId);
        }

        time = (time + this.settings.video.startSeconds);

        console.log('set time to %s', time);

        this.videoPlayer.seekTo(time);
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
        return this.videoPlayer.getDuration() - this.settings.video.startSeconds;
    },

    setPlayerDuration() {
        let _duration = this.getDuration();

        if (this.player.duration < _duration) {
            this.player.duration = _duration;
            this.player.getPlayedTime = this.getPlayedTime.bind(this);
        }
    },

    getPlayedTime() {
        return this.videoPlayer.getCurrentTime() - this.settings.video.startSeconds;
    },

    render() {
        $('#SplitPlayer').append('<div id="' + this.settings.video.videoId + '"><div>');
    },

    destroy() {
        // remove youtube video iframe
        $('#' + this.settings.video.videoId).find('iframe').remove();
    }

};