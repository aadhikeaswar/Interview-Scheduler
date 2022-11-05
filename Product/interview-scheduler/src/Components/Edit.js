import React from 'react';
import { Dropdown, Row, Col, Card, Form, Button, FormGroup, FormLabel, FormControl, Container} from 'react-bootstrap';

class Edit extends React.Component{
    constructor(props){
        super(props);
        this.state={
            ukey : null, //Index of position in positions array
            position: 'Select Position',
            interviews : [],
            status : false,
            time : '', 
            clientName : '',
            clientMail : ''
        };
    }
    add(){
        const int = this.state.interviews;
        int.push({status: this.state.status, time : this.state.time});
        this.setState({interviews : int})
    }
    del(key){
        const ti = this.state.interviews;
        ti.splice(key,1);
        this.setState({interviews : ti});
    }
    render(){
        let intcard = this.state.interviews.map((interview, id) =>{
            return(
                <Col key={id}>
            <Card  bg={interview.status? 'info' : 'dark'} text="light" className="p-2 m-3" >
                <Card.Title>{interview.time}</Card.Title>
                <Card.Body>Filled : {interview.status ? 'Vacant' : 'Occupied'}</Card.Body>
                <Button variant="danger"  style={{maxWidth : "100px"}} onClick={()=> this.del(id)}>Delete</Button>
            </Card>
                </Col>
            );
       })
        return(
            <Container>

                 <Row lg={1}>
                <Col>
                <Card className="p-2" >
                <Form>
                    <FormGroup className="m-3">
                        <FormLabel>
                <Dropdown>
                    <Dropdown.Toggle>{this.state.position}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {
                            this.props.positions.map((data, key) =>{
                                return(
                                    <Dropdown.Item id={key} 
                                    onClick={() => this.setState({
                                        position : this.props.positions[key].position, 
                                        interviews : this.props.positions[key].interviews, 
                                        ukey : key, 
                                        clientName : this.props.positions[key].clientName, 
                                        clientMail : this.props.positions[key].clientMail
                                    })}> 
                                        {data.position} 
                                    </Dropdown.Item>
                                );
                            }) 
                        }
                    </Dropdown.Menu>
                </Dropdown>
                        </FormLabel>
                        <FormControl placeholder="Enter Position Name" value={this.state.position} onChange={(e) => this.setState({position : e.target.value})} />
                    </FormGroup>
                    <FormLabel>Name</FormLabel>
                    <FormControl placeholder="Enter Client Name" value={this.state.clientName} onChange={(e) => this.setState({clientName : e.target.value})}/>
                    <FormLabel>Mail</FormLabel>
                    <FormControl placeholder="Enter Client Mail" value={this.state.clientMail}  onChange={(e) => this.setState({clientMail: e.target.value})}/>
                    <FormGroup>
                           <Button variant="primary" 
                           className="m-2" 
                           onClick={() => this.props.updatePos(
                               this.state.ukey, 
                               this.state.position, 
                               this.state.interviews, 
                               this.state.clientMail, 
                               this.state.clientName)}>
                                   Update Position
                            </Button>
                    </FormGroup>
                    <Row>
                        {intcard}
                    </Row>
                </Form>
                </Card>
                </Col>
            </Row>
            </Container>
        );
    }
}

export default Edit;