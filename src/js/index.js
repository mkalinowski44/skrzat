import CookieManager from "./CookieManager"

const navCategoryButtons = document.getElementsByClassName('nav-category-title');
var expandedCategories = CookieManager.getCookie('expandedCategories')
if(!Array.isArray(expandedCategories)) expandedCategories = []

expandedCategories.forEach(name => {
  const navCategory = document.querySelector(`nav .nav-category[data-category-name="${name}"`)
  navCategory.classList.add('expanded')
})

for (let i = 0; i < navCategoryButtons.length; i++) {
  navCategoryButtons[i].addEventListener('click', function() {
    const navCategory = this.parentNode
    const navCategoryName = navCategory.dataset.categoryName
    const hasClass = navCategory.classList.toggle('expanded')


    if(hasClass) {
      if(!expandedCategories.includes(navCategoryName)) {
        expandedCategories.push(navCategoryName)
      }
    } else {
      if(expandedCategories.includes(navCategoryName)) {
        expandedCategories.splice(expandedCategories.indexOf(navCategoryName), 1)
      }
    }
    CookieManager.setCookie('expandedCategories', expandedCategories)
  })
}

const navToggle = document.getElementById('nav-toggle')
const wrapper = document.querySelector('.wrapper')
const pageOverlay = document.getElementById('page-overlay')
var isSidebarShowed = false

navToggle.addEventListener('click', () => {
  isSidebarShowed = wrapper.classList.toggle('show-sidebar')
})
pageOverlay.addEventListener('click', () => {
  if(isSidebarShowed) wrapper.classList.remove('show-sidebar')
})