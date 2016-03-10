var extend = require('extend');
var $ = require('domtastic');

'use strict';

var Fullscreen = function (player, settings) {

    this.player = player;

    this.isFullscreen = false;

    this.settings = extend({}, {
        area: player.settings.area,
        onLaunch: function () {},
        onExit: function () {}
    }, settings);

    this.setListener();

    this.extendPlayer();

    return this;
};

Fullscreen.prototype = {

    extendPlayer() {
        this.player.fullscreen = this;
    },

    setListener() {
        let docEvLi = document.addEventListener;
        docEvLi('webkitfullscreenchange', this.exit.bind(this), false);
        docEvLi('mozfullscreenchange', this.exit.bind(this), false);
        docEvLi('fullscreenchange', this.exit.bind(this), false);
        docEvLi('MSFullscreenChange', this.exit.bind(this), false);
    },

    toggle() {
        if (this.isFullscreen) {
            this.exit();
        } else {
            this.launch();
        }
    },

    launch() {
        if (this.settings.area === null) {
            return false;
        }

        let element = $(this.settings.area)[0];

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }

        this.settings.onLaunch();

        window.setTimeout(() => {
            this.isFullscreen = true;
        }, 600);

    },

    exit() {

        if (this.isFullscreen) {

            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }

            this.settings.onExit();

            this.isFullscreen = false;
        }
    }

};

module.exports = Fullscreen;
