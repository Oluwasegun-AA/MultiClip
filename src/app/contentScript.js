import { checkClipExist } from '../common/index';

const copyToClipBoard = () => {
  chrome.storage.sync.get('settings', items => {
    if (items.settings.autoSave === 'yes') {
      return navigator.clipboard
        .readText()
        .then(text => {
          chrome.storage.sync.get('clips', items => {
            const allClips = items.clips;
            const clipExist = typeof allClips === 'object';
            const itemToClip = text.trim();
            const itemToClipIsValid = itemToClip !== '';
            if (
              clipExist &&
              itemToClipIsValid &&
              checkClipExist(items.clips, text)
            ) {
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
        })
        .catch(e => {
          console.warn(
            'You need to authorize the page to access your clipboard in order to copy to multiClip',
            e
          );
        });
    }
  });
};

document.addEventListener('copy', () => {
  copyToClipBoard();
});
