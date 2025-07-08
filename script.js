// Get references to all the buttons and response area
const iceBreakerBtn = document.getElementById('iceBtn');
const weirdFactBtn = document.getElementById('factBtn');
const jokeBtn = document.getElementById('jokeBtn');
const weatherBtn = document.getElementById('weatherBtn');
const responseDiv = document.getElementById('response');
const contextSelect = document.getElementById('contextSelect');
const personaSelect = document.getElementById('personaSelect');

// Context-specific system prompts
const contextPrompts = {
  'general': '',
  'team-meeting': 'CONTEXT: This is for a PROFESSIONAL TEAM MEETING. You must make responses work-appropriate, team-building focused, and suitable for colleagues. Avoid anything too casual or personal. Focus on workplace collaboration, productivity, and professional relationship building.',
  'classroom': 'CONTEXT: This is for an EDUCATIONAL CLASSROOM with students. You must make responses educational, learning-focused, and appropriate for an academic environment. Include educational value and encourage curiosity. Use language that engages students and promotes learning.',
  'game-night': 'CONTEXT: This is for a FUN GAME NIGHT with friends having a good time. You must make responses super playful, entertaining, and perfect for casual social gaming. Be silly, fun, and energetic! Focus on entertainment and laughter.',
  'networking': 'CONTEXT: This is for a PROFESSIONAL NETWORKING EVENT. You must make responses perfect for business networking, career development, and professional relationship building. Focus on industry connections, career growth, and professional opportunities.'
};

// Persona-specific system prompts
const personaPrompts = {
  'friendly-coworker': 'IMPORTANT: You must respond as a friendly, supportive coworker. Be helpful and professional but warm. Use a conversational, encouraging tone like you would with a work buddy.',
  'sassy-intern': 'IMPORTANT: You must respond as a sassy, witty intern. Use emojis frequently! Be playful and slightly cheeky but still appropriate. Add personality with phrases like "honestly," "tbh," "ngl." Example: "Honestly, here\'s a fun fact that\'ll blow your mind! 🤯"',
  'professor-bot': 'IMPORTANT: You must respond as a knowledgeable professor. Be educational, articulate, and slightly formal. Start responses with phrases like "Fascinating question!" or "Allow me to share..." Use academic language.',
  'casual-friend': 'IMPORTANT: You must respond as a casual, laid-back friend. Be super easygoing and use relaxed language like "dude," "totally," "awesome." Keep everything light, fun, and conversational like texting a buddy.'
};

// Function to build the complete system prompt
function buildSystemPrompt() {
  const context = contextSelect.value;
  const persona = personaSelect.value;
  
  let systemPrompt = '';
  
  // Add context instruction first (it should set the overall tone)
  if (contextPrompts[context] && contextPrompts[context].trim()) {
    systemPrompt += contextPrompts[context] + ' ';
  }
  
  // Add persona instruction - but make it adapt to the context
  if (personaPrompts[persona]) {
    systemPrompt += personaPrompts[persona];
  }
  
  // Add extra emphasis for both context and persona
  systemPrompt += ' Remember: ALWAYS follow both the context requirements and persona style in your response.';
  
  return systemPrompt.trim();
}

// Function to call OpenAI API
async function callOpenAI(prompt) {
  try {
    // Show loading message while waiting for response
    responseDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating response...';
    
    // Build the system prompt based on selected context and persona
    const systemPrompt = buildSystemPrompt();
    
    // Create messages array with system prompt if it exists
    const messages = [];
    if (systemPrompt.trim()) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }
    messages.push({
      role: 'user',
      content: prompt
    });
    
    // Debug: Log the system prompt to console so we can see what's being sent
    console.log('=== DEBUG INFO ===');
    console.log('Selected Context:', contextSelect.value);
    console.log('Selected Persona:', personaSelect.value);
    console.log('System Prompt:', systemPrompt);
    console.log('User Prompt:', prompt);
    console.log('Full Messages Array:', messages);
    console.log('==================');
    
    console.log('Messages being sent:', messages);
    
    // Make API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using the correct latest GPT-4 model
        messages: messages,
        max_tokens: 200, // Increase tokens slightly to allow for personality expression
        temperature: 0.9 // Make responses creative and varied
      })
    });

    // Check if the API call was successful
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();
    
    // Extract the generated text from the response
    const generatedText = data.choices[0].message.content.trim();
    
    // Display the response to the user
    responseDiv.innerHTML = generatedText;
    
  } catch (error) {
    // Handle any errors that occur during the API call
    console.error('Error calling OpenAI API:', error);
    responseDiv.innerHTML = `❌ Oops! Something went wrong.<br>Try again in a moment, or check your internet connection.`;
    // Remove active state from all buttons so the app never looks stuck
    allButtons.forEach(btn => btn.classList.remove('active'));
  }
}

