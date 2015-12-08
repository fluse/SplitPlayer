/* globals YT, $ */
'use strict';

var SplitPlayerVideo = SplitPlayerVideo || {};

SplitPlayerVideo.youtube = function (player, settings) {

    this.player = player;
    this.videoPlayer = null;

    this.settings = $.extend({
        video: null,
        type: 'youtube'
    }, settings);

    this.render();
    this.create();

    return this;
};

SplitPlayerVideo.youtube.prototype = {

    load(callback) {
        $.getScript('https://www.youtube.com/iframe_api', function () {
            onYouTubeIframeAPIReady = function () {
                callback();
            };
        });
    },

    create() {
        this.videoPlayer = new YT.Player('player' + this.settings.video.videoId, {
            width: '100%',
            height: '100%',
            videoId: this.settings.video.videoId,
            playerVars: {
                'controls': (this.settings.active ? 1 : 0)
            },
            events: {
                onReady: this.onReady.bind(this),
                onStateChange: this.onStateChange.bind(this)
            }
        });
    },

    onReady() {

        this.timeTo(0);
        this.pause();

        this.player.onReady();
    },

    onStateChange(event) {
        switch (event.data) {
            case YT.PlayerState.PLAYING:
                this.player.play();
                break;
            case YT.PlayerState.PAUSED:
                this.player.pause();
                break;
        }
    },

    remove() {
        this.player.removeVideo(this.settings.video);
        this.videoPlayer.destroy();
    },

    timeTo(time) {
        this.videoPlayer.seekTo(time + this.settings.video.startSeconds);
    },

    play() {
        this.videoPlayer.playVideo();
    },

    pause() {
        this.videoPlayer.pauseVideo();
    },

    getDuration() {
        this.videoPlayer.getDuration();
    },

    render() {
        $('#SplitPlayer').append('<div id="' + this.settings.video.videoId + '"><div>');
    }

};
