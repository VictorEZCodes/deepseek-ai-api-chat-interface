import { createFileInput, handleFileUpload } from './components/fileHandler.js';
import { addMessage, addTypingIndicator } from './components/messageUI.js';
import { simulateAIResponse, createAbortController } from './components/apiHandler.js';
import { loadChats, saveCurrentChat, loadChat } from './components/chatManager.js';
import { setupSidebarHandlers, handleNewChat } from './components/sidebarManager.js';

// Initialize DOM elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messagesContainer');
const chatContainer = document.getElementById('chatContainer');
const modelSelect = document.getElementById('modelSelect');
const newChatBtn = document.getElementById('newChatBtn');
const chatHistory = document.getElementById('chatHistory');
const cancelButton = document.getElementById('cancelButton');

// Initialize state
let currentChatId = Date.now();
let chats = JSON.parse(localStorage.getItem('chats') || '[]');
let pendingFileContents = null;
let currentController = null;

// Initialize file handling
const fileInput = createFileInput();
const uploadButton = document.getElementById('uploadButton');

// Setup event listeners
uploadButton.addEventListener('click', () => fileInput.click());

cancelButton.addEventListener('click', () => {
  if (currentController) {
    currentController.abort();
    currentController = null;
    cancelButton.classList.add('hidden');
  }
});

fileInput.addEventListener('change', async () => {
  const result = await handleFileUpload(Array.from(fileInput.files), 
    (content, type) => addMessage(content, type, null, null, messagesContainer));
  
  if (result) {
    pendingFileContents = result;
    messageInput.placeholder = `${result.display.map(d => d.replace('📎 ', '')).join(', ')} ready to send`;
  }
  fileInput.value = '';
});

messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message && !pendingFileContents) return;

  let displayMessage = message;
  let fullMessage = message;
  let hiddenContent = null;
  
  if (pendingFileContents) {
    displayMessage = message ? 
      `${message}\n\n${pendingFileContents.display.join('\n')}` : 
      pendingFileContents.display.join('\n');
      
    fullMessage = `${message ? message + '\n\n' : ''}I'm sharing these files with you:\n\n${
      pendingFileContents.full.map(f => `File: ${f.name}\n\nContent:\n${f.content}\n---\n`).join('\n')}`;
      
    hiddenContent = fullMessage;
    pendingFileContents = null;
    messageInput.placeholder = 'Type your message...';
  }

  addMessage(displayMessage, 'user', null, hiddenContent, messagesContainer);
  messageInput.value = '';
  messageInput.style.height = 'auto';

  const typingIndicator = addTypingIndicator(messagesContainer);
  currentController = createAbortController();
  cancelButton.classList.remove('hidden');

  try {
    const response = await simulateAIResponse(
      hiddenContent || displayMessage, 
      messagesContainer, 
      modelSelect, 
      currentController.signal
    );
    
    typingIndicator.remove();
    addMessage(
      response.content, 
      'ai', 
      modelSelect.value === 'deepseek-reasoner' ? response.reasoningContent : null,
      null,
      messagesContainer
    );
    saveCurrentChat(messagesContainer, currentChatId, chats, modelSelect);
  } catch (error) {
    typingIndicator.remove();
    if (error.name === 'AbortError') {
      addMessage('Generation cancelled.', 'system', null, null, messagesContainer);
    } else {
      addMessage('Sorry, there was an error processing your request.', 'error', null, null, messagesContainer);
    }
  } finally {
    currentController = null;
    cancelButton.classList.add('hidden');
  }
});

messageInput.addEventListener('input', () => {
  messageInput.style.height = 'auto';
  messageInput.style.height = messageInput.scrollHeight + 'px';
});

// Setup sidebar
setupSidebarHandlers(sidebar, sidebarToggle, chatContainer);

// Setup new chat button
newChatBtn.addEventListener('click', () => {
  if (currentController) {
    currentController.abort();
    currentController = null;
    cancelButton.classList.add('hidden');
  }
  
  currentChatId = handleNewChat(
    () => saveCurrentChat(messagesContainer, currentChatId, chats, modelSelect),
    currentChatId,
    messagesContainer,
    () => window.innerWidth <= 768,
    sidebar,
    chatContainer
  );
});

// Initialize
window.removeEventListener('resize', window.onresize);
window.dispatchEvent(new Event('resize'));
loadChats(chatHistory, chats, (chatId) => {
  loadChat(
    chatId,
    chats,
    messagesContainer,
    modelSelect,
    addMessage,
    () => window.innerWidth <= 768,
    sidebar,
    chatContainer
  );
});