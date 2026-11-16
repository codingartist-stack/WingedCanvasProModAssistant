const BANNED_WORDS = [
  'ass',
  'asshole',
  'cum',
  'cumming',
  'dickhead',
  'dumbass',
  'fag',
  'faggot',
  'fuck',
  'fucking',
  'penis',
  'porn',
  'pussy',
  'sex',
  'shit',
  'shitty',
  'vagina',
  'xxx',
];

const COMMANDS = {
  general: [
    '!welcome',
    '!polls',
    '!chatrules',
    '!liveschedule',
    '!socials',
    '!discord',
    '!challenge',
    '!critique',
    '!skool',
    '!bye',
  ],
  resources: [
    '!anatomy',
    '!anime',
    '!animation',
    '!animal',
    '!character',
    '!color',
    '!comics',
    '!digitalart',
    '!elements',
    '!gsl',
    '!figuredrawing',
    '!krita',
  ],
  offerings: [
    '!patreon',
    '!youtube',
    '!classes',
    '!mentorship',
    '!portfolio',
    '!1on1',
    '!intensive',
    '!donation',
    '!skool',
    '!giveaway',
  ],
};

const HYPE_MACROS = {
  '👋 Welcome Hype':
    "🎨 Welcome to the stream! Grab your sketchbook, ask questions, and tell us what you're working on today! 🤓✨",
  '✨ Joining Late?':
    "✨ Joining late? Today's focus is TOPIC! STREAMER is currently demoing DEMO. Say hi in chat 🔥🎨",
  '🙌 Team Hype':
    '💖 Huge shoutout to STREAMER for breaking down DEMO and to our mod team keeping chat running smoothly! Drop some hearts in chat! 🎨✨',
  '💬 Topic Struggles':
    "✨ Today we're practicing SKILL with STREAMER! What's your biggest struggle when drawing this? Drop it below! 👇🎨",
  '🔥 Skill Prompt':
    "🔥 Quick question for chat: What's your favorite part or go-to trick when drawing SKILL? Share your tips below! ✏️👀",
  '👀 Lurking':
    '👀 Enjoying from the shadows? We see you and appreciate the support! Happy sketching! 🎨✨',
  '⚠️ Tech Issue':
    '⚠️ Art Nerds, hold fast! Our tech tools are throwing a drawing error. The stream canvas is loading, please hold! 🤖🎨',
  '🎯 Feedback Prompt':
    '🎯 If you could get instant feedback from STREAMER on your art right now, what element would you ask about? Drop it in chat! ✏️💬',
  '🖌️ Tool Check':
    "🖌️ STREAMER is working with MEDIUM today! What's your weapon of choice right now—digital tablet or traditional sketchbook? ✏️💻",
  '🚧 WIP Check-In':
    '🚧 Mid-stream check-in! Where are you at with your current piece—rough sketching, line art, or rendering? Drop your status below! 👇🎨',
  '🌟 Art Inspo':
    "🌟 While STREAMER works on DEMO, let's hear it: Who is your biggest art inspiration or favorite artist right now? Drop their name in chat! ✨👀",
  '🎧 Vibe Check':
    '🎧 Drawing soundtrack check! What song, playlist, or background show do you have on repeat while sketching today? 🎶✏️',
  '📈 Goal Check':
    '📈 Setting intentions! What is one art goal or skill like SKILL that you want to level up by the end of this month? 🚀🎨',
};

const BACKUP_SESSION_START = Date.now();

