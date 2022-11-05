import React from 'react';
import {Container, Card, Button,  Col, Form, FormControl, FormGroup, FormLabel, Row} from 'react-bootstrap';

class Add extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            position : '', //stores the name of the job
            clientMail: '', //stores the mail ID of the client
            clientName: '' //stores the client name
        }
    }
    render(){
        return(
            <Container>
                <Col>
                <Card className="p-2" >
                <Form>
                    <FormGroup className="m-3">
                        <FormLabel>Position</FormLabel>
                        <FormControl value={this.state.position} 
                        onChange={(e) => this.setState({position : e.target.value})}
                         placeholder="Enter Position Name"/>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl value={this.state.clientName} 
                        onChange={(e) => this.setState({clientName : e.target.value})} 
                        placeholder="Enter Client Name"/>
                        <FormLabel>Client Mail</FormLabel>
                        <FormControl value={this.state.clientMail} 
                        placeholder="Enter Client Mail"
                        onChange={(e) => this.setState({clientMail: e.target.value})} />
                    </FormGroup>
                    <FormGroup>
                           <Button variant="primary" 
                           className="m-2" 
                           onClick={() => {
                            this.props.addPos({
                                position: this.state.position, 
                                clientName : this.state.clientName, 
                                clientMail : this.state.clientMail,
                                interviews : []}); 
                            this.setState({
                                position:'', 
                                clientName:'', 
                                clientMail:''})}}>
                                    Add position
                            </Button>
                    </FormGroup>
                </Form>
                </Card>
                </Col>
            </Container>
        );
    }
}

export default Add;