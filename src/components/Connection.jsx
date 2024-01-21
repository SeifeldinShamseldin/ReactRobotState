import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import config from "../scripts/config";
class Connection extends Component {
  state = {connection : false, ros: null};

  constructor() {
    super();
    this.init_connection();
  }
  init_connection (){
    this.state.ros = new window.ROSLIB.Ros();
    console.log(this.state.ros);


    this.state.ros.on("connection", () => {
      console.log("connection established!");
      this.setState({connection: true});
    
    });
    this.state.ros.on("close", () => {
      console.log("connection closed!");
      this.setState({ connection: false });
    
      // Set a timeout to attempt a reconnection
      setTimeout(() => {
        try {
          // Attempt to reconnect
          this.state.ros.connect("ws://" + config.ROSBRIDGE_SERVER_IP + ":" + config.ROSBRIDGE_SERVER_PORT+"");
        } catch (error) {
          // Log any connection problems
          console.log("connection problem", error);
        }
      }, config.RECONNECTOR_VALUE); // Wait for 5 seconds before trying to reconnect
    });
    

    try {
      this.state.ros.connect("ws://" + config.ROSBRIDGE_SERVER_IP + ":" + config.ROSBRIDGE_SERVER_PORT+"");
    }catch (error) {console.log("connection problem")};
  }

  
  
  render() {
    return (
      <Container>
        {/* Apply Bootstrap classes for white background and text centering */}
        <Alert className="text-center m-3"variant={this.state.connection ? "success" : "danger"}>

          {this.state.connection ? <p1 style={{fontSize : "22px"}}>ROBOT CONNECTED</p1> : <p1 style={{fontSize : "22px"}}>ROBOT DISCONNECTED</p1>}
        </Alert> 
      </Container>
    );
  }
}

export default Connection;  
