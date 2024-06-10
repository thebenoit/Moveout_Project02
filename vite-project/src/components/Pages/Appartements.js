import React, { useEffect, useState } from 'react'
import Cards from '../Card'
import Box from '../BoxChoix'

function Appartement() {

  const [maxPrice, setMaxPrice] = useState();
  const [maxBedrooms, setMaxBedrooms] = useState()
 

  return (
    <div className="flex space-x-8 p-4">
      <br></br>
      <br></br>
      <div className="flex justify-center items-center h-screen ">
      <Box
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        setMaxBedrooms={setMaxBedrooms}
        maxBedrooms={maxBedrooms}
      />

      </div>
      <div>

      <Cards
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        setMaxBedrooms={setMaxBedrooms}
        maxBedrooms={maxBedrooms}
      />

      </div>
      
    </div>
  )
}

export default Appartement
