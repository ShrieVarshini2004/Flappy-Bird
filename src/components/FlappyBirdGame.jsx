import React, { useEffect, useRef, useCallback } from 'react';

const FlappyBirdGame = ({ isFlapping, onScoreChange, onGameOver }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const gameStateRef = useRef(null);
  const previousFlappingRef = useRef(false);
  const flapCountRef = useRef(0);

  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 600;
  const GRAVITY = 0.5;
  const FLAP_STRENGTH = -9;
  const BIRD_SIZE = 30;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 180;
  const PIPE_SPEED = 2;
  const GROUND_HEIGHT = 50;

  const SKY_COLOR = '#87CEEB';
  const BIRD_COLOR = '#FFD700';
  const PIPE_COLOR = '#228B22';
  const GROUND_COLOR = '#DEB887';
  const PIPE_HIGHLIGHT = '#32CD32';

  const initializeGame = useCallback(() => {
    return {
      bird: { x: 100, y: CANVAS_HEIGHT / 2, velocity: 0, rotation: 0 },
      pipes: [
        { x: CANVAS_WIDTH, gapY: 200 },
        { x: CANVAS_WIDTH + 250, gapY: 300 },
        { x: CANVAS_WIDTH + 500, gapY: 250 }
      ],
      score: 0,
      gameOver: false,
      frameCount: 0,
      lastFlapFrame: 0,
      passedPipes: new Set()
    };
  }, [CANVAS_HEIGHT, CANVAS_WIDTH]);

  useEffect(() => {
    gameStateRef.current = initializeGame();
  }, [initializeGame]);

  // Handle flapping during gameplay
  useEffect(() => {
    if (gameStateRef.current && !gameStateRef.current.gameOver && isFlapping) {
      const currentFrame = gameStateRef.current.frameCount;
      // Allow flapping every 15 frames (about 4 times per second at 60fps)
      if (currentFrame - gameStateRef.current.lastFlapFrame > 15) {
        gameStateRef.current.bird.velocity = FLAP_STRENGTH;
        gameStateRef.current.lastFlapFrame = currentFrame;
        flapCountRef.current++;
      }
    }
  }, [isFlapping, FLAP_STRENGTH]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    if (!state) return;

    if (!state.gameOver) {
      state.bird.velocity += GRAVITY;
      state.bird.y += state.bird.velocity;
      
      if (state.bird.velocity > 10) state.bird.velocity = 10;
      if (state.bird.velocity < -10) state.bird.velocity = -10;

      state.bird.rotation = Math.min(Math.max(state.bird.velocity * 3, -30), 90);

      if (state.bird.y + BIRD_SIZE/2 > CANVAS_HEIGHT - GROUND_HEIGHT) {
        state.bird.y = CANVAS_HEIGHT - GROUND_HEIGHT - BIRD_SIZE/2;
        state.gameOver = true;
        if (onGameOver) onGameOver(state.score);
      }

      if (state.bird.y - BIRD_SIZE/2 < 0) {
        state.bird.y = BIRD_SIZE/2;
        state.bird.velocity = 0;
      }

      state.pipes.forEach((pipe, index) => {
        pipe.x -= PIPE_SPEED;

        const pipeId = `${index}-${Math.floor(pipe.x)}`;
        if (pipe.x + PIPE_WIDTH < state.bird.x && !state.passedPipes.has(pipeId)) {
          state.passedPipes.add(pipeId);
          state.score++;
          if (onScoreChange) onScoreChange(state.score);
        }

        if (
          state.bird.x + BIRD_SIZE/2 > pipe.x &&
          state.bird.x - BIRD_SIZE/2 < pipe.x + PIPE_WIDTH
        ) {
          if (
            state.bird.y - BIRD_SIZE/2 < pipe.gapY ||
            state.bird.y + BIRD_SIZE/2 > pipe.gapY + PIPE_GAP
          ) {
            state.gameOver = true;
            if (onGameOver) onGameOver(state.score);
          }
        }

        if (pipe.x < -PIPE_WIDTH) {
          pipe.x = CANVAS_WIDTH;
          pipe.gapY = Math.random() * (CANVAS_HEIGHT - GROUND_HEIGHT - PIPE_GAP - 100) + 50;
          state.passedPipes.forEach(id => {
            if (id.startsWith(`${index}-`)) state.passedPipes.delete(id);
          });
        }
      });

      state.frameCount++;
    }

    render(ctx, state);
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [CANVAS_HEIGHT, CANVAS_WIDTH, GRAVITY, BIRD_SIZE, PIPE_WIDTH, PIPE_GAP, 
      PIPE_SPEED, GROUND_HEIGHT, onScoreChange, onGameOver]);

  const render = (ctx, state) => {
    ctx.fillStyle = SKY_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawClouds(ctx);

    state.pipes.forEach(pipe => drawPipe(ctx, pipe));

    ctx.fillStyle = GROUND_COLOR;
    ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);
    
    ctx.strokeStyle = '#CD853F';
    ctx.lineWidth = 2;
    for (let i = 0; i < CANVAS_WIDTH; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, CANVAS_HEIGHT - GROUND_HEIGHT);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }

    drawBird(ctx, state.bird);

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.strokeText(state.score, CANVAS_WIDTH / 2, 50);
    ctx.fillText(state.score, CANVAS_WIDTH / 2, 50);

    if (state.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

      ctx.font = 'bold 32px Arial';
      ctx.fillText(`Score: ${state.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);

      ctx.font = '20px Arial';
      ctx.fillStyle = '#FFD700';
      ctx.fillText('Close fist ✊ to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    }
  };

  const drawBird = (ctx, bird) => {
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate((bird.rotation * Math.PI) / 180);

    ctx.fillStyle = BIRD_COLOR;
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(5, -5, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(6, -4, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.moveTo(BIRD_SIZE / 2 - 5, 0);
    ctx.lineTo(BIRD_SIZE / 2 + 5, -3);
    ctx.lineTo(BIRD_SIZE / 2 + 5, 3);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFB347';
    ctx.beginPath();
    ctx.ellipse(-3, 5, 8, 5, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawPipe = (ctx, pipe) => {
    const pipeTopHeight = pipe.gapY;
    const pipeBottomY = pipe.gapY + PIPE_GAP;
    const pipeBottomHeight = CANVAS_HEIGHT - GROUND_HEIGHT - pipeBottomY;

    ctx.fillStyle = PIPE_COLOR;
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipeTopHeight);
    ctx.fillRect(pipe.x - 5, pipeTopHeight - 30, PIPE_WIDTH + 10, 30);

    ctx.fillStyle = PIPE_HIGHLIGHT;
    ctx.fillRect(pipe.x + 5, 0, 10, pipeTopHeight - 30);

    ctx.fillStyle = PIPE_COLOR;
    ctx.fillRect(pipe.x, pipeBottomY, PIPE_WIDTH, pipeBottomHeight);
    ctx.fillRect(pipe.x - 5, pipeBottomY, PIPE_WIDTH + 10, 30);

    ctx.fillStyle = PIPE_HIGHLIGHT;
    ctx.fillRect(pipe.x + 5, pipeBottomY + 30, 10, pipeBottomHeight - 30);
  };

  const drawClouds = (ctx) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    
    ctx.beginPath();
    ctx.arc(80, 100, 20, 0, Math.PI * 2);
    ctx.arc(100, 95, 25, 0, Math.PI * 2);
    ctx.arc(120, 100, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(280, 150, 18, 0, Math.PI * 2);
    ctx.arc(300, 145, 22, 0, Math.PI * 2);
    ctx.arc(320, 150, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(150, 200, 15, 0, Math.PI * 2);
    ctx.arc(165, 197, 18, 0, Math.PI * 2);
    ctx.arc(180, 200, 15, 0, Math.PI * 2);
    ctx.fill();
  };

  const restartGame = useCallback(() => {
    gameStateRef.current = initializeGame();
    flapCountRef.current = 0;
    if (onScoreChange) onScoreChange(0);
  }, [initializeGame, onScoreChange]);

  // Handle restart when game is over
  useEffect(() => {
    if (gameStateRef.current?.gameOver) {
      // Detect fist closed gesture (transition from open to fist)
      if (isFlapping && !previousFlappingRef.current) {
        restartGame();
      }
    }
    previousFlappingRef.current = isFlapping;
  }, [isFlapping, restartGame]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{
        width: '100%',
        height: '100%',
        border: '3px solid #228B22',
        borderRadius: 8,
        background: SKY_COLOR,
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
      }}
    />
  );
};

export default FlappyBirdGame;