/* globals $ */

var extend = require('extend');
var $ = require('jquery');

'use strict';

var SplitPlayerTimeLine = function (timeManager, settings) {
    this.timeManager = timeManager;

    // register timeline inside timeManager
    this.timeManager.timeline = null;

    this.$bar = null;

    // extend settings
    this.settings = extend({}, this.timeManager.settings, {
        template: '<div id="timeline"><i class="bar"></i></div>'
    }, settings);

    this.mount();

    return this;
};

SplitPlayerTimeLine.prototype = {

    mount() {
        this._render();
    },

    /*
     * player onReady hook
     */
    onReady() {
        this.isActive = true;
    },

    /*
     * player onStop hook
     */
    onStop() {
        this._reset();
    },

    /*
     * timeManager onSetTo hook
     */
    onSetTo(data) {
        this.setTo(data);
    },

    setTo(data) {
        this.$bar.css({
            width: data.percentage + '%'
        });
    },

    _reset() {
        this.$bar.css({
            width: 0
        });
    },

    _render() {
        let dom = $(this.settings.area).append(this.settings.template);

        this.timeManager.$timeline = dom.find('#timeline');
        this.$bar = this.timeManager.$timeline .find('i');
    },

    destroy() {
        this.timeManager.$timeline.remove();
    }
};

module.exports = SplitPlayerTimeLine;
