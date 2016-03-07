var extend = require('extend');
var $ = require('jquery');

'use strict';

var SplitPlayerSoundSelector = function (player, settings) {
    this.player = player;

    this.$volume = null;

    // extend settings
    this.settings = extend({}, this.player.settings, {
        sound: {
            min: 0,
            max: 100,
            default: 100
        },
        area: null,
        template: '<input class="volume-slider" type="range" min="%min%" max="%max%" value="%default%" />'
    }, settings || {});

    this._render();
    this._setEvents();

    return this;
};

SplitPlayerSoundSelector.prototype = {

    // set mousemove and click event
    _setEvents() {
        this.$volume
            .on('change', this.setVolume.bind(this));
    },

    setVolume(event) {
        this.player.volumeTo($(event.target).val());
    },

    _render() {
        if (this.settings.area === null) {
            return console.error('no dropArea for soundManager defined');
        }

        let template = this.settings.template;

        // replace params
        for (var placeholder in this.settings.sound) {
            template = template.replace(':' + placeholder, this.settings.sound[placeholder]);
        }

        $(this.settings.area).append(template);
        this.$volume = $(this.settings.area).find('.volume-slider');
    }

};

module.exports = SplitPlayerSoundSelector;
