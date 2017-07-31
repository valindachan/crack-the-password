const fs = require("fs")
const bodyParser = require("body-parser")
const express = require("express")
const mustacheExpress = require("mustache-express")

const app = express()

app.use(express.static("public"))

app.engine("mustache", mustacheExpress())
app.set("views", "./views")
app.set("view engine", "mustache")

// Set app to use bodyParser()` middleware.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const words = fs
  .readFileSync("/usr/share/dict/words", "utf-8")
  .toLowerCase()
  .split("\n")

let word = words[Math.floor(Math.random() * words.length)]
let wordLetter = word.split("")

console.log(word)
console.log(wordLetter)

console.log(word.length)

let wordLength = word.length

let gameData = {
  progress: [],
  guess: []
}

let numGuesses = 8
let numMatches = 0

// Set progress word
for (var i = 0; i < wordLength; i++) {
  gameData.progress.push(" ")
}

app.get("/", function(req, res) {
  res.render("index", gameData)
})

app.post("/guess", function(req, res) {
  let guess = req.body.guess
  gameData.guess.push(guess)
  for (var i = 0; i < wordLetter.length; i++) {
    if (guess === wordLetter[i]) {
      gameData.progress[i] = guess
    }
  }
  res.redirect("/")
})

app.post("/guess/:guess", function(req, res) {
  let guess = req.body.guess.toLowerCase()
  gameData.guess.push(guess)
  for (var i = 0; i < wordLetter.length; i++) {
    if (guess === wordLetter[i]) {
      gameData.progress[i] = guess
    }
  }
  res.redirect("/")
})

app.listen(3000, function() {
  console.log("Started application")
})
