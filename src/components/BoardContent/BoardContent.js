import React, { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import {
  Container as BootstrapContainer,
  Row,
  Col,
  Form,
  Button
} from 'react-bootstrap'
import './BoardContent.scss'

import { isEmpty, cloneDeep } from 'lodash'

import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'
import {
  fetchBoardDetails,
  createNewColumn,
  updateBoard,
  updateColumn,
  updateCard
} from 'actions/apiCall'

function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const newColumInputRef = useRef(null)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const onNewColumnTitleChange = (e) => setNewColumnTitle(e.target.value)

  useEffect(() => {
    const boardId = '612dc9e658e57ba29594de0f'
    fetchBoardDetails(boardId).then((board) => {
      setBoard(board)
      setColumns(mapOrder(board.columns, board.columnOrder, '_id'))
    })
  }, [])

  useEffect(() => {
    if (newColumInputRef && newColumInputRef.current) {
      newColumInputRef.current.focus()
      newColumInputRef.current.select()
    }
  }, [openNewColumnForm])

  if (isEmpty(board)) {
    return (
      <div className="not-found" style={{ padding: '10px', color: 'white' }}>
        Board not found!
      </div>
    )
  }

  const onColumnDrop = (dropResult) => {
    let newColumns = cloneDeep(columns)
    newColumns = applyDrag(newColumns, dropResult)

    let newBoard = cloneDeep(board)
    newBoard.columnOrder = newColumns.map((c) => c._id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)

    // Call api update columnOrder in board
    updateBoard(newBoard._id, newBoard).catch(() => {
      setColumns(columns)
      setBoard(board)
    })

  }

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = cloneDeep(columns)

      let currentColumn = newColumns.find((c) => c._id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map((i) => i._id)

      setColumns(newColumns)
      if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
        // Action : move card inside one column
        updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns))
      } else {
        // Action : move card beetween two column
        updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns))

        if (dropResult.addedIndex !== null) {
          let currentCard = cloneDeep(dropResult.payload)
          currentCard.columnId = currentColumn._id
          // Call api update columnId in current card
          updateCard(currentCard._id, currentCard)
        }
      }
    }
  }

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumInputRef.current.focus()
      return
    }

    const newColumnToAdd = {
      boardId: board._id,
      title: newColumnTitle.trim()
    }
    // Call Api
    createNewColumn(newColumnToAdd).then(column => {
      let newColumns = [...columns]
      newColumns.push(column)

      let newBoard = { ...board }
      newBoard.columnOrder = newColumns.map((c) => c._id)
      newBoard.columns = newColumns

      setColumns(newColumns)
      setBoard(newBoard)
      setNewColumnTitle('')
      toggleNewColumnForm()
    })
  }

  const onUpdateColumnState = (newColumnToUpdate) => {
    const columIdToUpdate = newColumnToUpdate._id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(
      (i) => i._id === columIdToUpdate
    )

    if (newColumnToUpdate._destroy) {
      // remove column
      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      // update column info
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
    }

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map((c) => c._id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={(index) => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumnState={onUpdateColumnState}
            />
          </Draggable>
        ))}
      </Container>

      <BootstrapContainer className="trello-container">
        {!openNewColumnForm && (
          <Row>
            <Col className="add-new-column" onClick={toggleNewColumnForm}>
              <i className="fa fa-plus icon" />
              Add another column
            </Col>
          </Row>
        )}
        {openNewColumnForm && (
          <Row>
            <Col className="enter-new-column">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter column title..."
                className="input-enter-new-column"
                ref={newColumInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={(event) => event.key === 'Enter' && addNewColumn()}
              />
              <Button
                variant="success"
                size="sm"
                className="button-enter-new-column"
                onClick={addNewColumn}
              >
                Add column
              </Button>
              <span className="cancel-icon" onClick={toggleNewColumnForm}>
                <i className="fa fa-trash icon"></i>
              </span>
            </Col>
          </Row>
        )}
      </BootstrapContainer>
    </div>
  )
}

export default BoardContent
