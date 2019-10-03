/**
 * @description sets the content of as specified
 * UI element to the appropriate localization value
 * @param {Object} item the UI element
 */
const setI18nValue = item => {
  const { className } = item;
  item.innerHTML = chrome.i18n.getMessage(className);
};

/**
 * @description replaces the content of a Ui element with the appropriate values
 * @param {Array} items array of UI elements
 * @param {Object} values loaded local translation file
 */
const setCustomTranslation = (items, values) => {
  items.forEach(item => {
    const { className } = item;
    item.innerHTML = values[className].message;
  });
};

/**
 * @description replaces the content of a Ui element with the appropriate values
 *  in the default locale
 * @param {Array} items array of UI elements
 */
const setLocaleTranslation = items => {
  items.forEach(btn => {
    setI18nValue(btn);
  });
};

/**
 * @description loads a JSON file using XMLHttpRequest
 * @param {String} URL path to the JSON file
 * @param {Function} callback Function which manipulates the parsed JSON file
 */
const loadJSON = (URL, callback) => {
  const req = new XMLHttpRequest();
  req.overrideMimeType('application/json');
  req.open('GET', `${URL}`, true);
  req.onreadystatechange = () => {
    const { readyState, status } = req;
    if (readyState === 4 && status === 200) {
      callback(JSON.parse(req.responseText));
    }
  };
  req.send(null);
};

/**
 * @description sets translation to the pre-defined user value
 * @param {String} language language mode i.e en, fr, etc
 * @param {Array} translateMenu array of UI elements
 */
const setPreferredTranslation = (language, translateMenu) => {
  const translation = `/_locales/${language}/messages.json`;
  loadJSON(translation, values => setCustomTranslation(translateMenu, values));
};

/**
 * @description sets the style attributes of specified UI elements
 * @param {String} theme the current theme mode (dark or light)
 * @param {Object} documentBody UI element (body tag)
 * @param {Array} footerWithHeader UI element (footer with header)
 * @param {Array} elements UI elements (contents of body)
 */
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
      item.style.backgroundColor = '#eeeeee';
    });
    elements.forEach(view => {
      view.style.backgroundColor = 'white';
      view.style.color = 'black';
    });
  }
};

/**
 * @description sets translation to predefined mode when optional languages are selected
 * it also sets translation to the default locale's translation when the chrome local is used
 * @param {Function} callback1 function which sets translation to chrome's default locale
 * @param {Function} callback2 function which sets translation to a pre-defined mode
 */
const setDefaultLanguage = (callback1, callback2) => {
  chrome.storage.sync.get('settings', items => {
    const { language } = items.settings;
    if (language === 'default') return callback1();
    return callback2(language);
  });
};

/**
 * @description sets the translation with respect to pre-defined user settings
 * or chrome's default locale settings
 * @param {Array} translateMenu array of UI elements
 */
const setLanguage = translateMenu => {
  setDefaultLanguage(
    () => setLocaleTranslation(translateMenu),
    lang => setPreferredTranslation(lang, translateMenu)
  );
};

export {
  setLanguage,
  initializeTheme,
};
