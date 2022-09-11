import { FC } from 'react'
import './App.css'
import refine from '@modou/refine'

const App: FC = () => {
  return (
    <div className="App">
      <button onClick={() => {
        console.log(refine.object({}))
      }}>测试
      </button>
    </div>
  )
}

export default App
