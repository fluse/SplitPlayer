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
