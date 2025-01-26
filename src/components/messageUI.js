export function addMessage(content, type, reasoningContent = null, hiddenContent = null, messagesContainer) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message animate-fade-in`;
  
  if (hiddenContent) {
    messageDiv.dataset.fullContent = hiddenContent;
  }
  
  const innerDiv = document.createElement('div');
  innerDiv.className = 'message-content';
  
  if (content.includes('📎')) {
    appendFileContent(innerDiv, content);
  } else {
    innerDiv.textContent = content;
  }
  
  if (reasoningContent) {
    appendReasoningContent(messageDiv, reasoningContent);
  }
  
  messageDiv.appendChild(innerDiv);
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return messageDiv;
}

function appendFileContent(innerDiv, content) {
  const lines = content.split('\n');
  const messageText = lines.filter(line => !line.includes('📎')).join('\n');
  const fileLines = lines.filter(line => line.includes('📎'));
  
  if (messageText) {
    const textDiv = document.createElement('div');
    textDiv.textContent = messageText;
    innerDiv.appendChild(textDiv);
  }
  
  const filesDiv = document.createElement('div');
  filesDiv.className = 'file-attachments mt-2';
  fileLines.forEach(line => {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file-upload-indicator bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 mb-2';
    fileDiv.innerHTML = createFileIndicator(line);
    filesDiv.appendChild(fileDiv);
  });
  innerDiv.appendChild(filesDiv);
}

function createFileIndicator(line) {
  return `
    <div class="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      ${line}
    </div>
  `;
}

function appendReasoningContent(messageDiv, reasoningContent) {
  const reasoningDiv = document.createElement('div');
  reasoningDiv.className = 'reasoning-content';
  reasoningDiv.innerHTML = `
    <div class="reasoning-header">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Reasoning Process</span>
    </div>
    <pre>${reasoningContent}</pre>
  `;
  messageDiv.appendChild(reasoningDiv);
}

export function addTypingIndicator(messagesContainer) {
  const indicator = document.createElement('div');
  indicator.className = 'message typing-indicator animate-fade-in';
  indicator.innerHTML = `
    <div class="dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  messagesContainer.appendChild(indicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return indicator;
}