
const mongoose = require("mongoose");
const ProjectModel = mongoose.model("Project");

module.exports.addTask = (req, res) => {


}

module.exports.complete = (req, res) => {
    ProjectModel.update({ _id: req.body.ProjectID},{Completed: true},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).json({ message: 'Project not found' }); 
        else
            return res.status(200).json({message: 'Project marked as completed'});
                
    });
}
module.exports.uncomplete = (req, res) => {
    ProjectModel.update({ _id: req.body.ProjectID},{Completed: false},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).json({ message: 'Project not found' }); 
        else
            return res.status(200).json({message: 'Project marked as uncompleted'});
                
    });
}

module.exports.update = (req, res) => {
    if(req.body.ProjectName)
    {
        ProjectModel.update({ _id: req.body.ProjectID},{ProjectName: req.body.ProjectName},(err, result) => {
            if (err) 
                return res.status(500).send({message: 'Internal Server Error: ' + error});
            else if (!result)
                return res.status(404).json({ message: 'Project not found' }); 
            else
                return res.status(200).json({message: 'Project name updated'});
                    
        });
    }
    if(req.body.TimeSpent)
    {
        ProjectModel.update({ _id: req.body.ProjectID},{TimeSpent: req.body.TimeSpent},(err, result) => {
            if (err) 
                return res.status(500).send({message: 'Internal Server Error: ' + error});
            else if (!result)
                return res.status(404).json({ message: 'Project not found' }); 
            else
                return res.status(200).json({message: 'Project time updated'});
                    
        });
    }
    if(req.body.DueDate)
    {
        ProjectModel.update({ _id: req.body.ProjectID},{DueDate: req.body.DueDate},(err, result) => {
            if (err) 
                return res.status(500).send({message: 'Internal Server Error: ' + error});
            else if (!result)
                return res.status(404).json({ message: 'Project not found' }); 
            else
                return res.status(200).json({message: 'Project due date updated'});
                    
        });
    }
}

