const mongoose = require("mongoose")

var UserTimeEntrySchema = new mongoose.Schema({
    UserID:{
        type: mongoose.Schema.Types.ObjectId,
        required : "ID required.",
        unique: true
    },
    TimeEntries: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'TimeEntry' 
        }
    ]
});

mongoose.model("UserTimeEntry", UserTimeEntrySchema);
