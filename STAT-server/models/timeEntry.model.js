const mongoose = require('mongoose');

const TimeEntrySchema = mongoose.Schema({
  TimeID: { 
    type: Integer,
    required : "ID required.",
    unique: true
  },
  TaskID: {
    type: Integer,
    required : "Task required.",
  },
  Duration: { 
    type: String,
    required: "Duration required."
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