function formatDuration(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00:00';
  const hrs = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function initSidebar() {
  if (window.self !== window.top) return;
  if (document.getElementById('wc-mod-sidebar')) return;

  const sidebar = document.createElement('div');
  sidebar.id = 'wc-mod-sidebar';
  sidebar.innerHTML = `
    <div class="wc-header" id="wc-sidebar-header" style="display: flex; align-items: center; gap: 6px;">
      <img src="${chrome.runtime.getURL('images/winged-canvas-nerd-glasses.png')}" alt="Icon" style="height: 20px; object-fit: contain; pointer-events: none;">
      <span id="wc-drag-title">Mod Helper v4.8</span>
      <button class="wc-toggle-btn" id="wc-toggle-minimize" style="margin-left: auto;">−</button>
    </div>
    
    <!-- ⚙️ Moderator Profile & Stream Config Section -->
      <div class="wc-section">
        <strong>⚙️ Stream & Mod Configuration</strong>
        <div class="wc-config-row" style="margin-top: 5px;">
          <span style="font-size:11px; color:#aaa; width: 58px;">Your Name:</span>
          <input type="text" id="wc-input-mod-name" class="wc-config-input" placeholder="e.g. sarah, john, kelsey">
        </div>
        <div class="wc-config-row">
          <span style="font-size:11px; color:#aaa; width: 58px;">Streamer:</span>
          <input type="text" id="wc-input-streamer" class="wc-config-input" placeholder="e.g. Fei, Josh, Seth">
        </div>
        <div class="wc-config-row" style="margin-bottom: 0;">
          <span style="font-size:11px; color:#aaa; width: 58px;">Topic:</span>
          <input type="text" id="wc-input-topic" class="wc-config-input" placeholder="e.g. Anatomy, Lighting">
        </div>
      </div>

      <!-- Manual Timestamp Logger -->
      <div class="wc-section">
        <strong>⏱️ Manual Timestamp Logger</strong>
        <div style="display:flex; gap: 5px; margin-top:5px;">
          <button id="wc-btn-ts" class="wc-action-btn">Log Current Time</button>
        </div>
        <textarea id="wc-ts-log" class="wc-ts-area" placeholder="Timestamps will appear here..."></textarea>
        <div class="wc-btn-grid" style="margin-top:5px;">
          <button id="wc-btn-copy-ts" class="wc-macro-btn">📋 Copy Logs</button>
          <button id="wc-btn-clear-ts" class="wc-macro-btn">🗑️ Clear Logs</button>
        </div>
      </div>

      <!-- Question Tracker Queue -->
      <div class="wc-section" style="max-height: 120px; overflow-y: auto;">
        <strong>📋 Question Queue Tracker</strong>
        <br>
        <span style="color:#aaa; font-size:11px;">Click '?' in chat to queue a question</span>
        <div id="wc-question-queue" style="margin-top: 5px;">
          <span style="color:#aaa; font-size:11px;">(Queued Items will appear here)</span>
        </div>
      </div>

      <!-- Categorized Command Vault -->
      <div class="wc-tabs">
        <button class="wc-tab-btn active" id="tab-gen">General</button>
         <button class="wc-tab-btn" id="tab-hype">Chat Hype</button>
        <button class="wc-tab-btn" id="tab-inst">Resources</button>
        <button class="wc-tab-btn" id="tab-off">Programs</button>
      </div>
      <div class="wc-section" style="min-height: 120px;" id="wc-command-container">
        <div id="wc-macro-grid"></div>
      </div>
    </div>
  `;
  document.body.appendChild(sidebar);

  const toggleBtn = document.getElementById('wc-toggle-minimize');
  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    sidebar.classList.toggle('minimized');
    toggleBtn.innerText = sidebar.classList.contains('minimized') ? '+' : '−';
  });

  makeSidebarDraggable(sidebar, document.getElementById('wc-sidebar-header'));

  // Auto-Recovery Persistent Cache Control
  const logTextArea = document.getElementById('wc-ts-log');
  if (logTextArea) {
    const savedLogs = localStorage.getItem('wc_saved_timestamps');
    if (savedLogs) {
      logTextArea.value = savedLogs;
    }
    logTextArea.addEventListener('input', () => {
      localStorage.setItem('wc_saved_timestamps', logTextArea.value);
    });
  }

  // Profile Storage Initialization
  const nameInput = document.getElementById('wc-input-mod-name');
  if (nameInput) {
    const savedName = localStorage.getItem('wc_mod_profile_name') || ''; // Default fallback
    nameInput.value = savedName;
    nameInput.addEventListener('input', () => {
      localStorage.setItem(
        'wc_mod_profile_name',
        nameInput.value.toLowerCase().trim(),
      );
      // Dynamically re-render the open tab view to apply label changes instantly
      const activeTab = document.querySelector('.wc-tab-btn.active');
      if (activeTab) activeTab.click();
    });
  }
  // Streamer & Topic Storage Initialization
  const streamerInput = document.getElementById('wc-input-streamer');
  if (streamerInput) {
    streamerInput.value = localStorage.getItem('wc_stream_streamer') || '';
    streamerInput.addEventListener('input', () => {
      localStorage.setItem('wc_stream_streamer', streamerInput.value.trim());
    });
  }

  const topicInput = document.getElementById('wc-input-topic');
  if (topicInput) {
    topicInput.value = localStorage.getItem('wc_stream_topic') || '';
    topicInput.addEventListener('input', () => {
      localStorage.setItem('wc_stream_topic', topicInput.value.trim());
    });
  }

  document
    .getElementById('wc-btn-copy-ts')
    .addEventListener('click', copyTimestampsToClipboard);
  document
    .getElementById('wc-btn-clear-ts')
    .addEventListener('click', clearTimestampsCache);
  document
    .getElementById('wc-btn-ts')
    .addEventListener('click', captureLiveTimestamp);
  /*document
    .getElementById('wc-btn-shuffle')
    .addEventListener('click', generateIcebreakerOptions); */
  document
    .getElementById('tab-gen')
    .addEventListener('click', () => switchTab('general', 'tab-gen'));
  document
    .getElementById('tab-hype')
    .addEventListener('click', () => switchTab('hype', 'tab-hype'));
  document
    .getElementById('tab-inst')
    .addEventListener('click', () => switchTab('resources', 'tab-inst'));
  document
    .getElementById('tab-off')
    .addEventListener('click', () => switchTab('offerings', 'tab-off'));

  switchTab('general', 'tab-gen');
}

