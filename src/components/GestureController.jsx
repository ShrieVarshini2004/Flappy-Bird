import React, { useEffect, useRef, useState } from 'react';

const GestureController = ({ onGestureChange, compact = false }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentGesture, setCurrentGesture] = useState('NONE');
  const [error, setError] = useState(null);
  
  const handsRef = useRef(null);

  useEffect(() => {
    const initializeMediaPipe = async () => {
      try {
        const hands = new window.Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);
        handsRef.current = hands;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play();
              setIsInitialized(true);
              processFrame();
            };
          }
        }
      } catch (err) {
        console.error('MediaPipe initialization error:', err);
        setError('Failed to initialize camera');
      }
    };

    const processFrame = async () => {
      if (videoRef.current && handsRef.current && videoRef.current.readyState === 4) {
        await handsRef.current.send({ image: videoRef.current });
      }
      requestAnimationFrame(processFrame);
    };

    initializeMediaPipe();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const onResults = (results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      
      drawLandmarks(ctx, landmarks, canvas.width, canvas.height);
      
      const gesture = detectFistGesture(landmarks);
      
      // Update local state
      setCurrentGesture(gesture);
      
      // Notify parent immediately
      if (onGestureChange) {
        onGestureChange(gesture);
      }

      drawGestureIndicator(ctx, gesture, canvas.width);
    } else {
      setCurrentGesture('NONE');
      if (onGestureChange) {
        onGestureChange('NONE');
      }
    }
  };

  const detectFistGesture = (landmarks) => {
    const palmCenter = landmarks[9];
    const fingerTips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];

    let totalDistance = 0;
    fingerTips.forEach(tip => {
      const dx = tip.x - palmCenter.x;
      const dy = tip.y - palmCenter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      totalDistance += distance;
    });
    
    const avgDistance = totalDistance / fingerTips.length;

    // Adjusted thresholds for better detection
    if (avgDistance < 0.08) {
      return 'FIST';
    } else if (avgDistance > 0.18) {
      return 'OPEN';
    } else {
      return 'NEUTRAL';
    }
  };

  const drawLandmarks = (ctx, landmarks, width, height) => {
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 9], [9, 10], [10, 11], [11, 12],
      [0, 13], [13, 14], [14, 15], [15, 16],
      [0, 17], [17, 18], [18, 19], [19, 20],
      [5, 9], [9, 13], [13, 17]
    ];

    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;

    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];
      
      ctx.beginPath();
      ctx.moveTo((1 - startPoint.x) * width, startPoint.y * height);
      ctx.lineTo((1 - endPoint.x) * width, endPoint.y * height);
      ctx.stroke();
    });

    landmarks.forEach((landmark, index) => {
      const x = (1 - landmark.x) * width;
      const y = landmark.y * height;
      
      ctx.fillStyle = index === 0 ? '#FF0000' : '#00FF00';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawGestureIndicator = (ctx, gesture, width) => {
    ctx.font = compact ? 'bold 24px Arial' : 'bold 30px Arial';
    ctx.textAlign = 'left';
    
    if (gesture === 'FIST') {
      ctx.fillStyle = '#00FF00';
      ctx.fillText('✊ FIST - FLAPPING!', 20, compact ? 40 : 50);
    } else if (gesture === 'OPEN') {
      ctx.fillStyle = '#FFFF00';
      ctx.fillText('✋ OPEN - FALLING', 20, compact ? 40 : 50);
    } else if (gesture === 'NEUTRAL') {
      ctx.fillStyle = '#FFA500';
      ctx.fillText('👋 NEUTRAL', 20, compact ? 40 : 50);
    } else {
      ctx.fillStyle = '#FF0000';
      ctx.fillText('❌ NO HAND', 20, compact ? 40 : 50);
    }
  };

  if (error) {
    return (
      <div style={{ padding: 20, background: '#ff4444', color: 'white', borderRadius: 8 }}>
        <h3>Camera Error</h3>
        <p>Please enable camera permissions and refresh.</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <video ref={videoRef} style={{ display: 'none' }} playsInline />
      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid #00FF00',
          borderRadius: 8,
          maxWidth: '100%',
          height: 'auto'
        }}
      />
      {!isInitialized && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: 20,
          borderRadius: 8
        }}>
          📷 Initializing camera...
        </div>
      )}
    </div>
  );
};

export default GestureController;