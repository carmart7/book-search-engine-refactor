# Book Search Engine - Refactoring CRUD Routes to GraphQL

## Description

This repository uses code for a book search engine that was already built using RESTful API Routes to access and modify data. Within this readme you will find examples of routes being changed to graphql statements. This refactoring was done with the intention of not modifying the user experience at all. The only user experience change made was alloying the user to refresh on the /saved page without running into GET errors.

## Create Route Refactor

Previusly the create user route would be require an api route to be hit with the the body containing information that would be required in the body. The server side function for this route is shown below.
```js
async createUser({ body }, res) {
    const user = await User.create(body);

    if (!user) {
      return res.status(400).json({ message: 'Something is wrong!' });
    }
    const token = signToken(user);
    res.json({ token, user });
  },
```
The front end code to make use of this route is shown below.
```js
export const createUser = (userData) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};
```
Now, the back end has a function that read much better and allow for quick changes to what is received on the front end when a mutation is executed.

```js
Mutation: {
        createUser: async (parent, args) => {
            const user = await User.create({username: args.username, email: args.email, password: args.password});
            const token = signToken(user);
            return {token, user};
        },
}
```

The front end has been refactored to use graphql statements and are much shorter function calls than the fetch route equivalent. 

```js
    const [login, {error, data}] = useMutation(LOGIN_USER);
    const { data } = await login({
        variables: { ...userFormData }
    });
```

## Delete Route Refactor

Previously the book delete route would require an api route to be hit with the body containing the book and user information. The server side function for this route is shown below.
```js
async deleteBook({ user, params }, res) { //DONE IN GRAPHQL
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedBooks: { bookId: params.bookId } } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Couldn't find user with this id!" });
    }
    return res.json(updatedUser);
}
```
The front end code to make use of this route is shown below.
```js
export const deleteBook = (bookId, token) => {
  return fetch(`/api/users/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

```
Now, the back end has a function that read much better and allow for quick changes to what is received on the front end when a mutation is executed.

```js
Mutation: {
        deleteBook: async (parent, args) => {
            return await User.findOneAndUpdate(
                { _id: args.userId },
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
              );
        }
}
```

The front end has been refactored to use graphql statements and are much shorter function calls than the fetch route equivalent. This looks a bit longer and more complicated than the route but the object being passed in the second parameter for useMutation is simply updating the apollo cache to re rended components that were using the information related to the QUERY_SAVED apollo query.

```js
    const [ deleteBook, {error, data}] = useMutation(DELETE_BOOK, {
        update(cache, {data: {deleteBook}}) {
        try {
            const { getSingleUser } = cache.readQuery({ query: QUERY_SAVED });

            cache.writeQuery({
            query: QUERY_SAVED,
            data: { getSingleUser: {...getSingleUser, savedBooks: getSingleUser.savedBooks.filter((book) => book.bookId != deletedBookId)}}
            })
            
        } catch (error) {
            
        }
        }
     });
```

## Technologies Used

- [Visual Studio Code](https://code.visualstudio.com/)
- [Github](https://github.com/)
- [Node JS](https://nodejs.org/dist/latest-v16.x/docs/api/)
- [express](https://www.npmjs.com/package/express)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [MongoDB](https://www.mongodb.com/)
- [Json Web Token](https://jwt.io/)
- [GraphQL](https://www.npmjs.com/package/graphql)
- [Apollo Server Express](https://www.npmjs.com/package/apollo-server-express)
- [Apollo Client](https://www.npmjs.com/package/@apollo/client)
- [React JS](https://reactjs.org/)
- [Bootstrap](https://www.npmjs.com/package/bootstrap)