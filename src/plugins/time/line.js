/* globals $, extend */

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

    this._render();

    return this;
};

SplitPlayerTimeLine.prototype = {

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
