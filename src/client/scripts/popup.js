import { showBadge, checkClipExist, navigateTo } from '../../common/index';
import { initializeTheme, setLanguage } from './utils';

const select = document.querySelector.bind(document);
const selectAll = document.querySelectorAll.bind(document);

const emptyPrompt = select('.emptyPrompt');
const logo = select('.logo');
const clearAll = select('.clearAll');
const manualText = select('.clipText');
const clipSection = select('.clips');
const singleClip = select('.clips');
const hint = select('.hint');
const copyPrompt = select('.copyPrompt');
const preview = select('.preview');
const text = select('.text');
const bugReport = select('.bugReport');
const kofi = select('.kofi');
const documentBody = select('body');
const elements = selectAll(
  '.emptyPrompt, .copyPrompt, .clipText, .deleteClip'
);
const footerWithHeader = selectAll('.footer, .header, .settings, .bugReport, .logo, .deleteClip');
const translateMenu = selectAll(
  '.emptyPrompt, .copyPrompt, .preview'
);

// set empty view when there are no clips
const setEmptyView = () => {
  hint.style.display = 'none';
  emptyPrompt.style.display = 'block';
  copyPrompt.style.display = 'block';
  manualText.style.display = 'none';
  chrome.storage.sync.remove('clips');
  clipSection.textContent = '';
  clearAll.style.visibility = 'hidden';
  showBadge('');
};

// initialize translation
setLanguage(translateMenu);

/**
 * @description populates view with clips
 * @param {Object} clips object containing all clips
 */
const addClips = clips => {
  let data = '';
  Object.keys(clips).forEach(key => {
    data += `
            <div id="no${key}" name="${key}" class="clip">
            <span class="copy">
            &#x2398;
            </span>
            <span id="no${key}" class="content">
            ${clips[`${key}`].replace(/&/g, '&amp;')}
            </span>
            <span class="deleteClip"> &#x274C; </span>
            </div>`;
  });
  clipSection.innerHTML = data;
};

chrome.storage.sync.get('clips', items => {
  if (!items['clips'] || Object.keys(items['clips']).length === 0) {
    emptyPrompt.style.display = 'block';
    clearAll.style.visibility = 'hidden';
    hint.style.display = 'none';
    showBadge('');
  } else {
    const memoryLength = Object.keys(items['clips']).length;
    addClips(items['clips']);
    showBadge(memoryLength);
  }
});

/**
 * @description clears clips on the set date
 * @param {Object} settings settings object
 * @param {Number} delay the set self destruct days interval
 * @param {Number} datePassed date expended
 */
const clearOnSetDate = (settings, delay, datePassed) => {
  if (datePassed >= delay) {
    chrome.storage.sync.set({
      settings: { ...settings, date: new Date().getUTCDay() },
    });
    chrome.storage.sync.remove('clips');
    setEmptyView();
  }
};

chrome.storage.sync.get('settings', items => {
  const { delay, date, theme } = items['settings'];
  initializeTheme(theme, documentBody, footerWithHeader, elements);
  const thisDay = new Date().getUTCDay();
  if (delay !== 0 && thisDay !== date) {
    if (thisDay < date) {
      const dateDiff = Math.abs(thisDay - date);
      const datePassed = date - dateDiff;
      clearOnSetDate(items['settings'], delay, datePassed);
    } else {
      const datePassed = thisDay - date;
      clearOnSetDate(items['settings'], delay, datePassed);
    }
  }
});

select('.prompt').addEventListener('click', () => {
  const instruction = select('.copyPrompt');
  const editor = select('.clipText');
  instruction.style.display = 'none';
  editor.style.display = 'block';
  editor.focus();
});

select('.clipText').addEventListener('keypress', e => {
  const { keyCode, shiftKey } = e;
  if (keyCode === 13 && shiftKey !== true) {
    e.preventDefault();
    chrome.storage.sync.get('clips', items => {
      const allClips = items['clips'];
      const clipExist = typeof allClips === 'object';
      const itemToClip = manualText.value.trim();
      const itemToClipIsValid = itemToClip !== '';
      if (
        clipExist &&
        itemToClipIsValid &&
        checkClipExist(items['clips'], itemToClip)
      ) {
        const maxId = Math.max(...Object.keys(allClips));
        const clips = {
          ...items['clips'],
          [maxId + 1]: itemToClip,
        };
        chrome.storage.sync.set({ clips }, () => {
          addClips(clips);
        });
        showBadge(Object.keys(clips).length);
      } else if (!clipExist && itemToClipIsValid) {
        const clips = { 1: itemToClip };
        chrome.storage.sync.set({ clips }, () => {
          addClips(clips);
        });
      }
      manualText.value = '';
      clearAll.style.visibility = 'visible';
      manualText.focus();
      emptyPrompt.style.display = 'none';
      hint.style.display = 'block';
    });
  }
});

singleClip.addEventListener('mouseover', e => {
  if (e.target.className === 'content') {
    preview.style.display = 'none';
    text.style.display = 'block';
    text.innerHTML = e.target.innerText.trim().replace(/&/g, '&amp;');
  }
});

singleClip.addEventListener('mouseout', () => {
  preview.style.display = 'block';
  text.style.display = 'none';
});

clearAll.addEventListener('click', () => {
  setEmptyView();
});

singleClip.addEventListener('click', e => {
  if (e.target.className === 'deleteClip') {
    const { id } = e.target.previousElementSibling;
    let remainingItems = {};
    chrome.storage.sync.get('clips', items => {
      const memoryId = id.substr(2);
      const newKeys = Object.keys(items['clips']).filter(id => id !== memoryId);
      newKeys.forEach(key => {
        remainingItems = {
          ...remainingItems,
          [`${key}`]: items['clips'][`${key}`],
        };
      });
      chrome.storage.sync.set({ clips: remainingItems });
      const memoryLength = newKeys.length;
      if (memoryLength === 0) {
        setEmptyView();
      } else {
        addClips(remainingItems);
        showBadge(memoryLength);
      }
    });
  }
});

/**
 * @description saves items from multiClip storage to device clipboard
 * @param {string} data string to be saved to the clipBoard
 */
const copyToClipBoard = data => {
  navigator.clipboard.writeText(data);
};

singleClip.addEventListener('click', e => {
  const target = e.target.className;
  if (target === 'copy' || 'content') {
    if (target === 'content') {
      copyToClipBoard(e.target.innerHTML.trim().replace(/&amp;/g, '&'));
    } else if (target === 'copy') {
      copyToClipBoard(e.target.nextElementSibling.innerHTML.trim().replace(/&amp;/g, '&'));
    }
  }
});

bugReport.addEventListener('click', () => {
  navigateTo('https://github.com/Oluwasegun-AA/MultiClip/issues');
});

kofi.addEventListener('click', () => {
  navigateTo('https://ko-fi.com/oluwasegun');
});

logo.addEventListener('click', () => {
  navigateTo('https://github.com/Oluwasegun-AA/MultiClip');
});
