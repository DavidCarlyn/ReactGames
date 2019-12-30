import React, { useState, useEffect } from 'react';
import Tile from './Tile/Tile.js';

import './Checkers.css';


function getTile(x, y) {
    return document.getElementsByClassName("Tile")[(y * 8) + x];
}

function handleClick(tile, selected, setSelected, pieces, setPieces) {
    const clickedTile = getTile(tile.x, tile.y);
    const clickedPiece = clickedTile.getElementsByClassName("piece")[0];
    const isPiece = clickedPiece.style.display === "block";
    if (selected.isSelected) {
        if (isPiece) return;
        const selectedTile = getTile(selected.x, selected.y);
        const selectedPiece = selectedTile.getElementsByClassName("piece")[0];
        var piecesCopy = pieces;
        const selectedIndex = piecesCopy.findIndex(p => p.x === selected.x && p.y === selected.y);

        piecesCopy[selectedIndex].x = tile.x;
        piecesCopy[selectedIndex].y = tile.y;
        selectedPiece.style.display = "none";
        selectedPiece.className = "piece";
        clickedPiece.style.display = "block";
        clickedPiece.className = pieces[selectedIndex].type === "black" ? "piece black-piece" : "piece red-piece";
        setSelected({
            ...selected,
            isSelected : false
        });
        setPieces(piecesCopy);
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

function createBoard(selected, setSelected, pieces, setPieces) {
    var board = [];
    for (var i = 0; i < 8; ++i) {
        for (var j = 0; j < 8; ++j) {
            const isRed = (j%2 === 0 && i%2 === 0) || (j%2 === 1 && i%2 === 1);
            board.push(<Tile onClick={(e)=>handleClick(e, selected, setSelected, pieces, setPieces)} type={isRed ? "red" : "black"} x={j} y={i} />);
        }
    }
    return board;
}

function placePieces(pieces) {
    const allTiles = document.getElementsByClassName("Tile");
    pieces.forEach(piece => {
        const pieceElement = allTiles[(piece.y * 8) + piece.x].getElementsByClassName("piece")[0];
        pieceElement.style.display = "block";
        pieceElement.className = piece.type === "black" ? "piece black-piece" : "piece red-piece";
    });
}

function initializePieces() {
    return [
        { x : 1, y : 0, type : 'black', isKing : false },
        { x : 3, y : 0, type : 'black', isKing : false },
        { x : 5, y : 0, type : 'black', isKing : false },
        { x : 7, y : 0, type : 'black', isKing : false },
        { x : 0, y : 1, type : 'black', isKing : false },
        { x : 2, y : 1, type : 'black', isKing : false },
        { x : 4, y : 1, type : 'black', isKing : false },
        { x : 6, y : 1, type : 'black', isKing : false },
        { x : 1, y : 2, type : 'black', isKing : false },
        { x : 3, y : 2, type : 'black', isKing : false },
        { x : 5, y : 2, type : 'black', isKing : false },
        { x : 7, y : 2, type : 'black', isKing : false },
        { x : 0, y : 5, type : 'red', isKing : false },
        { x : 2, y : 5, type : 'red', isKing : false },
        { x : 4, y : 5, type : 'red', isKing : false },
        { x : 6, y : 5, type : 'red', isKing : false },
        { x : 1, y : 6, type : 'red', isKing : false },
        { x : 3, y : 6, type : 'red', isKing : false },
        { x : 5, y : 6, type : 'red', isKing : false },
        { x : 7, y : 6, type : 'red', isKing : false },
        { x : 0, y : 7, type : 'red', isKing : false },
        { x : 2, y : 7, type : 'red', isKing : false },
        { x : 4, y : 7, type : 'red', isKing : false },
        { x : 6, y : 7, type : 'red', isKing : false }
    ]
}

function Checkers() {
    const [selected, setSelected] = useState({
        x : 0,
        y : 0,
        color : 'red',
        isKing : false,
        isSelected : false
    });

    const [pieces, setPieces] = useState(initializePieces());

    useEffect(() => {
        placePieces(pieces);
    }, [pieces]);

    return (
        <div className="Checkers">
            {createBoard(selected, setSelected, pieces, setPieces)}
        </div>
    );
}

export default Checkers;