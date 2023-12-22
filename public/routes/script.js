const http = require('http');
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('itunesData')

const headerFilePath = __dirname + '/../views/header.html'

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  type TEXT NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS playlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trackName TEXT NOT NULL,
  trackArtist TEXT NOT NULL
)`);


exports.index = function(req, res) {
  res.render('index', {});
}

exports.register = function(req, res) {
  res.render('register', {});
}

exports.guestHome = function(req, res) {
  res.render('guestHome', {});
}

exports.adminHome = function(req, res) {
  res.render('adminHome', {});
}

exports.registerUser = function(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  // Check if the username already exists
  const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
  db.get(checkUsernameQuery, [username], (err, existingUser) => {
    if (err) {
      return res.status(500).send('Error checking username');
    }

    // If the username already exists, return an error
    if (existingUser) {
      return res.status(409).send('Username already exists. Please choose a different one.');
    }

    // If the username is unique, inserts the new user
    const insertUserQuery = 'INSERT INTO users (username, password, type) VALUES (?, ?, ?)';
    db.run(insertUserQuery, [username, password, 'guest'], (err) => {
      if (err) {
        return res.status(500).send('Error registering user');
      }
      res.json({  message: 'Registration successful' });
    });
  });
}

exports.login = function(req, res) {
  const { username, password } = req.body;

  // Check user credentials in the SQLite3 database
  const selectUserQuery = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.get(selectUserQuery, [username, password], (err, user) => {
    if (err) {
      return res.status(500).send('Error authenticating user');
    }

    if (!user) {
      return res.status(401).send('Invalid credentials');
    }
    
    //Redirect based on user type
    if (user.type === 'admin') {
      res.json({ type: 'admin'});
    } else if (user.type === 'guest') {
      res.json({ type: 'guest'});
    } else {
      res.json({ type: 'none'});
    }
  });
}

exports.search = function(req, res) {
  res.render('search', {});
}

exports.searchSong = function(req, res) {
  const { songname } = req.body;

  let options = {
    "method": "GET",
    "hostname": "itunes.apple.com",
    "port": null,
    "path": `/search?term=${encodeURIComponent(songname)}&entity=musicTrack&limit=10`,
    "headers": {
      "useQueryString": true
    }
  }

  http.request(options, function(apiResponse) {
    let songData = ''
    apiResponse.on('data', function(chunk) {
      songData += chunk
    })
    apiResponse.on('end', function() {
      res.contentType('application/json').json(JSON.parse(songData))
    })
  }).end()

}

exports.playlist = function(req, res) {
  const getAllTracksQuery = 'SELECT * FROM playlist';
  db.all(getAllTracksQuery, (err, tracks) => {
    if (err) {
      return res.status(500).send('Error fetching playlist data');
    }
    res.render('playlist', { tracks });
  });
}

exports.addToPlaylist = function(req, res) {
  const { trackName, trackArtist } = req.body;

  // Check if the song already exists in playlist
  const checkTrackQuery = 'SELECT * FROM playlist WHERE trackName = ? AND trackArtist = ?';
  db.get(checkTrackQuery, [trackName, trackArtist], (err, existingSong) => {
    if (err) {
      return res.status(500).send('Error checking trackname');
    }

    // If the username already exists, return an error
    if (existingSong) {
      return res.status(409).send('Song already exists. Please choose a different one.');
    }

    // If the username is unique, inserts the new user
    const insertTrackQuery = 'INSERT INTO playlist (trackName, trackArtist) VALUES (?, ?)';
    db.run(insertTrackQuery, [trackName, trackArtist], (err) => {
      if (err) {
        return res.status(500).send('Error registering user');
      }
      res.json({  message: 'Song successfully added' });
    });
  });
}

exports.users = function(req, res) {
  const getAllUsersQuery = 'SELECT * FROM users';
  db.all(getAllUsersQuery, (err, users) => {
    if (err) {
      return res.status(500).send('Error fetching user data');
    }
    res.render('users', { users });
  });
}

exports.logout = function(req, res) {
  res.render('index', {});
}