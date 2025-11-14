// Ultra-Advanced AI Brain - ChatGPT-level intelligence with Ollama
export const smartAI = async (msg: string, context: any) => {
  const { currentStep, task, taskCode, course, activeLesson, currentTask, totalTasks, chatHistory } = context;
  const msgLower = msg.toLowerCase();
  const lang = getLang(course);
  
  // Sentiment analysis
  const sentiment = {
    frustrated: /stuck|frustrated|confused|don't get|hard|difficult|can't|help|please/i.test(msg),
    curious: /why|how come|interesting|wonder|curious|tell me more/i.test(msg),
    confident: /easy|got it|understand|know|learned/i.test(msg)
  };
  
  // Use Ollama for complex questions
  if (msg.length > 100 || /explain in detail|tell me everything|comprehensive|deep dive/i.test(msg)) {
    const ollamaResponse = await queryOllama(msg, context);
    if (ollamaResponse) return ollamaResponse;
  }

  // Multi-language greetings
  if (/^(hi|hello|hey|hola|bonjour|hallo|ciao|namaste|konnichiwa|greetings|good (morning|afternoon|evening|day))$/i.test(msg.trim())) {
    return `👋 Hello! I'm your AI coding assistant, created by Lister. I understand multiple languages and can help you with any programming question. What would you like to learn today?`;
  }

  // Identity & capabilities
  if (/what (are you|model|ai)|who are you|what's your name|tell me about yourself|your capabilities/i.test(msg)) {
    return `🤖 I'm an advanced language model created by Lister. I can:\n• Explain any programming concept\n• Debug and analyze code\n• Understand context from our conversation\n• Answer in multiple languages\n• Provide personalized learning guidance\n\nI'm here to make coding easy for you!`;
  }

  // Lesson context awareness
  if (/what('s| is) this lesson about|what (am i|will i) learn|lesson topic|current lesson/i.test(msg)) {
    const lessonNum = activeLesson || 1;
    const lessonName = lessonNum === 1 ? 'Introduction' : lessonNum === 2 ? 'Core Concepts' : 'Practice Project';
    const depth = lessonNum === 1 ? 'basics and fundamentals' : lessonNum === 2 ? 'intermediate concepts and practical applications' : 'advanced techniques and real-world projects';
    return `📚 **Lesson ${lessonNum}: ${lessonName}**\n\nYou're learning ${course} - specifically the ${depth}. This lesson will teach you:\n• Core syntax and structure\n• Best practices\n• Hands-on coding exercises\n\nProgress: Task ${currentTask}/${totalTasks}. ${sentiment.frustrated ? "Don't worry, you're doing great!" : "You're doing great!"}`;
  }

  // Contextual task guidance
  if (/what (am i|do i|should i) (supposed to |meant to )?do|what to do|what now|next step|where (do i|to) start/i.test(msg)) {
    if (currentStep === 2 && task) {
      const progress = `You're on task ${currentTask} of ${totalTasks}`;
      return `✍️ **Current Task:** ${task.instruction}\n\n${progress}. Type the code in the editor above. ${sentiment.frustrated ? "Don't worry, you've got this! " : ""}Need the answer? Just ask!`;
    }
    return `📖 Right now, you should read through the lesson content carefully. ${sentiment.frustrated ? "Take your time - learning takes patience! " : ""}When ready, click "Next Step" to practice coding.`;
  }

  // Intelligent how-to responses
  if (/how do i|how to|how can i|how should i/i.test(msg)) {
    if (currentStep === 2 && task) {
      const steps = analyzeCodeSteps(taskCode, getLang(course));
      return `💡 **Step-by-step guide:**\n\n${steps}\n\nFinal code: \`${taskCode}\`\n\n${sentiment.frustrated ? "You're almost there! Keep trying!" : "You can do this!"}`;
    }
    return `Follow the lesson flow: Read → Understand → Practice. ${sentiment.curious ? "Great question! " : ""}Click "Next Step" when you're ready to code.`;
  }

  // Smart hint system with progressive difficulty
  if (/hint|clue|tip|help|stuck|give me (a |the )?(hint|answer|solution)|show me|i need/i.test(msg)) {
    if (currentStep === 2 && task) {
      const hintLevel = chatHistory.filter((c: string) => /hint|help|stuck/.test(c)).length;
      if (hintLevel > 2 || /answer|solution|show me/.test(msg)) {
        return `💡 **Full Solution:**\n\n\`${taskCode}\`\n\n**Explanation:** ${explainCode(taskCode, getLang(course))}\n\nCopy this into the editor. ${sentiment.frustrated ? "Don't worry - everyone needs help sometimes!" : "Study it and try the next one yourself!"}`;
      }
      return `💡 **Hint ${hintLevel + 1}:** ${getSmartHint(taskCode, getLang(course), hintLevel)}\n\nStill stuck? Ask again for more help!`;
    }
    return `💡 **Tip:** ${sentiment.frustrated ? "Take a deep breath! " : ""}Focus on understanding each concept before moving forward. The practice section will test your knowledge.`;
  }

  // Check for concept questions in Deep concept explanations
  if (/variable/i.test(msg)) return concepts.variable(lang);
  if (/function/i.test(msg)) return concepts.function(lang);
  if (/loop/i.test(msg)) return concepts.loop(lang);
  if (/array|list/i.test(msg)) return concepts.array(lang);
  if (/object|dict/i.test(msg)) return concepts.object(lang);
  if (/class/i.test(msg)) return concepts.class(lang);
  if (/string/i.test(msg)) return concepts.string(lang);

  // Comparison questions
  if (/difference|compare|vs|versus|better|similar|same as/i.test(msg)) {
    if (/let.*const|const.*let/i.test(msg)) return `🔄 **let vs const:**\n• let: value can change\n• const: value is constant\n\n**Best practice:** Use const by default, let when you need to reassign.`;
    if (/==.*===|===.*==/i.test(msg)) return `⚖️ **== vs ===:**\n• ==: compares value (type coercion)\n• ===: compares value AND type\n\n**Example:** "5" == 5 (true), "5" === 5 (false)\n**Use ===** for safer comparisons!`;
    if (/for.*while|while.*for/i.test(msg)) return `🔄 **for vs while:**\n• for: known iterations\n• while: unknown iterations\n\n**for:** for(i=0; i<10; i++)\n**while:** while(condition)`;
    return `🤔 I can compare programming concepts! Ask me about: let vs const, == vs ===, for vs while, etc.`;
  }

  // Best practices
  if (/best practice|should i|recommended|proper way|correct way|standard/i.test(msg)) {
    return `✅ **Best Practices for ${lang}:**\n\n• Use meaningful variable names\n• Write comments for complex code\n• Keep functions small and focused\n• Follow consistent formatting\n• Test your code frequently\n\n${sentiment.curious ? "Following best practices makes you a better developer!" : ""}`;
  }

  // Error handling
  if (/error|wrong|broken|fail|not work|issue|problem|bug|fix|debug|doesn't work/i.test(msg)) {
    if (currentStep === 2 && task) {
      return `🔧 **Debugging help:**\n\nThe correct code is: \`${taskCode}\`\n\n**Common mistakes:**\n• Check spacing and punctuation\n• Verify quotes and brackets match\n• Ensure semicolons are included (if needed)\n\nCompare your code carefully!`;
    }
    return `🐛 **Debugging tips:**\n\n1. Read error messages carefully\n2. Check syntax (quotes, brackets, semicolons)\n3. Console.log() to see values\n4. Compare with working examples\n5. Take breaks and come back fresh!`;
  }

  // Explain/Understand questions
  if (/explain|understand|tell me about|describe|what does|how does/i.test(msgLower)) {
    return handleExplainQuestion(msg, lang, context);
  }
  
  // Why questions
  if (/^why|why is|why do|why does|why should/i.test(msgLower)) {
    return handleWhyQuestion(msg, lang, context);
  }
  
  // How questions
  if (/^how|how do|how to|how can|how should|how does/i.test(msgLower)) {
    return handleHowQuestion(msg, lang, context);
  }
  
  // What questions
  if (/^what|what is|what are|what does|what's/i.test(msgLower)) {
    return handleWhatQuestion(msg, lang, context);
  }
  
  // Can/Should questions
  if (/^can i|can you|should i|could i|would/i.test(msgLower)) {
    return handleCanShouldQuestion(msg, lang, context);
  }
  
  // When questions
  if (/^when|when do|when should|when to/i.test(msgLower)) {
    return handleWhenQuestion(msg, lang, context);
  }
  
  // Where questions
  if (/^where|where do|where can|where should/i.test(msgLower)) {
    return handleWhereQuestion(msg, lang, context);
  }
  
  // Code/Programming specific
  if (/code|program|syntax|write|create|build|make/i.test(msgLower)) {
    return handleCodeQuestion(msg, lang, context);
  }
  
  // Learning/Tutorial
  if (/learn|teach|tutorial|guide|course|study/i.test(msgLower)) {
    return handleLearningQuestion(msg, lang, context);
  }
  
  // Advanced reasoning for complex questions
  if (msg.length > 50) {
    return advancedReasoning(msg, lang, context);
  }
  
  // Try Ollama for unmatched questions
  const ollamaResponse = await queryOllama(msg, context);
  if (ollamaResponse) return ollamaResponse;
  
  // Generic response with context
  return `💬 **I understand you're asking about programming!**\n\n${sentiment.frustrated ? "Don't worry, I'm here to help! " : ""}Let me help you with that.\n\nYou can ask me:\n• "What is ${lang}?"\n• "How do I write a function?"\n• "Explain variables"\n• "Why use ${lang}?"\n\n${task ? `Or ask about your current task: ${taskCode}` : 'What would you like to know?'}`;
};

// Ollama integration for local LLM
const queryOllama = async (msg: string, context: any) => {
  const { task, taskCode, course, activeLesson } = context;
  
  const systemPrompt = `You are a friendly coding tutor created by Lister. You're helping a student learn ${course}. ${task ? `Current task: ${taskCode}` : `Current lesson: Lesson ${activeLesson}`}. Be encouraging, clear, and concise. Explain concepts simply.`;
  
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'somgiri61/Lister',
        prompt: `${systemPrompt}\n\nStudent question: ${msg}\n\nYour response:`,
        stream: false
      })
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return `🤖 ${data.response}`;
  } catch (error) {
    console.log('Ollama not available, using built-in AI');
    return null;
  }
};

