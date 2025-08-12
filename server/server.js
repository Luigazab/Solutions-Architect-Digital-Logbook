const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve React build
app.use(express.static(path.join(__dirname, '../dist')));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
