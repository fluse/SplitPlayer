/* globals $ */

var extend = require('extend');
var $ = require('jquery');

'use strict';

var SplitPlayerSoundManager = function (player, settings) {
    this.player = player;

    this.$volume = null;

    this.plugins = [];

    // extend settings
    this.settings = extend(true, {}, this.player.settings, {
        sound: {
            min: 0,
            max: 100,
            default: 100
        },
        area: null,
        template: '<input class="volume-slider" type="range" min="%min%" max="%max%" value="%default%" />'
    }, settings || {});

    this.mount();

    return this;
};

SplitPlayerSoundManager.prototype = {

    /*
     * extend Module
     */
    extend(Module, settings) {
        Module = new Module(this, settings || {});

        // push internal
        this.plugins.push(Module);

        // push to player plugins for other hooks
        return this.player.plugins.push(Module);
    },

    onUpdate() {
        
    },

    mount() {
        this._render();
        this._setEvents();
    },

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

        var template = this.settings.template;

        // replace params
        for (var placeholder in this.settings.sound) {
            template = template.replace('%' + placeholder + '%', this.settings.sound[placeholder]);
        }

        $(this.settings.area).append(template);
        this.$volume = $(this.settings.area).find('.volume-slider');
    },

    destroy() {
        this.$volume.remove();
    }

};

module.exports = SplitPlayerSoundManager;
