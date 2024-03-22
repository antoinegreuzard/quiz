function fetchQuestions() {
  fetch('/quiz/questions')
    .then(response => response.json())
    .then(questions => {
      if (Array.isArray(questions)) {
        displayQuestions(questions);
      } else {
        console.error('Received data is not an array:', questions);
      }
    })
    .catch(error => console.error('Error fetching questions:', error));
}

function createQuestion(questionData) {
  fetch('/quiz/questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionData),
  })
    .then(response => response.json())
    .then(question => {
      console.log('Question created:', question);
      fetchQuestions();
    })
    .catch(error => console.error('Error creating question:', error));
}

function displayQuestions(questions) {
  const questionsContainer = document.getElementById('questionsContainer');
  questionsContainer.innerHTML = '';

  questions.forEach(question => {
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `<h3>${question.content}</h3>`;

    const answersList = document.createElement('form');
    answersList.onsubmit = (e) => handleSubmitAnswer(e, question.id);

    question.answers.forEach(answer => {
      const answerOption = document.createElement('div');
      answerOption.innerHTML = `
        <input type="radio" name="answer" value="${answer.id}" required> ${answer.content}
      `;
      answersList.appendChild(answerOption);
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit Answer';
    answersList.appendChild(submitButton);

    questionElement.appendChild(answersList);
    questionsContainer.appendChild(questionElement);
  });
}

function handleSubmitAnswer(e, questionId) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const answerId = formData.get('answer');

  submitAnswer(questionId, answerId);
}

function submitAnswer(questionId, answerId) {
  fetch('/quiz/answers/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({questionId, answerId}),
  })
    .then(response => response.json())
    .then(result => {
      alert(`Votre réponse est ${result.isCorrect ? 'correcte' : 'incorrecte'}.`);
    })
    .catch(error => console.error('Error submitting answer:', error));
}


document.addEventListener('DOMContentLoaded', () => {
  fetchQuestions();

  const form = document.getElementById('questionForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const questionData = {
      content: formData.get('question'),
      answers: [
        {content: formData.get('answer1'), correct: formData.get('correct') === 'answer1'},
        {content: formData.get('answer2'), correct: formData.get('correct') === 'answer2'}
      ]
    };

    createQuestion(questionData);
  });
});