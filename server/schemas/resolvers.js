const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');


module.exports = {
    Query: {
        getSingleUser: async (parent, args) => {
            return await User.findOne({
                $or: [{ _id: args.userId }, { username: args.username }],
            });
        },
    },
    Mutation: {
        createUser: async (parent, args) => {
            const user = await User.create({username: args.username, email: args.email, password: args.password});
            const token = signToken(user);
            return {token, user};
        },
        login: async (parent, args) => {
            const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
            if(!user){
                throw new AuthenticationError('No user with this email found!');
            }
            const correctPw = await user.isCorrectPassword(args.password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }
            const token = signToken(user);
            return {token, user};
        },
        saveBook: async (parent, args) => {
            return await User.findOneAndUpdate(
                { _id: args.userId },
                { $addToSet: { savedBooks: args } },
                { new: true, runValidators: true }
            );
        },
        deleteBook: async (parent, args) => {
            return await User.findOneAndUpdate(
                { _id: args.userId },
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
              );
        }
    }
}
