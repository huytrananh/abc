import './App.css'
import React, {useState, useEffect} from 'react'
// import {Card, Button} from 'react-bootstrap'
// import moment from 'react'

const clientId = process.env.REACT_APP_CLIENT_ID



function App() {
  const [token, setToken] = useState(null)
  let [issueList, setIssueList] = useState([])

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
    setIssueList(result)
  }


  const postNewIssue = async() => {
    const issue = { title: " here is the issue", body: "Help me to fix it" };
    const url = `https://api.github.com/repos/facebook/react/issues`;
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
      <div>
        <ol>{issueList.map( item => {
          return(
            <>
              <h3>{item.title}</h3>
              <h5>{item.id} {item.created_at} by <a href="#">{item.user.login}</a></h5>
            </>
            
          )
        })}
        </ol>
      </div>
      {/* <Card>
          <Card.Body>
          <Card.Title>Bug: Type Error</Card.Title>
          <Card.Text>
            #19072 opened hours ago by abcef
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card> */}
    </div>
  )
}

export default App;
