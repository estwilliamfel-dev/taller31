const lineasCasos = [
    { x1: 150, y1: 200, x2: 300, y2: 350, desc: "Caso 1: Línea completamente adentro (Aceptación trivial)." },
    { x1: 20,  y1: 450, x2: 200, y2: 480, desc: "Caso 2: Línea completamente afuera (Rechazo trivial)." },
    { x1: 250, y1: 450, x2: 480, y2: 250, desc: "Caso 3: Cruza Arriba y Derecha." },
    { x1: 350, y1: 450, x2: 380, y2: 50,  desc: "Caso 4: Cruza Arriba y Abajo." },
    { x1: 120, y1: 480, x2: 120, y2: 50,  desc: "Caso 5: Vertical perfecta cruzando Arriba y Abajo." }
];

let escenaActual = 0;
let ventana = { xmin: 100, ymin: 100, xmax: 400, ymax: 400 };

const canvas = document.getElementById('plano');
const ctx = canvas.getContext('2d');

// Transformar el canvas para que el (0,0) esté en la esquina inferior izquierda
ctx.translate(0, canvas.height);
ctx.scale(1, -1);

//Funciones de dibujo (2)
function dibujarViewport(xmin, ymin, xmax, ymax) {
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(xmin, ymin, xmax - xmin, ymax - ymin);
    ctx.stroke();
}

function dibujarLinea(x1, y1, x2, y2, color, grosor = 2) {
    ctx.strokeStyle = color;
    ctx.lineWidth = grosor;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
 //Define las constantes binarias y la función parametrizada que evalúa y asigna el código de 4 bits a un punto
const INSIDE = 0; // 0000
const LEFT   = 1; // 0001
const RIGHT  = 2; // 0010
const BOTTOM = 4; // 0100
const TOP    = 8; // 1000

function obtenerCodigo(x, y, xmin, ymin, xmax, ymax) {
    let codigo = INSIDE;
    if (x < xmin)      codigo |= LEFT;
    else if (x > xmax) codigo |= RIGHT;
    if (y < ymin)      codigo |= BOTTOM;
    else if (y > ymax) codigo |= TOP;
    return codigo;
}
//Algoritmo de Cohen-Sutherland para recortar líneas, con manejo de casos y actualización iterativa de los puntos
function cohenSutherland(x1, y1, x2, y2, xmin, ymin, xmax, ymax) {
    let code1 = obtenerCodigo(x1, y1, xmin, ymin, xmax, ymax);
    let code2 = obtenerCodigo(x2, y2, xmin, ymin, xmax, ymax);
    let aceptada = false;

    while (true) {
        if (code1 === 0 && code2 === 0) {
            aceptada = true; break;
        } else if ((code1 & code2) !== 0) {
            break;
        } else {
            let codeOut = code1 !== 0 ? code1 : code2;
            let x, y;
            let m = (x2 !== x1) ? (y2 - y1) / (x2 - x1) : 0;

            if (codeOut & TOP) { x = x1 + (ymax - y1) / m; if(x1===x2) x=x1; y = ymax; }
            else if (codeOut & BOTTOM) { x = x1 + (ymin - y1) / m; if(x1===x2) x=x1; y = ymin; }
            else if (codeOut & RIGHT) { y = y1 + m * (xmax - x1); x = xmax; }
            else if (codeOut & LEFT) { y = y1 + m * (xmin - x1); x = xmin; }

            if (codeOut === code1) { x1 = x; y1 = y; code1 = obtenerCodigo(x1, y1, xmin, ymin, xmax, ymax); }
            else { x2 = x; y2 = y; code2 = obtenerCodigo(x2, y2, xmin, ymin, xmax, ymax); }
        }
    }
    return { aceptada, x1, y1, x2, y2 };
}

function actualizarVentana() {
    ventana.xmin = parseFloat(document.getElementById('w_x1').value);
    ventana.ymin = parseFloat(document.getElementById('w_y1').value);
    ventana.xmax = parseFloat(document.getElementById('w_x2').value);
    ventana.ymax = parseFloat(document.getElementById('w_y2').value);
    renderizarEscena();
}

function cambiarEscena(direccion) {
    escenaActual += direccion;
    if (escenaActual < 0) escenaActual = lineasCasos.length - 1;
    if (escenaActual >= lineasCasos.length) escenaActual = 0;
    
    document.getElementById('scene-info').innerText = `Escena ${escenaActual + 1} de 5`;
    renderizarEscena();
}

function renderizarEscena() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarViewport(ventana.xmin, ventana.ymin, ventana.xmax, ventana.ymax);

    let linea = lineasCasos[escenaActual];
    document.getElementById('desc-text').innerText = linea.desc;

    dibujarLinea(linea.x1, linea.y1, linea.x2, linea.y2, "#d3d3d3", 1);

    let resultado = cohenSutherland(
        linea.x1, linea.y1, linea.x2, linea.y2, 
        ventana.xmin, ventana.ymin, ventana.xmax, ventana.ymax
    );

    if (resultado.aceptada) {
        dibujarLinea(resultado.x1, resultado.y1, resultado.x2, resultado.y2, "green", 3);
    } else {
        dibujarLinea(linea.x1, linea.y1, linea.x2, linea.y2, "rgba(255, 0, 0, 0.5)", 2);
    }
}

// Inicializar la primera vista
renderizarEscena();