function copyTimestampsToClipboard() {
  const logTextArea = document.getElementById('wc-ts-log');
  if (logTextArea && logTextArea.value) {
    navigator.clipboard.writeText(logTextArea.value);
    const copyBtn = document.getElementById('wc-btn-copy-ts');
    const originalText = copyBtn.innerText;
    copyBtn.innerText = '✅ Copied!';
    setTimeout(() => {
      copyBtn.innerText = originalText;
    }, 1500);
  }
}

/* Restores instruction line when logs drop to empty string */
function clearTimestampsCache() {
  if (confirm('Are you sure you want to clear your active timestamp logs?')) {
    const logTextArea = document.getElementById('wc-ts-log');
    if (logTextArea) {
      logTextArea.value = '';
      localStorage.removeItem('wc_saved_timestamps');
    }
  }
}

function switchTab(category, tabId) {
  document
    .querySelectorAll('.wc-tab-btn')
    .forEach((btn) => btn.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');

  const container = document.getElementById('wc-command-container');
  container.innerHTML = '';

  // Render dedicated Hype Tab
  if (category === 'hype') {
    const hypeTitle = document.createElement('div');
    hypeTitle.style.fontWeight = 'bold';
    hypeTitle.style.marginBottom = '4px';
    hypeTitle.innerText = '🎉 Community Hype Templates';
    container.appendChild(hypeTitle);

    const hypeSubtitle = document.createElement('div');
    hypeSubtitle.style.color = '#aaa';
    hypeSubtitle.style.fontSize = '11px';
    hypeSubtitle.style.marginBottom = '6px';
    hypeSubtitle.innerText =
      'Edit any remaining words in ALL CAPS before sending';
    container.appendChild(hypeSubtitle);

    const hypeGrid = document.createElement('div');
    hypeGrid.className = 'wc-btn-grid';
    for (const [label, textValue] of Object.entries(HYPE_MACROS)) {
      const btn = document.createElement('button');
      btn.className = 'wc-macro-btn';
      btn.innerText = label;
      btn.title = formatMacroText(textValue);
      btn.addEventListener('click', () => sendToChatInput(textValue));
      hypeGrid.appendChild(btn);
    }
    container.appendChild(hypeGrid);
    return;
  }

  // Render NightBot Triggers for General, Resources, and Programs
  const cmdTitle = document.createElement('div');
  cmdTitle.style.fontWeight = 'bold';
  cmdTitle.style.marginBottom = '4px';
  cmdTitle.innerText = '🤖 NightBot Triggers';
  container.appendChild(cmdTitle);

  if (category === 'general') {
    const cmdSubtitle = document.createElement('div');
    cmdSubtitle.style.color = '#aaa';
    cmdSubtitle.style.fontSize = '11px';
    cmdSubtitle.style.marginBottom = '6px';
    cmdSubtitle.innerText = 'Please use these on each stream';
    container.appendChild(cmdSubtitle);
  }

  const cmdGrid = document.createElement('div');
  cmdGrid.className = 'wc-btn-grid';

  const activeModName = localStorage.getItem('wc_mod_profile_name') || '';

  COMMANDS[category].forEach((cmd) => {
    const btn = document.createElement('button');
    btn.className = 'wc-macro-btn';

    if (cmd === '!skool') {
      const dynamicTrigger =
        activeModName && activeModName !== ''
          ? `!skool${activeModName}`
          : '!skool';

      btn.innerText = dynamicTrigger;
      btn.addEventListener('click', () => sendToChatInput(dynamicTrigger));
    } else {
      btn.innerText = cmd;
      btn.addEventListener('click', () => sendToChatInput(cmd));
    }
    cmdGrid.appendChild(btn);
  });
  container.appendChild(cmdGrid);
}

function makeSidebarDraggable(elmnt, header) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  header.onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    if (e.target.id === 'wc-toggle-minimize') return;
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
    elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    elmnt.style.right = 'auto';
  }
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
function captureLiveTimestamp() {
  let secondsElapsed = 0;
  try {
    let mainVideo = document.querySelector('video');
    if (mainVideo && !isNaN(mainVideo.currentTime)) {
      secondsElapsed = mainVideo.currentTime;
    } else {
      secondsElapsed = (Date.now() - BACKUP_SESSION_START) / 1000;
    }
  } catch (err) {
    secondsElapsed = (Date.now() - BACKUP_SESSION_START) / 1000;
  }
  const formattedTime = formatDuration(secondsElapsed);
  const logTextArea = document.getElementById('wc-ts-log');
  if (logTextArea) {
    const currentText = logTextArea.value;
    let updatedText = '';
    if (currentText === '') {
      updatedText = formattedTime + ' - ';
    } else {
      updatedText = currentText + '\n' + formattedTime + ' - ';
    }
    logTextArea.value = updatedText;
    logTextArea.scrollTop = logTextArea.scrollHeight;
    logTextArea.focus();
    localStorage.setItem('wc_saved_timestamps', updatedText);
  }
}
function formatMacroText(rawText) {
  let finalText = rawText;
  const savedStreamer = localStorage.getItem('wc_stream_streamer') || '';
  const savedTopic = localStorage.getItem('wc_stream_topic') || '';

  if (savedStreamer) {
    finalText = finalText.replace(/\bSTREAMER\b/g, savedStreamer);
  }
  if (savedTopic) {
    finalText = finalText.replace(/\bTOPIC\b/g, savedTopic);
  }

  return finalText;
}

