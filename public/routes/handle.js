document.addEventListener('DOMContentLoaded', function() {
    
    const loginButton = document.getElementById('login_button');
    const registerButton = document.getElementById('register_button');
    const submitSongButton = document.getElementById('submit_song_button');

    if (loginButton) {
        loginButton.addEventListener('click', loginUser);
    }

    if (registerButton) {
        registerButton.addEventListener('click', registerUser);
    }

    if (submitSongButton) {
        submitSongButton.addEventListener('click', submitSong);
    }
})

function registerUser() {
    let username = document.getElementById('userTextField').value;
    let password = document.getElementById('passTextField').value;
    
    const data = {
        username: username,
        password: password
    };

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return response.json();
    })
    .then(responseData => {
        window.location.href = '/';
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function loginUser() {
    let username = document.getElementById('userTextField').value;
    let password = document.getElementById('passTextField').value;
    
    // Prepare the data to be sent in the request body
    const data = {
        username: username,
        password: password
    };

    // Make an HTTP POST request to the server
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log(response)
        return response.json();
    })
    .then(responseData => {
        if (responseData.type === 'admin') {
            window.location.href = '/adminHome';
        } else if (responseData.type === 'guest') {
            window.location.href = '/guestHome';
        } else {
            window.location.href = '/';
        }

    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function submitSong(){
    let songName = document.getElementById('songNameField').value;

    let songTitleDiv = document.getElementById('songTitle')
    songTitleDiv.innerHTML = ''
    let songListDiv = document.getElementById('songList')
    songListDiv.innerHTML = ''
    
    const data = {
        songname: songName
    };

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(responseData => {
        // Check if there are results
        if (responseData.results && responseData.results.length > 0) {
            songTitleDiv.innerHTML += `<h1>Songs matching: ${songName} </h1>`;

            const artistColumn = document.createElement('div');
            artistColumn.className = 'column';

            const trackColumn = document.createElement('div');
            trackColumn.className = 'column';

            const buttonColumn = document.createElement('div');
            buttonColumn.className = 'column-button';

            songListDiv.className = 'column-container';

            songListDiv.appendChild(trackColumn);
            songListDiv.appendChild(artistColumn);
            songListDiv.appendChild(buttonColumn);

            responseData.results.forEach(result => {
                trackColumn.innerHTML += `<p>Track: ${result.trackName}</p>`;
                artistColumn.innerHTML += `<p>Artist: ${result.artistName}</p>`;
                
                const addButton = document.createElement('input');
                addButton.type = 'button';
                addButton.className = 'add_button';
                addButton.value = 'Add to Playlist';

                addButton.dataset.track = result.trackName;
                addButton.dataset.artist = result.artistName;
                
                addButton.addEventListener('click', addToPlaylist);
                buttonColumn.appendChild(addButton);
            });
        } else {
            songListDiv.innerHTML += `<p>No results found for ${songName}</p>`;
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function addToPlaylist(event) {

    const trackName = event.target.dataset.track;
    const trackArtist = event.target.dataset.artist;

    const data = {
        trackName: trackName,
        trackArtist: trackArtist
    };

    fetch('/playlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return response.json();
    })
    .then(responseData => {
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
