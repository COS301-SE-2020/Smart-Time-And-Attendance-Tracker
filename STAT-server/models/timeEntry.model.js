const mongoose = require('mongoose');

const TimeEntrySchema = mongoose.Schema({
  TaskID: {
    type: String,
    required : "Task required."
  },
  StartTime: {
    type: Number,
    required: "Start time required."
  },
  EndTime: {
    type: Number,
    required: "End time required."
  },
  Date: { 
    type: Date,
    required: "Date required."
  },
  Description: { 
    type: String,
    required: "Description of time entry is required."
  },
  Device: { 
    type: String,
    required: "Device required."
  }
});

module.exports = mongoose.model('TimeEntry', TimeEntrySchema);