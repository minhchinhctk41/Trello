import React, { Component } from 'react';

import './Task.scss';

import img_avatar from 'Images/avatar.png';

class Task extends Component {
    render() {
        return (
            <li className="task-item">
                <img src={img_avatar} alt="mc"></img>
                Title: Mc
            </li>
        );
    }
}

export default Task;
