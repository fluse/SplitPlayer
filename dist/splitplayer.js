/* splitplayer 1.0.3 - http://www.splitplay.tv - copyright Holger Schauf */
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var extend = function extend(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i]) continue;

        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key];
        }
    }

    return out;
};

var youtubeLinkParse = function youtubeLinkParse(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length === 11) {
        return match[2];
    } else {
        return url;
    }
};

var Ticker = function Ticker(callback, interval) {
    this.isActive = false;
    this.cycler = null;

    this.callback = callback;
    this.interval = interval;
};

Ticker.prototype = {

    start: function start() {
        this.isActive = true;
        this['do']();
    },

    'do': function _do() {

        if (!this.isActive) {
            return false;
        }

        this.callback();

        this.cycler = window.setTimeout(this['do'].bind(this), this.interval);
    },

    stop: function stop() {
        this.isActive = false;

        clearTimeout(this.cycler);
    }
};

/* globals _, extend, Ticker, SplitPlayerVideo */

'use strict';

// player state constants
var playerState = {
    unstarted: -1,
    ended: 0,
    playing: 1,
    pause: 2,
    buffering: 3,
    loading: 6
};

var SplitPlayer = function SplitPlayer(settings) {

    this.duration = 0;

    this.readyCount = 0;

    this.$dom = null;

    // video instances container
    this.videos = [];

    // plugin instances container
    this.plugins = [];

    // global player state
    this.playerStateIs = playerState.inactive;

    // ticker for onUpdate interval on 0.1 seconds
    this.ticker = new Ticker(this.onUpdate.bind(this), 100);

    // dependencie loading status
    this._dependenciesLoaded = false;

    this.settings = extend({
        hoster: 'youtube',
        videos: [],
        area: null,
        maxVideos: 6,
        volume: 100,
        template: '<div id="SplitPlayer"></div>'
    }, settings);

    this.mount();

    return this;
};

