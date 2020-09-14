//using a singleton
//could use a cookie or storage but didn't want to expose unnessary data to user.
// This class will allow data to be shared between all files without showing user's unnessary data.
class User {
    
    constructor() {
        if(!this.instance)
            this.instance = this;
        
        return this.instance;
    }
    getInstance() { 
        return this.instance;
    }

    get allProject() {
        return this._allProject;
    }

    set allProject(projects) {
        //alert("this._allProject");
        this._allProject = projects;
    }

    getTasks(projectID) {
        let obj = JSON.parse(this._allProject);
        for(p in obj.projects)
        {
            if(obj.projects[p].ID == projectID)
            {
                return obj.projects[p].tasks;
            }
        }
        return undefined;
    }

    getHourlyRate(projectID) {
        ///alert("Projects: ");
        //console.log(this._allProject);
        let obj = JSON.parse(this._allProject);
        for(var p in obj.projects)
        {
            if(obj.projects[p].ID == projectID)
            {
                return obj.projects[p].hourlyRate;
            }
        }
        return undefined;
    }
}

User.instance = undefined;
