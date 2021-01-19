// ================== USED RESOURCES =====================
const logger = require("./abstractLogger");
const sgMail = require('@sendgrid/mail');

// =======================================================

/*
* supported options of the console logger:
* var mailingLoggerOptions = 
*  {
*   "logLevelString" 	        <- [string] should be one of the supported logging level strings,
*   "sinkThrottlerNeeded"     <- [boolean] if message throtteling should be activated
*   "throttlerActDurationMs"  <- [Int] duration of throtteling
*   "sendGridApiKey"	        <- Send grid API key
*   "addressee"	              <- Addresse e-mail address
*   "sender"	                <- Sender e-mail address
*   "subject"	                <- e-mail subject
*  }
* 
* example
* var mailingLoggerOptions = 
*  {
*   "logLevelString"          :  "debug",
*   "sinkThrottlerNeeded"     :  true,
*   "throttlerActDurationMs"  :  3000,
*   "sendGridApiKey"          :  <API key hash>
*   "addressee"	              :  "recipient@example.org"
*   "sender"	                :  "sender@example.org"
*   "subject"	                :  "Hello world"
*  }
*/

/*
* Logger using the console as the message sink
* The fucntionality extent is configurable via the options dictionary
*/
class MailingLogger extends logger.Logger
{
  constructor(mailingLoggerOptions)
  {
    var sinkThrottler = null;
    if(mailingLoggerOptions.sinkThrottlerNeeded)
    {
      var activationTime = mailingLoggerOptions.throttlerActDurationMs;
      var sinkThrottler = new logger.SinkThrottler(activationTime);
    }
    super(mailingLoggerOptions.logLevelString, sinkThrottler);

    this.loggerOptions = mailingLoggerOptions;
    this.sgMailIns = sgMail;
    this.sgMailIns.setApiKey(mailingLoggerOptions.sendGridApiKey);
  }

  getMailColor(logLevel)
  {
    let htmlColorName;
    switch (logLevel) 
    {
      case 'info':
        htmlColorName = "DarkSlateGray";
        break;    
      case 'debug':
        htmlColorName = "RoyalBlue";
        break;
      case 'warning':
        htmlColorName = "SlateBlue";
        break;  
      case 'error':
        htmlColorName = "Tomato"
        break;  
      case 'fatal':
        htmlColorName = "Red"
        break;  
      case 'notset':
      default:
      htmlColorName = "DarkSeaGreen";
      break;
    }
    return htmlColorName;
  }

  sinkIt(message, logLevelCall)
  {
    //TODO: change style depeding on logging level

    const htmlConent = "<div style=\"font-family:    CalibriLight, Helvetica;font-size:      30px;"
                    + "                font-weight:    bold;color:    " + this.getMailColor(logLevelCall) + ";\">"
                    + "<strong>Received the following logs of the category " + logLevelCall + " from Raspberry Pi:</strong>"
                    + "<br></br><br></br>" + message + "</div";


    const emailMsg = 
    {
      to: this.loggerOptions.addressee,
      from: this.loggerOptions.sender,
      subject: this.loggerOptions.subject,
      text: "mail SendGrid",
      html: htmlConent
    };
 
      return new Promise ((resolve, reject) => {
        this.sgMailIns.send(emailMsg, (error, result) => {
          if(error) 
          {
              console.log("[Callback sendMail] Error" + error);
              reject(error)
          }
          else 
          {
            resolve(true);
          }}).then((resolveFromSendgridPromise) => 
                    {
                      console.log("got resolve form SendGrid promise");
                      resolve(true);
                    },
                   (rejectFromSendgridPromise) => 
                   {
                      console.log("[sendMail Reject] Error" + rejectFromSendgridPromise);
                      reject(rejectFromSendgridPromise);
                  });
        });
  }
	
};

exports.LogLevel = logger.LogLevel;
exports.MailingLogger = MailingLogger;
