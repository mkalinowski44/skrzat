export default class CookieManager {
  static ARRAY_SEPARATOR = '|'
  static ARRAY_PREFIX = 'array'

  static setCookie(name, value, expirationDays = 365) {
    if(Array.isArray(value)) {
      value = this.ARRAY_PREFIX +
              (value.length > 0 ? this.ARRAY_SEPARATOR : '') +
              value.join(this.ARRAY_SEPARATOR)
    }
    const date = new Date()
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000))
    const expires = "expires=" + date.toUTCString()
    document.cookie = name + "=" + value + ";" + expires + ";path=/"
  }

  static getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookies = decodedCookie.split(';')

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i]
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1)
      }
      if (cookie.indexOf(name + "=") === 0) {
        const value = cookie.substring(name.length + 1, cookie.length)
        if(value.startsWith(this.ARRAY_PREFIX + this.ARRAY_SEPARATOR) || value === this.ARRAY_PREFIX ) {
          const array = value.split(this.ARRAY_SEPARATOR)
          array.shift()
          return array
        }
        return value
      }
    }

    return ""
  }

  static deleteCookie(name) {
    this.setCookie(name, '', -1)
  }

  static getAllCookies() {
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookies = decodedCookie.split(';')
    const result = {}

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i]
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1)
      }

      const delimiterIndex = cookie.indexOf("=")
      const name = cookie.substring(0, delimiterIndex)
      const value = cookie.substring(delimiterIndex + 1)
      if(value.startsWith(this.ARRAY_PREFIX + this.ARRAY_SEPARATOR)) {
        const array = value.split(this.ARRAY_SEPARATOR)
        array.shift()
        result[name] = array
      } else {
        result[name] = value
      }
    }

    return result
  }
}