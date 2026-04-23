const quizDatabase = {
  "React": [
    { q: "What is React?", options: ["A JavaScript library", "A programming language", "A database", "A web server"], a: 0 },
    { q: "Which hook is used for state?", options: ["useEffect", "useState", "useRef", "useContext"], a: 1 },
    { q: "What is JSX?", options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"], a: 0 },
    { q: "Which method is used to update state?", options: ["updateState()", "setState()", "modifyState()", "changeState()"], a: 1 },
    { q: "What is the purpose of useEffect?", options: ["Handle side effects", "Update state", "Create components", "Handle events"], a: 0 },
    { q: "What is a React component?", options: ["Reusable UI piece", "Database table", "CSS style", "HTML tag"], a: 0 },
    { q: "Which hook is used for context?", options: ["useContext", "useReducer", "useEffect", "useState"], a: 0 },
    { q: "What is props in React?", options: ["Properties passed to components", "Component methods", "State variables", "Event handlers"], a: 0 },
    { q: "What is the Virtual DOM?", options: ["JavaScript representation of DOM", "Real DOM copy", "Database structure", "CSS framework"], a: 0 },
    { q: "Which hook is used for performance optimization?", options: ["useMemo", "useState", "useEffect", "useContext"], a: 0 },
    { q: "What is React Router?", options: ["Navigation library", "State management", "Styling solution", "Database tool"], a: 0 },
    { q: "What is the purpose of keys in lists?", options: ["Identify items", "Style elements", "Add events", "Create animations"], a: 0 },
    { q: "Which method is used to force re-render?", options: ["forceUpdate()", "render()", "update()", "refresh()"], a: 0 },
    { q: "What is a controlled component?", options: ["Component controlled by React state", "Automatic component", "Static component", "External component"], a: 0 },
    { q: "What is the difference between props and state?", options: ["Props are passed, state is internal", "State is passed, props are internal", "Both are the same", "Props are external, state is external"], a: 0 },
    { q: "What is React.createElement?", options: ["Create React elements", "Create HTML elements", "Create CSS styles", "Create events"], a: 0 },
    { q: "What is the purpose of useRef?", options: ["Access DOM elements", "Update state", "Handle events", "Create components"], a: 0 },
    { q: "What is a higher-order component?", options: ["Function that takes component and returns component", "Component with higher priority", "Component with more props", "Component with more state"], a: 0 },
    { q: "What is the purpose of useCallback?", options: ["Memoize functions", "Memoize values", "Handle events", "Update state"], a: 0 },
    { q: "What is React.StrictMode?", options: ["Tool for highlighting potential problems", "Security feature", "Performance optimizer", "Debugging tool"], a: 0 }
  ],
  "JavaScript": [
    { q: "Which is NOT a JavaScript datatype?", options: ["String", "Boolean", "Undefined", "Float"], a: 3 },
    { q: "What does 'typeof null' return?", options: ["null", "undefined", "object", "string"], a: 2 },
    { q: "What is closure in JavaScript?", options: ["Function with access to outer scope", "Function that closes", "Function that ends", "Function that starts"], a: 0 },
    { q: "What is hoisting?", options: ["Moving declarations to top", "Moving functions down", "Moving variables", "Moving objects"], a: 0 },
    { q: "What is the difference between == and ===?", options: ["== checks value, === checks value and type", "== checks type, === checks value", "Both are the same", "== is strict, === is loose"], a: 0 },
    { q: "What is an IIFE?", options: ["Immediately Invoked Function Expression", "Internal Function Implementation", "Inline Function Execution", "Instant Function Evaluation"], a: 0 },
    { q: "What is the purpose of 'this' keyword?", options: ["Refer to current object", "Refer to function", "Refer to variable", "Refer to array"], a: 0 },
    { q: "What is event bubbling?", options: ["Event propagates from child to parent", "Event propagates from parent to child", "Event stays in one place", "Event disappears"], a: 0 },
    { q: "What is the difference between let and const?", options: ["let can be reassigned, const cannot", "const can be reassigned, let cannot", "Both are the same", "let is global, const is local"], a: 0 },
    { q: "What is a promise?", options: ["Object representing future value", "Past value", "Current value", "Undefined value"], a: 0 },
    { q: "What is async/await?", options: ["Syntactic sugar for promises", "New data type", "New loop structure", "New conditional"], a: 0 },
    { q: "What is the spread operator?", options: ["Expand iterable elements", "Compress elements", "Delete elements", "Sort elements"], a: 0 },
    { q: "What is destructuring?", options: ["Extract values from objects/arrays", "Create objects", "Delete objects", "Modify objects"], a: 0 },
    { q: "What is a callback function?", options: ["Function passed as argument", "Function that calls back", "Function that returns", "Function that loops"], a: 0 },
    { q: "What is the purpose of 'bind' method?", options: ["Set 'this' value", "Create new function", "Delete function", "Modify function"], a: 0 },
    { q: "What is a prototype?", options: ["Object that other objects inherit from", "First version of object", "Template for object", "Copy of object"], a: 0 },
    { q: "What is the difference between map and forEach?", options: ["map returns new array, forEach doesn't", "forEach returns new array, map doesn't", "Both are the same", "map is faster"], a: 0 },
    { q: "What is a module in JavaScript?", options: ["Reusable piece of code", "Database connection", "CSS file", "HTML file"], a: 0 },
    { q: "What is the purpose of try-catch?", options: ["Handle errors", "Create errors", "Ignore errors", "Delete errors"], a: 0 },
    { q: "What is JSON?", options: ["JavaScript Object Notation", "Java Script Object Network", "JavaScript Online Notation", "JavaScript Object Navigation"], a: 0 }
  ],
  "Python": [
    { q: "Which keyword is used for a function?", options: ["func", "def", "lambda", "function"], a: 1 },
    { q: "What is a Python decorator?", options: ["Function that modifies another function", "Function that decorates", "Function that styles", "Function that formats"], a: 0 },
    { q: "What is the difference between list and tuple?", options: ["List is mutable, tuple is immutable", "Tuple is mutable, list is immutable", "Both are mutable", "Both are immutable"], a: 0 },
    { q: "What is __init__ method?", options: ["Constructor", "Destructor", "Iterator", "Generator"], a: 0 },
    { q: "What is a Python dictionary?", options: ["Key-value pairs", "List of values", "Set of keys", "Array of items"], a: 0 },
    { q: "What is list comprehension?", options: ["Concise way to create lists", "Long way to create lists", "Method to sort lists", "Method to delete lists"], a: 0 },
    { q: "What is the purpose of 'self' parameter?", options: ["Refer to instance of class", "Refer to class itself", "Refer to method", "Refer to variable"], a: 0 },
    { q: "What is a Python module?", options: ["File containing Python code", "Database connection", "CSS file", "HTML file"], a: 0 },
    { q: "What is the difference between append and extend?", options: ["append adds single item, extend adds multiple items", "extend adds single item, append adds multiple items", "Both are the same", "append is faster"], a: 0 },
    { q: "What is a generator in Python?", options: ["Function that yields values", "Function that returns values", "Function that creates values", "Function that deletes values"], a: 0 },
    { q: "What is the purpose of 'pass' statement?", options: ["Placeholder for future code", "Skip code", "End code", "Delete code"], a: 0 },
    { q: "What is a Python set?", options: ["Unordered collection of unique items", "Ordered collection", "Duplicate items", "Sorted items"], a: 0 },
    { q: "What is the difference between == and is?", options: ["== checks value, is checks identity", "is checks value, == checks identity", "Both are the same", "is is faster"], a: 0 },
    { q: "What is a lambda function?", options: ["Anonymous function", "Named function", "Class function", "Method function"], a: 0 },
    { q: "What is the purpose of 'global' keyword?", options: ["Modify global variable inside function", "Create global variable", "Delete global variable", "Access global variable"], a: 0 },
    { q: "What is a Python iterator?", options: ["Object that can be iterated", "Object that counts", "Object that sorts", "Object that filters"], a: 0 },
    { q: "What is the difference between shallow copy and deep copy?", options: ["Shallow copy references, deep copy duplicates", "Deep copy references, shallow copy duplicates", "Both are the same", "Shallow copy is faster"], a: 0 },
    { q: "What is a Python package?", options: ["Collection of modules", "Single module", "Database", "Library"], a: 0 },
    { q: "What is the purpose of 'finally' block?", options: ["Always executes code", "Executes on error", "Executes on success", "Executes never"], a: 0 },
    { q: "What is a Python virtual environment?", options: ["Isolated Python environment", "Global Python environment", "Database environment", "Web environment"], a: 0 }
  ]
};

export const getQuizQuestions = (subject) => {
  // Return questions for the subject, or generic questions if subject not found
  if (quizDatabase[subject]) {
    return quizDatabase[subject];
  }
  
  // Fallback generic questions for subjects not in the database
  return [
    { q: `What is the primary purpose of ${subject}?`, options: ["Web Development", "Data Analysis", "Mobile Development", "General Programming"], a: 3 },
    { q: `Which company originally created ${subject}?`, options: ["Google", "Microsoft", "Apple", "Open Source Community"], a: 3 },
    { q: `What type of applications is ${subject} best suited for?`, options: ["Frontend", "Backend", "Full Stack", "All of the above"], a: 3 },
    { q: `What is the learning curve for ${subject}?`, options: ["Easy", "Moderate", "Difficult", "Very Difficult"], a: 1 },
    { q: `Which paradigm does ${subject} primarily support?`, options: ["Object Oriented", "Functional", "Procedural", "All of the above"], a: 3 },
    { q: `What is the most popular framework for ${subject}?`, options: ["React", "Django", "Express", "Varies by use case"], a: 3 },
    { q: `Is ${subject} statically or dynamically typed?`, options: ["Statically", "Dynamically", "Both", "Neither"], a: 1 },
    { q: `What is the file extension for ${subject}?`, options: [".js", ".py", ".java", "Varies"], a: 3 },
    { q: `Which database works best with ${subject}?`, options: ["MySQL", "MongoDB", "PostgreSQL", "All of the above"], a: 3 },
    { q: `What is the current version of ${subject}?`, options: ["Version 1", "Version 2", "Version 3", "Latest stable version"], a: 3 },
    { q: `What operating systems support ${subject}?`, options: ["Windows only", "Mac only", "Linux only", "Cross platform"], a: 3 },
    { q: `What is the most popular IDE for ${subject}?`, options: ["VS Code", "PyCharm", "Eclipse", "Varies by developer"], a: 3 },
    { q: `What testing frameworks are available for ${subject}?`, options: ["Jest", "PyTest", "JUnit", "Multiple options available"], a: 3 },
    { q: `What deployment options exist for ${subject}?`, options: ["Cloud", "On-premise", "Hybrid", "All of the above"], a: 3 },
    { q: `What security considerations are important for ${subject}?`, options: ["Input validation", "Authentication", "Authorization", "All of the above"], a: 3 },
    { q: `What performance optimization techniques apply to ${subject}?`, options: ["Caching", "Minification", "Lazy loading", "All of the above"], a: 3 },
    { q: `What debugging tools are available for ${subject}?`, options: ["Browser dev tools", "IDE debugger", "Console logging", "All of the above"], a: 3 },
    { q: `What version control system works best with ${subject}?`, options: ["Git", "SVN", "Mercurial", "Git is most popular"], a: 3 },
    { q: `What documentation standards exist for ${subject}?`, options: ["JSDoc", "Docstrings", "Javadoc", "Varies by language"], a: 3 },
    { q: `What community resources are available for ${subject}?`, options: ["Stack Overflow", "GitHub", "Official docs", "All of the above"], a: 3 }
  ];
};
