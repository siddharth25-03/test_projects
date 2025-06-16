import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Todolist from './Todolist.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <Todolist />
  </>
)
