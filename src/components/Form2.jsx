import React from "react";

import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Form2() {
  const [title, setTitle] = useState("");
  const [formData, setFormData] = useState([{}]);
  const [questions, setQuestions] = useState([]);
  const [questionRefs, setQuestionRefs] = useState([React.createRef()]);

  const onChange = (index) => (e) => {
    setFormData((prevState) => {
      const newState = [...prevState];
      newState[index] = { ...newState[index], [e.target.id]: e.target.value };
      return newState;
    });
  };

  const makeQuestion = (index) => {
    const question = formData[index][`question${index + 1}`];
    const answers = [
      formData[index].answer1,
      formData[index].answer2,
      formData[index].answer3,
      formData[index].answer4,
    ];
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[index] = { question: question, answers: answers };
      return newQuestions;
    });
  };

  const makeQuestions = () => {
    for (let i = 0; i < 5; i++) {
      makeQuestion(i);
    }
  };

  const onClick = () => {
    makeQuestions();
  };

  useEffect(() => {
    const resetForm = () => {
      setTitle("");
      setFormData([{}]);
      setQuestions([]);
      setQuestionRefs([React.createRef()]);
      document.getElementById("title").value = "";
      formData.forEach((_, i) => {
        document.getElementById(`question${i + 1}`).value = "";
        Array.from({ length: 4 }, (_, j) => {
          document.getElementById(`answer${j + 1}`).value = "";
        });
      });
    };

    if (title && questions.length > 0) {
      fetch(
        "https://surveywei-1b1e0-default-rtdb.firebaseio.com/surveys.json",
        {
          method: "POST",
          body: JSON.stringify({ [title]: questions }),
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((response) => {
          if (response.ok) {
            toast.success("Survey successfully uploaded to Firebase!");
            resetForm();
          } else {
            toast.error("Error uploading survey to Firebase.");
          }
          return response.json();
        })
        .catch((error) => {
          toast.error("Error uploading survey to Firebase.");
        });
    }
  }, [questions]);

  useEffect(() => {
    if (formData.length > 1) {
      questionRefs[formData.length - 1].current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [formData]);

  const addQuestion = () => {
    if (formData.length < 5) {
      setFormData((prevFormData) => [...prevFormData, {}]);
      setQuestions((prevQuestions) => [...prevQuestions, {}]);
      setQuestionRefs((prevRefs) => [...prevRefs, React.createRef()]);
    } else {
      alert("You have reached the maximum limit of 5 questions.");
    }
  };

  const questionBlocks = formData.map((_, i) => (
    <div
      key={i}
      ref={questionRefs[i]}
      id={`question${i + 1}-block`}
      className="flex  align-center justify-center mx-auto text-center border-2 mb-10"
    >
      <div>
        <label>{`Question ${i + 1}:`}</label>
        <input
          type="text"
          className="border-2"
          placeholder={`Enter Question ${i + 1}`}
          id={`question${i + 1}`}
          onChange={onChange(i)}
        />
        <h2>Answers:</h2>
        {Array.from({ length: 4 }, (_, j) => (
          <div key={j}>
            <label>{`Option ${j + 1}:`}</label>
            <input
              type="text"
              className="border-2"
              placeholder={`Enter Option ${j + 1}`}
              id={`answer${j + 1}`}
              onChange={onChange(i)}
            />
          </div>
        ))}
      </div>
    </div>
  ));
  return (
    <>
      <ToastContainer />
      <div className="flex align-center justify-center mx-auto"></div>
      <div
        id="form-container"
        className="flex-col align-center justify-center mx-auto "
      >
        <div id="headline-container">
          <h1 className="font-bold text-2xl text-center">Create Survey</h1>
        </div>
        <div id="form-block" className="flex-col mx-auto">
          <div
            id="title-container"
            className="flex  align-center justify-center mx-auto text-center mb-10"
          >
            <label>Survey Title: </label>
            <input
              type="text"
              className="border-2"
              placeholder="Enter Survey Title"
              id="title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          {questionBlocks}
        </div>
        <button
          type="button"
          onClick={onClick}
          className="btn rounded-xl py-1 px-2 bg-[red] flex align-center justify-center text-center mx-auto my-3"
        >
          Submit Survey
        </button>
        <button
          type="button"
          onClick={addQuestion}
          className="btn rounded-xl py-1 px-2 bg-[blue] flex align-center justify-center text-center mx-auto my-3"
        >
          Add Question
        </button>
      </div>
    </>
  );
}

export default Form2;
