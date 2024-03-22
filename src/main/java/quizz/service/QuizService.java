package quizz.service;

import quizz.dto.AnswerSubmissionDTO;
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
}