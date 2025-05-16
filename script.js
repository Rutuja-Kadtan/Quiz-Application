const configContainer = document.querySelector(".config-container");
const QuizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn")
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");

// Quiz state variable
const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "programming";
let numberOfQuestions = 5;
let currentQuestion = null;
const questionIndexHistory = [];
let correctAnswerConunt = 0;

// Display quiz result and hide quiz container
const showQuizResult = () => {
    QuizContainer.style.display = "none";
    resultContainer.style.display = "block";

    const resultText = `You answerd <b>${correctAnswerConunt}</b> out of <b>${numberOfQuestions}</b> questions correctly. Great effort!`;
    document.querySelector(".result-message").innerHTML = resultText;
}

// Clear and reset the timer
const resetTimer = () => {
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timerDisplay.textContent = `${currentTime}s`;
}

// Initialize and start timer for the current question
const startTimer = () => {
    timer = setInterval(() => {
        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;

        if(currentTime <= 0){
            clearInterval(timer);
            highlightCorrectAnswer();
            nextQuestionBtn.style.visibility = "visible";
            QuizContainer.querySelector(".quiz-timer").style.background = "#c31402";

            // Disable all answer options after one option is selected
            answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");

        }
    }, 1000);
}


// Fetch a random question from based on the select category
const getRandomQuestion = () => {
    const categoryQuestions = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];

    // Show the result if all questions have been used
    if(questionIndexHistory.length >= Math.min(categoryQuestions.length, numberOfQuestions)) {
        return showQuizResult();
    }


    // Filter out alrady asked questions and choose a random one
    const availableQuestion = categoryQuestions.filter((_, index) => !questionIndexHistory.includes(index));
    const randomQuestion = availableQuestion[Math.floor(Math.random() * availableQuestion.length)];

    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return randomQuestion;
}

// Highlight the correct answer option
const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");

    const iconHTML = `<span class="material-symbols-outlined">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend", iconHTML);
}

// Handle the user's answer selection
const handleAnswer = (option, answerIndex) => {
    clearInterval(timer);

    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    !isCorrect ? highlightCorrectAnswer() : correctAnswerConunt++;

    // Insert icon based on correctness
    const iconHTML = `<span class="material-symbols-outlined">${isCorrect ? 'check_circle' : 'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend", iconHTML);

    // Disable all answer options after one option is selected
    answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");

    nextQuestionBtn.style.visibility = "visible";
}

// Render the current question and its options in the quiz 
const renderQuestion = () => {
    currentQuestion = getRandomQuestion();
    if(!currentQuestion) return;

    resetTimer();
    startTimer();

    // update UI
    answerOptions.innerHTML = "";
    nextQuestionBtn.style.visibility = "hidden";
    QuizContainer.querySelector(".quiz-timer").style.background = "#32313C";
    document.querySelector(".question-text").textContent = currentQuestion.question;
    questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;

    // create option <li> elements and append them
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);
        li.addEventListener("click", () => handleAnswer(li, index));
    });
}

// Start quiz render random question
const startQuiz = () => {
    configContainer.style.display = "none";
    QuizContainer.style.display = "block";

    // Update the quiz category and number of questions
    quizCategory = configContainer.querySelector(".category-option.active").textContent;
    numberOfQuestions = parseInt(configContainer.querySelector(".question-option.active").textContent);

    renderQuestion();
}

// Highlight the selected option on click - category or no. of question
document.querySelectorAll(".category-option, .question-option").forEach(option => {
    option.addEventListener("click", () => {
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

// Reset quiz and return to the configuration container
const resetQuiz = () => {
    resetTimer();
    correctAnswerConunt = 0;
    questionIndexHistory.length = 0;
    configContainer.style.display = "block";
    resultContainer.style.display = "none";
}


nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);


/*const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");

let quizCategory = "programming";
let currentQuestion = null;

const getRandomQuestion = () => {
    const categoryQuestions = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];
    const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
    return randomQuestion;
}

// Highlight the correct answer option
const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend", iconHTML);  // Add icon for correct answer
}

// Handle the user's answer selection
const handleAnswer = (option, answerIndex) => {
    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    if (!isCorrect) {
        highlightCorrectAnswer();  // Only highlight the correct answer if the selected one is wrong
    }

    // Insert icon based on correctness (one icon per selected answer)
    const iconHTML = `<span class="material-symbols-rounded">${isCorrect ? 'check_circle' : 'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend", iconHTML);

    // Disable all answer options after one option is selected
    answerOptions.querySelectorAll(".answer-option").forEach(opt => opt.style.pointerEvents = "none");
}

// Render the current question and its options in the quiz
const renderQuestion = () => {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion) return;

    // Update UI
    answerOptions.innerHTML = "";
    document.querySelector(".question-text").textContent = currentQuestion.question;

    // Create option <li> elements and append them
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);
        li.addEventListener("click", () => handleAnswer(li, index));
    });
}

renderQuestion();

nextQuestionBtn.addEventListener("click", renderQuestion);*/
