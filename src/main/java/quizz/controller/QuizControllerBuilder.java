package quizz.controller;

import quizz.service.QuizService;

public class QuizControllerBuilder {
  private QuizService quizService;

  public QuizControllerBuilder setQuizService(QuizService quizService) {
    this.quizService = quizService;
    return this;
  }

  public QuizController createQuizController() {
    return new QuizController(quizService);
  }
}