SplitPlayer.prototype = {

    mount: function mount() {
        this.create();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var Plugin = _step.value;

                if (Plugin.mount) {
                    Plugin.mount();
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    },

    create: function create() {
        this._render();
        this.addVideos(this.settings.videos);
    },

    /*
     * add Plugins
     */
    addPlugin: function addPlugin(Plugin, settings) {
        var _instance = new Plugin(this, settings || {});
        this.plugins.push(_instance);
        return _instance;
    },

    _onVideoDependeciesReady: function _onVideoDependeciesReady() {
        // set loading state
        this.playerStateIs = playerState.loading;

        // call all dependencie loaded hook
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = this.videos[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var video = _step2.value;

                video.mount();
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                    _iterator2['return']();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        this._dependenciesLoaded = true;

        console.info('api loaded');
    },

    addVideos: function addVideos(videos) {

        // iterate
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = videos[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var video = _step3.value;

                // trigger add
                var addedVideo = this.addVideo(video);

                // if added and all dependencies loaded, mount video
                if (addedVideo !== false && this._dependenciesLoaded) {
                    addedVideo.mount();
                }
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                    _iterator3['return']();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        return this;
    },

    addVideo: function addVideo(video) {

        // duplicate video check
        if (this.getVideo(video.videoId) !== false) {
            console.error('video %s allready added', video.videoId);
            return false;
        }

        // max videos check
        if (this.videos.length >= this.settings.maxVideos) {
            console.error('video limit reached only %s allowed', this.settings.maxVideos);
            return false;
        }

        // video hoster supported check
        if (!SplitPlayerVideo.hasOwnProperty(video.hoster)) {
            console.error('video hoster %s not available', video.hoster);
            return false;
        }

        // create video instance
        var current = new SplitPlayerVideo[video.hoster](this, video);

        // load dependencies
        current.load(this._onVideoDependeciesReady.bind(this));

        // create hoster specific video instance
        this.videos.push(current);

        return current;
    },

    getVideo: function getVideo(videoId) {
        // get video from array
        var result = _.find(this.videos, function (video) {
            return video.settings.videoId === videoId;
        });

        return result || false;
    },

    // destroy all videos and player himself
    destroy: function destroy() {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = this.videos[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var video = _step4.value;

                this.destroyVideo(video.settings.videoId);
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                    _iterator4['return']();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        this.duration = 0;

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = this.plugins[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var Plugin = _step5.value;

                if (Plugin.destroy) {
                    Plugin.destroy();
                }
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                    _iterator5['return']();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }

        this.$dom.remove();
    },

    destroyVideo: function destroyVideo(videoId) {
        // first remove video from player list
        var video = this.removeVideo(videoId);

        // destory video
        video.destroy();
    },

    empty: function empty() {
        this.duration = 0;
        this.stop();

        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = this.videos[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var video = _step6.value;

                this.destroyVideo(video.settings.videoId);
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                    _iterator6['return']();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }
    },

    removeVideo: function removeVideo(videoId) {

        var video = this.getVideo(videoId);

        // if there is a video
        if (!video) {
            return false;
        }

        // remove it from array
        this.videos = _.without(this.videos, video);

        // reinit playerDuration
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            for (var _iterator7 = this.videos[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var thisVideo = _step7.value;

                thisVideo.setPlayerDuration();
            }

            // and set readyCount one lower;
        } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion7 && _iterator7['return']) {
                    _iterator7['return']();
                }
            } finally {
                if (_didIteratorError7) {
                    throw _iteratorError7;
                }
            }
        }

        this.readyCount--;

        return video;
    },

    /*
     * called after all video player ready initialized
     */
    onReady: function onReady() {

        this.readyCount++;

        // prevent if not all videos ready
        if (this.readyCount !== this.videos.length) {
            return console.info('videos not ready yet');
        }
        this.play();
        this.pause();
        this.playerStateIs = playerState.ready;

        // hook onReady for plugins
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
            for (var _iterator8 = this.plugins[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var Plugin = _step8.value;

                if (Plugin.onReady) {
                    Plugin.onReady();
                }
            }
        } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion8 && _iterator8['return']) {
                    _iterator8['return']();
                }
            } finally {
                if (_didIteratorError8) {
                    throw _iteratorError8;
                }
            }
        }
    },

    onUpdate: function onUpdate() {
        // hook all plugins
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
            for (var _iterator9 = this.plugins[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var Plugin = _step9.value;

                if (Plugin.onUpdate) {
                    Plugin.onUpdate();
                }
            }
        } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion9 && _iterator9['return']) {
                    _iterator9['return']();
                }
            } finally {
                if (_didIteratorError9) {
                    throw _iteratorError9;
                }
            }
        }
    },

    changeState: function changeState(state) {

        if (state === playerState.buffering) {
            // pause causes trouble here
            // return this.pause();
        }

        if (state === playerState.pause) {
            return this.pause();
        }

        if (state === playerState.playing) {
            return this.play();
        }
    },

    getPlayedTime: function getPlayedTime() {
        var times = this.videos.map(function (v) {
            return v.getPlayedTime();
        });
        return Math.max.apply(Math, _toConsumableArray(times));
    },

    play: function play() {

        // start ticker
        this.ticker.start();

        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
            for (var _iterator10 = this.videos[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var video = _step10.value;

                if (video.getDuration() >= this.getPlayedTime()) {
                    video.play();
                }
            }

            // hook onPlay for plugins
        } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion10 && _iterator10['return']) {
                    _iterator10['return']();
                }
            } finally {
                if (_didIteratorError10) {
                    throw _iteratorError10;
                }
            }
        }

        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
            for (var _iterator11 = this.plugins[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                var Plugin = _step11.value;

                if (Plugin.onPlay) {
                    Plugin.onPlay();
                }
            }
        } catch (err) {
            _didIteratorError11 = true;
            _iteratorError11 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion11 && _iterator11['return']) {
                    _iterator11['return']();
                }
            } finally {
                if (_didIteratorError11) {
                    throw _iteratorError11;
                }
            }
        }

        this.playerStateIs = playerState.playing;

        return this;
    },

    pause: function pause() {

        // stop ticker
        this.ticker.stop();

        // abort if player not playing state
        if (this.playerStateIs === playerState.pause) {
            return console.info('allready pausing');
        }

        // pause all videos
        var _iteratorNormalCompletion12 = true;
        var _didIteratorError12 = false;
        var _iteratorError12 = undefined;

        try {
            for (var _iterator12 = this.videos[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                var video = _step12.value;

                video.pause();
            }

            // hook all plugins
        } catch (err) {
            _didIteratorError12 = true;
            _iteratorError12 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion12 && _iterator12['return']) {
                    _iterator12['return']();
                }
            } finally {
                if (_didIteratorError12) {
                    throw _iteratorError12;
                }
            }
        }

        var _iteratorNormalCompletion13 = true;
        var _didIteratorError13 = false;
        var _iteratorError13 = undefined;

        try {
            for (var _iterator13 = this.plugins[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                var Plugin = _step13.value;

                if (Plugin.onPause) {
                    Plugin.onPause();
                }
            }
        } catch (err) {
            _didIteratorError13 = true;
            _iteratorError13 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion13 && _iterator13['return']) {
                    _iterator13['return']();
                }
            } finally {
                if (_didIteratorError13) {
                    throw _iteratorError13;
                }
            }
        }

        this.playerStateIs = playerState.pause;

        return this;
    },

    /*
     * Toggle Video from play to pause vice versa
     */
    toggle: function toggle() {
        if (this.playerStateIs === playerState.pause) {
            return this.play();
        }
        return this.pause();
    },

    stop: function stop() {

        // stop ticker
        this.ticker.stop();

        // abort if player not in playing state
        if (this.playerStateIs !== playerState.pause && this.playerStateIs !== playerState.playing) {
            return;
        }

        // pause all videos
        var _iteratorNormalCompletion14 = true;
        var _didIteratorError14 = false;
        var _iteratorError14 = undefined;

        try {
            for (var _iterator14 = this.videos[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                var video = _step14.value;

                if (video.getPlayerState() !== 0) {
                    video.stop();
                }
            }

            // hook all plugins
        } catch (err) {
            _didIteratorError14 = true;
            _iteratorError14 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion14 && _iterator14['return']) {
                    _iterator14['return']();
                }
            } finally {
                if (_didIteratorError14) {
                    throw _iteratorError14;
                }
            }
        }

        var _iteratorNormalCompletion15 = true;
        var _didIteratorError15 = false;
        var _iteratorError15 = undefined;

        try {
            for (var _iterator15 = this.plugins[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                var Plugin = _step15.value;

                if (Plugin.onStop) {
                    Plugin.onStop();
                }
            }
        } catch (err) {
            _didIteratorError15 = true;
            _iteratorError15 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion15 && _iterator15['return']) {
                    _iterator15['return']();
                }
            } finally {
                if (_didIteratorError15) {
                    throw _iteratorError15;
                }
            }
        }

        this.playerStateIs = playerState.unstarted;

        return this;
    },

    timeTo: function timeTo(time) {
        var _iteratorNormalCompletion16 = true;
        var _didIteratorError16 = false;
        var _iteratorError16 = undefined;

        try {
            for (var _iterator16 = this.videos[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                var video = _step16.value;

                video.timeTo(time);
            }
        } catch (err) {
            _didIteratorError16 = true;
            _iteratorError16 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion16 && _iterator16['return']) {
                    _iterator16['return']();
                }
            } finally {
                if (_didIteratorError16) {
                    throw _iteratorError16;
                }
            }
        }

        return this;
    },

    mute: function mute() {
        var _iteratorNormalCompletion17 = true;
        var _didIteratorError17 = false;
        var _iteratorError17 = undefined;

        try {
            for (var _iterator17 = this.videos[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                var video = _step17.value;

                video.mute();
            }
        } catch (err) {
            _didIteratorError17 = true;
            _iteratorError17 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion17 && _iterator17['return']) {
                    _iterator17['return']();
                }
            } finally {
                if (_didIteratorError17) {
                    throw _iteratorError17;
                }
            }
        }
    },

    volumeTo: function volumeTo(percentage) {

        if (percentage > 100) {
            percentage = 100;
        } else if (percentage < 0) {
            percentage = 0;
        }

        this.settings.volume = percentage;

        var _iteratorNormalCompletion18 = true;
        var _didIteratorError18 = false;
        var _iteratorError18 = undefined;

        try {
            for (var _iterator18 = this.videos[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                var video = _step18.value;

                video.volumeTo(percentage);
            }
        } catch (err) {
            _didIteratorError18 = true;
            _iteratorError18 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion18 && _iterator18['return']) {
                    _iterator18['return']();
                }
            } finally {
                if (_didIteratorError18) {
                    throw _iteratorError18;
                }
            }
        }

        return this;
    },

    _videosInState: function _videosInState(state) {
        var inState = true;
        var _iteratorNormalCompletion19 = true;
        var _didIteratorError19 = false;
        var _iteratorError19 = undefined;

        try {
            for (var _iterator19 = this.videos[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
                var video = _step19.value;

                if (video.getPlayerState() === state && inState) {
                    inState = false;
                }
            }
        } catch (err) {
            _didIteratorError19 = true;
            _iteratorError19 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion19 && _iterator19['return']) {
                    _iterator19['return']();
                }
            } finally {
                if (_didIteratorError19) {
                    throw _iteratorError19;
                }
            }
        }

        return inState;
    },

    _render: function _render() {
        if (this.settings.area === null) {
            return console.info('no html parent defined');
        }

        if ($('#SplitPlayer').length > 0) {
            return console.info('player allready exist');
        }

        $(this.settings.area).prepend(this.settings.template);
        this.$dom = $('#SplitPlayer');
    }

};

