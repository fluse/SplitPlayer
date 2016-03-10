'use strict';

var extend = require('extend');
var getScript = require('./../helper/getScript.js');
var $ = require('domtastic');

const playerState = require('./../constants');

module.exports = class YoutubeVideo {

    constructor(player, settings) {

        this.loadingDependencies = false;
        this.player = player;
        this.videoPlayer = null;

        this.settings = extend({
            videoId: null,
            startSeconds: 0,
            isHidden: false,
            isMuted: false,
            controls: 1
        }, settings);

        this.isMuted = this.settings.isMuted;
    }

    load(callback) {

        if (this.loadingDependencies) {
            return;
        }

        this.loadingDependencies = true;

        getScript('//youtube.com/iframe_api', function () {
            window.onYouTubeIframeAPIReady = callback;
        });
    }

    mount() {
        this._render();
        this.create();
    }

    create() {

        this.videoPlayer = new YT.Player('replacer' + this.settings.videoId, {
            width: '100%',
            height: '100%',
            videoId: this.settings.videoId,
            startSeconds: this.settings.startSeconds,
            playerVars: {
                controls: this.settings.controls
            },
            events: {
                onReady: this.onReady.bind(this),
                onStateChange: this.onStateChange.bind(this),
                onError: this.onError.bind(this)
            }
        });
    }

    onReady() {
        this.setPlayerDuration();

        if (this.settings.isMuted) {
            this.mute();
        }
        this.timeTo(0);
        this.player.onReady();
    }

    onError(err) {

        var code = err.data;
        if (code === 100 || code === 150) {
            console.error('Video %s Not Found', this.settings.videoId);
        }

        this.noVideo();
    }

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
    }

    hide() {
        if (this.settings.isHidden) {
            return false;
        }

        $('#' + this.settings.videoId).hide();
        this.settings.isHidden = true;
    }

    show() {
        if (!this.settings.isHidden) {
            return false;
        }

        $('#' + this.settings.videoId).show();

        this.settings.isHidden = false;
    }

    getPlayerState() {
        return this.videoPlayer.getPlayerState();
    }

    remove() {
        this.videoPlayer.destroy();
    }

    timeTo(time) {

        time = (time + this.settings.startSeconds);

        if (time >= this.getDuration()) {
            this.videoPlayer.stopVideo();
            return console.info('time for %s out of range', this.settings.videoId);
        }

        this.videoPlayer.seekTo(time);
    }

    volumeTo(percentage) {
        if (this.isMuted) {
            return false;
        }

        this.videoPlayer.setVolume(percentage);
        return true;
    }

    mute() {
        this.videoPlayer.mute();
        this.isMuted = true;
        this.settings.isMuted = this.isMuted;

        return true;
    }

    unMute() {
        this.isMuted = false;
        this.settings.isMuted = this.isMuted;
        this.videoPlayer.unMute();
        this.volumeTo(this.player.settings.volume);

        return true;
    }

    play() {
        this.videoPlayer.playVideo();
    }

    pause() {
        this.videoPlayer.pauseVideo();
    }

    stop() {
        this.timeTo(0);
        this.pause();
    }

    getDuration() {
        var duration = (this.videoPlayer.getDuration() || 0);
        return (duration - this.settings.startSeconds);
    }

    setPlayerDuration() {
        let _duration = this.getDuration();

        if (this.player.duration < _duration) {
            this.player.duration = _duration;
            this.player.getPlayedTime = this.getPlayedTime.bind(this);
        }
    }

    getPlayedTime() {
        return this.videoPlayer.getCurrentTime() - this.settings.startSeconds;
    }

    _render() {
        $('#SplitPlayer').append('<div id="' + this.settings.videoId + '"><div id="replacer' + this.settings.videoId + '"><div></div>');
    }

    noVideo() {
        this.player.removeVideo(this.settings.videoId);
        $('#' + this.settings.videoId).html('<div class="no-video"></div>');
    }

    destroy() {
        // remove youtube video iframe
        $('#' + this.settings.videoId).remove();

        return true;
    }

}
