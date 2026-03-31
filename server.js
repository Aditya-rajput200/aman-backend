const dotenv = require('dotenv');

dotenv.config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other process or set a different PORT in .env.`);
  } else if (error.code === 'EACCES' || error.code === 'EPERM') {
    console.error(`The server could not listen on port ${PORT}. Check your permissions or try a different PORT.`);
  } else {
    console.error('Server failed to start:', error.message);
  }

  process.exit(1);
});

module.exports = app;
