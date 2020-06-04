import './App.css'
import React, {useState, useEffect} from 'react'
const clientId = process.env.REACT_APP_CLIENT_ID



function App() {
  const [token, setToken] = useState(null)

  const getToken = () => {
    const existingToken = localStorage.getItem('token')
    const accessToken = (window.location.search.split("=")[0] === "?access_token") ? window.location.search.split("=")[1].split("&")[0] : null // read the token value from body (url)

    if (!accessToken && !existingToken) {
      window.location.replace(`https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=${clientId}`)
    }

    if (accessToken) { // if you get token value from url
      console.log(`New accessToken: ${accessToken}`)

      localStorage.setItem("token", accessToken) // save it to the localStorage
      setToken(accessToken) // set the state
    }

    if (existingToken) { // if you have token on your localStorage already
      setToken(existingToken) // set the state
    }
  }

  
  const getIssue = async() => {
    console.log("Let get issue")
    let url = `https://api.github.com/repos/facebook/react/issues`
    let data = await fetch(url)
    let result = await data.json()
    console.log("Data result is: ", result)
  }

  const postNewIssue = async() => {
    const issue = { title: " here is the issue", body: "Help me to fix it" };
    const url = `https://api.github.com/repos/huytrananh/catch-monster/issues`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `token ${token}`
      },
      body: JSON.stringify(issue)
    });
    console.log("Response is: ", response)
  }

  useEffect(() => {
    getToken()
  }, [])

  

  return (
    <div>
      {console.log("what is token: ", token)}
      <button onClick={()=>{getIssue()}}>Search</button>
      <button onClick={()=>{postNewIssue()}}>New Issue</button>
    </div>
  )
}

export default App;
