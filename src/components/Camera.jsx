import React, { Component } from 'react';
import config from "../scripts/config";

class Camera extends Component {
  constructor() {
    super();
    this.state = {
      ros: new window.ROSLIB.Ros(),
      connected: false,
      error: null,
      imageSrc: '', // Added to store the image source
    };

    // Set up ROS connection events
    this.state.ros.on("connection", () => {
      console.log("Connected to websocket server.");
      this.setState({ connected: true });
      this.subscribeToCameraTopic(); // Subscribe to camera topic once connected
    });

    this.state.ros.on("error", (error) => {
      console.log('Error connecting to websocket server: ', error);
      this.setState({ error });
    });

    this.state.ros.on("close", () => {
      console.log("Connection to websocket server closed.");
      this.setState({ connected: false });

      // Attempt to reconnect
      setTimeout(() => {
        try {
          this.state.ros.connect(`ws://${config.ROSBRIDGE_SERVER_IP}:${config.ROSBRIDGE_SERVER_PORT}`);
        } catch (error) {
          console.log("Connection problem", error);
        }
      }, config.RECONNECTOR_VALUE);
    });
  }

  subscribeToCameraTopic() {
    var listener = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: '/rgb/image_raw/compressed/test',
      messageType: 'sensor_msgs/CompressedImage'
    });

    listener.subscribe((message) => {
      console.log('Received message on ' + listener.name);
      this.setState({ imageSrc: "data:image/jpeg;base64," + message.data });
    });
  }

  componentDidMount() {
    this.state.ros.connect(`ws://${config.ROSBRIDGE_SERVER_IP}:${config.ROSBRIDGE_SERVER_PORT}`);
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          <img id="camera-image" src={this.state.imageSrc} alt="Camera Stream" />
        </div>
      </div>
    );
  }
}

export default Camera;
