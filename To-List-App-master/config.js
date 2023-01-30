const firebaseConfig = {
  apiKey: "AIzaSyDzxxf8qFTMVAPz4x_Y6nk07Uz9JAdzsps",
  authDomain: "to-do-list-ac545.firebaseapp.com",
  projectId: "to-do-list-ac545",
  storageBucket: "to-do-list-ac545.appspot.com",
  messagingSenderId: "203656289029",
  appId: "1:203656289029:web:0a5acb4e15132c528d356c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore()
var auth = firebase.auth()
var provider = new firebase.auth.GoogleAuthProvider();

//

// initial datas
const msgLogOut = document.querySelector('#msgLogOut')
const btnLogin = document.querySelector('#login');
const main = document.querySelector('main');
const userData = document.querySelector('#userData');
const btnSignOut = document.querySelector('#btnSignOut');
const userName = document.querySelector('#userName');
const userPhoto = document.querySelector('#userPhoto');
const message = document.querySelector('#message');
const tasks = document.querySelector('#tasks');
const removeAllTask = document.querySelector('#removeAllTask');
const addTask = document.querySelector('#addTask');
const inputTask = document.querySelector('#inputTask');


//==========
btnLogin.addEventListener('click', signIn);
btnSignOut.addEventListener('click', signOut);
//==========


//sign and signOut

function signIn() {
  auth.signInWithPopup(provider)
    .then(result => {
      db.collection('Users').doc(result.user.uid).set({
        UserName: result.user.displayName
      }, { merge: true })
    }).catch((error) => {
      console.log(error);
    });
};

function signOut() {
  auth.signOut().then(() => {
    btnLogin.style.display = 'flex';
    main.style.display = 'none';
    userData.style.display = 'none';
    msgLogOut.style.display = 'block';
    setTimeout(() => {
      msgLogOut.style.display = 'none';
    }, 1000);

  }).catch((error) => {
    console.log(error);

  });

};
//====



//check if the user is logged in

auth.onAuthStateChanged((user) => {

  if (user) {
    btnLogin.style.display = 'none';
    main.style.display = 'flex';
    userData.style.display = 'flex';
    userName.textContent = (user.displayName);
    userPhoto.innerHTML = `<img src="${user.photoURL}">`;
    db.collection("Users").doc(user.uid).onSnapshot((doc) => {
      getTaskFromDB(doc);
    }, () => { });

    btnAddTasks(user);
    btnRemoveTasks(user);
  }
})


// Takes the task that has been added to the database and shows it on the screen

function getTaskFromDB(doc) {
  message.style.display = 'none';
  let readTasksFromDB = doc.data().tasks;
  tasks.innerText = "";
  if (readTasksFromDB !== undefined || null || "") {
    readTasksFromDB.forEach(task => {
      tasks.appendChild(createNewTask(` <li class="task"> <input type="checkbox" id="cb"> <label for="cb">${task.task}</label></li>`));
      createNewTask(task);
    });
  } else {
    message.style.display = 'block';
  }
}

function createNewTask(newTask) {
  let li = document.createElement('li');
  li.innerText = "";
  li.innerHTML = newTask;
  return li;
}

//=======




//BTNS

function btnAddTasks(user) {

  addTask.addEventListener('click', () => {
    if (inputTask.value !== '') {
      db.collection('Users').doc(user.uid).set({
        tasks: firebase.firestore.FieldValue.arrayUnion(
          {
            task: inputTask.value,

          }
        )
      }, { merge: true })
      inputTask.value = ''
    };
  });
};

function btnRemoveTasks(user) {
  removeAllTask.addEventListener('click', () => {
    db.collection('Users').doc(user.uid).update({
      tasks: firebase.firestore.FieldValue.delete()
    });
    inputTask.value = ''
  });
};

function nextscreen()
{
  window.location="new-note.html";
}