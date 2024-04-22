// Roster

 /**
   * Remove an employee from the roster. Returns the information trough information.discord,roblox,rank,divisions and callsign of the user. Returns false if did not find user
   * 
   * @param {number} callsign - Argument Callsign : The callsign of the employee
   * @param {string} division - Argument Division : The division sheet where is the employee
   * @return {object} 
   * 
   * @public
   * @function roster_searchUser
   * @requires RosterAPI
 */
 function roster_searchUser(callsign, division){
    var information = RosterAPI.searchEmployee(callsign,division)
    if(information != false){
     Logger.log("Sucessfully fetched ")
     return information
    }else{
     return false
    }
  }

 /**
   * Add a new employee to the roster. Returns true if sucess, false if error/not found
   * 
   * @param {number} callsign - Argument Callsign : The callsign of the employee
   * @param {string} division - Argument Division : The division sheet where to add the employee
   * @param {string} rank - Argument rank : The rank of the new employee
   * @param {string} discord - Argument discord : The discord username of the employee
   * @param {string} roblox - Argument roblox :  The roblox username of the employee
   * @return {boolean} 
   * 
   * @requires RosterAPI
   * @function roster_addUser
   * @public
 */
 function roster_addUser(callsign,division,rank,discord,roblox){
    var result = RosterAPI.addEmployee(callsign,division,rank,discord,roblox)
    if(result != false){
     return true
    }else{
     return false
    }
 }

 /**
  *  Remove an employee from the roster.Returns true if sucess, false if error/not found
  * 
  * @param {number} callsign - Argument Callsign : The callsign of the employee
  * @param {string} division - Argument Division : The division sheet where is the employee
  * @return {boolean} 
  * @function roster_removeUser
  * @requires RosterAPI
  * @public
 */
 function roster_removeUser(callsign,division){
  var result = RosterAPI.removeEmployee(callsign,division)
  if(result != false){
     return true
    }else{
     return false
  }
 }

 /**
   * Edit an employee's informations.Returns true if sucess, false if error/not found
   * 
   * @param {number} callsign - Argument Callsign : The callsign of the employee to edit
   * @param {string} division - Argument Division : The division sheet where is the employee
   * @param {string} roblox - Argument Roblox : The roblox username to put instead of the old one. Put the old value to not edit.
   * @param {string} discord - Argument Discord : The discord username to put instead of the old one. Put the old value to not edit.
   * @param {number} newCallsign - Argument NewCallsign : The callsign to put instead of the old one. Put the old value to not edit.
   * @return {boolean} 
   * 
   * @requires RosterAPI
   * @function roster_editUser
   * @public
   */
 function roster_editUser(callsign,division,roblox,discord,newCallsign){
  var result = RosterAPI.editEmployee(callsign,division,roblox,discord,newCallsign)
  if(result != false){
     return true
    }else{
     return false
    }
 }

 /**
  * Get if a callsign has already been taken (from the roster).Returns true if taken, false if available
  * 
  * @param {number} callsign - Argument Callsign : The callsign to check the availability of.
  * @returns {boolean}
  * @requires CallsignSearcher
 */
 function roster_getIfCallsignIsTaken(callsign){
  var result = CallsignSearcher.searchForCallsign(callsign)
  return result
 }

