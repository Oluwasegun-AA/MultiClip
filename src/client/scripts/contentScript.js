const copyToClipBoard = () => {
  chrome.storage.sync.get('settings', items => {
    if (items['settings'].autoSave === 'yes') {
      return navigator.clipboard
        .readText()
        .then(text => {
          console.log(text);
          chrome.storage.sync.get('clips', items => {
            if (typeof items['clips'] === 'object') {
              const clips = {
                ...items['clips'],
                [Object.keys(items['clips']).length + 1]: text,
              };
              chrome.storage.sync.set({ clips: clips });
            } else {
              const clips = { 1: text };
              chrome.storage.sync.set({ clips: clips });
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

document.addEventListener('copy', e => {
  copyToClipBoard();
});
