const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());
const checkAuth = require('./middleware/checkmiddleware');


const users = [
    { 
      id :'1',    
      username:"alice",
      password: "hashed_password",
    },{
        id :'2',
        username: 'abdo',
        password: '$2b$10$JIGZpm4RUFnXs1Ss/kt5VuDjChPTwwuclze94grDyJ2Akqlgtn5GS',
      }
  ];

  app.use(session({
    secret: 'this-is-a-secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        //secure: true, 
        httpOnly: true, 
        maxAge: 60000 // Sets the duration for which the cookie is valid (in milliseconds).
    }
}));

app.get('/', (req, res) => {
    res.send('welcome');

});

// register
app.post('/register', (req, res) => {
    const {id , username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user) {
        res.status(400).send('Username already exists');
    } else {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = { id , username, password: hashedPassword };
        users.push(user);
        console.log(users)
        res.status(201).send('User created successfully');
    }
});

//   login with username and password

app.post('/login', (req, res) => { 
    const { username, password } = req.body;
    const user = users.find(u => u.username === username );
    if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Server error');
                }
                
            if (result) {
                // Passwords match
               // console.log('you have authenticated successfully');
                req.session.user = user; // This line saves the user in the session
                res.status(200).send("authenticated successfully welcome!");

            }else {res.status(500).send('invalid password')}
        })
       
    } else {
       
        res.status(401).send('You have not authenticated please log in again');
    }
});







//  protected route 
app.post('/auth', checkAuth ,(req, res) => {
    res.send('Welcome to the protected route! , this is a secrete place');
    
});


app.post('/logout',(req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.status(200).send('You have logged out successfully');
    })
})

app.listen(3000, () => {
    console.log('server is running on port 3000');
});