import React, { Component } from "react";
import Teleport from "./Teleport";
import Connection from "./Connection";
import RobotState from "./RobotState";
import Map from "./Map";
import { Container, Row, Col, Button } from "react-bootstrap";
import Camera from "./Camera";

class Home extends Component {
  render() {
    return (
      <div>
        <Container>
          <h1 className="text-center mt-3">ROBOT CONTROL PAGE</h1>
          
          <Row>
            <Col>
              <Connection />
            </Col>
          </Row>
          <Row>
            <Col>
            <h1>TELEPORT</h1>
              <Teleport />
              <h1>CAMERA</h1>
              <Camera/>

            </Col>
            <Col>
            <Map />
            </Col>
            <Col>
            <h1>ROBOTSTATE</h1>
                <RobotState />

            </Col>

          </Row>


        </Container>
      </div>
    );
  }
}

export default Home;
