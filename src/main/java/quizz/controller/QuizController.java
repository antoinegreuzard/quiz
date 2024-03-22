package quizz.controller;

import quizz.dto.AnswerSubmissionDTO;
import quizz.model.Quiz;
import quizz.model.Question;
import quizz.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/quiz")
public class QuizController {

  private final QuizService quizService;

  @Autowired
  public QuizController(QuizService quizService) {
    this.quizService = quizService;
  }

  @GetMapping("/questions")
  public List<Question> getAllQuestions() {
    return quizService.getAllQuestions();
  }

  @PostMapping("/questions")
  public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
    Question createdQuestion = quizService.createQuestion(question);
    return ResponseEntity.ok(createdQuestion);
  }

  @GetMapping
  public ResponseEntity<List<Quiz>> getAllQuizzes() {
    List<Quiz> quizzes = quizService.getAllQuizzes();
    return ResponseEntity.ok(quizzes);
  }

  @PostMapping
  public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
    Quiz createdQuiz = quizService.createQuiz(quiz);
    return ResponseEntity.ok(createdQuiz);
  }

  @PostMapping("/answers/submit")
  public ResponseEntity<?> submitAnswer(@RequestBody AnswerSubmissionDTO submission) {
    boolean isCorrect = quizService.checkAnswer(submission);
    return ResponseEntity.ok(Map.of("isCorrect", isCorrect));
  }

}