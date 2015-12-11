/* globals playerState, YT, $ */
'use strict';

var SplitPlayerVideo = SplitPlayerVideo || {};

SplitPlayerVideo.youtube = function (player, settings) {

    this.player = player;
    this.videoPlayer = null;

    this.isSilent = false;

    this.settings = $.extend({
        video: null,
        type: 'youtube'
    }, settings);

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

        this.videoPlayer = new YT.Player(this.settings.video.videoId, {
            width: '100%',
            height: '100%',
            videoId: this.settings.video.videoId,
            startSeconds: this.settings.video.startSeconds,
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
        this.stop();
        this.player.onReady();
    },

    onStateChange(event) {

        if (this.isSilence) {
            return;
        }
        console.log(event.data);

        if (event.data === YT.PlayerState.BUFFERING) {
            return this.player.changeState(playerState.buffering);
        }

        if (event.data === YT.PlayerState.PLAYING) {
            return this.player.changeState(playerState.playing);
        }

        if (event.data === YT.PlayerState.ENDED) {
            this.timeTo(0);
            return this.player.changeState(event.data);
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
        this.player.removeVideo(this.settings.video);
        this.videoPlayer.destroy();
    },

    timeTo(time) {
        debugger;

        if (this.getDuration() === 0) {
            this.isSilent = true;
            this.stop();
            this.isSilent = false;
            return;
        }

        if (time >= this.getDuration()) {
            this.videoPlayer.seekTo(0);
            return console.info('time for %s out of range', this.settings.video.videoId);
        }

        time = (time + this.settings.video.startSeconds);

        console.log('set time to %s', time);

        this.videoPlayer.seekTo(time);
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
        return this.videoPlayer.getDuration() - this.settings.video.startSeconds;
    },

    setPlayerDuration() {
        let _duration = this.getDuration();

        if (this.player.duration < _duration) {
            this.player.duration = _duration;
            this.player.getPlayedTime = this.getPlayedTime.bind(this);
        }
    },

    getPlayedTime() {
        return this.videoPlayer.getCurrentTime() - this.settings.video.startSeconds;
    },

    render() {
        $('#SplitPlayer').append('<div id="' + this.settings.video.videoId + '"><div>');
    },

    destroy() {
        // remove youtube video iframe
        $('#' + this.settings.video.videoId).find('iframe').remove();
    }

};
