// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateTitle(title) {
  // console.log(title,'title')
  // return
  const hasKey = this.$t(title)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t(title)
    return translatedTitle
  }
  return title
}