// Advanced reasoning engine
const advancedReasoning = (msg: string, lang: string, context: any) => {
  const { task, taskCode } = context;
  
  // Multi-step reasoning
  if (/why.*work|how.*work|what happen/i.test(msg)) {
    if (task) {
      return `🧠 **Let me break this down:**\n\n1. **What it does:** ${taskCode} creates a ${lang} structure\n2. **How it works:** The syntax follows ${lang} rules\n3. **Why it matters:** This is fundamental to ${lang} programming\n4. **Real-world use:** Used in every ${lang} project\n\nThe code executes by: ${explainExecution(taskCode, lang)}`;
    }
    return `🧠 **Understanding how things work:**\n\nIn programming, everything follows logical steps:\n1. Code is written by developers\n2. Compiler/interpreter reads it\n3. Machine executes instructions\n4. Output is produced\n\nWhat specific concept would you like me to explain?`;
  }
  
  // Causal reasoning
  if (/because|reason|cause|result|effect/i.test(msg)) {
    return `🎯 **Cause and Effect in Programming:**\n\nEvery action has a consequence:\n• Writing code → Creates instructions\n• Running code → Produces output\n• Errors occur → Because of syntax/logic issues\n• Good practices → Lead to maintainable code\n\nIn your case: ${task ? `Writing \`${taskCode}\` will create the desired ${lang} element` : 'Understanding these relationships helps you debug faster'}`;
  }
  
  // Analogies and metaphors
  if (/like|similar|analogy|compare to|same as/i.test(msg)) {
    return getAnalogy(msg, lang);
  }
  
  // Problem-solving
  if (/solve|fix|solution|approach|strategy/i.test(msg)) {
    return `💡 **Problem-Solving Strategy:**\n\n1. **Understand:** What exactly is the problem?\n2. **Plan:** Break it into smaller steps\n3. **Execute:** Write code step by step\n4. **Test:** Verify it works\n5. **Refine:** Optimize and improve\n\n${task ? `For your current task: ${taskCode}\nJust type it exactly as shown!` : 'Apply this to any coding challenge!'}`;
  }
  
  // Meta-learning
  if (/learn|study|practice|improve|better/i.test(msg)) {
    return `📚 **Learning Strategy:**\n\n**Effective learning:**\n• Practice daily (even 15 minutes)\n• Build real projects\n• Read others' code\n• Debug your mistakes\n• Teach what you learn\n\n**Resources:**\n• MDN Web Docs (JavaScript/HTML/CSS)\n• Python.org documentation\n• FreeCodeCamp, Codecademy\n• Stack Overflow for questions\n• GitHub for code examples\n\nYou're already learning by doing - keep going!`;
  }
  
  return `🤔 **Deep Analysis:**\n\nYour question involves: ${extractConcepts(msg).join(', ')}\n\nLet me explain: ${generateExplanation(msg, lang)}\n\nNeed more details on any part?`;
};

const explainExecution = (code: string, lang: string) => {
  if (lang === 'HTML') return 'Browser parses the tag, creates DOM element, renders it on screen';
  if (lang === 'CSS') return 'Browser applies the style rule to matching elements, updates visual rendering';
  if (lang === 'JavaScript') return 'JS engine interprets the code, allocates memory, executes operations';
  if (lang === 'Python') return 'Python interpreter reads the code line by line, executes instructions';
  return 'The code is compiled/interpreted and executed by the runtime environment';
};

const getAnalogy = (msg: string, lang: string) => {
  const analogies: Record<string, string> = {
    variable: '📦 Variables are like labeled boxes. You put things in them (values) and can take them out or change them later. The label (variable name) helps you find the right box.',
    function: '🏭 Functions are like factories. You give them raw materials (parameters), they process them, and return a finished product (return value). Reusable and efficient!',
    loop: '🔄 Loops are like assembly lines. They repeat the same action multiple times automatically. Instead of writing code 100 times, write it once and loop 100 times!',
    array: '📚 Arrays are like bookshelves. Each book (element) has a position (index). You can add books, remove them, or access any book by its position.',
    object: '🗂️ Objects are like filing cabinets. Each drawer (property) has a label (key) and contains information (value). Organized and easy to access!',
    class: '🏗️ Classes are like blueprints. You design once, then build many houses (objects) from the same blueprint. Each house can have different colors (properties) but same structure.',
  };
  
  for (const [key, value] of Object.entries(analogies)) {
    if (msg.includes(key)) return value;
  }
  
  return `🎨 Think of ${lang} like building with LEGO blocks. Each piece (code element) has a specific purpose, and you combine them to create something amazing!`;
};

const extractConcepts = (msg: string) => {
  const concepts = [];
  if (/variable|var|let|const/i.test(msg)) concepts.push('variables');
  if (/function|method/i.test(msg)) concepts.push('functions');
  if (/loop|for|while/i.test(msg)) concepts.push('loops');
  if (/array|list/i.test(msg)) concepts.push('arrays');
  if (/object|dict/i.test(msg)) concepts.push('objects');
  if (/class/i.test(msg)) concepts.push('classes');
  if (/async|promise/i.test(msg)) concepts.push('asynchronous programming');
  return concepts.length > 0 ? concepts : ['programming fundamentals'];
};

const generateExplanation = (msg: string, lang: string) => {
  const words = msg.toLowerCase().split(' ');
  const keyTerms = words.filter(w => w.length > 4);
  
  if (keyTerms.length === 0) return `In ${lang}, every concept builds on previous knowledge. Start with basics and progress gradually.`;
  
  return `In ${lang}, ${keyTerms[0]} relates to core programming principles. It's used to ${keyTerms.includes('create') ? 'build' : keyTerms.includes('use') ? 'implement' : 'work with'} code structures effectively.`;
};

