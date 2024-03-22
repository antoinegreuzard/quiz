package quizz.dto;

public class AnswerSubmissionDTO {
  private Long questionId;
  private Long answerId;

  // Getter et Setter pour questionId et answerId
  public Long getQuestionId() {
    return questionId;
  }

  public void setQuestionId(Long questionId) {
    this.questionId = questionId;
  }

  public Long getAnswerId() {
    return answerId;
  }

  public void setAnswerId(Long answerId) {
    this.answerId = answerId;
  }
}