/** Parsers para código JavaScript de las lecciones — sin eval */

function stripComments(code) {
  return code
    .split('\n')
    .map((l) => l.replace(/\/\/.*$/, '').trim())
    .filter(Boolean)
    .join('\n')
}

function declPrefix() {
  return '(?:let|const|var)\\s+'
}

function parseValue(raw) {
  const trimmed = raw.trim().replace(/;$/, '')
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return { valor: trimmed.slice(1, -1), tipo: 'texto' }
  }
  if (trimmed === 'true' || trimmed === 'false') {
    return { valor: trimmed, tipo: 'sí/no' }
  }
  if (!isNaN(Number(trimmed))) {
    return { valor: Number(trimmed), tipo: 'número' }
  }
  return { valor: trimmed, tipo: 'texto' }
}

function variableLineError(line) {
  if (/^(Let|Const|Var)\s/.test(line)) {
    return 'Las palabras clave van en minúscula: let, const o var (no Let, Const, Var)'
  }
  if (/^(?:let|const|var)\s+\d/.test(line)) {
    return 'El nombre de la variable no puede empezar por número. Ejemplo: let nombre1 = "Ana";'
  }
  const namePart = line.match(/^(?:let|const|var)\s+([^=]+)/)?.[1]?.trim()
  if (namePart && /\s/.test(namePart)) {
    return 'El nombre no puede tener espacios. Usa camelCase: let miNombre = "Ana";'
  }
  if (/^(?:let|const|var)\s+[^a-zA-Z_]/.test(line)) {
    return 'El nombre debe empezar por letra o guión bajo: let puntos = 100;'
  }
  return null
}

export function parseVariable(code) {
  const line = stripComments(code).split('\n')[0] || ''
  const specific = variableLineError(line)
  if (specific) return { ok: false, error: specific }

  const match = line.match(new RegExp(`^${declPrefix()}?([a-zA-Z_][\\w]*)\\s*=\\s*(.+?);?$`))
  if (!match) {
    return { ok: false, error: 'Usa JavaScript: let puntos = 100;' }
  }
  const nombre = match[1]
  const { valor, tipo } = parseValue(match[2])
  return { ok: true, nombre, valor, tipo }
}

export function parseVariables(code) {
  const lines = stripComments(code).split('\n').filter(Boolean)
  const variables = []
  const errors = []

  for (const line of lines) {
    const specific = variableLineError(line)
    if (specific) {
      errors.push({ line, error: specific })
      continue
    }
    const match = line.match(/^(let|const|var)\s+([a-zA-Z_]\w*)\s*=\s*(.+?);?$/)
    if (!match) {
      errors.push({ line, error: 'Formato: let nombre = valor;' })
      continue
    }
    const keyword = match[1]
    const nombre = match[2]
    const { valor, tipo } = parseValue(match[3])
    variables.push({ keyword, nombre, valor, tipo })
  }

  if (variables.length === 0 && errors.length > 0) {
    return { ok: false, error: errors[0].error, errors }
  }
  if (variables.length === 0) {
    return { ok: false, error: 'Escribe al menos una variable: let puntos = 100;' }
  }
  return { ok: true, variables, errors }
}

export function parseArray(code) {
  const cleaned = stripComments(code)
  const match = cleaned.match(
    new RegExp(`${declPrefix()}?([a-zA-Z_]\\w*)\\s*=\\s*\\[([\\s\\S]*?)\\];?`)
  )
  if (!match) {
    return { ok: false, error: 'Usa JavaScript: let lista = ["manzana", "pera"];' }
  }
  const nombre = match[1]
  const inner = match[2].trim()
  if (!inner) return { ok: true, nombre, items: [] }

  const items = []
  const regex = /"([^"]*)"|'([^']*)'/g
  let m
  while ((m = regex.exec(inner)) !== null) {
    items.push(m[1] ?? m[2])
  }
  if (items.length === 0) {
    return { ok: false, error: 'Pon cada elemento entre comillas: ["manzana", "pera"]' }
  }
  return { ok: true, nombre, items }
}

export function parseArrayIndex(access, arrayName, items) {
  const trimmed = access.trim()
  let index = null

  const bracketMatch = trimmed.match(new RegExp(`^${arrayName}\\s*\\[\\s*(\\d+)\\s*\\]$`, 'i'))
  if (bracketMatch) {
    index = Number(bracketMatch[1])
  } else if (/^\d+$/.test(trimmed)) {
    index = Number(trimmed)
  }

  if (index === null || Number.isNaN(index)) {
    return {
      ok: false,
      error: `Escribe el índice así: ${arrayName}[0] o solo el número 0`,
    }
  }

  if (index < 0 || index >= items.length) {
    return {
      ok: false,
      outOfRange: true,
      index,
      error: `Fuera de rango. El array tiene ${items.length} elementos; los índices van de 0 a ${items.length - 1}.`,
    }
  }

  return {
    ok: true,
    index,
    value: items[index],
    expression: `${arrayName}[${index}]`,
  }
}

