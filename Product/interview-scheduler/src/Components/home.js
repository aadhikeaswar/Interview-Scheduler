import {Card, Button, Container, Row, Col, Modal, Form} from 'react-bootstrap';
import React from 'react';
class Home extends React.Component {
    constructor(props){
        super(props);
        this.state={
            ads : false,
            time : '',
            status : true, 
            key : -1,
            Date : '',
            candidateMail: '',
            candidateName:'',
        }
    }
    
    add(){
        this.props.addInterview(
                this.state.key, this.state.time, 
                this.state.status, this.state.Date, 
                this.state.candidateName, this.state.candidateMail);
        this.setState({
            ads : false,
            time : '',
            Date : '',
            status : true, 
            key : -1,
            id: -1,
            candidateMail: '',
            candidateName:'',
        })
    }
    render(){
    const posList =  this.props.positions.map((position, key) =>{
        //The position variable is the current position and key is its index
        let intcard = position.interviews.map((interview, id) =>{
            //The interview variable is the curren interview in the position and id is its index
            return(
                <Col key={id}>
            <Card  bg={interview.status? 'info' : 'dark'} text="light" className="p-2 m-3" >
                <Card.Title>{interview.time}</Card.Title>
                <Card.Body>
                    Date: {interview.Date}
                    <br/>
                    Filled : {interview.status ? 'Vacant' : 'Occupied'}
                    <br/>
                    {!interview.status ? 
                    <>
                    Name: {interview.candidateName}
                    <br/>
                    Mail: {interview.candidateMail} 
                    </> : 
                <Button variant="primary" className='m-2'
                onClick={() => this.setState({adc : true, key : key, id: id})} >
                    Add Candidate</Button>}
                </Card.Body>
            </Card>
                </Col>
            );
       });
        return(
        <div key={key}>
           <Row className="m-3">
                <Col>
                    <h2>{position.position}</h2> 
                    <h3>{position.clientName}, {position.clientMail}</h3>
                </Col>
                <Col>
                    <Button style={{maxWidth:"200px", alignSelf: "left"}} 
                    onClick={() => this.setState({ads : true, key : key})}>
                        + Add Interview
                    </Button>
                    <br/>
                    <Button variant="danger"
                     class="m-3" 
                     style={{maxWidth:"200px", alignSelf: "left"}} 
                     onClick={() => this.props.closePos(key)}>
                          Close position
                    </Button>
                </Col>
            </Row>
            <Row lg={3}>
                    {intcard} 
            </Row>
           </div>
        );
    });
     return(
        <Container>
            <Modal show={this.state.ads}>
                <Modal.Header>
                    <Modal.Title>Add interiew</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>Time</Form.Label>
                    <Form.Control type="text" 
                    placeholder="Enter Interview Time" 
                    value={this.state.time} 
                    onChange={(e) => this.setState({time : e.target.value})}/>
                    <Form.Label>Date </Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter Date" 
                    value={this.state.Date} 
                    onChange={(e) => this.setState({Date : e.target.value})}></Form.Control> 
                    <div> <Form.Label>Status:</Form.Label> </div>
                    <Form.Check
                        inline
                        label="Occupied"
                        type="radio"
                        name="status"
                        onClick={() => this.setState({status : false})}
                    />
                    <Form.Check
                        inline
                        label="Vacant"
                        type="radio"
                        name="status"
                        onClick={() => this.setState({status : true})}
                    />
                    <br/>
                    {
                        !this.state.status ? 
                        <>
                            <Form.Label>Name </Form.Label>
                            <Form.Control type="text" 
                            placeholder="Enter Name"
                            value={this.state.candidateName} 
                            onChange={(e) => this.setState({candidateName: e.target.value})}>
                            </Form.Control> 
                            <Form.Label>Mail ID</Form.Label>
                            <Form.Control type="text" 
                            placeholder="Enter Mail ID" 
                            value={this.state.candidateMail} 
                            onChange={(e) => this.setState({candidateMail: e.target.value})}>
                            </Form.Control> 
                        </> : <></>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.setState({ads:false})} variant="secondary"> Close </Button>
                    <Button onClick={() => this.add()}>Add Interview</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={this.state.adc}>
                <Modal.Header>
                    <Modal.Title>Add Candidate</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                            <Form.Label>Name </Form.Label>
                            <Form.Control type="text" 
                            placeholder="Enter Name" 
                            value={this.state.candidateName} 
                            onChange={(e) => this.setState({candidateName: e.target.value})}>
                            </Form.Control> 
                            <Form.Label>Mail ID</Form.Label>
                            <Form.Control type="text" 
                            placeholder="Enter Mail ID" 
                            value={this.state.candidateMail} 
                            onChange={(e) => this.setState({candidateMail: e.target.value})}>
                            </Form.Control> 
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                    onClick={() => this.setState({adc:false})} 
                    variant="secondary"> 
                    Close 
                    </Button>
                    <Button 
                    onClick={() => {
                    this.props.addCandidate(this.state.key, this.state.id, 
                    this.state.candidateName, this.state.candidateMail); 
                    this.setState({adc : false});}}>
                        Add Candidate
                    </Button>
                </Modal.Footer>
            </Modal>
            {this.props.positions.length == 0 ? 
            <h3> There are no existing positions. Click on the add tab to add new positions </h3> 
            : 
            <>
             {posList}
            </>}
        </Container>
      );
   }
}
export default Home;