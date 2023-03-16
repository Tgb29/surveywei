import React from "react";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
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

  const makeQuestions = () => {
    const newQuestions = [];
    for (let i = 0; i < formData.length; i++) {
      const question = formData[i][`question${i + 1}`];
      const answers = [
        formData[i].answer1,
        formData[i].answer2,
        formData[i].answer3,
        formData[i].answer4,
      ];
      newQuestions[i] = { question: question, answers: answers };
    }
    return newQuestions;
  };

  const onClick = async () => {
    const updatedQuestions = makeQuestions();
    setQuestions(updatedQuestions);

    if (title && updatedQuestions.length > 0) {
      try {
        const response = await fetch(
          "https://surveywei-1b1e0-default-rtdb.firebaseio.com/surveys.json",
          {
            method: "POST",
            body: JSON.stringify({ [title]: updatedQuestions }),
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.ok) {
          showSuccessToast();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const showSuccessToast = () => {
    toast.success("Survey submitted successfully!", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  useEffect(() => {
    if (formData.length > 1) {
      questionRefs[formData.length - 1].current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [formData]);

  const addQuestion = () => {
    if (formData.length < 5) {
      setFormData((prevFormData) => [...prevFormData, { id: uuidv4() }]);
      setQuestions((prevQuestions) => [...prevQuestions, {}]);
      setQuestionRefs((prevRefs) => [...prevRefs, React.createRef()]);
    } else {
      alert("You have reached the maximum limit of 5 questions.");
    }
  };

  const removeQuestion = (index) => {
    setFormData((prevState) => prevState.filter((_, i) => i !== index));
    setQuestions((prevState) => prevState.filter((_, i) => i !== index));
    setQuestionRefs((prevState) => prevState.filter((_, i) => i !== index));
  };

  const questionBlocks = formData.map((question, i) => (
    <div
      key={question.id}
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
      <button
        type="button"
        onClick={() => removeQuestion(i)}
        className="btn flex ml-10 py-1 px-2 bg-[lightgreen] h-fit"
      >
        Remove Question
      </button>
    </div>
  ));
  return (
    <>
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
      <ToastContainer />
    </>
  );
}

export default Form2;
