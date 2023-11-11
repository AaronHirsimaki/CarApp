import { useState } from 'react'
import Carlist from './components/Carlist';

import './App.css'
import { AppBar, Typography } from '@mui/material';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppBar position = "sticky">
        <Typography variant = "h6">
        Autokauppa
        </Typography>
      </AppBar>
      <Carlist />
    </>
  );
}

export default App
