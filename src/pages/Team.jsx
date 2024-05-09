import React, { useEffect } from 'react'
import { Box } from '@mui/material';

const Team = () => {
  useEffect(()=>{
    window.scrollTo(0, 0);
  }, [])
  return (
    <Box my={30}>
      This page is under development
    </Box>
  )
}

export default Team
