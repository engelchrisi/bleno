var util = require('util');

var bleno = require('../..');

var BlenoPrimaryService = bleno.PrimaryService;

var TestCharacteristic = require('./test-characteristic');

function TestService() {
  TestService.super_.call(this, {
      uuid: '180F',
      characteristics: [
          new TestCharacteristic()
      ]
  });
}

util.inherits(TestService, BlenoPrimaryService);

module.exports = TestService;
