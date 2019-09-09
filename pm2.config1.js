
var pm2Config = {
    "apps": [
      {
        "name": "server1",
        "script": "server.js",
        "exec_mode": "cluster_mode",
        "instances": "max"
      }
    ]
};

module.exports = pm2Config;
