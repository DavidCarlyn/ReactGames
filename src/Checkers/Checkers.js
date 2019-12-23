import React, { useState, useEffect } from 'react';
import Tile from './Tile/Tile.js';

import './Checkers.css';



function handleClick(tile, selected, setSelected) {
    const clickedTile = document.getElementsByClassName("Tile")[(tile.y * 8) + tile.x];
    const clickedPiece = clickedTile.getElementsByClassName("piece")[0];
    const isPiece = clickedPiece.style.display === "block";
    if (selected.isSelected) {
        if (isPiece) return;
        const selectedTile = document.getElementsByClassName("Tile")[(selected.y * 8) + selected.x];
        const selectedPiece = selectedTile.getElementsByClassName("piece")[0];
        selectedPiece.style.display = "none";
        clickedPiece.style.display = "block";
        setSelected({
            ...selected,
            isSelected : false
        });
    } else {
        if (!isPiece) return;
        setSelected({
            ...selected,
            x : tile.x,
            y : tile.y,
            isSelected : true
        });
    }
}

function createBoard(selected, setSelected) {
    var board = [];
    for (var i = 0; i < 8; ++i) {
        for (var j = 0; j < 8; ++j) {
            const isRed = (j%2 === 0 && i%2 === 0) || (j%2 === 1 && i%2 === 1);
            board.push(<Tile onClick={(e)=>handleClick(e, selected, setSelected)} type={isRed ? "red" : "black"} x={j} y={i} />);
        }
    }
    return board;
}

function placePieces() {
    const allTiles = document.getElementsByClassName("Tile");
    const startPieces = [0,  2,  4,  6,  9, 11, 13, 15, 16, 18, 20, 22,
                        40, 42, 44, 46, 49, 51, 53, 55, 56, 58, 60, 62];
    startPieces.forEach(piece => {
        allTiles[piece].getElementsByClassName("piece")[0].style.display = "block";
    });
}

function Checkers() {
    const [selected, setSelected] = useState({
        x : 0,
        y : 0,
        color : 'red',
        isKing : false,
        isSelected : false
    });

    useEffect(() => {
        placePieces();
    });

    return (
        <div className="Checkers">
            {createBoard(selected, setSelected)}
        </div>
    );
}

export default Checkers;