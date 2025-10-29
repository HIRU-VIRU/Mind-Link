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

    displayData(trustScore, adsBlocked, totalAdsBlocked, totalThreatsBlocked, hostname, currentLanguage, tab.id);

  } catch (e) {
    console.error('Popup error:', e);
    showError('Error loading data');
  }
})();

async function displayData(trustScore, adsBlocked, totalAdsBlocked, totalThreatsBlocked, hostname, currentLanguage, tabId) {
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
      language: 'Language',
      viewTCAnalysis: 'View T&C Analysis',
      analyzeTCs: 'Analyze Terms & Conditions',
      tcNotAvailable: 'No T&C analysis available',
      tcClickToAnalyze: 'Click to analyze this page\'s terms'
    },
    hi: {
      trustScore: 'विश्वास स्कोर',
      dangerous: 'खतरनाक',
      warning: 'चेतावनी',
      safe: 'सुरक्षित',
      notRated: 'मूल्यांकन नहीं',
      dangerousMsg: 'यह साइट बहुत संदिग्ध लगती है',
      warningMsg: 'यह साइट संदिग्ध हो सकती है',
      safeMsg: 'यह साइट सुरक्षित दिखती है',
      notAnalyzed: 'विश्लेषण नहीं किया गया',
      autoAnalysisMsg: 'जब आप संदिग्ध साइटों पर जाते हैं तो विश्लेषण स्वचालित रूप से चलेगा',
      adsBlocked: 'विज्ञापन अवरुद्ध',
      onThisSite: 'इस साइट पर',
      threatsBlocked: 'खतरे अवरुद्ध',
      allTime: 'सभी समय',
      refresh: 'विश्लेषण ताज़ा करें',
      settings: 'सेटिंग्स',
      language: 'भाषा',
      viewTCAnalysis: 'T&C विश्लेषण देखें',
      analyzeTCs: 'नियम और शर्तें विश्लेषण करें',
      tcNotAvailable: 'कोई T&C विश्लेषण उपलब्ध नहीं',
      tcClickToAnalyze: 'इस पृष्ठ की शर्तों का विश्लेषण करने के लिए क्लिक करें'
    },
    es: {
      trustScore: 'Puntuación de Confianza',
      dangerous: 'Peligroso',
      warning: 'Advertencia',
      safe: 'Seguro',
      notRated: 'No Calificado',
      dangerousMsg: 'Este sitio parece muy sospechoso',
      warningMsg: 'Este sitio puede ser sospechoso',
      safeMsg: 'Este sitio parece seguro',
      notAnalyzed: 'No Analizado',
      autoAnalysisMsg: 'El análisis se ejecutará automáticamente cuando visite sitios sospechosos',
      adsBlocked: 'Anuncios Bloqueados',
      onThisSite: 'En este sitio',
      threatsBlocked: 'Amenazas Bloqueadas',
      allTime: 'Todo el tiempo',
      refresh: 'Actualizar Análisis',
      settings: 'Configuración',
      language: 'Idioma',
      viewTCAnalysis: 'Ver Análisis de T&C',
      analyzeTCs: 'Analizar Términos y Condiciones',
      tcNotAvailable: 'No hay análisis de T&C disponible',
      tcClickToAnalyze: 'Haga clic para analizar los términos de esta página'
    },
    fr: {
      trustScore: 'Score de Confiance',
      dangerous: 'Dangereux',
      warning: 'Avertissement',
      safe: 'Sûr',
      notRated: 'Non Évalué',
      dangerousMsg: 'Ce site semble très suspect',
      warningMsg: 'Ce site peut être suspect',
      safeMsg: 'Ce site semble sûr',
      notAnalyzed: 'Non Analysé',
      autoAnalysisMsg: "L'analyse s'exécutera automatiquement lorsque vous visitez des sites suspects",
      adsBlocked: 'Publicités Bloquées',
      onThisSite: 'Sur ce site',
      threatsBlocked: 'Menaces Bloquées',
      allTime: 'Tout le temps',
      refresh: 'Actualiser l\'Analyse',
      settings: 'Paramètres',
      language: 'Langue',
      viewTCAnalysis: 'Voir l\'Analyse T&C',
      analyzeTCs: 'Analyser les Termes et Conditions',
      tcNotAvailable: 'Aucune analyse T&C disponible',
      tcClickToAnalyze: 'Cliquez pour analyser les termes de cette page'
    },
    de: {
      trustScore: 'Vertrauensbewertung',
      dangerous: 'Gefährlich',
      warning: 'Warnung',
      safe: 'Sicher',
      notRated: 'Nicht Bewertet',
      dangerousMsg: 'Diese Seite sieht sehr verdächtig aus',
      warningMsg: 'Diese Seite könnte verdächtig sein',
      safeMsg: 'Diese Seite erscheint sicher',
      notAnalyzed: 'Nicht Analysiert',
      autoAnalysisMsg: 'Die Analyse läuft automatisch, wenn Sie verdächtige Seiten besuchen',
      adsBlocked: 'Werbung Blockiert',
      onThisSite: 'Auf dieser Seite',
      threatsBlocked: 'Bedrohungen Blockiert',
      allTime: 'Insgesamt',
      refresh: 'Analyse Aktualisieren',
      settings: 'Einstellungen',
      language: 'Sprache',
      viewTCAnalysis: 'T&C-Analyse anzeigen',
      analyzeTCs: 'AGB analysieren',
      tcNotAvailable: 'Keine T&C-Analyse verfügbar',
      tcClickToAnalyze: 'Klicken Sie, um die Bedingungen dieser Seite zu analysieren'
    },
    it: {
      trustScore: 'Punteggio di Fiducia',
      dangerous: 'Pericoloso',
      warning: 'Avviso',
      safe: 'Sicuro',
      notRated: 'Non Valutato',
      dangerousMsg: 'Questo sito sembra molto sospetto',
      warningMsg: 'Questo sito potrebbe essere sospetto',
      safeMsg: 'Questo sito sembra sicuro',
      notAnalyzed: 'Non Analizzato',
      autoAnalysisMsg: "L'analisi verrà eseguita automaticamente quando visiti siti sospetti",
      adsBlocked: 'Annunci Bloccati',
      onThisSite: 'Su questo sito',
      threatsBlocked: 'Minacce Bloccate',
      allTime: 'Tutto il tempo',
      refresh: 'Aggiorna Analisi',
      settings: 'Impostazioni',
      language: 'Lingua',
      viewTCAnalysis: 'Visualizza Analisi T&C',
      analyzeTCs: 'Analizza Termini e Condizioni',
      tcNotAvailable: 'Nessuna analisi T&C disponibile',
      tcClickToAnalyze: 'Clicca per analizzare i termini di questa pagina'
    },
    pt: {
      trustScore: 'Pontuação de Confiança',
      dangerous: 'Perigoso',
      warning: 'Aviso',
      safe: 'Seguro',
      notRated: 'Não Avaliado',
      dangerousMsg: 'Este site parece muito suspeito',
      warningMsg: 'Este site pode ser suspeito',
      safeMsg: 'Este site parece seguro',
      notAnalyzed: 'Não Analisado',
      autoAnalysisMsg: 'A análise será executada automaticamente quando você visitar sites suspeitos',
      adsBlocked: 'Anúncios Bloqueados',
      onThisSite: 'Neste site',
      threatsBlocked: 'Ameaças Bloqueadas',
      allTime: 'Todo o tempo',
      refresh: 'Atualizar Análise',
      settings: 'Configurações',
      language: 'Idioma',
      viewTCAnalysis: 'Ver Análise de T&C',
      analyzeTCs: 'Analisar Termos e Condições',
      tcNotAvailable: 'Nenhuma análise de T&C disponível',
      tcClickToAnalyze: 'Clique para analisar os termos desta página'
    },
    ja: {
      trustScore: '信頼スコア',
      dangerous: '危険',
      warning: '警告',
      safe: '安全',
      notRated: '未評価',
      dangerousMsg: 'このサイトは非常に疑わしいようです',
      warningMsg: 'このサイトは疑わしい可能性があります',
      safeMsg: 'このサイトは安全なようです',
      notAnalyzed: '未分析',
      autoAnalysisMsg: '疑わしいサイトにアクセスすると自動的に分析が実行されます',
      adsBlocked: 'ブロックされた広告',
      onThisSite: 'このサイトで',
      threatsBlocked: 'ブロックされた脅威',
      allTime: '累計',
      refresh: '分析を更新',
      settings: '設定',
      language: '言語',
      viewTCAnalysis: 'T&C分析を表示',
      analyzeTCs: '利用規約を分析',
      tcNotAvailable: 'T&C分析が利用できません',
      tcClickToAnalyze: 'このページの規約を分析するにはクリックしてください'
    },
    zh: {
      trustScore: '信任评分',
      dangerous: '危险',
      warning: '警告',
      safe: '安全',
      notRated: '未评级',
      dangerousMsg: '该网站看起来非常可疑',
      warningMsg: '该网站可能可疑',
      safeMsg: '该网站似乎安全',
      notAnalyzed: '未分析',
      autoAnalysisMsg: '当您访问可疑网站时，分析将自动运行',
      adsBlocked: '已拦截广告',
      onThisSite: '在此网站上',
      threatsBlocked: '已拦截威胁',
      allTime: '总计',
      refresh: '刷新分析',
      settings: '设置',
      language: '语言',
      viewTCAnalysis: '查看条款分析',
      analyzeTCs: '分析条款和条件',
      tcNotAvailable: '没有可用的条款分析',
      tcClickToAnalyze: '点击分析此页面的条款'
    },
    ar: {
      trustScore: 'نقاط الثقة',
      dangerous: 'خطير',
      warning: 'تحذير',
      safe: 'آمن',
      notRated: 'غير مقيم',
      dangerousMsg: 'يبدو هذا الموقع مشبوهًا جدًا',
      warningMsg: 'قد يكون هذا الموقع مشبوهًا',
      safeMsg: 'يبدو هذا الموقع آمنًا',
      notAnalyzed: 'غير محلل',
      autoAnalysisMsg: 'سيتم تشغيل التحليل تلقائيًا عند زيارة المواقع المشبوهة',
      adsBlocked: 'الإعلانات المحظورة',
      onThisSite: 'على هذا الموقع',
      threatsBlocked: 'التهديدات المحظورة',
      allTime: 'طوال الوقت',
      refresh: 'تحديث التحليل',
      settings: 'الإعدادات',
      language: 'اللغة',
      viewTCAnalysis: 'عرض تحليل الشروط والأحكام',
      analyzeTCs: 'تحليل الشروط والأحكام',
      tcNotAvailable: 'لا يوجد تحليل للشروط والأحكام متاح',
      tcClickToAnalyze: 'انقر لتحليل شروط هذه الصفحة'
    }
  };

  const t = translations[currentLanguage] || translations['en'];

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

  // Get T&C analysis from storage
  const termsAnalysisKey = `termsAnalysis_${hostname}`;
  const termsResult = await chrome.storage.local.get([termsAnalysisKey]);
  const termsAnalysis = termsResult[termsAnalysisKey] || null;

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
    
    <div class="tc-analysis-section" style="margin-bottom: 20px;">
      <div class="section-title">📋 ${t.viewTCAnalysis}</div>
      ${termsAnalysis ? `
        <div class="tc-summary" style="
          background: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 10px;
        ">
          <div style="font-size: 13px; color: #15803d; margin-bottom: 8px; font-weight: 600;">
            ${termsAnalysis.severity >= 3 ? '⚠️ Issues Found' : '✅ Analysis Complete'}
          </div>
          <div style="font-size: 12px; color: #166534; line-height: 1.5;">
            ${termsAnalysis.findings && termsAnalysis.findings.length > 0
        ? `Found ${termsAnalysis.findings.length} potential issue${termsAnalysis.findings.length > 1 ? 's' : ''}`
        : 'No major issues detected'}
          </div>
        </div>
        <button class="btn btn-secondary" id="viewTCBtn" type="button">
          <span>👁️</span>
          <span>${t.viewTCAnalysis}</span>
        </button>
      ` : `
        <div class="tc-placeholder" style="
          background: var(--bg-light);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          padding: 12px;
          text-align: center;
          margin-bottom: 10px;
        ">
          <div style="font-size: 12px; color: var(--text-gray);">
            ${t.tcNotAvailable}
          </div>
        </div>
        <button class="btn btn-secondary" id="analyzeTCBtn" type="button">
          <span>🔍</span>
          <span>${t.analyzeTCs}</span>
        </button>
      `}
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
  const viewTCBtn = document.getElementById('viewTCBtn');
  const analyzeTCBtn = document.getElementById('analyzeTCBtn');
  const languageSelector = document.getElementById('languageSelector');

  // Refresh button handler
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

  // View T&C Analysis button handler
  if (viewTCBtn && termsAnalysis) {
    viewTCBtn.addEventListener('click', async () => {
      try {
        // Send message to content script to display the analysis modal
        chrome.tabs.sendMessage(tabId, {
          type: 'SHOW_TC_ANALYSIS',
          data: termsAnalysis
        });
        window.close();
      } catch (e) {
        console.error('View T&C error:', e);
      }
    });
  }

  // Analyze T&C button handler
  if (analyzeTCBtn) {
    analyzeTCBtn.addEventListener('click', async () => {
      try {
        // Send message to content script to trigger analysis
        chrome.tabs.sendMessage(tabId, {
          type: 'TRIGGER_TC_ANALYSIS'
        });
        window.close();
      } catch (e) {
        console.error('Analyze T&C error:', e);
      }
    });
  }

  if (languageSelector) {
    // Set current language as selected
    languageSelector.value = currentLanguage;

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

