'use strict';

module.exports = class SplitPlayerRemember {
    constructor (player) {
        this.player = player;
        this.hash = null;

        this.generateHash();
    }

    onReady() {
        this.player.timeTo(this.getRememberedTime());
    }

    getRememberedTime() {
        if (typeof(Storage) !== 'undefined') {
            return localStorage.getItem(this.hash) || 0;
        }
        return 0;
    }

    generateHash() {
        var videos = this.player.videos;

        for (var video of videos) {
            this.hash = this.hash + video.settings.videoId + video.settings.videoUrl;
        }
    }

    onUpdate() {
        this.save();
    }

    save() {
        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem(this.hash, this.player.getPlayedTime());
        }
    }

};
