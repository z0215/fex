export const isWindows = () => /Windows/.test(navigator.userAgent)

export const isLinux = () => /Linux/.test(navigator.userAgent)

export const isMac = () => /Macintosh/.test(navigator.userAgent)

export const isIpad = () => /iPad/.test(navigator.userAgent)

export const isIPhone = () => /iPhone/.test(navigator.userAgent)

export const isMobile = () => /Mobi/.test(navigator.userAgent)

export const isAndroid = () => /Android/.test(navigator.userAgent)

export const isIOS = () => (isMac() || isIpad() || isIPhone()) && navigator.maxTouchPoints > 0

export const isFireFox = () => /Firefox/.test(navigator.userAgent)

export const isChrome = () => /Chrome/.test(navigator.userAgent)

export const isSafari = () => /Safari/.test(navigator.userAgent) && !isChrome()

export const isEdge = () => /Edg\//.test(navigator.userAgent)
