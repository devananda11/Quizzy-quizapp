export const quizzes = [
  {
    id: "quiz1",
    title: "Computer Science Quiz",
    questions: [
      {
        question: "What does CPU stand for?",
        answers: [
          { text: "Central Process Unit", correct: false },
          { text: "Central Processing Unit", correct: true },
          { text: "Computer Personal Unit", correct: false },
          { text: "Central Processor Unit", correct: false },
        ]
      },
      {
        question: "Which programming language is known as the language of the web?",
        answers: [
          { text: "Python", correct: false },
          { text: "C++", correct: false },
          { text: "JavaScript", correct: true },
          { text: "Java", correct: false },
        ]
      },
      {
        question: "What does HTTP stand for?",
        answers: [
          { text: "HyperText Transfer Protocol", correct: true },
          { text: "HighText Transfer Protocol", correct: false },
          { text: "HyperText Transmission Protocol", correct: false },
          { text: "HighText Transmission Protocol", correct: false },
        ]
      },
      {
        question: "Which company developed the Java programming language?",
        answers: [
          { text: "Microsoft", correct: false },
          { text: "Google", correct: false },
          { text: "Sun Microsystems", correct: true },
          { text: "Apple", correct: false },
        ]
      },
      {
        question: "What does GUI stand for in computing?",
        answers: [
          { text: "General User Interaction", correct: false },
          { text: "Graphical User Interface", correct: true },
          { text: "General Utility Interface", correct: false },
          { text: "Graphical Utility Interface", correct: false },
        ]
      }
    ]
  },
  {
    id: "quiz2",
    title: "Python Programming Quiz",
    questions: [
      {
        question: "What is the output of print(2 ** 3)?",
        answers: [
          { text: "6", correct: false },
          { text: "8", correct: true },
          { text: "9", correct: false },
          { text: "12", correct: false },
        ]
      },
      {
        question: "Which of the following is a mutable data type in Python?",
        answers: [
          { text: "Tuple", correct: false },
          { text: "List", correct: true },
          { text: "String", correct: false },
          { text: "Integer", correct: false },
        ]
      },
      {
        question: "What does the 'len' function do?",
        answers: [
          { text: "Returns the length of a list", correct: false },
          { text: "Returns the length of a string", correct: false },
          { text: "Returns the length of an object", correct: true },
          { text: "Returns the length of a dictionary", correct: false },
        ]
      },
      {
        question: "How do you start a function in Python?",
        answers: [
          { text: "function myFunction():", correct: false },
          { text: "def myFunction():", correct: true },
          { text: "start myFunction():", correct: false },
          { text: "define myFunction():", correct: false },
        ]
      },
      {
        question: "Which keyword is used to create a class in Python?",
        answers: [
          { text: "function", correct: false },
          { text: "class", correct: true },
          { text: "def", correct: false },
          { text: "method", correct: false },
        ]
      }
    ]
  },
  {
    id: "quiz3",
    title: "Data Structures Quiz",
    questions: [
      {
        question: "Which data structure uses LIFO (Last In First Out) order?",
        answers: [
          { text: "Queue", correct: false },
          { text: "Stack", correct: true },
          { text: "Array", correct: false },
          { text: "Linked List", correct: false },
        ]
      },
      {
        question: "What is the time complexity of accessing an element in an array?",
        answers: [
          { text: "O(1)", correct: true },
          { text: "O(n)", correct: false },
          { text: "O(log n)", correct: false },
          { text: "O(n^2)", correct: false },
        ]
      },
      {
        question: "Which data structure is used to implement recursion?",
        answers: [
          { text: "Queue", correct: false },
          { text: "Stack", correct: true },
          { text: "Hash Table", correct: false },
          { text: "Binary Tree", correct: false },
        ]
      },
      {
        question: "What is a key feature of a linked list?",
        answers: [
          { text: "Fixed size", correct: false },
          { text: "Dynamic size", correct: true },
          { text: "Hashing", correct: false },
          { text: "Direct access", correct: false },
        ]
      },
      {
        question: "What type of tree is used to implement binary search?",
        answers: [
          { text: "Binary Tree", correct: false },
          { text: "Binary Search Tree", correct: true },
          { text: "AVL Tree", correct: false },
          { text: "Red-Black Tree", correct: false },
        ]
      }
    ]
  }
];
