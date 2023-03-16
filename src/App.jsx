import { useEffect, useState } from "react";
import styled from "styled-components";
import flappy from "./assets/flappy.png";
import flappybg from "./assets/flappy-bg.png";

const BIRD_SIZE = 50;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 5;
const JUMP_HEIGHT= 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

function App() {

  const [birdPosition, setBirdPosition] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(0);

  const BottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  useEffect(() => {

    let timeId;
    if (gameHasStarted && birdPosition < GAME_HEIGHT - BIRD_SIZE) {
      timeId = setInterval(() => {
        setBirdPosition(birdPosition => birdPosition + GRAVITY);
      }, 24)
    }

    return () => {
      clearInterval(timeId);
    }

  },[birdPosition, gameHasStarted] );

  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft(obstacleLeft => obstacleLeft - 10);
      }, 24);

      return () => {
        clearInterval(obstacleId);
      };
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)));
      setScore(score => score + 1);
    }
  }, [gameHasStarted, obstacleLeft])

  useEffect(() => {
    // collision detection
    const hasCollidedWithTopObstacle = birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCollidedWithBottomObstacle = birdPosition <= 500 && birdPosition >= 500 - BottomObstacleHeight;

    if (obstacleLeft >= 0 && obstacleLeft <= OBSTACLE_WIDTH && (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle)) {
      setGameHasStarted(false);
    }
  }, [birdPosition, obstacleHeight, obstacleLeft, BottomObstacleHeight]);

  const handleClick = () => {
    let newBirdPosition = birdPosition - JUMP_HEIGHT;
    if (!gameHasStarted) {
      setGameHasStarted(true);
    } else if (newBirdPosition < 0) {
      setBirdPosition(0);
    } else {
      setBirdPosition(newBirdPosition);
    }
  }

  return (
    <Div onClick={handleClick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        <Obstacle
          top={0}
          width={OBSTACLE_WIDTH}
          height={obstacleHeight}
          left={obstacleLeft}
          />
          <Bird size={BIRD_SIZE} top={birdPosition} />
        <Obstacle 
          top={GAME_HEIGHT - (obstacleHeight + BottomObstacleHeight)}
          width={OBSTACLE_WIDTH}
          height={BottomObstacleHeight}
          left={obstacleLeft}
          />
      </GameBox>
      <span>Score: {score}</span>
      <Title> Flappy Shit!</Title>
    </Div>
  )
}

const Bird = styled.div`
  position: absolute;
  background-image: url(${flappy});
  background-size: cover;
  background-position: center;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: ${props => props.top}px;
  border-radius: 50%;
  transition: top 100ms linear;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  & span {
    font-size: 2rem;
    margin-top: 1rem;
    position: absolute;
    top: 0;
  }
`;

const GameBox = styled.div`
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  background: url(${flappybg});
  overflow: hidden;
  border-radius: 10px;
`;

const Obstacle = styled.div`
  position: relative;
  top: ${props => props.top}px;
  background-color: #28b03b;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  left: ${props => props.left}px;
  border: solid 5px green;
`

const Title = styled.h1`
  font-size: 5rem;
  color: #fff;
  text-transform: uppercase;
  text-shadow: 0 0 10px #000;
  margin-top: 1rem;
`;



export default App
