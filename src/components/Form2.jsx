import React from "react";

import { useState, useEffect, useRef, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserAddressContext from "../UserAddressContext";

function Form2() {
  const [title, setTitle] = useState("");
  const [formData, setFormData] = useState([{}]);
  const [questions, setQuestions] = useState([]);
  const [questionRefs, setQuestionRefs] = useState([React.createRef()]);
  const connectedAddress = useContext(UserAddressContext);

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
            body: JSON.stringify({
              [uuidv4()]: {
                title: title,
                creator: connectedAddress,
                questions: updatedQuestions,
              },
            }),
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
      className="flex align-center justify-center mx-auto text-center border-2 mb-10 p-4 bg-white rounded shadow-lg w-full sm:w-11/12 md:w-3/4 lg:w-1/2"
    >
      <div>
        <label className="mr-2">{`Question ${i + 1}:`}</label>
        <input
          type="text"
          className="border-2 bg-gray-100 shadow-md mb-4 px-2 py-1"
          placeholder={`Enter Question ${i + 1}`}
          id={`question${i + 1}`}
          onChange={onChange(i)}
        />
        <h2>Answers:</h2>
        {Array.from({ length: 4 }, (_, j) => (
          <div key={j} className="mb-2">
            <label className="mr-2">{`Option ${j + 1}:`}</label>
            <input
              type="text"
              className="border-2 bg-gray-100 shadow-md px-2 py-1"
              placeholder={`Enter Option ${j + 1}`}
              id={`answer${j + 1}`}
              onChange={onChange(i)}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center ml-2 sm:ml-4 md:ml-10">
        <button
          type="button"
          onClick={() => removeQuestion(i)}
          className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full text-red-500 border border-red-500"
        >
          <i className="fas fa-minus"></i>
        </button>
        {i === formData.length - 1 && (
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full text-blue-500 border border-blue-500 ml-2"
          >
            <i className="fas fa-plus"></i>
          </button>
        )}
      </div>
    </div>
  ));
  return (
    <>
      <div className="bg-gray-100 min-h-screen font-sans">
        <div className="flex align-center justify-center mx-auto"></div>
        <div
          id="form-container"
          className="flex-col align-center justify-center mx-auto "
        >
          <div id="headline-container">
            <h1 className="font-bold text-2xl text-center mt-8 mb-4">
              Create Survey
            </h1>
          </div>
          <div id="form-block" className="flex-col mx-auto">
            <div
              id="title-container"
              className="flex items-center justify-center mx-auto text-center mb-10"
            >
              <label className="mr-2 align-middle">Survey Title: </label>
              <input
                type="text"
                className="border-2 bg-gray-100 shadow-md mt-3 mb-4 px-2 py-1 align-middle"
                placeholder="Enter Survey Title"
                id="title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
            {questionBlocks}
          </div>
        </div>
        <button
          type="button"
          onClick={onClick}
          className="btn rounded-xl py-2 px-4 bg-blue-500 text-white flex align-center justify-center text-center mx-auto my-1 mb-3"
        >
          Submit Survey
        </button>
      </div>
      <ToastContainer />
    </>
  );
}

export default Form2;
