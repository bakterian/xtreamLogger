// ================== USED RESOURCES =====================
const logger = require("./abstractLogger");
// =======================================================

/*
* supported options of the console logger:
* var consoleLoggerOptions = 
*  {
*   "logLevelString" <- [string] should be one of the supported logging level strings,
*   "sinkThrottlerNeeded"  <- [boolean] if message throtteling should be activated
*   "throttlerActDurationMs"  <- [Int] duration of throtteling
*  }
* 
* example
* var consoleLoggerOptions = 
*  {
*   "logLevelString"          :  "debug",
*   "sinkThrottlerNeeded"     :  true,
*   "throttlerActDurationMs"  :  3000  
*  }
*/

/*
* Logger using the console as the message sink
* The fucntionality extent is configurable via the options dictionary
*/
class ConsoleLogger extends logger.Logger
{
  constructor(consoleLoggerOptions)
  {
    var sinkThrottler = null;
    if(consoleLoggerOptions.sinkThrottlerNeeded)
    {
      var activationTime = consoleLoggerOptions.throttlerActDurationMs;
      var sinkThrottler = new logger.SinkThrottler(activationTime);
    }
    super(consoleLoggerOptions.logLevelString, sinkThrottler);
  }

  sinkIt(message, logLevelCall)
  {
    //TODO: change style depeding on logging level
    return new Promise((resolve, reject) => { 
        var sinkItSuccessfull = true;
        console.log(message);
        resolve(sinkItSuccessfull);
    });   
  }

};

exports.LogLevel = logger.LogLevel;
exports.ConsoleLogger = ConsoleLogger;