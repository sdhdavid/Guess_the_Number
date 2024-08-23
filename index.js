
let button = document.getElementById("btn")
let msg = document.getElementById("msg")
let randomNumber = (Math.floor(Math.random()*100) + 1)
let input = document.getElementById("input")
let hint

button.addEventListener("click", function(){
    let userGuess = parseInt(input.value)
    if (userGuess < 1 || userGuess > 100) {
        msg.textContent = `You chose an ivalid number!`
    } else if (userGuess === randomNumber) {
        msg.textContent = "Wow! That's exactly the number I had in mind!"
    } else if (userGuess < randomNumber) {
        hint = "low"
        msg.textContent = `You chose the number ${userGuess}, but its too ${hint}!`
    } else if (userGuess > randomNumber) {
        hint = "high"
        msg.textContent = `You chose the number ${userGuess}, but its too ${hint}!`
    }
})