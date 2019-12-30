import React, { useState, useEffect } from 'react';
import Tile from './Tile/Tile.js';

import './Board.css';


function getTile(x, y) {
    return document.getElementsByClassName("Tile")[(y * 8) + x];
}

function getMoveDetails(x1, y1, x2, y2, pieces) {
    var details = {
        legal : false,
        type : -1,
        jumpedPiece : -1
    }
    if (x2 > 7 || x2 < 0 || y2 < 0 || y2 > 7) return details; // Stay within boundaries
    if (x1 === x2 || y1 === y2) return details; // Can not move in non-diagonal movements

    const startIndex = pieces.findIndex(p => p.x === x1 && p.y === y1);
    if (startIndex === -1) return details; // Should never happen...
    const startType = pieces[startIndex].type;
    const startIsKing = pieces[startIndex].isKing;

    // Cannot move backwards if not a king
    if (!startIsKing) {
        if (y2 < y1 && startType === "black") return details;
        if (y2 > y1 && startType === "red") return details;
    }
    // Simple move
    if (Math.abs(x2 - x1) === 1 && Math.abs(y2 - y1) === 1) {
        // Handling if a piece was present or not is handled in handleClick atm.
        // Should probably bring that logic here...
        console.log("Move");
        details.type = 0;
    // Jump
    } else if (Math.abs(x2 - x1) === 2 && Math.abs(y2 - y1) === 2) {
        console.log("Jump");
        const startIndex = pieces.findIndex(p => p.x === x1 && p.y === y1);
        if (startIndex === -1) return details; // Should never happen...
        const startType = pieces[startIndex].type;
        const middleX = (x1+x2) / 2; // Should always evenly divide
        const middleY = (y1+y2) / 2; // Should always evenly divide
        const middleIndex = pieces.findIndex(p => p.x === middleX && p.y === middleY);
        if (middleIndex === -1) return details;
        const middleType = pieces[middleIndex].type;
        if (middleType === startType) return details;
        details.type = 1;
        details.jumpedPiece = {
            type : middleType,
            x : middleX,
            y : middleY
        }
    } else {
        return details;
    }

    details.legal = true;
    return details;
}

function handleClick(tile, selected, setSelected, pieces, setPieces, gameStats, setGameStats) {
    const clickedTile = getTile(tile.x, tile.y);
    const clickedPiece = clickedTile.getElementsByClassName("piece")[0];
    const isPiece = clickedPiece.style.display === "block";
    if (selected.isSelected) {
        if (isPiece) {
            if (tile.x === selected.x && tile.y === selected.y) {
                clickedPiece.className = selected.type === "black" ? "piece black-piece" : "piece red-piece";
                setSelected({
                    ...selected,
                    isSelected : false
                })
            }

            return;
        }
        const moveDetails = getMoveDetails(selected.x, selected.y, tile.x, tile.y, pieces);
        if (!moveDetails.legal) return;
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

        // If move type is jumped
        if (moveDetails.type === 1) {
            const jumpedIndex = piecesCopy.findIndex(p => p.x === moveDetails.jumpedPiece.x && p.y === moveDetails.jumpedPiece.y);
            const jumpedPiece = piecesCopy.splice(jumpedIndex, 1)[0];
            const jumpedTile = getTile(jumpedPiece.x, jumpedPiece.y);
            const jumpedPieceEle = jumpedTile.getElementsByClassName("piece")[0];
            jumpedPieceEle.className = "piece";
            jumpedPieceEle.style.display = "none";
        }
        setPieces(piecesCopy);
        const newRedPieces = gameStats.turn === 1 || moveDetails.type !== 1 ? gameStats.redPieces : gameStats.redPieces - 1;
        const newBlackPieces = gameStats.turn === 0 || moveDetails.type !== 1 ? gameStats.blackPieces : gameStats.blackPieces - 1;
        var newMessage = gameStats.message;
        if (newRedPieces === 0) {
            newMessage = "Black won!";
        } else if (newBlackPieces === 0) {
            newMessage = "Red won!";
        }
        setGameStats({
            ...gameStats,
            turn : gameStats.turn === 0 ? 1 : 0,
            redPieces : newRedPieces,
            blackPieces : newBlackPieces,
            message :  newMessage        
        });
    } else {
        if (!isPiece) return;
        const clickedPieceType = pieces.find(p => p.x === tile.x && p.y === tile.y).type;
        if (clickedPieceType === "black" && gameStats.turn !== 0) return;
        if (clickedPieceType === "red" && gameStats.turn !== 1) return;
        clickedPiece.className = clickedPiece.className + " selected";
        setSelected({
            ...selected,
            x : tile.x,
            y : tile.y,
            type : clickedPieceType,
            isSelected : true
        });
    }
}

function createBoard(selected, setSelected, pieces, setPieces, gameStats, setGameStats) {
    var board = [];
    for (var i = 0; i < 8; ++i) {
        for (var j = 0; j < 8; ++j) {
            const isRed = (j%2 === 0 && i%2 === 0) || (j%2 === 1 && i%2 === 1);
            board.push(<Tile 
                onClick={(e)=>handleClick(e, selected, setSelected, pieces, setPieces, gameStats, setGameStats)} 
                type={isRed ? "red" : "black"} x={j} y={i} 
            />);
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

function Board(props) {
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
        <div className="Board">
            {createBoard(selected, setSelected, pieces, setPieces, props.gameStats, props.setGameStats)}
        </div>
    );
}

export default Board;