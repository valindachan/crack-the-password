let fs = require("fs")

const words = fs
  .readFileSync("/usr/share/dict/words", "utf-8")
  .toLowerCase()
  .split("\n")

let word = words[Math.floor(Math.random() * words.length)]

console.log(word)
