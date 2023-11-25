import React from 'react'
import { cell_border_color, cell_general_styles } from '../styles'

export const CellBlocked = () => {
  return (
    <div className={`${cell_general_styles} ${cell_border_color} bg-sky-500 `}>
    </div>
  )
}
