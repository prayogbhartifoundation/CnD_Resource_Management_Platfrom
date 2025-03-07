import React, { useState } from 'react'
import '../../styles/PlantPage.css'
import UpdateInvetory from './components/UpdateInvetory'
import UpdateOfftake from './components/UpdateOfftake'
import AddNewProduct from './components/AddNewProduct'

const AuthorisedPlantHome = ({name}) => {
  const [btnClick, setBtnClick] = useState('')
  return (
    <div className="plantPage">
      <div>Hello Plant {name}</div>

      <hr />
      <div className="action-btns">
        <div className={`status-button ${btnClick === 'npr' ? 'clicked' : ''}`} onClick={() => setBtnClick('npr')}>Add New Product</div>
        <div className={`status-button ${btnClick === 'inv' ? 'clicked' : ''}`} onClick={() => setBtnClick('inv')}>Update Inventory</div>
        <div className={`status-button ${btnClick === 'oft' ? 'clicked' : ''}`} onClick={() => setBtnClick('oft')}>Update Offtake</div>
      </div>
      <hr />

      {btnClick === 'npr' && <AddNewProduct plantId={name}/>}
      {btnClick === 'inv' && <UpdateInvetory plantId={name}/>}
      {btnClick === 'oft' && <UpdateOfftake plantId={name}/>}


    </div>
  )
}

export default AuthorisedPlantHome