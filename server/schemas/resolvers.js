const { AuthenticationError } = require('apollo-server-express');
const { User, Issue, Project  } = require('../models');
const { signToken } = require('../utils/auth');
// importing models, authentication error response from apollo server, and token from auth file

const resolvers = {
  Query: {
    // find all users
    users: async () => {
      return User.find();
    },
    // find single user by username and populate project field with relevant projects
    user: async (parent, { username }) => {
      return User.findOne({ username: username }).populate('item');
    },
    // find one project via project's id
    project: async(parent, { projectId }) => {
      return Project.findOne({ _id: projectId })
    },
    // if username provided, search for item by username, else find all items and sort by reverse creation order
    project: async(parent, { username }) => {
      const params = username ? { username } : {};
      return Project.find(params).sort({createdAt: -1})
    },
    // search for item via genre
    genreItems: async(parent, { genre }) => {
      return Item.find({ genre })
    },
    // search for user via the user context (logged in user) - throw error if not logged in
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('project');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutation: {
    // add new user and assign token when user created
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // search user by email and use password check from user model to authenticate, then assign token if correct password
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    // add project and include relevant username from user context (logged in user), then use that same context to update user with new item id
    addProject: async (parent, { name, status, description }, context) => {
      if (context.user) {
        const project = await Project.create({
          name, status, description,
          user: context.user.username
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { project: project._id } }
        );

        return project;
      }
      console.log(context.user.username);
      throw new AuthenticationError('You need to be logged in!');
    },
    // remove project based on project id and according to user context (logged in)
    removeProject: async (parent, { projectId }, context) => {
      if (context.user) {
        const project = await Project.findOneAndDelete({
          _id: projectId,
          user: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { project: project._id } }
        );

        return project;
      }
      throw new AuthenticationError('You need to be logged in!');
    }
  }
};
// export resolvers
module.exports = resolvers;
