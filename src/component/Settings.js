import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const Settings = (props) => {
  const navigate = useNavigate();

  const [wolfsNb, setWolfsNb] = useState(4);
  const [rabbitsNb, setRabbitsNb] = useState(10);

  const [wolfsStamina, setWolfsStamina] = useState(2000);
  const [rabbitsStamina, setRabbitsStamina] = useState(1000);

  const [wolfsSpeed, setWolfsSpeed] = useState(4);
  const [rabbitSpeed, setRabbitSpeed] = useState(4);

  const [wolfsIncreaseStamina, setWolfsIncreaseStamina] = useState(200);
  const [rabbitsIncreaseStamina, setRabbitsIncreaseStamina] = useState(200);

  const [rabbitRangeEat, setRabbitRangeEat] = useState(30);

  const [grassNb, setGrassNb] = useState(20);
  const [grassDuplicationFactor, setGrassDuplicationFactor] = useState(20);

  const wolfSettings = {
    nb: wolfsNb,
    stamina: wolfsStamina,
    speed: wolfsSpeed,
    increaseStamina: wolfsIncreaseStamina,
  };
  const rabbitSettings = {
    nb: rabbitsNb,
    stamina: rabbitsStamina,
    speed: rabbitSpeed,
    increaseStamina: rabbitsIncreaseStamina,
    rangeEat: rabbitRangeEat,
  };
  const grassSettings = {
    nb: grassNb,
    duplicationFactor: grassDuplicationFactor,
  };

  return (
    <>
      <h1 className="mt-5 pt-3">Wolfs</h1>
      <div className="setting">
        <Form.Label>Numbers: {wolfsNb}</Form.Label>
        <Form.Range
          value={wolfsNb}
          onChange={(e) => setWolfsNb(parseInt(e.target.value))}
          className="slider"
          max={100}
          step={1}
        />
      </div>
      <div className="setting">
        <Form.Label>Speed: {wolfsSpeed}</Form.Label>
        <Form.Range
          value={wolfsSpeed}
          onChange={(e) => setWolfsSpeed(parseInt(e.target.value))}
          className="slider"
          max={20}
          step={1}
        />
      </div>
      <div className="setting">
        <Form.Label>Stamina: {wolfsStamina}</Form.Label>
        <Form.Range
          value={wolfsStamina}
          onChange={(e) => setWolfsStamina(parseInt(e.target.value))}
          className="slider"
          max={10000}
          step={100}
        />
      </div>
      <div className="setting">
        <Form.Label>Increase stamina: {wolfsIncreaseStamina}</Form.Label>
        <Form.Range
          value={wolfsIncreaseStamina}
          onChange={(e) => setWolfsIncreaseStamina(parseInt(e.target.value))}
          className="slider"
          max={wolfsStamina}
          step={50}
        />
      </div>

      {/* ************************************************** */}

      <h1 className="mt-5 pt-3">Rabbits</h1>
      <div className="setting">
        <Form.Label>Numbers: {rabbitsNb}</Form.Label>
        <Form.Range
          value={rabbitsNb}
          onChange={(e) => setRabbitsNb(parseInt(e.target.value))}
          className="slider"
          max={100}
          step={1}
        />
      </div>
      <div className="setting">
        <Form.Label>Speed: {rabbitSpeed}</Form.Label>
        <Form.Range
          value={rabbitSpeed}
          onChange={(e) => setRabbitSpeed(parseInt(e.target.value))}
          className="slider"
          max={20}
          step={1}
        />
      </div>
      <div className="setting">
        <Form.Label>Stamina: {rabbitsStamina}</Form.Label>
        <Form.Range
          value={rabbitsStamina}
          onChange={(e) => setRabbitsStamina(parseInt(e.target.value))}
          className="slider"
          max={10000}
          step={100}
        />
      </div>
      <div className="setting">
        <Form.Label>Increase stamina: {rabbitsIncreaseStamina}</Form.Label>
        <Form.Range
          value={rabbitsIncreaseStamina}
          onChange={(e) => setRabbitsIncreaseStamina(parseInt(e.target.value))}
          className="slider"
          max={rabbitsStamina}
          step={50}
        />
      </div>
      <div className="setting">
        <Form.Label>Detection range of grass: {rabbitRangeEat}</Form.Label>
        <Form.Range
          value={rabbitRangeEat}
          onChange={(e) => setRabbitRangeEat(parseInt(e.target.value))}
          className="slider"
          max={100}
          step={1}
        />
      </div>

      {/* ************************************************** */}

      <h1 className="mt-5 pt-3">Grass</h1>
      <div className="setting">
        <Form.Label>Numbers: {grassNb}</Form.Label>
        <Form.Range
          value={grassNb}
          onChange={(e) => setGrassNb(parseInt(e.target.value))}
          className="slider"
          max={100}
          step={1}
        />
      </div>
      <div className="setting">
        <Form.Label>Factor of duplication: {grassDuplicationFactor}</Form.Label>
        <Form.Range
          value={grassDuplicationFactor}
          onChange={(e) => setGrassDuplicationFactor(parseInt(e.target.value))}
          className="slider"
          max={100}
          step={1}
        />
        <p>
          The factor of duplication is based on a logarithme fonction. The
          smaller the number, the longer the delay between 2 duplications.
        </p>
      </div>

      <Button
        className="mt-5 mb-5"
        onClick={() =>
          navigate("/game", {
            state: { wolfSettings, rabbitSettings, grassSettings },
          })
        }
      >
        Launch
      </Button>
    </>
  );
};

export default Settings;
