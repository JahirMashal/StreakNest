'use strict'
const crypto=require("crypto")

///
exports.mongoAddress=function(connection){
return `mongodb+srv://jahirmashal91_db_user:tH2cQrTk6MsoaKrR@streaknestcluster.5dystfw.mongodb.net/dev1streaknest?retryWrites=true&w=majority&appName=streaknestCluster`

}


exports.mongoAddress2 = function (connection) {
  
  if (connection.protocol == "https") {
    return `mongodb+srv://${connection.username}:${connection.password}@${
      connection.host
    }/${connection.name ? connection.name : ""}?retryWrites=true&w=majority`;
  }
  
};
exports.parseUserAgent=(userAgent) =>{
  // Define a regular expression pattern to capture key components
  const regex =
    /(Mozilla\/\d+\.\d+) \(([^)]+)\) AppleWebKit\/([^ ]+) \(([^)]+)\) Chrome\/([^ ]+) Safari\/([^ ]+)( Edg\/([^ ]+))?/;

  // Use the regular expression to match the components in the User-Agent string
  const matches = userAgent.match(regex);

  // Extract information based on the match groups
  if (matches) {
    const browser = matches[1];
    const os = matches[2];
    const webkitVersion = matches[3];
    const geckoDetails = matches[4];
    const chromeVersion = matches[5];
    const safariVersion = matches[6];
    const edgeVersion = matches[8] || null; // Edge might be undefined if not present

    // Return an object containing the extracted information
    return {
      browser,
      os,
      webkitVersion,
      geckoDetails,
      chromeVersion,
      safariVersion,
      edgeVersion,
    };
  }

  // Return null if there are no matches
  return null;
}

exports.gettersConfig={toObject : {getters: true}, toJSON : {getters: true}}

exports.connectionConfig={useNewUrlParser: true, useUnifiedTopology: true}



exports.adminPassword=function(){
   return crypto.randomBytes(10).toString("hex")
}

