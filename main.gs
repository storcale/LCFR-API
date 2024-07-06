const error404 = "Error 404: Not found"
var date = new Date()
Logger = BetterLog.useSpreadsheet("1sMXmJfF2AoZllSDMf0UVMIXsZwgbTDF_oMIgN_SOWuc")
const version = '1.6.5'

// Web App

 function doGet(e) {
 try{
  console.log("received request at" + date)

  var action = e.parameter.action
  var type = e.parameter.type

  if(!action || !type){
    throw SyntaxError("422: Action or Type is missing"  )
  }
  

  switch(type){

  case "getToken": // get a new token
   
   var actionsParameter = e.parameter.actions;
   var actions = actionsParameter.split(";")
   var actionType = e.parameter.actionType;
   var expire = e.parameter.expire;
   var authorizationHeader = e.parameter.authorization;
   var dept = e.parameter.dept;

   if (!e.parameter.authorization) {
    throw Error("401: No authorization parameter"  )
   }
   if(!actionsParameter || !actionType || !expire || !dept){
     throw SyntaxError("422: malformed request at getToken" )
   }

   var credentials = TokenManager.extractCredentials(authorizationHeader); // extract id and named token for authorization
   var token = TokenManager.generateToken() // generate new token
   TokenManager.storeToken(credentials.username,date,token,actions,actionType,expire,dept) // register the new token

   Logger.log(credentials.username + " sucessfully created new token at " + date)
  return ContentService.createTextOutput(token).setMimeType(ContentService.MimeType.TEXT);

   case "information":
   switch(action){
    case "getVersion":
     return ContentService.createTextOutput(version).setMimeType(ContentService.MimeType.TEXT);

    default:
     throw SyntaxError("No action specified or wrong action syntax for information type")
     
   }
    
    case "roster":
     switch(action){
    
     case "searchUser":
      
      var callsign = e.parameter.callsign
      var division = e.parameter.division
      var discordBot = e.parameter.discordbot
      if(!callsign || !division){
        throw SyntaxError("422: Malformed request")
      }

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
       if(!callsign){
        throw SyntaxError("422: Malformed request")
      }

       var result = roster_getIfCallsignIsTaken(callsign) // call function
       return  ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.TEXT);
 
      default:
      Logger.log("No action specified or wrong action syntax for roster type")
      return ContentService.createTextOutput("no action specified or wrong syntax").setMimeType(ContentService.MimeType.TEXT);
    

    }
    default:
     throw SyntaxError("No type specified or wrong syntax for action type input")
   }
   }catch(error){
    Logger.log(error)
    console.log(error)
    return ContentService.createTextOutput(error).setMimeType(ContentService.MimeType.TEXT);
   }
  }


