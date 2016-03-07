var chai = require('chai');
var jsdom = require('mocha-jsdom');

var SplitPlayer = require('../src/player.js');
var playerState = require('../src/constants.js');
var should = chai.should();
var expect = chai.expect;


describe('SplitPlayer', function() {
    var player = null;

    jsdom();

    it('should create instance', function(done) {

        player = new SplitPlayer();

        expect(player).to.be.an.instanceof(SplitPlayer);

        player.should.have.property('settings');

        done();
    });

    it('should have important properties', function(done) {

        player.should.have.property('settings');
        player.should.have.property('duration');

        done();
    });

    it('should change state on play to playing', function(done) {

        player.play();

        player.playerStateIs.should.equal(playerState.playing);

        done();
    });

    it('should change state on pause to pause', function(done) {

        player.pause();

        player.playerStateIs.should.equal(playerState.pause);

        done();
    });

    it('should change state on toggle', function(done) {

        player.toggle();

        player.playerStateIs.should.equal(playerState.playing);

        player.toggle();

        player.playerStateIs.should.equal(playerState.pause);

        done();
    });

    it('should change state on stop to unstarted', function(done) {

        player.stop();

        player.playerStateIs.should.equal(playerState.unstarted);

        done();
    });

    it('should add video to player', function(done) {

        player.addVideo({
            videoId: 'QfrUodC2pbg',
            hoster: 'youtube',
            startSeconds: 0,
            isMuted: true
        });

        expect(player.videos).to.have.length(1);

        done();
    });

    it('should not add duplicate video to player', function(done) {

        var result = player.addVideo({
            videoId: 'QfrUodC2pbg',
            hoster: 'youtube',
            startSeconds: 0,
            isMuted: true
        }).should.equal(false);

        expect(player.videos).to.have.length(1);

        done();
    });

    it('should destroy video', function(done) {
        player.removeVideo('QfrUodC2pbg').should.equal(true);

        done();
    });

    it('should not destroyVideo if not available', function(done) {

        player.destroyVideo('QfrUodC2pbg').should.equal(false);
        expect(player.videos).to.have.length(0);
        done();
    });

    it('should add a list of videos', function(done) {

        var videos = [{
            videoId: 'QfrUodC2pbg',
            hoster: 'youtube',
            startSeconds: 0,
            isMuted: true
        }, {
            videoId: 'J4Ltw1ZA9ho',
            startSeconds: 0,
            hoster: 'youtube',
            isMuted: false
        },{
            videoId: 'reWiqJ2iux8',
            startSeconds: 30,
            hoster: 'youtube',
            isMuted: true
        }];

        player.addVideos(videos);
        expect(player.videos).to.have.length(videos.length);

        done();
    });


});
