import { saveToClips } from '../common/index';

const readClipBoard = (callback) => {
  navigator.clipboard
    .readText()
    .then(text => {
      callback(text);
    })
    .catch(e => {
      console.warn(
        'You need to authorize the page to access your clipboard in order to copy to multiClip',
        e
      );
    });
};

const copyMultiClip = () => {
  chrome.storage.sync.get('settings', items => {
    if (items.settings.autoSave === 'yes') {
      return readClipBoard(saveToClips);
    }
  });
};

document.addEventListener('copy', () => {
  copyMultiClip();
});
