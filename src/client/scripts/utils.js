const setI18nValue = (item) => {
  const { className } = item;
  item.innerHTML = chrome.i18n.getMessage(className);
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

export {
  setI18nValue,
  initializeTheme
};
