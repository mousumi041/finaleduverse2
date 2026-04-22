export const getQuizQuestions = (subject) => {
  const questions = [];
  
  // Custom first few questions depending on the subject to make it look somewhat real
  if (subject === "React") {
    questions.push({ q: "What is React?", options: ["A JavaScript library", "A programming language", "A database", "A web server"], a: 0 });
    questions.push({ q: "Which hook is used for state?", options: ["useEffect", "useState", "useRef", "useContext"], a: 1 });
  } else if (subject === "JavaScript") {
    questions.push({ q: "Which is NOT a JavaScript datatype?", options: ["String", "Boolean", "Undefined", "Float"], a: 3 });
    questions.push({ q: "What does 'typeof null' return?", options: ["null", "undefined", "object", "string"], a: 2 });
  } else if (subject === "Python") {
    questions.push({ q: "Which keyword is used for a function?", options: ["func", "def", "lambda", "function"], a: 1 });
  } else {
    questions.push({ q: `What is the primary use of ${subject}?`, options: ["Backend", "Frontend", "Database", "General Purpose"], a: 3 });
  }

  // Fill up the rest until we have exactly 20 questions
  let count = questions.length;
  while (count < 20) {
    count++;
    questions.push({
      q: `Intermediate Question ${count} evaluating your knowledge of ${subject}.`,
      options: ["Syntax property", "Compiler execution", "Runtime environment", "Logical statement"],
      a: Math.floor(Math.random() * 4)
    });
  }

  return questions;
};