function doPost(e){
 try{
 
  var authorizationHeader = e.parameter.authorization
  if(!authorizationHeader){
  throw SyntaxError("401: authentication failed ; no authentication input"  )
 }
  var credentials = TokenManager.extractCredentials(authorizationHeader) // extract id and token from authorization
  var action = e.parameter.action
  var type = e.parameter.type
  var dept = e.parameter.dept
  if(!action || !type || !dept){
  throw SyntaxError("422: Malformed request at authentication")
  }
 

  if(TokenManager.processRequest(credentials.username,credentials.password,action,type,dept) != false){
   Logger.log(credentials.username + " sucessfully authenticated at " + date);
   TokenManager.endToken(credentials.password); // mark the token as used
  }else{
    Logger.log("401: Authentication failed")
   throw Error("401: Authentication failed")
  }
  
  if(dept == "lcfr"){
  switch(type){
  case "discord":
   switch(action){
    case "shiftAdd":
   
     
     var host = e.parameter.host
     var user = e.parameter.user
     if(!host || !user){
      throw SyntaxError("422: Malformed request at discord shiftadd parameters")
     }
    
     discord_shiftAdd(dept,host,user)
     Logger.log("Successfully sent shiftAdd of " + host + " on " + user)
     return ContentService.createTextOutput("Successfully sent shiftAdd of " + host + "on " + user).setMimeType(ContentService.MimeType.TEXT);

    case "report":

     
     var reporter = e.parameter.reporter
     var user = e.parameter.user
     var info = e.parameter.info
     var image = e.parameter.image
     if(!reporter || !user || !info){
      throw SyntaxError("422: Malformed request at discord report parameters")
     }
     discord_sendReport(dept,reporter,user,info,image)
     Logger.log("Sent discord report webhook of " + reporter + " on " + user + " for " + info)
     return ContentService.createTextOutput("Successfully sent the webhook to report").setMimeType(ContentService.MimeType.TEXT);

   

    case "notice":
   
     
     var noticer = e.parameter.noticer
     var noticed = e.parameter.noticed
     var image = e.parameter.image
     var reason = e.parameter.reason
     if(!noticer || !noticed || !reason){
      throw SyntaxError("400: Malformed request at discord notice parameters")
     }

     discord_notice(dept,noticer,noticed,reason,image)
     Logger.log("Successfully sent the webhook to notice " + noticed +" by " + noticer + " for " + reason)
     return ContentService.createTextOutput("Successfully sent the webhook to notice " + noticed +" by " + noticer + " for " + reason).setMimeType(ContentService.MimeType.TEXT);

    default:
     throw SyntaxError("222: No action specified or wrong action syntax for discord type")
     
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
      if(!callsign || !division || !rank || !discord || !roblox){
      throw SyntaxError("422: Malformed request at roster addUser parameters")
      }

      var result = roster_addUser(callsign,division,rank,discord,roblox) // calls function
      if(result){
       Logger.log("Sucessfully added " + discord + " to the roster.")
       return ContentService.createTextOutput("Sucessfully added " + discord + " to the roster.").setMimeType(ContentService.MimeType.TEXT);
      }else{
        throw Error("Couldnt add " + callsign + " to the roster. Check the parameters")
      }

     case "removeUser":
      
       var callsign = e.parameter.callsign
       var division = e.parameter.division
       if(!callsign || !division){
      throw SyntaxError("422: Malformed request at roster removeUser parameters")
      }

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
       if(!callsign || !division || !discord || !roblox || !newCallsign){
        throw SyntaxError("422: Malformed request at roster editUser parameters")
       }

       var result = roster_editUser(callsign,division,roblox,discord,newCallsign) // calls function
       if(result){
       Logger.log("Sucessfully edit " + callsign + " from the roster.")
       return ContentService.createTextOutput("Sucessfully edited " + callsign + "'s information from the roster.").setMimeType(ContentService.MimeType.TEXT);
      }else{
        throw Error("Couldnt edit" + callsign + "'s information from the roster. Check the parameters."  )
      }
      
     default:
      throw SyntaxError("422: No action specified or wrong action syntax for roster type")
    }
  
  default:
     throw SyntaxError("422: No type specified or wrong syntax for action type input")
}
  }else if(dept == "lcems"){
   switch(type){
    case "discord":
     switch(action){
     case "shiftAdd":
      
      var host = e.parameter.host
      var user = e.parameter.user
      if(!host || !user){
       throw SyntaxError("422: Malformed request at discord shiftadd parameters")
      }
    
      discord_shiftAdd(dept,host,user)
      Logger.log("Successfully sent shiftAdd of " + host + " on " + user)
      return ContentService.createTextOutput("Successfully sent shiftAdd of " + host + " on " + user).setMimeType(ContentService.MimeType.TEXT);

    case "report":
     
      var reporter = e.parameter.reporter
      var user = e.parameter.user
      var info = e.parameter.info
      var image = e.parameter.image
      if(!reporter || !user || !info){
       throw SyntaxError("422: Malformed request at discord report parameters")
      }

      discord_sendReport(dept,reporter,user,info,image)
      Logger.log("Sent discord report webhook of " + reporter + " on " + user + " for " + info)
      return ContentService.createTextOutput("Sent discord report webhook of " + reporter + " on " + user + " for " + info).setMimeType(ContentService.MimeType.TEXT);

   

    case "notice":
     
     var noticer = e.parameter.noticer
     var noticed = e.parameter.noticed
     var image = e.parameter.image
     var reason = e.parameter.reason
     if(!noticer || !noticed || !reason){
      throw SyntaxError("400: Malformed request at discord notice parameters")
     }
    
     discord_notice(dept,noticer,noticed,reason,image)
     Logger.log("Successfully sent the webhook to notice " + noticed +" by " + noticer + " for " + reason)
     return ContentService.createTextOutput("Successfully sent the webhook to notice " + noticed +" by " + noticer + " for " + reason).setMimeType(ContentService.MimeType.TEXT);

    default:
     console.log("No action specified or wrong action syntax for discord type")
     throw SyntaxError("no action specified or wrong syntax for discord type")
     }
     
    case "roster":
     switch(action){
    
      case "addUser":
       
       var callsign = e.parameter.callsign
       var division = e.parameter.division
       var rank = e.parameter.rank
       var discord = e.parameter.discord
       var roblox = e.parameter.roblox
       if(!callsign || !division || !rank || !discord || !roblox){
       throw SyntaxError("422: Malformed request at roster addUser parameters")
       }

       var result = roster_addUser(callsign,division,rank,discord,roblox) // calls  function
       if(result){
       Logger.log("Sucessfully added " + discord + " to the roster.")
       return ContentService.createTextOutput("Sucessfully added " + discord + " to the roster.").setMimeType(ContentService.MimeType.TEXT);
       }else{
        throw Error("Couldnt add " + callsign + " to the roster. Check the parameters")
       }

      case "removeUser":
       
       var callsign = e.parameter.callsign
       var division = e.parameter.division
       if(!callsign || !division){
       throw SyntaxError("422: Malformed request at roster removeUser parameters")
       }

       var result = roster_removeUser(callsign,division) // calls function
       if(result){
       Logger.log("Sucessfully removed " + callsign + " from the roster.")
       return ContentService.createTextOutput("Sucessfully removed " + callsign + " from the roster.").setMimeType(ContentService.MimeType.TEXT);
       }else{
        throw Error("Couldnt remove " + callsign + " from the roster. Check if callsign exists and is in right division."  )
       }

      case "editUser":
       
       var division = e.parameter.division
       var callsign = e.parameter.callsign
       var newCallsign = e.parameter.newCallsign
       var discord = e.parameter.discord
       var roblox = e.parameter.roblox
       if(!callsign || !division || !discord || !roblox || !newCallsign){
       throw SyntaxError("422: Malformed request at roster editUser parameters")
       } 
       var result = roster_editUser(callsign,division,roblox,discord,newCallsign) // calls function
       if(result){
       Logger.log("Sucessfully edit " + callsign + " from the roster.")
       return ContentService.createTextOutput("Sucessfully edited " + callsign + "'s information from the roster.").setMimeType(ContentService.MimeType.TEXT);
      }else{
        throw Error("Couldnt edit" + callsign + "'s information from the roster. Check the parameters.")
      }
      default:
      Logger.log("No action specified or wrong action syntax for roster type")
      return ContentService.createTextOutput("no action specified or wrong syntax").setMimeType(ContentService.MimeType.TEXT);
     }
      
    case "applications":
     return ContentService.createTextOutput("Applications type is not available right now.").setMimeType(ContentService.MimeType.TEXT);
    default:
     Logger.log("No type specified or wrong syntax for action type input:" + type)
     throw SyntaxError("No type specified or wrong syntax for type input: " + type)
   
   }

  }else{
    Logger.log("No dept specified or wrong syntax for dept input")
     throw SyntaxError("No dept specified or wrong syntax for dept input: " + dept)
  }
  }catch(error){
    Logger.log(error)
    console.log(error)
    return ContentService.createTextOutput(error).setMimeType(ContentService.MimeType.TEXT);
   }
}



