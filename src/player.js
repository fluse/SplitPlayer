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
    this.dependenciesLoaded = false;

    this.settings = $.extend({
        hoster: 'youtube',
        videos: [],
        area: null,
        maxVideos: 4
    }, settings) ;

    this.loadVideoDependencies();

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
        var instance = new Plugin(this);
        this.plugins.push(instance);
        return instance;
    },

    /*
     * Load Video Dependecnies like youtubeIframeApi
     */
    loadVideoDependencies() {

        SplitPlayerVideo[this.settings.hoster].load(
            this.onVideoDependeciesReady.bind(this)
        );

    },

    /*
     * Load add Videos after Dependecnies Loaded
     */
    onVideoDependeciesReady() {

        this.dependenciesLoaded = true;

        this.render();

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

    removeVideo(video) {

        _.findWhere(this.videos, video).remove();

        this.videos = _.without(
            this.videos,
            _.findWhere(this.videos, video)
        );

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

        // prevent play if videos not ready
        if (this.readyCount !== this.videos.length) {
            return console.info('play not ready yet');
        }

        // abort if is playing allready
        if (this.playerStateIs === playerState.playing) {
            return console.info('allready playing');
        }

        // start ticker
        this.ticker = window.setInterval(this.onUpdate.bind(this), 200);

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
            return console.log('pause not ready yet');
        }

        // abort if player not playing state
        if (this.playerStateIs === playerState.pause) {
            return console.log('allready pausing');
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

    stop() {
        // abort if not all videos ready
        if (this.readyCount !== this.videos.length) {
            return console.log('pause not ready yet');
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

    render() {
        if (this.settings.area === null) {
            return console.log('no html parent defined');
        }

        $(this.settings.area).html('<div id="SplitPlayer"></div>');

    }

};
