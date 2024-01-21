const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const ip = '10.157.114.241';
app.use(cors());
app.use(bodyParser.json());

app.post('/run-ssh', (req, res) => {
    const { username, password, command } = req.body;
    let sshCommand;

    switch (command) {
      case 'connect_ssh':
        sshCommand = `plink -ssh ${username}@${ip} -pw ${password} -batch "source catkin_ws/devel/setup.bash && roslaunch rosbridge_server rosbridge_websocket.launch"`;
        break;
      case 'disconnect_ssh':
        sshCommand = `plink -ssh ${username}@${ip} -pw ${password} -batch "source catkin_ws/devel/setup.bash && rosrun stop_robot stop_bridge.py"`;
        break;
      case 'connect_robot':
        sshCommand = `plink -ssh ${username}@${ip} -pw ${password} -batch "source catkin_ws/devel/setup.bash && roslaunch tugger_train_bringup robot.launch"`;
        break;
      case 'disconnect_robot':
        sshCommand = `plink -ssh ${username}@${ip} -pw ${password} -batch "source catkin_ws/devel/setup.bash && rosrun stop_robot stop_robot.py"`;
        break;
    }

    exec(sshCommand, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error running SSH script');
        }
        res.send(`Script executed successfully: ${stdout}`);
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
