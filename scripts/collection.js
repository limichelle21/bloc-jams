var collectionItemTemplate = 
       '<div class="collection-album-container column fourth">'
   + '  <img src="assets/images/album_covers/01.png"/>'
   + '  <div class="collection-album-info caption">'
   + '    <p>'
   + '      <a class="album-name" href="/album.html"> The Colors </a>'
   + '      <br/>'
   + '      <a href="/album.html"> Pablo Picasso </a>'
   + '      <br/>'
   + '      X songs'
   + '      <br/>'
   + '    </p>'
   + '  </div>'
   + '</div>'
   ;

window.onload = function() {
// select the first element with an 'album-cover' class name    
    var collectionContainer = document.getElementsByClassName('album-covers')[0];
    
// assign an empty string to the collectionContainer's innerHTML property to clear content 
    collectionContainer.innerHTML = '';

// create a for-loop that will insert 12 albumns using the template to the innerHTML property 
    
    for (var i = 0; i < 12; i++) {
        collectionContainer.innerHTML += collectionItemTemplate;
    }
}