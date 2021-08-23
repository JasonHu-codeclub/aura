import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import locale from 'element-ui/lib/locale'
import en from './en'
import zh_CN from './zh'
import zh_HK from './tw'

Vue.use(VueI18n)

const messages = {
  en,
  zh_CN,
  zh_HK
}
export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'zh_CN'
}
console.log(getLanguage(),'getLanguage()')
const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage()||'zh_CN',
  // set locale messages
  messages
})
locale.i18n((key, value) => i18n.t(key, value))
export default i18n
