import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Survey() {
  const { key, id } = useParams();
  const [surveyData, setSurveyData] = useState(null);

  async function fetchSurveyData() {
    try {
      const response = await fetch(
        `https://surveywei-1b1e0-default-rtdb.firebaseio.com/surveys/${key}/${id}.json`
      );

      if (response.ok) {
        const data = await response.json();
        setSurveyData(data);
      } else {
        throw new Error("Failed to fetch survey data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    fetchSurveyData();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const responses = surveyData.questions.map((_, questionIndex) => {
      const checkedAnswer = document.querySelector(
        `input[name="question-${questionIndex}"]:checked`
      );
      return checkedAnswer ? checkedAnswer.value : null;
    });

    // Attach creator's information to the responses data
    const responseData = {
      creator: surveyData?.creator || "Unknown", // Using optional chaining and fallback value
      responses: responses,
    };

    console.log("Responses:", responseData);
  };

  const formatQuestion = (questionText) => {
    const capitalizedFirstLetter =
      questionText.charAt(0).toUpperCase() + questionText.slice(1);
    const endsWithQuestionMark = capitalizedFirstLetter.endsWith("?");
    return endsWithQuestionMark
      ? capitalizedFirstLetter
      : capitalizedFirstLetter + "?";
  };

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans pt-8">
      <h1 className="font-bold text-3xl text-center mb-4">
        {surveyData.title}
      </h1>
      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        {surveyData.questions &&
          surveyData.questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="border-2 mb-10 p-6 bg-white rounded shadow-lg w-full sm:w-11/12 md:w-3/4 lg:w-1/2"
            >
              <h3 className="font-bold text-xl mb-6 text-center">
                {formatQuestion(question.question)}
              </h3>
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="mb-2 text-center">
                  <input
                    type="radio"
                    id={`question-${questionIndex}-answer-${answerIndex}`}
                    name={`question-${questionIndex}`}
                    value={answer}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`question-${questionIndex}-answer-${answerIndex}`}
                  >
                    {answer}
                  </label>
                </div>
              ))}
            </div>
          ))}
        <button
          type="submit"
          className="btn rounded-xl py-2 px-4 bg-blue-500 text-white flex align-center justify-center text-center mx-auto my-1 mb-3"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Survey;
