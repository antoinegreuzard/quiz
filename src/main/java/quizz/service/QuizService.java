package quizz.service;

import quizz.dto.AnswerDTO;
import quizz.dto.AnswerSubmissionDTO;
import quizz.dto.QuestionDTO;
import quizz.model.Answer;
import quizz.model.Question;
import quizz.model.Quiz;
import quizz.repository.AnswerRepository;
import quizz.repository.QuestionRepository;
import quizz.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final AnswerRepository answerRepository;

    @Autowired
    public QuizService(QuestionRepository questionRepository,
                       QuizRepository quizRepository,
                       AnswerRepository answerRepository) {
        this.questionRepository = questionRepository;
        this.quizRepository = quizRepository;
        this.answerRepository = answerRepository;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question createQuestion(Question question) {
        question.getAnswers().forEach(answer -> answer.setQuestion(question));
        return questionRepository.save(question);
    }

    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }


    public boolean checkAnswer(AnswerSubmissionDTO submission) {
        Optional<Answer> answer = answerRepository.findById(submission.getAnswerId());
        return answer.isPresent() && answer.get().isCorrect();
    }

    public List<QuestionDTO> getAllQuestionDTOs() {
        return questionRepository.findAll().stream()
            .map(this::convertToQuestionDTO)
            .collect(Collectors.toList());
    }

    private QuestionDTO convertToQuestionDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setContent(question.getContent());
        List<AnswerDTO> answerDTOs = question.getAnswers().stream()
            .map(this::convertToAnswerDTO)
            .collect(Collectors.toList());
        dto.setAnswers(answerDTOs);
        return dto;
    }

    private AnswerDTO convertToAnswerDTO(Answer answer) {
        AnswerDTO dto = new AnswerDTO();
        dto.setId(answer.getId());
        dto.setContent(answer.getContent());
        return dto;
    }

    public void deleteQuestion(Long questionId) {
        questionRepository.deleteById(questionId);
    }

    public Question updateQuestion(Long questionId, QuestionDTO questionDTO) {
        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setContent(questionDTO.getContent());

        return questionRepository.save(question);
    }

}