const express = require('express') //USING THE EXPRESS FILE
const {connectToDb, getDB} = require('./db') //USING THE .db FILE
const { ObjectId } = require('mongodb') //USING THE MONGODB FILE

//express FUNCTION RENAMED AS app IN ORDER TO BE USED FOR POST AND GET METHODS.
//SENDS THE DATA FROM THESE TO BROWSER IN JSON FORMAT
const app = express() 
app.use(express.json())

//SERVE THE STATIC FILES FROM THE 'public' DIRECTORY
app.use(express.static('public')) 

//SETTING THE VIEW ENGINE TO EJS ONLY FROM client FOLDER
app.set ('view engine', 'ejs');
app.set('views', './client')
app.set(express.static('client'));

//ESTABLISHING THE CONNECTION TO THE DATABASE
let database 

connectToDb((err) =>{
    if(!err){
        //ESTABLISHING THE LOCAL HOST CONNECTION WITH TIMESTAMP
        app.listen(3000, () =>{
            console.log('App listening on port 3000')
            const currentTimestamp = new Date();
            currentTimestamp.setHours(currentTimestamp.getHours() + 8)
            console.log('Local Hosted at Timestamp:',currentTimestamp);
        })
        database = getDB()
    }
    //IF THE CONNECTION TO THE SERVER FAILS
    else{
        console.log(err)
    }
})

//localhost:3000/books
//READS THE 'books' COLLECTION AND SENDS IT TO THE BROWSER. SORTED ALPHABETICALLY BY NAME
app.get('/books', (req, res) => {
    let books = [ ]

    database.collection('books')
        .find()
        .sort({
            name: 1
        })
        .forEach(book => books.push(book))
        .then(() =>{
            res.status(200).json(books)
        })
        .catch(() =>{
            res.status(200).json({
                error: 'Could Not Fetch Documents'
            })
        })
})


// app.get('/books/:id', (req, res) => {
    
//     if (ObjectId.isValid(req.params.id)) {
//         const objectId = new ObjectId(req.params.id); // Construct ObjectId instance with new keyword
    
//         database.collection('books')
//             .findOne({ _id: objectId })
//             .then(doc => {
//                 if (doc) {
//                     res.status(200).json(doc);
//                 } else {
//                     res.status(404).json({ error: 'Book not found' });
//                 }
//             })
//             .catch(err => {
//                 console.error(err);
//                 res.status(500).json({ error: 'Could not fetch document' });
//             });
//     } else {
//         res.status(500).json({ error: 'Invalid Document ID' });
//     }})                                                                                                                                                 

//SEND OR STORE BOOKS TO THE DATABASE IN JSON FORMAT
app.post('/books', (req, res) =>{
    const book = req.body
    console.log(book)

    database.collection('books')
    .insertOne(book)
    .then(result => {
        res.status(201).json(result)(result.ops[0])
    })
    .catch(err => {
        res.status(500).json({
            err: 'Could not create a new document'
        })
    })
})    

//DELETING DOCUMENTS
// app.delete('/books/:id', (req, res) =>{
//     if (ObjectId.isValid(req.params.id)) {
//         database.collection('books')
//             .deleteOne({ _id: new ObjectId(req.params.id)})
//             .then(result => {
//                 if (result) {
//                     res.status(200).json(result);
//                 } else {
//                     res.status(404).json({ error: 'Document Cannot be Deleted' });
//                 }
//             })
//             .catch(err => {
//                 console.error(err);
//                 res.status(500).json({ error: 'Could not fetch document' });
//             });
//     } else {
//         res.status(500).json({ error: 'Invalid Document ID' });
// }})

// app.patch('/books/:id', (req, res) =>{
//     const updates = req.body

//     if (ObjectId.isValid(req.params.id)) {
//         database.collection('books')
//             .updateOne({ _id: new ObjectId(req.params.id)}, {$set: updates})
//             .then(result => {
//                 if (result) {
//                     res.status(200).json(result);
//                 } else {
//                     res.status(404).json({ error: 'Document Cannot be Deleted' });
//                 }
//             })
//             .catch(err => {
//                 console.error(err);
//                 res.status(500).json({ error: 'Could not update document' });
//             });
//     } else {
//         res.status(500).json({ error: 'Invalid Document ID' });
// }})

// app.get('/search', (req, res) => {
//     const searchQuery = req.query.query;

//     // Use a regular expression to perform a case-insensitive search
//     const regex = new RegExp(searchQuery, 'i');

//     database.collection('books')
//         .find({ $or: [{_id: regex}, {name: regex}, { date: regex }, { author: regex }, {genre: regex}] })
//         .toArray()
//         .then(results => {
//             res.json(results);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             res.status(500).json({ error: 'Internal server error' });
//         });
// });



//localhost:3000/users
//GETS THE 'users' COLLECTION AND SENDS THEM TO THE BROWSER IN JSON FORMAT. SORTED BY 'name' ALPHABETICALLY
app.get('/users', (req, res) => {
    let users = [ ]

    database.collection('users')
        .find()
        .sort({
            name: 1
        })
        .forEach(user => users.push(user))
        .then(() =>{
            res.status(200).json(users)
        })
        .catch(() =>{
            res.status(200).json({
                error: 'Could Not Fetch Documents'
            })
        })
})

