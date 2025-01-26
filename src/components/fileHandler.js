export const createFileInput = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.multiple = true;
  fileInput.accept = '.txt,.js,.py,.html,.css,.json,.md,.csv';
  fileInput.className = 'file-upload';
  document.body.appendChild(fileInput);
  return fileInput;
};

export const handleFileUpload = async (files, addMessage) => {
  if (files.length === 0) return null;

  const fileContents = [];
  const fileNames = [];
  
  for (const file of files) {
    try {
      const content = await file.text();
      fileContents.push({ name: file.name, content });
      fileNames.push(file.name);
    } catch (error) {
      console.error(`Error reading file ${file.name}:`, error);
      addMessage(`Error reading file ${file.name}`, 'error');
      return null;
    }
  }

  return { 
    display: fileNames.map(name => `📎 ${name}`),
    full: fileContents
  };
};