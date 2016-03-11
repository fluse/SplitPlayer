'use strict';

var crosstab = require('crosstab');

module.exports = class SplitPlayerCrossTabs {

    constructor(player) {
        this.player = player;

        this.setListener();
    }

    setListener() {
        try {
            crosstab.on('splitplayer.pause', (response) => {
                console.log("trigger tab %s", response.data.triggerTab.id);
                console.log("this tab %s", crosstab.util.tabs[crosstab.id].id);

                if (response.data.triggerTab.id !== crosstab.util.tabs[crosstab.id].id) {
                    this.player.pause();
                }
            });
        } catch(e) {}
    }

    /*
     * player prePlay hook
     */
    prePlay() {
        try {
            crosstab.broadcast('splitplayer.pause', {
                triggerTab: crosstab.util.tabs[crosstab.id]
            });
        } catch(e) {}
    }

    destroy() {

    }
};
