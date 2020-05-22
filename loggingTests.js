const conLogger = require("./consoleLogger");
const mailLogger = require("./mailingLogger");
const moment = require("moment");

// current timestamp in milliseconds
var dateTimeNow = moment().format("YYYY-MM-DD HH:mm:ss ZZ");

// prints date & time in YYYY-MM-DD format
console.log(dateTimeNow);

//This could come from a config file:
var consoleLoggerOptions = 
  {
   "logLevelString"          :  "<Possible values: notset, info, debug, warning, error, critical>",
   "sinkThrottlerNeeded"     :  "<boolean saying if logging throttle to be activated i.e not to overflow a mail inbox with debug infos>",
   "throttlerActDurationMs"  :  "<debounce time for logged messages, next message to be logged not sooner than in .... ms>"
}

console.log("TEST STARTS NOW");

let log = new conLogger.ConsoleLogger(consoleLoggerOptions);

let timeout = setTimeout(() => { 
log.error("Super important info #2. Should not be shown !!!"); }, 2 * 1000);

let timeou2 = setTimeout(() => { 
log.error("Super important info #3"); }, 5 * 1000);

let timeou3 = setTimeout(() => { 
log.error("Super important info #4. Should not be shown !!!"); }, 6 * 1000);

let timeou4 = setTimeout(() => { 
log.error("Super important info #5"); }, 9 * 1000);

log.error("Super important info #1");


//This could come from a config file:
var mailingLoggerOptions = 
{
  "logLevelString"          :  "<Possible values: notset, info, debug, warning, error, critical>",
  "sinkThrottlerNeeded"     :  "<boolean saying if logging throttle to be activated i.e not to overflow a mail inbox with debug infos>",
  "throttlerActDurationMs"  :  "<debounce time for logged messages, next message to be logged not sooner than in .... ms>",
  "sendGridApiKey"	        :  "<as mail logging using send grid will be used the unique api key is need for the REST connection>",
  "addressee"	              :  "<email destination address>",
  "sender"	                :  "<sender e-mail this should be a verified domain e-mail autherwise the messages will lakely be identified as spam>",
  "subject"	                :  "<e-mail topic>"
 }

/*
let timeout5 = setTimeout(() => {
	console.log("MAILING LOGGGER TEST STARTS NOW");
	let mailLog = new mailLogger.MailingLogger(mailingLoggerOptions);
	mailLog.error("Super important info #6.");
}, 11 * 1000);
*/

