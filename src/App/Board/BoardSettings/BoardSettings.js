import React from 'react';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

const BoardSettings = ({
  boardSize,
  computerCount,
  resetBoard,
  updateBoardSize,
  updateComputerCount,
}) => {
  const boardSizes = [3, 4, 5];
  const computerCountText = [
    'Human vs Human',
    'Human vs Computer',
    'Computer vs Computer',
  ];
  return (
    <div className="d-flex">
      <div className="mr-3">
        <UncontrolledDropdown>
          <DropdownToggle caret>
            {computerCountText[computerCount]}
          </DropdownToggle>
          <DropdownMenu>
            <ComputerCountList />
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      <div className="mr-3">
        <UncontrolledDropdown>
          <DropdownToggle caret>{`${boardSize}x${boardSize}`}</DropdownToggle>
          <DropdownMenu>
            <BoardSizeList />
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      <div className="mr-3">
        <Button color="danger" onClick={resetBoard}>
          Reset
        </Button>
      </div>
    </div>
  );

  function BoardSizeList() {
    return boardSizes.map(size => (
      <DropdownItem
        key={`boardSize-${size}`}
        onClick={() => updateBoardSize(size)}
      >{`${size}x${size}`}</DropdownItem>
    ));
  }

  function ComputerCountList() {
    return computerCountText.map((text, index) => (
      <DropdownItem
        key={`computerCount-${index}`}
        onClick={() => updateComputerCount(index)}
      >
        {text}
      </DropdownItem>
    ));
  }
};

export default BoardSettings;
