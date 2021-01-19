import React from 'react';

export default function Wrapper(props) {
  return (
    <div
      style={{
        margin: 'auto 30px',
        paddingBottom: '30px',
      }}
    >
      {props.children}
    </div>
  );
}
