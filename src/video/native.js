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

    },

    mount() {
        this._render();
        this.create();
    },

    create() {
        this.videoPlayer = $('#vid' + this.settings.videoId)[0];
        console.log(this.videoPlayer);
    },

    getDuration() {
        var duration = (this.videoPlayer.duration || 0);
        return (duration - this.settings.startSeconds);
    },

    setPlayerDuration() {
        let _duration = this.getDuration();

        if (this.player.duration < _duration) {
            this.player.duration = _duration;
            this.player.getPlayedTime = this.getPlayedTime.bind(this);
        }
    },

    getPlayedTime() {
        return this.videoPlayer.currentTime - this.settings.startSeconds;
    },

    getPlayerState() {
        return null;
    },

    play() {
        this.videoPlayer.play();
    },

    pause() {
        this.videoPlayer.pause();
    },

    mute() {
        this.isMuted = true;
        this.settings.isMuted = this.isMuted;
        this.videoPlayer.muted = this.isMuted;
        return true;
    },

    unMute() {
        this.isMuted = false;
        this.settings.isMuted = this.isMuted;
        this.videoPlayer.muted = this.isMuted;
        this.volumeTo(this.player.settings.volume);

        return true;
    },

    volumeTo(percentage) {
        if (this.isMuted) {
            return false;
        }

        // convert to native value
        var nativeValue = percentage / 100;
        this.videoPlayer.volume = nativeValue;
        return true;
    },

    stop() {
        this.videoPlayer.stop();
    },

    _render() {
        $('#SplitPlayer').append('<div id="' + this.settings.videoId + '" class="video"><video id="vid' + this.settings.videoId + '"><source src="' + this.settings.videoUrl + '" type="video/mp4" /></video></div>');
    }
};

module.exports = NativeVideo;
