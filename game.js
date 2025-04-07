class Pong {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Game objects
        this.paddleHeight = 100;
        this.paddleWidth = 10;
        this.ballSize = 10;
        
        // Initialize game objects
        this.reset();
        
        // Bind event listeners
        this.bindEvents();
        
        // Start game loop
        this.gameLoop();
    }
    
    reset() {
        // Paddle positions
        this.playerPaddle = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            speed: 0
        };
        
        this.aiPaddle = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            speed: 0
        };
        
        // Ball position and speed
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            speedX: 5,
            speedY: 5
        };
        
        // Scores
        this.playerScore = 0;
        this.aiScore = 0;
        this.updateScore();
    }
    
    bindEvents() {
        // Mouse movement for player paddle
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseY = e.clientY - rect.top;
            this.playerPaddle.y = mouseY - this.paddleHeight / 2;
            
            // Keep paddle within canvas bounds
            this.playerPaddle.y = Math.max(0, Math.min(this.canvas.height - this.paddleHeight, this.playerPaddle.y));
        });
    }
    
    update() {
        // AI paddle movement
        const aiSpeed = 5;
        if (this.aiPaddle.y + this.paddleHeight / 2 < this.ball.y) {
            this.aiPaddle.y += aiSpeed;
        } else {
            this.aiPaddle.y -= aiSpeed;
        }
        
        // Keep AI paddle within canvas bounds
        this.aiPaddle.y = Math.max(0, Math.min(this.canvas.height - this.paddleHeight, this.aiPaddle.y));
        
        // Ball movement
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
        
        // Ball collision with top and bottom
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height) {
            this.ball.speedY *= -1;
        }
        
        // Ball collision with paddles
        if (this.ball.x <= this.paddleWidth && 
            this.ball.y >= this.playerPaddle.y && 
            this.ball.y <= this.playerPaddle.y + this.paddleHeight) {
            this.ball.speedX *= -1;
        }
        
        if (this.ball.x >= this.canvas.width - this.paddleWidth && 
            this.ball.y >= this.aiPaddle.y && 
            this.ball.y <= this.aiPaddle.y + this.paddleHeight) {
            this.ball.speedX *= -1;
        }
        
        // Scoring
        if (this.ball.x <= 0) {
            this.aiScore++;
            this.updateScore();
            this.resetBall();
        }
        
        if (this.ball.x >= this.canvas.width) {
            this.playerScore++;
            this.updateScore();
            this.resetBall();
        }
    }
    
    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.speedX *= -1;
    }
    
    updateScore() {
        document.getElementById('playerScore').textContent = this.playerScore;
        document.getElementById('aiScore').textContent = this.aiScore;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw paddles
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, this.playerPaddle.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.aiPaddle.y, this.paddleWidth, this.paddleHeight);
        
        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ballSize, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.closePath();
        
        // Draw center line
        this.ctx.setLineDash([5, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.strokeStyle = '#fff';
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.onload = () => {
    new Pong();
}; 