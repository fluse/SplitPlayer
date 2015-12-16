/* globals playerState, YT, $ */
'use strict';

var SplitPlayerVideo = SplitPlayerVideo || {};

SplitPlayerVideo.youtube = function (player, settings) {

    this.player = player;
    this.videoPlayer = null;

    this.settings = $.extend({
        videoId: null,
        startSeconds: 0,
        isMuted: false
    }, settings);

    this.isMuted = this.settings.isMuted;

    this.render();
    this.create();

    return this;
};

SplitPlayerVideo.youtube.load = function (callback) {
    $.getScript('//youtube.com/iframe_api', function () {
        window.onYouTubeIframeAPIReady = callback;
    });
};

SplitPlayerVideo.youtube.prototype = {

    create() {

        this.videoPlayer = new YT.Player(this.settings.videoId, {
            width: '100%',
            height: '100%',
            videoId: this.settings.videoId,
            startSeconds: this.settings.startSeconds,
            playerVars: {
                'controls': 1
            },
            events: {
                onReady: this.onReady.bind(this),
                onStateChange: this.onStateChange.bind(this)
            }
        });
    },

    onReady() {
        this.setPlayerDuration();
        this.mute();
        this.player.onReady();
    },

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
    },

    getPlayerState() {
        return this.videoPlayer.getPlayerState();
    },

    remove() {
        this.videoPlayer.destroy();
    },

    timeTo(time) {

        if (this.getDuration() === 0) {
            this.stop();
            return;
        }

        if (time >= this.getDuration()) {
            this.videoPlayer.seekTo(0);
            return console.info('time for %s out of range', this.settings.videoId);
        }

        time = (time + this.settings.startSeconds);

        console.log('set time to %s', time);

        this.videoPlayer.seekTo(time);
    },

    volumeTo(percentage) {
        if (this.isMuted) {
            return false;
        }

        this.videoPlayer.setVolume(percentage);
        return true;
    },

    mute() {
        if (!this.isMuted) {
            return false;
        }

        this.videoPlayer.mute();
        this.isMuted = true;
        return true;
    },

    unMute() {
        if (!this.isMuted) {
            return false;
        }

        this.isMuted = false;
        this.volumeTo(this.player.settings.volume);

        return true;
    },

    play() {
        this.videoPlayer.playVideo();
    },

    pause() {
        this.videoPlayer.pauseVideo();
    },

    stop() {
        this.timeTo(0);
        this.pause();
    },

    getDuration() {
        return this.videoPlayer.getDuration() - this.settings.startSeconds;
    },

    setPlayerDuration() {
        let _duration = this.getDuration();

        if (this.player.duration < _duration) {
            this.player.duration = _duration;
            this.player.getPlayedTime = this.getPlayedTime.bind(this);
        }
    },

    getPlayedTime() {
        return this.videoPlayer.getCurrentTime() - this.settings.startSeconds;
    },

    render() {
        $('#SplitPlayer').append('<div id="' + this.settings.videoId + '"><div>');
    },

    destroy() {
        // remove youtube video iframe
        $('#' + this.settings.videoId).find('iframe').remove();
    }

};
