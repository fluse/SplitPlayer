module.exports = class Ticker {

    constructor(callback, interval) {
        this.isActive = false;
        this.cycler = null;

        this.callback = callback || null;
        this.interval = interval || 1000;
    }

    start () {
        this.isActive = true;
        this.do();
    }

    do () {

        if (!this.isActive) {
            return false;
        }

        if (this.callback !== null) {
            this.callback();

            this.cycler = setTimeout(this.do.bind(this), this.interval);
        }
    }

    stop () {
        this.isActive = false;

        clearTimeout(this.cycler);
    }
};
