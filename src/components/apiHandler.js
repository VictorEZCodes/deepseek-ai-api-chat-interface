export async function simulateAIResponse(message, messagesContainer, modelSelect, signal) {
  try {
    const allMessages = getAllMessages(messagesContainer, message);
    const processedMessages = processMessages(allMessages);
    const apiMessages = prepareApiMessages(processedMessages);
    return await sendRequest(apiMessages, modelSelect.value, signal);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

function getAllMessages(messagesContainer, currentMessage) {
  const messages = Array.from(messagesContainer.children)
    .filter(msg => {
      const messageContent = msg.querySelector('.message-content');
      return messageContent && 
             !msg.classList.contains('typing-indicator') && 
             !msg.classList.contains('error');
    })
    .map(msg => ({
      content: msg.dataset.fullContent || msg.querySelector('.message-content').textContent,
      type: msg.classList.contains('user-message') ? 'user' : 'assistant'
    }));

  messages.push({
    content: currentMessage,
    type: 'user'
  });

  return messages;
}

function processMessages(messages) {
  const processedMessages = [];
  let lastType = null;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!lastType || msg.type !== lastType) {
      processedMessages.push({
        type: msg.type,
        content: msg.content.trim()
          .replace(/^Your last question was: "[\s\S]*"\n\n/, '')
          .replace(/Hello! It looks like you're saying .+\. How can I assist you today[\s\S]*/, '')
      });
      lastType = msg.type;
    }
  }

  return processedMessages;
}

function prepareApiMessages(messages) {
  return [
    { role: 'system', content: 'You are a helpful assistant.' },
    ...messages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))
  ];
}

async function sendRequest(messages, modelValue, signal) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: modelValue,
      messages: messages,
      ...(modelValue === 'deepseek-chat' && { temperature: 1.3 }),
      max_tokens: 4000
    }),
    signal
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response format from API');
  }

  if (modelValue === 'deepseek-reasoner') {
    return {
      content: data.choices[0].message.content,
      reasoningContent: data.choices[0].message.reasoning_content
    };
  }
  
  return {
    content: data.choices[0].message.content
  };
}

export function createAbortController() {
  return new AbortController();
}