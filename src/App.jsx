import React from "react"
import { languages } from "./languages"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"

export default function AssemblyEndgame() {
  //letter states
  let [guessedLetters, setGuessedLetters] = React.useState([])
  let wrongLetters
  let wrongGuessCount
  // console.log(wrongLetters)

  function addGuessedLetter(letter) {
    letter = letter.toUpperCase()
    setGuessedLetters(prevLetters =>
      prevLetters.includes(letter)
        ? prevLetters
        : [...prevLetters, letter]
    )
  }

  //the word to guess
  let [currentWord, setCurrentWord] = React.useState(() =>
    getRandomWord().toUpperCase()
  )

  //guseeing
  wrongLetters = guessedLetters.filter(l => !currentWord.includes(l))
  wrongGuessCount = wrongLetters.length
  console.log(wrongLetters, wrongGuessCount)

  //list of programming languages
  let lostLang = []
  let langs = languages.map((lang, index) => {
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    }
    let className = "language-card "
    if (index < wrongGuessCount) {
      className += " lose "
      lostLang.push(lang.name)
    }
    return (
      <span
        key={lang.name}
        className={className}
        style={styles}
      >
        {lang.name}
      </span>
    )
  })

  // game state
  let isGameLost = wrongGuessCount >= languages.length - 1 ? true : false
  const isGameWon = currentWord
    .split("")
    .every(letter => guessedLetters.includes(letter))
  let isGameOver = isGameLost || isGameWon

  let gameStatusClass = "game-stats "
  if (isGameWon) {
    gameStatusClass += "win"
  } else if (isGameLost) {
    gameStatusClass += "lose"
  } else if (lostLang.length > 0) {
    gameStatusClass += "farwell"
  }

  //the word UI
  let word = currentWord.split("")
  let wordElements = word.map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName =
      isGameLost && !guessedLetters.includes(letter)
        ? "misssed-letter"
        : ""
    return (
      <span key={index} className={`letter-box ${letterClassName}`}>
        {/* {guessedLetters.includes(letter) ? letter : "_"} */}
        {shouldRevealLetter ? letter.toUpperCase() : "_"}
      </span>
    )
  })

  //keyboard
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let keyboard = alphabet.split("").map(letter => {
    let isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)

    let className = "key "
    className += isCorrect ? "correct" : isWrong ? "wrong" : ""

    return (
      <button
        disabled={isGameOver}
        // aria-disabled={guessedLetters.includes(letter)}
        className={className}
        key={letter}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter}
      </button>
    )
  })

  function renderGameStatus() {
    // if (!isGameOver) {
    //     return null
    // }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    } else if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    } else if (lostLang.length > 0) {
      return (
        <>
          {/* <h2>You lose!</h2> */}
          {/* <p>“Farewell {lostLang.join(", ")}” 🫡</p> */}
          <p>{getFarewellText(lostLang)}</p>
        </>
      )
    }
  }

  //new game
  function startNewGame() {
    setCurrentWord(getRandomWord().toUpperCase())
    setGuessedLetters([])
  }

  return (
    <main>
      {isGameWon && !isGameLost && <Confetti />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the 
          programming world safe from Assembly!
        </p>
      </header>
      <section className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className="languages-list">
        {langs}
      </section>
      <section className="word-container">
        {wordElements}
      </section>
      <section 
        className="sr-only" 
        aria-live="polite" 
        role="status"
      >
        <p>
          {/* {currentWord.includes(lastGuessedLetter) ? 
              `Correct! The letter ${lastGuessedLetter} is in the word.` : 
              `Sorry, the letter ${lastGuessedLetter} is not in the word.`
          }
          You have {numGuessesLeft} attempts left. */}
        </p>
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map(letter =>
              guessedLetters.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>
      <section className="keyboard">
        {keyboard}
      </section>
      {(isGameOver || isGameWon) && (
        <button className="new-game" onClick={startNewGame}>
          New Game
        </button>
      )}
    </main>
  )
}


/**
 * Backlog:
 * 
 * ✅ Farewell messages in status section
 * - Disable the keyboard when the game is over
 * - Fix a11y issues
 * - ✅Make the New Game button reset the game
 * - ✅Choose a random word from a list of words
 * - ✅Confetti drop when the user wins
 * -show the correct word after losing
 * Challenge: Disable the keyboard when the game is over
 */
