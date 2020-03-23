import React from 'react';

export const Box = React.memo(props => {
  let classes = 'box ' + props.class;

  return (
    <div className={classes}>
      <h3 className={props.checked ? 'white-text' : ''}>{props.label}</h3>
      <p>{props.value && props.value}</p>
    </div>
  );
});
