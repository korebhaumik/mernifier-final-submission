const express = require('express');
const app = express();

app.get('/api/data', (req, res) => {
  const data = {
    message: 'Hello, world!'
  };
  res.json(data);
});

// const port = 1447;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports = app;
