const host = 'https://10.201.67.60:8443'; // admin/@A1@A1
// const host = 'http://localhost:3000';

const PROXY_CONFIG = {
  "/remote/*": {
    target: `${host}`,
    secure: false,
    changeOrigin: false,
    pathRewrite: {
      "^/remote": ""
    }
  },
};

module.exports = PROXY_CONFIG;
