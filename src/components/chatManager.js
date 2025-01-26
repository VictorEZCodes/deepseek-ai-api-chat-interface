export function loadChats(chatHistory, chats, loadChat) {
  chatHistory.innerHTML = '';
  chats.forEach(chat => {
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item p-2 mb-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer';
    chatItem.textContent = chat.title || 'New Chat';
    chatItem.dataset.chatId = chat.id;
    chatItem.addEventListener('click', () => loadChat(chat.id));
    chatHistory.appendChild(chatItem);
  });
}

export function saveCurrentChat(messagesContainer, currentChatId, chats, modelSelect) {
  const messages = Array.from(messagesContainer.children).map(msg => ({
    content: msg.querySelector('.message-content').textContent,
    type: msg.classList.contains('user-message') ? 'user' : 'ai',
    reasoningContent: msg.querySelector('.reasoning-content pre')?.textContent || null
  }));
  
  if (messages.length > 0) {
    const existingChatIndex = chats.findIndex(chat => chat.id === currentChatId);
    const chatData = {
      id: currentChatId,
      title: messages[0].content.slice(0, 30) + '...',
      messages,
      model: modelSelect.value
    };

    if (existingChatIndex >= 0) {
      chats[existingChatIndex] = chatData;
    } else {
      chats.unshift(chatData);
    }
    
    localStorage.setItem('chats', JSON.stringify(chats));
    return true;
  }
  return false;
}

export function loadChat(chatId, currentChat, messagesContainer, modelSelect, addMessage, isMobile, sidebar, chatContainer) {
  if (currentChat) {
    const chat = currentChat.find(c => c.id === chatId);
    if (chat) {
      messagesContainer.innerHTML = '';
      modelSelect.value = chat.model;
      chat.messages.forEach(msg => {
        addMessage(msg.content, msg.type, msg.reasoningContent, null, messagesContainer);
      });
    }
  }
  
  if (isMobile()) {
    sidebar.classList.add('w-0');
    chatContainer.classList.add('sidebar-closed');
  }
}