import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

class Header extends Component {
  render() {
    return (
      <Container>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Navbar.Brand href="#home" style={{fontSize : '25px'}}>React ROS Robot</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home" style={{fontSize : '20px'}}>HOME</Nav.Link>
              <Nav.Link href="#About" style={{fontSize : '20px'}}>CONNECTION</Nav.Link>
                <NavDropdown.Divider />
            </Nav>
          </Navbar.Collapse>
      </Navbar>
      </Container>
    );
  }
}

export default Header;
