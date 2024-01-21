import React, { Component } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Joystick } from 'react-joystick-component';
import config from '../scripts/config';

class Teleport extends Component {
  state = {
    connection: false,
    ros: null,
    maxLinearSpeed: 0.4,
    maxAngularSpeed: 0.4,
  };

  componentDidMount() {
    this.initConnection();
  }

  initConnection = () => {
    const ros = new window.ROSLIB.Ros();
    ros.on('connection', () => {
      this.setState({ connection: true, ros });
    });
    ros.on('close', () => {
      this.setState({ connection: false });
      setTimeout(() => this.tryConnect(ros), config.RECONNECTOR_VALUE);
    });
    this.tryConnect(ros);
  };

  tryConnect = (ros) => {
    try {
      ros.connect(`ws://${config.ROSBRIDGE_SERVER_IP}:${config.ROSBRIDGE_SERVER_PORT}`);
    } catch (error) {
      console.error('Connection problem', error);
    }
  };

  handleInputChange = (value, name) => {
    this.setState({ [name]: parseFloat(value) });
  };

  handleMove = (move) => {
    if (!this.state.connection || !this.state.ros) {
      return;
    }
    const linearSpeed = Math.max(Math.min(move.y, this.state.maxLinearSpeed), -this.state.maxLinearSpeed);
    const angularSpeed = Math.max(Math.min(-move.x, this.state.maxAngularSpeed), -this.state.maxAngularSpeed);
    this.publishVelocity(linearSpeed, angularSpeed);
  };

  handleStop = () => {
    if (!this.state.connection || !this.state.ros) {
      return;
    }
    this.publishVelocity(0,0);
};

publishVelocity = (linearSpeed, angularSpeed) => {
const cmd_vel = new window.ROSLIB.Topic({
ros: this.state.ros,
name: config.CMD_VEL_TOPIC,
messageType: 'geometry_msgs/Twist',
});

const twist = new window.ROSLIB.Message({
  linear: { x: linearSpeed, y: 0, z: 0 },
  angular: { x: 0, y: 0, z: angularSpeed },
});

try {
  cmd_vel.publish(twist);
} catch (error) {
  console.error('Error publishing message:', error);
}
};

render() {
  const inputStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    width: '100px', // Set a smaller width here
    textAlign: 'center',
    marginBottom: '10px',
  };

  const labelStyle = {
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'space-around',
    height: '100%',
    padding: '20px',
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    margin: '10px',
  };

  return (
    <div style={{ width: '220' }}>
      <Joystick
        size={100}
        sticky={false}
        baseColor="#EEEEEE"
        stickColor="#BBBBBB"
        move={this.handleMove}
        stop={this.handleStop}
      />
      <div style={inputGroupStyle}>
        <label style={labelStyle} htmlFor="maxLinearSpeed">
          Max Linear Speed:
        </label>
        <input
          type="number"
          id="maxLinearSpeed"
          name="maxLinearSpeed"
          value={this.state.maxLinearSpeed}
          onChange={(e) =>
            this.handleInputChange(e.target.value, 'maxLinearSpeed')
          }
          style={inputStyle}
          step="0.01" // Set the step to 0.01 for two decimal places
          max="1" // Set the maximum value to 1
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle} htmlFor="maxAngularSpeed">
          Max Angular Speed:
        </label>
        <input
          type="number"
          id="maxAngularSpeed"
          name="maxAngularSpeed"
          value={this.state.maxAngularSpeed}
          onChange={(e) =>
            this.handleInputChange(e.target.value, 'maxAngularSpeed')
          }
          style={inputStyle}
          step="0.01" // Set the step to 0.01 for two decimal places
          max="1" // Set the maximum value to 1
        />
      </div>
    </div>
  );
}
}

export default Teleport;