// Question handlers
const handleExplainQuestion = (msg: string, lang: string, context: any) => {
  const { task, taskCode } = context;
  
  // Check for specific concepts
  if (/variable/i.test(msg)) return concepts.variable(lang);
  if (/function/i.test(msg)) return concepts.function(lang);
  if (/loop/i.test(msg)) return concepts.loop(lang);
  if (/array|list/i.test(msg)) return concepts.array(lang);
  if (/object|dict/i.test(msg)) return concepts.object(lang);
  if (/class/i.test(msg)) return concepts.class(lang);
  if (/string/i.test(msg)) return concepts.string(lang);
  
  if (task) {
    return `📚 **Explanation:**\n\n${taskCode} is ${lang} code that creates a specific structure.\n\n**What it does:** ${explainCode(taskCode, lang)}\n\n**How to use it:** Type it exactly in the code editor above.\n\nNeed more details? Ask me!`;
  }
  
  return `📚 **About ${lang}:**\n\n${lang} is a programming language used for ${lang === 'HTML' ? 'structuring web pages' : lang === 'CSS' ? 'styling websites' : lang === 'JavaScript' ? 'adding interactivity' : lang === 'Python' ? 'general programming' : 'building applications'}.\n\n**Key features:**\n• ${lang === 'Python' ? 'Easy to read syntax' : 'Powerful and flexible'}\n• ${lang === 'JavaScript' ? 'Runs in browsers' : 'Wide community support'}\n• Great for beginners\n\nWhat specific part would you like explained?`;
};

