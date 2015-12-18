var Ticker = function (callback, interval) {
    this.isActive = false;
    this.cycler = null;

    this.callback = callback;
    this.interval = interval;

};

Ticker.prototype = {

    start () {
        this.isActive = true;
        this.do();
    },

    do () {

        if (!this.isActive) {
            return false;
        }

        this.callback();

        this.cycler = window.setTimeout(this.do.bind(this), this.interval);
    },

    stop () {
        this.isActive = false;

        clearTimeout(this.cycler);
    }
};
