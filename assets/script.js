// getting elements by id using querySelector (alpha order)
let answerBtn = document.getElementsByClassName("answer-btn");
let answerIndex = document.getElementById("answer-index");
let answerMsg = document.getElementById("answer-msg");
let container = document.getElementById("container");
let inputField = document.getElementById("input-field");
let intro = document.getElementById("intro");
let startBtn = document.getElementById("start-btn");
let submitBtn = document.getElementById("submit-btn");
let timer = document.getElementById("timer");
let title = document.getElementById("title");
let yourName = document.getElementById("initials");

let navBar = document.querySelector("nav");

// array of game questions
let questions = [
  {
    title: "People from what city do not speak German as a native language?",
    answers: ["Vienna", "Budapest", "Graz", "Bochum"],
    correct: "Budapest",
  },
  {
    title: "Which country has 14 neighbors?",
    answers: ["South Africa", "France", "Brazil", "China"],
    correct: "China",
  },
  {
    title: "Population of what country is the smallest?",
    answers: ["San Marino", "Vatican", "Lichtenstein", "Monaco"],
    correct: "Vatican",
  },
  {
    title: "What country declared its independence last?",
    answers: ["South Sudan", "Palau", "Kosovo", "North Macedonia"],
    correct: "South Sudan",
  },
  {
    title: "If you want to visit the only royal palace in the USA, you would go to:",
    answers: ["Baltimore, MD", "St Augustine, FL", "Honolulu, HI", "Boston, MA"],
    correct: "Honolulu, HI",
  },
  {
    title: "Which sea has no coasts?",
    answers: ["Sargasso Sea", "Marmara Sea", "Yellow Sea", "Sea of Cortez"],
    correct: "Sargasso Sea",
  },
  {
    title: "What city is known as the oldest continuously inhabited city in the World?",
    answers: ["Rome", "Erevan", "Jerusalem", "Damascus"],
    correct: "Damascus",
  },
];
// setting variables
let timerCount = 0;
let currentQuest = 0;
let score = 0;
let scoreArray = [];
let timerInterval = false;
// function to start the game
function startGame() {
  // sets timer start at 60 seconds
  timerCount = 60;
  timer.textContent = timerCount;
  // calling the function to start timer
  startTimer();
  // calling the function to move to the next question
  nextQuest();
  // when th game is started, the start button is disappeared
  startBtn.style.display = "none";
}
// function to display the next question
function nextQuest() {
  // resetting what the page is look like when moving to next question
  container.className = "display-results mt-5";
  title.textContent = "Question " + (currentQuest + 1);
  title.setAttribute("class", "h2");
  intro.textContent = questions[currentQuest].title;
  intro.className = "h4";
  intro.setAttribute("style", "border-top: 1px double #ba251a; padding-top: 20px;");
  // display answers
  answerIndex.style.display = "block";
  answerBtn[0].textContent = questions[currentQuest].answers[0];
  answerBtn[1].textContent = questions[currentQuest].answers[1];
  answerBtn[2].textContent = questions[currentQuest].answers[2];
  answerBtn[3].textContent = questions[currentQuest].answers[3];
  // when user clicks one of an answer buttons, checkAnswer function is called
  for (i = 0; i < answerBtn.length; i++) {
    answerBtn[i].addEventListener("click", checkAnswer);
  }
}
// function to check if answer is correct
function checkAnswer(event) {
  // if correct, user gets a score point and the game continues
  if (event.target.textContent === questions[currentQuest].correct) {
    answerMsg.style.display = "block";
    answerMsg.textContent = "You are right!";
    answerMsg.className = "answer-msg";
    currentQuest++;
    score++;
    // let user know if the answer if correct. Message will dissapear in 600 ms
    setTimeout(function () {
      answerMsg.style.display = "none";
    }, 600);
    // the game is done when user answered all questions
    if (currentQuest === questions.length) {
      endGame();
      // if not all questions was asked, move to next question
    } else {
      nextQuest();
    }
    // if user is wrong with an answer, display "You are wrong!" and
    // the game shows a next question.
  } else {
    currentQuest++;
    answerMsg.style.display = "block";
    answerMsg.textContent = "You are wrong!";
    answerMsg.className = "answer-msg";
    // let user know if the answer if correct. Message will dissapear in 600 ms
    setTimeout(function () {
      answerMsg.style.display = "none";
    }, 600);
    // if user is wrong with the answer 10 sec is deducted
    if (timerCount < 10) {
      timerCount -= 10;
      endGame();
      // the game ends when user answered all questions
    } else if (currentQuest === questions.length) {
      endGame();
      // else taked 10 sec and shows the next question
    } else {
      timerCount -= 10;
      nextQuest();
    }
  }
}