export function parseObject(code) {
  try {
    const cleaned = stripComments(code)
    const match = cleaned.match(/=\s*(\{[\s\S]*\})/)
    if (!match) return { ok: false, error: 'Usa JavaScript: let obj = { nombre: "Luna", nivel: 5 };' }
    const jsonLike = match[1]
      .replace(/(\w+)\s*:/g, '"$1":')
      .replace(/'/g, '"')
    const obj = JSON.parse(jsonLike)
    return { ok: true, data: obj }
  } catch {
    return { ok: false, error: 'Revisa comillas, comas y llaves del objeto' }
  }
}

export function parseFunctionCall(code) {
  const cleaned = stripComments(code)
  const callLine = cleaned.split('\n').find((l) => l.match(/^\w+\s*\(/)) || ''
  const match = callLine.match(/^([a-zA-Z_]\w*)\s*\(\s*([^)]*)\s*\)\s*;?$/)
  if (!match) {
    return { ok: false, error: 'Llama a una función: doblar(5); o saludar("Ana");' }
  }
  const fn = match[1]
  let arg = match[2].trim()
  if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
    arg = arg.slice(1, -1)
  }
  return { ok: true, fn, arg, hasDefinition: cleaned.includes('function ' + fn) }
}

export function parseOperaciones(code) {
  const lines = stripComments(code).split('\n').filter(Boolean)
  const vars = {}
  const resultados = []

  for (const line of lines) {
    const decl = line.match(/^(?:let|const|var)\s+([a-zA-Z_]\w*)\s*=\s*(.+?);?$/)
    if (!decl) continue
    const nombre = decl[1]
    const expr = decl[2].trim()

    const numLit = expr.match(/^-?\d+(\.\d+)?$/)
    const boolLit = expr === 'true' || expr === 'false'
    const strLit = (expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))

    if (numLit) {
      vars[nombre] = Number(expr)
      resultados.push({ nombre, expresion: expr, valor: vars[nombre] })
      continue
    }
    if (boolLit) {
      vars[nombre] = expr === 'true'
      resultados.push({ nombre, expresion: expr, valor: vars[nombre] })
      continue
    }
    if (strLit) {
      vars[nombre] = expr.slice(1, -1)
      resultados.push({ nombre, expresion: expr, valor: `"${vars[nombre]}"` })
      continue
    }

    const bin = expr.match(/^([a-zA-Z_]\w*)\s*([+\-*/%]|>=|<=|===|==|>|<)\s*([a-zA-Z_]\w*|\d+)$/)
    if (bin) {
      const left = vars[bin[1]] ?? (isNaN(Number(bin[1])) ? undefined : Number(bin[1]))
      const right = vars[bin[3]] ?? (isNaN(Number(bin[3])) ? undefined : Number(bin[3]))
      if (left === undefined || right === undefined) {
        return { ok: false, error: `Primero declara las variables que usa ${nombre}` }
      }
      const op = bin[2]
      let valor
      if (op === '+') valor = left + right
      else if (op === '-') valor = left - right
      else if (op === '*') valor = left * right
      else if (op === '/') valor = left / right
      else if (op === '%') valor = left % right
      else if (op === '>') valor = left > right
      else if (op === '<') valor = left < right
      else if (op === '>=') valor = left >= right
      else if (op === '<=') valor = left <= right
      else if (op === '===' || op === '==') valor = left === right

      vars[nombre] = valor
      resultados.push({ nombre, expresion: expr, valor })
      continue
    }

    return { ok: false, error: `No entiendo: let ${nombre} = ${expr}` }
  }

  if (resultados.length === 0) {
    return { ok: false, error: 'Escribe variables con operaciones: let suma = a + b;' }
  }
  return { ok: true, resultados }
}

export function parseCondition(code) {
  const cleaned = stripComments(code)
  const decl = cleaned.match(new RegExp(`${declPrefix()}?puntos\\s*=\\s*(\\d+)`))
  if (!decl) {
    return { ok: false, error: 'Declara puntos: let puntos = 50;' }
  }
  const puntos = Math.min(100, Math.max(0, Number(decl[1])))
  const hasIf = /if\s*\(/.test(cleaned)
  return { ok: true, puntos, hasIf }
}
