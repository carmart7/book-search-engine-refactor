const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        password: String
        savedBooks: [Book]
    }
    
    type Auth {
        token: ID!
        user: User
    }

    type Book {
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }

    type Author {
        authors: [String]
    }

    type Query {
        getSingleUser(userId: ID, username: String): User

    }
    type Mutation {
        createUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(userId: ID!, authors: [String], description: String, bookId: String!, image: String, link: String, title: String): User
        deleteBook(userId: ID!, bookId: String!): User
    }
`;

module.exports = typeDefs;