/* globals $ */

'use strict';

var SplitPlayerAnalytics = function SplitPlayerAnalytics(player, settings) {
    this.player = player;

    this.$volume = null;

    // extend settings
    this.settings = $.extend({}, this.player.settings, {}, settings || {});

    return this;
};

SplitPlayerAnalytics.prototype = {

    onPlay: function onPlay() {
        this.track('play');
    },

    onPause: function onPause() {
        this.track('pause');
    },

    onStop: function onStop() {
        this.track('stop');
    },

    setTo: function setTo(timeData) {
        this.track('setTimeTo', timeData.playedTime);
    },

    track: function track(label, value) {
        if (typeof _trackEvent !== 'undefined') {
            _trackEvent('splitplayer', 'click', label, value || null);
        }
    }

};

/* globals $ */

'use strict';

var SplitPlayerSoundManager = function SplitPlayerSoundManager(player, settings) {
    this.player = player;

    this.$volume = null;

    this.plugins = [];

    // extend settings
    this.settings = $.extend(true, {}, this.player.settings, {
        sound: {
            min: 0,
            max: 100,
            'default': 100
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
    extend: function extend(Module, settings) {
        Module = new Module(this, settings || {});

        // push internal
        this.plugins.push(Module);

        // push to player plugins for other hooks
        return this.player.plugins.push(Module);
    },

    onUpdate: function onUpdate() {
        console.log('test');
    },

    mount: function mount() {
        this._render();
        this._setEvents();
    },

    // set mousemove and click event
    _setEvents: function _setEvents() {
        this.$volume.on('change', this.setVolume.bind(this));
    },

    setVolume: function setVolume(event) {
        this.player.volumeTo($(event.target).val());
    },

    _render: function _render() {
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

    destroy: function destroy() {
        this.$volume.remove();
    }

};

/* globals $ */

'use strict';

var SplitPlayerSoundTrack = function SplitPlayerSoundTrack(soundManager, settings) {
    this.soundManager = soundManager;

    this.$trackList = null;

    // extend settings
    this.settings = $.extend({}, this.soundManager.player.settings, {
        area: null,
        template: '<label><input class="soundtrack" name="soundTracks[]" %checked% type="checkbox" value="%videoId%" /></label>'
    }, settings || {});

    this.mount();

    return this;
};

SplitPlayerSoundTrack.prototype = {

    mount: function mount() {
        this._render();
        this._setEvents();
    },

    // set mousemove and click event
    _setEvents: function _setEvents() {
        if (this.trackList !== null) {
            this.$trackList.on('click', this.setSound.bind(this));
        }
    },

    setSound: function setSound() {

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

    getActive: function getActive() {
        return $(this.settings.area).find('.soundtrack:checked').map(function () {
            return this.value;
        }).get();
    },

    _render: function _render() {
        if (this.settings.area === null) {
            return console.error('no dropArea for SoundTrack defined');
        }

        var template = '';

        var videos = this.soundManager.player.videos;

        var _iteratorNormalCompletion20 = true;
        var _didIteratorError20 = false;
        var _iteratorError20 = undefined;

        try {
            for (var _iterator20 = videos[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
                var video = _step20.value;

                // replace params
                template += this.settings.template.replace('%videoId%', video.settings.videoId).replace('%checked%', video.settings.isMuted ? '' : 'checked');
            }
        } catch (err) {
            _didIteratorError20 = true;
            _iteratorError20 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion20 && _iterator20['return']) {
                    _iterator20['return']();
                }
            } finally {
                if (_didIteratorError20) {
                    throw _iteratorError20;
                }
            }
        }

        $(this.settings.area).append(template);
        this.$trackList = $(this.settings.area).find('.soundtrack');
    },

    destroy: function destroy() {
        this.$trackList.remove();
    }
};

/* globals $, extend */

'use strict';

var SplitPlayerTimeDisplay = function SplitPlayerTimeDisplay(timeManager, settings) {
    this.timeManager = timeManager;
    this.$display = null;
    this.$duration = null;
    this.$current = null;

    // extend settings
    this.settings = extend({}, this.timeManager.settings, {
        area: null,
        template: '<i class="time-display"><time class="current">&nbsp;</time><time class="duration">&nbsp;</time></i>'
    }, settings);

    this.mount();
    return this;
};

SplitPlayerTimeDisplay.prototype = {

    mount: function mount() {
        this._render();
    },

    onReady: function onReady() {
        this.onSetTo(this.timeManager.getData());
    },

    onSetTo: function onSetTo(data) {
        this.$duration.html(data.durationFormatted);
        this.$current.html(data.playedTimeFormatted);
    },

    _render: function _render() {
        if (this.settings.area === null) {
            return console.error('no dropArea for timeDisplay defined');
        }

        this.$display = $(this.settings.area);
        this.$display.append(this.settings.template);

        this.$duration = this.$display.find('.duration');
        this.$current = this.$display.find('.current');
    },

    destroy: function destroy() {
        this.$display.remove();
    }

};

/* globals $, extend */

'use strict';

var SplitPlayerTimeLine = function SplitPlayerTimeLine(timeManager, settings) {
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

    mount: function mount() {
        this._render();
    },

    /*
     * player onReady hook
     */
    onReady: function onReady() {
        this.isActive = true;
    },

    /*
     * player onStop hook
     */
    onStop: function onStop() {
        this._reset();
    },

    /*
     * timeManager onSetTo hook
     */
    onSetTo: function onSetTo(data) {
        this.setTo(data);
    },

    setTo: function setTo(data) {
        this.$bar.css({
            width: data.percentage + '%'
        });
    },

    _reset: function _reset() {
        this.$bar.css({
            width: 0
        });
    },

    _render: function _render() {
        var dom = $(this.settings.area).append(this.settings.template);

        this.timeManager.$timeline = dom.find('#timeline');
        this.$bar = this.timeManager.$timeline.find('i');
    },

    destroy: function destroy() {
        this.timeManager.$timeline.remove();
    }
};

/* globals $, extend */

'use strict';

var SplitPlayerTimeManager = function SplitPlayerTimeManager(player, settings) {
    this.player = player;

    this.isActive = false;
    this.playedTime = 0;

    this.plugins = [];

    // extend player settings
    this.settings = $.extend({}, this.player.settings, {}, settings || {});

    return this;
};

SplitPlayerTimeManager.prototype = {

    /*
     * extend Module
     */
    extend: function extend(Module, settings) {
        Module = new Module(this, settings || {});

        // push internal
        this.plugins.push(Module);

        // push to player plugins for other hooks
        return this.player.plugins.push(Module);
    },

    /*
     * player onReady hook
     */
    onReady: function onReady() {
        this.isActive = true;
        this.setTo(0);
    },

    /*
     * player onUpdate hook
     */
    onUpdate: function onUpdate() {
        this.setTo(this.player.getPlayedTime());
    },

    /*
     * player onStop hook
     */
    onStop: function onStop() {
        this.setTo(0);
    },

    /*
     * Set Time to
     */
    setTo: function setTo(playedTime) {
        this.playedTime = playedTime;
        // plugin
        var _iteratorNormalCompletion21 = true;
        var _didIteratorError21 = false;
        var _iteratorError21 = undefined;

        try {
            for (var _iterator21 = this.plugins[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
                var Plugin = _step21.value;

                if (Plugin.onSetTo) {
                    Plugin.onSetTo(this.getData());
                }
            }
        } catch (err) {
            _didIteratorError21 = true;
            _iteratorError21 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion21 && _iterator21['return']) {
                    _iterator21['return']();
                }
            } finally {
                if (_didIteratorError21) {
                    throw _iteratorError21;
                }
            }
        }
    },

    /*
     * get all time data from player
     */
    getData: function getData() {
        // get percentage
        var percentage = this.playedTime * 100 / this.player.duration;
        // player duration
        var duration = this.player.duration;

        // formatted playedTime
        var playedTimeFormatted = this._formatTime(this.playedTime);
        // formatted duration
        var durationFormatted = this._formatTime(duration);

        return {
            percentage: percentage,
            playedTime: this.playedTime,
            playedTimeFormatted: playedTimeFormatted,
            duration: duration,
            durationFormatted: durationFormatted
        };
    },

    _formatTime: function _formatTime(timeInplayedTime) {
        // convert to minutes
        var minutes = Math.floor(timeInplayedTime / 60);
        // convert seconds
        var seconds = Math.round(timeInplayedTime - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        if (seconds === 60) {
            seconds = '00';
            minutes++;
        }

        return minutes + ':' + seconds;
    },

    destroy: function destroy() {
        this.onStop();
    }
};

/* globals $, extend */

'use strict';

var SplitPlayerTimePicker = function SplitPlayerTimePicker(timeManager, settings) {
    this.timeManager = timeManager;

    this.$previewLine = null;

    this.previewedTime = 0;

    // extend settings
    this.settings = extend({}, this.timeManager.settings, {
        area: '#timeline',
        template: '<i class="preview-line"><time></time></i>'
    }, settings || {});

    this.mount();

    return this;
};

SplitPlayerTimePicker.prototype = {

    mount: function mount() {
        this.$timeline = this.timeManager.$timeline;

        this._render();
        this._setEvents();
    },

    // set mousemove and click event
    _setEvents: function _setEvents() {
        this.$timeline.on('mousemove', this._showTime.bind(this)).on('mouseup', this._setTime.bind(this));
    },

    // show time on mousemove
    _showTime: function _showTime(e) {

        var leftPos = e.pageX - this.$timeline.offset().left;

        var percentage = leftPos * 100 / this.$timeline.width();

        // set to 0 if negative value
        if (percentage < 0) {
            percentage = 0;
        }

        this.previewedTime = this.timeManager.player.duration / 100 * percentage;

        this.$previewLine.width(percentage + '%').find('time').html(this.timeManager._formatTime(this.previewedTime));
    },

    // set time on click
    _setTime: function _setTime() {
        this.timeManager.setTo(this.previewedTime);
        this.timeManager.player.timeTo(this.previewedTime);
    },

    _render: function _render() {
        this.$timeline.append(this.settings.template);
        this.$previewLine = this.$timeline.find('.preview-line');
    }

};

/* globals $, extend */

'use strict';

var SplitPlayerTimeSync = function SplitPlayerTimeSync(timeManager, settings) {
    this.timeManager = timeManager;

    this.timeline = this.timeManager.timeline;

    this.previewedTime = 0;

    // extend settings
    this.settings = extend({}, this.timeManager.settings, {
        area: '#timeline',
        template: '<i class="preview-line"><time></time></i>'
    }, settings || {});

    this._render();
    this._setEvents();

    return this;
};

SplitPlayerTimeSync.prototype = {

    seconds: {},
    stepValue: 0.1,
    interval: null,

    setEvents: function setEvents() {
        var self = this;
        $('.time-set-button-up').off('mousedown').on('mousedown', function (e) {
            e.preventDefault();

            self.start('increase', $(this).attr('videoId'));
        }).off('mouseup').on('mouseup', function (e) {
            e.preventDefault();

            self.stop();
        }).off('mouseleave').on('mouseleave', this.stop.bind(this));

        $('.time-set-button-down').off('mousedown').on('mousedown', function (e) {
            e.preventDefault();

            self.start('decrease', $(this).attr('videoId'));
        }).off('mouseup').on('mouseup', function (e) {
            e.preventDefault();

            self.stop();
        }).off('mouseleave').on('mouseleave', this.stop.bind(this));

        $('.time-set-input').change(function () {
            var videoId = $(this).attr('videoId');

            self.seconds[videoId] = parseFloat($(this).val());

            // set seconds
            var video = sp.player.getVideoByVideoId(videoId);
            video.player.seekTo(self.seconds[videoId]);
            self.setStartSeconds(videoId, self.seconds[videoId]);
        });
    },

    // start auto increasing
    start: function start(action, videoId) {
        var self = this;
        self[action](videoId);

        // action = increase or decrease
        this.interval = window.setInterval(function () {
            self[action](videoId);
        }, 100);
    },

    // stop auto increasing
    stop: function stop() {
        window.clearInterval(this.interval);
    },

    increase: function increase(videoId) {

        if (typeof this.seconds[videoId] === 'undefined') {
            this.seconds[videoId] = this.stepValue;
        } else {
            this.seconds[videoId] = parseFloat(this.seconds[videoId]) + parseFloat(this.stepValue);
        }

        // round to decimal
        this.seconds[videoId] = this.roundDecimal(this.seconds[videoId]);

        this.setStartSeconds(videoId, this.seconds[videoId]);
    },

    decrease: function decrease(videoId) {

        // prevent if is 0
        if (this.seconds[videoId] === 0) {
            return false;
        }

        // set default value if no is defined
        if (typeof this.seconds[videoId] === 'undefined') {
            this.seconds[videoId] = 0;

            // increase
        } else {
                if (this.seconds[videoId] > 0) {
                    this.seconds[videoId] = parseFloat(this.seconds[videoId]) - parseFloat(this.stepValue);
                }
            }

        // round to decimal
        this.seconds[videoId] = this.roundDecimal(this.seconds[videoId]);

        this.setStartSeconds(videoId, this.seconds[videoId]);
    },

    roundDecimal: function roundDecimal(val) {
        return parseFloat(Math.round(val * 100) / 100);
    },

    setStartSeconds: function setStartSeconds(videoId, startSeconds) {

        var video = sp.player.getVideoByVideoId(videoId);
        video.startSeconds = startSeconds;

        // write to input
        $('#' + videoId + 'Number').val(startSeconds);

        this.sync();
    },

    sync: function sync() {
        // sort videos by startSeconds ASC
        var sortedArray = _.sortBy(sp.player.selectedVideos, 'startSeconds');

        var time = parseFloat(parseFloat(parseFloat(sortedArray[0].player.getCurrentTime()) - parseFloat(sortedArray[0].startSeconds)));

        sp.player.setTime(time);

        console.log('video time: %s', time);
    }
};

/* globals playerState, extend, YT, $ */
'use strict';

var SplitPlayerVideo = SplitPlayerVideo || {};

SplitPlayerVideo.youtube = function (player, settings) {

    this.player = player;
    this.videoPlayer = null;

    this.settings = extend({
        videoId: null,
        startSeconds: 0,
        isMuted: false
    }, settings);

    this.isMuted = this.settings.isMuted;

    return this;
};

SplitPlayerVideo.youtube.prototype = {

    loadingDependencies: false,

    load: function load(callback) {

        if (this.loadingDependencies) {
            return;
        }

        this.loadingDependencies = true;

        $.getScript('//youtube.com/iframe_api', function () {
            window.onYouTubeIframeAPIReady = callback;
        });
    },

    mount: function mount() {
        this._render();
        this.create();
    },

    create: function create() {

        this.videoPlayer = new YT.Player('replacer' + this.settings.videoId, {
            width: '100%',
            height: '100%',
            videoId: this.settings.videoId,
            startSeconds: this.settings.startSeconds,
            playerVars: {
                'controls': 1
            },
            events: {
                onReady: this.onReady.bind(this),
                onStateChange: this.onStateChange.bind(this),
                onError: this.onError.bind(this)
            }
        });
    },

    onReady: function onReady() {
        this.setPlayerDuration();
        if (this.settings.isMuted) {
            this.mute();
        }
        this.timeTo(0);
        this.player.onReady();
    },

    onError: function onError(err) {

        var code = err.data;
        if (code === 100 || code === 150) {
            console.error('Video %s Not Found', this.settings.videoId);
        }

        this.noVideo();
    },

    onStateChange: function onStateChange(event) {

        if (event.data === YT.PlayerState.BUFFERING) {
            return this.player.changeState(playerState.buffering);
        }

        if (event.data === YT.PlayerState.PLAYING) {
            return this.player.changeState(playerState.playing);
        }

        if (event.data === YT.PlayerState.PAUSED) {
            return this.player.changeState(playerState.pause);
        }

        console.info('state %s not fetched', event.data);
    },

    getPlayerState: function getPlayerState() {
        return this.videoPlayer.getPlayerState();
    },

    remove: function remove() {
        this.videoPlayer.destroy();
    },

    timeTo: function timeTo(time) {

        if (time >= this.getDuration()) {
            this.videoPlayer.stopVideo();
            return console.info('time for %s out of range', this.settings.videoId);
        }

        time = time + this.settings.startSeconds;

        this.videoPlayer.seekTo(time);
    },

    volumeTo: function volumeTo(percentage) {
        if (this.isMuted) {
            return false;
        }

        this.videoPlayer.setVolume(percentage);
        return true;
    },

    mute: function mute() {
        this.videoPlayer.mute();
        this.isMuted = true;
        this.settings.isMuted = this.isMuted;

        return true;
    },

    unMute: function unMute() {
        this.isMuted = false;
        this.settings.isMuted = this.isMuted;
        this.videoPlayer.unMute();
        this.volumeTo(this.player.settings.volume);

        return true;
    },

    play: function play() {
        this.videoPlayer.playVideo();
    },

    pause: function pause() {
        this.videoPlayer.pauseVideo();
    },

    stop: function stop() {
        this.timeTo(0);
        this.pause();
    },

    getDuration: function getDuration() {
        return this.videoPlayer.getDuration() - this.settings.startSeconds;
    },

    setPlayerDuration: function setPlayerDuration() {
        var _duration = this.getDuration();

        if (this.player.duration < _duration) {
            this.player.duration = _duration;
            this.player.getPlayedTime = this.getPlayedTime.bind(this);
        }
    },

    getPlayedTime: function getPlayedTime() {
        return this.videoPlayer.getCurrentTime() - this.settings.startSeconds;
    },

    _render: function _render() {
        $('#SplitPlayer').append('<div id="' + this.settings.videoId + '"><div id="replacer' + this.settings.videoId + '"><div></div>');
    },

    noVideo: function noVideo() {
        this.player.removeVideo(this.settings.videoId);
        $('#' + this.settings.videoId).html('<div class="no-video"></div>');
    },

    destroy: function destroy() {
        // remove youtube video iframe
        $('#' + this.settings.videoId).remove();
    }

};
