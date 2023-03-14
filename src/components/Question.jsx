import { useState } from "react";

function Question({ index }) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);

  return (
    <div>
      <h3>Question {index}</h3>
      <label htmlFor={`question${index}-text`}>Question Text:</label>
      <input
        type="text"
        id={`question${index}-text`}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      {options.map((option, optionIndex) => (
        <div key={optionIndex}>
          <label htmlFor={`question${index}-option${optionIndex}`}>
            Answer {optionIndex + 1}:
          </label>
          <input
            type="text"
            id={`question${index}-option${optionIndex}`}
            value={option}
            onChange={(e) =>
              setOptions((prevOptions) =>
                prevOptions.map((o, i) =>
                  i === optionIndex ? e.target.value : o
                )
              )
            }
          />
        </div>
      ))}
    </div>
  );
}

export default Question;
