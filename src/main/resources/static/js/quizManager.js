function fetchQuestions() {
  fetch('/quiz/questions')
    .then(response => response.json())
    .then(questions => {
      console.log("Received questions:", questions);
      displayQuestions(questions);
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

  questions.forEach((question, questionIndex) => {
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `<h3>${question.content}</h3>`;
    questionsContainer.appendChild(questionElement);

    const formElement = document.createElement('form');
    formElement.onsubmit = (e) => handleSubmitAnswer(e, question.id);
    questionElement.appendChild(formElement);

    question.answers.forEach((answer, answerIndex) => {
      const answerLabel = document.createElement('label');
      answerLabel.htmlFor = `question-${questionIndex}-answer-${answerIndex}`;
      answerLabel.textContent = answer.content;
      formElement.appendChild(answerLabel);

      const answerInput = document.createElement('input');
      answerInput.type = 'radio';
      answerInput.id = `question-${questionIndex}-answer-${answerIndex}`;
      answerInput.name = `question-${questionIndex}-answer`;
      answerInput.value = answer.id;
      formElement.insertBefore(answerInput, answerLabel);
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit Answer';
    formElement.appendChild(submitButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Question';
    deleteButton.type = 'button';
    deleteButton.onclick = () => deleteQuestion(question.id);
    questionElement.appendChild(deleteButton);
  });
}

function handleSubmitAnswer(e, questionId) {
  e.preventDefault();
  const form = e.currentTarget;
  const answerId = form.querySelector('input[type="radio"]:checked') ? form.querySelector('input[type="radio"]:checked').value : null;

  if (!answerId) {
    alert("Please select an answer.");
    return;
  }

  submitAnswer(questionId, answerId);
}

function deleteQuestion(questionId) {
  fetch(`/quiz/questions/${questionId}`, {
    method: 'DELETE',
  })
    .then(() => {
      console.log('Question deleted:', questionId);
      fetchQuestions();
    })
    .catch(error => console.error('Error deleting question:', error));
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