const setI18nValue = (item) => {
  const { className } = item;
  item.innerHTML = chrome.i18n.getMessage(className);
};

export default setI18nValue;