const handleWhyQuestion = (msg: string, lang: string, context: any) => {
  if (/learn|use|important/i.test(msg)) {
    return `🎯 **Why learn ${lang}?**\n\n1. **High demand:** Companies need ${lang} developers\n2. **Versatile:** Build ${lang === 'JavaScript' ? 'websites, apps, servers' : lang === 'Python' ? 'web apps, AI, data science' : 'amazing projects'}\n3. **Great community:** Tons of resources and help\n4. **Career growth:** Good salaries and opportunities\n5. **Fun:** Create things you can see and use!\n\nYou're making a smart choice learning ${lang}!`;
  }
  
  if (/work|does/i.test(msg)) {
    return `🔧 **How ${lang} works:**\n\n1. You write code\n2. ${lang === 'JavaScript' || lang === 'Python' ? 'Interpreter' : 'Browser'} reads it\n3. Code gets executed\n4. Output is produced\n\n**Behind the scenes:** ${explainExecution('', lang)}\n\nIt's like giving instructions to a computer in a language it understands!`;
  }
  
  return `🤔 **Good question!**\n\nIn programming, "why" helps you understand the purpose. ${lang} exists to solve specific problems and make development easier.\n\nWhat specifically are you curious about?`;
};

const handleHowQuestion = (msg: string, lang: string, context: any) => {
  const { task, taskCode } = context;
  
  if (/start|begin/i.test(msg)) {
    return `🚀 **Getting started with ${lang}:**\n\n1. **Learn basics:** Syntax and core concepts\n2. **Practice:** Write code daily\n3. **Build projects:** Start small, grow bigger\n4. **Debug:** Learn from errors\n5. **Join community:** Ask questions, help others\n\n${task ? `Right now, practice by typing: ${taskCode}` : 'You\'re already on the right path!'}\n\nKeep going, you\'ve got this!`;
  }
  
  if (/write|code|create/i.test(msg)) {
    if (task) {
      return `✍️ **How to write this:**\n\n1. Look at the task: ${taskCode}\n2. Type it in the code editor\n3. Match spacing and punctuation\n4. Click "Next" to check\n\n**Step by step:** ${analyzeCodeSteps(taskCode, lang)}\n\nJust copy it exactly!`;
    }
    return `✍️ **How to write ${lang} code:**\n\n1. Understand the syntax rules\n2. Start with simple examples\n3. Type code in an editor\n4. Run and test it\n5. Fix errors and improve\n\n**Practice makes perfect!** Start with basics and build up.`;
  }
  
  if (/learn|improve|better/i.test(msg)) {
    return `📚 **How to learn ${lang} effectively:**\n\n• **Daily practice:** 30 minutes beats 3 hours once a week\n• **Build projects:** Learn by doing\n• **Read code:** Study examples from others\n• **Debug actively:** Errors teach you\n• **Teach others:** Best way to solidify knowledge\n\n**Resources:**\n• This platform (you're here!)\n• MDN, W3Schools, Python.org\n• FreeCodeCamp, Codecademy\n• YouTube tutorials\n\nYou're already learning - keep it up!`;
  }
  
  return `🛠️ **How to approach this:**\n\n${task ? `Your task is: ${taskCode}\n\nJust type it in the editor above!` : 'Break it into steps, tackle one at a time, and practice regularly.'}\n\nNeed specific guidance? Ask me!`;
};

