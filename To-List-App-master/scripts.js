var firebaseConfig = {
    apiKey: "AIzaSyDHQSoKFzIzU8O0L7Y-2og4ASVdVps_y48",
    authDomain: "webapp-7e230.firebaseapp.com",
    databaseURL: "https://webapp-7e230-default-rtdb.firebaseio.com",
    projectId: "webapp-7e230",
    storageBucket: "webapp-7e230.appspot.com",
    messagingSenderId: "361977212737",
    appId: "1:361977212737:web:e6ba314d0dd487e7b2fbc0"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

// Functions  
    function sanitizeInputs(string) {
        return string.replace(/[*+^{}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    function parseURLParams(url) {
        var queryStart = url.indexOf("?") + 1,
            queryEnd   = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {}, i, n, v, nv;

        if (query === url || query === "") return;

        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);

            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    } 
    function searchIfError (area, items) {
        return items.some(function (v) {
            return area.indexOf(v) >= 0;
        });
    }

    function sendToFirebase(note) {
        var noteData = {
            note: note
        };

        database.ref('notes').push().set(noteData)
            .then(function(snapshot) {
                firebaseSuccess(snapshot); //success method
            }, function(error) {
                firebaseError(error); //error method
            });
    }
    function firebaseSuccess(snapshot) {
        window.location.replace('../notes.html?notests=success');
    }

    function firebaseError(error) {
        window.location.replace('../new-note.html?notests=error');
    }

    var noteParagraphItem = [];
    var retrieveCount = 0;
    function retrieveNotesFromFirebase() {
        var noteRef = database.ref('notes');

        noteRef.on('value', retrieveDataSuccess, retrieveDataError);
    }
    function retrieveDataSuccess(data) {
    //Display recieved Data.
    var notesData = data.val();
        if (notesData !== null) {
            ++retrieveCount;
            var keys = Object.keys(notesData);
            keys.reverse();
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                var finalNote = notesData[k].note;
                var finalNoteSanitized = sanitizeInputs(finalNote);
                //console.log(finalNote);
                writeNoteData(finalNote, i);
            }
            console.log(notesData);
        }
        else {
            console.log('No data in database');
        }
    }
    function retrieveDataError(error) {
        console.log('Error');
        console.log(error);
    }
    function writeNoteData(noteData, count) {
        var noteContainer = document.getElementById('notes');
        if (retrieveCount > 1) {
            if (count < noteParagraphItem.length) {
                noteParagraphItem[count].remove();
            }
        }
        var noteParagraph = document.createElement('p');
        var noteText = document.createTextNode(noteData);
        noteParagraph.appendChild(noteText);
        noteContainer.appendChild(noteParagraph);
        noteParagraph.classList.add('noteParagraph');
        noteParagraphItem[count] = noteParagraph;
    }

// Check if there was an error
var urlString = window.location.href;
var urlNewNote = urlString.includes('new-note.html');
var urlNewNoteError = urlString.includes('new-note.html?notests=error');
var urlNotes = urlString.includes('notes.html');
if (urlNewNote) {  
//Send note to Firebase
var submitButton = $('#submitButton');
var textarea = $('#noteTextarea');
var note;
var noteEscaped;

submitButton.click(function() {
    if (textarea.val().length > 1) {
        note = textarea.val();
        sendToFirebase(note);
    }
});

//See if is at error URL.
if (urlNewNoteError) {
    var urlParams = parseURLParams(urlString);
    var notestsItems = ['error'];
    var findError = searchIfError(urlParams.notests, notestsItems);
    var notests = $('#notests');
    if (findError) {
    notests.css({display: 'block'});
    notests.animate({opacity: '1'}, 250);
    }
}
}

//Retrieve notes from Firebase
if (urlNotes) {
    retrieveNotesFromFirebase();   
}
function move()
{
    window.location="notes.html";
}

