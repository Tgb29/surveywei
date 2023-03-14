import React, { useState } from "react";

const questions = [
  {
    id: 1,
    text: "What is your favorite color?",
    options: ["Red", "Green", "Blue", "Yellow", "Purple"],
  },
  {
    id: 2,
    text: "What is your favorite animal?",
    options: ["Dog", "Cat", "Bird", "Fish", "Rabbit"],
  },
  // ... add more questions
];

function RadioGroup() {
  const [answers, setAnswers] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    console.log(answers);
  }

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((question) => (
        <div key={question.id}>
          <p>{question.text}</p>
          {question.options.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name={`question${question.id}`}
                value={option}
                checked={answers[question.id] === option}
                onChange={(e) =>
                  setAnswers({ ...answers, [question.id]: e.target.value })
                }
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

export default RadioGroup;