const handleWhatQuestion = (msg: string, lang: string, context: any) => {
  const { task, taskCode } = context;
  
  if (/do|write|type|code/i.test(msg)) {
    if (task) {
      return `🎯 **What to do:**\n\nType this code: \`${taskCode}\`\n\n**Explanation:** ${explainCode(taskCode, lang)}\n\nJust copy it into the code editor and click "Next"!`;
    }
    return `💻 **What to code in ${lang}:**\n\nStart with fundamentals:\n• Variables (store data)\n• Functions (reusable code)\n• Loops (repeat actions)\n• Conditionals (make decisions)\n\nThen build projects to practice!`;
  }
  
  if (/is|are/i.test(msg)) {
    // Check for specific concepts
    if (/variable/i.test(msg)) return concepts.variable(lang);
    if (/function/i.test(msg)) return concepts.function(lang);
    if (/loop/i.test(msg)) return concepts.loop(lang);
    if (/array/i.test(msg)) return concepts.array(lang);
    if (/object/i.test(msg)) return concepts.object(lang);
    
    return `📖 **What is ${lang}?**\n\n${lang} is a ${lang === 'HTML' ? 'markup language for web structure' : lang === 'CSS' ? 'styling language for web design' : 'programming language'}.\n\n**Used for:** ${lang === 'JavaScript' ? 'Web interactivity, apps, servers' : lang === 'Python' ? 'Web dev, AI, data science, automation' : lang === 'HTML' ? 'Creating web page structure' : 'Building software'}\n\n**Why it's great:** Easy to learn, powerful, widely used!`;
  }
  
  return `🔍 **What you need to know:**\n\n${task ? `Current task: ${taskCode}\n\nType it in the editor!` : `${lang} basics: syntax, variables, functions, and practice!`}\n\nAsk me anything specific!`;
};

