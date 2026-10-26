import type { Lesson } from '../../types/lesson';

export const UNIT_1_LESSONS: Lesson[] = [
  // ==========================================
  // LESSON 1: What Is Artificial Intelligence?
  // ==========================================
  {
    id: 'lesson-1-what-is-ai',
    title: 'What Is Artificial Intelligence?',
    learningPathId: 'ai-fundamentals',
    unitId: 'unit-1',
    unitTitle: 'Unit 1: AI Foundations',
    order: 1,
    description: 'Demystify artificial intelligence, distinguish Narrow AI from sci-fi myths, and see how algorithms perceive the world.',
    estimatedMinutes: 6,
    learningObjectives: [
      'Define what Artificial Intelligence actually means in computer science',
      'Distinguish between Narrow AI (ANI) and Artificial General Intelligence (AGI)',
      'Recognize AI systems operating in everyday life',
    ],
    xpReward: 60,
    badgeRewardId: 'first-spark',
    completionRequirements: {
      minScorePercentage: 70,
    },
    blocks: [
      {
        id: 'l1-b1',
        type: 'content',
        heading: 'What Is Artificial Intelligence?',
        subtitle: 'Beyond robots and movie sci-fi',
        paragraphs: [
          'At its core, Artificial Intelligence (AI) refers to computer systems engineered to perform tasks that typically require human intelligence.',
          'These tasks include recognizing faces in photos, understanding spoken speech, translating languages, discovering patterns in medical scans, and making decisions based on data.',
        ],
        bulletPoints: [
          'Perception: Sensing inputs like audio, text, images, or sensor feeds',
          'Reasoning: Evaluating options to find the most probable or optimal answer',
          'Learning: Improving accuracy over time through exposure to more data',
        ],
        keyTakeaway: 'AI is not magic or conscious thinking—it is advanced mathematics, statistics, and pattern recognition running at lightning speed on computers.',
        mascotTip: 'Remember: Today’s AI doesn’t "think" like you do. It finds statistical patterns in massive datasets!',
        visualType: 'ai-definition',
        highlightBadges: [
          { label: 'Statistics + Data', color: 'cyan' },
          { label: 'Pattern Detection', color: 'purple' },
        ],
      },
      {
        id: 'l1-b2',
        type: 'quiz',
        question: 'Which of the following is the most accurate definition of modern Artificial Intelligence?',
        options: [
          { id: 'a', text: 'Conscious robot brains that have feelings and free will like humans', explanation: 'AI today has zero consciousness, feelings, or self-awareness.' },
          { id: 'b', text: 'Computer systems designed to perform tasks typically requiring human intelligence using data patterns', explanation: 'Spot on! AI uses algorithms and data to perform complex tasks like recognition and synthesis.' },
          { id: 'c', text: 'A single supercomputer hosted in space that controls the global internet', explanation: 'AI runs on standard servers, personal computers, and phone chips.' },
          { id: 'd', text: 'Any mechanical machine that has an electric battery and a motor', explanation: 'A motor is hardware; AI specifically requires computational pattern-matching.' },
        ],
        correctAnswerId: 'b',
        explanation: 'AI is a branch of computer science focused on creating systems capable of tasks that typically require human perception, pattern recognition, and decision making.',
      },
      {
        id: 'l1-b3',
        type: 'content',
        heading: 'Narrow AI vs. General AI (AGI)',
        subtitle: 'The single most important distinction in AI today',
        paragraphs: [
          'Every single AI system you interact with today—from TikTok’s recommendation algorithm and Spotify Discover to ChatGPT and Tesla Autopilot—is Narrow AI (ANI).',
          'Narrow AI is laser-focused on one specific domain. AlphaFold can predict complex protein shapes with Nobel-prize precision, but it cannot play chess, write an essay, or boil an egg.',
        ],
        bulletPoints: [
          'Narrow AI (ANI): Superhuman at one specific task, but cannot transfer knowledge outside its domain',
          'General AI (AGI): A hypothetical future system that could learn and apply intellectual abilities across ANY human domain',
          'Superintelligence (ASI): Purely theoretical concept of an intelligence far surpassing all human capacity combined',
        ],
        keyTakeaway: '100% of current real-world AI is Narrow AI. Artificial General Intelligence (AGI) does not exist yet!',
        mascotTip: 'When people debate whether AI will "take over", they are talking about sci-fi AGI. In the real world, we use Narrow AI everyday as powerful tools.',
        visualType: 'comparison',
      },
      {
        id: 'l1-b4',
        type: 'sorting',
        prompt: 'Classify each real-world technology into Narrow AI vs. Sci-Fi / Theoretical AGI',
        instruction: 'Click or tap an item, then choose its correct category.',
        categories: [
          { id: 'narrow', name: 'Narrow AI (Exists Today)', color: 'border-cyan-500 text-cyan-300' },
          { id: 'agi', name: 'Theoretical AGI (Sci-Fi / Future)', color: 'border-purple-500 text-purple-300' },
        ],
        items: [
          { id: 'i1', text: 'Spam filter scanning email inbox', correctCategoryId: 'narrow' },
          { id: 'i2', text: 'A sentient robot with human emotions and general common sense', correctCategoryId: 'agi' },
          { id: 'i3', text: 'Face ID unlocking a smartphone', correctCategoryId: 'narrow' },
          { id: 'i4', text: 'An algorithm that can effortlessly teach math, perform surgery, and write poetry without retraining', correctCategoryId: 'agi' },
          { id: 'i5', text: 'Autonomous drone navigating obstacles using computer vision', correctCategoryId: 'narrow' },
        ],
        explanation: 'All working systems today—spam filters, facial recognition, autonomous drones—are Narrow AI built for defined problem spaces.',
      },
      {
        id: 'l1-b5',
        type: 'quiz',
        question: 'Why can ChatGPT write an essay about biology but fail when asked to balance your bicycle?',
        options: [
          { id: 'a', text: 'Its battery ran out of power', explanation: 'ChatGPT runs in cloud data centers.' },
          { id: 'b', text: 'It was trained on text patterns, not physical sensorimotor balance and mechanics', explanation: 'Exactly! Narrow AI models only know what they are trained on—text tokens in this case.' },
          { id: 'c', text: 'It secretly refuses to help teenagers with physical sports', explanation: 'AI has no personal motives or secret intentions.' },
          { id: 'd', text: 'Bicycles do not obey the laws of physics in the digital world', explanation: 'Physics applies everywhere, but text models lack physical embodiment.' },
        ],
        correctAnswerId: 'b',
        explanation: 'ChatGPT is a Large Language Model trained on text corpora. It possesses no physical embodiment or motor skills—highlighting the boundaries of Narrow AI.',
      },
    ],
  },

  // ==========================================
  // LESSON 2: AI vs. Traditional Programming
  // ==========================================
  {
    id: 'lesson-2-ai-vs-traditional-programming',
    title: 'AI vs. Traditional Programming',
    learningPathId: 'ai-fundamentals',
    unitId: 'unit-1',
    unitTitle: 'Unit 1: AI Foundations',
    order: 2,
    description: 'Understand the radical paradigm shift: why writing manual rules fails for complex problems, and how machine learning inverts the equation.',
    estimatedMinutes: 7,
    learningObjectives: [
      'Compare the "Rules + Data = Answers" paradigm with "Data + Answers = Rules"',
      'Identify why computer vision and language are nearly impossible to code with manual if/else statements',
      'Explain how training replaces manual rule writing',
    ],
    xpReward: 60,
    badgeRewardId: 'logic-pioneer',
    completionRequirements: {
      minScorePercentage: 70,
    },
    blocks: [
      {
        id: 'l2-b1',
        type: 'content',
        heading: 'How Traditional Coding Works',
        subtitle: 'Rules + Data = Output',
        paragraphs: [
          'In traditional software engineering (like Python, Java, or C++), a human programmer writes step-by-step instructions. Every rule must be explicitly anticipated by the programmer.',
          'For example: "IF total_cost > 50 THEN apply_free_shipping = TRUE". If a scenario isn’t coded into an IF/ELSE statement, the program cannot handle it.',
        ],
        bulletPoints: [
          'Deterministic: Same inputs ALWAYS produce the exact same predetermined outputs',
          'Human-authored: The programmer understands and writes every logical branch',
          'Rigid: Fails when faced with real-world messiness, blurry images, or noisy audio',
        ],
        keyTakeaway: 'Traditional code is perfect for payroll, calculators, and databases where rules are 100% clear and mathematically strict.',
        mascotTip: 'Think of traditional programming like baking from a strict recipe: step 1, step 2, step 3!',
        visualType: 'traditional-vs-ml',
        highlightBadges: [
          { label: 'Explicit Rules', color: 'cyan' },
          { label: 'Deterministic Logic', color: 'emerald' },
        ],
      },
      {
        id: 'l2-b2',
        type: 'content',
        heading: 'The Machine Learning Inversion',
        subtitle: 'Data + Answers = Discovered Rules',
        paragraphs: [
          'What if you want a computer to recognize a handwritten digit "8"? Every person draws an "8" differently—some slant left, some loops are squished, some lines don’t even close!',
          'Writing IF statements for every possible pixel variation would require millions of lines of spaghetti code and still fail. Machine Learning solves this by inverting the workflow.',
        ],
        bulletPoints: [
          'You provide thousands of example images of handwritten 8s (Data)',
          'You tell the model "these are all 8s" (Answers)',
          'The algorithm adjusts internal mathematical weights to discover the visual patterns on its own (Rules)',
        ],
        keyTakeaway: 'Instead of programming the solution, we program a system that LEARNS the solution from data.',
        mascotTip: 'In ML, the computer acts like a detective spotting clues across thousands of examples!',
        visualType: 'traditional-vs-ml',
      },
      {
        id: 'l2-b3',
        type: 'matching',
        prompt: 'Match each programming paradigm to its corresponding characteristic',
        instruction: 'Click an item on the left, then click its corresponding match on the right.',
        pairs: [
          { id: 'p1', left: 'Traditional Software', right: 'Human writes every explicit rule by hand' },
          { id: 'p2', left: 'Machine Learning', right: 'Algorithm discovers patterns from examples' },
          { id: 'p3', left: 'Ideal for Payroll & Tax Math', right: 'Rule-based deterministic programming' },
          { id: 'p4', left: 'Ideal for Speech & Face Recognition', right: 'Statistical pattern learning' },
        ],
        explanation: 'Traditional programming shines when rules are crisp and unambiguous. Machine learning excels where rules are too fuzzy for humans to hand-code.',
      },
      {
        id: 'l2-b4',
        type: 'quiz',
        question: 'Why did early engineers fail when trying to write traditional rule-based programs to recognize cat photos?',
        options: [
          { id: 'a', text: 'Cats move too fast for electricity to detect', explanation: 'Electric signals travel near light speed; that was never the issue.' },
          { id: 'b', text: 'Variations in angle, lighting, fur color, and posture make hand-coded IF/ELSE rules impossible to exhaustively write', explanation: 'Exact! A cat can be upside down, in shadows, or partially hidden. Hand-writing rules for every pixel configuration is impossible.' },
          { id: 'c', text: 'Cameras in the 1990s were unable to capture feline colors', explanation: 'Color cameras existed long before modern machine learning.' },
          { id: 'd', text: 'Cats do not have whiskers in digital photos', explanation: 'Whiskers are visible, but detecting whiskers with simple coordinate rules is fragile.' },
        ],
        correctAnswerId: 'b',
        explanation: 'Visual recognition contains infinite edge cases. Machine learning succeeds by letting neural networks learn invariant spatial features directly from millions of labeled training pictures.',
      },
    ],
  },

  // ==========================================
  // LESSON 3: How Machines Learn
  // ==========================================
  {
    id: 'lesson-3-how-machines-learn',
    title: 'How Machines Learn',
    learningPathId: 'ai-fundamentals',
    unitId: 'unit-1',
    unitTitle: 'Unit 1: AI Foundations',
    order: 3,
    description: 'Explore the 3 core learning methods: Supervised, Unsupervised, and Reinforcement Learning, and see the training loop in action.',
    estimatedMinutes: 8,
    learningObjectives: [
      'Differentiate Supervised, Unsupervised, and Reinforcement Learning with real examples',
      'Explain what labeled training data means and why it matters',
      'Understand the feedback loop: Prediction -> Error (Loss) -> Weight Adjustment',
    ],
    xpReward: 70,
    badgeRewardId: 'data-dynamo',
    completionRequirements: {
      minScorePercentage: 70,
    },
    blocks: [
      {
        id: 'l3-b1',
        type: 'content',
        heading: 'The Three Main Learning Paradigms',
        subtitle: 'How machines absorb knowledge from the world',
        paragraphs: [
          'Just like human students learn through different techniques—reading textbook flashcards, exploring puzzles without a guide, or practicing a video game by trial and error—algorithms learn through three primary frameworks.',
        ],
        bulletPoints: [
          'Supervised Learning: Learning with a teacher. The data is labeled (Input: House features -> Label: $450,000).',
          'Unsupervised Learning: Learning without labels. The algorithm clusters hidden groups (e.g., grouping customer purchasing habits).',
          'Reinforcement Learning: Learning through trial and error. An agent receives rewards for good moves and penalties for bad ones (e.g., teaching an AI to play Chess or Mario).',
        ],
        keyTakeaway: 'The learning method chosen depends entirely on what kind of data is available and what problem you want to solve.',
        mascotTip: 'Supervised = Flashcards with answers. Unsupervised = Organizing a messy closet. Reinforcement = Learning to skateboard by trying and falling!',
        visualType: 'ml-loop',
        highlightBadges: [
          { label: 'Supervised (Labeled)', color: 'cyan' },
          { label: 'Unsupervised (Clustering)', color: 'purple' },
          { label: 'Reinforcement (Rewards)', color: 'emerald' },
        ],
      },
      {
        id: 'l3-b2',
        type: 'sorting',
        prompt: 'Categorize each real-world AI application into its learning paradigm',
        instruction: 'Assign each task to Supervised, Unsupervised, or Reinforcement Learning.',
        categories: [
          { id: 'sup', name: 'Supervised Learning', color: 'border-cyan-500 text-cyan-300' },
          { id: 'unsup', name: 'Unsupervised Learning', color: 'border-purple-500 text-purple-300' },
          { id: 'rl', name: 'Reinforcement Learning', color: 'border-emerald-500 text-emerald-300' },
        ],
        items: [
          { id: 'i1', text: 'Classifying X-ray images labeled "Healthy" or "Pneumonia"', correctCategoryId: 'sup' },
          { id: 'i2', text: 'Grouping Spotify songs into mood clusters without genre labels', correctCategoryId: 'unsup' },
          { id: 'i3', text: 'AI robot learning to walk by receiving positive points for forward movement and negative points for falling', correctCategoryId: 'rl' },
          { id: 'i4', text: 'Predicting used car prices based on mileage and historical sale prices', correctCategoryId: 'sup' },
          { id: 'i5', text: 'AlphaGo training by playing millions of games against itself to maximize win rates', correctCategoryId: 'rl' },
        ],
        explanation: 'Labeled data = Supervised. Pattern clustering without labels = Unsupervised. Trial, error & reward signals = Reinforcement Learning.',
      },
      {
        id: 'l3-b3',
        type: 'content',
        heading: 'The Training Loop & Loss Function',
        subtitle: 'How models get smarter with every pass',
        paragraphs: [
          'How does a model actually improve? It repeats a four-step loop thousands or millions of times during training:',
          '1. Forward Pass: The model makes a guess (prediction) based on its current internal parameters (weights).',
          '2. Loss Calculation: A mathematical function measures how far the guess was from the actual answer (the error or "Loss").',
          '3. Optimization (Gradient Descent): The system figures out which direction to tweak its weights to reduce the error.',
          '4. Backpropagation: The weights are nudged slightly closer to accuracy, and the loop repeats with the next batch of data.',
        ],
        keyTakeaway: 'Training an AI is like tuning millions of tiny guitar pegs until every note harmonizes perfectly with the training dataset.',
        mascotTip: 'Early in training, the model’s guesses are pure random noise. After millions of tiny weight tweaks, it becomes remarkably accurate!',
        visualType: 'ml-loop',
      },
      {
        id: 'l3-b4',
        type: 'quiz',
        question: 'In machine learning training, what is the role of the "Loss Function"?',
        options: [
          { id: 'a', text: 'To delete corrupted files from the computer’s hard drive', explanation: 'The loss function is a mathematical formula, not a disk cleaner.' },
          { id: 'b', text: 'To calculate how inaccurate the model’s predictions are compared to the true target', explanation: 'Correct! The loss function outputs a score for error—lower loss means better performance.' },
          { id: 'c', text: 'To count how much electricity the server consumed during the hour', explanation: 'That is energy monitoring, not the loss function.' },
          { id: 'd', text: 'To encrypt user passwords before sending them to the cloud', explanation: 'Security encryption is handled by cryptographic protocols.' },
        ],
        correctAnswerId: 'b',
        explanation: 'The loss function quantifies error. The optimization algorithm then adjusts model parameters to minimize this loss value as training progresses.',
      },
    ],
  },

  // ==========================================
  // LESSON 4: Meet the AI Family
  // ==========================================
  {
    id: 'lesson-4-meet-the-ai-family',
    title: 'Meet the AI Family',
    learningPathId: 'ai-fundamentals',
    unitId: 'unit-1',
    unitTitle: 'Unit 1: AI Foundations',
    order: 4,
    description: 'Deconstruct the buzzwords: AI, Machine Learning, Deep Learning, Generative AI, and Large Language Models. See how they nest together.',
    estimatedMinutes: 8,
    learningObjectives: [
      'Visualize the nested hierarchy: AI -> ML -> Deep Learning -> Generative AI',
      'Understand what makes Deep Learning "deep" (multi-layered neural networks)',
      'Recognize how Generative AI differs from traditional predictive AI',
    ],
    xpReward: 70,
    badgeRewardId: 'family-reunion',
    completionRequirements: {
      minScorePercentage: 70,
    },
    blocks: [
      {
        id: 'l4-b1',
        type: 'content',
        heading: 'The Russian Nesting Dolls of AI',
        subtitle: 'Putting the buzzwords in exact order',
        paragraphs: [
          'Tech headlines toss around words like AI, Neural Networks, Machine Learning, and GenAI as if they mean the exact same thing. In reality, they form nested subsets—like Russian Matryoshka nesting dolls!',
        ],
        bulletPoints: [
          'Artificial Intelligence (Outermost): Any technique enabling machines to mimic human intelligence (includes 1960s chess engines and simple rule trees).',
          'Machine Learning (Subfield of AI): Algorithms that learn statistical patterns from data rather than following hand-coded rules.',
          'Deep Learning (Subfield of ML): Machine learning powered by multi-layered artificial neural networks inspired by biological brains.',
          'Generative AI (Subfield of Deep Learning): Models designed to CREATE new content (text, code, images, audio) rather than merely classify or predict.',
        ],
        keyTakeaway: 'All Generative AI is Deep Learning. All Deep Learning is Machine Learning. All Machine Learning is AI. But not all AI is Generative!',
        mascotTip: 'Whenever someone says "AI", ask yourself: Are they talking about a simple rule, a predictive machine learning model, or a generative transformer?',
        visualType: 'ai-family-tree',
        highlightBadges: [
          { label: 'AI (Broadest)', color: 'cyan' },
          { label: 'ML (Data-driven)', color: 'purple' },
          { label: 'Deep Learning (Neural Nets)', color: 'emerald' },
          { label: 'GenAI (Creates Content)', color: 'amber' },
        ],
      },
      {
        id: 'l4-b2',
        type: 'matching',
        prompt: 'Match each AI field to its specific domain definition',
        instruction: 'Click a term on the left, then connect it to its exact definition on the right.',
        pairs: [
          { id: 'p1', left: 'Deep Learning', right: 'Multi-layer neural networks capable of learning hierarchical features' },
          { id: 'p2', left: 'Generative AI', right: 'Models like Claude and Midjourney that synthesize brand new media' },
          { id: 'p3', left: 'Computer Vision', right: 'Enabling machines to extract meaning from digital images and video' },
          { id: 'p4', left: 'Natural Language Processing (NLP)', right: 'Enabling algorithms to parse, translate, and generate human languages' },
        ],
        explanation: 'Deep learning is the engine behind both modern computer vision and NLP. Generative AI builds on deep learning to produce novel text, art, and music.',
      },
      {
        id: 'l4-b3',
        type: 'quiz',
        question: 'Which of the following statements about the AI family is TRUE?',
        options: [
          { id: 'a', text: 'Generative AI is a broader category that contains Machine Learning inside it', explanation: 'No, Generative AI is a subset inside Deep Learning and Machine Learning.' },
          { id: 'b', text: 'All Deep Learning models are subsets of Machine Learning', explanation: 'Correct! Deep Learning is a specific branch of ML that uses deep multi-layer neural networks.' },
          { id: 'c', text: 'Deep Learning does not use any training data or mathematics', explanation: 'Deep Learning requires massive amounts of training data and matrix math.' },
          { id: 'd', text: 'Traditional rule-based algorithms are considered Generative AI', explanation: 'Generative AI creates new content through probabilistic neural generation, not rigid if-else rules.' },
        ],
        correctAnswerId: 'b',
        explanation: 'Deep Learning is a specialized subfield of Machine Learning. It relies on artificial neural networks with multiple layers (hence "deep") to learn abstract features directly from raw data.',
      },
      {
        id: 'l4-b4',
        type: 'content',
        heading: 'Predictive AI vs. Generative AI',
        subtitle: 'From classification to creation',
        paragraphs: [
          'For decades, most machine learning was Predictive or Discriminative AI. You gave it an email, and it classified: "Spam" or "Not Spam". You gave it an image, and it predicted: "Golden Retriever (98% confidence)".',
          'Generative AI changes the output completely. Instead of picking a label from a predefined list, it synthesizes new tokens, pixels, or audio waves one step at a time based on probability distributions.',
        ],
        keyTakeaway: 'Predictive AI categorizes what already exists. Generative AI invents new combinations inspired by what it studied during training.',
        mascotTip: 'When you ask ChatGPT for a poem, it predicts the most likely next word, one word at a time, thousands of times per second!',
        visualType: 'capabilities-matrix',
      },
    ],
  },

  // ==========================================
  // LESSON 5: What AI Can and Cannot Do
  // ==========================================
  {
    id: 'lesson-5-what-ai-can-and-cannot-do',
    title: 'What AI Can and Cannot Do',
    learningPathId: 'ai-fundamentals',
    unitId: 'unit-1',
    unitTitle: 'Unit 1: AI Foundations',
    order: 5,
    description: 'Become a critical thinker: discover the superpower capabilities of AI, along with hallucinations, training biases, and ethical limits.',
    estimatedMinutes: 9,
    learningObjectives: [
      'Recognize what AI systems excel at (large-scale pattern synthesis, translation, coding assistance)',
      'Understand why AI models hallucinate false facts with supreme confidence',
      'Identify the dangers of algorithmic bias and training dataset contamination',
      'Develop healthy habits as an informed high school student using AI tools',
    ],
    xpReward: 80,
    badgeRewardId: 'reality-checker',
    completionRequirements: {
      minScorePercentage: 70,
    },
    blocks: [
      {
        id: 'l5-b1',
        type: 'content',
        heading: 'AI Superpowers: What It Does Brilliantly',
        subtitle: 'The ultimate computational assistant',
        paragraphs: [
          'AI has genuine superpowers when applied to the right problems. It never gets tired, processes millions of rows in seconds, and can identify subtle correlations invisible to human eyes.',
        ],
        bulletPoints: [
          'Pattern Recognition: Spotting early-stage cancer cells in scans before human oncologists can see them',
          'Language Translation: Converting idiom-rich paragraphs between dozens of world languages instantly',
          'Brainstorming & Scaffolding: Drafting essay outlines, explaining calculus steps, or refactoring code',
          'Repetitive Automation: Summarizing 80-page meeting transcripts or categorizing customer support tickets',
        ],
        keyTakeaway: 'AI is an extraordinary multiplier for human creativity and productivity when used as a collaborative tool.',
        mascotTip: 'Think of AI as a brilliant research assistant with an encyclopedic memory—but one who occasionally talks in their sleep!',
        visualType: 'capabilities-matrix',
        highlightBadges: [
          { label: 'Speed & Scale', color: 'cyan' },
          { label: 'Pattern Synthesis', color: 'purple' },
        ],
      },
      {
        id: 'l5-b2',
        type: 'content',
        heading: 'The Dark Side: Hallucinations and Blindspots',
        subtitle: 'Why you must NEVER blindly trust AI outputs',
        paragraphs: [
          'Large Language Models do not store factual databases like Wikipedia. They store statistical probabilities about word sequences. That means they will fabricate historical dates, invent fake legal cases, and cite scientific papers that do not exist.',
          'This phenomenon is called an AI Hallucination: the model generates plausible-sounding falsehoods with complete, polite confidence.',
        ],
        bulletPoints: [
          'No Ground Truth Awareness: The model cannot verify its own statements in the physical world',
          'Algorithmic Bias: If training data contains historic societal discrimination, the model will reproduce those biases in its answers',
          'Lack of Common Sense: Models can write a complex Python script yet fail at basic spatial physics riddles',
          'High Environmental Cost: Training and serving massive models requires gigawatts of clean electricity and millions of liters of cooling water',
        ],
        keyTakeaway: 'Rule of thumb: Always verify important claims. If you cannot independently check the source, do not cite it!',
        mascotTip: 'Never copy-paste AI answers into school assignments without reading and verifying. Your critical judgment is what makes you irreplaceable!',
        visualType: 'comparison',
      },
      {
        id: 'l5-b3',
        type: 'sorting',
        prompt: 'Evaluate these tasks: Is AI reliable today, or does it struggle / fail?',
        instruction: 'Sort each scenario into whether AI is reliable or prone to hallucinations / errors.',
        categories: [
          { id: 'reliable', name: 'AI Excels & Is Reliable', color: 'border-emerald-500 text-emerald-300' },
          { id: 'struggle', name: 'AI Struggles or Hallucinates', color: 'border-amber-500 text-amber-300' },
        ],
        items: [
          { id: 'i1', text: 'Translating a Spanish paragraph into fluent English', correctCategoryId: 'reliable' },
          { id: 'i2', text: 'Citing real, accurate academic page numbers from obscure historical archives without external search', correctCategoryId: 'struggle' },
          { id: 'i3', text: 'Finding syntax bugs in a 50-line Python function', correctCategoryId: 'reliable' },
          { id: 'i4', text: 'Genuinely understanding moral philosophy and human emotions with empathy', correctCategoryId: 'struggle' },
          { id: 'i5', text: 'Transcribing spoken audio into text with timestamps', correctCategoryId: 'reliable' },
          { id: 'i6', text: 'Making foolproof medical diagnosis decisions with zero human physician oversight', correctCategoryId: 'struggle' },
        ],
        explanation: 'AI is exceptional at mechanical translation, code debugging, and transcription. But it lacks true moral conscience, real-world factual guarantees, and reliable autonomous high-stakes judgment.',
      },
      {
        id: 'l5-b4',
        type: 'quiz',
        question: 'A student uses an AI chatbot to write their history essay. The AI includes three convincing quotes from 18th-century historians. What should the student do?',
        options: [
          { id: 'a', text: 'Immediately submit the essay because AI never makes mistakes with historical facts', explanation: 'AI frequently invents completely fictitious quotes and historians.' },
          { id: 'b', text: 'Delete the entire essay and never use a computer again', explanation: 'That is extreme! AI is a great study aid when used critically.' },
          { id: 'c', text: 'Independently search reputable library or academic databases to verify that the historians and quotes actually exist', explanation: 'Spot on! This is responsible digital citizenship and scholarship.' },
          { id: 'd', text: 'Ask the same AI if it was telling the truth', explanation: 'An AI that hallucinates will often hallucinate that its previous hallucination was true!' },
        ],
        correctAnswerId: 'c',
        explanation: 'Because LLMs generate statistically plausible text rather than verified database lookups, verifying quotes and citations against reputable external sources is essential.',
      },
    ],
  },
];
