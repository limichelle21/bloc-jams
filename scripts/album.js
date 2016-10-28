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
    
    var $row = $(template);
    
    var clickHandler = function() {
        
        // Set songItem to a Pause button and set currentlyPlayingSong to the songNumber
        // Switch from Pause to Play button to pause currently playing song 
        // Switch from Play to Pause button to indicate new song is playing
        
        var songItem = $(this).find('.song-item-number');
        var songNumber = songItem.attr("data-song-number");
    
        if (currentlyPlayingSong === null) {
            songItem.html(pauseButtonTemplate);
            currentlyPlayingSong = songNumber;
        } else if (currentlyPlayingSong === songNumber) {
            songItem.html(playButtonTemplate);
            currentlyPlayingSong = null; 
        } else if (currentlyPlayingSong !== songNumber) {
            songItem.html(pauseButtonTemplate);
            currentlyPlayingSong = songNumber;
        }
        
    };
    
    var onHover = function(event) {
        // $(this) refers to a $row 
        var songItem = $(this).find('.song-item-number');
        var songNumber = songItem.attr("data-song-number"); 
        // alt: var songNumber = songItem.data("song-number");
            if (songNumber != currentlyPlayingSong) {
                songItem.html(playButtonTemplate)
                };
    };
    
    var offHover = function(event) {
        var songItem = $(this).find('.song-item-number');
        var songNumber = songItem.attr("data-song-number"); 

        if (songNumber == currentlyPlayingSong) {
            songItem.html(pauseButtonTemplate)
        } else (songNumber != currentlyPlayingSong) {
            songItem.html(songNumber)
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
    
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
};




// if no song is playing, on click, set the songItem innerHTML to the pause button and set current song to the song item's data song number
    
// else if the clicked song IS playing/active, on click, change the innerHTML to the play button and erase current song data by setting to null 

// else if the clicked song is not active (currently playing != songItem), on click, create new var (currentlyPlayingSongElement) with value of active song (use query selector to find by class data-song-number= currentlyPlayingSong), set the active song's innerHTML to its song number, set new song's innerHTML to pauseButton, set currentlyPlayingSong to songItem's song-number


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);

});


