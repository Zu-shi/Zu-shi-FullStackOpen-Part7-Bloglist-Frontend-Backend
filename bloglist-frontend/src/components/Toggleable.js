import { useState } from 'react'

const Toggleable = (props) => {
  const [visible, setVisible] = useState(false)

  // const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div>
      <div style={showWhenVisible}>
        {props.children}
      </div >
      <button id={props.buttonName} onClick={() => setVisible(!visible)}>{visible ? props.hideButtonText : props.showButtonText}</button>
    </div>
  )
  /*

    visible
      ? <div>
        <div style={visible ? showWhenVisible}>
          {props.children}
        </div >
        <button onClick={() => setVisible(!visible)}>{props.showButtonText}</button>
      </div >
      :
      <div>
        <button onClick={() => setVisible(!visible)}>{props.hideButtonText}</button>
      </div>
  */
}

Toggleable.displayName = 'Toggleable'
export default Toggleable