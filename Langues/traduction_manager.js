async function getTranslation(lang, key) {
    try {
      const response = await fetch(`/translation_${lang}.json`);
      const translations = await response.json();
      
      return translations[key] || key;
    } catch (error) {
      console.error("Error loading translation:", error);
      return key; 
    }
  }


  