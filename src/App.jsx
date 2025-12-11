import { useEffect, useState } from 'react';
import GestureController from './components/GestureController';
import FlappyBirdGame from './components/FlappyBirdGame';

function App() {
  const [gesture, setGesture] = useState('NONE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isFlapping, setIsFlapping] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    console.log('📊 Gesture State Change:', { gesture, isFlapping: gesture === 'FIST' });
    setIsFlapping(gesture === 'FIST');
  }, [gesture]);

  const handleGameOver = (finalScore) => {
    if (finalScore > highScore) {
      setHighScore(finalScore);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      {/* Instructions Modal */}
      {showInstructions && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2d3561 0%, #1f2544 100%)',
            padding: 40,
            borderRadius: 20,
            maxWidth: 600,
            position: 'relative',
            border: '3px solid #FFD700',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}>
            <button
              onClick={() => setShowInstructions(false)}
              style={{
                position: 'absolute',
                top: 15,
                right: 15,
                background: '#FF4444',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 35,
                height: 35,
                fontSize: 20,
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              ✕
            </button>

            <h1 style={{
              color: '#FFD700',
              textAlign: 'center',
              marginTop: 0,
              marginBottom: 30,
              fontSize: 36,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              🐦 Flappy Bird - Gesture Control
            </h1>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: 25,
              borderRadius: 12,
              marginBottom: 20
            }}>
              <h2 style={{ color: '#00FF00', marginTop: 0, fontSize: 24 }}>How to Play:</h2>
              <ul style={{ fontSize: 18, lineHeight: 1.8, paddingLeft: 20 }}>
                <li><strong style={{ color: '#FFD700' }}>✊ Close your fist</strong> → Bird flaps and goes up</li>
                <li><strong style={{ color: '#FFD700' }}>✋ Open your hand</strong> → Bird falls down</li>
                <li>Navigate through the green pipes without hitting them</li>
                <li>Each pipe you pass increases your score</li>
                <li>When game over, close your fist to restart</li>
              </ul>
            </div>

            <div style={{
              background: 'rgba(255, 215, 0, 0.1)',
              padding: 20,
              borderRadius: 12,
              border: '2px solid #FFD700'
            }}>
              <h3 style={{ color: '#FFD700', marginTop: 0, fontSize: 20 }}>📷 Camera Permission:</h3>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>
                This game uses your camera for hand gesture detection. Please allow camera access when prompted. Your camera feed is only used locally in your browser and is not recorded or transmitted.
              </p>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              style={{
                marginTop: 25,
                width: '100%',
                padding: 15,
                fontSize: 20,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #00FF00 0%, #00CC00 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,255,0,0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Start Game! 🎮
            </button>
          </div>
        </div>
      )}

      {/* Score Display - Top Center */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '10px 30px',
        borderRadius: 12,
        display: 'flex',
        gap: 40,
        zIndex: 10,
        backdropFilter: 'blur(10px)'
      }}>
        <div>
          <span style={{ color: '#aaa', fontSize: 14 }}>Score: </span>
          <span style={{ color: '#00FF00', fontWeight: 'bold', fontSize: 28 }}>{score}</span>
        </div>
        <div>
          <span style={{ color: '#aaa', fontSize: 14 }}>High Score: </span>
          <span style={{ color: '#FFA500', fontWeight: 'bold', fontSize: 28 }}>{highScore}</span>
        </div>
      </div>

      {/* Video Feed - Top Left Corner */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        transform: 'scale(0.6)',
        transformOrigin: 'top left'
      }}>
        <GestureController onGestureChange={setGesture} compact={true} />
      </div>

      {/* Game Canvas - Full Screen */}
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}>
        <div style={{
          width: '100%',
          maxWidth: '90vh',
          height: '100%',
          maxHeight: '90vh',
          aspectRatio: '2/3'
        }}>
          <FlappyBirdGame
            isFlapping={isFlapping}
            onScoreChange={setScore}
            onGameOver={handleGameOver}
          />
        </div>
      </div>
    </div>
  );
}

export default App;