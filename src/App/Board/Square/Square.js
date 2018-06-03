import React from 'react';

const Square = ({ marker, onUpdate }) => {
  return (
    <td style={{ cursor: 'pointer' }} onClick={onUpdate}>
      {marker}
    </td>
  );
};

export default Square;
