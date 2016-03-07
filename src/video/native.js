'use strict';

var extend = require('extend');
var $ = require('domtastic');

const playerState = require('./../constants');

var NativeVideo = function (player, settings) {

    this.player = player;
    this.videoPlayer = null;

    this.settings = extend({
        videoId: new Date().getTime(),
        startSeconds: 0,
        videoUrl: null,
        isMuted: false
    }, settings);

    this.isMuted = this.settings.isMuted;

    return this;
};

NativeVideo.prototype = {

    loadingDependencies: true,

    load(callback) {
        callback();
    },

    mount() {
        this._render();
        this.create();
    },

    create() {},

    _render() {
        $('#SplitPlayer').append('<div id="' + this.settings.videoId + '"><video id="Video1"><source src="demo.mp4" type="video/mp4" /></video></div>');
    }
};
