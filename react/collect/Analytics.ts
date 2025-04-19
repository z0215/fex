
interface TrackPageView {
  event: 'page_view'
  url: string
}

interface TrackClick {
  event: 'click'
  url: string
  class: string
  text: string
}

interface TrackError {
  event: 'error'
  url: string
  message: string
  source: string
  lineno: number
  colno: number
  stack: any
}

interface TrackPromiseReject {
  event: 'reject'
  url: string
  message: string
  source: string
  lineno: number
  colno: number
  stack: any
}

 type SendData = TrackPageView | TrackClick | TrackError | TrackPromiseReject

class Analytics {
  private endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  send(data: SendData) {
    navigator.sendBeacon(this.endpoint, JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
    }))
  }

  sendError = (event: ErrorEvent) => {
    this.send({
      event: 'error',
      url: window.location.href,
      message: event.message,
      source: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error ? event.error.stack : null,
    })
  }

  sendRejectError = (event: PromiseRejectionEvent) => {
    this.send({
      event: 'reject',
      url: window.location.href,
      message: event.reason.message,
      source: event.reason.filename,
      lineno: event.reason.lineno,
      colno: event.reason.colno,
      stack: event.reason.stack,
    })
  }

  sendPageView = () => {
    this.send({
      event: 'page_view',
      url: window.location.href,
    })
  }

  sendClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    this.send({
      event: 'click',
      class: target.className,
      url: window.location.href,
      text: target.textContent ?? '',
    })
  }

  init() {
    window.addEventListener('error', this.sendError)
    window.addEventListener('unhandledrejection', this.sendRejectError)
    window.addEventListener('load', this.sendPageView)
    document.addEventListener('click', this.sendClick)
  }

  dispose() {
    window.removeEventListener('error', this.sendError)
    window.removeEventListener('unhandledrejection', this.sendRejectError)
    window.removeEventListener('load', this.sendPageView)
    document.removeEventListener('click', this.sendClick)
  }
}

export const analytics = new Analytics('/analytics-endpoint')
