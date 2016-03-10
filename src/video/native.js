'use strict';

var extend = require('extend');
var $ = require('domtastic');

const playerState = require('./../constants');

module.exports = class NativeVideo {

    constructor (player, settings) {

        this.player = player;
        this.videoPlayer = null;
        this.videoState = playerState.loading;

        this.settings = extend({
            videoId: new Date().getTime().toString(),
            startSeconds: 0,
            videoUrl: null,
            isMuted: false,
            controls: 1
        }, settings);

        this.isMuted = this.settings.isMuted;
    }

    load() {}

    mount() {
        this._render();
        this.create();
    }

    create() {
        this.videoPlayer = $('#vid' + this.settings.videoId)[0];

        this.videoPlayer.addEventListener('loadeddata', this.onReady.bind(this), false);
        this.videoPlayer.addEventListener('canplaythrough', this.onStateChange.bind(this, playerState.unstarted), false);
        this.videoPlayer.addEventListener('play', this.onStateChange.bind(this, playerState.playing), false);
        this.videoPlayer.addEventListener('pause', this.onStateChange.bind(this, playerState.pause), false);

        this.videoPlayer.addEventListener('progress', function (e, a) {}, false);
    }

    onReady() {
        this.setPlayerDuration();
        if (this.settings.isMuted) {
            this.mute();
        }
        this.timeTo(0);
        this.player.onReady();
    }

    onStateChange(state) {
        return this.videoState = state;

        if (state === YT.PlayerState.BUFFERING) {
            return this.player.changeState(playerState.buffering);
        }

        if (state === YT.PlayerState.PLAYING) {
            return this.player.changeState(playerState.playing);
        }

        if (state === YT.PlayerState.PAUSED) {
            return this.player.changeState(playerState.pause);
        }

        console.info('state %s not fetched', event.data);
    }

    getDuration() {
        var duration = (this.videoPlayer.duration || 0);
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
        return this.videoPlayer.currentTime - this.settings.startSeconds;
    }

    getPlayerState() {
        return this.videoState;
    }

    play() {
        this.videoPlayer.play();
    }

    pause() {
        this.videoPlayer.pause();
    }

    mute() {
        this.isMuted = true;
        this.settings.isMuted = this.isMuted;
        this.videoPlayer.muted = this.isMuted;
        return true;
    }

    unMute() {
        this.isMuted = false;
        this.settings.isMuted = this.isMuted;
        this.videoPlayer.muted = this.isMuted;
        this.volumeTo(this.player.settings.volume);

        return true;
    }

    volumeTo(percentage) {
        if (this.isMuted) {
            return false;
        }

        // convert to native value
        var nativeValue = percentage / 100;
        console.log(nativeValue);
        this.videoPlayer.volume = nativeValue;
        return true;
    }

    timeTo(time) {

        time = (time + this.settings.startSeconds);

        if (time >= this.getDuration()) {
            this.stop();
            return console.info('time for %s out of range', this.settings.videoId);
        }

        this.videoPlayer.currentTime = time;
    }

    stop() {
        this.videoPlayer.pause();
        this.timeTo(0);
    }

    _render() {
        var html = '<div id="%id%" class="video"><video id="vid%id%" autostart="false"%controls%><source src="%url%" type="video/mp4" /></video></div>';
        var html = html
            .replace(/%id%/g, this.settings.videoId || '')
            .replace(/%url%/g, this.settings.videoUrl || '')
            .replace(/%controls%/g, this.settings.controls > 0 ? ' controls="controls"' : '');

        $('#SplitPlayer').append(html);
    }
}
