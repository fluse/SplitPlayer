/* splitplayer 1.2.2 - http://player.splitplay.tv - copyright Holger Schauf <holger.schauf@gmail.com> */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*!
 * crosstab JavaScript Library v0.2.12
 * https://github.com/tejacques/crosstab
 *
 * License: Apache 2.0 https://github.com/tejacques/crosstab/blob/master/LICENSE
 *
 *  Copyright 2015 Tom Jacques
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
/* global define */
/* global global */
; (function (window, define) { define('crosstab', function (require, exports, module) {
    'use strict';

    // --- Handle Support ---
    // See: http://detectmobilebrowsers.com/about
    var useragent = (window.navigator && (window.navigator.userAgent || window.navigator.vendor)) || window.opera || "none";
    var isMobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(useragent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(useragent.substr(0, 4)));

    var localStorage;
    try {
        localStorage = window.localStorage;
        localStorage = window['ie8-eventlistener/storage'] || window.localStorage;
    } catch (e) {
        // New versions of Firefox throw a Security exception
        // if cookies are disabled. See
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1028153
    }

    // When Safari on OS X or iOS is in private browsing mode,
    // calling localStorage.setItem throws an exception.
    //
    // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made
    // to add something to storage that exceeded the quota."
    var setItemAllowed = true;
    try {
        localStorage.setItem('__crosstab', '');
        localStorage.removeItem('__crosstab');
    } catch (e) {
        setItemAllowed = false;
    }

    // Other reasons
    var frozenTabEnvironment = false;

    function notSupported() {
        if (crosstab.supported) return;
        var errorMsg = 'crosstab not supported';
        var reasons = [];
        if (!localStorage) {
            reasons.push('localStorage not availabe');
        }
        if (!window.addEventListener) {
            reasons.push('addEventListener not available');
        }
        if (isMobile) {
            reasons.push('mobile browser');
        }
        if (frozenTabEnvironment) {
            reasons.push('frozen tab environment detected');
        }
        if (!setItemAllowed) {
            reasons.push('localStorage.setItem not allowed');
        }

        if (reasons.length > 0) {
            errorMsg += ': ' + reasons.join(', ');
        }

        throw new Error(errorMsg);
    }

    // --- Utility ---
    var util = {
        keys: {
            MESSAGE_KEY: 'crosstab.MESSAGE_KEY',
            TABS_KEY: 'crosstab.TABS_KEY',
            MASTER_TAB: 'MASTER_TAB',
            SUPPORTED_KEY: 'crosstab.SUPPORTED',
            FROZEN_TAB_ENVIRONMENT: 'crosstab.FROZEN_TAB_ENVIRONMENT'
        }
    };

    util.isArray = Array.isArray || function (arr) {
        return arr instanceof Array;
    };

    util.isNumber = function (num) {
        return typeof num === 'number';
    };

    util.isFunction = function (fn) {
        return typeof fn === 'function';
    };

    util.forEachObj = function (obj, fn) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                fn.call(obj, obj[key], key, obj);
            }
        }
    };

    util.forEachArr = function (arr, fn) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            fn.call(arr, arr[i], i, arr);
        }
    };

    util.forEach = function (thing, fn) {
        if (util.isArray(thing)) {
            util.forEachArr(thing, fn);
        } else {
            util.forEachObj(thing, fn);
        }
    };

    util.map = function (thing, fn) {
        var res = [];
        util.forEach(thing, function (item, key, obj) {
            res.push(fn(item, key, obj));
        });

        return res;
    };

    util.filter = function (thing, fn) {
        var isArr = util.isArray(thing);
        var res = isArr ? [] : {};

        if (isArr) {
            util.forEachArr(thing, function (value, key) {
                if (fn(value, key)) {
                    res.push(value);
                }
            });
        } else {
            util.forEachObj(thing, function (value, key) {
                if (fn(value, key)) {
                    res[key] = value;
                }
            });
        }

        return res;
    };

    util.reduce = function (thing, fn, accumulator) {
        var first = arguments.length < 3;

        util.forEach(thing, function (item, key, obj) {
            if (first) {
                accumulator = item;
                first = false;
            } else {
                accumulator = fn(accumulator, item, key, obj);
            }
        });

        return accumulator;
    };

    util.now = function () {
        return (new Date()).getTime();
    };

    util.tabs = getStoredTabs();

    util.eventTypes = {
        becomeMaster: 'becomeMaster',
        demoteFromMaster: 'demotedFromMaster',
        tabUpdated: 'tabUpdated',
        tabClosed: 'tabClosed',
        tabPromoted: 'tabPromoted'
    };

    util.storageEventKeys = util.reduce(util.keys, function (keys, val) {
        keys[val] = 1;
        return keys;
    }, {});

    // --- Events ---
    // node.js style events, with the main difference being able
    // to add/remove events by key.
    util.createEventHandler = function () {
        var events = {};
        var subscribeKeyToListener = {};

        var findHandlerByKey = function(event, key) {
            var handler;
            if (subscribeKeyToListener[event]) {
                handler = subscribeKeyToListener[event][key];
            }
            return handler;
        };

        var findHandlerIndex = function (event, listener) {
            var listenerIndex = -1;
            var eventList = events[event];
            if (eventList && listener) {
                var len = eventList.length || 0;
                for(var i = 0; i < len; i++) {
                    if (eventList[i] === listener) {
                        listenerIndex = i;
                        break;
                    }
                }
            }
            return listenerIndex;
        };

        var addListener = function (event, listener, key) {
            var handlers = listeners(event);

            var storedHandler = findHandlerByKey(event, key);
            var listenerIndex;

            if (storedHandler === undefined) {
                listenerIndex = handlers.length;
                handlers[listenerIndex] = listener;

                if (!subscribeKeyToListener[event]) {
                    (subscribeKeyToListener[event] = {});
                }

                if (key) {
                    subscribeKeyToListener[event][key] = listener;
                }
            } else {
                listenerIndex = findHandlerIndex(event, storedHandler);
                handlers[listenerIndex] = listener;
            }

            return key || listener;
        };

        var removeListener = function (event, key) {
            var handler = util.isFunction(key)
                ? key
                : findHandlerByKey(event, key);

            var listenerIndex = findHandlerIndex(event, handler);
            if (listenerIndex === -1) return false;

            if (events[event] && events[event][listenerIndex]) {
                events[event].splice(listenerIndex, 1);
                delete subscribeKeyToListener[event][key];
                return true;
            }
            return false;
        };

        var removeAllListeners = function (event) {
            var successful = false;
            if (event) {
                if (events[event]) {
                    delete events[event];
                    successful = true;
                }
                if (subscribeKeyToListener[event]) {
                    delete subscribeKeyToListener[event];
                    successful = successful && true;
                }
            } else {
                events = {};
                subscribeKeyToListener = {};
                successful = true;
            }
            return successful;
        };

        var emit = function (event) {
            var args = Array.prototype.slice.call(arguments, 1);
            var handlers = listeners(event);

            util.forEach(handlers, function (listener) {
                if (util.isFunction(listener)) {
                    listener.apply(this, args);
                }
            });
        };

        var once = function (event, listener, key) {
            // Generate a unique id for this listener
            while (!key || (findHandlerByKey(event, key) !== undefined)) {
                key = util.generateId();
            }

            addListener(event, function () {
                removeListener(event, key);
                var args = Array.prototype.slice.call(arguments);
                listener.apply(this, args);
            }, key);

            return key;
        };

        var listeners = function (event) {
            var handlers = events[event] = events[event] || [];
            return handlers;
        };

        var destructor = function() {
            removeAllListeners();
        };

        return {
            addListener: addListener,
            destructor: destructor,
            on: addListener,
            off: function(event, key) {
                var argsLen = arguments.length;
                if (!argsLen) {
                    return removeAllListeners();
                } else if (argsLen === 1) {
                    return removeAllListeners(event);
                } else {
                    return removeListener(event, key);
                }
            },
            once: once,
            emit: emit,
            listeners: listeners,
            removeListener: removeListener,
            removeAllListeners: removeAllListeners
        };
    };

    // --- Setup Events ---
    var eventHandler = util.createEventHandler();

    // wrap eventHandler so that setting it will not blow up
    // any of the internal workings
    util.events = {
        addListener: eventHandler.addListener,
        on: eventHandler.on,
        off: eventHandler.off,
        once: eventHandler.once,
        emit: eventHandler.emit,
        listeners: eventHandler.listeners,
        removeListener: eventHandler.removeListener,
        removeAllListeners: eventHandler.removeAllListeners,
        destructor: eventHandler.destructor
    };

    var lastNewValue;
    var lastOldValue;
    function onStorageEvent(event) {
        // Only handle crosstab events
        if (!event || !(event.key in util.storageEventKeys)) {
            return;
        }

        var eventValue;
        try {
            eventValue = event.newValue ? JSON.parse(event.newValue) : {};
        } catch (e) {
            eventValue = {};
        }
        if (!eventValue || !eventValue.id || eventValue.id === crosstab.id) {
            // This is to force IE to behave properly
            return;
        }
        if (event.newValue === lastNewValue && event.oldValue === lastOldValue) {
            // Fix bug in IE11 where StorageEvents in iframes are sent twice.
            return;
        }
        lastNewValue = event.newValue;
        lastOldValue = event.oldValue;
        if (event.key === util.keys.MESSAGE_KEY) {
            var message = eventValue.data;
            // only handle if this message was meant for this tab.
            if (!message.destination || message.destination === crosstab.id) {
                eventHandler.emit(message.event, message);
            }
        } else if (event.key === util.keys.FROZEN_TAB_ENVIRONMENT) {
            frozenTabEnvironment = eventValue.data;
            crosstab.supported = crosstab.supported && !eventValue.data;
        } else if (event.key === util.keys.SUPPORTED_KEY) {
            crosstab.supported = crosstab.supported && eventValue.data;
        }
    }

    function setLocalStorageItem(key, data) {
        var storageItem = {
            id: crosstab.id,
            data: data,
            timestamp: util.now()
        };

        localStorage.setItem(key, JSON.stringify(storageItem));
    }

    function getLocalStorageItem(key) {
        var item = getLocalStorageRaw(key);
        return item.data;
    }

    function getLocalStorageRaw(key) {
        var json = localStorage ? localStorage.getItem(key) : null;
        var item = json ? JSON.parse(json) : {};
        return item;
    }

    function unload() {
        crosstab.stopKeepalive = true;
        var numTabs = 0;
        util.forEach(util.tabs, function (tab, key) {
            if (key !== util.keys.MASTER_TAB) {
                numTabs++;
            }
        });

        if (numTabs === 1) {
            util.tabs = {};
            setStoredTabs();
        } else {
            broadcast(util.eventTypes.tabClosed, crosstab.id);
        }

    }

    function restoreLoop() {
        crosstab.stopKeepalive = false;
        keepaliveLoop();
    }

    function swapUnloadEvents() {
        // `beforeunload` replaced by `unload` (IE11 will be smart now)
        window.removeEventListener('beforeunload', unload, false);
        window.addEventListener('unload', unload, false);
        restoreLoop();
    }

    function getMaster() {
        return util.tabs[util.keys.MASTER_TAB];
    }

    function setMaster(newMaster) {
        util.tabs[util.keys.MASTER_TAB] = newMaster;
    }

    function deleteMaster() {
        delete util.tabs[util.keys.MASTER_TAB];
    }

    function getMasterId() {
        var master = getMaster();

        return master ? master.id : 0;
    }

    function isMaster() {
        return getMasterId() === crosstab.id;
    }

    function masterTabElection() {
        var maxId = null;
        util.forEach(util.tabs, function (tab) {
            if (!maxId || tab.id < maxId) {
                maxId = tab.id;
            }
        });

        // only broadcast the promotion if I am the new master
        if (maxId === crosstab.id) {
            broadcast(util.eventTypes.tabPromoted, crosstab.id);
        } else {
            // this is done so that in the case where multiple tabs are being
            // started at the same time, and there is no current saved tab
            // information, we will still have a value set for the master tab
            setMaster({
                id: maxId,
                lastUpdated: util.now()
            });
        }
    }

    // Handle other tabs closing by updating internal tab model, and promoting
    // self if we are the lowest tab id
    eventHandler.addListener(util.eventTypes.tabClosed, function (message) {
        var id = message.data;
        if (id in util.tabs) {
            delete util.tabs[id];
        }

        var master = getMaster();
        if (!master || master.id === id) {
            // If the master was the closed tab, delete it and the highest
            // tab ID becomes the new master, which will save the tabs
            if (master) {
                deleteMaster();
            }
            masterTabElection();
        } else if (master.id === crosstab.id) {
            // If I am master, save the new tabs out
            setStoredTabs();
        }
    });

    eventHandler.addListener(util.eventTypes.tabUpdated, function (message) {
        var tab = message.data;
        util.tabs[tab.id] = tab;

        // If there is no master, hold an election
        if (!getMaster()) {
            masterTabElection();
        }

        if (getMasterId() === tab.id) {
            setMaster(tab);
        }
        if (isMaster()) {
            // If I am master, save the new tabs out
            setStoredTabs();
        }
    });

    var bullying;
    eventHandler.addListener(util.eventTypes.tabPromoted, function (message) {
        var id = message.data;
        var lastUpdated = message.timestamp;
        var previousMaster = getMasterId();

        // Bully out competing broadcasts if our id is lower
        if (crosstab.id < id) {
            if (!bullying) {
                bullying = setTimeout(function() {
                    bullying = 0;
                    broadcast(util.eventTypes.tabPromoted, crosstab.id);
                }, 0);
            }
            return;
        }

        setMaster({
            id: id,
            lastUpdated: lastUpdated
        });

        if (isMaster()) {
            // set the tabs in localStorage
            setStoredTabs();
        }
        if (isMaster()
            && previousMaster !== crosstab.id) {
            // emit the become master event so we can handle it accordingly
            util.events.emit(util.eventTypes.becomeMaster);
        } else if (!isMaster()
            && previousMaster === crosstab.id) {
            // emit the demoted from master event so we can clean up resources
            util.events.emit(util.eventTypes.demoteFromMaster);
        }
    });

    function pad(num, width, padChar) {
        padChar = padChar || '0';
        var numStr = (num.toString());

        if (numStr.length >= width) {
            return numStr;
        }

        return new Array(width - numStr.length + 1).join(padChar) + numStr;
    }

    util.generateId = function () {
        /*jshint bitwise: false*/
        return util.now().toString() + pad((Math.random() * 0x7FFFFFFF) | 0, 10);
    };

    // --- Setup message sending and handling ---
    function broadcast(event, data, destination) {
        if (!crosstab.supported) {
            notSupported();
        }

        var message = {
            id: util.generateId(),
            event: event,
            data: data,
            destination: destination,
            origin: crosstab.id,
            timestamp: util.now()
        };

        // If the destination differs from the origin send it out, otherwise
        // handle it locally
        if (message.destination !== message.origin) {
            setLocalStorageItem(util.keys.MESSAGE_KEY, message);
        }

        if (!message.destination || message.destination === message.origin) {
            eventHandler.emit(event, message);
        }
    }

    function broadcastMaster(event, data) {
        broadcast(event, data, getMaster().id);
    }

    // ---- Return ----
    var setupComplete = false;
    util.events.once('setupComplete', function () {
        setupComplete = true;
    });

    var crosstab = function (fn) {
        if (setupComplete) {
            fn();
        } else {
            util.events.once('setupComplete', fn);
        }
    };

    crosstab.id = util.generateId();
    crosstab.supported = !!localStorage && window.addEventListener && !isMobile && setItemAllowed;
    crosstab.util = util;
    crosstab.broadcast = broadcast;
    crosstab.broadcastMaster = broadcastMaster;
    crosstab.on = util.events.on;
    crosstab.once = util.events.once;
    crosstab.off = util.events.off;

    // 10 minute timeout
    var CACHE_TIMEOUT = 10 * 60 * 1000;

    // --- Crosstab supported ---
    // Check to see if the global frozen tab environment key or supported key has been set.
    if (!setupComplete && crosstab.supported) {
        var frozenTabsRaw = getLocalStorageRaw(util.keys.FROZEN_TAB_ENVIRONMENT);

        if (frozenTabsRaw.timestamp) {
            var frozenTabs = frozenTabsRaw.data;
            if (util.now() - frozenTabsRaw.timestamp > CACHE_TIMEOUT) {
                localStorage.removeItem(util.keys.FROZEN_TAB_ENVIRONMENT);
            } else if (frozenTabs === true) {
                frozenTabEnvironmentDetected();
            }
        }

        var supportedRaw = getLocalStorageRaw(util.keys.SUPPORTED_KEY);

        if (supportedRaw.timestamp) {
            var supported = supportedRaw.data;

            if (util.now() - supportedRaw.timestamp > CACHE_TIMEOUT) {
                localStorage.removeItem(util.keys.SUPPORTED_KEY);
            } else if (supported === false || supported === true) {
                // As long as it is explicitely set, use the value
                crosstab.supported = supported;
                util.events.emit('setupComplete');
            }
        }
    }

    function frozenTabEnvironmentDetected() {
        crosstab.supported = false;
        frozenTabEnvironment = true;
        setLocalStorageItem(util.keys.FROZEN_TAB_ENVIRONMENT, true);
        setLocalStorageItem(util.keys.SUPPORTED_KEY, false);
    }

    // --- Tab Setup ---
    // 3 second keepalive
    var TAB_KEEPALIVE = 3 * 1000;
    // 5 second timeout
    var TAB_TIMEOUT = 5 * 1000;
    // 500 ms ping timeout
    var PING_TIMEOUT = 500;

    function getStoredTabs() {
        var storedTabs = getLocalStorageItem(util.keys.TABS_KEY);
        util.tabs = storedTabs || util.tabs || {};
        return util.tabs;
    }

    function setStoredTabs() {
        setLocalStorageItem(util.keys.TABS_KEY, util.tabs);
    }

    function keepalive() {
        var now = util.now();

        var myTab = {
            id: crosstab.id,
            lastUpdated: now
        };

        // broadcast tabUpdated event
        broadcast(util.eventTypes.tabUpdated, myTab);

        // broadcast tabClosed event for each tab that timed out
        function stillAlive(tab) {
            return now - tab.lastUpdated < TAB_TIMEOUT;
        }

        function notAlive(tab, key) {
            return key !== util.keys.MASTER_TAB && !stillAlive(tab);
        }

        var deadTabs = util.filter(util.tabs, notAlive);
        util.forEach(deadTabs, function (tab) {
            broadcast(util.eventTypes.tabClosed, tab.id);
        });

        // check to see if setup is complete
        if (!setupComplete) {
            var master = getMaster();
            // ping master
            if (master && master.id !== myTab.id) {
                var timeout;
                var start;

                crosstab.util.events.once('PONG', function () {
                    if (!setupComplete) {
                        clearTimeout(timeout);
                        // set supported to true / frozen to false
                        setLocalStorageItem(
                            util.keys.SUPPORTED_KEY,
                            true);
                        setLocalStorageItem(
                            util.keys.FROZEN_TAB_ENVIRONMENT,
                            false);
                        util.events.emit('setupComplete');
                    }
                });

                start = util.now();

                // There is a nested timeout here. We'll give it 100ms
                // timeout, with iters "yields" to the event loop. So at least
                // iters number of blocks of javascript will be able to run
                // covering at least 100ms
                var recursiveTimeout = function (iters) {
                    var diff = util.now() - start;

                    if (!setupComplete) {
                        if (iters <= 0 && diff > PING_TIMEOUT) {
                            frozenTabEnvironmentDetected();
                            util.events.emit('setupComplete');
                        } else {
                            timeout = setTimeout(function () {
                                recursiveTimeout(iters - 1);
                            }, 5);
                        }
                    }
                };

                var iterations = 5;
                timeout = setTimeout(function () {
                    recursiveTimeout(5);
                }, PING_TIMEOUT - 5 * iterations);
                crosstab.broadcastMaster('PING');
            } else if (master && master.id === myTab.id) {
                util.events.emit('setupComplete');
            }
        }
    }

    function keepaliveLoop() {
        if (crosstab.supported && !crosstab.stopKeepalive) {
            keepalive();
        }
    }

    // --- Check if crosstab is supported ---
    if (!crosstab.supported) {
        crosstab.broadcast = notSupported;
    } else {
        // ---- Setup Storage Listener
        window.addEventListener('storage', onStorageEvent, false);
        // start with the `beforeunload` event due to IE11
        window.addEventListener('beforeunload', unload, false);
        // swap `beforeunload` to `unload` after DOM is loaded
        window.addEventListener('DOMContentLoaded', swapUnloadEvents, false);

        util.events.on('PING', function (message) {
            // only handle direct messages
            if (!message.destination || message.destination !== crosstab.id) {
                return;
            }

            if (util.now() - message.timestamp < PING_TIMEOUT) {
                crosstab.broadcast('PONG', null, message.origin);
            }
        });

        setInterval(keepaliveLoop, TAB_KEEPALIVE);
        keepaliveLoop();
    }

    module.exports = crosstab;

