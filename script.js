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