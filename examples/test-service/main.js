/*
NOTE: This example no longer works on OSX starting in 10.10 (Yosemite). Apple has apparently blacklisted the battery uuid.
*/

const chalk = require('chalk');
const log = require('loglevel');
const prefix = require('loglevel-plugin-prefix');

var dbg = require('debug')
dbg.enable("bleno,characteristic,descriptor,acl-att-stream,bindings,gap,gatt,hci,mgmt,smp,highsierra-bindings,yosemite-bindings,primary-service");

var bleno = require('../..');
var TestService = require('./test-service');

var primaryService = new TestService();

const colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


prefix.reg(log);
log.enableAll();

prefix.apply(log, {
  format(level, name, timestamp) {
    return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](level)}`;
  },
  timestampFormatter(date) {
    let current = new Date();
    let locale = "de-DE";
    return monthNames[current.getMonth()] + " " + current.getDate() + " " + current.toLocaleTimeString(locale) + "." + current.getMilliseconds();
    }  
});

prefix.apply(log.getLogger('critical'), {
  format(level, name, timestamp) {
    return chalk.red.bold(`[${timestamp}] ${level} ${name}:`);
  },
});

log.setLevel("debug");

bleno.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    bleno.startAdvertising('TestService', [primaryService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  if (!error) {
    bleno.setServices([primaryService], function(error){
      log.debug('setServices: '  + (error ? 'error ' + error : 'success'));
    });
  }
});
