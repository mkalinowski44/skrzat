import CookieManager from "./CookieManager"

export default class NavigationManager {
  constructor() {
    this.navCategoryButtons = document.getElementsByClassName('nav-category-title');
    this.expandedCategories = CookieManager.getCookie('expandedCategories');
    if (!Array.isArray(this.expandedCategories)) this.expandedCategories = [];

    this.navToggle = document.getElementById('nav-toggle');
    this.wrapper = document.querySelector('.wrapper');
    this.pageOverlay = document.getElementById('page-overlay');
    this.isSidebarShowed = false;

    this.initCategories()
    this.initEventListeners()
    this.scrollToElement('.nav-scroller .simplebar-content-wrapper', '.nav-link.active')
  }

  initCategories() {
    this.expandedCategoriesToDelete = [];
    this.expandCategories();
    this.removeDeletedCategories();
  }

  initEventListeners() {
    for (let i = 0; i < this.navCategoryButtons.length; i++) {
      this.navCategoryButtons[i].addEventListener('click', this.toggleCategory.bind(this));
    }

    this.navToggle.addEventListener('click', this.toggleSidebar.bind(this));
    this.pageOverlay.addEventListener('click', this.closeSidebar.bind(this));
  }

  expandCategories() {
    this.expandedCategories.forEach((name, index) => {
      const navCategory = document.querySelector(`nav .nav-category[data-category-name="${name}"]`);
      if (navCategory) {
        navCategory.classList.add('expanded');
      } else {
        this.expandedCategoriesToDelete.push(index);
      }
    });
  }

  removeDeletedCategories() {
    if (this.expandedCategoriesToDelete.length) {
      this.expandedCategoriesToDelete.forEach(element => {
        this.expandedCategories.splice(element, 1);
      });
      CookieManager.setCookie('expandedCategories', this.expandedCategories);
    }
  }

  toggleCategory({srcElement}) {
    const navCategory = srcElement.parentNode;
    const navCategoryName = navCategory.dataset.categoryName;
    const hasClass = navCategory.classList.toggle('expanded');

    if (hasClass) {
      if (!this.expandedCategories.includes(navCategoryName)) {
        this.expandedCategories.push(navCategoryName);
      }
    } else {
      if (this.expandedCategories.includes(navCategoryName)) {
        this.expandedCategories.splice(this.expandedCategories.indexOf(navCategoryName), 1);
      }
    }
    CookieManager.setCookie('expandedCategories', this.expandedCategories);
  }

  toggleSidebar() {
    this.isSidebarShowed = this.wrapper.classList.toggle('show-sidebar');
  }

  closeSidebar() {
    if (this.isSidebarShowed) {
      this.wrapper.classList.remove('show-sidebar');
    }
  }

  scrollToElement(parentElQuery, targetElQuery) {
    window.addEventListener('load', function() {
      const parentEl = document.querySelector(parentElQuery)
      if(!parentEl) return
      const targetEl = parentEl.querySelector(targetElQuery)
      if (parentEl && targetEl) {
        parentEl.scrollTop = targetEl.offsetTop - parentEl.offsetTop - (parentEl.offsetHeight / 2) + (targetEl.offsetHeight / 2)
      }
    });
  }
}