const { Schema, model } = require('mongoose');

// item model including username and user email for related front-end calls
const issueSchema = new Schema({
    name: {
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
    project: {
        type: String,
        required: true,
        trim: true,
    }
});

const Project = model('Project', projectSchema);

module.exports = Project;