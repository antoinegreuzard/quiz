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

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit Question';
        editButton.type = 'button';
        editButton.onclick = () => {
            const form = document.getElementById('questionForm');

            form.question.value = question.content;
            form.answer1.value = question.answers.length > 0 ? question.answers[0].content : '';
            form.answer2.value = question.answers.length > 1 ? question.answers[1].content : '';

            if (question.answers.some(answer => answer.correct)) {
                const correctAnswerIndex = question.answers.findIndex(answer => answer.correct);
                form.correct.selectedIndex = correctAnswerIndex + 1;
            }

            form.questionId.value = question.id;

            const submitButton = document.getElementById('submitQuestionButton');
            submitButton.textContent = 'Modifier';

            const cancelButton = document.getElementById('cancelEditButton');
            cancelButton.style.display = 'inline';
        };

        questionElement.appendChild(editButton);

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

function resetForm() {
    const form = document.getElementById('questionForm');
    form.reset();
    form.questionId.value = '';

    const submitButton = document.getElementById('submitQuestionButton');
    submitButton.textContent = 'Créer Question';

    const cancelButton = document.getElementById('cancelEditButton');
    cancelButton.style.display = 'none';
}

function updateQuestion(questionId, questionData) {
    fetch(`/quiz/questions/${questionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
    })
        .then(response => response.json())
        .then(updatedQuestion => {
            console.log('Question updated:', updatedQuestion);
            fetchQuestions();
        })
        .catch(error => console.error('Error updating question:', error));
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
        const questionId = formData.get('questionId');
        const questionData = {
            content: formData.get('question'),
            answers: [
                {content: formData.get('answer1'), correct: formData.get('correct') === 'answer1'},
                {content: formData.get('answer2'), correct: formData.get('correct') === 'answer2'}
            ]
        };

        if (questionId) {
            updateQuestion(questionId, questionData);
        } else {
            createQuestion(questionData);
        }

        resetForm();
    });
});