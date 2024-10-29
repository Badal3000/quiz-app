import { quizQuestions } from "./questions.js";

const startContainer = document.querySelector(".start-window");
const endContainer = document.querySelector(".end-window");
const startButton = document.getElementById("start");

const gameContainer = document.querySelector(".quiz-app");
const timeLeftDisplay = document.querySelector(".time-left-value");
const progressBar = document.querySelector(".quiz-progress");
const questionDisplay = document.querySelector(".quiz-question");
const optionsContainer = document.querySelector(".quiz-options");

const currentQuestionDisplay = document.querySelector(".quiz-questions-current");
const totalQuestionDisplay = document.querySelector(".quiz-questions-total");
const difficultySelect = document.getElementById("difficulty");

const numberOfQuestionsSelect = document.getElementById("number");

let timer = difficultySelect.value; 
let currentTimer = 0; 
let currentQuestionIndex = -1; 
let totalQuestionsCount = 0; 
let questions = randomQuestions(numberOfQuestionsSelect.value); 
let correctAnswerCount = 0; 

let interval = 0;

function timingChange() {
    currentTimer++;
    timeLeftDisplay.innerText = timer - currentTimer; 
    progressBar.style.width = `${(currentTimer / timer) * 100}%`; 
    if (currentTimer >= timer) {
        updateQuestion();
        currentTimer = 0; 
    }
}

function randomQuestions(numberOfQuestions) {
    let newQuestions = [];
    for (let i = 0; i < numberOfQuestions; i++) {
        const randomIndex = Math.floor(Math.random() * quizQuestions.length);
        newQuestions.push(quizQuestions[randomIndex]);
    }
    return newQuestions;
}

totalQuestionsCount = questions.length;

function checkOption(e, selectedAnswer) {
    const allOptions = document.querySelectorAll(".quiz-option");
    
    if (questions[currentQuestionIndex].answer === selectedAnswer) {
        e.currentTarget.classList.add("correct");
        correctAnswerCount++;
    } else {
        e.currentTarget.classList.add("incorrect");
    }

    allOptions.forEach((option) => {
        option.disabled = true; 
    });

    setTimeout(updateQuestion, 1000); 
}

function updateOptions() {
    optionsContainer.innerHTML = "";
    questions[currentQuestionIndex].options.forEach((option) => {
        const optionButton = document.createElement("button");
        optionButton.classList.add("quiz-option");
        const optionText = document.createElement("div");
        optionText.classList.add("quiz-option-text");
        optionText.innerText = option;
        optionButton.appendChild(optionText);
        optionsContainer.appendChild(optionButton);

        optionButton.addEventListener("click", (event) => checkOption(event, option));
    });
}

function updateQuestion() {
    currentQuestionIndex++;
    currentTimer = 0; 
    if (currentQuestionIndex >= totalQuestionsCount) {
        clearInterval(interval); 
        endTest(); 
    } else {
        questionDisplay.innerText = `${currentQuestionIndex + 1}. ${questions[currentQuestionIndex].question}`;
        currentQuestionDisplay.innerText = currentQuestionIndex + 1;
        totalQuestionDisplay.innerText = totalQuestionsCount;
        updateOptions();
    }
}

startButton.addEventListener("click", startApp);
function startApp() {
    startContainer.style.display = "none";
    gameContainer.style.display = "flex";
    timer = parseInt(difficultySelect.value); 
    questions = randomQuestions(parseInt(numberOfQuestionsSelect.value)); 
    totalQuestionsCount = questions.length; 
    interval = setInterval(timingChange, 1000); 
    updateQuestion(); 
}

function endTest() {
    gameContainer.style.display = "none";
    endContainer.style.display = "flex";

    const analysis = document.createElement("div");
    const correctStatement = document.createElement("p");
    correctStatement.innerText = `Correct Answers: ${correctAnswerCount}`;
    const incorrectStatement = document.createElement("p");
    incorrectStatement.innerText = `Incorrect Answers: ${totalQuestionsCount - correctAnswerCount}`;
    analysis.append(correctStatement, incorrectStatement);
    endContainer.append(analysis);

    questions.forEach((question) => {
        const ques = document.createElement("div");
        ques.classList.add("ques");
        ques.innerText = question.question;
        const ans = document.createElement("div");
        ans.classList.add("ans");
        ans.innerText = question.answer;

        const ansDiv = document.createElement("div");
        ansDiv.classList.add("ansDiv");
        ansDiv.append(ques, ans);

        analysis.appendChild(ansDiv);
    });
}
