
/**
  * @file STAT-server/analysis/tensorflow.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles the predictive analysis
  * @date 10 September 2020
 */

/**
* Filename:             STAT-server/analysis/tensorflow.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   10 Spetember 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles the predictive analysis
*
*/ 


const AnalysisHelper = require('../helpers/analysis.helper');
const tensor = require("@tensorflow/tfjs");
const totalweeks = 4;

function getTimeEntriesForProject(entries)
{
    var projectsList = getAllProjects(entries);
    var newEntries = [];
    for(p in projectsList)
        newEntries.push([]);

    for(e in entries)
    {
        for(var p=0; p<projectsList.length; p++)
        {
            if(entries[e].ProjectID == projectsList[p])
            {
                newEntries[p].push(entries[e]);
            }
        }
    }
    return newEntries;
}

function getAllProjects(entries)
{
    var projects = [];
    for(e in entries)
    {
        if(!projects.includes(entries[e].ProjectID))
            projects.push(entries[e].ProjectID);
    }
    return projects;
}

function sortByDate(entries) {
    var sortedEntries;
    entries.forEach(projects => {
        projects.sort((a,b) => a.Date - b.Date);
            
    });
    return entries;
}
module.exports.try2 = function(req, res){
    var totalDays = totalweeks*7;
    if(req.body.weeks)
        totalDays = req.body.weeks *7;
    
    var epoch = 500;
    if(req.body.epoch)
        epoch = req.body.epoch;
    //console.log("epoch  : " + epoch + " days " + totalDays);
    var userTimes = [];
    for(var t = totalDays; t>0; t--)
    {
        var dateVar = new Date();
        dateVar = new Date(dateVar.setDate(dateVar.getDate()-t));
        const project = req.body.projectID;
        AnalysisHelper.getUserTotalTimeForProject(project, dateVar, (err, result) => {
            if (err) 
                return res.status(500).send({message: 'Internal Server Error: ' + err});
            else if (!result){}
            else
                userTimes.push(result);

            if(totalDays == userTimes.length)
            {
                //console.log("RETURNING!!!!!!!!!!!!!!!!1");
                //console.log(userTimes);
                var sortedByPorjects = getTimeEntriesForProject(userTimes);
                var sortedByDate = sortByDate(sortedByPorjects);
                var newArr = [];
                sortedByDate.forEach(async function(element){
                    var xArr= [], yArr = [], t2=0, inn =0, inn2=1;
                    for(t2 = 0; t2<totalDays/7; t2++)
                    {
                        var weekHours = 0;
                        for(var t3 = 0; t3<7; t3++)
                        {
                            xArr.push(inn2);
                            yArr.push(element[inn].Time);
                            weekHours+= element[inn].Time;   
                            inn++;
                            inn2 += 1;
                        }
                        //xArr.push(t2+1);
                        //yArr.push(weekHours);
                    }
                    //console.log(yArr);
                    //console.log(xArr);
                    
                    const trainTensors = {
                        day: tensor.tensor2d(xArr, [inn, 1]),  
                        timeMin: tensor.tensor2d(yArr, [inn, 1])
                    };    
                    const predictionWeek = [[29], [30], [31], [32], [33], [34], [35]];                        
                    //console.log("------------------");
                    
                    const model = tensor.sequential();
                    
                    model.add(tensor.layers.dense({inputShape: [1], units: 1}));

                    const sgdOpt = tensor.train.sgd(0.025);
                    model.compile({loss: 'meanAbsoluteError', optimizer: sgdOpt});
                    var lastLoss;
                    
                    (async function() {

                        for(var i=0; i<100; i++)
                        {
                            var result = await model.fit(trainTensors.day,
                                trainTensors.timeMin,
                                {epochs: epoch});
                            //console.log("i : " + i + "    loss: " + result.history.loss[0]);
                            lastLoss = result.history.loss[0] + "";
                        }
                        lastLoss = (Math.round(parseInt(lastLoss)) / inn);
                    })().then(() => {  
                        var predict = model.predict(tensor.tensor2d(predictionWeek));
                        //console.log("lastLoss  "+ lastLoss);
                        const ToReturn = {
                            prediction : Array.from(predict.dataSync()),
                            pastTime: Array.from(trainTensors.timeMin.dataSync()),
                            percentageOfErrorOfModel: lastLoss
                        };
                        trainTensors.day.dispose();
                        trainTensors.timeMin.dispose();
                        //console.log(ToReturn);                            
                        return res.status(200).send({results: ToReturn});
                    });
                });        
            }
        });
        
    }
}

