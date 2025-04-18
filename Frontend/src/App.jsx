import { useEffect, useRef, useState } from 'react'
import './App.css'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import axios from 'axios'
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css";
import { FaRegCopy } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {

  const [code, setCode] = useState(`function sum(a, b){
    return a + b;
}`)

  const [isLoading, setIsLoading] = useState(false);

  const [review, setReview] = useState('')

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    setIsLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(response.data);
    } catch (error) {
      toast.error("Failed to fetch review.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success("Copied to Clipboard")
      })
      .catch(err => {
        toast.error("Failed to Copy")
      })
  }

  return (
    <>
      <main>
        <div>
          <p className='title'>codenalyze</p>
        </div>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code","Fira Mono", monospace',
                fontSize: 16,
                border: "1p solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}

            />
          </div>

          <div className='copyBtn ' onClick={handleCopy} >
            <FaRegCopy size={22} />
          </div>

          <div
            onClick={reviewCode}
            className="review">Review</div>
        </div>

        <div className="right">
          {
            isLoading ? (<span className='loader'></span>) : (<Markdown
              rehypePlugins={[rehypeHighlight]}
            >{review}</Markdown>)
          }
        </div>
      </main>
      <ToastContainer />
    </>
  )
}



export default App
