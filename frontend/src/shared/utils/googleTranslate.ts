export type GoogleTranslateLang = 'es' | 'en' | 'pt' | 'fr' | 'it' | 'de' | 'zh-CN';

function waitForTranslateSelect(maxWaitMs = 2500): Promise<HTMLSelectElement | null> {
  return new Promise((resolve) => {
    const start = Date.now();
    const attempt = () => {
      const select = document.querySelector<HTMLSelectElement>('select.goog-te-combo');
      if (select) {
        resolve(select);
        return;
      }
      if (Date.now() - start >= maxWaitMs) {
        resolve(null);
        return;
      }
      window.setTimeout(attempt, 120);
    };
    attempt();
  });
}

export async function setGoogleTranslateLanguage(lang: GoogleTranslateLang) {
  const select = await waitForTranslateSelect();
  if (!select) return;
  if (select.value === lang) return;
  select.value = lang;
  select.dispatchEvent(new Event('change'));
}
