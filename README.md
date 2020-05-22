# XTREAM LOGGER
**Node-js logging utility**

Node Js utility for logging, supported logger sinks: console, e-mail.
In case the mail logger is to be used a send-grid account needs to be created.
Message throthling can be activated so that destination is not overrun with e-mails.
TODO: change mail style dependinh on the logging level
TODO: add SMS sink support

## Release 1.0.0
Initial release of code and configuration examples.
Tested on linux.

## How to Install
Clone or unzip repository.
Open shell or the windows cmd, cd inside and type:
```js
npm install
```
## Configuration
Configuration array is needed to instiate the logger.
Example of the configuration parameters can be found in loggingTests.js

## How to run
Simply reference in a different application:
const mailLogger = require("../xtreamLogger/mailingLogger").MailingLogger;

CONSTRUCTION: Logger(logLevel)

LOGGING CALLs:
setLogLevel(logLevelStr)
info(message)
debug(message)
warning(message)
error(message)
critical(message)


## Testing the logger
The basic logging functionality can be tested by running:
1) npm run test
2) node loggingTests.js
