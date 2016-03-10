'use strict';

var SplitPlayerPlugins = {
    TimeManager: require('./time/manager.js'),
    TimeLine: require('./time/line.js'),
    TimeSync: require('./time/sync.js'),
    TimePicker: require('./time/picker.js'),
    TimeDisplay: require('./time/display.js'),
    SoundManager: require('./sound/manager.js'),
    SoundTrack: require('./sound/track.js'),
    Analytics: require('./analytics.js'),
    Fullscreen: require('./fullscreen.js')
};

if (typeof window !== 'undefined') {
    window.SplitPlayerPlugins = SplitPlayerPlugins;
}
module.exports = SplitPlayerPlugins;
