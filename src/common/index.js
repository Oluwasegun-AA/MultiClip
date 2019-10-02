const checkClipExist = (oldClips, newClip) => {
  const clips = Object.keys(oldClips);
  return clips.every(key => oldClips[key] !== newClip);
};

const defaultSettings = {
  date: new Date().getUTCDay(),
  delay: 7,
  theme: 'light',
  language: 'english',
  autoSave: 'no',
};

const saveToClips = text => {
  chrome.storage.sync.get('clips', items => {
    const allClips = items.clips;
    const clipExist = typeof allClips === 'object';
    const itemToClip = text.trim();
    const itemToClipIsValid = itemToClip !== '';
    if (clipExist && itemToClipIsValid && checkClipExist(items.clips, text)) {
      const maxId = Math.max(...Object.keys(allClips));
      const clips = {
        ...items.clips,
        [maxId + 1]: itemToClip,
      };
      chrome.storage.sync.set({ clips });
    } else if (!clipExist && itemToClipIsValid) {
      const clips = { 1: text };
      chrome.storage.sync.set({ clips });
    }
  });
};

const showBadge = number => {
  chrome.browserAction.setBadgeText({ text: `${number}` });
};

const initializeTheme = (theme, documentBody, footerWithHeader, elements) => {
  if (theme === 'dark') {
    documentBody.style.backgroundColor = '#2f2d2d';
    documentBody.style.color = '#d6d3d3';
    footerWithHeader.forEach(item => {
      item.style.backgroundColor = '#2f2d2d';
    });
    elements.forEach(view => {
      view.style.backgroundColor = '#2f2d2d';
      view.style.border = 'none';
      view.style.color = '#d6d3d3';
    });
  } else {
    documentBody.style.backgroundColor = 'white';
    documentBody.style.color = 'black';
    footerWithHeader.forEach(item => {
      item.style.backgroundColor = 'white';
    });
    elements.forEach(view => {
      view.style.backgroundColor = 'white';
      view.style.color = 'black';
    });
  }
};

const navigateTo = URL => {
  chrome.tabs.create({ url: URL });
};

export {
  checkClipExist,
  defaultSettings,
  saveToClips,
  showBadge,
  initializeTheme,
  navigateTo
};
