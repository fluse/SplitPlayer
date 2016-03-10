'use strict';

/* Dependencies */
var $ = require('domtastic');
var extend = require('extend');
var _ = require('underscore');

var Ticker = require('./helper/ticker');
var SplitPlayerVideo = require('./video/');
var SplitPlayerPlugins = require('./plugins/');

const playerState = require('./constants.js');

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

    // ticker for onUpdate interval on 0.1 seconds
    this.ticker = new Ticker(this.onUpdate.bind(this), 100);

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

    this.mount();

    return this;
};

SplitPlayer.prototype = {

    mount() {
        this.create();

        for (let Plugin of this.plugins) {
            if (Plugin.mount) {
                Plugin.mount();
            }
        }
    },

    create() {
        this._render();
        this.addVideos(this.settings.videos);
    },

    /*
     * add Plugins
     */
    addPlugin(Plugin, settings) {
        let _instance = new Plugin(this, settings || {});
        this.plugins.push(_instance);
        return _instance;
    },

    _onVideoDependeciesReady() {
        // set loading state
        this.playerStateIs = playerState.loading;

        // call hook, all dependencies loaded
        for (let video of this.videos) {
            video.mount();
        }
        this._dependenciesLoaded = true;

        console.info('api loaded');
    },

    addVideos(videos) {

        // iterate
        for (let video of videos) {

            // trigger add
            var addedVideo = this.addVideo(video);

            // if added and all dependencies loaded, mount video
            if (addedVideo !== false && this._dependenciesLoaded) {
                addedVideo.mount();
            }
        }

        return this;
    },

    addVideo(video) {

        // duplicate video check
        if (this.getVideo(video.videoId) !== false) {
            console.error('video %s allready added', video.videoId);
            return false;
        }

        // max videos check
        if (this.videos.length >= this.settings.maxVideos) {
            console.error('video limit reached only %s allowed', this.settings.maxVideos);
            return false;
        }

        // video hoster supported check
        if (!SplitPlayerVideo.hasOwnProperty(video.hoster)) {
            console.error('video hoster %s not available', video.hoster);
            return false;
        }

        // create video instance
        var current = new SplitPlayerVideo[video.hoster](this, video);

        // load dependencies
        current.load(
            this._onVideoDependeciesReady.bind(this)
        );

        // create hoster specific video instance
        this.videos.push(
            current
        );

        return current;
    },

    getVideo(videoId) {
        // get video from array
        var result = _.find(this.videos, function(video) {
            return video.settings.videoId === videoId;
        });

        return result || false;
    },

    // destroy all videos and player himself
    destroy() {
        for (let video of this.videos) {
            this.destroyVideo(video.settings.videoId);
        }

        this.duration = 0;

        for (let Plugin of this.plugins) {
            if (Plugin.destroy) {
                Plugin.destroy();
            }
        }

        this.$dom.remove();
    },

    destroyVideo(videoId) {
        // first remove video from player list
        var video = this.getVideo(videoId);

        if (!video) {
            return false;
        }

        // destory video
        video.destroy();

        this.removeVideo(videoId)

        return true;
    },

    empty() {
        this.duration = 0;
        this.stop();

        for (let video of this.videos) {
            this.destroyVideo(video.settings.videoId);
        }
    },

    removeVideos(videoIdArray) {
        for (var videoId of videoIdArray) {
            this.removeVideo(videoId);
        }
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
        for (let current of this.videos) {
            current.setPlayerDuration();
        }

        // and set readyCount one lower;
        this.readyCount--;

        video = null;
        return true;
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
            // pause causes trouble here
            // return this.pause();
        }

        if (state === playerState.pause) {
            return this.pause();
        }

        if (state === playerState.playing) {
            return this.play();
        }

    },

    getPlayedTime() {
        let times = this.videos.map(v => v.getPlayedTime());
        return Math.max(...times);
    },

    play() {

        // start ticker
        this.ticker.start();

        for (let video of this.videos) {
            if (video.getDuration() >= this.getPlayedTime()) {
                video.play();
            }
        }

        // hook onPlay for plugins
        for (let Plugin of this.plugins) {
            if (Plugin.onPlay) {
                Plugin.onPlay();
            }
        }

        this.playerStateIs = playerState.playing;

        return this;
    },

    pause() {

        // stop ticker
        this.ticker.stop();

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

        return this;
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
        this.ticker.stop();

        // abort if player not in playing state
        if (this.playerStateIs !== playerState.pause && this.playerStateIs !== playerState.playing) {
            return;
        }

        // pause all videos
        for (let video of this.videos) {
            if (video.getPlayerState() !== 0) {
                video.stop();
            }
        }

        // hook all plugins
        for (let Plugin of this.plugins) {
            if (Plugin.onStop) {
                Plugin.onStop();
            }
        }

        this.playerStateIs = playerState.unstarted;

        return this;
    },

    timeTo(time) {
        for (let video of this.videos) {
            video.timeTo(time);
        }
        return this;
    },

    mute() {
        for (let video of this.videos) {
            video.mute();
        }

        // hook all plugins
        for (let Plugin of this.plugins) {
            if (Plugin.onMute) {
                Plugin.onMute();
            }
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

        // hook all plugins
        for (let Plugin of this.plugins) {
            if (Plugin.onVolumeChange) {
                Plugin.onVolumeChange(percentage);
            }
        }

        return this;
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
            return console.info('no html parent defined');
        }

        if ($('#SplitPlayer').length > 0) {
            return console.info('player allready exist');
        }

        $(this.settings.area).prepend(this.settings.template);
        this.$dom = $('#SplitPlayer');
    }

};

if (typeof window !== 'undefined') {
    window.SplitPlayer = SplitPlayer;
}

module.exports = SplitPlayer;
