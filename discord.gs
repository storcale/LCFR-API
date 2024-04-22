
// Webhooks

  

 function discord_sendReport(reporter,user,info,image) {
  
   var pfp = "https://media.discordapp.net/attachments/1100385478164893746/1206930457971789834/LCFRlogo.png?ex=65ddcc94&is=65cb5794&hm=8514699e235aeb6a23c002d70e68ae14af6a996d552227efffa10189aa651ea7&=&format=webp&quality=lossless&width=662&height=662"
   var url = "https://discord.com/api/webhooks/NOT_AUTHORIZED" // removed url from github for security reasons
   var payload = 
    {
   "embeds": [{
    
    "title": "New report:",
    "thumbnail": {
      "url":  pfp
    },
    "image": {
      "url": image
    },
    "color": 16711680,
    "fields":[
      {
        "name": "Username",
        "value": user,
        "inline": false
      },
      {
        "name": 'Reason',
        "value": info,
        "inline": false
      }
 
    ],
    "footer": {
      "text": "Reported by " + reporter,
      "icon_url": null
    }
   }]
    };
   var payloadString = JSON.stringify(payload);

   var options = {
     method: 'post',
     contentType: 'application/json', 
     payload: payloadString,
   };

   var response = UrlFetchApp.fetch(url, options);
   Logger.log(response)
   return response
  }
  

 function discord_shiftAdd(host,user){
     var pfp = "https://media.discordapp.net/attachments/1100385478164893746/1206930457971789834/LCFRlogo.png?ex=65ddcc94&is=65cb5794&hm=8514699e235aeb6a23c002d70e68ae14af6a996d552227efffa10189aa651ea7&=&format=webp&quality=lossless&width=662&height=662"
   var url = "https://discord.com/api/webhooks/NOT_AUTHORIZED" // removed url from github for security reasons
   var payload = 
    {
   "embeds": [{
    
    "title": "Shift attendance log:",
    "thumbnail": {
      "url":  pfp
    },
    
    "color": 3066993,
    "fields":[
      {
        "name": "User",
        "value": user,
        "inline": false
      },
    
 
    ],
    "footer": {
      "text": "Noticed by " + host,
      "icon_url": null
    }
    }]
    };
   var payloadString = JSON.stringify(payload);

   var options = {
    method: 'post',
    contentType: 'application/json', 
    payload: payloadString,
   };

   var response = UrlFetchApp.fetch(url, options);
   Logger.log(response)
   return response
  }



 function discord_notice(noticer,noticed,reason,image){
    var pfp = "https://media.discordapp.net/attachments/1100385478164893746/1206930457971789834/LCFRlogo.png?ex=65ddcc94&is=65cb5794&hm=8514699e235aeb6a23c002d70e68ae14af6a996d552227efffa10189aa651ea7&=&format=webp&quality=lossless&width=662&height=662"
    var url = "https://discord.com/api/webhooks/NOT_AUTHORIZED" // removed url from github for security reasons
    var payload = 
     {
     "embeds": [{
    
     "title": "New award point notice:",
     "thumbnail": {
       "url":  pfp
     },
     "image": {
       "url": image
     },
     "color": 3066993,
     "fields":[
       {
        "name": "User",
        "value": noticed,
        "inline": false
       },
       {
        "name": 'Reason',
        "value": reason,
        "inline": false
       }
 
     ],
     "footer": {
       "text": "Noticed by " + noticer,
       "icon_url": null
     }
    }]
    };
    var payloadString = JSON.stringify(payload);

    var options = {
     method: 'post',
     contentType: 'application/json', 
     payload: payloadString,
    };

    var response = UrlFetchApp.fetch(url, options);
    Logger.log(response)
    return response
  }


// End of webhook class


