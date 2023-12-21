import Entity from "./Entity";
import { useState, useEffect } from "react";

const Game = (props) => {
  const height = 600;
  const width = 1200;

  const wolfsStamina = 2000;
  const rabbitsStamina = 1000;

  const randomId = () => {
    return Math.random().toString(36);
  };

  const randomCoord = () => {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    return [x, y];
  };

  const randomVector = () => {
    const angle = Math.floor(Math.random() * 360);
    const x = Math.cos(angle);
    const y = Math.sin(angle);

    return [x, y];
  };

  const initEntities = (nb) => {
    const entity = [];
    for (let i = 1; i <= nb / 5; i++) {
      entity.push({
        id: randomId(),
        type: "wolf",
        coord: randomCoord(),
        stamina: wolfsStamina,
        speed: 3,
        vector: randomVector(),
      });
    }
    for (let i = nb + 1; i <= nb * 2; i++) {
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

    for (let i = nb * 2 + 1; i <= nb * 3; i++) {
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

  const [entities, setEntities] = useState(initEntities(10));
  const [timerGrass, setTimerGrass] = useState(0);

  const updateGame = () => {
    setTimerGrass(timerGrass + 1);
    let duplicatedEntities = [];

    let newEntities = entities
      .map((entity) => {
        if (entity.type !== "grass") {
          let newVector = [entity.vector[0], entity.vector[1]];
          newVector = checkCollisions(entity, newVector);
          let stamina = entity.stamina - 1;
          let speed =
            entity.type === "rabbit"
              ? stamina / (rabbitsStamina / 5) + 1
              : stamina / (wolfsStamina / 2) + 1;

          let newEntitiesCoord;
          let type = entity.type;

          if (entity.type === "wolf") {
            stamina =
              stamina > wolfsStamina ? (stamina = wolfsStamina) : stamina;

            let targetRabbit = false;
            entities.forEach((entitieAround) => {
              if (entitieAround.type === "rabbit") {
                if (!targetRabbit) {
                  targetRabbit = entitieAround;
                } else {
                  const wolfCoord = entity.coord;
                  const rabbitCoord = entitieAround.coord;
                  const targetCoord = targetRabbit.coord;

                  const distArround = Math.sqrt(
                    (rabbitCoord[0] - wolfCoord[0]) ** 2 +
                      (rabbitCoord[1] - wolfCoord[1]) ** 2
                  );

                  const distTarget = Math.sqrt(
                    (targetCoord[0] - wolfCoord[0]) ** 2 +
                      (targetCoord[1] - wolfCoord[1]) ** 2
                  );

                  if (distArround < distTarget) {
                    targetRabbit = entitieAround;
                  }

                  if (
                    entity.coord[0] - entitieAround.coord[0] <= 10 &&
                    entity.coord[0] - entitieAround.coord[0] >= -10 &&
                    entity.coord[1] - entitieAround.coord[1] <= 10 &&
                    entity.coord[1] - entitieAround.coord[1] >= -10
                  ) {
                    stamina += wolfsStamina / 10;
                    if (stamina >= wolfsStamina) {
                      stamina /= 2;
                      duplicatedEntities.push({
                        id: randomId(),
                        type: entity.type,
                        coord: randomCoord(),
                        // coord: entity.coord,
                        stamina: 500,
                        speed: 3,
                        vector: randomVector(),
                      });
                      // console.log(newEntities);
                    }
                  }
                }
              }
            });

            const distX = targetRabbit.coord[0] - entity.coord[0];
            const distY = targetRabbit.coord[1] - entity.coord[1];
            const angle = Math.atan2(distY, distX);

            newEntitiesCoord = [
              entity.coord[0] + Math.cos(angle) * speed,
              entity.coord[1] + Math.sin(angle) * speed,
            ];

            return {
              ...entity,
              coord: newEntitiesCoord,
              vector: newVector,
              type,
              stamina,
              speed,
            };
          } else if (entity.type === "rabbit") {
            stamina =
              stamina > rabbitsStamina ? (stamina = rabbitsStamina) : stamina;
            let eaten = false;
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
                if (
                  entity.coord[0] - entitieAround.coord[0] <= 10 &&
                  entity.coord[0] - entitieAround.coord[0] >= -10 &&
                  entity.coord[1] - entitieAround.coord[1] <= 10 &&
                  entity.coord[1] - entitieAround.coord[1] >= -10
                ) {
                  stamina += rabbitsStamina / 5;
                  if (stamina >= rabbitsStamina) {
                    stamina = stamina * 0.8;
                    duplicatedEntities.push({
                      id: randomId(),
                      type: entity.type,
                      coord: entity.coord,
                      stamina: rabbitsStamina,
                      speed: 6,
                      vector: randomVector(),
                      eaten: false,
                    });
                    // console.log(newEntities);
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
              stamina: stamina,
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
      // newEntities = [...newEntities, ...duplicatedEntities];
      duplicatedEntities.forEach((duplicatedEntity) => {
        newEntities.push(duplicatedEntity);
      });
      // console.log(duplicatedEntities);
      duplicatedEntities = [];
    }

    if (timerGrass % 20 === 0) {
      newEntities.push({
        id: randomId(),
        type: "grass",
        coord: randomCoord(),
      });
    }
    setEntities(newEntities);
  };

  // *** useEffect ***
  useEffect(() => {
    const intervalId = setTimeout(() => {
      updateGame();
    }, 10);

    return () => clearInterval(intervalId);
  }, [entities]);

  return (
    <>
      <div
        className="game"
        style={{ width: width + 10 + "px", height: height + 10 + "px" }}
      >
        {entities.map((entity, i) => {
          return <Entity entity={entity} key={i} />;
        })}
      </div>
    </>
  );
};

export default Game;
