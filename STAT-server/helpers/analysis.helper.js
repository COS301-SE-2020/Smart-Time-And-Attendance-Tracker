/**
  * @file STAT-server/helper/role.helper.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles some of the requests regarding Role model in our database. 
  * This is a helper file to handle Role related requests.
  * @date 2 July 2020
 */

/**
* Filename:             STAT-server/helper/role.helper.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   2 July 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles some of the requests regarding Role model in our database. 
*                       This is a helper file to handle Role related requests.
*
*/
const mongoose = require("mongoose");
const UserTimeEntryModel = mongoose.model("UserTimeEntry");
const TimeEntryModel = mongoose.model("TimeEntry");


module.exports.mostVisitedWebsite =async (arr1 ,done)=>{
//console.log("changed - "+ arr1.length)
   // var arr1=[10, 'abb', 'abb', 'abb', 2, 3, 'b', 3, 'b', 2, 4, 9, 3];
var mf = 1;
var m = 0;
var item;
for (var i=0; i<arr1.length; i++)
{
        for (var j=i; j<arr1.length; j++)
        {
                if (arr1[i] == arr1[j])
                 m++;
                if (mf<m)
                {
                  mf=m; 
                  item = arr1[i];
                }
        }
        m=0;
}
//alert (item+" ( " +mf +" times ) ") ;

    //console.log( item+" - "+mf);
    var object={"element":item , "number":mf}
    done(null,object,);

}



module.exports.deleteFromArray = (arr, value, done)=>{
   // console.log("value = " + value)
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
   //console.log(arr);
   done(null, arr);

}
/*
async function mostVisitedWebsite(array){
        if(urlArray.length == 0)
            return null;
        var modeMap = {};
        var maxEl = urlArray[0], maxCount = 1;
        for(var i = 0; i < urlArray.length; i++)
        {
            var el = urlArray[i];
            if(modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;  
            if(modeMap[el] > maxCount)
            {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        console.log(maxEl+" - "+maxCount);
}*/

/*async function deleteFromArray(arr, value){
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
  return arr;

}*/

/**
 * this function receives user id and project id and calculates users average time
 * @param {user id} req 
 * @param {average time} res 
 */
module.exports.getUserTotalTimeForProject = async(project, datePassed, done) => {
    var getTime =  (datePassed.toISOString().slice(0,10)).replace(/-/g,"/");

    try {
        const  val = await TimeEntryModel.aggregate([
            { $match: { $and: [{ProjectID: new mongoose.Types.ObjectId(project.ID)}, {Date: getTime}] } },
            {
              $group: {
                _id: "$ProjectID",
                Time: { $sum: "$ActiveTime"},
              }
            }
          ]);
          if(val.length == 0)
            { 
               var text = {
                "ProjectID" : project.ID,
                "ProjectName": project.projectName,
                "Time" : 0,
                "Date": datePassed};
            }
        
            else{
                var text = {
                    "ProjectID" : project.ID,
                    "ProjectName": project.projectName,
                    "Time" : val[0].Time,
                    "Date": datePassed
            }
        }
        done(null, text);
    } 
    catch (error) {
       done(error);
    }
    
}


