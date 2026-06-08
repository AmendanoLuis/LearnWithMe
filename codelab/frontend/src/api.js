import { addRequest } from './inspectorStore.js'

const HTTP_LABELS = {
  200: '200 OK',
  201: '201 Created',
  404: '404 Not Found',
  422: '422 Unprocessable Entity',
}

function getStatusLabel(status) {
  return HTTP_LABELS[status] || `${status}`
}

export async function request(method, url, body = null, options = {}) {
  const start = Date.now()
  const headers = { 'Content-Type': 'application/json', ...options.headers }

  const fetchOptions = { method, headers, ...options }
  if (body !== null && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body)
  }

  let status = 0
  let responseData = null

  try {
    const res = await fetch(url, fetchOptions)
    status = res.status
    const text = await res.text()
    try {
      responseData = text ? JSON.parse(text) : null
    } catch {
      responseData = text
    }

    addRequest({
      method,
      url,
      payload: body,
      status,
      statusLabel: getStatusLabel(status),
      response: responseData,
      sqlLog: responseData?._sql_log || null,
      schemaInfo: status === 422 ? responseData : null,
      duration: Date.now() - start,
      source: 'servidor',
    })

    if (!res.ok) {
      const err = new Error(`HTTP ${status}`)
      err.status = status
      err.data = responseData
      throw err
    }

    return responseData
  } catch (e) {
    if (status === 0) {
      addRequest({
        method,
        url,
        payload: body,
        status: 0,
        statusLabel: 'Error de red',
        response: null,
        sqlLog: null,
        duration: Date.now() - start,
        error: e.message,
        source: 'servidor',
      })
    }
    throw e
  }
}

function parseList(res) {
  if (Array.isArray(res)) return res
  return res?.items || []
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body),
  put: (url, body) => request('PUT', url, body),
  delete: (url) => request('DELETE', url),
  notas: {
    list: async () => parseList(await request('GET', '/api/notas')),
    create: (data) => request('POST', '/api/notas', data),
    delete: (id) => request('DELETE', `/api/notas/${id}`),
  },
  productos: {
    list: async () => parseList(await request('GET', '/api/productos')),
    create: (data) => request('POST', '/api/productos', data),
    delete: (id) => request('DELETE', `/api/productos/${id}`),
  },
}
