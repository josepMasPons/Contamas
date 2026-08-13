//const API_URL = "https://libretranslate.de/translate";
//const API_URL = "https://translate.argosopentech.com/translate";
//const API_URL = "/translate";
const API_URL = "http://localhost:5000/translate";
/*
 * Tradueix text entre idiomes
 * @param {string} text - text a traduir
 * @param {string} source - idioma origen (ex: "ca", "en")
 * @param {string} target - idioma destí (ex: "es", "fr")
 * @returns {Promise<string>} text traduït
 */
export async function translateText(text, source, target) {
  if (!text) return "";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        source,
        target
        
      })
    });
    const data = await res.json();
      return data.translatedText;
  } catch (err) {
  console.error(err);
  console.error(err.message);
  return text;
}

}

