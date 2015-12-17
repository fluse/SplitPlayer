/* globals _, extend, SplitPlayerVideo */

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

    this.$dom = null;

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

    this.settings = extend({
        hoster: 'youtube',
        videos: [],
        area: null,
        maxVideos: 6,
        volume: 100,
        template: '<div id="SplitPlayer"></div>'
    }, settings);

    this._render();

    /* add initial declared videos */
    for (let video of this.settings.videos) {
        this.addVideo(video);
    }

    return this;
};

SplitPlayer.prototype = {

    /*
     * add Plugins
     */
    addPlugin(Plugin, settings) {
        let _instance = new Plugin(this, settings || {});
        this.plugins.push(_instance);
        return _instance;
    },

    _onVideoDependeciesReady() {
        // set loading state
        this.playerStateIs = playerState.loading;

        // call all dependencie loaded hook
        for (let video of this.videos) {
            video.ready();
        }

        console.info('api loaded');
    },

    addVideo(video) {

        // max videos check
        if (this.videos.length >= this.settings.maxVideos) {
            return console.error('video limit reached only %s allowed', this.settings.maxVideos);
        }

        // check video hoster supported
        if (!SplitPlayerVideo.hasOwnProperty(video.hoster)) {
            return console.error('video hoster %s not available', video.hoster);
        }

        var current = new SplitPlayerVideo[video.hoster](this, video);

        // load dependencies
        current.load(
            this._onVideoDependeciesReady.bind(this)
        );

        // create hoster specific video instance
        this.videos.push(
            current
        );

    },

    getVideo(videoId) {
        // get video from array
        return _.find(this.videos, function(video) {
            return video.settings.videoId === videoId;
        });
    },

    // remove all videos and player himself
    destroy() {
        for (let video of this.videos) {
            this.destroyVideo(video.settings.videoId);
        }

        for (let Plugin of this.plugins) {
            if (Plugin.destroy) {
                Plugin.destroy();
            }
        }
    },

    destroyVideo(videoId) {
        // first remove video from player list
        var video = this.removeVideo(videoId);

        // destory video
        video.destroy();
    },

    removeVideo(videoId) {

        var video = this.getVideo(videoId);

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

        if (percentage > 100) {
            percentage = 100;
        }

        else if (percentage < 0) {
            percentage = 0;
        }

        this.settings.volume = percentage;

        for (let video of this.videos) {
            video.volumeTo(percentage);
        }

    },

    getPlayedTime() {
        return 0;
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

        this.$dom = $(this.settings.area).prepend(this.settings.template);
    }

};
