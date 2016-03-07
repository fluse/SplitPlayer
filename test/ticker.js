var chai = require('chai');
var Ticker = require('../src/helper/ticker.js');
var playerState = require('../src/constants.js');
var should = chai.should();
var expect = chai.expect;

describe('Ticker', function() {

    var ticker = null;

    it('should create instance', function(done) {

        ticker = new Ticker();

        expect(ticker).to.be.an.instanceof(Ticker);

        done();
    });

    it('should has default values', function(done) {

        expect(ticker.callback).to.be.null;
        ticker.interval.should.equal(1000);

        done();
    });

    it('should be inactive', function(done) {

        expect(ticker.callback).to.be.null;
        ticker.isActive.should.equal(false);

        done();
    });

    it('should be active after start', function(done) {
        ticker.start();
        ticker.isActive.should.equal(true);

        done();
    });

    it('should be inactive after stop', function(done) {
        ticker.stop();
        ticker.isActive.should.equal(false);

        done();
    });

    it('should be cycling callback after start', function(done) {
        ticker.callback = function () {};
        ticker.start();
        ticker.cycler.should.not.be.equal(false);
        ticker.stop();
        done();
    });

    it('should be execute callback after start', function(done) {
        var testResult = 0;
        ticker.interval = 10;
        ticker.callback = function () {
            testResult++;
        };
        ticker.start();
        ticker.cycler.should.not.be.equal(false);
        setTimeout(() => {
            testResult.should.not.be.equal(0);
            ticker.stop();
            done();
        }, 20);
    });

});
