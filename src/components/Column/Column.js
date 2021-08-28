/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect, useCallback } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form } from 'react-bootstrap'

import './Column.scss'

import Card from 'components/Card/Card'
import ComfirmModal from 'components/Common/ConfirmModal'
import { mapOrder } from 'utilities/sorts'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/contentEditable'

function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [columnTitle, setColumnTitle] = useState('')

  const handleColumnTitleChange = useCallback((e) => setColumnTitle(e.target.value), [])

  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  const onComfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      // remove column
      const newcolumn = {
        ...column,
        _destroy: true
      }
      onUpdateColumn(newcolumn)
    }
    toggleShowConfirmModal()
  }


  const handleColumnTitleBlur = () => {
    const newcolumn = {
      ...column,
      title: columnTitle
    }
    onUpdateColumn(newcolumn)
  }


  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control size="sm" type="text"
            className="trello-content-edittable"
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveContentAfterPressEnter}
            spellCheck="false" //Check
            onClick={selectAllInlineText}
            onMouseDown={e => e.preventDefault()}
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle size="sm" id="dropdown-basic" className="dropdown-btn" />

            <Dropdown.Menu>
              <Dropdown.Item>Add card...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column...</Dropdown.Item>
              <Dropdown.Item>Move all cards in this column(beta)...</Dropdown.Item>
              <Dropdown.Item>Archive all cards in this column(beta)...</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          orientation="vertical"
          groupName="col"
          onDrop={dropResult => onCardDrop(column.id, dropResult)}
          getChildPayload={index => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
      </div>
      <footer>
        <div className="footer-action">
          <i className="fa fa-plus icon"/>
          Add another card
        </div>
      </footer>

      <ComfirmModal
        show={showConfirmModal}
        onAction={onComfirmModalAction}
        title="Remove column"
        content={'Are you sure you want to remove <strong> ${column.title} </strong>.<br/>All related cards will aill also bo remove!'}
      />
    </div>
  )
}

export default Column
