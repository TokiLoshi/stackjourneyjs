const express = require('express');
const registerRouter = express.Router();
const bcrypt = require('bcrypt');

const sheetDb = process.env.SHEETS_URL;

registerRouter.get('/', (req, res) => {
  console.log("Getting Registration");
  res.render("register", { isAuthenticated: req.isAuthenticated })
})

registerRouter.post('/', async (req, res) => {
  const { username, password, confirmation } = req.body;
  console.log(`We got ourselves a username and password: ${username}, ${password}, ${confirmation}`);
  if (!username) {
    console.log(`We're missing a username`);
    const failureMessage = "Email can't be blank";
    req.flash('error', failureMessage);
    return res.redirect('register', { isAuthenticated: req.isAuthenticated });
  }
  if (!password || !confirmation){
    console.log(`Password or confirmation were blank`);
    const failureMessage = "Please ensure you have a password and confirmation";
    req.flash('error', failureMessage);
    return res.redirect('register', { isAuthenticated: req.isAuthenticated });
  }
  if (req.body.password !== req.body.confirmation){
    console.log("They don't match");
    req.flash('error', 'password and password confirmation don\'t match');
    return res.redirect('register', { isAuthenticated: req.isAuthenticated });
  }
  try {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log("Salt: ", salt);
    console.log("Hashed Password", hashedPassword);
    const addUser = await fetch(sheetDb, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          'username' : username,
          'password' : hashedPassword
        }
      })
    }).then((response) => response.json())
    .then((data) => console.log(data));

    
  }
  catch {
    res.status(500).send();
  }
  req.flash('success', 'Success! Now enter your credentials to login');
  res.redirect('login', { isAuthenticated: req.isAuthenticated });
  
})

module.exports = registerRouter