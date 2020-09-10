const AnalysisHelper = require('../helpers/analysis.helper');
const tensor = require("@tensorflow/tfjs");
const totalDays = 7*4;

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
    var userTimes = [];
    console.log(req.projects);
    if(req.projects.length > 0)
    {
        const totalEntries = req.projects.length * totalDays;
        for(var t = totalDays; t>0; t--)
        {
            var dateVar = new Date();
            dateVar = new Date(dateVar.setDate(dateVar.getDate()-t));
            //console.log(dateVar);
            for (var p = 0; p < req.projects.length; p++) {
                const project = req.projects[p];
                AnalysisHelper.getUserTotalTimeForProject(project.ID, dateVar, (err, result) => {
                    if (err) 
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                    else if (!result){}
                    else
                        userTimes.push(result);

                    if(totalEntries == userTimes.length)
                    {
                        console.log("RETURNING!!!!!!!!!!!!!!!!1");
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

                            var ys = tensor.tensor1d(yArr, 'float32');
                            var xs = tensor.tensor1d(xArr, 'int32');
                            console.log("------------------");
                            
                            const model = tensor.sequential();
                            model.add(tensor.layers.dense({units: 1, inputShape: [1]}));
                            model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
                            console.log(totalDays + "    " + yArr.length);
                            await model.fit(xs, ys, {epochs : 30}).then(() => {  
                                ys.print();
                                var nextElement = inn2; 
                                console.log(nextElement + "   " + inn + "  " + inn2);
                                var prediction = [];     
                                for(var i=0; i<7; i++)
                                {
                                    //var output = Array.from(model.predict(tensor.tensor1d([(nextElement/7)])).dataSync())[0];
                                    var output = Array.from(model.predict(tensor.tensor1d([nextElement])).dataSync())[0];
                                    console.log("Predict     " + output +"    " + nextElement);
                                    prediction.push(output);
                                    nextElement += (1/7);
                                }

                                console.log("------------------");

                                var text = {
                                    "ProjectID": element[0].ProjectID,
                                    "PastTimes" : yArr,
                                    "Prediction" : prediction     
                                };
                                newArr.push(text);
                                if(sortedByDate.length == newArr.length)
                                    return res.status(200).send({results: newArr});
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

