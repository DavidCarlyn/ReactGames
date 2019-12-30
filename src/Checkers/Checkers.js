import React, { useState, useEffect } from 'react';
import Tile from './Tile/Tile.js';

import './Checkers.css';


function getTile(x, y) {
    return document.getElementsByClassName("Tile")[(y * 8) + x];
}

function isLegalMove(x1, y1, x2, y2, pieces) {
    if (x2 > 7 || x2 < 0 || y2 < 0 || y2 > 7) return false; // Stay within boundaries
    if (x1 === x2 || y1 === y2) return false; // Can not move in non-diagonal movements

    const startIndex = pieces.findIndex(p => p.x === x1 && p.y === y1);
    if (startIndex === -1) return false; // Should never happen...
    const startType = pieces[startIndex].type;
    const startIsKing = pieces[startIndex].isKing;

    // Cannot move backwards if not a king
    if (!startIsKing) {
        if (y2 < y1 && startType === "black") return false;
        if (y2 > y1 && startType === "red") return false;
    }
    // Simple move
    if (Math.abs(x2 - x1) === 1 && Math.abs(y2 - y1) === 1) {
        // Handling if a piece was present or not is handled in handleClick atm.
        // Should probably bring that logic here...
        console.log("Move");
    // Jump
    } else if (Math.abs(x2 - x1) === 2 && Math.abs(y2 - y1) === 2) {
        console.log("Jump");
        const startIndex = pieces.findIndex(p => p.x === x1 && p.y === y1);
        if (startIndex === -1) return false; // Should never happen...
        const startType = pieces[startIndex].type;
        const middleX = (x1+x2) / 2; // Should always evenly divide
        const middleY = (y1+y2) / 2; // Should always evenly divide
        const middleIndex = pieces.findIndex(p => p.x === middleX && p.y === middleY);
        if (middleIndex === -1) return false;
        const middleType = pieces[middleIndex].type;
        if (middleType === startType) return false;
    } else {
        return false;
    }

    return true;
}

function handleClick(tile, selected, setSelected, pieces, setPieces) {
    const clickedTile = getTile(tile.x, tile.y);
    const clickedPiece = clickedTile.getElementsByClassName("piece")[0];
    const isPiece = clickedPiece.style.display === "block";
    if (selected.isSelected) {
        if (isPiece) return;
        if (!isLegalMove(selected.x, selected.y, tile.x, tile.y, pieces)) return;
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