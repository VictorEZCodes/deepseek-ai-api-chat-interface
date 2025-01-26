export function setupSidebarHandlers(sidebar, sidebarToggle, chatContainer) {
  const isMobile = () => window.innerWidth <= 768;

  window.addEventListener('resize', () => {
    if (isMobile()) {
      sidebar.classList.add('mobile');
      chatContainer.classList.add('sidebar-closed');
    } else {
      sidebar.classList.remove('mobile');
      chatContainer.classList.toggle('sidebar-closed', sidebar.classList.contains('w-0'));
    }
  });

  sidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('w-0');
    chatContainer.classList.toggle('sidebar-closed');
  });

  document.addEventListener('click', (e) => {
    if (isMobile() && 
        !sidebar.classList.contains('w-0') && 
        !sidebar.contains(e.target) && 
        !sidebarToggle.contains(e.target)) {
      sidebar.classList.add('w-0');
      chatContainer.classList.add('sidebar-closed');
    }
  });

  sidebar.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

export function handleNewChat(saveCurrentChat, currentChatId, messagesContainer, isMobile, sidebar, chatContainer) {
  saveCurrentChat();
  currentChatId = Date.now();
  messagesContainer.innerHTML = '';
  
  if (isMobile()) {
    sidebar.classList.add('w-0');
    chatContainer.classList.add('sidebar-closed');
  }
  
  return currentChatId;
}