/*!
 * UMD/AMD/Global context Module Loader wrapper
 *
 * This wrapper will try to use a module loader with the
 * following priority:
 *
 *  1.) AMD
 *  2.) CommonJS
 *  3.) Context Variable (this)
 *    - window in the browser
 *    - module.exports in node and browserify
 */
});})(
    // First arg -- the global object in the browser or node
    typeof window == 'object' ? window : global,
    // Second arg -- the define object
    typeof define == 'function' && define.amd
    ? define
    : (function (context) {
        'use strict';
        return typeof module == 'object' ? function (name, factory) {
            factory(require, exports, module);
        }
        : function (name, factory) {
            var module = {
                exports: {}
            };
            var require = function (n) {
                if (n === 'jquery') {
                    n = 'jQuery';
                }
                return context[n];
            };

            factory(require, module.exports, module);
            context[name] = module.exports;
        };
    })(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
/**
 * @module Array
 */

'use strict';

exports.__esModule = true;

var _util = require('./util');

var _selectorIndex = require('./selector/index');

var ArrayProto = Array.prototype;

/**
 * Checks if the given callback returns a true(-ish) value for each element in the collection.
 *
 * @param {Function} callback Function to execute for each element, invoked with `element` as argument.
 * @param {Object} [thisArg] Value to use as `this` when executing `callback`.
 * @return {Boolean} Whether each element passed the callback check.
 * @example
 *     $('.items').every(function(element) {
 *         return element.hasAttribute('active')
 *     });
 *     // true/false
 */

var every = ArrayProto.every;

/**
 * Filter the collection by selector or function, and return a new collection with the result.
 *
 * @param {String|Function} selector Selector or function to filter the collection.
 * @param {Object} [thisArg] Value to use as `this` when executing `callback`.
 * @return {Object} A new wrapped collection
 * @chainable
 * @example
 *     $('.items').filter('.active');
 * @example
 *     $('.items').filter(function(element) {
 *         return element.hasAttribute('active')
 *     });
 */

function filter(selector, thisArg) {
  var callback = typeof selector === 'function' ? selector : function (element) {
    return _selectorIndex.matches(element, selector);
  };
  return _selectorIndex.$(ArrayProto.filter.call(this, callback, thisArg));
}

/**
 * Execute a function for each element in the collection.
 *
 * @param {Function} callback Function to execute for each element, invoked with `element` as argument.
 * @param {Object} [thisArg] Value to use as `this` when executing `callback`.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.items').forEach(function(element) {
 *         element.style.color = 'evergreen';
 *     );
 */

function forEach(callback, thisArg) {
  return _util.each(this, callback, thisArg);
}

var each = forEach;

/**
 * Returns the index of an element in the collection.
 *
 * @param {Node} element
 * @return {Number} The zero-based index, -1 if not found.
 * @example
 *     $('.items').indexOf(element);
 *     // 2
 */

var indexOf = ArrayProto.indexOf;

/**
 * Create a new collection by executing the callback for each element in the collection.
 *
 * @param {Function} callback Function to execute for each element, invoked with `element` as argument.
 * @param {Object} [thisArg] Value to use as `this` when executing `callback`.
 * @return {Array} Collection with the return value of the executed callback for each element.
 * @example
 *     $('.items').map(function(element) {
 *         return element.getAttribute('name')
 *     });
 *     // ['ever', 'green']
 */

var map = ArrayProto.map;

/**
 * Removes the last element from the collection, and returns that element.
 *
 * @return {Object} The last element from the collection.
 * @example
 *     var lastElement = $('.items').pop();
 */

var pop = ArrayProto.pop;

/**
 * Adds one or more elements to the end of the collection, and returns the new length of the collection.
 *
 * @param {Object} element Element(s) to add to the collection
 * @return {Number} The new length of the collection
 * @example
 *     $('.items').push(element);
 */

var push = ArrayProto.push;

/**
 * Apply a function against each element in the collection, and this accumulator function has to reduce it
 * to a single value.
 *
 * @param {Function} callback Function to execute on each value in the array, taking four arguments (see example).
 * @param {Mixed} initialValue Object to use as the first argument to the first call of the callback.
 * @example
 *     $('.items').reduce(function(previousValue, element, index, collection) {
 *         return previousValue + element.clientHeight;
 *     }, 0);
 *     // [total height of elements]
 */

var reduce = ArrayProto.reduce;

/**
 * Apply a function against each element in the collection (from right-to-left), and this accumulator function has
 * to reduce it to a single value.
 *
 * @param {Function} callback Function to execute on each value in the array, taking four arguments (see example).
 * @param {Mixed} initialValue Object to use as the first argument to the first call of the callback.
 * @example
 *     $('.items').reduceRight(function(previousValue, element, index, collection) {
 *         return previousValue + element.textContent;
 *     }, '')
 *     // [reversed text of elements]
 */

var reduceRight = ArrayProto.reduceRight;

/**
 * Reverses an array in place. The first array element becomes the last and the last becomes the first.
 *
 * @return {Object} The wrapped collection, reversed
 * @chainable
 * @example
 *     $('.items').reverse();
 */

function reverse() {
  return _selectorIndex.$(_util.toArray(this).reverse());
}

/**
 * Removes the first element from the collection, and returns that element.
 *
 * @return {Object} The first element from the collection.
 * @example
 *     var firstElement = $('.items').shift();
 */

var shift = ArrayProto.shift;

/**
 * Checks if the given callback returns a true(-ish) value for any of the elements in the collection.
 *
 * @param {Function} callback Function to execute for each element, invoked with `element` as argument.
 * @return {Boolean} Whether any element passed the callback check.
 * @example
 *     $('.items').some(function(element) {
 *         return element.hasAttribute('active')
 *     });
 *     // true/false
 */

var some = ArrayProto.some;

/**
 * Adds one or more elements to the beginning of the collection, and returns the new length of the collection.
 *
 * @param {Object} element Element(s) to add to the collection
 * @return {Number} The new length of the collection
 * @example
 *     $('.items').unshift(element);
 */

var unshift = ArrayProto.unshift;

/*
 * Export interface
 */

exports.each = each;
exports.every = every;
exports.filter = filter;
exports.forEach = forEach;
exports.indexOf = indexOf;
exports.map = map;
exports.pop = pop;
exports.push = push;
exports.reduce = reduce;
exports.reduceRight = reduceRight;
exports.reverse = reverse;
exports.shift = shift;
exports.some = some;
exports.unshift = unshift;
},{"./selector/index":19,"./util":21}],3:[function(require,module,exports){
/**
 * @module BaseClass
 */

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _selectorIndex = require('./selector/index');

var _util = require('./util');

exports['default'] = function (api) {

    /**
     * Provide subclass for classes or components to extend from.
     * The opposite and successor of plugins (no need to extend `$.fn` anymore, complete control).
     *
     * @return {Class} The class to extend from, including all `$.fn` methods.
     * @example
     *     import { BaseClass } from  'domtastic';
     *
     *     class MyComponent extends BaseClass {
     *         doSomething() {
     *             return this.addClass('.foo');
     *         }
     *     }
     *
     *     let component = new MyComponent('body');
     *     component.doSomething();
     *
     * @example
     *     import $ from  'domtastic';
     *
     *     class MyComponent extends $.BaseClass {
     *         progress(value) {
     *             return this.attr('data-progress', value);
     *         }
     *     }
     *
     *     let component = new MyComponent(document.body);
     *     component.progress('ive').append('<p>enhancement</p>');
     */

    var BaseClass = function BaseClass() {
        _classCallCheck(this, BaseClass);

        _selectorIndex.Wrapper.call(this, _selectorIndex.$.apply(undefined, arguments));
    };

    _util.extend(BaseClass.prototype, api);
    return BaseClass;
};

module.exports = exports['default'];
},{"./selector/index":19,"./util":21}],4:[function(require,module,exports){
/**
 * @module CSS
 */

'use strict';

exports.__esModule = true;

var _util = require('./util');

var isNumeric = function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

var camelize = function camelize(value) {
    return value.replace(/-([\da-z])/gi, function (matches, letter) {
        return letter.toUpperCase();
    });
};

var dasherize = function dasherize(value) {
    return value.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * Get the value of a style property for the first element, or set one or more style properties for each element in the collection.
 *
 * @param {String|Object} key The name of the style property to get or set. Or an object containing key-value pairs to set as style properties.
 * @param {String} [value] The value of the style property to set.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').css('padding-left'); // get
 *     $('.item').css('color', '#f00'); // set
 *     $('.item').css({'border-width': '1px', display: 'inline-block'}); // set multiple
 */

function css(key, value) {

    var styleProps = undefined,
        prop = undefined,
        val = undefined;

    if (typeof key === 'string') {
        key = camelize(key);

        if (typeof value === 'undefined') {
            var element = this.nodeType ? this : this[0];
            if (element) {
                val = element.style[key];
                return isNumeric(val) ? parseFloat(val) : val;
            }
            return undefined;
        }

        styleProps = {};
        styleProps[key] = value;
    } else {
        styleProps = key;
        for (prop in styleProps) {
            val = styleProps[prop];
            delete styleProps[prop];
            styleProps[camelize(prop)] = val;
        }
    }

    _util.each(this, function (element) {
        for (prop in styleProps) {
            if (styleProps[prop] || styleProps[prop] === 0) {
                element.style[prop] = styleProps[prop];
            } else {
                element.style.removeProperty(dasherize(prop));
            }
        }
    });

    return this;
}

/*
 * Export interface
 */

exports.css = css;
},{"./util":21}],5:[function(require,module,exports){
/**
 * @module Attr
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

/**
 * Get the value of an attribute for the first element, or set one or more attributes for each element in the collection.
 *
 * @param {String|Object} key The name of the attribute to get or set. Or an object containing key-value pairs to set as attributes.
 * @param {String} [value] The value of the attribute to set.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').attr('attrName'); // get
 *     $('.item').attr('attrName', 'attrValue'); // set
 *     $('.item').attr({attr1: 'value1', 'attr-2': 'value2'}); // set multiple
 */

function attr(key, value) {

    if (typeof key === 'string' && typeof value === 'undefined') {
        var element = this.nodeType ? this : this[0];
        return element ? element.getAttribute(key) : undefined;
    }

    _util.each(this, function (element) {
        if (typeof key === 'object') {
            for (var _attr in key) {
                element.setAttribute(_attr, key[_attr]);
            }
        } else {
            element.setAttribute(key, value);
        }
    });

    return this;
}

/**
 * Remove attribute from each element in the collection.
 *
 * @param {String} key Attribute name
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.items').removeAttr('attrName');
 */

function removeAttr(key) {
    _util.each(this, function (element) {
        return element.removeAttribute(key);
    });
    return this;
}

/*
 * Export interface
 */

exports.attr = attr;
exports.removeAttr = removeAttr;
},{"../util":21}],6:[function(require,module,exports){
/**
 * @module Class
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

/**
 * Add a class to the element(s)
 *
 * @param {String} value Space-separated class name(s) to add to the element(s).
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').addClass('bar');
 *     $('.item').addClass('bar foo');
 */

function addClass(value) {
    if (value && value.length) {
        _util.each(value.split(' '), _each.bind(this, 'add'));
    }
    return this;
}

/**
 * Remove a class from the element(s)
 *
 * @param {String} value Space-separated class name(s) to remove from the element(s).
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.items').removeClass('bar');
 *     $('.items').removeClass('bar foo');
 */

function removeClass(value) {
    if (value && value.length) {
        _util.each(value.split(' '), _each.bind(this, 'remove'));
    }
    return this;
}

/**
 * Toggle a class at the element(s)
 *
 * @param {String} value Space-separated class name(s) to toggle at the element(s).
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').toggleClass('bar');
 *     $('.item').toggleClass('bar foo');
 */

function toggleClass(value) {
    if (value && value.length) {
        _util.each(value.split(' '), _each.bind(this, 'toggle'));
    }
    return this;
}

/**
 * Check if the element(s) have a class.
 *
 * @param {String} value Check if the DOM element contains the class name. When applied to multiple elements,
 * returns `true` if _any_ of them contains the class name.
 * @return {Boolean} Whether the element's class attribute contains the class name.
 * @example
 *     $('.item').hasClass('bar');
 */

function hasClass(value) {
    return (this.nodeType ? [this] : this).some(function (element) {
        return element.classList.contains(value);
    });
}

/**
 * Specialized iteration, applying `fn` of the classList API to each element.
 *
 * @param {String} fnName
 * @param {String} className
 * @private
 */

function _each(fnName, className) {
    _util.each(this, function (element) {
        return element.classList[fnName](className);
    });
}

/*
 * Export interface
 */

exports.addClass = addClass;
exports.removeClass = removeClass;
exports.toggleClass = toggleClass;
exports.hasClass = hasClass;
},{"../util":21}],7:[function(require,module,exports){
/**
 * @module contains
 */

/**
 * Test whether an element contains another element in the DOM.
 *
 * @param {Element} container The element that may contain the other element.
 * @param {Element} element The element that may be a descendant of the other element.
 * @return {Boolean} Whether the `container` element contains the `element`.
 * @example
 *     $.contains(parentElement, childElement);
 *     // true/false
 */

"use strict";

exports.__esModule = true;
function contains(container, element) {
    if (!container || !element || container === element) {
        return false;
    } else if (container.contains) {
        return container.contains(element);
    } else if (container.compareDocumentPosition) {
        return !(container.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_DISCONNECTED);
    }
    return false;
}

/*
 * Export interface
 */

exports.contains = contains;
},{}],8:[function(require,module,exports){
/**
 * @module Data
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

var DATAKEYPROP = '__DOMTASTIC_DATA__';

/**
 * Get data from first element, or set data for each element in the collection.
 *
 * @param {String} key The key for the data to get or set.
 * @param {String} [value] The data to set.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').data('attrName'); // get
 *     $('.item').data('attrName', {any: 'data'}); // set
 */

function data(key, value) {

    if (typeof key === 'string' && typeof value === 'undefined') {
        var element = this.nodeType ? this : this[0];
        return element && element[DATAKEYPROP] ? element[DATAKEYPROP][key] : undefined;
    }

    _util.each(this, function (element) {
        element[DATAKEYPROP] = element[DATAKEYPROP] || {};
        element[DATAKEYPROP][key] = value;
    });

    return this;
}

/**
 * Get property from first element, or set property on each element in the collection.
 *
 * @param {String} key The name of the property to get or set.
 * @param {String} [value] The value of the property to set.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').prop('attrName'); // get
 *     $('.item').prop('attrName', 'attrValue'); // set
 */

function prop(key, value) {

    if (typeof key === 'string' && typeof value === 'undefined') {
        var element = this.nodeType ? this : this[0];
        return element && element ? element[key] : undefined;
    }

    _util.each(this, function (element) {
        return element[key] = value;
    });

    return this;
}

/*
 * Export interface
 */

exports.data = data;
exports.prop = prop;
},{"../util":21}],9:[function(require,module,exports){
/**
 * @module DOM (extra)
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

var _index = require('./index');

var _selectorIndex = require('../selector/index');

/**
 * Append each element in the collection to the specified element(s).
 *
 * @param {Node|NodeList|Object} element What to append the element(s) to. Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').appendTo(container);
 */

function appendTo(element) {
    var context = typeof element === 'string' ? _selectorIndex.$(element) : element;
    _index.append.call(context, this);
    return this;
}

/*
 * Empty each element in the collection.
 *
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').empty();
 */

function empty() {
    return _util.each(this, function (element) {
        return element.innerHTML = '';
    });
}

/**
 * Remove the collection from the DOM.
 *
 * @return {Array} Array containing the removed elements
 * @example
 *     $('.item').remove();
 */

function remove() {
    return _util.each(this, function (element) {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    });
}

/**
 * Replace each element in the collection with the provided new content, and return the array of elements that were replaced.
 *
 * @return {Array} Array containing the replaced elements
 */

function replaceWith() {
    return _index.before.apply(this, arguments).remove();
}

/**
 * Get the `textContent` from the first, or set the `textContent` of each element in the collection.
 *
 * @param {String} [value]
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').text('New content');
 */

function text(value) {

    if (value === undefined) {
        return this[0].textContent;
    }

    _util.each(this, function (element) {
        return element.textContent = '' + value;
    });

    return this;
}

/**
 * Get the `value` from the first, or set the `value` of each element in the collection.
 *
 * @param {String} [value]
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('input.firstName').value('New value');
 */

function val(value) {

    if (value === undefined) {
        return this[0].value;
    }

    _util.each(this, function (element) {
        return element.value = value;
    });

    return this;
}

/*
 * Export interface
 */

exports.appendTo = appendTo;
exports.empty = empty;
exports.remove = remove;
exports.replaceWith = replaceWith;
exports.text = text;
exports.val = val;
},{"../selector/index":19,"../util":21,"./index":11}],10:[function(require,module,exports){
/**
 * @module HTML
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

/*
 * Get the HTML contents of the first element, or set the HTML contents for each element in the collection.
 *
 * @param {String} [fragment] HTML fragment to set for the element. If this argument is omitted, the HTML contents are returned.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').html();
 *     $('.item').html('<span>more</span>');
 */

function html(fragment) {

  if (typeof fragment !== 'string') {
    var element = this.nodeType ? this : this[0];
    return element ? element.innerHTML : undefined;
  }

  _util.each(this, function (element) {
    return element.innerHTML = fragment;
  });

  return this;
}

/*
 * Export interface
 */

exports.html = html;
},{"../util":21}],11:[function(require,module,exports){
/**
 * @module DOM
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

var _selectorIndex = require('../selector/index');

var forEach = Array.prototype.forEach;

/**
 * Append element(s) to each element in the collection.
 *
 * @param {String|Node|NodeList|Object} element What to append to the element(s).
 * Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').append('<p>more</p>');
 */

function append(element) {
    if (this instanceof Node) {
        if (typeof element === 'string') {
            this.insertAdjacentHTML('beforeend', element);
        } else {
            if (element instanceof Node) {
                this.appendChild(element);
            } else {
                var elements = element instanceof NodeList ? _util.toArray(element) : element;
                forEach.call(elements, this.appendChild.bind(this));
            }
        }
    } else {
        _each(this, append, element);
    }
    return this;
}

/**
 * Place element(s) at the beginning of each element in the collection.
 *
 * @param {String|Node|NodeList|Object} element What to place at the beginning of the element(s).
 * Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').prepend('<span>start</span>');
 */

function prepend(element) {
    if (this instanceof Node) {
        if (typeof element === 'string') {
            this.insertAdjacentHTML('afterbegin', element);
        } else {
            if (element instanceof Node) {
                this.insertBefore(element, this.firstChild);
            } else {
                var elements = element instanceof NodeList ? _util.toArray(element) : element;
                forEach.call(elements.reverse(), prepend.bind(this));
            }
        }
    } else {
        _each(this, prepend, element);
    }
    return this;
}

/**
 * Place element(s) before each element in the collection.
 *
 * @param {String|Node|NodeList|Object} element What to place as sibling(s) before to the element(s).
 * Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.items').before('<p>prefix</p>');
 */

function before(element) {
    if (this instanceof Node) {
        if (typeof element === 'string') {
            this.insertAdjacentHTML('beforebegin', element);
        } else {
            if (element instanceof Node) {
                this.parentNode.insertBefore(element, this);
            } else {
                var elements = element instanceof NodeList ? _util.toArray(element) : element;
                forEach.call(elements, before.bind(this));
            }
        }
    } else {
        _each(this, before, element);
    }
    return this;
}

/**
 * Place element(s) after each element in the collection.
 *
 * @param {String|Node|NodeList|Object} element What to place as sibling(s) after to the element(s). Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.items').after('<span>suf</span><span>fix</span>');
 */

function after(element) {
    if (this instanceof Node) {
        if (typeof element === 'string') {
            this.insertAdjacentHTML('afterend', element);
        } else {
            if (element instanceof Node) {
                this.parentNode.insertBefore(element, this.nextSibling);
            } else {
                var elements = element instanceof NodeList ? _util.toArray(element) : element;
                forEach.call(elements.reverse(), after.bind(this));
            }
        }
    } else {
        _each(this, after, element);
    }
    return this;
}

/**
 * Clone a wrapped object.
 *
 * @return {Object} Wrapped collection of cloned nodes.
 * @example
 *     $(element).clone();
 */

function clone() {
    return _selectorIndex.$(_clone(this));
}

/**
 * Clone an object
 *
 * @param {String|Node|NodeList|Array} element The element(s) to clone.
 * @return {String|Node|NodeList|Array} The cloned element(s)
 * @private
 */

function _clone(element) {
    if (typeof element === 'string') {
        return element;
    } else if (element instanceof Node) {
        return element.cloneNode(true);
    } else if ('length' in element) {
        return [].map.call(element, function (el) {
            return el.cloneNode(true);
        });
    }
    return element;
}

/**
 * Specialized iteration, applying `fn` in reversed manner to a clone of each element, but the provided one.
 *
 * @param {NodeList|Array} collection
 * @param {Function} fn
 * @param {Node} element
 * @private
 */

function _each(collection, fn, element) {
    var l = collection.length;
    while (l--) {
        var elm = l === 0 ? element : _clone(element);
        fn.call(collection[l], elm);
    }
}

/*
 * Export interface
 */

exports.append = append;
exports.prepend = prepend;
exports.before = before;
exports.after = after;
exports.clone = clone;
},{"../selector/index":19,"../util":21}],12:[function(require,module,exports){
/**
 * @module Events
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

var _selectorClosest = require('../selector/closest');

/**
 * Shorthand for `addEventListener`. Supports event delegation if a filter (`selector`) is provided.
 *
 * @param {String} eventNames List of space-separated event types to be added to the element(s)
 * @param {String} [selector] Selector to filter descendants that delegate the event to this element.
 * @param {Function} handler Event handler
 * @param {Boolean} useCapture=false
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').on('click', callback);
 *     $('.container').on('click focus', '.item', handler);
 */

function on(eventNames, selector, handler, useCapture, once) {
    var _this = this;

    if (typeof selector === 'function') {
        handler = selector;
        selector = null;
    }

    var parts = undefined,
        namespace = undefined,
        eventListener = undefined;

    eventNames.split(' ').forEach(function (eventName) {

        parts = eventName.split('.');
        eventName = parts[0] || null;
        namespace = parts[1] || null;

        eventListener = proxyHandler(handler);

        _util.each(_this, function (element) {

            if (selector) {
                eventListener = delegateHandler.bind(element, selector, eventListener);
            }

            if (once) {
                (function () {
                    var listener = eventListener;
                    eventListener = function (event) {
                        off.call(element, eventNames, selector, handler, useCapture);
                        listener.call(element, event);
                    };
                })();
            }

            element.addEventListener(eventName, eventListener, useCapture || false);

            getHandlers(element).push({
                eventName: eventName,
                handler: handler,
                eventListener: eventListener,
                selector: selector,
                namespace: namespace
            });
        });
    }, this);

    return this;
}

/**
 * Shorthand for `removeEventListener`.
 *
 * @param {String} eventNames List of space-separated event types to be removed from the element(s)
 * @param {String} [selector] Selector to filter descendants that undelegate the event to this element.
 * @param {Function} handler Event handler
 * @param {Boolean} useCapture=false
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').off('click', callback);
 *     $('#my-element').off('myEvent myOtherEvent');
 *     $('.item').off();
 */

function off(eventNames, selector, handler, useCapture) {
    if (eventNames === undefined) eventNames = '';

    var _this2 = this;

    if (typeof selector === 'function') {
        handler = selector;
        selector = null;
    }

    var parts = undefined,
        namespace = undefined,
        handlers = undefined;

    eventNames.split(' ').forEach(function (eventName) {

        parts = eventName.split('.');
        eventName = parts[0] || null;
        namespace = parts[1] || null;

        _util.each(_this2, function (element) {

            handlers = getHandlers(element);

            _util.each(handlers.filter(function (item) {
                return (!eventName || item.eventName === eventName) && (!namespace || item.namespace === namespace) && (!handler || item.handler === handler) && (!selector || item.selector === selector);
            }), function (item) {
                element.removeEventListener(item.eventName, item.eventListener, useCapture || false);
                handlers.splice(handlers.indexOf(item), 1);
            });

            if (!eventName && !namespace && !selector && !handler) {
                clearHandlers(element);
            } else if (handlers.length === 0) {
                clearHandlers(element);
            }
        });
    }, this);

    return this;
}

/**
 * Add event listener and execute the handler at most once per element.
 *
 * @param eventNames
 * @param selector
 * @param handler
 * @param useCapture
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').one('click', callback);
 */

function one(eventNames, selector, handler, useCapture) {
    return on.call(this, eventNames, selector, handler, useCapture, 1);
}

/**
 * Get event handlers from an element
 *
 * @private
 * @param {Node} element
 * @return {Array}
 */

var eventKeyProp = '__domtastic_event__';
var id = 1;
var handlers = {};
var unusedKeys = [];

function getHandlers(element) {
    if (!element[eventKeyProp]) {
        element[eventKeyProp] = unusedKeys.length === 0 ? ++id : unusedKeys.pop();
    }
    var key = element[eventKeyProp];
    return handlers[key] || (handlers[key] = []);
}

/**
 * Clear event handlers for an element
 *
 * @private
 * @param {Node} element
 */

function clearHandlers(element) {
    var key = element[eventKeyProp];
    if (handlers[key]) {
        handlers[key] = null;
        element[key] = null;
        unusedKeys.push(key);
    }
}

/**
 * Function to create a handler that augments the event object with some extra methods,
 * and executes the callback with the event and the event data (i.e. `event.detail`).
 *
 * @private
 * @param handler Callback to execute as `handler(event, data)`
 * @return {Function}
 */

function proxyHandler(handler) {
    return function (event) {
        handler.call(this, augmentEvent(event), event.detail);
    };
}

/**
 * Attempt to augment events and implement something closer to DOM Level 3 Events.
 *
 * @private
 * @param {Object} event
 * @return {Function}
 */

var augmentEvent = (function () {

    var methodName = undefined,
        eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
    },
        returnTrue = function returnTrue() {
        return true;
    },
        returnFalse = function returnFalse() {
        return false;
    };

    return function (event) {
        if (!event.isDefaultPrevented || event.stopImmediatePropagation || event.stopPropagation) {
            for (methodName in eventMethods) {
                (function (methodName, testMethodName, originalMethod) {
                    event[methodName] = function () {
                        this[testMethodName] = returnTrue;
                        return originalMethod && originalMethod.apply(this, arguments);
                    };
                    event[testMethodName] = returnFalse;
                })(methodName, eventMethods[methodName], event[methodName]);
            }
            if (event._preventDefault) {
                event.preventDefault();
            }
        }
        return event;
    };
})();

/**
 * Function to test whether delegated events match the provided `selector` (filter),
 * if the event propagation was stopped, and then actually call the provided event handler.
 * Use `this` instead of `event.currentTarget` on the event object.
 *
 * @private
 * @param {String} selector Selector to filter descendants that undelegate the event to this element.
 * @param {Function} handler Event handler
 * @param {Event} event
 */

function delegateHandler(selector, handler, event) {
    var eventTarget = event._target || event.target,
        currentTarget = _selectorClosest.closest.call([eventTarget], selector, this)[0];
    if (currentTarget && currentTarget !== this) {
        if (currentTarget === eventTarget || !(event.isPropagationStopped && event.isPropagationStopped())) {
            handler.call(currentTarget, event);
        }
    }
}

var bind = on,
    unbind = off;

/*
 * Export interface
 */

exports.on = on;
exports.off = off;
exports.one = one;
exports.bind = bind;
exports.unbind = unbind;
},{"../selector/closest":17,"../util":21}],13:[function(require,module,exports){
/**
 * @module Ready
 */

/**
 * Execute callback when `DOMContentLoaded` fires for `document`, or immediately if called afterwards.
 *
 * @param handler Callback to execute when initial DOM content is loaded.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $(document).ready(callback);
 */

'use strict';

exports.__esModule = true;
function ready(handler) {
  if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
    handler();
  } else {
    document.addEventListener('DOMContentLoaded', handler, false);
  }
  return this;
}

/*
 * Export interface
 */

exports.ready = ready;
},{}],14:[function(require,module,exports){
/**
 * @module trigger
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

var _domContains = require('../dom/contains');

var reMouseEvent = /^(?:mouse|pointer|contextmenu)|click/;
var reKeyEvent = /^key/;

/**
 * Trigger event at element(s)
 *
 * @param {String} type Type of the event
 * @param {Object} data Data to be sent with the event (`params.detail` will be set to this).
 * @param {Object} [params] Event parameters (optional)
 * @param {Boolean} params.bubbles=true Does the event bubble up through the DOM or not.
 * @param {Boolean} params.cancelable=true Is the event cancelable or not.
 * @param {Mixed} params.detail=undefined Additional information about the event.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').trigger('anyEventType');
 */

function trigger(type, data) {
    var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var _ref$bubbles = _ref.bubbles;
    var bubbles = _ref$bubbles === undefined ? true : _ref$bubbles;
    var _ref$cancelable = _ref.cancelable;
    var cancelable = _ref$cancelable === undefined ? true : _ref$cancelable;
    var _ref$preventDefault = _ref.preventDefault;
    var preventDefault = _ref$preventDefault === undefined ? false : _ref$preventDefault;

    var EventConstructor = getEventConstructor(type),
        event = new EventConstructor(type, { bubbles: bubbles, cancelable: cancelable, preventDefault: preventDefault, detail: data });

    event._preventDefault = preventDefault;

    _util.each(this, function (element) {
        if (!bubbles || isEventBubblingInDetachedTree || isAttachedToDocument(element)) {
            dispatchEvent(element, event);
        } else {
            triggerForPath(element, type, { bubbles: bubbles, cancelable: cancelable, preventDefault: preventDefault, detail: data });
        }
    });
    return this;
}

function getEventConstructor(type) {
    return supportsOtherEventConstructors ? reMouseEvent.test(type) ? MouseEvent : reKeyEvent.test(type) ? KeyboardEvent : CustomEvent : CustomEvent;
}

/**
 * Trigger event at first element in the collection. Similar to `trigger()`, except:
 *
 * - Event does not bubble
 * - Default event behavior is prevented
 * - Only triggers handler for first matching element
 *
 * @param {String} type Type of the event
 * @param {Object} data Data to be sent with the event
 * @example
 *     $('form').triggerHandler('submit');
 */

function triggerHandler(type, data) {
    if (this[0]) {
        trigger.call(this[0], type, data, { bubbles: false, preventDefault: true });
    }
}

/**
 * Check whether the element is attached to (or detached from) the document
 *
 * @private
 * @param {Node} element Element to test
 * @return {Boolean}
 */

function isAttachedToDocument(element) {
    if (element === window || element === document) {
        return true;
    }
    return _domContains.contains(element.ownerDocument.documentElement, element);
}

/**
 * Dispatch the event at the element and its ancestors.
 * Required to support delegated events in browsers that don't bubble events in detached DOM trees.
 *
 * @private
 * @param {Node} element First element to dispatch the event at
 * @param {String} type Type of the event
 * @param {Object} [params] Event parameters (optional)
 * @param {Boolean} params.bubbles=true Does the event bubble up through the DOM or not.
 * Will be set to false (but shouldn't matter since events don't bubble anyway).
 * @param {Boolean} params.cancelable=true Is the event cancelable or not.
 * @param {Mixed} params.detail=undefined Additional information about the event.
 */

function triggerForPath(element, type) {
    var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    params.bubbles = false;
    var event = new CustomEvent(type, params);
    event._target = element;
    do {
        dispatchEvent(element, event);
    } while (element = element.parentNode);
}

/**
 * Dispatch event to element, but call direct event methods instead if available
 * (e.g. "blur()", "submit()") and if the event is non-cancelable.
 *
 * @private
 * @param {Node} element Element to dispatch the event at
 * @param {Object} event Event to dispatch
 */

var directEventMethods = ['blur', 'focus', 'select', 'submit'];

function dispatchEvent(element, event) {
    if (directEventMethods.indexOf(event.type) !== -1 && typeof element[event.type] === 'function' && !event._preventDefault && !event.cancelable) {
        element[event.type]();
    } else {
        element.dispatchEvent(event);
    }
}

/**
 * Polyfill for CustomEvent, borrowed from [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill).
 * Needed to support IE (9, 10, 11) & PhantomJS
 */

(function () {
    function CustomEvent(event) {
        var params = arguments.length <= 1 || arguments[1] === undefined ? { bubbles: false, cancelable: false, detail: undefined } : arguments[1];

        var customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return customEvent;
    }

    CustomEvent.prototype = _util.global.CustomEvent && _util.global.CustomEvent.prototype;
    _util.global.CustomEvent = CustomEvent;
})();

/*
 * Are events bubbling in detached DOM trees?
 * @private
 */

var isEventBubblingInDetachedTree = (function () {
    var isBubbling = false,
        doc = _util.global.document;
    if (doc) {
        var _parent = doc.createElement('div'),
            child = _parent.cloneNode();
        _parent.appendChild(child);
        _parent.addEventListener('e', function () {
            isBubbling = true;
        });
        child.dispatchEvent(new CustomEvent('e', { bubbles: true }));
    }
    return isBubbling;
})();

var supportsOtherEventConstructors = (function () {
    try {
        new window.MouseEvent('click');
    } catch (e) {
        return false;
    }
    return true;
})();

/*
 * Export interface
 */

exports.trigger = trigger;
exports.triggerHandler = triggerHandler;
},{"../dom/contains":7,"../util":21}],15:[function(require,module,exports){
/**
 * @module API
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _util = require('./util');

// Import modules to build up the API

var _array = require('./array');

var array = _interopRequireWildcard(_array);

var _baseClass = require('./baseClass');

var _baseClass2 = _interopRequireDefault(_baseClass);

var _domAttr = require('./dom/attr');

var attr = _interopRequireWildcard(_domAttr);

var _domClass = require('./dom/class');

var class_ = _interopRequireWildcard(_domClass);

var _domContains = require('./dom/contains');

var contains = _interopRequireWildcard(_domContains);

var _css = require('./css');

var css = _interopRequireWildcard(_css);

var _domData = require('./dom/data');

var data = _interopRequireWildcard(_domData);

var _domIndex = require('./dom/index');

var dom = _interopRequireWildcard(_domIndex);

var _domExtra = require('./dom/extra');

var dom_extra = _interopRequireWildcard(_domExtra);

var _eventIndex = require('./event/index');

var event = _interopRequireWildcard(_eventIndex);

var _domHtml = require('./dom/html');

var html = _interopRequireWildcard(_domHtml);

var _noconflict = require('./noconflict');

var noconflict = _interopRequireWildcard(_noconflict);

var _eventReady = require('./event/ready');

var ready = _interopRequireWildcard(_eventReady);

var _selectorIndex = require('./selector/index');

var selector = _interopRequireWildcard(_selectorIndex);

var _selectorClosest = require('./selector/closest');

var closest = _interopRequireWildcard(_selectorClosest);

var _selectorExtra = require('./selector/extra');

var selector_extra = _interopRequireWildcard(_selectorExtra);

var _eventTrigger = require('./event/trigger');

var trigger = _interopRequireWildcard(_eventTrigger);

var _type = require('./type');

var type = _interopRequireWildcard(_type);

var api = {},
    $ = {};

if (typeof selector !== 'undefined') {
    $ = selector.$;
    $.matches = selector.matches;
    api.find = selector.find;
}

_util.extend($, contains, noconflict, type);
_util.extend(api, array, attr, class_, closest, css, data, dom, dom_extra, event, html, ready, selector_extra, trigger);

$.fn = api;

// Version

$.version = '0.12.0';

// Util

$.extend = _util.extend;

// Provide base class to extend from

if (typeof _baseClass2['default'] !== 'undefined') {
    $.BaseClass = _baseClass2['default']($.fn);
}

// Ugly interoperability hack, to prevent potential ES6 import issues

$['default'] = $;

// Export interface

exports['default'] = $;
module.exports = exports['default'];
},{"./array":2,"./baseClass":3,"./css":4,"./dom/attr":5,"./dom/class":6,"./dom/contains":7,"./dom/data":8,"./dom/extra":9,"./dom/html":10,"./dom/index":11,"./event/index":12,"./event/ready":13,"./event/trigger":14,"./noconflict":16,"./selector/closest":17,"./selector/extra":18,"./selector/index":19,"./type":20,"./util":21}],16:[function(require,module,exports){
/**
 * @module noConflict
 */

'use strict';

exports.__esModule = true;

var _util = require('./util');

/*
 * Save the previous value of the global `$` variable, so that it can be restored later on.
 * @private
 */

var previousLib = _util.global.$;

/**
 * In case another library sets the global `$` variable before DOMtastic does,
 * this method can be used to return the global `$` to that other library.
 *
 * @return {Object} Reference to DOMtastic.
 * @example
 *     var domtastic = $.noConflict();
 */

function noConflict() {
  _util.global.$ = previousLib;
  return this;
}

/*
 * Export interface
 */

exports.noConflict = noConflict;
},{"./util":21}],17:[function(require,module,exports){
/**
 * @module closest
 */

'use strict';

exports.__esModule = true;

var _index = require('./index');

var _util = require('../util');

/**
 * Return the closest element matching the selector (starting by itself) for each element in the collection.
 *
 * @param {String} selector Filter
 * @param {Object} [context] If provided, matching elements must be a descendant of this element
 * @return {Object} New wrapped collection (containing zero or one element)
 * @chainable
 * @example
 *     $('.selector').closest('.container');
 */

var closest = (function () {

    function closest(selector, context) {
        var nodes = [];
        _util.each(this, function (node) {
            while (node && node !== context) {
                if (_index.matches(node, selector)) {
                    nodes.push(node);
                    break;
                }
                node = node.parentElement;
            }
        });
        return _index.$(_util.uniq(nodes));
    }

    return !Element.prototype.closest ? closest : function (selector, context) {
        var _this = this;

        if (!context) {
            var _ret = (function () {
                var nodes = [];
                _util.each(_this, function (node) {
                    var n = node.closest(selector);
                    if (n) {
                        nodes.push(n);
                    }
                });
                return {
                    v: _index.$(_util.uniq(nodes))
                };
            })();

            if (typeof _ret === 'object') return _ret.v;
        } else {
            return closest.call(this, selector, context);
        }
    };
})();

/*
 * Export interface
 */

exports.closest = closest;
},{"../util":21,"./index":19}],18:[function(require,module,exports){
/**
 * @module Selector (extra)
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

var _index = require('./index');

/**
 * Return children of each element in the collection, optionally filtered by a selector.
 *
 * @param {String} [selector] Filter
 * @return {Object} New wrapped collection
 * @chainable
 * @example
 *     $('.selector').children();
 *     $('.selector').children('.filter');
 */

function children(selector) {
    var nodes = [];
    _util.each(this, function (element) {
        if (element.children) {
            _util.each(element.children, function (child) {
                if (!selector || selector && _index.matches(child, selector)) {
                    nodes.push(child);
                }
            });
        }
    });
    return _index.$(nodes);
}

/**
 * Return child nodes of each element in the collection, including text and comment nodes.
 *
 * @return {Object} New wrapped collection
 * @example
 *     $('.selector').contents();
 */

function contents() {
    var nodes = [];
    _util.each(this, function (element) {
        nodes.push.apply(nodes, _util.toArray(element.childNodes));
    });
    return _index.$(nodes);
}

/**
 * Return a collection containing only the one at the specified index.
 *
 * @param {Number} index
 * @return {Object} New wrapped collection
 * @chainable
 * @example
 *     $('.items').eq(1)
 *     // The second item; result is the same as doing $($('.items')[1]);
 */

function eq(index) {
    return slice.call(this, index, index + 1);
}

/**
 * Return the DOM element at the specified index.
 *
 * @param {Number} index
 * @return {Node} Element at the specified index
 * @example
 *     $('.items').get(1)
 *     // The second element; result is the same as doing $('.items')[1];
 */

function get(index) {
    return this[index];
}

/**
 * Return the parent elements of each element in the collection, optionally filtered by a selector.
 *
 * @param {String} [selector] Filter
 * @return {Object} New wrapped collection
 * @chainable
 * @example
 *     $('.selector').parent();
 *     $('.selector').parent('.filter');
 */

function parent(selector) {
    var nodes = [];
    _util.each(this, function (element) {
        if (!selector || selector && _index.matches(element.parentNode, selector)) {
            nodes.push(element.parentNode);
        }
    });
    return _index.$(nodes);
}

/**
 * Return the sibling elements of each element in the collection, optionally filtered by a selector.
 *
 * @param {String} [selector] Filter
 * @return {Object} New wrapped collection
 * @chainable
 * @example
 *     $('.selector').siblings();
 *     $('.selector').siblings('.filter');
 */

function siblings(selector) {
    var nodes = [];
    _util.each(this, function (element) {
        _util.each(element.parentNode.children, function (sibling) {
            if (sibling !== element && (!selector || selector && _index.matches(sibling, selector))) {
                nodes.push(sibling);
            }
        });
    });
    return _index.$(nodes);
}

/**
 * Create a new, sliced collection.
 *
 * @param {Number} start
 * @param {Number} end
 * @return {Object} New wrapped collection
 * @example
 *     $('.items').slice(1, 3)
 *     // New wrapped collection containing the second, third, and fourth element.
 */

function slice(start, end) {
    return _index.$([].slice.apply(this, arguments));
}

/*
 * Export interface
 */

exports.children = children;
exports.contents = contents;
exports.eq = eq;
exports.get = get;
exports.parent = parent;
exports.siblings = siblings;
exports.slice = slice;
},{"../util":21,"./index":19}],19:[function(require,module,exports){
/**
 * @module Selector
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

var isPrototypeSet = false;

var reFragment = /^\s*<(\w+|!)[^>]*>/;
var reSingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
var reSimpleSelector = /^[\.#]?[\w-]*$/;

/*
 * Versatile wrapper for `querySelectorAll`.
 *
 * @param {String|Node|NodeList|Array} selector Query selector, `Node`, `NodeList`, array of elements, or HTML fragment string.
 * @param {String|Node|NodeList} context=document The context for the selector to query elements.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     var $items = $(.items');
 * @example
 *     var $element = $(domElement);
 * @example
 *     var $list = $(nodeList, document.body);
 * @example
 *     var $element = $('<p>evergreen</p>');
 */

function $(selector) {
    var context = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];

    var collection = undefined;

    if (!selector) {

        collection = document.querySelectorAll(null);
    } else if (selector instanceof Wrapper) {

        return selector;
    } else if (typeof selector !== 'string') {

        collection = selector.nodeType || selector === window ? [selector] : selector;
    } else if (reFragment.test(selector)) {

        collection = createFragment(selector);
    } else {

        context = typeof context === 'string' ? document.querySelector(context) : context.length ? context[0] : context;

        collection = querySelector(selector, context);
    }

    return wrap(collection);
}

/*
 * Find descendants matching the provided `selector` for each element in the collection.
 *
 * @param {String|Node|NodeList|Array} selector Query selector, `Node`, `NodeList`, array of elements, or HTML fragment string.
 * @return {Object} The wrapped collection
 * @example
 *     $('.selector').find('.deep').$('.deepest');
 */

function find(selector) {
    var nodes = [];
    _util.each(this, function (node) {
        _util.each(querySelector(selector, node), function (child) {
            if (nodes.indexOf(child) === -1) {
                nodes.push(child);
            }
        });
    });
    return $(nodes);
}

/*
 * Returns `true` if the element would be selected by the specified selector string; otherwise, returns `false`.
 *
 * @param {Node} element Element to test
 * @param {String} selector Selector to match against element
 * @return {Boolean}
 *
 * @example
 *     $.matches(element, '.match');
 */

var matches = (function () {
    var context = typeof Element !== 'undefined' ? Element.prototype : _util.global,
        _matches = context.matches || context.matchesSelector || context.mozMatchesSelector || context.msMatchesSelector || context.oMatchesSelector || context.webkitMatchesSelector;
    return function (element, selector) {
        return _matches.call(element, selector);
    };
})();

/*
 * Use the faster `getElementById`, `getElementsByClassName` or `getElementsByTagName` over `querySelectorAll` if possible.
 *
 * @private
 * @param {String} selector Query selector.
 * @param {Node} context The context for the selector to query elements.
 * @return {Object} NodeList, HTMLCollection, or Array of matching elements (depending on method used).
 */

function querySelector(selector, context) {

    var isSimpleSelector = reSimpleSelector.test(selector);

    if (isSimpleSelector) {
        if (selector[0] === '#') {
            var element = (context.getElementById ? context : document).getElementById(selector.slice(1));
            return element ? [element] : [];
        }
        if (selector[0] === '.') {
            return context.getElementsByClassName(selector.slice(1));
        }
        return context.getElementsByTagName(selector);
    }

    return context.querySelectorAll(selector);
}

/*
 * Create DOM fragment from an HTML string
 *
 * @private
 * @param {String} html String representing HTML.
 * @return {NodeList}
 */

function createFragment(html) {

    if (reSingleTag.test(html)) {
        return [document.createElement(RegExp.$1)];
    }

    var elements = [],
        container = document.createElement('div'),
        children = container.childNodes;

    container.innerHTML = html;

    for (var i = 0, l = children.length; i < l; i++) {
        elements.push(children[i]);
    }

    return elements;
}

/*
 * Calling `$(selector)` returns a wrapped collection of elements.
 *
 * @private
 * @param {NodeList|Array} collection Element(s) to wrap.
 * @return (Object) The wrapped collection
 */

function wrap(collection) {

    if (!isPrototypeSet) {
        Wrapper.prototype = $.fn;
        Wrapper.prototype.constructor = Wrapper;
        isPrototypeSet = true;
    }

    return new Wrapper(collection);
}

/*
 * Constructor for the Object.prototype strategy
 *
 * @constructor
 * @private
 * @param {NodeList|Array} collection Element(s) to wrap.
 */

function Wrapper(collection) {
    var i = 0,
        length = collection.length;
    for (; i < length;) {
        this[i] = collection[i++];
    }
    this.length = length;
}

/*
 * Export interface
 */

exports.$ = $;
exports.find = find;
exports.matches = matches;
exports.Wrapper = Wrapper;
},{"../util":21}],20:[function(require,module,exports){
/**
 * @module Type
 */

/*
 * Determine if the argument passed is a Javascript function object.
 *
 * @param {Object} [obj] Object to test whether or not it is a function.
 * @return {boolean}
 * @example
 *     $.isFunction(function(){});
 *     // true
 * @example
 *     $.isFunction({});
 *     // false
 */

'use strict';

exports.__esModule = true;
var isFunction = function isFunction(obj) {
  return typeof obj === 'function';
};

/*
 * Determine whether the argument is an array.
 *
 * @param {Object} [obj] Object to test whether or not it is an array.
 * @return {boolean}
 * @example
 *     $.isArray([]);
 *     // true
 * @example
 *     $.isArray({});
 *     // false
 */

var isArray = Array.isArray;

/*
 * Export interface
 */

exports.isArray = isArray;
exports.isFunction = isFunction;
},{}],21:[function(require,module,exports){
/*
 * @module Util
 */

/*
 * Reference to the global scope
 * @private
 */

"use strict";

exports.__esModule = true;
var global = new Function("return this")();

/**
 * Convert `NodeList` to `Array`.
 *
 * @param {NodeList|Array} collection
 * @return {Array}
 * @private
 */

function toArray(collection) {
    var length = collection.length,
        result = new Array(length);
    for (var i = 0; i < length; i++) {
        result[i] = collection[i];
    }
    return result;
}

/**
 * Faster alternative to [].forEach method
 *
 * @param {Node|NodeList|Array} collection
 * @param {Function} callback
 * @return {Node|NodeList|Array}
 * @private
 */

function each(collection, callback, thisArg) {
    var length = collection.length;
    if (length !== undefined && collection.nodeType === undefined) {
        for (var i = 0; i < length; i++) {
            callback.call(thisArg, collection[i], i, collection);
        }
    } else {
        callback.call(thisArg, collection, 0, collection);
    }
    return collection;
}

/**
 * Assign enumerable properties from source object(s) to target object
 *
 * @method extend
 * @param {Object} target Object to extend
 * @param {Object} [source] Object to extend from
 * @return {Object} Extended object
 * @example
 *     $.extend({a: 1}, {b: 2});
 *     // {a: 1, b: 2}
 * @example
 *     $.extend({a: 1}, {b: 2}, {a: 3});
 *     // {a: 3, b: 2}
 */

function extend(target) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        sources[_key - 1] = arguments[_key];
    }

    sources.forEach(function (src) {
        for (var prop in src) {
            target[prop] = src[prop];
        }
    });
    return target;
}

