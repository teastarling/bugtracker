const { Schema, model } = require('mongoose');

// item model including username and user email for related front-end calls
const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    user: {
        type: String,
        required: true,
        trim: true,
    },
    issues: [{
        type: Schema.ObjectId,
        ref: 'Issue',
    }]
});

const Project = model('Project', projectSchema);

module.exports = Project;