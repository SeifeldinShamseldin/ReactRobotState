import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import config from "../scripts/config";

class RobotState extends Component {
  state = {
    ros: null,
    x: 0,
    y: 0,
    orientation: 0,
    linearVelocity: 0,
    angularVelocity: 0,
    imuOrientation: { x: 0, y: 0, z: 0, w: 0 },
    imuAngularVelocity: { x: 0, y: 0, z: 0 },
    imuLinearAcceleration: { x: 0, y: 0, z: 0 },
  };

  constructor() {
    super();
    this.init_connection();
  }

  init_connection() {
    this.state.ros = new window.ROSLIB.Ros();
    console.log(this.state.ros);

    this.state.ros.on("connection", () => {
      console.log("connection established!");
      this.setState({ connection: true });
    });

    this.state.ros.on("close", () => {
      console.log("connection closed!");
      this.setState({ connection: false });

      setTimeout(() => {
        try {
          this.state.ros.connect(`ws://${config.ROSBRIDGE_SERVER_IP}:${config.ROSBRIDGE_SERVER_PORT}`);
        } catch (error) {
          console.log("connection problem", error);
        }
      }, config.RECONNECTOR_VALUE);
    });

    try {
      this.state.ros.connect(`ws://${config.ROSBRIDGE_SERVER_IP}:${config.ROSBRIDGE_SERVER_PORT}`);
    } catch (error) {
      console.log("connection problem", error);
    }
  }

  componentDidMount() {
    this.getRobotState();
    this.getRobotStateVel();
    this.getImuData();
  }

  getRobotState() {
    const pose_sub = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "/amcl_pose",
      messageType: "geometry_msgs/PoseWithCovarianceStamped",
    });

    pose_sub.subscribe((message) => {
      this.setState({ 
        x: message.pose.pose.position.x.toFixed(2),
        y: message.pose.pose.position.y.toFixed(2),
        orientation: this.getOrientationDegrees(message.pose.pose.orientation)
      });
    });
  }

  getOrientationDegrees(quaternion) {
    const yaw = Math.atan2(
      2 * (quaternion.w * quaternion.z + quaternion.x * quaternion.y),
      1 - 2 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z)
    );
    return (yaw * 180 / Math.PI).toFixed(2);
  }

  getRobotStateVel() {
    const odom_sub = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "/odom",
      messageType: "nav_msgs/Odometry",
    });

    odom_sub.subscribe((message) => {
      this.setState({ 
        linearVelocity: message.twist.twist.linear.x.toFixed(2),
        angularVelocity: message.twist.twist.angular.z.toFixed(2)
      });
    });
  }

  getImuData() {
    const imu_sub = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "/imu", // Ensure this matches your IMU data topic
      messageType: "sensor_msgs/Imu",
    });

    imu_sub.subscribe((message) => {
      this.setState({
        imuOrientation: message.orientation,
        imuAngularVelocity: {
          x: message.angular_velocity.x.toFixed(2),
          y: message.angular_velocity.y.toFixed(2),
          z: message.angular_velocity.z.toFixed(2),
        },
        imuLinearAcceleration: {
          x: message.linear_acceleration.x.toFixed(2),
          y: message.linear_acceleration.y.toFixed(2),
          z: message.linear_acceleration.z.toFixed(2),
        },
      });
    });
  }

  render() {
    const { x, y, orientation, linearVelocity, angularVelocity, imuOrientation, imuAngularVelocity, imuLinearAcceleration } = this.state;

    return (
      <div>
        <Container>
          <Row>
            <Col>
              <h4>Position</h4>
              <p>x: {x}</p>
              <p>y: {y}</p>
              <p>Orientation: {orientation} degrees</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h4>Velocity</h4>
              <p>Linear Velocity: {linearVelocity}</p>
              <p>Angular Velocity: {angularVelocity}</p>
            </Col>
          </Row>
          <Row>
            <Col>
            <div>
        <Row>
          <Col>
            <h4>IMU Data</h4>
            <p>Angular Velocity: x: {this.state.imuAngularVelocity.x}, y: {this.state.imuAngularVelocity.y}, z: {this.state.imuAngularVelocity.z}</p>
            <p>Linear Acceleration: x: {this.state.imuLinearAcceleration.x}, y: {this.state.imuLinearAcceleration.y}</p>
          </Col>
        </Row>
    </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default RobotState;
