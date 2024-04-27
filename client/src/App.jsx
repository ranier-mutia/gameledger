import React from 'react'
import Header from "./pages/layouts/Header.jsx"
import Sidebar from "./pages/layouts/Sidebar.jsx"
import Content from "./pages/layouts/Content.jsx"

const App = () => {
  return (
    <>
      <Header />
      <div className='flex'>
        <Sidebar />
        <Content />
      </div>
    </>

  )
}

export default App