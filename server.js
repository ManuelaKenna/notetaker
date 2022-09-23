const express = require ("express");
const path = require ("path");
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require ("fs");
const util = require ("util");
const readFile = util.promisify (fs.readFile)

function getNotes (){
    return readFile ("db/db.json", "utf-8").then (rawNotes => {

        return JSON.parse(rawNotes)
    })
}


app.use (express.json());
app.use (express.urlencoded({extended:false}));
app.use (express.static("public"));

app.get("/",(req, res) => {
    res.sendFile (path.join(__dirname, "./public/index.html"))
})
app.get("/notes",(req, res) => {
    res.sendFile (path.join(__dirname, "./public/notes.html"))
})


app.get("/api/notes", (req, res) => {
    getNotes().then (response => res.json (response))

    app.post("/api/notes", (req,res) => {
    const text = req.body.text 
    const title = req.body.title

    if (req.body) {
        const newNote = {
            title,
            text
        }

    fs.readFile("./db/db.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
          } else {
            const parsedData = JSON.parse(data);
            parsedData.push(newNote);
            fs.writeFile ("./db/db.json", JSON.stringify(parsedData), (err) =>
            err ? console.error(err) : console.info(`\nData written to ${"./db.json"}`)
          );
            console.log(JSON.stringify(parsedData));
          res.sendFile(path.join(__dirname, './public/notes.html'));
}})}})})



app.listen (PORT, () => {
    console.log ("app listening;" + PORT)
})
