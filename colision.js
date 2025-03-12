const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ccc";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.originalColor = color;
    this.text = text;
    this.speed = speed;
    this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed;
    this.dy = (Math.random() > 0.5 ? 1 : -1) * this.speed;
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
    this.posX += this.dx;
    this.posY += this.dy;

    // Rebotar en los bordes
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (
      this.posY + this.radius > window_height ||
      this.posY - this.radius < 0
    ) {
      this.dy = -this.dy;
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

let circles = [];
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20;
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let speed = Math.random() * 4 + 1;
    let text = `C${i + 1}`;
    circles.push(new Circle(x, y, radius, color, text, speed));
  }
}

function animate() {
  ctx.clearRect(0, 0, window_width, window_height);
  circles.forEach((circle) => circle.update(ctx, circles));
  requestAnimationFrame(animate);
}

generateCircles(10);
animate();
