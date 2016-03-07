var extend = require('extend');
var $ = require('jquery');

'use strict';

var SplitPlayerSoundTrack = function (soundManager, settings) {
    this.soundManager = soundManager;

    this.$trackList = null;

    // extend settings
    this.settings = extend({}, this.soundManager.player.settings, {
        area: null,
        template: '<label><input class="soundtrack" name="soundTracks[]" %checked% type="radio" value="%videoId%" /></label>'
    }, settings || {});

    this.mount();

    return this;
};

SplitPlayerSoundTrack.prototype = {

    mount() {
        this._render();
        this._setEvents();
    },

    // set mousemove and click event
    _setEvents() {
        if (this.trackList !== null) {
            this.$trackList
                .on('click', this.setSound.bind(this));
        }
    },

    setSound() {

        var activeVideos = this.getActive();

        var player = this.soundManager.player;
        // first mute all videos
        player.mute();

        // than activate given list
        for (var i = 0; i < activeVideos.length; i++) {

            var video = player.getVideo(activeVideos[i]);

            if (video !== false) {
                video.unMute();
            }
        }
    },

    getActive() {
        return $(this.settings.area).find('.soundtrack:checked').map(function () {
            return this.value;
        }).get();
    },

    _render() {
        if (this.settings.area === null) {
            return console.error('no dropArea for SoundTrack defined');
        }

        var template = '';

        var videos = this.soundManager.player.videos;

        for (var video of videos) {
            // replace params
            template += this.settings.template
                            .replace('%videoId%', video.settings.videoId)
                            .replace('%checked%', video.settings.isMuted ? '' : 'checked');
        }

        $(this.settings.area).append(template);
        this.$trackList = $(this.settings.area).find('.soundtrack');
    },

    destroy() {
        this.$trackList.remove();
    }
};

module.exports = SplitPlayerSoundTrack;
