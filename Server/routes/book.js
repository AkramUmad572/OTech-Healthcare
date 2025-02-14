var express = require('express');
var router = express.Router();
let mongoose=require('mongoose');
//Telling my router that i have this model
let Book = require("../model/book")
const book=require("../model/book")
let bookController = require('../Controllers/book.js')
function requireAuth(req,res,next)
{
    if (!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}
 

router.get('/',async(req,res,next)=>{
try{
    const BookList= await Book.find();
    res.render('Book/list', {
        title:'Appointment',
        displayName: req.user?req.user.displayName:'',
        BookList:BookList
    })}
    catch(err){
        console.error(err);
        res.render('Book/list',{
            error:'Error on the server'
        })
    }
    });

router.get('/add',async(req,res,next)=>{
    try{
        res.render('Book/add',{
            title: 'Book Appointments',
            displayName: req.user?req.user.displayName:'' 
        })

    }
    catch(err)
    {
        console.error(err);
        res.render('Book/list',{
            error:'Error on the server'
        })
    }
});



router.post('/add',async(req,res,next)=>{
    try{
        let newBook= Book ({
            "Name":req.body.Name,
            "Author":req.body.Author,
            "Published":req.body.Published,
            "Description":req.body.Description,
            "Price":req.body.Price
        });
        Book.create(newBook).then(()=>{
            res.redirect('/bookslist');
        })
    }
    catch(err)
        {
            console.error(err);
            res.render('/bookslist',{
                error:'Error on the server'
            })

        }
    })

router.get('/edit/:id',async(req,res,next)=>{
    try{
        const id=req.params.id;
        const bookToEdit=await Book.findById(id);
        res.render('Book/edit',
            {
                title:'Edit Appointmnets',
                displayName: req.user?req.user.displayName:'',
                Book:bookToEdit
            }
        )
    }
    catch(err)
    {
        console.error(err);
        next(err); //passing the error
    }
});
router.post('/edit/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        let updatedBook = Book({
            "_id":id,
            "Name":req.body.Name,
            "Author":req.body.Author,
            "Published":req.body.Published,
            "Description":req.body.Description,
            "Price":req.body.Price
        })
        Book.findByIdAndUpdate (id,updatedBook).then(()=>{
            res.redirect('/bookslist')
        })
    }
    catch(err){
        console.error(err);
        res.render('/bookslist',{
            error:'Error on the server'
        })
    }
});
router.get('/delete/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        Book.deleteOne({_id:id}).then(()=>{
            res.redirect('/bookslist')
        })
    }
    catch(error){
        console.error(err);
        res.render('/bookslist',{
            error:'Error on the server'
        })
    }
});
module.exports=router;