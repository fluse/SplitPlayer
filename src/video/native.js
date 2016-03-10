'use strict';

var extend = require('extend');
var $ = require('domtastic');

var videoSkeleton = require('./skeleton.js');
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

NativeVideo.prototype = extend({}, videoSkeleton, {

    mount() {
        this._render();
        this.create();
    },

    create() {
        this.videoPlayer = $('#vid' + this.settings.videoId)[0];
        console.log(this.videoPlayer);

        this.videoPlayer.addEventListener('loadeddata', this.onReady.bind(this), false);
    },

    onReady() {
        this.setPlayerDuration();
        if (this.settings.isMuted) {
            this.mute();
        }
        this.timeTo(0);
        this.player.onReady();
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
        console.log('unmuted');
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
        console.log(nativeValue);
        this.videoPlayer.volume = nativeValue;
        return true;
    },

    timeTo(time) {

        time = (time + this.settings.startSeconds);

        if (time >= this.getDuration()) {
            this.stop();
            return console.info('time for %s out of range', this.settings.videoId);
        }

        this.videoPlayer.currentTime = time;
    },

    stop() {
        this.videoPlayer.pause();
        this.timeTo(0);
    },

    _render() {
        $('#SplitPlayer').append('<div id="' + this.settings.videoId + '" class="video"><video id="vid' + this.settings.videoId + '"><source src="' + this.settings.videoUrl + '" type="video/mp4" /></video></div>');
    }
});

module.exports = NativeVideo;
