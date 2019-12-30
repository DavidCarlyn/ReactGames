import React, { useState } from 'react';

import './Checkers.css';
import Board from './Board.js';

function Checkers() {
    const [gameStats, setGameStats] = useState({
        turn : 0,
        redPieces : 12,
        blackPieces : 12,
        message : "Have fun!"
    });

    return (
        <div className="Checkers">
            <Board gameStats={gameStats} setGameStats={setGameStats} />
            <div className="score-area">
                <div>Turn : { gameStats.turn === 0 ? "Black" : "Red" }</div>
                <div>Red Pieces Remaining : { gameStats.redPieces }</div>
                <div>Black Pieces Remaining : { gameStats.blackPieces }</div>
                <div>{ gameStats.message }</div>
            </div>
        </div>
    );
}

export default Checkers;