const handleCanShouldQuestion = (msg: string, lang: string, context: any) => {
  if (/help|explain|show/i.test(msg)) {
    return `✅ **Yes, I can help!**\n\nI can:\n• Explain any ${lang} concept\n• Show you code examples\n• Debug your code\n• Search the web for info\n• Guide you step-by-step\n\nWhat do you need help with?`;
  }
  
  if (/use|learn|start/i.test(msg)) {
    return `✅ **Absolutely!**\n\n${lang} is great for beginners. You should:\n• Start with basics\n• Practice daily\n• Build small projects\n• Don't fear errors\n• Ask questions (like you're doing!)\n\nYou're on the right track!`;
  }
  
  return `🤔 **Good question!**\n\nIn programming, you can do almost anything with practice. ${lang} is a powerful tool.\n\nWhat specifically would you like to do?`;
};

const handleWhenQuestion = (msg: string, lang: string, context: any) => {
  if (/use|apply/i.test(msg)) {
    return `⏰ **When to use ${lang}:**\n\n${lang === 'JavaScript' ? '• Building interactive websites\n• Creating web applications\n• Server-side with Node.js\n• Mobile apps with React Native' : lang === 'Python' ? '• Web development (Django, Flask)\n• Data science and AI\n• Automation scripts\n• Backend services' : lang === 'HTML' ? '• Every website needs HTML\n• Structuring content\n• Creating web pages' : '• Building applications\n• Solving problems\n• Creating software'}\n\n**Best for:** ${lang === 'Python' ? 'Beginners and experts alike!' : 'Web development projects!'}`;
  }
  
  return `📅 **Timing in programming:**\n\nStart learning now! The best time was yesterday, the second best is today.\n\nPractice regularly and you'll see progress quickly!`;
};

