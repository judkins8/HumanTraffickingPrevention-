/*
   
    Joshua Judkins

    Project 3 - Human Trafficking in Utah with interactive table and database

*/
let express = require('express'); 

let app = express (); 

let path = require("path");

const port = 3000;

app.set("view engine","ejs")

app.use(express.urlencoded({extended: true}));

app.use("/public", express.static(__dirname + "/public/"));

//app.use(express.static("views"));

const knex = require('knex')(
    {
        client:"pg",
        connection: {
            host: "localhost",
            user: "brookewoodland",
            password:"lms385334",
            database:"project3",
            port: 5432
        }
    });

app.get("/", (req, res) => {
    knex.select().from("trafficking").then(trafficking => {
        res.render("index", {mytrafficking: trafficking});
    });
});

    //add person
    app.get("/addPerson", (req, res) => {
        res.render("addPerson");
    });

    app.post("/addPerson", (req, res) => {
        knex("trafficking").insert({
            Date_Missing: req.body.Date_Missing,
            Last_Name: req.body.Last_Name,
            First_Name: req.body.First_Name,
            Age_Missing: req.body.Age_Missing,
            City: req.body.City,
            State: req.body.State.toUpperCase(),
            Gender: req.body.Gender.toUpperCase(),
            Race: req.body.Race.toUpperCase()
        }).then(mytrafficking =>{
            res.redirect("/");
        });
    });    

    //delete 
    app.post("/deletePerson/:id", (req, res) => {
        knex("trafficking").where("person_id", req.params.id).del().then(trafficking => {
            res.redirect("/");
        }).catch(err => {
            console.log(err);
            res.status(500).json({err});
        })
    });
    
    
    //edit
    
    app.get("/findPerson", (res, req) => {
       res.render("findPerson", {});  
     })

    //edit person
    app.get("/editPerson/:id", (req, res) => {
        knex.select().from("trafficking").where("person_id", req.params.id).then(trafficking => {
            res.render("editPerson", {mytrafficking: trafficking});
        }).catch( err => {
            console.log(err);
            res.status(500).json({err});
        });
    });

    app.post("/editPerson/", (req, res) => {
        knex("trafficking").where("person_id", parseInt(req.body.person_id)).update({
            Date_Missing: req.body.date_missing, 
            Last_Name: req.body.last_name, 
            First_Name: req.body.first_name, 
            Age_Missing: parseInt(req.body.age_missing), 
            City: req.body.city, 
            State: req.body.state, 
            Gender: req.body.gender, 
            Race: req.body.race
        }).then(mytrafficking => {
            res.redirect("/");
        });
    });
    
    //Display
    app.get("/displayPerson", (req, res) => {
        knex.select().from("trafficking").then(trafficking => {
            res.render("displayData", {mytrafficking: trafficking});
        });
    }); 
    
    app.listen(port, ()=> console.log("port 3000 is listening"));
