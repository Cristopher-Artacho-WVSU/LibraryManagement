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

app.get('/books', (req, res) => {
    let books = [ ]

database.collection('books')
    .find() //LIST OUT ALL THE DATA
    .sort({
        name: 1
    }) //SORT OUT ALL DATA DEPENDING ON THE FIELD SET
    .forEach( book => books.push(book)) //STORE TO THE books VARIABLE
    .then(() =>{ //RESPONSES BY BOOK JSON
        res.status(200).json(books)
    })
    .catch(() =>{ //IF IT CATCHES AN ERROR, THE RESPONSE WILL BE "UNALE TO FETCH DOCUMENTS"
        res.status(200).json({
            error: "Unable to fetch Documents"
        })
    })
})

app.get('books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {

        database.collection('books')
        .findOne({ //FINDING A BOOK BY ID
            _id:  ObjectId(req.params.id)
        })

        .then(doc => { //FOLLOWED UP BY THE JSON DATA
            if (doc) {
                res.status(200).json(doc)
            } else { //IF THE ID DOES NOT MATCH, THEN SHOWS THE ERROR 'Book not found'
                res.status(404).json({
                    error: 'Book not found'
                });
            }
            })

        .catch(err =>{
            console.error(err);
            res.status(500).json({
                error: 'Could Not Fetch Document'
            });

        })    
    } else{
        res.status(500).json({
            error: "Invalid Document ID"
        })
    }   
    



    app.get('/', (req, res) => {
        res.render('index')
    })
})

