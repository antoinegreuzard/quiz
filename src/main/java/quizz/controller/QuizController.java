package quizz.controller;

import org.springframework.web.bind.annotation.*;
import quizz.dto.AnswerSubmissionDTO;
import quizz.dto.QuestionDTO;
import quizz.model.Quiz;
import quizz.model.Question;
import quizz.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
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
  public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
    List<QuestionDTO> questionDTOs = quizService.getAllQuestionDTOs();
    return ResponseEntity.ok(questionDTOs);
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

  @DeleteMapping("/questions/{id}")
  public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
    quizService.deleteQuestion(id);
    return ResponseEntity.ok().build();
  }
}