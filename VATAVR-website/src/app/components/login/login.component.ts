import {Component, OnInit} from '@angular/core';
import {Credentials} from '../../DomainModels/credentials';
import {UserService} from '../../services/user-service';
import {AuthRegistrationResponse} from '../../DomainModels/serverAuthRegistrationResponse';
import {Router} from '@angular/router';
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";
import {Globals} from '../globals'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ Globals ]
})
export class LoginComponent implements OnInit {

  /* Login Success property: true/false - if it is true, a login Success pop up is shown */
  public loginSuccess = false;

  /* Login Failure property: true/false - iftrue, then there is an error either in the login form or invalid credentials */
  public loginFailure = false;
  public loginFailureMessage = '';

  /* Credentials Object properties binded by ngModel in view */
  public credentials: Credentials = {
    username: '',
    password: '',
    userType: ''
  };

  /* tell Angular Inject userService singleton into this class as dependency and Router service */
  constructor(private userService: UserService, private router: Router, public globals: Globals) {
  }

  ngOnInit() {
  }

  public checkUser(db, credentials) {
    // var ref = db.ref('users/' + credentials.username);
    if (credentials.userType == 'Patient') {
      var leadsRef = db.ref('patients');
    } else {
      var leadsRef = db.ref('doctors');
    }
    
    leadsRef.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      if (childData.Password != credentials.password)
      {
        // alert('Incorrect username or password');
        this.router.navigate(['/Login']);
        
      }
    });
    return;
});

    // if (ref == null) {
    //   alert("Incorrect  password");
    //   this.router.navigate(['/Login']);
    // } else {
    //   alert(ref.Password);
    //   if (ref.Password == credentials.password) {
        
    //     this.router.navigate(['/Home']);
    //   }
    // }
    // alert("Incorrect username or password");
    // this.router.navigate(['/Login']);
  }
  saveUsername() {
    this.globals.username_global = this.credentials.username;
    console.log(this.globals.username_global);
  }
  /** Method that utilizes userService to make authenticate API call and wait for asynchronous completion of request
   * if user is not found in the db, it will return -> res.json({success: false, msg: 'User not found'})
   * @see users.js in directory: Digital-Curated-Repository-Website/routes **/
  public login() {
    // this.saveUsername(this.credentials.username);
    var firebaseConfig = {
      apiKey: "AIzaSyDFiyHhNrNAXR1LtciEqOr3WIQCK5fKLOU",
      authDomain: "vatavr-90af0.firebaseapp.com",
      databaseURL: "https://vatavr-90af0.firebaseio.com",
      projectId: "vatavr-90af0",
      storageBucket: "vatavr-90af0.appspot.com",
      messagingSenderId: "260707015158",
      appId: "1:260707015158:web:a440e6fa5ffa6e2e274fd7",
      measurementId: "G-WN3HRPBT3R"
    };
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    
    // firebase.analytics();

    var database = firebase.database();
    // var userId = firebase.auth().currentUser.uid;
    // return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    //   var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    //   });
    this.checkUser(database, this.credentials);
    


    this.loginFailure = false;
          this.loginSuccess = true;

          /* Store the username in the angular service for later usage */
          this.userService.storeLoggedInUsername(this.credentials.username);

          /* navigate to Home Page on successful registration, delay by one sec and half */
          setTimeout(() => {
            
            if (this.credentials.userType == 'Patient') {
              this.router.navigate(['/Home']);
            }
            else {
              this.router.navigate(['/EMR']);
            }
            
          }, 1500);
  }

}
