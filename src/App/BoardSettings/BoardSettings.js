import React from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

const BoardSettings = ({
  boardSize,
  computerCount,
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
    <div>
      <div>
        <UncontrolledDropdown>
          <DropdownToggle caret>
            {computerCountText[computerCount]}
          </DropdownToggle>
          <DropdownMenu>
            <ComputerCountList />
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      <div>
        <UncontrolledDropdown>
          <DropdownToggle caret>{`${boardSize}x${boardSize}`}</DropdownToggle>
          <DropdownMenu>
            <BoardSizeList />
          </DropdownMenu>
        </UncontrolledDropdown>
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
