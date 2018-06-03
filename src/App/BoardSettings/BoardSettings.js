import React from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

const BoardSettings = ({ boardSize, updateBoardSize }) => {
  const boardSizes = [3, 4, 5];
  return (
    <UncontrolledDropdown>
      <DropdownToggle caret>{`${boardSize}x${boardSize}`}</DropdownToggle>
      <DropdownMenu>
        <BoardSizeList />
      </DropdownMenu>
    </UncontrolledDropdown>
  );

  function BoardSizeList() {
    return boardSizes.map(size => (
      <DropdownItem
        key={`boardSize-${size}`}
        onClick={() => updateBoardSize(size)}
      >{`${size}x${size}`}</DropdownItem>
    ));
  }
};

export default BoardSettings;
