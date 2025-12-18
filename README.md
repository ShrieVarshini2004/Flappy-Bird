# Gesture-Controlled Flappy Bird (React + MediaPipe)

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://react.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Hands-orange.svg)](https://mediapipe.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Created by Shrie Varshini**

## Website: https://flappybirdgesturecontolled.netlify.app/

A gesture-controlled version of the classic **Flappy Bird** game built using **React**, **Canvas**, and **MediaPipe Hands**.  
The bird is controlled entirely using **hand gestures detected via webcam**, enabling a fun and interactive AI-powered gaming experience directly in the browser.

---

## Features

###  Flappy Bird Gameplay
- Classic Flappy Bird mechanics
- Smooth bird physics with gravity and lift
- Random pipe generation
- Collision detection (pipes and boundaries)
- Real-time score and high-score tracking
- Restart using hand gesture after game over

###  Hand Gesture Control
- Real-time hand tracking using **MediaPipe Hands**
- Gesture-based control:
  - **FIST** → Bird flaps upward
  - **OPEN hand** → Bird falls
  - **NEUTRAL** → Controlled fall
  - **NO HAND** → No input
- Live gesture visualization with hand landmarks
- Compact gesture preview window

###  User Interface
- Full-screen game canvas
- Instruction modal for first-time users
- On-screen score display
- Camera preview with gesture overlay
- Fully browser-based and privacy-safe

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Application
```bash
npm start
```

### 3. Open in Browser
http://localhost:3000


Allow camera access when prompted.

### Requirements

- Node.js 16+

- Webcam (built-in or external)

### Supported browsers:

- Google Chrome

- Microsoft Edge

- Mozilla Firefox
  
---

### Controls

| Gesture     | Description       | Game Action         |
| ----------- | ----------------- | ------------------- |
| ✊ Fist      | Fingers closed    | Bird flaps upward   |
| ✋ Open Hand | Palm open         | Bird falls downward |
| 🤚 Neutral  | Semi-open hand    | Controlled fall     |
| ❌ No Hand   | Hand not detected | No input            |


---

## Game Mechanics
### Bird Physics

- Gravity continuously pulls the bird down

- Flap force applied on fist detection

- Velocity-based movement for smooth animation

### Pipe System

- Pipes generated at fixed intervals

- Random vertical gaps

- Score increments when pipes are passed

### Game Over Conditions

- Collision with pipes

- Collision with screen boundaries

- Restart triggered by gesture input

---

## Project Structure

| File / Folder           | Description                           |
| ----------------------- | ------------------------------------- |
| `GestureController.jsx` | Webcam handling and gesture detection |
| `FlappyBirdGame.jsx`    | Game physics, rendering, scoring      |
| `App.jsx`               | UI layout and gesture integration     |
| `index.js`              | Application entry point               |

---

## Technical Details
### Gesture Detection

- MediaPipe detects 21 hand landmarks

- Fingertip-to-palm distance used for gesture classification

- Threshold-based gesture logic for FIST / OPEN / NEUTRAL

### Rendering & Game Loop

- HTML5 Canvas rendering

- requestAnimationFrame for smooth updates

- State-driven game control using React hooks

### Privacy

- Webcam feed is processed locally

- No video, images, or data are stored or transmitted

---

## Troubleshooting

| Issue              | Solution                                    |
| ------------------ | ------------------------------------------- |
| Camera not working | Enable permissions, close other camera apps |
| Gesture lag        | Improve lighting, keep hand centered        |
| Low FPS            | Close background apps, reduce browser load  |


---

### Customization
#### Adjust Gesture Sensitivity

In GestureController.jsx:
```bash
if (avgDistance < 0.08) return 'FIST';
if (avgDistance > 0.18) return 'OPEN';
```

#### Modify Game Physics

In FlappyBirdGame.jsx:
```bash
const GRAVITY = 0.35;
const LIFT = -7;
```
---

### Author

#### Shrie Varshini

- Passionate about AI, gesture recognition, and interactive web experiences

- Interested in computer vision, ML, and creative frontend projects

### Credits

MediaPipe Hands – Google



Inspired by the original Flappy Bird
