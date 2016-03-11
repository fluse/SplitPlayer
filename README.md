# SplitPlayer

[![](http://player.splitplay.tv/dist/logo.png)](http://player.splitplay.tv)

[![npm package](https://nodei.co/npm/splitplayer.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/splitplayer/)
[![NPM](https://nodei.co/npm-dl/splitplayer.png?months=6&height=3)](https://www.npmjs.com/package/splitplayer)

SplitPlayer is a high flexible extendable Video Player, that keeps multiple youtube videos in sync. Let Videos Start at different seconds, to get them synchronous.

## Features

### Multi Videos
We are the new generation, that can't live with one thing. We want to do or see more than one thing simultaneously.
Create more than one video instance and control them all together within one control interface.

### Start Time
So now you know thats possible to create more than one video, but where is the sense behind them?
Maybe you want to add more than one perspective from one game or scene. Use the start time to bring all videos in sync.

### Analytics
I saw it in your eyes. You want to know, what your page visitors do with your player.
This Plugin will push play, pause, stop, volume events, automatically to google analytics.

### SoundTrack Selection
Many Videos many sounds. But you want only one of them?
Select a soundtrack initial or use this plugin to select the sound by a list.

### Volume
One slider to rule them all! control the volume of all videos inside on player

### TimePicker
Jump forward, go backward, select the part you want to watch.
Use this plugin to select the time on a line, that keeps videos in sync.

### Fullscreen
You can use it to set a custom area, to bring all videos together in fullscreen. Such delicacy. Yumyum.

### CrossTab Control
Yes multi tab browsing is a nice thing, but you have open 2-3 player instances in different tabs?
No matter! This plugin will pause all other players in there tabs and set overall volume.

### Remembering Time
You now nana the rapper? I remember the time, the time that we had?
If you in hurry and can't finish watching videos. No problem! This plugin remember the played time, saves it into storage and use it after reopening the videos.

## Supported Hoster
- Youtube
- Native (experimental)

## Planned
- Synchronize Interface
- Playlists
- Hide or show specific videos
- Auto Sound Select if Video ends
- Picture in Picture Mode
- Vimeo
- remote browser sync
- crosstab volume regulation

Productive integration on http://splitplay.tv

example on http://player.splitplay.tv

## Browser Compatibility
- IE 9+
- Chrome latest 2
- Firefox latest 2
- Safari latest
- Android 5
- iOS not working native yet

# Installation and Usage

## Install
```shell
npm install splitplayer --save
```

## Include

on page include

```html
<!-- unpacked -->
<script src="/dist/splitplayer.js"></script>
<!-- minified -->
<script src="/dist/splitplayer.min.js"></script>
```

require as node module

```javascript
var SplitPlayer = require('splitplayer');
```

# Player

## Create

```javascript
var player = new SplitPlayer(options);
```

### Options

```javascript
var options = {
    videos: Array,
    area: String,
    maxVideos: Number,
    volume: Number,
    template: String
};
```

| option        | type           | description  |
| ------------- |:-------------:| :---------|
| videos      | Array | list of videos with there settings |
| area      | String      |   DOM droparea for player |
| maxVideos | Number      |   set maximal video amount |
| volume | Number      |    set intial volume |
| template | String      |    wrapper for all videos |

## Videos

### Options
```javascript

var video = {
    hoster: String,
    videoId: String,
    startSeconds: Number,
    isMuted: Boolean,
    controls: Number
}
```

| option        | type           | description  |
| ------------- |:-------------:| :-----|
| hoster      | String | set which service this video will use |
| videoId      | String      |   id from youtube or other services |
| startSeconds | Number      |    set seconds, where video will begin, this supports float values like 1.2 |
| isMuted | Boolean      |    false or true do unmute or mute a video initial |
| controls | Number      |    1 show controls 0 hide it initial 1 |

### Examples
```javascript
var video = {
    hoster: 'youtube',
    videoId: 'J4Ltw1ZA9ho',
    startSeconds: 1.2,
    isMuted: false
}
```

#### add list of videos

```javascript

var videoList = [{options}, {options}, {options}];

var player = new SplitPlayer(options);

// add videos
player.addVideos(videoList);
```

#### add one video

```javascript
// create new player
var player = new SplitPlayer(options);

// add video
player.addVideo({object});
```

### Plugins

| Name        | description  | dependencies |
| ------------|:-----| :-----|
| TimeLine      | show played time on a line | TimeManager |
| TimePicker      | this plugin will set your selected time as players current played time | TimeManager |
| TimeDisplay      | show played time on a line | TimeManager |
| Analytics      | if you have google analytcs running, you can include this plugin to track events | Analytics, TimeManager |
| SoundTrack      | this plugin gives the possability to select a soundtrack from added videos | SoundManager |

#### Add Plugin

you can add a plugin directy after you've created the player like this

```javascript
var player = new SplitPlayer(options);

var playerTimeManager = player.addPlugin(SplitPlayerPlugins.TimeManager);
```

`addPlugin()` return created instance of given plugin

#### Extend Plugin

maybe you want to add a new behavior to your playerTime, like an on hover show time

```javascript

var player = new SplitPlayer(options);

var playerTimeManager = player.addPlugin(SplitPlayerPlugins.TimeManager);

playerTimeManager.extend(SplitPlayerPlugins.TimePicker);
```

`extend()` return the created instance of given module

#### playerStates

```javascript
// player state constants
const playerState = {
    unstarted: -1,
    ended: 0,
    playing: 1,
    pause: 2,
    buffering: 3,
    loading: 6
};
```

#### player hooks

hooks are used to connect plugins to player behavior

- onReady
- onPlay
- onPause
- onStop
- onUpdate
- onTimeTo
- onMute
- onVolumeChange

### Public Methods

these methods can be used outside

#### play()

play all videos if videos ready

```javascript
player.play();
```

#### pause()

pause all videos

```javascript
player.pause();
```

#### toggle()

Toggle Video from play to pause vice versa

```javascript
player.toggle();
```

#### stop()

stop all videos. The played time will be set to 0 + startSeconds

```javascript
player.stop();
```

#### removeVideo()

remove a video from Player by calling following methods with argument videoId;

```javascript
player.removeVideo(videoId);
```

#### timeTo()

setTime for all Videos

```javascript
player.timeTo(Number); // float number supported
```

#### volumeTo()

set Volume for non muted videos to given number

```javascript
player.volumeTo(Number); // 0-100
```

#### getPlayedTime()

get current played time in seconds

```javascript
return seconds = player.getPlayedTime();
```

#### empty()

you want to delete all videos? use empty()

```javascript
player.empty();
```

#### destroy()

you want to delete the player? use following

```javascript
player.destroy();
```

#### all public methods can be chained

```javascript
player.play().stop().pause().volumeTo(0).timeTo(10).toggle();
```

## Dependencies
- DOMtastic > 0.12.x
- underscore > 1.8.x
- node extend > 3.x.x
- YT iframe api

## restriction and licence

you can use this player only for non commercial products and websites.
