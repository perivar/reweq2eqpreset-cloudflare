// import { resolve } from "node:path";

import { Resource } from "i18next";

import enTranslation from "./locales/en/translation.json";
import noTranslation from "./locales/no/translation.json";

export const translatedLanguages = [
  { code: "no", label: "Norsk", translation: noTranslation },
  { code: "en", label: "English", translation: enTranslation }, // the fallback language is the last in the list
];

export default {
  // This is the list of languages your application supports, the last one is your fallback language
  // Dynamically extract supported languages from translatedLanguages array
  supportedLngs: translatedLanguages.map(lang => lang.code),

  // This is the language you want to use in case the user language is not in the supportedLngs
  fallbackLng: translatedLanguages[translatedLanguages.length - 1].code,

  // The default namespace of i18next is "translation", but you can customize it
  defaultNS: "translation",

  // If using a backend instead of bundling the resource file, uncomment this, and comment out the resources
  // backend: { loadPath: resolve("./app/i18n/locales/{{lng}}/{{ns}}.json") },

  // These are the translation files we created, `translation` is the namespace
  // we want to use, we'll use this to include the translations in the bundle
  // instead of loading them on-demand
  // Passing `resources` to the `i18next` configuration, avoids using a backend
  // build a map like this dynamically:
  // resources: {
  //   en: { translation: enTranslation },
  //   no: { translation: noTranslation },
  // },
  resources: Object.fromEntries(
    translatedLanguages.map(lang => [
      lang.code,
      { translation: lang.translation },
    ])
  ) as Resource,
};
