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

let wordLength = word.length

let gameData = {
  progress: [],
  guess: [],
  numGuesses: 8,
  messageToUser: "Go ahead and guess a letter."
}

let numMatches = 0

// Set progress word
for (var i = 0; i < wordLength; i++) {
  gameData.progress.push(" ")
}

app.get("/", function(req, res) {
  res.render("index", gameData)
})

app.post("/guess", function(req, res) {
  let guess = req.body.guess.toLowerCase()
  let alreadyGuessed = false
  let match = false

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
    gameData.messageToUser = "Guess a new letter you haven't already tried."
  }

  // If the user hasn't already guessed this letter AND guessed incorrectly,
  // count this toward the 8 turns they are allowed
  if (alreadyGuessed === false && match === false) {
    gameData.numGuesses = gameData.numGuesses - 1
  }

  // Game over
  if (gameData.numMatches === wordLength) {
    gameData.messageToUser = "Congrats, you've won! Play again?"
  } else if (gameData.numGuesses === 0) {
    gameData.messageToUser = `Sorry, you lost. The word was "${word}".`
  }

  res.redirect("/")
})

app.post("/guess/:guess", function(req, res) {
  let guess = req.body.guess.toLowerCase()
  let alreadyGuessed = false
  let match = false

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
    gameData.messageToUser = "You've guessed this already. Try a new letter."
  }

  // If the user hasn't already guessed this letter AND guessed incorrectly,
  // count this toward the 8 turns they are allowed
  if (alreadyGuessed === false && match === false) {
    gameData.numGuesses = gameData.numGuesses - 1
  }

  // Game over
  if (gameData.numMatches === wordLength) {
    gameData.messageToUser = "Congrats, you've won! Play again?"
  } else if (gameData.numGuesses === 0) {
    gameData.messageToUser = `Sorry, you lost. The word was "${word}".`
  }

  res.redirect("/")
})

app.listen(3000, function() {
  console.log("Started application")
})