// function to end the game
function endGame() {
  // displaing final page when all questions are answered
  answerIndex.style.display = "none";
  container.className = "game-page mt-5";
  title.setAttribute("class", "h2");
  intro.setAttribute("style", "border-top: 0");
  intro.removeAttribute("class");
  intro.textContent = "You got " + score + ". Let us know who you are and we will show you the Leaderboard!";
  inputField.style.display = "block";

  // displaing final page when user ran out of time
  if (timerCount <= 0) {
    title.textContent = "No time left. Think faster!";
  } else {
    title.textContent = "That is it! Good job!";
  }
  // saving result via calling saveScore function
  submitBtn.addEventListener("click", saveScore);
}
// function to save results and prevent the game page to refresh and lose user's result
function saveScore(event) {
  event.preventDefault();
  // if user does not enters initials or name dispaling the alert
  if (yourName.value.length === 0) {
    alert("Please enter your name or initials!");
    return;
    // else saving (pushing) user's name and result in scoreArray
  } else {
    userResult = {
      userName: yourName.value,
      userScore: score,
    };
    scoreArray.push(userResult);
    // sorting all scores from highest to lowest
    scoreArray.sort((a, b) => b.userScore - a.userScore);
    // making an array and pushing to local storage
    localStorage.setItem("score", JSON.stringify(scoreArray));

    // displaing a leaderbord
    displayLeaderbord();
  }
}
// function to load score from local storage
function getScore() {
  // parsing a value from local storage
  savedScore = JSON.parse(localStorage.getItem("score"));
  if (savedScore !== null) {
    scoreArray = savedScore;
    // returning results
    return scoreArray;
  }
}
// function to display a leaderbord
function displayLeaderbord() {
  // clearing timerInterval if startTimer is run
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  // creating new elements and appending them to container
  container.className = "score-page mt-5 card bg-light p-4";
  let ul = document.createElement("ul");
  let playAgain = document.createElement("button");
  let deleteResults = document.createElement("button");
  playAgain.textContent = "Play Again";
  deleteResults.textContent = "Clear The Leaderboard";
  container.appendChild(ul);
  container.appendChild(playAgain);
  container.appendChild(deleteResults);
  // removing startBtn, answers and inputField
  startBtn.style.display = "none";
  navBar.style.visibility = "hidden";
  title.textContent = "Leaderboard";
  intro.textContent = "";
  intro.setAttribute("style", "border-top: 0");
  answerIndex.style.display = "none";
  inputField.style.display = "none";
  // creating and appeending a new list of items for a leaderbord
  for (i = 0; i < scoreArray.length; i++) {
    let score = scoreArray[i].userName + " : " + scoreArray[i].userScore;
    li = document.createElement("li");
    li.textContent = score;
    ul.appendChild(li);
  }
  // adding new event to start the game over
  playAgain.addEventListener("click", function () {
    location.href = "index.html";
  });
  // adding new event to clear results
  deleteResults.addEventListener("click", function () {
    localStorage.clear();
    ul.innerHTML = "";
  });
}
// function to start timer
function startTimer() {
  timerInterval = setInterval(function () {
    timerCount--;
    timer.textContent = timerCount;
    // the game ends when timer is 0
    if (timerCount < 1) {
      timer.textContent = 0;
      endGame();
      clearInterval(timerInterval);
    }
    // timer stops when user answered all questions
    if (currentQuest === questions.length) {
      timer.textContent = timerCount;
      clearInterval(timerInterval);
    }
  }, 1000);
}
// calling a functions to load parsed data from local storage
getScore();

// event (click) to start the game
startBtn.addEventListener("click", startGame);

// event (click) to display the leaderbord
leaderboard.addEventListener("click", displayLeaderbord);
