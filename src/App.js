import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import "./style.css"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollCount, setRollCount] = React.useState(0)
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function recordRollCount() {
        // If localStorage is empty, then save an empty array
        if (localStorage.getItem('recordCount') == null) {
            localStorage.setItem('recordCount', '[]')
        }
        // Get localStorage data array
        let bestRecord = JSON.parse(localStorage.getItem('recordCount'))
        // Push in new roll count value to data array
        bestRecord.push(rollCount)
        // Save the updated data array to local Storage
        localStorage.setItem('recordCount', JSON.stringify(bestRecord))
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRollCount(prevRollCount => prevRollCount + 1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            recordRollCount()
            setRollCount(0)
        }
    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <p >You have rolled {rollCount} time{rollCount > 1 ? "s" : ""}.</p>
            <p>Best roll record: {localStorage.getItem('recordCount') == null ?
                                    0 :
                                    Math.min.apply(Math, JSON.parse(localStorage.getItem('recordCount')))}</p>
        </main>
    )
}