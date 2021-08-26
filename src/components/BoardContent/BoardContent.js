import React, { Component } from 'react';
import './BoardContent.scss';


import Column from 'components/Column/Column';


class BoardContent extends Component {
    render() {
        return (
            <div className="board-content">
                <Column/>
                <Column/>
                <Column/>
                <Column/>
                <Column/>
                <Column/>
                <Column/>
            </div>

        );
    }
}

export default BoardContent;
