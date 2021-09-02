
import defaultSettings from '@/settings'
import store from '../store'
export default function getPageTitle(pageTitle) {
  let title = store.getters.companyName || defaultSettings.title
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}