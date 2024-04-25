const express = require('express') //USING THE EXPRESS FILE
const {connectToDb, getDB} = require('./db') //USING THE .db FILE
const { ObjectId } = require('mongodb') //USING THE MONGODB FILE

const app = express() //USED FOR THE CRUD AND OTHER USES
app.use(express.json())
app.use(express.static('public')) //SERVE THE STATIC FILES FROM THE 'public' DIRECTORY



let database //ESTABLISHING THE CONNECTION TO THE DATABASE

connectToDb((err) =>{
    if(!err){
        //ESTABLISHING THE LOCAL HOST CONNECTION
        app.listen(3000, () =>{
            console.log('App listening on port 3000')
        })
        database = getDB()
    }
    else{
        console.log(err)
    }
})

app.set ('view engine', 'ejs');
app.set('views', './client')
app.set(express.static('client'));

//localhost:3000/books
app.get('/books', (req, res) => {
    let books = [ ]

    database.collection('books')
        .find()
        .sort({
            name: 1
        })
        // .skip(page * carsPerPage) //SKIP THE AMOUNT OF CARS TIMES THE PAGE
        // .limit(carsPerPage) //LIMIT THE AMOUNT OF CARS DISPLAYED IN ONE PAGE EQUAL TO THE VALUE
        .forEach(book => books.push(book))
        // .toArray()
        .then(() =>{
            res.status(200).json(books)
        })
        .catch(() =>{
            res.status(200).json({
                error: 'Could Not Fetch Documents'
            })
        })
})

//FETCHING SINGLE BOOK USING ID ADDED TO URL
app.get('/books/:id', (req, res) => {
    
    if (ObjectId.isValid(req.params.id)) {
        const objectId = new ObjectId(req.params.id); // Construct ObjectId instance with new keyword
    
        database.collection('books')
            .findOne({ _id: objectId })
            .then(doc => {
                if (doc) {
                    res.status(200).json(doc);
                } else {
                    res.status(404).json({ error: 'Book not found' });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Could not fetch document' });
            });
    } else {
        res.status(500).json({ error: 'Invalid Document ID' });
    }}) 


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
app.delete('/books/:id', (req, res) =>{
    if (ObjectId.isValid(req.params.id)) {
        database.collection('books')
            .deleteOne({ _id: new ObjectId(req.params.id)})
            .then(result => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ error: 'Document Cannot be Deleted' });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Could not fetch document' });
            });
    } else {
        res.status(500).json({ error: 'Invalid Document ID' });
}})

app.patch('/books/:id', (req, res) =>{
    const updates = req.body

    if (ObjectId.isValid(req.params.id)) {
        database.collection('books')
            .updateOne({ _id: new ObjectId(req.params.id)}, {$set: updates})
            .then(result => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ error: 'Document Cannot be Deleted' });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Could not update document' });
            });
    } else {
        res.status(500).json({ error: 'Invalid Document ID' });
}})

app.get('/search', (req, res) => {
    const searchQuery = req.query.query;

    // Use a regular expression to perform a case-insensitive search
    const regex = new RegExp(searchQuery, 'i');

    database.collection('books')
        .find({ $or: [{_id: regex}, {name: regex}, { date: regex }, { author: regex }, {genre: regex}] })
        .toArray()
        .then(results => {
            res.json(results);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});



//localhost:3000/users
app.get('/users', (req, res) => {
    let users = [ ]

    database.collection('users')
        .find()
        .sort({
            name: 1
        })
        // .skip(page * carsPerPage) //SKIP THE AMOUNT OF CARS TIMES THE PAGE
        // .limit(carsPerPage) //LIMIT THE AMOUNT OF CARS DISPLAYED IN ONE PAGE EQUAL TO THE VALUE
        .forEach(user => users.push(user))
        // .toArray()
        .then(() =>{
            res.status(200).json(users)
        })
        .catch(() =>{
            res.status(200).json({
                error: 'Could Not Fetch Documents'
            })
        })
})

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
    const librarians = req.body
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










app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/signup', (req, res) => {
    res.render('signup')
})





app.get('/login/librarian/index', (req, res) => {
    res.render('index')
})

app.get('/login/librarian/index/add_book', (req, res) => {
    res.render('add_book')
})
