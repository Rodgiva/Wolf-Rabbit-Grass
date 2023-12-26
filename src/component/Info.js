const Score = (props) => {
  const nbWolfs = props.wolfs.nb;
  const nbRabbits = props.rabbits.nb;
  const nbGrass = props.grass.nb;
  return (
    <>
      <div className="info">
        <div className="infoEntity infoWolfs">
          <h3>Wolfs</h3>
          <h5>Nb : {nbWolfs}</h5>
        </div>
        <div className="infoEntity infoRabbits">
          <h3>Rabbits</h3>
          <h5>Nb : {nbRabbits}</h5>
        </div>
        <div className="infoEntity infoGrass">
          <h3>Grass</h3>
          <h5>Nb : {nbGrass}</h5>
        </div>
      </div>
    </>
  );
};

export default Score;
