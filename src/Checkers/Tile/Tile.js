import React from 'react';

import './Tile.css';

function Tile(props) {
    return (
        <div onClick={() => props.onClick(props)} className={"Tile " + props.type + "-tile"}><div className="piece"></div></div>
    )
}

export default Tile;