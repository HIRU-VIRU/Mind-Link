// Translator - Multi-language support using Chrome Translator API
// Translates phishing warnings and T&C findings for global accessibility
(function () {
  console.log('[Mind-Link Translator] Initializing...');

  // Skip on file:// URLs
  if (window.location.protocol === 'file:') {
    return;
  }

  // Detect user's preferred language
  function detectUserLanguage() {
    // Try multiple sources for language detection
    const browserLang = navigator.language || navigator.userLanguage;
    const htmlLang = document.documentElement.lang;
    
    // Extract language code (e.g., 'en-US' → 'en')
    const lang = (htmlLang || browserLang || 'en').split('-')[0].toLowerCase();
    
    console.log('[Mind-Link Translator] Detected language:', lang);
    return lang;
  }

  // Check if translation is needed
  function needsTranslation(targetLang) {
    // Skip translation if target is English or already translated
    return targetLang !== 'en' && targetLang !== 'eng';
  }

  // Translate text using Chrome Translator API
  async function translateText(text, targetLang) {
    try {
      if (!needsTranslation(targetLang)) {
        return text; // No translation needed
      }

      // Check if Translator API is available
      if (!self.translation || !self.translation.canTranslate) {
        console.warn('[Mind-Link Translator] Translator API not available');
        return text;
      }

      // Check if translation is supported
      const canTranslate = await self.translation.canTranslate({
        sourceLanguage: 'en',
        targetLanguage: targetLang
      });

      if (canTranslate === 'no') {
        console.warn(`[Mind-Link Translator] Translation to ${targetLang} not supported`);
        return text;
      }

      // Create translator
      const translator = await self.translation.createTranslator({
        sourceLanguage: 'en',
        targetLanguage: targetLang
      });

      // Translate text
      const translated = await translator.translate(text);
      console.log(`[Mind-Link Translator] Translated to ${targetLang}:`, translated);
      
      return translated;

    } catch (e) {
      console.error('[Mind-Link Translator] Translation error:', e);
      return text; // Return original text on error
    }
  }

  // Translate warning messages
  async function translateWarning(warning, targetLang) {
    if (!needsTranslation(targetLang)) {
      return warning;
    }

    try {
      const translatedTitle = await translateText(warning.title, targetLang);
      const translatedMessage = await translateText(warning.message, targetLang);
      const translatedActions = await Promise.all(
        (warning.actions || []).map(action => translateText(action, targetLang))
      );

      return {
        ...warning,
        title: translatedTitle,
        message: translatedMessage,
        actions: translatedActions,
        originalLanguage: 'en',
        translatedLanguage: targetLang
      };
    } catch (e) {
      console.error('[Mind-Link Translator] Warning translation error:', e);
      return warning;
    }
  }

  // Translate trust score labels
  async function translateTrustScore(trustScore, label, message, targetLang) {
    if (!needsTranslation(targetLang)) {
      return { label, message };
    }

    try {
      const translatedLabel = await translateText(label, targetLang);
      const translatedMessage = await translateText(message, targetLang);

      return {
        label: translatedLabel,
        message: translatedMessage
      };
    } catch (e) {
      console.error('[Mind-Link Translator] Trust score translation error:', e);
      return { label, message };
    }
  }

  // Translate T&C findings
  async function translateTCFindings(findings, targetLang) {
    if (!needsTranslation(targetLang)) {
      return findings;
    }

    try {
      if (Array.isArray(findings)) {
        // Translate array of findings
        return await Promise.all(
          findings.map(finding => translateText(finding, targetLang))
        );
      } else if (typeof findings === 'string') {
        // Translate single finding
        return await translateText(findings, targetLang);
      }
      return findings;
    } catch (e) {
      console.error('[Mind-Link Translator] T&C findings translation error:', e);
      return findings;
    }
  }

  // Supported languages (Chrome Translator API)
  const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'pl', name: 'Polski' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'vi', name: 'Tiếng Việt' }
  ];

  // Get language name from code
  function getLanguageName(code) {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    return lang ? lang.name : code.toUpperCase();
  }

  // Expose translator API globally
  window.__mindlink_translator = {
    detectUserLanguage,
    translateText,
    translateWarning,
    translateTrustScore,
    translateTCFindings,
    needsTranslation,
    getLanguageName,
    SUPPORTED_LANGUAGES
  };

  console.log('[Mind-Link Translator] Initialized successfully');
})();
