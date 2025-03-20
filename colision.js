const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ccc";


let circles = [];
let circlesRemoved = 0; // Contador de círculos eliminados

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.originalColor = color;
    this.text = text;
    this.speed = speed;
    this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed; // Movimiento horizontal
    this.dy = this.speed; // Movimiento vertical hacia abajo
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.fill();
    context.stroke();
    context.closePath();
  }

  update(context, circles) {
    this.posX += this.dx; // Movimiento horizontal
    this.posY += this.dy; // Movimiento vertical

    // Rebotar en los bordes
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.posY + this.radius > window_height) {
      this.posY = 0 - this.radius; // Reaparece en la parte superior
      this.posX =
        Math.random() * (window_width - this.radius * 2) + this.radius; // Nueva posición X
      circlesRemoved++; // Incrementar contador de círculos eliminados
      generateCircles(1); // Generar un nuevo círculo al eliminar uno
    }

    // Detección de colisiones con otros círculos
    let collisionDetected = false;
    for (let other of circles) {
      if (other !== this) {
        let dist = Math.sqrt(
          (this.posX - other.posX) ** 2 + (this.posY - other.posY) ** 2
        );
        if (dist < this.radius + other.radius) {
          collisionDetected = true;
          this.resolveCollision(other);
        }
      }
    }

    // Cambiar color si hay colisión
    if (collisionDetected) {
      this.color = "#0000FF";
      setTimeout(() => (this.color = this.originalColor), 100);
    }

    this.draw(context);
  }

  resolveCollision(other) {
    let tempDx = this.dx;
    let tempDy = this.dy;
    this.dx = other.dx;
    this.dy = other.dy;
    other.dx = tempDx;
    other.dy = tempDy;
  }
}

// Detectar clic en el canvas para eliminar círculos
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Verificar si el clic está dentro de un círculo
  circles = circles.filter((circle) => {
    const distance = Math.sqrt(
      Math.pow(mouseX - circle.posX, 2) + Math.pow(mouseY - circle.posY, 2)
    );
    return distance > circle.radius; // Mantener círculos no afectados
  });

  // Redibujar los círculos restantes
  drawCircles();
  updateCounter(); // Actualizar contador en la interfaz
});

// Función para redibujar los círculos
function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
  circles.forEach((circle) => {
    circle.draw(ctx); // Redibuja cada círculo
  });
}

function updateCounter() {
  // Definir el tamaño y la posición del cuadrado
  const squareWidth = 300;
  const squareHeight = 60;
  const squareX = (canvas.width - squareWidth) / 2; // Centrar horizontalmente
  const squareY = canvas.height - squareHeight - 20; // 20 píxeles desde la parte inferior

  // Dibujar el fondo del cuadrado
  ctx.fillStyle = "#FFFFFF"; // Color del fondo del cuadrado
  ctx.fillRect(squareX, squareY, squareWidth, squareHeight); // Cuadrado centrado en la parte inferior
  ctx.strokeStyle = "#000"; // Color del borde del cuadrado
  ctx.strokeRect(squareX, squareY, squareWidth, squareHeight); // Borde del cuadrado

  // Mostrar el contador
  ctx.fillStyle = "#FF0000"; // Color del texto (rojo para mayor visibilidad)
  ctx.font = "24px Arial"; // Aumentar el tamaño de la fuente
  ctx.textAlign = "center"; // Alinear al centro
  ctx.fillText(
    `Círculos Eliminados: ${circlesRemoved}`,
    canvas.width / 2,
    squareY + squareHeight / 2 + 8
  ); // Mostrar contador centrado
}

function generateCircles(n) {
  // Asegurarse de que el número de círculos esté entre 3 y 20
  const numberOfCircles = Math.max(3, Math.min(circles.length + n, 20));
  while (circles.length < numberOfCircles) {
    let radius = Math.random() * 30 + 20;
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let speed = Math.random() * 4 + 1;
    let text = `C${circles.length + 1}`;

    // Verificar si el nuevo círculo colisiona con los círculos existentes
    let overlap = circles.some((circle) => {
      let dist = Math.sqrt((x - circle.posX) ** 2 + (y - circle.posY) ** 2);
      return dist < radius + circle.radius; // Verificar superposición
    });

    // Solo agregar el círculo si no hay superposición
    if (!overlap) {
      circles.push(new Circle(x, y, radius, color, text, speed));
    }
  }
}
function generateCircles(n) {
  // Asegurarse de que el número de círculos esté entre 3 y 20
  const numberOfCircles = Math.max(3, Math.min(circles.length + n, 20));
  while (circles.length < numberOfCircles) {
    let radius = Math.random() * 30 + 20;
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let speed = Math.random() * 4 + 1;
    let text = `C${circles.length + 1}`;

    // Verificar si el nuevo círculo colisiona con los círculos existentes
    let overlap = circles.some((circle) => {
      let dist = Math.sqrt((x - circle.posX) ** 2 + (y - circle.posY) ** 2);
      return dist < radius + circle.radius; // Verificar superposición
    });

    // Solo agregar el círculo si no hay superposición
    if (!overlap) {
      circles.push(new Circle(x, y, radius, color, text, speed));
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, window_width, window_height);
  circles.forEach((circle) => circle.update(ctx, circles));
  updateCounter(); // Actualizar el contador después de dibujar los círculos
  requestAnimationFrame(animate);
}

generateCircles(10); // Generar círculos iniciales
animate();