const handleWhereQuestion = (msg: string, lang: string, context: any) => {
  if (/learn|study|practice/i.test(msg)) {
    return `📍 **Where to learn ${lang}:**\n\n**Right here!** You're already learning.\n\n**Other resources:**\n• MDN Web Docs (JavaScript/HTML/CSS)\n• Python.org (Python)\n• FreeCodeCamp (all languages)\n• Codecademy (interactive)\n• YouTube (video tutorials)\n• Stack Overflow (Q&A)\n\nKeep practicing here and explore these when ready!`;
  }
  
  if (/use|run|write/i.test(msg)) {
    return `💻 **Where to write ${lang}:**\n\n• **Here:** In this lesson's code editor\n• **VS Code:** Popular code editor\n• **Browser console:** For JavaScript\n• **Online:** CodePen, JSFiddle, Repl.it\n• **Local:** Any text editor + browser\n\nYou're in the right place to start!`;
  }
  
  return `🌍 **Where ${lang} is used:**\n\nEverywhere! Websites, apps, servers, games, AI, automation.\n\n${lang} powers much of the modern digital world!`;
};

const handleCodeQuestion = (msg: string, lang: string, context: any) => {
  const { task, taskCode } = context;
  
  if (task) {
    return `💻 **Code for your task:**\n\n\`${taskCode}\`\n\n**What it does:** ${explainCode(taskCode, lang)}\n\n**How to use:** Type it in the editor above and click "Next"!\n\nNeed help understanding it? Just ask!`;
  }
  
  return `💻 **${lang} code basics:**\n\nEvery language has syntax rules. In ${lang}:\n${lang === 'JavaScript' ? '• Variables: let x = 5;\n• Functions: function name() {}\n• Loops: for(let i=0; i<10; i++)' : lang === 'Python' ? '• Variables: x = 5\n• Functions: def name():\n• Loops: for i in range(10):' : lang === 'HTML' ? '• Tags: <tag>content</tag>\n• Attributes: <tag attr="value">\n• Structure: nested elements' : '• Follow syntax rules\n• Practice regularly\n• Learn by doing'}\n\nStart simple and build up!`;
};

const handleLearningQuestion = (msg: string, lang: string, context: any) => {
  return `🎓 **Learning ${lang}:**\n\n**Your learning path:**\n1. ✅ You're here - great start!\n2. Master basics (variables, functions, loops)\n3. Build small projects\n4. Learn advanced concepts\n5. Create portfolio projects\n\n**Tips for success:**\n• Practice 30 min daily\n• Code along with tutorials\n• Debug your own errors\n• Join coding communities\n• Never stop learning\n\n**You're doing great!** Keep going!`;
};

const concepts: Record<string, any> = {
  variable: (lang: string) => `📦 **Variables** store data in programming.\n\n**${lang}:**\n${lang === 'JavaScript' ? 'let name = "John"; // changeable\nconst age = 25; // constant' : lang === 'Python' ? 'name = "John"\nage = 25' : 'Variables hold values'}\n\n**Why use them?** Reuse data, make code flexible, store user input.\n\n**Think of it like:** A labeled box that holds information!`,
  function: (lang: string) => `⚙️ **Functions** are reusable code blocks.\n\n**${lang}:**\n${lang === 'JavaScript' ? 'function greet(name) {\n  return "Hello " + name;\n}\ngreet("Alice"); // "Hello Alice"' : lang === 'Python' ? 'def greet(name):\n    return f"Hello {name}"\ngreet("Alice")' : 'Functions execute tasks'}\n\n**Benefits:** Reusability, organization, easier debugging.\n\n**Like a recipe:** Follow steps to get consistent results!`,
  loop: (lang: string) => `🔄 **Loops** repeat code automatically.\n\n**${lang}:**\n${lang === 'JavaScript' ? 'for (let i = 0; i < 5; i++) {\n  console.log(i); // 0,1,2,3,4\n}' : lang === 'Python' ? 'for i in range(5):\n    print(i) # 0,1,2,3,4' : 'Loops automate repetition'}\n\n**Use cases:** Process arrays, repeat actions, iterate data.\n\n**Like an assembly line:** Repeat the same task efficiently!`,
  array: (lang: string) => `📋 **${lang === 'Python' ? 'Lists' : 'Arrays'}** store multiple values.\n\n**${lang}:**\n${lang === 'JavaScript' ? 'const fruits = ["apple", "banana"];\nfruits[0]; // "apple"\nfruits.push("orange");' : lang === 'Python' ? 'fruits = ["apple", "banana"]\nfruits[0] # "apple"\nfruits.append("orange")' : 'Arrays hold collections'}\n\n**Methods:** add, remove, search, sort items.\n\n**Like a shopping list:** Multiple items in order!`,
  object: (lang: string) => `🗂️ **${lang === 'Python' ? 'Dictionaries' : 'Objects'}** store key-value pairs.\n\n**${lang}:**\n${lang === 'JavaScript' ? 'const user = {\n  name: "John",\n  age: 25\n};\nuser.name; // "John"' : lang === 'Python' ? 'user = {\n  "name": "John",\n  "age": 25\n}\nuser["name"]' : 'Objects organize data'}\n\n**Perfect for:** User data, configs, structured info.\n\n**Like a contact card:** Name, phone, email organized!`,
  class: (lang: string) => `🏗️ **Classes** are blueprints for objects.\n\n**${lang}:**\n${lang === 'JavaScript' ? 'class Person {\n  constructor(name) {\n    this.name = name;\n  }\n}' : lang === 'Python' ? 'class Person:\n  def __init__(self, name):\n    self.name = name' : 'Classes create objects'}\n\n**OOP concepts:** Inheritance, encapsulation, polymorphism.\n\n**Like a blueprint:** Design once, build many!`,
  string: (lang: string) => `📝 **Strings** are text data.\n\n**${lang}:**\n${lang === 'JavaScript' ? 'let text = "Hello";\ntext.length; // 5\ntext.toUpperCase(); // "HELLO"' : lang === 'Python' ? 'text = "Hello"\nlen(text) # 5\ntext.upper() # "HELLO"' : 'Strings hold text'}\n\n**Operations:** concatenate, slice, search, replace.\n\n**Like a sentence:** Made up of characters!`
}

