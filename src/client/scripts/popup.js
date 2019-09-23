const select = document.querySelector.bind(document);

const emptyPrompt = select('.emptyPrompt');
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
  const { delay, date } = items['settings'];
  const thisDay = new Date().getUTCDay();
  if (delay !== 0 && thisDay !== date) {
    if (thisDay < date) {
      const dateDiff = Math.abs(thisDay - date);
      const datePassed = date - dateDiff;
      clearOnSetDate(delay, datePassed);
    } else {
      const datePassed = thisDay - date;
      clearOnSetDate(delay, datePassed);
    }
  }
});

const clearOnSetDate = (delay, datePassed) => {
  if (datePassed >= delay) {
    chrome.storage.sync.set({
      settings: { ...items['settings'], date: new Date().getUTCDay() },
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
  console.log(e);
  if (keyCode === 13 && shiftKey !== true) {
    e.preventDefault();
    chrome.storage.sync.get('clips', items => {
      if (typeof items['clips'] === 'object') {
        const clips = {
          ...items['clips'],
          [Object.keys(items['clips']).length + 1]: manualText.value,
        };
        console.log('val', manualText.value);
        console.log('items', clips);
        chrome.storage.sync.set({ clips: clips }, () => {
          addClips(clips);
        });
        showBadge(Object.keys(clips).length);
      } else {
        const clips = { 1: manualText.value };
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
  if (e.target.className === 'copy' || 'content') {
    if (target === 'content') {
      return copyToClipBoard(e.target.innerHTML.trim());
    }
    copyToClipBoard(e.target.nextElementSibling.innerHTML.trim());
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

//dark mode
// function click(e) {
//   chrome.tabs.executeScript(null,
//       {code:"document.body.style.backgroundColor='" + e.target.id + "'"});
//   window.close();
// }
// document.addEventListener('DOMContentLoaded', function () {
//   var divs = document.querySelectorAll('div');
//   for (var i = 0; i < divs.length; i++) {
//     divs[i].addEventListener('click', click);
//   }
// });

// on command recieved
// chrome.commands.onCommand.addListener(function(command) {
//   console.log('onCommand event received for message: ', command);
// });
