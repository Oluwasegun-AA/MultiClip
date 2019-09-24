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
const hintText = select('.hintText');
const text = select('.text');
const copy = select('.copy');
const bugReport = select('.bugReport');
const documentBody = select('body');
const elements = selectAll(
  '.bugReport, .clearAll, .emptyPrompt, .copyPrompt, .logo, .settings'
);
const footerWithHeader = selectAll('.footer, .header');
const translateMenu = selectAll('.settings, .clearAll, .bugReport, .emptyPrompt, .copyPrompt')

const getI18nValue=(field)=>{
  return  chrome.i18n.getMessage(field);
}

translateMenu.forEach((btn)=>{
  const {className} = btn;
  console.log(typeof className)
  btn.innerHTML = getI18nValue(className)
})

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

chrome.storage.sync.get('settings', items => {
  const { delay, date, theme } = items['settings'];
  initializeTheme(theme);
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

const initializeTheme = theme => {
  if (theme === 'dark') {
    documentBody.style.backgroundColor = '#2f2d2d';
    footerWithHeader.forEach(item => {
      item.style.backgroundColor = '#2f2d2d';
    });
    elements.forEach(view => {
      view.style.backgroundColor = '#2f2d2d';
      view.style.border = 'none';
      view.style.color = '#d6d3d3';
    });
    documentBody.style.color = '#d6d3d3';
  }
};

const clearOnSetDate = (settings, delay, datePassed) => {
  if (datePassed >= delay) {
    chrome.storage.sync.set({
      settings: { ...settings, date: new Date().getUTCDay() },
    });
    chrome.storage.sync.remove('clips');
    setEmptyView();
  }
};

select('.prompt').addEventListener('click', () => {
  console.log('hello');
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
        chrome.storage.sync.set({ clips: clips }, () => {
          addClips(clips);
        });
        showBadge(Object.keys(clips).length);
      } else if (!clipExist && itemToClipIsValid) {
        const clips = { 1: itemToClip };
        chrome.storage.sync.set({ clips: clips }, () => {
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

const addClips = clips => {
  let data = '';
  Object.keys(clips).forEach(key => {
    data += `
            <div id="no${key}" name="${key}" class="clip">
            <span class="copy">
            &#x2398;
            </span>
            <span id="no${key}" class="content">
            ${clips[`${key}`]}
            </span>
            <span class="deleteClip"> &#x274C; </span>
            </div>`;
  });
  clipSection.innerHTML = data;
};

singleClip.addEventListener('mouseover', e => {
  if (e.target.className === 'content') {
    hintText.style.display = 'none';
    text.style.display = 'block';
    text.innerHTML = e.target.innerText.trim();
  }
});
singleClip.addEventListener('mouseout', e => {
  hintText.style.display = 'block';
  text.style.display = 'none';
});

clearAll.addEventListener('click', () => {
  setEmptyView();
});

const showBadge = number => {
  chrome.browserAction.setBadgeText({ text: `${number}` });
};

singleClip.addEventListener('click', e => {
  if (e.target.className === 'deleteClip') {
    const { id, innerHTML } = e.target.previousElementSibling;
    let remainingItems = {};
    chrome.storage.sync.get('clips', items => {
      const memoryId = id.substr(2);
      const newKeys = Object.keys(items['clips']).filter(id => id !== memoryId);
      newKeys.forEach(key => {
        console.log(key);
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

singleClip.addEventListener('click', e => {
  const target = e.target.className;
  if (target === 'copy' || 'content') {
    if (target === 'content') {
      return copyToClipBoard(e.target.innerHTML.trim());
    } else if (target === 'copy') {
      copyToClipBoard(e.target.nextElementSibling.innerHTML.trim());
    }
  }
});

const copyToClipBoard = data => {
  navigator.clipboard
    .writeText(data)
    .then(text => {})
    .catch(e => {
      console.log('could not copy to clip board', e);
    });
};

bugReport.addEventListener('click', () => {
  const URL = 'https://github.com/Oluwasegun-AA/MultiClip/issues';
  chrome.tabs.create({ url: URL });
});

logo.addEventListener('click', () => {
  const URL = 'https://github.com/Oluwasegun-AA/MultiClip';
  chrome.tabs.create({ url: URL });
});

const checkClipExist = (oldClips, newClip) => {
  return Object.keys(oldClips).every(key => oldClips[key] !== newClip);
};
