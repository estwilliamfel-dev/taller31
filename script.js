let escenaActual = 0;
let ventana = { xmin: 100, ymin: 100, xmax: 400, ymax: 400 };

const canvas = document.getElementById('plano');
const ctx = canvas.getContext('2d');

// Transformar el canvas para que el (0,0) esté en la esquina inferior izquierda
ctx.translate(0, canvas.height);
ctx.scale(1, -1);