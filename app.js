const fs = require("fs")
const bodyParser = require("body-parser")
const express = require("express")
const mustacheExpress = require("mustache-express")
const expressSession = require("express-session")

const app = express()

app.use(
  expressSession({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
)

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
let wordLength = word.length

let gameData = {
  progress: [],
  guess: [],
  numGuesses: 8,
  messageToUser: "Enter a letter"
}

let numMatches = 0

// Set progress word
for (var i = 0; i < wordLength; i++) {
  gameData.progress.push(" ")
}

app.get("/", function(req, res) {
  res.render("index", gameData)
})

app.get("/play", function(req, res) {
  word = words[Math.floor(Math.random() * words.length)]
  wordLetter = word.split("")
  wordLength = word.length

  let numMatches = 0

  console.log(numMatches)

  gameData = {
    progress: [],
    guess: [],
    numGuesses: 8,
    messageToUser: "Enter a letter"
  }

  // Set progress word
  for (var i = 0; i < wordLength; i++) {
    gameData.progress.push(" ")
  }

  res.redirect("/")
})

app.post("/guess", function(req, res) {
  let guess = req.body.guess.toLowerCase()
  let alreadyGuessed = false
  let match = false

  gameData.messageToUser = "Enter a letter"

  // Go through each guess and see if the user has already guessed this
  for (var i = 0; i < gameData.guess.length; i++) {
    if (guess === gameData.guess[i]) {
      alreadyGuessed = true
    }
  }

  // If the user hasn't already guessed this letter
  if (alreadyGuessed === false) {
    gameData.guess.push(guess)
    // See if there's a match
    for (var i = 0; i < wordLetter.length; i++) {
      if (guess === wordLetter[i]) {
        gameData.progress[i] = guess
        match = true
        numMatches++
      }
    }
  } else {
    gameData.messageToUser = "You've tried that already. Try a new letter."
  }

  // If the user hasn't already guessed this letter AND guessed incorrectly,
  // count this toward the 8 turns they are allowed
  if (alreadyGuessed === false && match === false) {
    gameData.numGuesses = gameData.numGuesses - 1
  }

  // Game over
  if (numMatches === wordLength) {
    gameData.messageToUser = "Congrats, you've won! Play again?"
    gameData.gameOver = true
  } else if (gameData.numGuesses === 0) {
    gameData.messageToUser = `Sorry, you lost. The word was "${word}".`
    gameData.gameOver = true
  }

  req.session.gameData = gameData

  res.redirect("/")
})

app.post("/guess/:guess", function(req, res) {
  let guess = req.body.guess.toLowerCase()
  let alreadyGuessed = false
  let match = false

  gameData.messageToUser = "Enter a letter."

  // Go through each guess and see if the user has already guessed this
  for (var i = 0; i < gameData.guess.length; i++) {
    if (guess === gameData.guess[i]) {
      alreadyGuessed = true
    }
  }

  // If the user hasn't already guessed this letter
  if (alreadyGuessed === false) {
    gameData.guess.push(guess)
    // See if there's a match
    for (var i = 0; i < wordLetter.length; i++) {
      if (guess === wordLetter[i]) {
        gameData.progress[i] = guess
        match = true
        numMatches++
      }
    }
  } else {
    gameData.messageToUser = "You've tried that already. Try a new letter."
  }

  // If the user hasn't already guessed this letter AND guessed incorrectly,
  // count this toward the 8 turns they are allowed
  if (alreadyGuessed === false && match === false) {
    gameData.numGuesses = gameData.numGuesses - 1
  }

  // Game over
  if (numMatches === wordLength) {
    gameData.messageToUser = "Congrats, you've won! Play again?"
    gameData.gameOver = true
  } else if (gameData.numGuesses === 0) {
    gameData.messageToUser = `Sorry, you lost. The password was "${word}".`
    gameData.gameOver = true
  }

  req.session.gameData = gameData

  res.redirect("/")
})

app.listen(3000, function() {
  console.log("Started application")
})
