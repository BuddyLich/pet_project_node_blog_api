## Pet project - Node blog api

This is small practice project for node.js, express.js and mongoDB/mongoose

It's a blog system api that allows users create/read/update/delete posts

Since it's the first practice project, I plan to keep it simple with only 2 models and very basic features

### Features

Users can register, login, logout, logout all (remove all tokens), update details (email, username, password), and also delete account

In terms of blogs, users can create/read/update/delete the post they created. 
They can also get all posts by other users, get all all posts of their own, get all posts by a specific user by username. 

### Routers:
User router with examples:

#### 1. POST - "/users"
Request body: 


    {
        "email": "useremail@something.com",
        "username": "anyusername",
        "password": "anypswd123"
    }

Note: the password cannot contain the word "password" in lower or upper case. For instance, "testPassWord" would be an invalid one.

#### 2. POST - "/users/login"
Request body:


    {
        "email": "useremail@something.com",
        "password": "anypswd123"
    }

Note: A token will be returned if the login is successful.

#### 3. POST - "/users/logout"
Request header:


    {
        "Authorization": "Bearer tokenThatReturnedInTheLoginRequest"
    }

#### 4. POST - "/users/logoutall"
Request header: 


    {
        "Authorization": "Bearer tokenThatReturnedInTheLoginRequest"
    }

#### 5. GET - "/users/me"
Request header: 


    {
        "Authorization": "Bearer tokenThatReturnedInTheLoginRequest"
    }

#### 6. GET - "/users/<otherUserName>"
Note: This router can be used to read other user's profile without authentication.

Assume that you need to check a user with the username "johnsmith". You only need to send a GET request to "/users/johnsmith"

#### 7. PATCH - "/users/me"
Request header: 


    {
        "Authorization": "Bearer tokenThatReturnedInTheLoginRequest"
    }

Request body: 


    {
        "email": "updatedEmail@something.com",
        "username": "updatedUsername",
        "password": "updatedPSWD123"
    }

#### 8. DELETE - "/users/me"
Request header: 


    {
        "Authorization": "Bearer tokenThatReturnedInTheLoginRequest"
    }


### Models:
Post fields:
* title
* body
* createdAt (created by mongoose)
* lastUpdatedAt (created by mongoose)
* user (objectId)

User fields:
* email
* username
* password
* tokens
* posts (virtual field)
* createdAt (created by mongoose)
* lastUpdatedAt (created by mongoose)

### Other details:
1. Pagination will be included for all "get all posts from xxx" feature
2. User password will be hashed.
3. Bearer token authentication will be used for login feature
4. MongoDB and Mongoose will be used
5. env-cmd will be used for environment variable management

### Test plan:
User part:

* Registration test
* Login test
* Get user information test
* Logout test
* Logout All test
* Account Deletion test

* Test for attempt to login nonexisting user
* Test for login with wrong password
* Test for attempt to register a new account with username/email that already exists


Post part:

* Create post test
* Update post test
* Read post test
* Delete post test

* Get own posts test
* Get all posts test
* Get all posts by a specific users test

* Test for attempt to update other user's post
* Test for attempt to delete other user's post
