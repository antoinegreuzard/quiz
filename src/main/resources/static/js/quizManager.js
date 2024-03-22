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
        questionElement.classList.add('question-item', 'p-3', 'mb-2', 'bg-white', 'rounded', 'shadow-sm');
        questionElement.innerHTML = `<h3>${question.content}</h3>`;
        questionsContainer.appendChild(questionElement);

        const formElement = document.createElement('form');
        formElement.classList.add('mb-3');
        formElement.onsubmit = (e) => handleSubmitAnswer(e, question.id);
        questionElement.appendChild(formElement);

        question.answers.forEach((answer, answerIndex) => {
            const answerDiv = document.createElement('div');
            answerDiv.classList.add('form-check');

            const answerInput = document.createElement('input');
            answerInput.classList.add('form-check-input');
            answerInput.type = 'radio';
            answerInput.id = `question-${questionIndex}-answer-${answerIndex}`;
            answerInput.name = `question-${questionIndex}-answer`;
            answerInput.value = answer.id;
            answerDiv.appendChild(answerInput);

            const answerLabel = document.createElement('label');
            answerLabel.classList.add('form-check-label');
            answerLabel.htmlFor = answerInput.id;
            answerLabel.textContent = answer.content;
            answerDiv.appendChild(answerLabel);

            formElement.appendChild(answerDiv);
        });

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('mt-2');
        questionElement.appendChild(buttonsDiv);

        const submitButton = document.createElement('button');
        submitButton.classList.add('btn', 'btn-primary', 'me-2');
        submitButton.type = 'submit';
        submitButton.textContent = 'Valider la réponse';
        formElement.appendChild(submitButton);

        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-success');
        editButton.textContent = 'Modifier la question';
        editButton.type = 'button';
        editButton.onclick = () => {
            resetForm();

            const form = document.getElementById('questionForm');
            form.querySelector('input[name="question"]').value = question.content;
            form.querySelector('input[name="answer1"]').value = question.answers.length > 0 ? question.answers[0].content : '';
            form.querySelector('input[name="answer2"]').value = question.answers.length > 1 ? question.answers[1].content : '';
            form.querySelector('select[name="correct"]').value = question.answers.some(answer => answer.correct) ? 'answer1' : 'answer2';
            form.querySelector('input[name="questionId"]').value = question.id;

            const submitButton = document.getElementById('submitQuestionButton');
            submitButton.textContent = 'Modifier';
            submitButton.classList.remove('btn-primary');
            submitButton.classList.add('btn-warning');

            const cancelButton = document.getElementById('cancelEditButton');
            cancelButton.style.display = 'inline-block';
            cancelButton.addEventListener('click', () => {
                resetForm();
            });
        };


        questionElement.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'ms-2');
        deleteButton.textContent = 'Supprimer la question';
        deleteButton.type = 'button';
        deleteButton.onclick = () => {
            if (confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
                deleteQuestion(question.id);
            }
        };
        questionElement.appendChild(deleteButton);
    });
}

function handleSubmitAnswer(e, questionId) {
    e.preventDefault();
    const form = e.currentTarget;
    const answerId = form.querySelector('input[type="radio"]:checked') ? form.querySelector('input[type="radio"]:checked').value : null;

    if (!answerId) {
        alert("Veuillez sélectionner une réponse.");
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
    submitButton.classList.remove('btn-warning');
    submitButton.classList.add('btn-primary');

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