export const getLang = (course: string) => {
  if (course.includes('html')) return 'HTML';
  if (course.includes('css')) return 'CSS';
  if (course.includes('javascript') || course.includes('js')) return 'JavaScript';
  if (course.includes('python')) return 'Python';
  if (course.includes('react') || course.includes('mobile')) return 'React';
  return 'JavaScript';
};

const analyzeCodeSteps = (code: string, lang: string) => {
  if (lang === 'HTML') return '1. Start with opening tag\n2. Add content (if any)\n3. Close with closing tag\n4. Check spacing and spelling';
  if (lang === 'CSS') return '1. Write property name\n2. Add colon (:)\n3. Write value\n4. End with semicolon (;)';
  if (lang === 'JavaScript' || lang === 'Python') return '1. Use correct keyword\n2. Add variable/function name\n3. Use proper syntax (=, (), {})\n4. End statement correctly';
  return '1. Read the task\n2. Type code exactly\n3. Check syntax\n4. Click Next';
};

const explainCode = (code: string, lang: string) => {
  if (code.includes('<') && code.includes('>')) {
    const tag = code.match(/<(\w+)/)?.[1];
    return `This creates a ${tag} element in HTML. The <${tag}> tag ${tag === 'h1' ? 'displays a heading' : tag === 'p' ? 'creates a paragraph' : tag === 'div' ? 'creates a container' : 'defines an element'}.`;
  }
  if (code.includes(':') && code.includes(';')) {
    const prop = code.match(/([\w-]+):/)?.[1];
    return `This CSS rule sets the ${prop} property. It controls ${prop?.includes('color') ? 'the color' : prop?.includes('margin') ? 'spacing outside' : prop?.includes('padding') ? 'spacing inside' : 'the styling'} of elements.`;
  }
  if (code.includes('let') || code.includes('const')) return 'This declares a variable to store data. Variables let you save and reuse values in your program.';
  if (code.includes('function') || code.includes('def')) return 'This defines a function - a reusable block of code that performs a specific task.';
  return 'This code performs a specific programming operation. Study the syntax and try to understand each part.';
};

const getSmartHint = (code: string, lang: string, level: number) => {
  if (level === 0) return `Start by identifying the ${lang === 'HTML' ? 'tag name' : lang === 'CSS' ? 'property' : 'keyword'}. What does the task ask for?`;
  if (level === 1) return `The code begins with: \`${code.substring(0, Math.min(15, code.length))}...\` - can you complete it?`;
  return `Almost there! The answer is: \`${code}\``;
};
