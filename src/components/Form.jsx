import { useState, useEffect } from "react";

function Form() {
  const [survey, setSurvey] = useState(null);
  const [title, setTitle] = useState("");
  const [formData, setFormData] = useState({});
  const [question1, setQuestion1] = useState([]);
  const [formData2, setFormData2] = useState({});
  const [question2, setQuestion2] = useState([]);
  const [formData3, setFormData3] = useState({});
  const [question3, setQuestion3] = useState([]);
  const [formData4, setFormData4] = useState({});
  const [question4, setQuestion4] = useState([]);
  const [formData5, setFormData5] = useState({});
  const [question5, setQuestion5] = useState([]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onChange2 = (e) => {
    setFormData2((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onChange3 = (e) => {
    setFormData3((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onChange4 = (e) => {
    setFormData4((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onChange5 = (e) => {
    setFormData5((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const makeQ1 = () => {
    const question = formData.question1;
    const answers = [
      formData.answer1,
      formData.answer2,
      formData.answer3,
      formData.answer4,
    ];

    setQuestion1({ question: question, answers: answers });
  };
  const makeQ2 = () => {
    const question = formData2.question2;
    const answers = [
      formData2.answer1,
      formData2.answer2,
      formData2.answer3,
      formData2.answer4,
    ];

    setQuestion2({ question: question, answers: answers });
  };
  const makeQ3 = () => {
    const question = formData3.question3;
    const answers = [
      formData3.answer1,
      formData3.answer2,
      formData3.answer3,
      formData3.answer4,
    ];

    setQuestion3({ question: question, answers: answers });
  };
  const makeQ4 = () => {
    const question = formData4.question4;
    const answers = [
      formData4.answer1,
      formData4.answer2,
      formData4.answer3,
      formData4.answer4,
    ];

    setQuestion4({ question: question, answers: answers });
  };
  const makeQ5 = () => {
    const question = formData5.question5;
    const answers = [
      formData5.answer1,
      formData5.answer2,
      formData5.answer3,
      formData5.answer4,
    ];

    setQuestion5({ question: question, answers: answers });
  };

  const makeQuestions = () => {
    makeQ1();
    makeQ2();
    makeQ3();
    makeQ4();
    makeQ5();
  };
  // const jsonString = JSON.stringify(formData);
  // console.log(formData);
  // console.log(jsonString);
  // const onClick = () => {
  //   makeQuestions();
  //   setSurvey({
  //     [title]: [question1, question2, question3, question4, question5],
  //   });
  //   fetch("https://surveywei-1b1e0-default-rtdb.firebaseio.com/surveys.json", {
  //     method: "POST",
  //     body: JSON.stringify(survey),
  //     headers: { "Content-Type": "application/json" },
  //   });
  // };

  // const onClick = async () => {
  //   makeQuestions();
  //   setSurvey({
  //     [title]: [question1, question2, question3, question4, question5],
  //   });
  // };

  // useEffect(() => {
  //   if (survey !== null) {
  //     fetch(
  //       "https://surveywei-1b1e0-default-rtdb.firebaseio.com/surveys.json",
  //       {
  //         method: "POST",
  //         body: JSON.stringify(survey),
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //   }
  // }, [survey]);
  // console.log(survey);
  const onClick = () => {
    makeQuestions();
  };

  useEffect(() => {
    fetch("https://surveywei-1b1e0-default-rtdb.firebaseio.com/surveys.json", {
      method: "POST",
      body: JSON.stringify({
        [title]: [question1, question2, question3, question4, question5],
      }),
      headers: { "Content-Type": "application/json" },
    });
  }, [question1, question2, question3, question4, question5]);
  return (
    <>
      <button type="button" onClick={onClick}>
        Click
      </button>
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
          <div
            id="question1-block"
            className="flex  align-center justify-center mx-auto text-center border-2 mb-10"
          >
            <div>
              <label>Question 1:</label>
              <input
                type="text"
                className="border-2"
                placeholder="Enter Question 1 "
                id="question1"
                onChange={onChange}
              />
              <h2>Answers:</h2>
              <div>
                <label>Option 1:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 1"
                  id="answer1"
                  onChange={onChange}
                />
              </div>
              <div>
                <label>Option 2:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 2"
                  id="answer2"
                  onChange={onChange}
                />
              </div>
              <div>
                <label>Option 3:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 3"
                  id="answer3"
                  onChange={onChange}
                />
              </div>
              <div>
                <label>Option 4:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 4"
                  id="answer4"
                  onChange={onChange}
                />
              </div>
            </div>
          </div>
          <div
            id="question2-block"
            className="flex  align-center justify-center mx-auto text-center border-2 mb-10"
          >
            <div>
              <label>Question 2:</label>
              <input
                type="text"
                className="border-2"
                placeholder="Enter Question 2 "
                id="question2"
                onChange={onChange2}
              />
              <h2>Answers:</h2>
              <div>
                <label>Option 1:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 1"
                  id="answer1"
                  onChange={onChange2}
                />
              </div>
              <div>
                <label>Option 2:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 2"
                  id="answer2"
                  onChange={onChange2}
                />
              </div>
              <div>
                <label>Option 3:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 3"
                  id="answer3"
                  onChange={onChange2}
                />
              </div>
              <div>
                <label>Option 4:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 4"
                  id="answer4"
                  onChange={onChange2}
                />
              </div>
            </div>
          </div>
          <div
            id="question3-block"
            className="flex  align-center justify-center mx-auto text-center border-2 mb-10"
          >
            <div>
              <label>Question 3:</label>
              <input
                type="text"
                className="border-2"
                placeholder="Enter Question 3 "
                id="question3"
                onChange={onChange3}
              />
              <h2>Answers:</h2>
              <div>
                <label>Option 1:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 1"
                  id="answer1"
                  onChange={onChange3}
                />
              </div>
              <div>
                <label>Option 2:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 2"
                  id="answer2"
                  onChange={onChange3}
                />
              </div>
              <div>
                <label>Option 3:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 3"
                  id="answer3"
                  onChange={onChange3}
                />
              </div>
              <div>
                <label>Option 4:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 4"
                  id="answer4"
                  onChange={onChange3}
                />
              </div>
            </div>
          </div>
          <div
            id="question4-block"
            className="flex  align-center justify-center mx-auto text-center border-2 mb-10"
          >
            <div>
              <label>Question 4:</label>
              <input
                type="text"
                className="border-2"
                placeholder="Enter Question 4 "
                id="question4"
                onChange={onChange4}
              />
              <h2>Answers:</h2>
              <div>
                <label>Option 1:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 1"
                  id="answer1"
                  onChange={onChange4}
                />
              </div>
              <div>
                <label>Option 2:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 2"
                  id="answer2"
                  onChange={onChange4}
                />
              </div>
              <div>
                <label>Option 3:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 3"
                  id="answer3"
                  onChange={onChange4}
                />
              </div>
              <div>
                <label>Option 4:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 4"
                  id="answer4"
                  onChange={onChange4}
                />
              </div>
            </div>
          </div>
          <div
            id="question5-block"
            className="flex  align-center justify-center mx-auto text-center border-2 mb-5"
          >
            <div>
              <label>Question 5:</label>
              <input
                type="text"
                className="border-2"
                placeholder="Enter Question 5 "
                id="question5"
                onChange={onChange5}
              />
              <h2>Answers:</h2>
              <div>
                <label>Option 1:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 1"
                  id="answer1"
                  onChange={onChange5}
                />
              </div>
              <div>
                <label>Option 2:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 2"
                  id="answer2"
                  onChange={onChange5}
                />
              </div>
              <div>
                <label>Option 3:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 3"
                  id="answer3"
                  onChange={onChange5}
                />
              </div>
              <div>
                <label>Option 4:</label>
                <input
                  type="text"
                  className="border-2"
                  placeholder="Enter Option 4"
                  id="answer4"
                  onChange={onChange5}
                />
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClick}
          className="btn rounded-xl py-1 px-2 bg-[red] flex align-center justify-center text-center mx-auto my-3"
        >
          Click
        </button>
      </div>
    </>
  );
}

export default Form;
