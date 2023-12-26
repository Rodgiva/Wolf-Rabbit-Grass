import { useLocation, useNavigate } from "react-router-dom";

const GameOver = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const entity = location.state.entity;

  setTimeout(() => {
    navigate("/");
  }, 5000);

  return (
    <>
      <h1>The {entity} has become extinct</h1>
    </>
  );
};

export default GameOver;
