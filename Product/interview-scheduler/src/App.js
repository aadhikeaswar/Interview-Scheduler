//Importing libraries for the application
import React from 'react';
//The following import is for GUI components from the Bootstrap library
import {
  Container, 
  Navbar,
  Nav,
  Card,
  Form,
  Button
} from 'react-bootstrap';
//The following import is from the React router which allows us to browse components
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
//The following import is to initialize the firebase app which connects to our server
import { initializeApp } from 'firebase/app';
//The following import is for user authentication
import {getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth";
//The following import is for writing, reading and updating the database
import{getFirestore, updateDoc,  getDocs, collection, addDoc, deleteDoc} from "firebase/firestore";
//The following imports are for the sub-components of the application
import Home from "./Components/home";
import Add from "./Components/Add";
import Edit from "./Components/Edit";

//Note: the firebaseConfig object is close since it contains sensitive server information
const firebaseConfig = {
};
/*Google firebase handles authentication and database functions.
The following code initializes firebase:*/

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userID: '', //Contains user ID
      positions : [],//Contains the positions that the user is attempting to fill
      posRef : [], //Contains the server reference links for the different positions
      authenticated : false, //A boolean variable that tells if the user is authenticated or not
      user: '', //contains user name
      pass: '' //contains account password 
    };
    onAuthStateChanged(auth, (user) => {
      /*onAuthStateChanged is imported from the firebase library and is called when the 
      authentication state is change*/
      if(user){
      /*the if statement checks if the user object returned is null if it isn't then the user's 
      documents (positions) are taken from the server*/
      getDocs(collection(db, user.uid)).then((snapshot) => {
        const positions = [];
        const posref = [];
        /* local positions and posref arrays are made since react will only update the GUI if the 
        entire array is replaced*/
        snapshot.docs.map((document) => {
          positions.push(document.data());
           posref.push(document);
          });
        this.setState({positions : positions, posRef : posref});
      });
      this.setState({authenticated : true, userID : user.uid});
      }
    });
    this.logOut = this.logOut.bind(this);
    this.signIn = this.signIn.bind(this);
    this.del = this.del.bind(this);
    this.addInterview = this.addInterview.bind(this);
    this.addPos = this.addPos.bind(this);
    this.updatePos = this.updatePos.bind(this);
    this.addCandidate = this.addCandidate.bind(this);
    this.closePos= this.closePos.bind(this);
  }
  del(key, id){
    let tp = this.state.positions;
    tp[key].interviews.splice(id,1);
    const doc = this.state.posRef[key];
    const interviews = tp[key].interviews;
    updateDoc(doc.ref, {
      interviews : interviews,
    })
    this.setState({positions : tp})
  
  }
  updatePos(key, pos, interviews, clientMail, clientName){
    const doc = this.state.posRef[key];
    updateDoc(doc.ref, {
      position : pos, 
      interviews : interviews,
      clientName : clientName,
      clientMail : clientMail
    })
    const tp = this.state.positions;
    tp[key] = {
      position : pos, 
      interviews: interviews,
      clientName : clientName,
      clientMail : clientMail
    };
    this.setState({positions : tp})
  }
  signIn(){
    signInWithEmailAndPassword(auth, this.state.user, this.state.pass).
    catch((error) => window.alert(error.message));
    /* The signInWithEmailAndPassword function is imported from firebase and it authenticates the 
    user using the user credential state variables. It catches any errors in authentication and 
    alerts the user about them*/
  }  
  logOut(){
    this.setState({authenticated : false});
    signOut(auth);
  }
  addInterview(key, time, status, date, name, mail) {
    let tp = this.state.positions;
    /* Local temporary positions copy is made since we need to replace the whole array for react to 
    update the GUI automatically*/
    tp[key].interviews.push({
      time : time,
      status : status,
      Date : date,
      candidateName : name, 
      candidateMail : mail
    });
    //The above lines add a new interview to the local positions array
    const interviews = tp[key].interviews;
    const doc = this.state.posRef[key];
    updateDoc(doc.ref , {
      interviews : interviews
    });
    /*The above lines updates the server with the new interview using the updateDoc function 
    imported from the firebase library*/
    this.setState({positions : tp});
  }
  closePos(key){
    let tp = this.state.positions, tpr = this.state.posRef;
    const doc = this.state.posRef[key];
    tp.splice(key,1); tpr.splice(key,1);
    this.setState({positions : tp, posRef: tpr});
    deleteDoc(doc.ref);
  }
  addCandidate(key, id, candidateName, candidateMail){
    const tp = this.state.positions;
    const interviews = tp[key].interviews;
    interviews[id].candidateMail = candidateMail;
    interviews[id].candidateName = candidateName;
    interviews[id].status = false;
    tp[key].interviews = interviews;
    this.setState({positions : tp});
    const doc = this.state.posRef[key];
    updateDoc(doc.ref , {
      interviews : interviews
    });
  }
  addPos(pos){
    const docref = addDoc(collection(db, this.state.userID), {
      position : pos.position,
      clientName : pos.clientName,
      clientMail : pos.clientMail,
      interviews : pos.interviews,
    });
    this.setState({
      positions: this.state.positions.concat([pos]), 
      posRef : this.state.posRef.concat([docref])
    });
  }
  render(){
  return(
    <div className="App">
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>Interview Scheduler</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/add"> Add </Nav.Link>
            <Nav.Link href="/edit"> Edit </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={this.logOut}> Sign out </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="align-items-center" style={{display: 'flex', justifyContent:'center'}}>
        {
          this.state.authenticated?
          //Checks if the user is authenticated if the user is then it shows the user the actual webpage
            <>
              <Router>
                <Switch>
                  <Route exact path="/">
                    <Home 
                    closePos={this.closePos} 
                    addInterview={this.addInterview} 
                    positions={this.state.positions} 
                    dele={this.del} 
                    addCandidate={this.addCandidate}></Home>
                  </Route>
                  <Route exact path="/add">
                    <Add addPos={this.addPos}></Add>
                  </Route>
                  <Route exact path="/edit">
                    <Edit 
                    positions={this.state.positions} 
                    updatePos={this.updatePos}></Edit>
                  </Route>
                </Switch>
              </Router> 
            </>
          :
          //Else it displays the log in card
          <>
            <Container className="w-100 p-5" style={{maxWidth : "400px"}}>
             <Card className="p-2 ">
              <Card.Title>Log in</Card.Title>
              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Email Adress</Form.Label>
                    <Form.Control 
                    type="email" 
                    placeholder="Enter Email" 
                    onChange={(e) => this.setState({user : e.target.value})} value={this.state.user}/>
                  </Form.Group>
                  <Form.Group >
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                    type="password" 
                    placeholder="Enter Password" 
                    onChange={(e) => this.setState({pass : e.target.value})} value={this.state.pass}/>
                  </Form.Group>
                  <Button variant="primary" className="m-2" onClick={this.signIn}>
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            </Container>
          </>
        }
      </Container>
    </div>
  );

  }
}

export default App;

