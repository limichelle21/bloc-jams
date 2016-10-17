// sample album

var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21' },
        { title: 'Magenta', duration: '2:15' }
    ]
};

// sample album 2

var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};

var createSongRow = function(songNumber, songName, songLength) {
    var template = 
      '<tr class="album-view-song-item">'
    + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' // review why/how data-song-number works
    + ' <td class="song-item-title">' + songName + '</td>'
    + ' <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;
    
    return template;
}

var setCurrentAlbum = function(album) {
    
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
    
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
    albumSongList.innerHTML = '';
    
    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i +1, album.songs[i].title, album.songs[i].duration);
    }
};



// start from a song-item-number element, check if the parent element class name = the table row class name

//var song = document.getElementsByClassName('.song-item-number')[0]; 
//
//var findParentByClassName = function(parentName, song) {
//    var parent = song.parentNode.nodeValue;
//    var count = 1;
//    while(parent.getAttribute('class') != parentName) {
//        parent = parent.parentNode;
//        count ++;
//    }
//    return parent;
//}

var findParentByClassName = function(element, parentName) {
    if (element) {
        var currentParent = element.parentNode;
        while (currentParent.className != parentName && currentParent.className != null) {
            currentParent = currentParent.parentNode;
        }
        return currentParent;
    }
};

// take an element, check the element's class name, and use a case/switch statement to return the element with the .song-item-number class

var getSongItem = function(element) {
    switch(element.className) {
            // children of 'song-item-number'
        case "album-song-button":
        case "ion-play":
        case "ion-pause":
            return findParentByClassName(element, 'song-item-number');
            // siblings of 'song-item-number' - find the parent, then find the child element
        case "song-item-title":
        case "song-item-duration":
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case "song-item-number":
            return element;
            // parent of 'song item number' 
        case "album-view-song-item":
            return element.querySelector('.song-item-number');
        default:
            return;
    }
};


// if no song is playing, on click, set the songItem innerHTML to the pause button and set current song to the song item's data song number
    
// else if the clicked song IS playing/active, on click, change the innerHTML to the play button and erase current song data by setting to null 

// else if the clicked song is not active (currently playing != songItem), on click, create new var (currentlyPlayingSongElement) with value of active song (use query selector to find by class data-song-number= currentlyPlayingSong), set the active song's innerHTML to its song number, set new song's innerHTML to pauseButton, set currentlyPlayingSong to songItem's song-number

var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement); 

    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong != songItem.getAttribute('data-song-number')) {
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
};



var songListContainer = document.getElementsByClassName('album-view-song-list')[0];

var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;

window.onload = function() {
    setCurrentAlbum(albumPicasso);
    
    songListContainer.addEventListener('mouseover', function(event) {
// only target individual song rows during event delegation
// change the content from the number to the play button's HTML      
        var songItem = getSongItem(event.target); 
        var songItemNumber = songItem.getAttribute('data-song-number');
                
        if (event.target.parentElement.className === 'album-view-song-item') {
            event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
                if (songItemNumber != currentlyPlayingSong) {
                    songItem.innerHTML = playButtonTemplate;    
                }
            }
// only change innerHTML of a cell IF element != currentlyPlayingSong (when the elment does not belong to currently playing song)        
    });
    
    for (var i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');
            
            if (songItemNumber != currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
        });
        songRows[i].addEventListener('click', function(event) {
            clickHandler(event.target);
        });
    }
};


