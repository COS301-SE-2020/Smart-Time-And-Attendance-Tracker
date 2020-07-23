const mongoose = require('mongoose');

const TimeEntrySchema = mongoose.Schema({
  TaskID: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task',
    required : "Task ID required."
  },
  ProjectID: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project',
    required : "Project ID required."
  },
  StartTime: {
    type: Number,
    required: "Start time required."
  },
  EndTime: {
    type: Number,
    required: "End time required."
  },
  ActiveTime: {
    type: Number,
    required: "Duration required."
  },
  Date: { 
    type: String,
    required: "Date required."
  },
  Description: { 
    type: String,
    required: "Description of time entry is required."
  },
  Device: { 
    type: String,
    required: "Device required."
  },
  MonetaryValue: { 
    type: Number
  },
  ProjectName: { 
    type: String,
    required: "Project name required."
  },
  TaskName: { 
    type: String,
    required: "Task name required."
  },

});

module.exports = mongoose.model('TimeEntry', TimeEntrySchema);