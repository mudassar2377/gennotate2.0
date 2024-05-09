import { Box, Button } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import gennotateContext from '../gennotateContext/gennotateContext';

const Custom = () => {
  useEffect(()=>{
    window.scrollTo(0, 0);
  }, [])
    const context = useContext(gennotateContext);
    const { setFile, cleanImages, user } = context;
    const handleImageChange = (e) => {
        setFile(e.target.files[0]);
    }
    const handleSubmit = () =>{
        cleanImages({ "userId": user.id })
    }
  return (
    <Box px={6} mt={20} sx={{ height: '80vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <input type="file" accept="image/png, image/jpeg"  onChange={handleImageChange}/>
        <Box my={3}>
          <Button onClick={handleSubmit} variant='contained' style={{ backgroundImage: 'linear-gradient(to bottom, #0ea190, #11b97c)', fontWeight: 'bold' }}>Submit</Button>
        </Box>
    </Box>
  )
}

export default Custom
