const checkClipExist = (oldClips, newClip) => {
  const clips = Object.keys(oldClips);
  return clips.every(key => oldClips[key] !== newClip);
};

const defaultSettings = {
  date: new Date().getUTCDay(),
  delay: 7,
  theme: 'light',
  autoSave: 'no',
};

export {
  checkClipExist,
  defaultSettings
}