function sendToChatInput(text) {
  // 1. Call the helper function right here to swap STREAMER and TOPIC
  let textToPaste = formatMacroText(text);

  // 2. Keep your existing !skool dynamic lookup layer
  if (textToPaste.startsWith('!skool')) {
    const currentProfileName =
      localStorage.getItem('wc_mod_profile_name') || '';
    textToPaste = `!skool${currentProfileName}`;
  }

  // 3. Send the formatted text to the YouTube chat iframe
  try {
    chrome.runtime.sendMessage({ type: 'WC_INJECT_TEXT', text: textToPaste });
  } catch (err) {
    console.error('Extension runtime message drop:', err);
  }
}

function runLiveChatIframeScanner() {
  setInterval(() => {
    const chatRows = document.querySelectorAll(
      'yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer',
    );
    chatRows.forEach((row) => {
      if (row.dataset.wcProcessed) return;
      row.dataset.wcProcessed = 'true';
      const messageContent = row.querySelector('#message')?.textContent || '';
      const authorName = row.querySelector('#author-name')?.textContent || '';
      const containsBan = BANNED_WORDS.some((word) => {
        const regex = new RegExp('\b' + word + '\b', 'i');
        return regex.test(messageContent);
      });
      if (containsBan) {
        row.classList.add('wc-banned-msg');
      }
      const targetHeader =
        row.querySelector('#author-name') ||
        row.querySelector('.yt-live-chat-author-chip') ||
        row.querySelector('#author-text');
      if (targetHeader) {
        const warnBtn = document.createElement('button');
        warnBtn.className = 'wc-injected-btn';
        warnBtn.innerText = 'W';
        warnBtn.title = 'Warn User';
        warnBtn.style.pointerEvents = 'auto';
        warnBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const cleanName = authorName.replace(/^@/, '').trim();
          executeTextPasteInIframe(
            '@' +
              cleanName +
              ' Please follow our community guidelines! Refrain from swearing or spamming. Join our Discord if you want to chat art: discord.gg/wingedcanvas',
          );
        });
        const qBtn = document.createElement('button');
        qBtn.className = 'wc-injected-btn wc-q-btn';
        qBtn.innerText = '?';
        qBtn.title = 'Send to Question Queue';
        qBtn.style.pointerEvents = 'auto';
        qBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
            chrome.runtime.sendMessage({
              type: 'WC_QUEUE_ADD',
              author: authorName,
              message: messageContent,
            });
          } catch (err) {
            console.error('Queue add message drop:', err);
          }
        });
        targetHeader.insertAdjacentElement('beforebegin', qBtn);
        targetHeader.insertAdjacentElement('beforebegin', warnBtn);
      }
    });
  }, 1000);
}
function executeTextPasteInIframe(text) {
  let attempts = 0;
  const maxAttempts = 60;
  const tryFindAndPaste = setInterval(() => {
    let chatInput =
      document.querySelector('#input.yt-live-chat-text-input-field-renderer') ||
      document.querySelector(
        'yt-live-chat-text-input-field-renderer #textarea',
      ) ||
      document.querySelector('#input-container #textarea') ||
      document.querySelector('#message-input #textarea') ||
      document.getElementById('textarea') ||
      document.querySelector('div[contenteditable="true"]') ||
      document.querySelector('[role="textbox"]');
    if (!chatInput) {
      const editables = Array.from(
        document.querySelectorAll('[contenteditable]'),
      );
      chatInput = editables.find(
        (el) =>
          el.getAttribute('contenteditable') === 'true' && el.offsetWidth > 0,
      );
    }
    if (chatInput) {
      clearInterval(tryFindAndPaste);
      chatInput.focus();
      chatInput.innerHTML = '';
      document.execCommand('delete', false, null);
      document.execCommand('insertText', false, text);
      chatInput.dispatchEvent(
        new Event('input', { bubbles: true, cancelable: true }),
      );
      chatInput.dispatchEvent(new Event('change', { bubbles: true }));
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(chatInput);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    attempts++;
    if (attempts >= maxAttempts) {
      clearInterval(tryFindAndPaste);
    }
  }, 50);
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request) return;
  if (window.self === window.top && request.type === 'WC_QUEUE_ADD') {
    const queueContainer = document.getElementById('wc-question-queue');
    if (queueContainer) {
      const guideSpan = queueContainer.querySelector('span');
      if (guideSpan) {
        guideSpan.style.display = 'none';
      }
      const qItem = document.createElement('div');
      qItem.className = 'wc-queue-item';
      qItem.innerHTML = `<strong>${request.author}:</strong> ${request.message}`;
      qItem.addEventListener('click', () => {
        sendToChatInput(
          `@wingedcanvas - Question from ${request.author}: ${request.message}`,
        );
        qItem.remove();
        if (
          queueContainer.querySelectorAll('.wc-queue-item').length === 0 &&
          guideSpan
        ) {
          guideSpan.style.display = 'inline';
        }
      });
      queueContainer.appendChild(qItem);
    }
  }
  if (window.self !== window.top && request.type === 'WC_INJECT_TEXT') {
    executeTextPasteInIframe(request.text);
  }
});
if (window.self === window.top) {
  setTimeout(initSidebar, 2000);
} else {
  runLiveChatIframeScanner();
}
