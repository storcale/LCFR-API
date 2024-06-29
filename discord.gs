



// Webhooks

  

 function discord_sendReport(dept,reporter,user,info,image) {
   if(dept == 'LCFR'){var url = "https://discord.com/api/webhooks/1207358471448825928/B3XYuaL6S-RWaxa_PlAQUdr7mEBv2ezXmfB9ROXu83DpJNqZRebPi6VxAerUOjHbus38"; var pfp = "https://media.discordapp.net/attachments/1100385478164893746/1206930457971789834/LCFRlogo.png?ex=66814694&is=667ff514&hm=2b424be8ed4e92b489f78b4b8912f926ef7324f82b123233bd07da48926ddab8&=&format=webp&quality=lossless&width=437&height=437"}else if(dept == 'EMS'){var url = "https://discord.com/api/webhooks/1256584458107355156/t2lmEf_GtRuWB2VvtBZkfRX_ldG5xmxsQYq3uuaS-wxhsdU6fbikOYJAw0lcDLZJ_bm8"; var pfp = "https://cdn.discordapp.com/attachments/1100385478164893746/1256585275858092053/ems-orange.png?ex=66814dbb&is=667ffc3b&hm=afc3bcfc9061782c748fe1d53fb75981653c59538307713b8b41570bf82ebb8d&"}else{
    throw ReferenceError("Error at Discord_sendReport: Dept variable is neither LCFR or LCEMS but triggered the function")
   }
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
  

 function discord_shiftAdd(dept,host,user){
    if(dept == 'lcfr'){var url = "https://discord.com/api/webhooks/1207358471448825928/B3XYuaL6S-RWaxa_PlAQUdr7mEBv2ezXmfB9ROXu83DpJNqZRebPi6VxAerUOjHbus38"; var pfp = "https://media.discordapp.net/attachments/1100385478164893746/1206930457971789834/LCFRlogo.png?ex=65ddcc94&is=65cb5794&hm=8514699e235aeb6a23c002d70e68ae14af6a996d552227efffa10189aa651ea7&=&format=webp&quality=lossless&width=662&height=662"}else{var url = "https://discord.com/api/webhooks/1256584458107355156/t2lmEf_GtRuWB2VvtBZkfRX_ldG5xmxsQYq3uuaS-wxhsdU6fbikOYJAw0lcDLZJ_bm8"; var pfp = "https://cdn.discordapp.com/attachments/1100385478164893746/1256585275858092053/ems-orange.png?ex=66814dbb&is=667ffc3b&hm=afc3bcfc9061782c748fe1d53fb75981653c59538307713b8b41570bf82ebb8d&"}
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



 function discord_notice(dept,noticer,noticed,reason,image){
    if(dept == 'lcfr'){var url = "https://discord.com/api/webhooks/1207358471448825928/B3XYuaL6S-RWaxa_PlAQUdr7mEBv2ezXmfB9ROXu83DpJNqZRebPi6VxAerUOjHbus38"; var pfp = "https://media.discordapp.net/attachments/1100385478164893746/1206930457971789834/LCFRlogo.png?ex=65ddcc94&is=65cb5794&hm=8514699e235aeb6a23c002d70e68ae14af6a996d552227efffa10189aa651ea7&=&format=webp&quality=lossless&width=662&height=662"}else{var url = "https://discord.com/api/webhooks/1256584458107355156/t2lmEf_GtRuWB2VvtBZkfRX_ldG5xmxsQYq3uuaS-wxhsdU6fbikOYJAw0lcDLZJ_bm8"; var pfp = "https://cdn.discordapp.com/attachments/1100385478164893746/1256585275858092053/ems-orange.png?ex=66814dbb&is=667ffc3b&hm=afc3bcfc9061782c748fe1d53fb75981653c59538307713b8b41570bf82ebb8d&"}
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