/**
 * Return the collection without duplicates
 *
 * @param collection Collection to remove duplicates from
 * @return {Node|NodeList|Array}
 * @private
 */

var uniq = function uniq(collection) {
    return collection.filter(function (item, index) {
        return collection.indexOf(item) === index;
    });
};

/*
 * Export interface
 */

exports.global = global;
exports.toArray = toArray;
exports.each = each;
exports.extend = extend;
exports.uniq = uniq;
},{}],22:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],23:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],24:[function(require,module,exports){
"use strict";

// player state constants

module.exports = {
    unstarted: -1,
    ended: 0,
    playing: 1,
    pause: 2,
    buffering: 3,
    loading: 6
};

},{}],25:[function(require,module,exports){
'use strict';

module.exports = function (url, callback) {

    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
};

},{}],26:[function(require,module,exports){
"use strict";

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

module.exports = function () {
    function Ticker(callback, interval) {
        _classCallCheck(this, Ticker);

        this.isActive = false;
        this.cycler = null;

        this.callback = callback || null;
        this.interval = interval || 1000;
    }

    _createClass(Ticker, [{
        key: "start",
        value: function start() {
            this.isActive = true;
            this.do();
        }
    }, {
        key: "do",
        value: function _do() {

            if (!this.isActive) {
                return false;
            }

            if (this.callback !== null) {
                this.callback();

                this.cycler = setTimeout(this.do.bind(this), this.interval);
            }
        }
    }, {
        key: "stop",
        value: function stop() {
            this.isActive = false;

            clearTimeout(this.cycler);
        }
    }]);

    return Ticker;
}();

},{}],27:[function(require,module,exports){
'use strict';

/* Dependencies */

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var $ = require('domtastic');
var extend = require('extend');
var _ = require('underscore');

var Ticker = require('./helper/ticker');
var SplitPlayerVideo = window.SplitPlayerVideo = require('./video/');
var SplitPlayerPlugins = require('./plugins/');

var playerState = require('./constants.js');

var SplitPlayer = function () {
    function SplitPlayer(settings) {
        _classCallCheck(this, SplitPlayer);

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
    }

    _createClass(SplitPlayer, [{
        key: 'mount',
        value: function mount() {
            this.create();

            // hook mount for plugins
            this.hook('mount');
        }
    }, {
        key: 'create',
        value: function create() {
            this._render();
            this.addVideos(this.settings.videos);
        }

        /*
         * add Plugins
         */

    }, {
        key: 'addPlugin',
        value: function addPlugin(Plugin, settings) {
            var _instance = new Plugin(this, settings || {});
            this.plugins.push(_instance);
            return _instance;
        }
    }, {
        key: '_onVideoDependeciesReady',
        value: function _onVideoDependeciesReady() {
            // set loading state
            this.playerStateIs = playerState.loading;

            // call hook, all dependencies loaded
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.videos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var video = _step.value;

                    video.mount();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this._dependenciesLoaded = true;

            console.info('api loaded');
        }
    }, {
        key: 'addVideos',
        value: function addVideos(videos) {

            // iterate
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = videos[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var video = _step2.value;

                    // trigger add
                    var addedVideo = this.addVideo(video);

                    // if added and all dependencies loaded, mount video
                    if (addedVideo !== false && this._dependenciesLoaded) {
                        addedVideo.mount();
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return this;
        }
    }, {
        key: 'addVideo',
        value: function addVideo(video) {

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
        }
    }, {
        key: 'getVideo',
        value: function getVideo(videoId) {
            // get video from array
            var result = _.find(this.videos, function (video) {
                return video.settings.videoId === videoId;
            });

            return result || false;
        }

        // destroy all videos and player himself

    }, {
        key: 'destroy',
        value: function destroy() {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.videos[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var video = _step3.value;

                    this.destroyVideo(video.settings.videoId);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            this.duration = 0;

            // hook destroy for plugins
            this.hook('destroy');

            this.$dom.remove();
        }
    }, {
        key: 'destroyVideo',
        value: function destroyVideo(videoId) {
            // first remove video from player list
            var video = this.getVideo(videoId);

            if (!video) {
                return false;
            }

            // destory video
            video.destroy();

            this.removeVideo(videoId);

            return true;
        }
    }, {
        key: 'empty',
        value: function empty() {
            this.duration = 0;
            this.stop();

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
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }, {
        key: 'removeVideos',
        value: function removeVideos(videoIdArray) {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = videoIdArray[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var videoId = _step5.value;

                    this.removeVideo(videoId);
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        }
    }, {
        key: 'removeVideo',
        value: function removeVideo(videoId) {

            var video = this.getVideo(videoId);

            // if there is a video
            if (!video) {
                return false;
            }

            // remove it from array
            this.videos = _.without(this.videos, video);

            // reinit playerDuration
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this.videos[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var current = _step6.value;

                    current.setPlayerDuration();
                }

                // and set readyCount one lower;
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            this.readyCount--;

            video = null;
            return true;
        }

        /*
         * called after all video player ready initialized
         */

    }, {
        key: 'onReady',
        value: function onReady() {

            this.readyCount++;

            // prevent if not all videos ready
            if (this.readyCount !== this.videos.length) {
                return console.info('videos not ready yet');
            }
            this.playerStateIs = playerState.ready;
            this.stop();
            // hook onReady for plugins
            this.hook('onReady');
        }
    }, {
        key: 'onUpdate',
        value: function onUpdate() {
            // hook onUpdate for plugins
            this.hook('onUpdate');
        }
    }, {
        key: 'changeState',
        value: function changeState(state) {

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
        }
    }, {
        key: 'getPlayedTime',
        value: function getPlayedTime() {
            var _Math;

            var times = this.videos.map(function (v) {
                return v.getPlayedTime();
            });
            return (_Math = Math).max.apply(_Math, _toConsumableArray(times));
        }
    }, {
        key: 'hook',
        value: function hook(name) {
            var value = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = this.plugins[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var Plugin = _step7.value;

                    if (Plugin[name]) {
                        Plugin[name](value);
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }
        }
    }, {
        key: 'play',
        value: function play() {

            // hook prePlay for plugins
            this.hook('prePlay');

            // start ticker
            this.ticker.start();

            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this.videos[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var video = _step8.value;

                    if (video.getDuration() >= this.getPlayedTime()) {
                        video.play();
                    }
                }

                // hook prePlay for plugins
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            this.hook('onPlay');

            this.playerStateIs = playerState.playing;

            return this;
        }
    }, {
        key: 'pause',
        value: function pause() {

            // stop ticker
            this.ticker.stop();

            // abort if player not playing state
            if (this.playerStateIs === playerState.pause) {
                return console.info('allready pausing');
            }

            // pause all videos
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = this.videos[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var video = _step9.value;

                    video.pause();
                }

                // hook onPause for plugins
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }

            this.hook('onPause');

            this.playerStateIs = playerState.pause;

            return this;
        }

        /*
         * Toggle Video from play to pause vice versa
         */

    }, {
        key: 'toggle',
        value: function toggle() {
            if (this.playerStateIs === playerState.pause) {
                return this.play();
            }
            return this.pause();
        }
    }, {
        key: 'stop',
        value: function stop() {

            // stop ticker
            this.ticker.stop();

            // abort if player not in playing state
            if (this.playerStateIs !== playerState.pause && this.playerStateIs !== playerState.playing) {
                return;
            }

            // pause all videos
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = this.videos[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var video = _step10.value;

                    if (video.getPlayerState() !== 0) {
                        video.stop();
                    }
                }

                // hook onStop for plugins
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                        _iterator10.return();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }

            this.hook('onStop');

            this.playerStateIs = playerState.unstarted;

            return this;
        }
    }, {
        key: 'timeTo',
        value: function timeTo(time) {
            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
                for (var _iterator11 = this.videos[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    var video = _step11.value;

                    video.timeTo(time);
                }
            } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion11 && _iterator11.return) {
                        _iterator11.return();
                    }
                } finally {
                    if (_didIteratorError11) {
                        throw _iteratorError11;
                    }
                }
            }

            return this;
        }
    }, {
        key: 'mute',
        value: function mute() {
            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = this.videos[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var video = _step12.value;

                    video.mute();
                }

                // hook onMute for plugins
            } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                        _iterator12.return();
                    }
                } finally {
                    if (_didIteratorError12) {
                        throw _iteratorError12;
                    }
                }
            }

            this.hook('onMute');
        }
    }, {
        key: 'volumeTo',
        value: function volumeTo(percentage) {

            if (percentage > 100) {
                percentage = 100;
            } else if (percentage < 0) {
                percentage = 0;
            }

            this.settings.volume = percentage;

            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
                for (var _iterator13 = this.videos[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                    var video = _step13.value;

                    video.volumeTo(percentage);
                }

                // hook onVolumeChange for plugins
            } catch (err) {
                _didIteratorError13 = true;
                _iteratorError13 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion13 && _iterator13.return) {
                        _iterator13.return();
                    }
                } finally {
                    if (_didIteratorError13) {
                        throw _iteratorError13;
                    }
                }
            }

            this.hook('onVolumeChange', percentage);

            return this;
        }
    }, {
        key: '_videosInState',
        value: function _videosInState(state) {
            var inState = true;
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
                for (var _iterator14 = this.videos[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                    var video = _step14.value;

                    if (video.getPlayerState() === state && inState) {
                        inState = false;
                    }
                }
            } catch (err) {
                _didIteratorError14 = true;
                _iteratorError14 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion14 && _iterator14.return) {
                        _iterator14.return();
                    }
                } finally {
                    if (_didIteratorError14) {
                        throw _iteratorError14;
                    }
                }
            }

            return inState;
        }
    }, {
        key: '_render',
        value: function _render() {
            if (this.settings.area === null) {
                return console.info('no html parent defined');
            }

            if ($('#SplitPlayer').length > 0) {
                return console.info('player allready exist');
            }

            $(this.settings.area).prepend(this.settings.template);
            this.$dom = $('#SplitPlayer');
        }
    }]);

    return SplitPlayer;
}();

