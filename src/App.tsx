import { useState, type ChangeEvent } from 'react'
import Viewer from './components/Viewer'
import FileInput from './components/FileInput'


function App() {
  const [fileUrl, setFileUrl] = useState<string | undefined>()

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files.length > 0) {
      const url = URL.createObjectURL(e.target.files[0])
      setFileUrl(url)
    }
  }

  return (
    <>
      <FileInput onChange={handleFile}/>
      {fileUrl && <Viewer fileUrl={fileUrl} />}
    </>
  )
}

export default App