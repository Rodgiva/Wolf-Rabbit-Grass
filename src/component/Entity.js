const Entity = (props) => {
  const type = props.entity.type;
  let x = props.entity.coord[0];
  let y = props.entity.coord[1];

  if (type !== "grass") {
    x = props.entity.coord[0];
    y = props.entity.coord[1];
  }
  const coord = {
    left: `${x}px`,
    top: `${y}px`,
  };
  return (
    <>
      <div className={`entity ${type}`} style={coord}></div>
    </>
  );
};

export default Entity;
