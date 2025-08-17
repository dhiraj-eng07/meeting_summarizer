
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const fileInput = document.getElementById('fileInput');
  const uploadArea = document.getElementById('uploadArea');
  const fileInfo = document.getElementById('fileInfo');
  const instructions = document.getElementById('instructions');
  const generateBtn = document.getElementById('generateBtn');
  const summaryOutput = document.getElementById('summaryOutput');
  const shareSection = document.getElementById('shareSection');
  const emails = document.getElementById('emails');
  const message = document.getElementById('message');
  const shareBtn = document.getElementById('shareBtn');
  const status = document.getElementById('status');

  // Drag and drop functionality
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = 'rgba(74, 111, 165, 0.1)';
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.backgroundColor = '';
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = '';
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      updateFileInfo();
    }
  });

  fileInput.addEventListener('change', updateFileInfo);

  function updateFileInfo() {
    if (fileInput.files.length) {
      const file = fileInput.files[0];
      fileInfo.textContent = `Selected file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    } else {
      fileInfo.textContent = '';
    }
  }

  // Generate summary
  generateBtn.addEventListener('click', async function() {
    const file = fileInput.files[0];
    const customInstructions = instructions.value.trim();

    if (!file && !customInstructions) {
      status.textContent = 'Please upload a file or enter instructions';
      return;
    }

    generateBtn.disabled = true;
    generateBtn.classList.add('loading');
    status.textContent = 'Generating summary...';

    try {
      let text = '';
      if (file) {
        text = await readFileAsText(file);
      }

      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          instructions: customInstructions || 'Summarize the key points in bullet points'
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      summaryOutput.innerHTML = data.summary;
      shareSection.style.display = 'block';
      status.textContent = 'Summary generated successfully!';
    } catch (error) {
      console.error('Error:', error);
      status.textContent = 'Error generating summary: ' + error.message;
    } finally {
      generateBtn.disabled = false;
      generateBtn.classList.remove('loading');
    }
  });

  // Share summary
  shareBtn.addEventListener('click', async function() {
    const emailList = emails.value.trim();
    const summaryText = summaryOutput.innerText;
    const customMessage = message.value.trim();

    if (!emailList) {
      status.textContent = 'Please enter at least one email address';
      return;
    }

    if (!summaryText) {
      status.textContent = 'No summary to share';
      return;
    }

    shareBtn.disabled = true;
    shareBtn.classList.add('loading');
    status.textContent = 'Sending emails...';

    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: emailList.split(',').map(email => email.trim()),
          summary: summaryText,
          message: customMessage
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      status.textContent = 'Summary shared successfully!';
    } catch (error) {
      console.error('Error:', error);
      status.textContent = 'Error sharing summary: ' + error.message;
    } finally {
      shareBtn.disabled = false;
      shareBtn.classList.remove('loading');
    }
  });

  // Helper function to read file as text
  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }
});