window.SplitPlayer = SplitPlayer;
module.exports = SplitPlayer;

},{"./constants.js":24,"./helper/ticker":26,"./plugins/":31,"./video/":40,"domtastic":15,"extend":22,"underscore":23}],28:[function(require,module,exports){
'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var extend = require('extend');

module.exports = function () {
    function SplitPlayerAnalytics(player, settings) {
        _classCallCheck(this, SplitPlayerAnalytics);

        this.player = player;

        this.$volume = null;
        // extend settings
        this.settings = extend({}, this.player.settings, {}, settings || {});
    }

    _createClass(SplitPlayerAnalytics, [{
        key: 'onPlay',
        value: function onPlay() {
            this.track('play');
        }
    }, {
        key: 'onPause',
        value: function onPause() {
            this.track('pause');
        }
    }, {
        key: 'onStop',
        value: function onStop() {
            this.track('stop');
        }
    }, {
        key: 'onTimeTo',
        value: function onTimeTo(timeData) {
            this.track('timeTo', timeData.playedTime);
        }
    }, {
        key: 'onMute',
        value: function onMute() {
            this.track('mute');
        }
    }, {
        key: 'onVolumeChange',
        value: function onVolumeChange(percentage) {
            this.track('volumeTo', percentage);
        }
    }, {
        key: 'track',
        value: function track(label, value) {
            if (typeof _trackEvent !== 'undefined') {
                _trackEvent('splitplayer', 'click', label, value || null);
            }
        }
    }]);

    return SplitPlayerAnalytics;
}();

},{"extend":22}],29:[function(require,module,exports){
'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var crosstab = require('crosstab');

module.exports = function () {
    function SplitPlayerCrossTabs(player) {
        _classCallCheck(this, SplitPlayerCrossTabs);

        this.player = player;

        this.setListener();
    }

    _createClass(SplitPlayerCrossTabs, [{
        key: 'setListener',
        value: function setListener() {
            var _this = this;

            try {
                crosstab.on('splitplayer.pause', function (response) {
                    console.log("trigger tab %s", response.data.triggerTab.id);
                    console.log("this tab %s", crosstab.util.tabs[crosstab.id].id);

                    if (response.data.triggerTab.id !== crosstab.util.tabs[crosstab.id].id) {
                        _this.player.pause();
                    }
                });
            } catch (e) {}
        }

        /*
         * player prePlay hook
         */

    }, {
        key: 'prePlay',
        value: function prePlay() {
            try {
                crosstab.broadcast('splitplayer.pause', {
                    triggerTab: crosstab.util.tabs[crosstab.id]
                });
            } catch (e) {}
        }
    }, {
        key: 'destroy',
        value: function destroy() {}
    }]);

    return SplitPlayerCrossTabs;
}();

},{"crosstab":1}],30:[function(require,module,exports){
'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var extend = require('extend');
var $ = require('domtastic');

module.exports = function () {
    function Fullscreen(player, settings) {
        _classCallCheck(this, Fullscreen);

        this.player = player;

        this.isFullscreen = false;

        this.settings = extend({}, {
            area: player.settings.area,
            onLaunch: function onLaunch() {},
            onExit: function onExit() {}
        }, settings);

        this.setListener();

        this.extendPlayer();
    }

    _createClass(Fullscreen, [{
        key: 'extendPlayer',
        value: function extendPlayer() {
            this.player.fullscreen = this;
        }
    }, {
        key: 'setListener',
        value: function setListener() {
            var docEvLi = document.addEventListener;
            docEvLi('webkitfullscreenchange', this.exit.bind(this), false);
            docEvLi('mozfullscreenchange', this.exit.bind(this), false);
            docEvLi('fullscreenchange', this.exit.bind(this), false);
            docEvLi('MSFullscreenChange', this.exit.bind(this), false);
        }
    }, {
        key: 'toggle',
        value: function toggle() {
            if (this.isFullscreen) {
                this.exit();
            } else {
                this.launch();
            }
        }
    }, {
        key: 'launch',
        value: function launch() {
            var _this = this;

            if (this.settings.area === null) {
                return false;
            }

            var element = $(this.settings.area)[0];

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

            window.setTimeout(function () {
                _this.isFullscreen = true;
            }, 600);
        }
    }, {
        key: 'exit',
        value: function exit() {

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
    }]);

    return Fullscreen;
}();

},{"domtastic":15,"extend":22}],31:[function(require,module,exports){
'use strict';

var SplitPlayerPlugins = {
    TimeManager: require('./time/manager.js'),
    TimeLine: require('./time/line.js'),
    TimeSync: require('./time/sync.js'),
    TimePicker: require('./time/picker.js'),
    TimeDisplay: require('./time/display.js'),
    SoundManager: require('./sound/manager.js'),
    SoundTrack: require('./sound/track.js'),
    Remember: require('./remember.js'),
    Analytics: require('./analytics.js'),
    Fullscreen: require('./fullscreen.js'),
    CrossTabs: require('./crosstabs.js')
};

if (typeof window !== 'undefined') {
    window.SplitPlayerPlugins = SplitPlayerPlugins;
}
module.exports = SplitPlayerPlugins;

},{"./analytics.js":28,"./crosstabs.js":29,"./fullscreen.js":30,"./remember.js":32,"./sound/manager.js":33,"./sound/track.js":34,"./time/display.js":35,"./time/line.js":36,"./time/manager.js":37,"./time/picker.js":38,"./time/sync.js":39}],32:[function(require,module,exports){
'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

module.exports = function () {
    function SplitPlayerRemember(player) {
        _classCallCheck(this, SplitPlayerRemember);

        this.player = player;
        this.hash = null;

        this.generateHash();
    }

    _createClass(SplitPlayerRemember, [{
        key: 'onReady',
        value: function onReady() {
            this.player.timeTo(this.getRememberedTime());
        }
    }, {
        key: 'getRememberedTime',
        value: function getRememberedTime() {
            if (typeof Storage !== 'undefined') {
                return localStorage.getItem(this.hash) || 0;
            }
            return 0;
        }
    }, {
        key: 'generateHash',
        value: function generateHash() {
            var videos = this.player.videos;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = videos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var video = _step.value;

                    this.hash = this.hash + video.settings.videoId + video.settings.videoUrl;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'onUpdate',
        value: function onUpdate() {
            this.save();
        }
    }, {
        key: 'save',
        value: function save() {
            if (typeof Storage !== 'undefined') {
                localStorage.setItem(this.hash, this.player.getPlayedTime());
            }
        }
    }]);

    return SplitPlayerRemember;
}();

},{}],33:[function(require,module,exports){
'use strict';

/* globals $ */

var extend = require('extend');
var $ = require('domtastic');

'use strict';

var SplitPlayerSoundManager = function SplitPlayerSoundManager(player, settings) {
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

    extend: function extend(Module, settings) {
        Module = new Module(this, settings || {});

        // push internal
        this.plugins.push(Module);

        // push to player plugins for other hooks
        return this.player.plugins.push(Module);
    },
    onUpdate: function onUpdate() {},
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

module.exports = SplitPlayerSoundManager;

},{"domtastic":15,"extend":22}],34:[function(require,module,exports){
'use strict';

var extend = require('extend');
var $ = require('domtastic');

'use strict';

var SplitPlayerSoundTrack = function SplitPlayerSoundTrack(soundManager, settings) {
    this.soundManager = soundManager;

    this.$trackList = null;

    // extend settings
    this.settings = extend({}, this.soundManager.player.settings, {
        area: null,
        template: '<label><input class="soundtrack" name="soundTracks[]" %checked% type="radio" value="%videoId%" /></label>'
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
            console.log(video);
            if (video !== false) {
                video.unMute();
            }
        }
    },
    getActive: function getActive() {
        var actives = $(this.settings.area).find('.soundtrack:checked');
        var activesValue = [];
        for (var i = 0; i < actives.length; i++) {
            activesValue.push(actives[i].value);
        }
        return activesValue;
    },
    _render: function _render() {
        if (this.settings.area === null) {
            return console.error('no dropArea for SoundTrack defined');
        }

        var template = '';

        var videos = this.soundManager.player.videos;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = videos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var video = _step.value;

                // replace params
                template += this.settings.template.replace('%videoId%', video.settings.videoId).replace('%checked%', video.settings.isMuted ? '' : 'checked');
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
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

module.exports = SplitPlayerSoundTrack;

},{"domtastic":15,"extend":22}],35:[function(require,module,exports){
'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var extend = require('extend');
var $ = require('domtastic');

module.exports = function () {
    function SplitPlayerTimeDisplay(timeManager, settings) {
        _classCallCheck(this, SplitPlayerTimeDisplay);

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
    }

    _createClass(SplitPlayerTimeDisplay, [{
        key: 'mount',
        value: function mount() {
            this._render();
        }
    }, {
        key: 'onReady',
        value: function onReady() {
            this.onsetTimeTo(this.timeManager.getData());
        }
    }, {
        key: 'onsetTimeTo',
        value: function onsetTimeTo(data) {
            this.$duration.html(data.durationFormatted);
            this.$current.html(data.playedTimeFormatted);
        }
    }, {
        key: '_render',
        value: function _render() {
            if (this.settings.area === null) {
                return console.error('no dropArea for timeDisplay defined');
            }

            this.$display = $(this.settings.area);
            this.$display.append(this.settings.template);

            this.$duration = this.$display.find('.duration');
            this.$current = this.$display.find('.current');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.$display.remove();
        }
    }]);

    return SplitPlayerTimeDisplay;
}();

},{"domtastic":15,"extend":22}],36:[function(require,module,exports){
'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var extend = require('extend');
var $ = require('domtastic');

module.exports = function () {
    function SplitPlayerTimeLine(timeManager, settings) {
        _classCallCheck(this, SplitPlayerTimeLine);

        this.timeManager = timeManager;

        // register timeline inside timeManager
        this.timeManager.timeline = null;

        this.$bar = null;

        // extend settings
        this.settings = extend({}, this.timeManager.settings, {
            template: '<div id="timeline"><i class="bar"></i></div>'
        }, settings);

        this.mount();
    }

    _createClass(SplitPlayerTimeLine, [{
        key: 'mount',
        value: function mount() {
            this._render();
        }

        /*
         * player onReady hook
         */

    }, {
        key: 'onReady',
        value: function onReady() {
            this.isActive = true;
        }

        /*
         * player onStop hook
         */

    }, {
        key: 'onStop',
        value: function onStop() {
            this._reset();
        }

        /*
         * timeManager onsetTimeTo hook
         */

    }, {
        key: 'onsetTimeTo',
        value: function onsetTimeTo(data) {
            this.setTimeTo(data);
        }
    }, {
        key: 'setTimeTo',
        value: function setTimeTo(data) {
            this.$bar.css({
                width: data.percentage + '%'
            });
        }
    }, {
        key: '_reset',
        value: function _reset() {
            this.$bar.css({
                width: 0
            });
        }
    }, {
        key: '_render',
        value: function _render() {
            var dom = $(this.settings.area).append(this.settings.template);

            this.timeManager.$timeline = dom.find('#timeline');
            this.$bar = this.timeManager.$timeline.find('i');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.timeManager.$timeline.remove();
        }
    }]);

    return SplitPlayerTimeLine;
}();

},{"domtastic":15,"extend":22}],37:[function(require,module,exports){
'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var extend = require('extend');

module.exports = function () {
    function SplitPlayerTimeManager(player, settings) {
        _classCallCheck(this, SplitPlayerTimeManager);

        this.player = player;

        this.isActive = false;
        this.playedTime = 0;

        this.plugins = [];

        // extend player settings
        this.settings = extend({}, this.player.settings, {}, settings || {});
    }

    /*
     * extend Module
     */

    _createClass(SplitPlayerTimeManager, [{
        key: 'extend',
        value: function extend(Module, settings) {
            Module = new Module(this, settings || {});

            // push internal
            this.plugins.push(Module);

            // push to player plugins for other hooks
            return this.player.plugins.push(Module);
        }

        /*
         * player onReady hook
         */

    }, {
        key: 'onReady',
        value: function onReady() {
            this.isActive = true;
            this.setTimeTo(0);
        }

        /*
         * player onUpdate hook
         */

    }, {
        key: 'onUpdate',
        value: function onUpdate() {
            this.setTimeTo(this.player.getPlayedTime());
        }

        /*
         * player onStop hook
         */

    }, {
        key: 'onStop',
        value: function onStop() {
            this.setTimeTo(0);
        }

        /*
         * Set Time to
         */

    }, {
        key: 'setTimeTo',
        value: function setTimeTo(playedTime) {
            this.playedTime = playedTime;
            // plugin
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var Plugin = _step.value;

                    if (Plugin.onsetTimeTo) {
                        Plugin.onsetTimeTo(this.getData());
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /*
         * get all time data from player
         */

    }, {
        key: 'getData',
        value: function getData() {
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
        }
    }, {
        key: '_formatTime',
        value: function _formatTime(timeInplayedTime) {
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
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.onStop();
        }
    }]);

    return SplitPlayerTimeManager;
}();

},{"extend":22}],38:[function(require,module,exports){
'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var extend = require('extend');
var $ = require('domtastic');

module.exports = function () {
    function SplitPlayerTimePicker(timeManager, settings) {
        _classCallCheck(this, SplitPlayerTimePicker);

        this.timeManager = timeManager;

        this.$previewLine = null;

        this.previewedTime = 0;

        // extend settings
        this.settings = extend({}, this.timeManager.settings, {
            area: '#timeline',
            template: '<i class="preview-line"><time></time></i>'
        }, settings || {});

        this.mount();
    }

    _createClass(SplitPlayerTimePicker, [{
        key: 'mount',
        value: function mount() {
            this.$timeline = this.timeManager.$timeline;

            this._render();
            this._setEvents();
        }

        // set mousemove and click event

    }, {
        key: '_setEvents',
        value: function _setEvents() {
            this.$timeline.on('mousemove', this._showTime.bind(this)).on('mouseup', this._setTime.bind(this));
        }

        // show time on mousemove

    }, {
        key: '_showTime',
        value: function _showTime(e) {
            var leftPos = e.pageX - this.$timeline[0].offsetLeft;

            var percentage = leftPos * 100 / this.$timeline[0].offsetWidth;

            // set to 0 if negative value
            if (percentage < 0) {
                percentage = 0;
            }

            this.previewedTime = this.timeManager.player.duration / 100 * percentage;
            this.$previewLine.css('width', percentage + '%').find('time').html(this.timeManager._formatTime(this.previewedTime));
        }

        // set time on click

    }, {
        key: '_setTime',
        value: function _setTime() {
            this.timeManager.setTimeTo(this.previewedTime);
            this.timeManager.player.timeTo(this.previewedTime);
        }
    }, {
        key: '_render',
        value: function _render() {
            this.$timeline.append(this.settings.template);
            this.$previewLine = this.$timeline.find('.preview-line');
        }
    }]);

    return SplitPlayerTimePicker;
}();

},{"domtastic":15,"extend":22}],39:[function(require,module,exports){
'use strict';

/* globals $ */

var $ = require('domtastic');

'use strict';

var SplitPlayerTimeSync = function SplitPlayerTimeSync(timeManager, settings) {
    this.timeManager = timeManager;

    this.timeline = this.timeManager.timeline;

    this.previewedTime = 0;

    // extend settings
    this.settings = $.extend({}, this.timeManager.settings, {
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

module.exports = SplitPlayerTimeSync;

},{"domtastic":15}],40:[function(require,module,exports){
'use strict';

module.exports = {
    youtube: require('./youtube.js'),
    native: require('./native.js'),
    vimeo: require('./vimeo.js')
};

},{"./native.js":41,"./vimeo.js":42,"./youtube.js":43}],41:[function(require,module,exports){
'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var extend = require('extend');
var $ = require('domtastic');

var playerState = require('./../constants');

module.exports = function () {
    function NativeVideo(player, settings) {
        _classCallCheck(this, NativeVideo);

        this.player = player;
        this.videoPlayer = null;
        this.videoState = playerState.loading;

        this.settings = extend({
            videoId: new Date().getTime().toString(),
            startSeconds: 0,
            videoUrl: null,
            isMuted: false,
            controls: 1
        }, settings);

        this.isMuted = this.settings.isMuted;
    }

    _createClass(NativeVideo, [{
        key: 'load',
        value: function load() {}
    }, {
        key: 'mount',
        value: function mount() {
            this._render();
            this.create();
        }
    }, {
        key: 'create',
        value: function create() {
            this.videoPlayer = $('#vid' + this.settings.videoId)[0];

            this.videoPlayer.addEventListener('loadeddata', this.onReady.bind(this), false);
            this.videoPlayer.addEventListener('canplaythrough', this.onStateChange.bind(this, playerState.unstarted), false);
            this.videoPlayer.addEventListener('play', this.onStateChange.bind(this, playerState.playing), false);
            this.videoPlayer.addEventListener('pause', this.onStateChange.bind(this, playerState.pause), false);

            this.videoPlayer.addEventListener('progress', function (e, a) {}, false);
        }
    }, {
        key: 'onReady',
        value: function onReady() {
            this.setPlayerDuration();
            if (this.settings.isMuted) {
                this.mute();
            }
            this.timeTo(0);
            this.player.onReady();
        }
    }, {
        key: 'onStateChange',
        value: function onStateChange(state) {
            return this.videoState = state;

            if (state === YT.PlayerState.BUFFERING) {
                return this.player.changeState(playerState.buffering);
            }

            if (state === YT.PlayerState.PLAYING) {
                return this.player.changeState(playerState.playing);
            }

            if (state === YT.PlayerState.PAUSED) {
                return this.player.changeState(playerState.pause);
            }

            console.info('state %s not fetched', event.data);
        }
    }, {
        key: 'getDuration',
        value: function getDuration() {
            var duration = this.videoPlayer.duration || 0;
            return duration - this.settings.startSeconds;
        }
    }, {
        key: 'setPlayerDuration',
        value: function setPlayerDuration() {
            var _duration = this.getDuration();

            if (this.player.duration < _duration) {
                this.player.duration = _duration;
                this.player.getPlayedTime = this.getPlayedTime.bind(this);
            }
        }
    }, {
        key: 'getPlayedTime',
        value: function getPlayedTime() {
            return this.videoPlayer.currentTime - this.settings.startSeconds;
        }
    }, {
        key: 'getPlayerState',
        value: function getPlayerState() {
            return this.videoState;
        }
    }, {
        key: 'play',
        value: function play() {
            this.videoPlayer.play();
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.videoPlayer.pause();
        }
    }, {
        key: 'mute',
        value: function mute() {
            this.isMuted = true;
            this.settings.isMuted = this.isMuted;
            this.videoPlayer.muted = this.isMuted;
            return true;
        }
    }, {
        key: 'unMute',
        value: function unMute() {
            this.isMuted = false;
            this.settings.isMuted = this.isMuted;
            this.videoPlayer.muted = this.isMuted;
            this.volumeTo(this.player.settings.volume);

            return true;
        }
    }, {
        key: 'volumeTo',
        value: function volumeTo(percentage) {
            if (this.isMuted) {
                return false;
            }

            // convert to native value
            var nativeValue = percentage / 100;
            console.log(nativeValue);
            this.videoPlayer.volume = nativeValue;
            return true;
        }
    }, {
        key: 'timeTo',
        value: function timeTo(time) {

            time = time + this.settings.startSeconds;

            if (time >= this.getDuration()) {
                this.stop();
                return console.info('time for %s out of range', this.settings.videoId);
            }

            this.videoPlayer.currentTime = time;
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.videoPlayer.pause();
            this.timeTo(0);
        }
    }, {
        key: '_render',
        value: function _render() {
            var html = '<div id="%id%" class="video"><video id="vid%id%" autostart="false"%controls%><source src="%url%" type="video/mp4" /></video></div>';
            var html = html.replace(/%id%/g, this.settings.videoId || '').replace(/%url%/g, this.settings.videoUrl || '').replace(/%controls%/g, this.settings.controls > 0 ? ' controls="controls"' : '');

            $('#SplitPlayer').append(html);
        }
    }]);

    return NativeVideo;
}();

},{"./../constants":24,"domtastic":15,"extend":22}],42:[function(require,module,exports){
"use strict";

},{}],43:[function(require,module,exports){
'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var extend = require('extend');
var getScript = require('./../helper/getScript.js');
var $ = require('domtastic');

var playerState = require('./../constants');

module.exports = function () {
    function YoutubeVideo(player, settings) {
        _classCallCheck(this, YoutubeVideo);

        this.loadingDependencies = false;
        this.player = player;
        this.videoPlayer = null;

        this.settings = extend({
            videoId: null,
            videoUrl: null,
            startSeconds: 0,
            isHidden: false,
            isMuted: false,
            controls: 1
        }, settings);

        this.isMuted = this.settings.isMuted;
    }

    _createClass(YoutubeVideo, [{
        key: 'load',
        value: function load(callback) {

            if (this.loadingDependencies) {
                return;
            }

            this.loadingDependencies = true;

            getScript('//youtube.com/iframe_api', function () {
                window.onYouTubeIframeAPIReady = callback;
            });
        }
    }, {
        key: 'mount',
        value: function mount() {
            this._render();
            this.create();
        }
    }, {
        key: 'create',
        value: function create() {

            this.videoPlayer = new YT.Player('replacer' + this.settings.videoId, {
                width: '100%',
                height: '100%',
                videoId: this.settings.videoId,
                startSeconds: this.settings.startSeconds,
                playerVars: {
                    controls: this.settings.controls
                },
                events: {
                    onReady: this.onReady.bind(this),
                    onStateChange: this.onStateChange.bind(this),
                    onError: this.onError.bind(this)
                }
            });
        }
    }, {
        key: 'onReady',
        value: function onReady() {
            this.setPlayerDuration();

            if (this.settings.isMuted) {
                this.mute();
            }
            this.timeTo(0);
            this.player.onReady();
        }
    }, {
        key: 'onError',
        value: function onError(err) {

            var code = err.data;
            if (code === 100 || code === 150) {
                console.error('Video %s Not Found', this.settings.videoId);
            }

            this.noVideo();
        }
    }, {
        key: 'onStateChange',
        value: function onStateChange(event) {

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
        }
    }, {
        key: 'hide',
        value: function hide() {
            if (this.settings.isHidden) {
                return false;
            }

            $('#' + this.settings.videoId).hide();
            this.settings.isHidden = true;
        }
    }, {
        key: 'show',
        value: function show() {
            if (!this.settings.isHidden) {
                return false;
            }

            $('#' + this.settings.videoId).show();

            this.settings.isHidden = false;
        }
    }, {
        key: 'getPlayerState',
        value: function getPlayerState() {
            return this.videoPlayer.getPlayerState();
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.videoPlayer.destroy();
        }
    }, {
        key: 'timeTo',
        value: function timeTo(time) {

            time = time + this.settings.startSeconds;

            if (time >= this.getDuration()) {
                this.videoPlayer.stopVideo();
                return console.info('time for %s out of range', this.settings.videoId);
            }

            this.videoPlayer.seekTo(time);
        }
    }, {
        key: 'volumeTo',
        value: function volumeTo(percentage) {
            if (this.isMuted) {
                return false;
            }

            this.videoPlayer.setVolume(percentage);
            return true;
        }
    }, {
        key: 'mute',
        value: function mute() {
            this.videoPlayer.mute();
            this.isMuted = true;
            this.settings.isMuted = this.isMuted;

            return true;
        }
    }, {
        key: 'unMute',
        value: function unMute() {
            this.isMuted = false;
            this.settings.isMuted = this.isMuted;
            this.videoPlayer.unMute();
            this.volumeTo(this.player.settings.volume);

            return true;
        }
    }, {
        key: 'play',
        value: function play() {
            this.videoPlayer.playVideo();
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.videoPlayer.pauseVideo();
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.timeTo(0);
            this.pause();
        }
    }, {
        key: 'getDuration',
        value: function getDuration() {
            var duration = this.videoPlayer.getDuration() || 0;
            return duration - this.settings.startSeconds;
        }
    }, {
        key: 'setPlayerDuration',
        value: function setPlayerDuration() {
            var _duration = this.getDuration();

            if (this.player.duration < _duration) {
                this.player.duration = _duration;
                this.player.getPlayedTime = this.getPlayedTime.bind(this);
            }
        }
    }, {
        key: 'getPlayedTime',
        value: function getPlayedTime() {
            return this.videoPlayer.getCurrentTime() - this.settings.startSeconds;
        }
    }, {
        key: '_render',
        value: function _render() {
            $('#SplitPlayer').append('<div id="' + this.settings.videoId + '"><div id="replacer' + this.settings.videoId + '"><div></div>');
        }
    }, {
        key: 'noVideo',
        value: function noVideo() {
            this.player.removeVideo(this.settings.videoId);
            $('#' + this.settings.videoId).html('<div class="no-video"></div>');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            // remove youtube video iframe
            $('#' + this.settings.videoId).remove();

            return true;
        }
    }]);

    return YoutubeVideo;
}();

},{"./../constants":24,"./../helper/getScript.js":25,"domtastic":15,"extend":22}]},{},[27]);
