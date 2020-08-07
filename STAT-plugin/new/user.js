
class User {
    
    constructor() {
        if(!this.instance)
            this.instance = this;
        
        this._type = 'User';
        this.time = new Date();
        this._name = "Still need to set"; 
        return this.instance;
    }
    getInstance() { 
        return this.instance;
    }
    
    singletonMethod() {
        console.log("Name " + this.getInstance().name + "   " + new Date());
        return 'singletonMethod';
    }

    static staticMethod() {
        return 'staticMethod';
    }

    get type() {
        return this._type;
    }
    
    set type(value) {
        this._type = value;
    }

    get name() {
        return this._name;
    }

    set name(n) {
        this._name = n;
    }

    get email() {
        return this.getInstance().email;
    }

    set email(e) {
        this.getInstance().email = e;
    }

    get allProject() {
        return this._allProject;
    }

    set allProject(projects) {
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

}


User.instance = undefined;
