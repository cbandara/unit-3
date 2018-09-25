'use strict';

function renderPageHTML(htmlString) {
  $(`.content`).html(htmlString);
}

function loadWelcomePage() {
  renderPageHTML(getWelcomeSectionHtmlString());
}

  function getWelcomeSectionHtmlString() {
    return `
        <section class="welcome-section">
          <h2>This quiz is about colors</h2>
          <button class="start-quiz" type="button">Start Quiz</button>
        </section>
        `
  }

function loadNextQuestionPage(event) {
  const questionIndex = getQuestionIndex();
  const {question, choices} = getQuestionObject(questionIndex);
  const numOfQuestions = getNumOfQuestions();
  const currentScore = getCurrentScore();
  const incorrectScore = getIncorrectScore();

  renderPageHTML(getQuestionSectionHtmlString(questionIndex + 1, numOfQuestions, 
    question, choices, currentScore, incorrectScore));
}
  function getQuestionIndex() {
    return STORE.questionIndex;
  }

  function getQuestionObject(questionIndex) {
    return STORE.listOfQuestions[questionIndex];
  }

  function getNumOfQuestions () {
    return STORE.listOfQuestions.length;
  }

  function getCurrentScore() {
    return STORE.numOfCorrect;
  }

  function getIncorrectScore() {
    return STORE.numOfIncorrect
  }

  function getQuestionSectionHtmlString(questionNumber, numOfQuestions,
    question, choices, numOfCorrect, numOfIncorrect) { 
    
    const choicesHTMLStrings = choices.map((choice, index) => {
      return `
        <div class="radio-div">
          <input type="radio" id="a${index}" name="answer" value="${choice}" aria-labelledby="question-title"/>
          <label for="a${index}">${choice}</label>
        </div>`
    })
    return `<section class="question-section">
    <form id="js-quiz-form">
        <h2 class="question-number">
          Question <span class="current-question-num">${questionNumber}</span>
          out of <span class="num-of-questions">${numOfQuestions}</span>
        </h2>
        <fieldset>
          <h3 class="question" id="question-title">${question}</h3>
          ${choicesHTMLStrings.join("")}
        </fieldset>
        <button class="submit-answer" type="submit">Submit</button>
    </form>
    <footer class="current-score">
      <p>Score: <span class="correct-answers">${numOfCorrect}</span> correct 
      <span class="incorrect-answers">${numOfIncorrect}</span> wrong</p>
    </footer>
  </section>`
  }

function loadAnswerPage(event) {
  event.preventDefault()
  const questionIndex = getQuestionIndex();
  const {question, answer} = getQuestionObject(questionIndex);
  const numOfQuestions = getNumOfQuestions();
  const givenAnswer = $('input[name="answer"]:checked').val()

  let isCorrect
  if (!givenAnswer) {
    return
  }

  if (givenAnswer === answer) {
    STORE.numOfCorrect++;
    isCorrect = true;
  }
  else {
    STORE.numOfIncorrect++;
    isCorrect = false;
  }

  STORE.questionIndex++;
  
  const currentScore = getCurrentScore();
  const incorrectScore = getIncorrectScore();

  renderPageHTML(getAnswerSectionHTMLString(questionIndex + 1, answer, numOfQuestions, 
    question, givenAnswer, currentScore, incorrectScore, isCorrect));
  
  
}

  function getAnswerSectionHTMLString(questionNumber, correctAnswer, numOfQuestions, 
    question, givenAnswer, numOfCorrect, numOfIncorrect, isCorrect) {
    let paragraph = isCorrect 
      ? "You Answered Correctly" 
      : `Correct Answer: <span class="correct-answer">${correctAnswer}</span>`
    return `
    <section class="answer-section">
      <div>
        <h2 class="question-number">Question <span class="current-question-num">${questionNumber}</span>
          out of <span class="num-of-questions">${numOfQuestions}</span></h2>
        <p>Question: <span class="question">${question}</span></p>
        <p>You Answered: <span class="given-answer">${givenAnswer}</span></p>
        <p>${paragraph}</p>
        <button class="next" type="button">Next</button>
      </div>
      <footer class="current-score">
        <p>Score: <span class="correct-answers">${numOfCorrect}</span> correct 
        <span class="incorrect-answers">${numOfIncorrect}</span> wrong</p>
      </footer>
    </section>`
  }

function loadResultsPage(event) {
  const currentScore = getCurrentScore();
  const incorrectScore = getIncorrectScore();
  const numOfQuestions = getNumOfQuestions();

  renderPageHTML(getResultsSectionHTMLString(currentScore, incorrectScore, numOfQuestions));
}

function getResultsSectionHTMLString(currentScore, incorrectScore, numOfQuestions) {
  return `
    <section class="results-section">
      <div>
        <h2>You scored <span class="num-correct">${currentScore}</span> correct
          and <span class="num-incorrect">${incorrectScore}</span> incorrect out of <span class="num-questions">${numOfQuestions}</span>
        </h2>
        <button class="retake" type="button">Retake</button>
      </div>
    </section>`
}

function loadNextQuestionOrResultsPage(event) {
  const questionIndex = getQuestionIndex();
  const numOfQuestions = getNumOfQuestions();
  
  // Using the Index because the increment happened inside loadAnewerPage
  if (questionIndex >= numOfQuestions) {
    loadResultsPage()
  }
  else {
    loadNextQuestionPage()
  }
}


$(function onLoad() {

  loadWelcomePage();
  $(`.content`).on('click', '.start-quiz', loadNextQuestionPage)

  $(`.content`).on('submit', '#js-quiz-form', loadAnswerPage)

  $(`.content`).on('click', '.next', loadNextQuestionOrResultsPage)
  
  $(`.content`).on('click', '.retake', () => location.reload())
})

// List of questions with titles and answers
const STORE = {
  questionIndex: 0,
  numOfCorrect: 0,
  numOfIncorrect: 0, 
  listOfQuestions: [
    {question: "What color is the sky?", choices: ["blue", "green", "yellow", "red"], answer: "blue"},
    {question: "What color is a red apple?", choices: ["blue", "green", "yellow", "red"], answer: "red"},
    {question: "What color is grass?", choices: ["blue", "green", "yellow", "red"], answer: "green"},
    {question: "What color is between green and red on a traffic light?", choices: ["blue", "green", "yellow", "red"], answer: "yellow"}
  ]
}



