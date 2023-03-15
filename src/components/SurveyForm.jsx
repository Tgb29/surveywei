import { useState } from "react";
import Question from "./Question";
// import { db } from "../firebase.config";
// import { v4 as uuidV4 } from "uuid";
// import { addDoc, collection } from "firebase/firestore";

function SurveyForm() {
  const [questions, setQuestions] = useState([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [title, setTitle] = useState("");
  const [survey, setSurvey] = useState({});

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
  const createSurveyQuestions = (e) => {
    let newQuestions = [...Array(numberOfQuestions)].map((_, index) => {
      //   console.log(e.target[2].value);
      console.log(index + 1);
      if (index < 1) {
        return {
          id: index + 1,
          question: e.target[index + 1].value,
          answers: [...Array(4)].map(
            (_, optionIndex) => e.target[optionIndex + 2].value
          ),
        };
      } else if (index === 1) {
        return {
          id: index + 1,
          question: e.target[index + 5].value,
          answers: [...Array(4)].map(
            (_, optionIndex) => e.target[optionIndex + 7].value
          ),
        };
      } else if (index === 2) {
        return {
          id: index + 1,
          question: e.target[index + 9].value,
          answers: [...Array(4)].map(
            (_, optionIndex) => e.target[optionIndex + 12].value
          ),
        };
      } else if (index === 3) {
        return {
          id: index + 1,
          question: e.target[index + 13].value,
          answers: [...Array(4)].map(
            (_, optionIndex) => e.target[optionIndex + 17].value
          ),
        };
      } else {
        return {
          id: index + 1,
          question: e.target[index + 17].value,
          answers: [...Array(4)].map(
            (_, optionIndex) => e.target[optionIndex + 22].value
          ),
        };
      }
    });
    setQuestions(newQuestions);
  };
  function handleSubmit(e) {
    e.preventDefault();
    createSurveyQuestions(e);
    setSurvey({ [title]: questions });
    fetch("https://surveywei-1b1e0-default-rtdb.firebaseio.com/surveys.json", {
      method: "POST",
      body: JSON.stringify(survey),
      headers: { "Content-Type": "application/json" },
    });
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
  console.log(survey);
  console.log(title);
  return (
    <div>
      <div>
        <h2>Create a Survey</h2>
        <button
          onClick={addQuestion}
          className="btn rounded-full bg-[red] px-3 py-1"
        >
          Add New Question
        </button>
        <form onSubmit={handleSubmit}>
          <label>Form Title: </label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          {[...Array(numberOfQuestions)].map((_, index) => (
            <Question key={index} index={index + 1} />
          ))}
          <button className="btn rounded-full bg-[red] px-3 py-1">
            Create Survey
          </button>
        </form>
      </div>
    </div>
  );
}

export default SurveyForm;
