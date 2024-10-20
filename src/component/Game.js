import Entity from "./Entity";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Info from "./Info";

let wolfs = { nb: 0 };
let rabbits = { nb: 0 };
let grass = { nb: 0 };

const Game = (props) => {
  const navigate = useNavigate();

  const height = 600;
  const width = 1200;

  const location = useLocation();

  const wolfsNbInit = location.state.wolfSettings.nb;
  const rabbitsNbInit = location.state.rabbitSettings.nb;

  const wolfsStaminaMax = location.state.wolfSettings.stamina;
  const rabbitsStaminaMax = location.state.rabbitSettings.stamina;

  const wolfsSpeedMax = location.state.wolfSettings.speed;
  const rabbitSpeedMax = location.state.rabbitSettings.speed;

  const wolfsIncreaseStamina = location.state.wolfSettings.increaseStamina;
  const rabbitsIncreaseStamina = location.state.rabbitSettings.increaseStamina;

  const rabbitRangeGrass = location.state.rabbitSettings.rangeEat;

  const grassNbInit = location.state.grassSettings.nb;
  const grassDuplicationFactor = location.state.grassSettings.duplicationFactor;

  // generate an id
  const randomId = () => {
    return Math.random().toString(36);
  };

  // generate randomly a coordinate
  const randomCoord = () => {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    return [x, y];
  };

  // genrate randomly a vector
  const randomVector = () => {
    const angle = Math.floor(Math.random() * 360) * (Math.PI / 180);
    const x = Math.cos(angle);
    const y = Math.sin(angle);

    return [x, y];
  };

  // initialize wolfs, rabbits and grass
  const initEntities = (nbWolfs, nbRabbits, nbGrass) => {
    const entity = [];
    for (let i = 1; i <= nbWolfs; i++) {
      entity.push({
        id: randomId(),
        type: "wolf",
        coord: randomCoord(),
        stamina: wolfsStaminaMax,
        speed: 3,
        vector: randomVector(),
      });
    }
    for (let i = 1; i <= nbRabbits; i++) {
      entity.push({
        id: randomId(),
        type: "rabbit",
        coord: randomCoord(),
        stamina: 1000,
        speed: 6,
        vector: randomVector(),
        eaten: false,
      });
    }

    for (let i = 1; i <= nbGrass; i++) {
      entity.push({
        id: randomId(),
        type: "grass",
        coord: randomCoord(),
        eaten: false,
      });
    }
    return entity;
  };

  const checkCollisions = (entity, newVector) => {
    if (entity.coord[0] <= 0 && entity.vector[0] < 0) {
      newVector = [entity.vector[0] * -1, entity.vector[1]];
    } else if (entity.coord[0] >= width && entity.vector[0] > 0) {
      newVector = [entity.vector[0] * -1, entity.vector[1]];
    }

    if (entity.coord[1] <= 0 && entity.vector[1] < 0) {
      newVector = [entity.vector[0], entity.vector[1] * -1];
    } else if (entity.coord[1] >= height && entity.vector[1] > 0) {
      newVector = [entity.vector[0], entity.vector[1] * -1];
    }

    return newVector;
  };

  const checkDistance = (coord, coordTarget, distLimit) => {
    const x = coordTarget[0] - coord[0];
    const y = coordTarget[1] - coord[1];

    const dist = Math.sqrt(x ** 2 + y ** 2);
    return distLimit > dist ? dist : false;
  };

  const checkGameover = (nbWolfs, nbRabbits, nbGrass) => {
    if (nbWolfs <= 0) {
      navigate("/gameover", { state: { entity: "wolf" } });
    } else if (nbRabbits <= 0) {
      navigate("/gameover", { state: { entity: "rabbit" } });
    } else if (nbGrass <= 0) {
      navigate("/gameover", { state: { entity: "grass" } });
    }
    return false;
  };

  const getVector = (coord, coordTarget) => {
    const angle = Math.atan2(
      coordTarget[1] - coord[1],
      coordTarget[0] - coord[0]
    );
    const x = Math.cos(angle);
    const y = Math.sin(angle);

    return [x, y];
  };

  const [entities, setEntities] = useState(
    initEntities(wolfsNbInit, rabbitsNbInit, grassNbInit)
  );

  const [timerGrass, setTimerGrass] = useState(0);

  const updateGame = () => {
    setTimerGrass((prev) => prev + 1);
    let duplicatedEntities = [];

    let newEntities = entities
      .map((entity) => {
        if (entity.type !== "grass") {
          let newVector = [entity.vector[0], entity.vector[1]];
          newVector = checkCollisions(entity, newVector);

          // diminution of stamina
          let stamina = entity.stamina - 1;

          let speed =
            entity.type === "rabbit"
              ? ((rabbitSpeedMax - 1) * stamina) / rabbitsStaminaMax + 1
              : ((wolfsSpeedMax - 1) * stamina) / wolfsStaminaMax + 1;

          let newEntitiesCoord;
          let type = entity.type;

          if (entity.type === "wolf") {
            stamina =
              stamina > wolfsStaminaMax ? (stamina = wolfsStaminaMax) : stamina;

            let targetRabbit = null;
            let minDist = Infinity;

            entities.forEach((entitieAround) => {
              if (entitieAround.type === "rabbit") {
                const dist = Math.sqrt(
                  (entity.coord[0] - entitieAround.coord[0]) ** 2 +
                    (entity.coord[1] - entitieAround.coord[1]) ** 2
                );

                if (dist < minDist) {
                  minDist = dist;
                  targetRabbit = entitieAround;
                }

                if (
                  entity.coord[0] - entitieAround.coord[0] <= 10 &&
                  entity.coord[0] - entitieAround.coord[0] >= -10 &&
                  entity.coord[1] - entitieAround.coord[1] <= 10 &&
                  entity.coord[1] - entitieAround.coord[1] >= -10
                ) {
                  stamina += wolfsIncreaseStamina;
                  if (stamina >= wolfsStaminaMax) {
                    stamina /= 2;
                    duplicatedEntities.push({
                      id: randomId(),
                      type: entity.type,
                      coord: randomCoord(),
                      stamina: wolfsStaminaMax / 2,
                      speed: wolfsSpeedMax,
                      vector: randomVector(),
                    });
                  }
                }
              }
            });

            const vector = getVector(entity.coord, targetRabbit.coord);

            newEntitiesCoord = [
              entity.coord[0] + vector[0] * speed,
              entity.coord[1] + vector[1] * speed,
            ];

            return {
              ...entity,
              coord: newEntitiesCoord,
              vector,
              type,
              stamina,
              speed,
            };
          } else if (entity.type === "rabbit") {
            stamina =
              stamina > rabbitsStaminaMax
                ? (stamina = rabbitsStaminaMax)
                : stamina;

            let eaten = false;
            let distRabbitGrass = rabbitRangeGrass;

            entities.forEach((entitieAround) => {
              if (entitieAround.type === "wolf") {
                if (
                  entity.coord[0] - entitieAround.coord[0] <= 10 &&
                  entity.coord[0] - entitieAround.coord[0] >= -10 &&
                  entity.coord[1] - entitieAround.coord[1] <= 10 &&
                  entity.coord[1] - entitieAround.coord[1] >= -10
                ) {
                  eaten = true;
                }
              } else if (entitieAround.type === "grass") {
                const dist = checkDistance(
                  entity.coord,
                  entitieAround.coord,
                  distRabbitGrass
                );
                if (dist) {
                  distRabbitGrass = dist;
                  newVector = getVector(entity.coord, entitieAround.coord);
                }
                if (
                  entity.coord[0] - entitieAround.coord[0] <= 10 &&
                  entity.coord[0] - entitieAround.coord[0] >= -10 &&
                  entity.coord[1] - entitieAround.coord[1] <= 10 &&
                  entity.coord[1] - entitieAround.coord[1] >= -10
                ) {
                  stamina += rabbitsIncreaseStamina;
                  if (stamina >= rabbitsStaminaMax) {
                    stamina = stamina * 0.8;
                    duplicatedEntities.push({
                      id: randomId(),
                      type: entity.type,
                      coord: entity.coord,
                      stamina: rabbitsStaminaMax,
                      speed: rabbitSpeedMax,
                      vector: randomVector(),
                      eaten: false,
                    });
                  }
                }
              }
            });

            newEntitiesCoord = [
              entity.coord[0] + entity.vector[0] * speed,
              entity.coord[1] + entity.vector[1] * speed,
            ];

            return {
              ...entity,
              coord: newEntitiesCoord,
              vector: newVector,
              type,
              stamina,
              speed,
              eaten,
            };
          } else if (entity.type === "grass") {
            let eaten = false;
            entities.forEach((entitieAround) => {
              if (entitieAround.type === "rabbit") {
                if (
                  entity.coord[0] - entitieAround.coord[0] <= 10 &&
                  entity.coord[0] - entitieAround.coord[0] >= -10 &&
                  entity.coord[1] - entitieAround.coord[1] <= 10 &&
                  entity.coord[1] - entitieAround.coord[1] >= -10
                ) {
                  eaten = true;
                }
              }
            });
            return {
              ...entity,
              type,
              eaten,
            };
          }

          return {
            ...entity,
            coord: newEntitiesCoord,
            vector: newVector,
            type,
            stamina,
            speed,
          };
        } else if (entity.type === "grass") {
          let eaten = false;
          entities.forEach((entitieAround) => {
            if (entitieAround.type === "rabbit") {
              if (
                entity.coord[0] - entitieAround.coord[0] <= 10 &&
                entity.coord[0] - entitieAround.coord[0] >= -10 &&
                entity.coord[1] - entitieAround.coord[1] <= 10 &&
                entity.coord[1] - entitieAround.coord[1] >= -10
              ) {
                eaten = true;
              }
            }
          });
          return {
            ...entity,
            eaten,
          };
        }
        return { ...entity };
      })
      .filter((entity) => {
        if (entity.type !== "grass") {
          return entity.stamina > 0;
        } else if (entity.type === "grass") {
          return !entity.eaten;
        }
        return entity;
      });

    newEntities = [...newEntities]
      .map((entity) => {
        if (entity.type === "rabbit" && entity.eaten) {
          return null;
        }
        return entity;
      })
      .filter(Boolean);

    if (duplicatedEntities.length > 0) {
      duplicatedEntities.forEach((duplicatedEntity) => {
        newEntities.push(duplicatedEntity);
      });
      duplicatedEntities = [];
    }

    const nbWolfs = newEntities.filter(
      (entity) => entity.type === "wolf"
    ).length;

    const nbRabbits = newEntities.filter(
      (entity) => entity.type === "rabbit"
    ).length;

    const nbGrass = newEntities.filter(
      (entity) => entity.type === "grass"
    ).length;

    checkGameover(nbWolfs, nbRabbits, nbGrass);

    wolfs = { ...wolfs, nb: nbWolfs };
    rabbits = { ...rabbits, nb: nbRabbits };
    grass = { ...grass, nb: nbGrass };

    let factor = Math.floor(
      -grassDuplicationFactor * Math.log10(nbGrass) + 2 * grassDuplicationFactor
    );

    factor = factor < 1 ? 1 : factor;

    if (timerGrass % factor === 0 && nbGrass > 0 && nbGrass < 150) {
      newEntities.push({
        id: randomId(),
        type: "grass",
        coord: randomCoord(),
      });
    }
    setEntities(newEntities);
  };

  useEffect(() => {
    const intervalId = setTimeout(() => {
      updateGame();
    }, 15);

    return () => clearInterval(intervalId);
  }, [timerGrass]);

  return (
    <>
      <Info wolfs={wolfs} rabbits={rabbits} grass={grass} />
      <div
        className="game"
        style={{ width: width + 20 + "px", height: height + 20 + "px" }}
      >
        {entities.map((entity) => {
          return <Entity entity={entity} key={entity.i} />;
        })}
      </div>
    </>
  );
};

export default Game;
