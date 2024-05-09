// LCFR API made by storcale

cconst error404 = "Error 404: Not found"
var date = new Date()

const version = "1.0.0 RELEASE"

// Web App

 function doGet(e) {
  Logger.log("received request at" + date)

  var action = e.parameter.action
  var type = e.parameter.type


  switch(type){

  case "getToken": // get a new token
   if (!e.parameter.authorization) {
    return ContentService.createTextOutput("401: No authorization parameter"  ).setMimeType(ContentService.MimeType.TEXT);
   }
   var actionsParameter = e.parameter.actions;
   var actions = actionsParameter.split(";")
   var actionType = e.parameter.actionType;
   var expire = e.parameter.expire;
   var authorizationHeader = e.parameter.authorization;

   var credentials = TokenManager.extractCredentials(authorizationHeader); // extract id and named token for authorization
   var token = TokenManager.generateToken() // generate new token
   TokenManager.storeToken(credentials.username,date,token,actions,actionType,expire) // register the new token

   Logger.log(credentials.username + " sucessfully created new token at " + date)
  return ContentService.createTextOutput(token).setMimeType(ContentService.MimeType.TEXT);

   case "information":
   switch(action){
    case "getVersion":
     return ContentService.createTextOutput(version).setMimeType(ContentService.MimeType.TEXT);

    default:
     Logger.log("No action specified or wrong action syntax for information type")
     return ContentService.createTextOutput("no action specified or wrong syntax").setMimeType(ContentService.MimeType.TEXT);
   }
    
    case "roster":
     switch(action){
    
     case "searchUser":
      var callsign = e.parameter.callsign
      var division = e.parameter.division
      var discordBot = e.parameter.discordbot

      var user = roster_searchUser(callsign,division) // call function
      if(user == false){
        if(discordBot == "true"){
          var output = "\nUnable to find this callsign in this division."
        }else{
          var output = "false"
        }
         return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.TEXT);
      }
      if(discordBot == "true"){
       var output =  "\n" + "\n**Discord username:** " + user.discord + "\n**Roblox username**: " + user.roblox + "\n**Rank:** " + user.rank + "\n**Divisions:** " + user.divisions + "\n**Callsign:** " + user.callsign + "\n"
       return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.TEXT);
      }else{
       var output = JSON.stringify(user);
       return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.TEXT);
      }

      case "getCallsignAvaibility":
       var callsign = e.parameter.callsign

       var result = roster_getIfCallsignIsTaken(callsign) // call function
       return  ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.TEXT);
 
      default:
      Logger.log("No action specified or wrong action syntax for roster type")
      return ContentService.createTextOutput("no action specified or wrong syntax").setMimeType(ContentService.MimeType.TEXT);
    

    }
    default:
     Logger.log("No type specified or wrong syntax for action type input")
     return ContentService.createTextOutput("No type specified or wrong syntax for action type input").setMimeType(ContentService.MimeType.TEXT);
   }

  }


function doPost(e){

  var authorizationHeader = e.parameter.authorization
  var credentials = TokenManager.extractCredentials(authorizationHeader) // extract id and token from authorization
  var action = e.parameter.action
  var type = e.parameter.type

  if(TokenManager.processRequest(credentials.username,credentials.password,action,type) != false){
   Logger.log(credentials.username + " sucessfully authenticated at " + date);
   TokenManager.endToken(credentials.password); // mark the token as used
  }else{
    Logger.log("401: Authentication failed")
   return ContentService.createTextOutput("401: Authentication failed").setMimeType(ContentService.MimeType.TEXT);
  }
  

  switch(type){
  case "discord":
   switch(action){
    case "shiftAdd":
   
     var host = e.parameter.host
     var user = e.parameter.user
    
     discord_shiftAdd(host,user)
     Logger.log("Successfully sent the webhook (shiftAdd)")
     return ContentService.createTextOutput("Successfully sent the webhook (shiftAdd)").setMimeType(ContentService.MimeType.TEXT);

    case "report":

     var reporter = e.parameter.reporter
     var user = e.parameter.user
     var info = e.parameter.info
     var image = e.parameter.image

     Logger.log("sending report")
     discord_sendReport(reporter,user,info,image)
     Logger.log("Sent request to post webhook")
     return ContentService.createTextOutput("Successfully sent the webhook to report").setMimeType(ContentService.MimeType.TEXT);

   

    case "notice":
   
     var noticer = e.parameter.noticer
     var noticed = e.parameter.noticed
     var image = e.parameter.image
     var reason = e.parameter.reason
    
     discord_notice(noticer,noticed,reason,image)
     Logger.log("Successfully sent the webhook to notice someone")
     return ContentService.createTextOutput("Successfully sent the webhook to notice someone").setMimeType(ContentService.MimeType.TEXT);

    default:
     Logger.log("No action specified or wrong action syntax for discord type")
     return ContentService.createTextOutput("no action specified or wrong syntax").setMimeType(ContentService.MimeType.TEXT);
     
   }

  case "applications":
   switch(action){
     default:
     return ContentService.createTextOutput("Applications type is not available right now.").setMimeType(ContentService.MimeType.TEXT);
   }
  
   case "roster":
    switch(action){
     case "addUser":
      var callsign = e.parameter.callsign
      var division = e.parameter.division
      var rank = e.parameter.rank
      var discord = e.parameter.discord
      var roblox = e.parameter.roblox
      var result = roster_addUser(callsign,division,rank,discord,roblox) // calls function
      if(result){
       Logger.log("Sucessfully added " + discord + " to the roster.")
       return ContentService.createTextOutput("Sucessfully added " + discord + " to the roster.").setMimeType(ContentService.MimeType.TEXT);
      }else{
        return ContentService.createTextOutput("Couldnt add " + callsign + " to the roster. Check the parameters").setMimeType(ContentService.MimeType.TEXT);
      }

      case "removeUser":
       var callsign = e.parameter.callsign
       var division = e.parameter.division
       var result = roster_removeUser(callsign,division) // calls function
       if(result){
       Logger.log("Sucessfully removed " + callsign + " from the roster.")
       return ContentService.createTextOutput("Sucessfully removed " + callsign + " from the roster.").setMimeType(ContentService.MimeType.TEXT);
      }else{
        return ContentService.createTextOutput("Couldnt remove " + callsign + " from the roster. Check if callsign exists and is in right division."  ).setMimeType(ContentService.MimeType.TEXT);
      }

      case "editUser":
       var division = e.parameter.division
       var callsign = e.parameter.callsign
       var newCallsign = e.parameter.newCallsign
       var discord = e.parameter.discord
       var roblox = e.parameter.roblox
       var result = roster_editUser(callsign,division,roblox,discord,newCallsign) // calls function
       if(result){
       Logger.log("Sucessfully edit " + callsign + " from the roster.")
       return ContentService.createTextOutput("Sucessfully edited " + callsign + "'s information from the roster.").setMimeType(ContentService.MimeType.TEXT);
      }else{
        return ContentService.createTextOutput("Couldnt edit" + callsign + "'s information from the roster. Check the parameters."  ).setMimeType(ContentService.MimeType.TEXT);
      }
      
    

     default:
      Logger.log("No action specified or wrong action syntax for roster type")
      return ContentService.createTextOutput("no action specified or wrong syntax").setMimeType(ContentService.MimeType.TEXT);
    }
  
  default:
     Logger.log("No type specified or wrong syntax for action type input")
     return ContentService.createTextOutput("No type specified or wrong syntax for type input: " + type).setMimeType(ContentService.MimeType.TEXT);
   
}
}

