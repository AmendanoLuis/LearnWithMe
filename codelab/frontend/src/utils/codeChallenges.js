/** Retos de código: el alumno corrige el JavaScript para que la actividad funcione */

export const CHALLENGE_CODE = {
  juego: `const VELOCIDAD = 12;
let jugador1 = { x: 50, y: 180 };
let jugador2 = { x: 300, y: 180 };

function mover(jugador, dx, dy) {
  jugador.x += dx;
  jugador.y += dy;
  if (jugador.x < 0) jugador.x = 0;
  if (jugador.y < 0) jugador.y = 0;
  if (jugador.x > 368) jugador.x = 368;
  if (jugador.y > 368) jugador.y = 368;
}

function alPulsarTecla(tecla) {
  if (tecla === "w") {
    mover(jugador1, 0, VELOCIDAD);   // ¿subir o bajar?
  }
  if (tecla === "s") {
    mover(jugador1, 0, -VELOCIDAD);  // ¿subir o bajar?
  }
  if (tecla === "a") mover(jugador1, -VELOCIDAD, 0);
  if (tecla === "d") mover(jugador1, VELOCIDAD, 0);

  if (tecla === "ArrowUp")    mover(jugador2, 0, -VELOCIDAD);
  if (tecla === "ArrowDown")  mover(jugador2, 0, VELOCIDAD);
  if (tecla === "ArrowLeft")  mover(jugador2, -VELOCIDAD, 0);
  if (tecla === "ArrowRight") mover(jugador2, VELOCIDAD, 0);
}`,

  notas: `async function guardarNota(titulo, texto) {
  const nota = {
    titulo: titulo,
    texto: texto
  };

  const respuesta = await fetch("/api/notas", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nota)
  });

  return respuesta.json();
}`,

  productos: `async function guardarProducto(nombre, precio) {
  const producto = {
    nombre: nombre,
    precio: precio,
    stock: 10
  };

  const respuesta = await fetch("/api/producto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto)
  });

  return respuesta.json();
}`,
}

export function validateJuego(code) {
  const wSube = /tecla\s*===\s*["']w["'][\s\S]{0,150}mover\s*\(\s*jugador1\s*,\s*0\s*,\s*-VELOCIDAD\s*\)/.test(code)
  const sBaja = /tecla\s*===\s*["']s["'][\s\S]{0,150}mover\s*\(\s*jugador1\s*,\s*0\s*,\s*VELOCIDAD\s*\)/.test(code)
  return wSube && sBaja
}

export function validateNotas(code) {
  return /method\s*:\s*["']POST["']/i.test(code) && /\/api\/notas/.test(code)
}

export function validateProductos(code) {
  return /\/api\/productos/.test(code)
}