//ALLOWS ADDING TO THE DATABASE BY USING FETCH IN THIS LINK
app.post('/users', (req, res) =>{
    const user = req.body
    console.log(user)

    database.collection('users')
    .insertOne(user)
    .then(result => {
        res.status(201).json(result)(result.ops[0])
    })
    .catch(err => {
        res.status(500).json({
            err: 'Could not create a new user'
        })
    })
})   


//localhost:3000/librarians
//RADS AND SENDS THE 'librarians' COLLECTION 
app.get('/librarians', (req, res) => {
    let librarians = [ ]

    database.collection('librarians')
        .find()
        .sort({
            name: 1
        })
        // .skip(page * carsPerPage) //SKIP THE AMOUNT OF CARS TIMES THE PAGE
        // .limit(carsPerPage) //LIMIT THE AMOUNT OF CARS DISPLAYED IN ONE PAGE EQUAL TO THE VALUE
        .forEach(librarian => librarians.push(librarian))
        // .toArray()
        .then(() =>{
            res.status(200).json(librarians)
        })
        .catch(() =>{
            res.status(200).json({
                error: 'Could Not Fetch Documents'
            })
        })
})

app.post('/librarians', (req, res) =>{
    const librarian = req.body
    console.log(librarian)

    database.collection('librarians')
    .insertOne(librarian)
    .then(result => {
        res.status(201).json(result)(result.ops[0])
    })
    .catch(err => {
        res.status(500).json({
            err: 'Could not create a new librarian'
        })
    })
})   

app.post('/librarians', (req, res) =>{
    const librarian = req.body
    console.log(librarian)

    database.collection('librarians')
    .insertOne(librarian)
    .then(result => {
        res.status(201).json(result)(result.ops[0])
    })
    .catch(err => {
        res.status(500).json({
            err: 'Could not create a new librarian'
        })
    })
})   




app.get('/borrowed', (req, res) => {
    let borrowed_books = [ ]

    database.collection('borrowHistory')
        .find()
        .sort({
            date_borrowed: 1
        })
        // .skip(page * carsPerPage) //SKIP THE AMOUNT OF CARS TIMES THE PAGE
        // .limit(carsPerPage) //LIMIT THE AMOUNT OF CARS DISPLAYED IN ONE PAGE EQUAL TO THE VALUE
        .forEach(borrowed_book => borrowed_books.push(borrowed_book))
        // .toArray()
        .then(() =>{
            res.status(200).json(borrowed_books)
        })
        .catch(() =>{
            res.status(200).json({
                error: 'Could Not Fetch Documents'
            })
        })
})

app.post('/borrowed', (req, res) =>{
    const borrowed_book = req.body
    console.log(borrowed_book)

    database.collection('borrowHistory')
    .insertOne(borrowed_book)
    .then(result => {
        res.status(201).json(result)(result.ops[0])
    })
    .catch(err => {
        res.status(500).json({
            err: 'Could not add borrow credentials'
        })
    })
})   




app.get('/notifications', (req, res) => {
    let notifications = [ ]

    database.collection('notifications')
        .find()
        // .sort({
        //     : 1
        // })
        // .skip(page * carsPerPage) //SKIP THE AMOUNT OF CARS TIMES THE PAGE
        // .limit(carsPerPage) //LIMIT THE AMOUNT OF CARS DISPLAYED IN ONE PAGE EQUAL TO THE VALUE
        .forEach(messages => notifications.push(messages))
        .then(() =>{
            res.status(200).json(notifications)
        })
        .catch(() =>{
            res.status(404).json({
                error: 'Could Not Fetch Documents'
            })
        })
}) 

app.post('/notifications', (req, res) =>{
    const notification = req.body
    console.log(notification)

    database.collection('notifications')
    .insertOne(notification)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({
            err: 'Could not add borrow credentials'
        })
    })
})   









app.get('/library-management-system', (req, res) => {
    res.render('index.ejs')
})




app.get('/library-management-system/signup-user', (req, res) => {
    res.render('signupuser')
})

app.get('/library-management-system/login-user', (req, res) => {
    res.render('loginuser')
})
app.get('/library-management-system/users/dashboard',(req, res) => {
    res.render('userhomepage')
})

app.get('/library-management-system/users/dashboard/book-catalogue',(req, res) => {
    res.render('book_catalogue')
})
app.get('/library-management-system/users/dashboard/book-catalogue/book-details',(req, res) => {
    res.render('bookinfo')
})

app.get('/library-management-system/user/borrow-book', (req, res) =>{
    res.render('borrowbook')
})
app.get('/library-management-system/user/reserve-book', (req, res) =>{
    res.render('reservebook')
})
app.get('/library-management-system/user/notification', (req, res) => {
    res.render('notification')
})




app.get('/library-management-system/signup-librarian', (req, res) => {
    res.render('signuplibrarian')
})
app.get('/library-management-system/login/librarian/dashboard', (req, res) => {
    res.render('librarianhomepage')
})

app.get('/library-management-system/login/librarian/dashboard/add_book', (req, res) => {
    res.render('add_book')
})

app.get('/library-management-system/loginlibrarian', (req, res) => {
    res.render('loginlibrarian')
})

