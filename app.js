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
        res.status(201).json(result.ops[0]); // Send the inserted document in the response
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
        res.status(201).json(result.ops[0]); // Send the inserted document in the response
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
        res.status(201).json(result.ops[0]); // Send the inserted document in the response
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
        res.status(201).json(result.ops[0]); // Send the inserted document in the response
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

app.post('/borrowed', (req, res) => {
    const borrowed_book = req.body;
    console.log(borrowed_book);

    database.collection('borrowHistory')
        .insertOne(borrowed_book)
        .then(result => {
            res.status(201).json(result.ops[0]); // Send the inserted document in the response
        })
        .catch(err => {
            res.status(500).json({ error: 'Could not add borrow credentials' });
        });
}); 




app.get('/borrowhistory', (req, res) => {
    let history = [ ]

    database.collection('borrowHistory')
        .find()
        // .sort({
        //     : 1
        // })
        // .skip(page * carsPerPage) //SKIP THE AMOUNT OF CARS TIMES THE PAGE
        // .limit(carsPerPage) //LIMIT THE AMOUNT OF CARS DISPLAYED IN ONE PAGE EQUAL TO THE VALUE
        .forEach(messages => history.push(messages))
        .then(() =>{
            res.status(200).json(history)
        })
        .catch(() =>{
            res.status(404).json({
                error: 'Could Not Fetch Documents'
            })
        })
}) 

app.post('/notifications', (req, res) =>{
    const history = req.body
    console.log(history)

    database.collection('notifications')
    .insertOne(history)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({
            err: 'Could not add borrow credentials'
        })
    })
})   

app.get('/sentrequests', (req, res) => {
    let sentrequests = [ ]

    database.collection('sentRequests')
        .find()
        .forEach(requests => sentrequests.push(requests))
        .then(() =>{
            res.status(200).json(sentrequests)
        })
        .catch(() =>{
            res.status(404).json({
                error: 'Could Not Fetch Documents'
            })
        })
}) 

app.post('/sentrequests', (req, res) =>{
    const requests = req.body
    console.log(requests)

    database.collection('sentRequests')
    .insertOne(requests)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({
            err: 'Could not add borrow credentials'
        })
    })
})   

app.get('/sentrequests/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)){
        const objectID = new ObjectId(req.params.id)

        database.collection('sentRequests')
        .findOne({_id: objectID})
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            }
            else {
                res.status(404).json({error: 'Request not found'});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'No collection found' });
        });
    } else {
        res.status(500).json({error: "Invalid ID"})
    }})

app.delete('/sentrequests/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        database.collection('sentRequests')
        .deleteOne({ _id: new ObjectId(req.params.id)})
        .then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'Request cannot be delete' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Collection not found' });
        });
} else {
    res.status(500).json({ error: 'Invalid ID' });
}})



app.get('/rejectedrequests', (req, res) => {
    let rejectedrequests = [ ]

    database.collection('rejectedRequests')
        .find()
        .forEach(requests => rejectedrequests.push(requests))
        .then(() =>{
            res.status(200).json(rejectedrequests)
        })
        .catch(() =>{
            res.status(404).json({
                error: 'Could Not Fetch Documents'
            })
        })
}) 

app.post('/rejectedrequests', (req, res) =>{
    const requests = req.body
    console.log(requests)

    database.collection('rejectedRequests')
    .insertOne(requests)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({
            err: 'Could not add borrow credentials'
        })
    })
})   


app.get('/acceptedrequests', (req, res) => {
    let acceptedrequests = [ ]

    database.collection('acceptedRequests')
        .find()
        .forEach(requests => acceptedrequests.push(requests))
        .then(() =>{
            res.status(200).json(acceptedrequests)
        })
        .catch(() =>{
            res.status(404).json({
                error: 'Could Not Fetch Documents'
            })
        })
}) 

app.post('/acceptedRequests', (req, res) =>{
    const requests = req.body
    console.log(requests)

    database.collection('acceptedRequests')
    .insertOne(requests)
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
app.get('/library-management-system/user/notifications', (req, res) => {
    res.render('notifications')
})
app.get('/library-management-system/user/sent-requests', (req, res) => {
    res.render('sentrequests')
})
app.get('/library-management-system/user/accepted-requests', (req, res) => {
    res.render('acceptedrequests')
})
app.get('/library-management-system/user/rejected-requests', (req, res) => {
    res.render('rejectedrequests')
})
app.get('/library-management-system/user/borrow-history', (req, res) => {
    res.render('borrowhistory')
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
app.get('/library-management-system/librarian/notifications', (req, res) => {
    res.render('notifications')
})