// Arrays of varied prompts for each button type
const icebreakerPrompts = [
  "Generate a creative icebreaker question about childhood memories or dreams.",
  "Create a fun 'would you rather' question that reveals personality.",
  "Make an engaging question about travel experiences or bucket list destinations.",
  "Generate a creative question about superpowers, time travel, or fantasy scenarios.",
  "Create an icebreaker about favorite foods, hobbies, or hidden talents.",
  "Make a thought-provoking question about life philosophies or values.",
  "Generate a fun question about movies, books, or entertainment preferences."
];

const weirdFactPrompts = [
  "Share a bizarre fact about animals and their unusual behaviors.",
  "Tell me a surprising fact about space, planets, or the universe.",
  "Share a weird historical fact that most people don't know.",
  "Give me a fascinating fact about the human body or brain.",
  "Share an unusual fact about food, cooking, or eating habits around the world.",
  "Tell me a strange fact about technology, inventions, or science.",
  "Share a bizarre fact about nature, weather, or natural phenomena."
];

const jokePrompts = [
  "Tell a clean pun or wordplay joke that's clever and family-friendly.",
  "Share a light-hearted joke about everyday situations or technology.",
  "Tell a wholesome joke about animals, food, or school/work.",
  "Create a funny one-liner or dad joke that's groan-worthy but amusing.",
  "Share a clean joke about hobbies, sports, or entertainment.",
  "Tell a silly knock-knock joke or riddle that makes people smile.",
  "Create a gentle, observational humor joke about daily life."
];

const weatherPrompts = [
  "Create a question about how different seasons affect people's moods and activities.",
  "Make a prompt about favorite weather for outdoor activities or cozy indoor time.",
  "Generate a question about weather memories - best snow day, perfect summer, etc.",
  "Create a conversation starter about how weather influences what people wear or eat.",
  "Make a prompt about weather preferences and dream vacation climates.",
  "Generate a question about funny or memorable weather experiences.",
  "Create a prompt about how weather affects productivity, creativity, or relationships."
];

// Function to get a context-adapted prompt
function getContextAdaptedPrompt(basePrompt, context) {
  const adaptations = {
    'team-meeting': ' Make this suitable for professional colleagues in a work meeting.',
    'classroom': ' Make this educational and appropriate for students in a classroom.',
    'game-night': ' Make this fun and entertaining for friends at a casual game night.',
    'networking': ' Make this suitable for professional networking and career conversations.',
    'general': ''
  };
  
  return basePrompt + (adaptations[context] || '');
}

// Function to get a random prompt from an array
function getRandomPrompt(promptArray) {
  const randomIndex = Math.floor(Math.random() * promptArray.length);
  const basePrompt = promptArray[randomIndex];
  const context = contextSelect.value;
  return getContextAdaptedPrompt(basePrompt, context);
}

// Event listener for Icebreaker button
iceBreakerBtn.addEventListener('click', async () => {
  const prompt = getRandomPrompt(icebreakerPrompts);
  await callOpenAI(prompt);
});

// Event listener for Weird Fact button
weirdFactBtn.addEventListener('click', async () => {
  const prompt = getRandomPrompt(weirdFactPrompts);
  await callOpenAI(prompt);
});

// Event listener for Joke button
jokeBtn.addEventListener('click', async () => {
  const prompt = getRandomPrompt(jokePrompts);
  await callOpenAI(prompt);
});

// Event listener for Weather button
weatherBtn.addEventListener('click', async () => {
  const prompt = getRandomPrompt(weatherPrompts);
  await callOpenAI(prompt);
});

// Add some visual feedback when buttons are clicked
const allButtons = [iceBreakerBtn, weirdFactBtn, jokeBtn, weatherBtn];

allButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    allButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
  });
});

// Add visual feedback for context and persona changes
contextSelect.addEventListener('change', () => {
  const selectedContext = contextSelect.options[contextSelect.selectedIndex].text;
  responseDiv.innerHTML = `🧭 Context changed to: <strong>${selectedContext}</strong><br>Click a button to see how responses adapt!`;
});

personaSelect.addEventListener('change', () => {
  const selectedPersona = personaSelect.options[personaSelect.selectedIndex].text;
  responseDiv.innerHTML = `🤖 Persona changed to: <strong>${selectedPersona}</strong><br>Click a button to experience the new personality!`;
});