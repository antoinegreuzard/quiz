package quizz.dto;

import java.util.List;

public class QuestionDTO {
  private Long id;
  private String content;
  private List<AnswerDTO> answers;

  public QuestionDTO() {
  }

  public QuestionDTO(Long id, String content, List<AnswerDTO> answers) {
    this.id = id;
    this.content = content;
    this.answers = answers;
  }

  public Long getId() {
    return id;
  }

  public String getContent() {
    return content;
  }

  public List<AnswerDTO> getAnswers() {
    return answers;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public void setAnswers(List<AnswerDTO> answers) {
    this.answers = answers;
  }
}