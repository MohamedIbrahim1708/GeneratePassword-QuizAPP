let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area"); 
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0; 
let countdownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionObject = JSON.parse(this.responseText);
            let qCount = questionObject.length;
            
            // Create Bullets + Set Question Count
            createBullet(qCount);

            // Add Question Data
            addQuestionData(questionObject[currentIndex], qCount); 

            // Start CountDown 
            countdown(5, qCount);

            // Click On Submit
            submitButton.onclick = () => {

                // Get Right Answer
                let theRightAnswer = questionObject[currentIndex].right_answer;

                // Increase Index
                currentIndex++;

                // Check Answer
                checkAnswer(theRightAnswer, qCount);

                // Remove Previous Question
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";

                // Add Question Data
                addQuestionData(questionObject[currentIndex], qCount); 

                // Handle Bullets Class
                handleBullets();

                // Start CountDown 
                clearInterval(countdownInterval);
                countdown(5, qCount);

                // Show Results 
                showResult(qCount);

            }
        }   
    };

    myRequest.open("GET","html_question.json", true);
    myRequest.send();
}

getQuestions();

function createBullet(num) {
    countSpan.innerHTML = num;

    // Create Spans
    for(let i = 0; i < num; i++) {

        // Create Bullet
        let theBullet = document.createElement('span');

        // To Check It Is The First Span 
        if(i === 0) {
            theBullet.className = "on";
        }

        // Append Bullets To Main Bullet Container
        bulletSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count) {
    if(currentIndex < count) {
        // Create H2 Question Title
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj['title']);

    // Appent Text To H2
    questionTitle.appendChild(questionText);

    // Append H2 To The Quiz Area
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for(let i = 1; i <= 4; i++) {

        // Create Main Answer Div
        let mainDiv = document.createElement("div");

        // Add Class To Main Div
        mainDiv.className = "answer";

        // create Radio Input
        let radioInput = document.createElement("input");

        // Add Type + Name + ID + Data Attribute
        radioInput.name = 'question';
        radioInput.type = 'radio';
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        // Make First Option Selected
        if (i === 1) {
            radioInput.checked = true;
        }

        // Create Label
        let theLabel = document.createElement('label');

        // Add For Attribute
        theLabel.htmlFor = `answer_${i}`;

        // Create Label Text
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);

        // Add The Text To Label
        theLabel.appendChild(theLabelText);

        // Add Input + Label To Label
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        // Append All Divs To Answer Area
        answerArea.appendChild(mainDiv);

    }
    }
    }

function checkAnswer(rAnswer, count) {
    
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if(rAnswer === theChoosenAnswer) {
        rightAnswers++;
        console.log("Good Answer");
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    })
}

function showResult(count) {
    let theResult;
    if (currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResult = `<span class="good">Good</span> , ${rightAnswers} From ${count}`
        } else if (rightAnswers === count) {
            theResult = `<span class="perfect">Perfect</span> , All Answers Is Good.`   
        } else {
            theResult = `<span class="bad">Bad</span> , ${rightAnswers} From ${count}`
        }
        resultContainer.innerHTML = theResult;
        resultContainer.style.padding = "10px";
        resultContainer.style.backgroundColor = "white";
        resultContainer.style.marginTop = "10px";
    }
}

function countdown(duration, count) {
    if(currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function() {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;
            if(--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }

        }, 1000);
    }
}