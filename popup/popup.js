// Enhanced Popup Script with Translator Support and Modern UI
(async function () {
  const contentDiv = document.getElementById('content');
  let currentLanguage = 'en';
  
  // Detect user language
  try {
    const lang = (navigator.language || 'en').split('-')[0].toLowerCase();
    currentLanguage = lang;
  } catch (e) {
    currentLanguage = 'en';
  }

  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id || !tab.url) {
      showError('Unable to access current tab');
      return;
    }

    // Skip chrome:// and extension pages
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      showError('Cannot analyze Chrome internal pages');
      return;
    }

    const hostname = new URL(tab.url).hostname;

    // Get data from storage
    const storageKey = `trustScore_${hostname}`;
    const adsKey = `adsBlocked_${hostname}`;
    const totalAdsKey = 'totalAdsBlocked';
    const threatsKey = 'totalThreatsBlocked';

    const result = await chrome.storage.local.get([
      storageKey, 
      adsKey, 
      totalAdsKey, 
      threatsKey,
      'userLanguage'
    ]);

    const trustScore = result[storageKey] || null;
    const adsBlocked = result[adsKey] || 0;
    const totalAdsBlocked = result[totalAdsKey] || 0;
    const totalThreatsBlocked = result[threatsKey] || 0;
    
    // Use stored language preference or detected language
    currentLanguage = result.userLanguage || currentLanguage;

    displayData(trustScore, adsBlocked, totalAdsBlocked, totalThreatsBlocked, hostname);

  } catch (e) {
    console.error('Popup error:', e);
    showError('Error loading data');
  }
})();

async function displayData(trustScore, adsBlocked, totalAdsBlocked, totalThreatsBlocked, hostname) {
  const contentDiv = document.getElementById('content');

  // Translations
  const translations = {
    en: {
      trustScore: 'Trust Score',
      dangerous: 'Dangerous',
      warning: 'Warning',
      safe: 'Safe',
      notRated: 'Not Rated',
      dangerousMsg: 'This site looks very suspicious',
      warningMsg: 'This site may be suspicious',
      safeMsg: 'This site appears safe',
      notAnalyzed: 'Not Analyzed',
      autoAnalysisMsg: 'Analysis will run automatically when you visit suspicious sites',
      adsBlocked: 'Ads Blocked',
      onThisSite: 'On this site',
      threatsBlocked: 'Threats Blocked',
      allTime: 'All time',
      refresh: 'Refresh Analysis',
      settings: 'Settings',
      language: 'Language'
    }
  };

  const t = translations['en']; // Default to English for now

  let trustHTML = '';
  let emoji = '🔍';
  let label = t.notRated;
  let message = t.notAnalyzed;
  let scoreClass = '';
  let progressPercent = 0;

  if (trustScore !== null) {
    progressPercent = (trustScore / 5) * 100;
    
    if (trustScore <= 2) {
      scoreClass = 'danger';
      emoji = '🛑';
      label = t.dangerous;
      message = t.dangerousMsg;
    } else if (trustScore === 3) {
      scoreClass = 'warning';
      emoji = '⚠️';
      label = t.warning;
      message = t.warningMsg;
    } else if (trustScore >= 4) {
      scoreClass = 'safe';
      emoji = '✅';
      label = t.safe;
      message = t.safeMsg;
    }

    trustHTML = `
      <div class="trust-score-section">
        <div class="section-title">${t.trustScore}</div>
        <div class="trust-score-card ${scoreClass}">
          <div class="trust-circle">
            <svg viewBox="0 0 120 120">
              <circle
                class="trust-circle-bg"
                cx="60"
                cy="60"
                r="52"
              />
              <circle
                class="trust-circle-progress ${scoreClass}"
                cx="60"
                cy="60"
                r="52"
                stroke-dasharray="${2 * Math.PI * 52}"
                stroke-dashoffset="${2 * Math.PI * 52 * (1 - progressPercent / 100)}"
              />
            </svg>
            <div class="trust-circle-content">
              <div class="trust-emoji">${emoji}</div>
              <div class="trust-value">${trustScore}/5</div>
            </div>
          </div>
          <div class="trust-label">${label}</div>
          <div class="trust-message">${message}</div>
        </div>
      </div>
    `;
  } else {
    trustHTML = `
      <div class="trust-score-section">
        <div class="section-title">${t.trustScore}</div>
        <div class="trust-score-card">
          <div class="trust-circle">
            <svg viewBox="0 0 120 120">
              <circle
                class="trust-circle-bg"
                cx="60"
                cy="60"
                r="52"
              />
            </svg>
            <div class="trust-circle-content">
              <div class="trust-emoji">${emoji}</div>
              <div class="trust-value">—</div>
            </div>
          </div>
          <div class="trust-label">${label}</div>
          <div class="trust-message">${t.autoAnalysisMsg}</div>
        </div>
      </div>
    `;
  }

  // Language selector
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' }
  ];

  const languageOptions = languages
    .map(lang => `<option value="${lang.code}">${lang.name}</option>`)
    .join('');

  contentDiv.innerHTML = `
    ${trustHTML}
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🚫</div>
        <div class="stat-value">${adsBlocked}</div>
        <div class="stat-label">${t.adsBlocked}</div>
        <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">${t.onThisSite}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🛡️</div>
        <div class="stat-value">${totalThreatsBlocked || 0}</div>
        <div class="stat-label">${t.threatsBlocked}</div>
        <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">${t.allTime}</div>
      </div>
    </div>
    
    <div class="language-section">
      <div class="section-title">${t.language}</div>
      <select class="language-selector" id="languageSelector">
        ${languageOptions}
      </select>
    </div>
    
    <div class="actions">
      <button class="btn btn-primary" id="refreshBtn" type="button">
        <span>🔄</span>
        <span>${t.refresh}</span>
      </button>
    </div>
  `;

  // Add event listeners
  const refreshBtn = document.getElementById('refreshBtn');
  const languageSelector = document.getElementById('languageSelector');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id) {
          // Trigger a new phishing check
          chrome.tabs.sendMessage(tab.id, { type: 'RECHECK_PHISHING' });
          window.close();
        }
      } catch (e) {
        console.error('Refresh error:', e);
      }
    });
  }

  if (languageSelector) {
    languageSelector.addEventListener('change', async (e) => {
      const newLang = e.target.value;
      
      // Save language preference
      await chrome.storage.local.set({ userLanguage: newLang });
      
      // Reload popup with new language
      location.reload();
    });
  }
}


function showError(message) {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = `
    <div class="error">
      <div style="font-size: 48px; margin-bottom: 12px;">⚠️</div>
      <p>${message}</p>
    </div>
  `;
}

