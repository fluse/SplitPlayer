/* globals _, $, SplitPlayerVideo */

'use strict';

// player state constants
const inactive = 0;
const loading = 1;
const ready = 2;
const buffering = 3;
const playing = 4;
const pause = 5;

var SplitPlayer = function (settings) {
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
    }, settings) ;

    this.loadVideoDependencies();

    return this;
};

SplitPlayer.prototype = {

    /*
     * Load Video Dependecnies like youtubeIframeApi
     */
    loadVideoDependencies() {

        this.dependenciesLoaded = loading;

        SplitPlayerVideo[this.settings.hoster].load(
            this.onVideoDependeciesReady.bind(this)
        );

    },

    /*
     * Load add Videos after Dependecnies Loaded
     */
    onVideoDependeciesReady() {

        this.dependenciesLoaded = ready;

        this.render();

        /* add initial declared videos */
        for (let video of this.settings.videos) {
            this.addVideo(video);
        }

        this.playerStateIs = loading;
    },

    extend(Plugin) {
        this.plugins.push(new Plugin(this));
    },

    addVideo(video) {

        if (this.videos.length >= this.settings.maxVideos) {
            return false;
        }

        this.videos.push(
            new SplitPlayerVideo(this, {
                video: video
            })
        );

    },

    removeVideo(video) {

        _.findWhere(this.videos, video).remove();

        this.videos = _.without(
            this.videos,
            _.findWhere(this.videos, video)
        );

        this.readyCount--;
    },

    onReady() {

        this.readyCount++;

        if (this.readyCount !== this.videos.length) {
            return false;
        }

        this.playerStateIs = ready;

        // hook onReady for plugins
        for (let Plugin of this.plugins) {
            Plugin.onReady();
        }
    },

    play() {

        if (this.readyCount !== this.videos.length) {
            return false;
        }

        for (let video of this.videos) {
            video.play();
        }

        // hook onPlay for plugins
        for (let plugin of this.plugins) {
            plugin.onPlay();
        }
    },

    pause() {

        // abort if not all videos ready
        if (this.readyCount !== this.videos.length) {
            return false;
        }

        // abort if player not playing state
        if (this.playerStateIs !== playing) {
            return;
        }

        // pause all videos
        for (let video of this.videos) {
            video.pause();
        }

        // hook all plugins
        for (let plugin of this.plugins) {
            plugin.onPause();
        }

        // set pause state
        this.playerStateIs = pause;
    },

    timeTo(time) {

        for (let video of this.videos) {
            video.timeTo(time);
        }

    },

    render() {

        if (this.settings.area === null) {
            return console.log('no html parent defined');
        }

        $(this.settings.area).html('<div id="SplitPlayer"></div>');

    }

};

/* globals $ */

'use strict';

var SplitPlayerTimeline = function (player, settings) {
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
        onChange: function () {}
    }, settings);

    this.playedTime = this.settings.startTime;

    this.setEvents();

    $(this.settings.durationElement).html(this.formatTime(this.settings.duration));
    $(this.settings.currentTimeElement).html('0:00');

    return this;
};

SplitPlayerTimeline.prototype = {

    onPlay() {
        this.paused = false;
        this.run();
    },

    onPause() {
        this.paused = true;
        clearTimeout(this.cycler);
    },

    onStop() {
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

    load(callback) {
        $.getScript('https://www.youtube.com/iframe_api', function () {
            onYouTubeIframeAPIReady = function () {
                callback();
            };
        });
    },

    create() {
        this.videoPlayer = new YT.Player('player' + this.settings.video.videoId, {
            width: '100%',
            height: '100%',
            videoId: this.settings.video.videoId,
            playerVars: {
                'controls': (this.settings.active ? 1 : 0)
            },
            events: {
                onReady: this.onReady.bind(this),
                onStateChange: this.onStateChange.bind(this)
            }
        });
    },

    onReady() {

        this.timeTo(0);
        this.pause();

        this.player.onReady();
    },

    onStateChange(event) {
        switch (event.data) {
            case YT.PlayerState.PLAYING:
                this.player.play();
                break;
            case YT.PlayerState.PAUSED:
                this.player.pause();
                break;
        }
    },

    remove() {
        this.player.removeVideo(this.settings.video);
        this.videoPlayer.destroy();
    },

    timeTo(time) {
        this.videoPlayer.seekTo(time + this.settings.video.startSeconds);
    },

    play() {
        this.videoPlayer.playVideo();
    },

    pause() {
        this.videoPlayer.pauseVideo();
    },

    getDuration() {
        this.videoPlayer.getDuration();
    },

    render() {
        $('#SplitPlayer').append('<div id="' + this.settings.video.videoId + '"><div>');
    }

};