/*
module.exports.try2 = function(req, res){
    var userTimes = [];
    if(req.projects.length > 0)
    {
        const totalEntries = req.projects.length * totalDays;
        for(var t = totalDays; t>0; t--)
        {
            var dateVar = new Date();
            dateVar = new Date(dateVar.setDate(dateVar.getDate()-t));
            for (var p = 0; p < req.projects.length; p++) {
                const project = req.projects[p];
                AnalysisHelper.getUserTotalTimeForProject(project, dateVar, (err, result) => {
                    if (err) 
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                    else if (!result){}
                    else
                        userTimes.push(result);

                    if(totalEntries == userTimes.length)
                    {
                        //console.log("RETURNING!!!!!!!!!!!!!!!!1");
                        //console.log(userTimes);
                        var sortedByPorjects = getTimeEntriesForProject(userTimes);
                        var sortedByDate = sortByDate(sortedByPorjects);
                        var newArr = [];
                        sortedByDate.forEach(async function(element){
                            var xArr= [], yArr = [], t2=0, inn =0, inn2=1/7;
                            for(t2 = 0; t2<totalDays/7; t2++)
                            {
                                var weekHours = 0;
                                for(var t3 = 0; t3<7; t3++)
                                {
                                    xArr.push(inn2);
                                    yArr.push(element[inn].Time);
                                    weekHours+= element[inn].Time;   
                                    inn++;
                                    inn2 += 1/7;
                                }
                                //xArr.push(t2+1);
                                //yArr.push(weekHours);
                            }
                            console.log(yArr);
                            console.log(xArr);
                            //var ys = tensor.tensor1d(yArr, 'float32');
                            //var xs = tensor.tensor1d(xArr, 'int32');
                            const trainTensors = {
                                day: tensor.tensor2d(xArr, [inn, 1]),  
                                timeMin: tensor.tensor2d(yArr, [inn, 1])
                            };    
                            const predictionWeek = [[29], [30], [31], [32], [33], [34], [35]];                        
                            //console.log("------------------");
                            
                            const model = tensor.sequential();
                            //const layer = tensor.layers.batchNormalization({axis: 1});

                            model.add(tensor.layers.dense({inputShape: [1], units: 1}));

                            const sgdOpt = tensor.train.sgd(0.025);
                            model.compile({loss: 'meanAbsoluteError', optimizer: sgdOpt});
                            var lastLoss;
                            //console.log(totalDays + "    " + yArr.length);

                            (async function() {
    
                                for(var i=0; i<500; i++)
                                {
                                    var result = await model.fit(trainTensors.day,
                                        trainTensors.timeMin,
                                        {epochs: 1000});
                                //    console.log("i : " + i + "    loss: " + result.history.loss[0]);
                                    lastLoss = result.history.loss[0] + " ";
                                    //result.dispose();
                                //    console.log('numTensors (outside tidy): ' + tf.memory().numTensors);
                                
                                }
                                lastLoss = Math.round(parseInt(lastLoss)) / inn;
                                //console.log("lastLoss  " + lastLoss/numberOfDays);
                            
                            })().then(() => {  
                                //ys.print();
                                var predict = model.predict(tensor.tensor2d(predictionWeek));
                                const ToReturn = {
                                    prediction : Array.from(predict.dataSync()),
                                    pastTime: Array.from(trainTensors.timeMin.dataSync()),
                                    errorOfModel: lastLoss
                                };
                                trainTensors.day.dispose();
                                trainTensors.timeMin.dispose();
                                console.log(ToReturn);                            
                                return res.status(200).send({results: ToReturn});
                            });
                        });        
                    }
                });
            }
        }
    }
    else
        return res.status(200).send({results: userTimes});
}
*/
