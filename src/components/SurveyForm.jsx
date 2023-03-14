import { useState } from "react";
import Question from "./Question";

function SurveyForm() {
  const [questions, setQuestions] = useState([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);

  //   function handleSubmit(e) {
  //     e.preventDefault();
  //     let newQuestions = [...Array(5)].map((_, index) => ({
  //       id: index + 1,
  //       text: e.target[`question${index + 1}-text`].value,
  //       options: [...Array(4)].map(
  //         (_, optionIndex) =>
  //           e.target[`question${index + 1}-option${optionIndex}`].value
  //       ),
  //     }));
  //     setQuestions(newQuestions);
  //   }
  //   function handleSubmit(e) {
  //     console.log(e.target);
  //     e.preventDefault();
  //   }
  function handleSubmit(e) {
    e.preventDefault();
    let newQuestions = [...Array(numberOfQuestions)].map((_, index) => {
      //   console.log(e.target[2].value);
      console.log(index + 1);
      if (index < 1) {
        return {
          id: index + 1,
          text: e.target[index].value,
          options: [...Array(4)].map(
            (_, optionIndex) => e.target[optionIndex + 1].value
          ),
        };
      } else if (index === 1) {
        return {
          id: index + 1,
          text: e.target[index + 4].value,
          options: [...Array(4)].map(
            (_, optionIndex) => e.target[optionIndex + 6].value
          ),
        };
      } else if (index === 2) {
        return {
          id: index + 1,
          text: e.target[index + 8].value,
          options: [...Array(4)].map(
            (_, optionIndex) => e.target[optionIndex + 11].value
          ),
        };
      } else if (index === 3) {
        return {
          id: index + 1,
          text: e.target[index + 12].value,
          options: [...Array(4)].map(
            (_, optionIndex) => e.target[optionIndex + 16].value
          ),
        };
      } else {
        return {
          id: index + 1,
          text: e.target[index + 16].value,
          options: [...Array(4)].map(
            (_, optionIndex) => e.target[optionIndex + 21].value
          ),
        };
      }
    });
    setQuestions(newQuestions);
  }

  const addQuestion = (e) => {
    e.preventDefault();
    let amount = numberOfQuestions;
    if (amount < 5) {
      setNumberOfQuestions(amount + 1);
    } else alert("Max 5 questions");
    console.log(numberOfQuestions);
  };
  console.log(questions);

  return (
    <div>
      <h2>Create a Survey</h2>
      <button onClick={addQuestion}>Add New Question</button>
      <form onSubmit={handleSubmit}>
        {[...Array(numberOfQuestions)].map((_, index) => (
          <Question key={index} index={index + 1} />
        ))}
        <button type="submit">Create Survey</button>
      </form>
    </div>
  );
}

export default SurveyForm;
