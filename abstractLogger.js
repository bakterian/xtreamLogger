/*
 * This is a module to be used to log notifcations. 
 * Clones of this sink maybe be creacted just remeber not modify the module interface.
 * The logic can changed but the exported function names should remain unchanged.
 */

/* SupportedLoggingLevels */
const _logLevelDic = {
	"notset"   : 0,
	"info"     : 1,
	"debug"	   : 2,
	"warning"  : 3,
	"error"    : 4,
	"critical" : 5
};


/*
* A instance of this class is created in the logger base
* Helps to determine if the message should be logged or not
*/
class LogLevel
{
	constructor(logLevelString)
	{
		if(this.isValidStrLogLevel(logLevelString) === true)
		{
			if(_logLevelDic[logLevelString] === 0)
			{ //if logging level was not specified -> assume the most verbose option
				this._logLevelStr = "info";
			}
			this._logLevelStr = logLevelString;
		} 
		else
		{
		  throw new RangeError("Whoops! the value: " + logLevelString + " is not a valid log level");
		}
	}

	get logLevelNum()
	{
		return _logLevelDic[this._logLevelStr];
	}

	isValidStrLogLevel(logLevelStr)
	{
		return (logLevelStr in _logLevelDic);
	}
};

/*
* This class instance is a part of the Logger base
* Thanks to this logic we can prohibit execessive sink usage
* Sms, E-mails are limited also we could end up spamming someones inbox.
*/
class SinkThrottler 
{
  constructor(activDurationMs)
  {
    this._timeoutObj = null;
    this._activDurationMs = activDurationMs;
  }

  activate()
  {
    this._timeoutObj = setTimeout(this.deactiveFromTimeoutContext, this._activDurationMs);
  }

  deactiveFromTimeoutContext()
  {
    clearTimeout(this); 
    //console.log("deactive called from Timeout context."); 
  }

  deactive()
  {
    if(this._timeoutObj != null)
    {
      clearTimeout(this);
      console.log("deactive called internal context");
    }
  }

  get isThrottlingActive()
  {
    return ((this._timeoutObj != null) && (this._timeoutObj._onTimeout != null));
  }

  get TimeouValueMinutes()
  {
    return this._activDurationMs/60000;
  }

  get TimeouValueSec()
  {
    return this._activDurationMs/1000;
  }

  get TimeouValueMs()
  {
    return this._activDurationMs;
  }
};

/*
 * Logger abstract base class.
 * Expected to be overwritten (using it directly will throw errors)
 */
class Logger
{
    constructor(logLevelStr, sinkThrottler = null)
    {
        this._logLevel = new LogLevel(logLevelStr);
        this._sinkThrottler = sinkThrottler;
    }

    setLogLevel(logLevelStr)
    {
        this._logLevel = new LogLevel(logLevelStr);
    }

    info(message)
    {	
        this.moveToSink(message, "info");
    }

    debug(message)
    {	
        this.moveToSink(message, "debug");
    }

    warning(message)
    {	
        this.moveToSink(message, "warning");
    }

    error(message)
    {	
        this.moveToSink(message,"error");
    }

    critical(message)
    {	
        this.moveToSink(message,"critical");
    }

    logSendOutConfirmed()
    {
        var datetime = new Date();
        console.log("Logged message at: " + datetime.toISOString());

        if(this._sinkThrottler != null)
        {
            console.log("There won't be sink activity for the next " + 
            this._sinkThrottler.TimeouValueMinutes  + " minutes.\n\n");
            this._sinkThrottler.activate();
        }
    }

    async moveToSink(message, logLevelCall)
    {
        if((this._logLevel.logLevelNum  <= _logLevelDic[logLevelCall]) &&
           (this.isLogThrottlingActive === false))
        {
            var sinkingSuccessfull = await this.sinkIt(message, logLevelCall); 

            if(sinkingSuccessfull === true)  this.logSendOutConfirmed();
        }
    }

    sinkIt(message, logLevelCall, callback)
    {
        //In the extension method call a sink instance and pass the message and log level
        throw new InternalError("sinkIt function needs to be overriden in a logger extensions");
    }

    get sinkThrottlerSet()
    {
    return (this._sinkThrottler != null);
    }

    get isLogThrottlingActive()
    {
    return (this.sinkThrottlerSet && this._sinkThrottler.isThrottlingActive);
    }
};

exports.LogLevelDic = _logLevelDic;
exports.Logger = Logger;
exports.SinkThrottler = SinkThrottler;