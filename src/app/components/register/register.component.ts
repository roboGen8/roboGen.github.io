import {Component, OnInit} from '@angular/core';
import {Registration} from '../../DomainModels/registration';
import {UserService} from '../../services/user-service';
import {AuthRegistrationResponse} from '../../DomainModels/serverAuthRegistrationResponse';
import {Router} from '@angular/router';
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  /* Register Success property: if true, a Register Success pop up is shown */
  public registerSuccess = false;

  /* Login Failure property: true/false - if true, then there is an error in registration form  */
  public registerFailure = false;
  public registrationFailureMessage = '';

  /* Registration Object properties binded by ngModel in view */
  public registrationInfo: Registration = {
    name: '',
    email: '',
    phoneNumber: '',
    userType: '',
    username: '',
    password: '',
    doctorName: ''
  };

  /* confirm pass property for checking if passwords match */
  confirmPass: any;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
  }

  public writeUserData(registrationInfo) {
    if (registrationInfo.userType == "Doctor") {
      firebase.database().ref('doctors/' + registrationInfo.username).set({
        Name: registrationInfo.name, 
        Email: registrationInfo.email, 
        PhoneNumber: registrationInfo.phoneNumber, 
        UserType: registrationInfo.userType,
        Username: registrationInfo.username, 
        Password: registrationInfo.password
      });
    } else {
      firebase.database().ref('patients/' + registrationInfo.username).set({
        Name: registrationInfo.name, 
        Email: registrationInfo.email, 
        PhoneNumber: registrationInfo.phoneNumber, 
        UserType: registrationInfo.userType, 
        doctorName: registrationInfo.doctorName, 
        Username: registrationInfo.username, 
        Password: registrationInfo.password
      });
      firebase.database().ref('doctor2patient/' + registrationInfo.doctorName + '/' + registrationInfo.username).set({
        Name: registrationInfo.name, 
        Email: registrationInfo.email, 
        PhoneNumber: registrationInfo.phoneNumber, 
        UserType: registrationInfo.userType, 
        Username: registrationInfo.username, 
        Password: registrationInfo.password
      });

    }
    
    this.router.navigate(['/Login']);
  }

  public onRegister() {
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
    firebase.initializeApp(firebaseConfig);
    // firebase.analytics();

    var database = firebase.database();

    this.writeUserData(this.registrationInfo);
    /* if pass and confirm Pass match*/
    if (this.registrationInfo.password.localeCompare(this.confirmPass) === 0) {
      this.userService.register(this.registrationInfo).then((response) => {
        const resObj: AuthRegistrationResponse = response;

        console.log('response received: ', response);
        if (resObj.success === true) {
          this.registerFailure = false;
          this.registerSuccess = true;

          /* Store the username in the angular service for later usage */
          this.userService.storeLoggedInUsername(this.registrationInfo.username);

          /* navigate to Home Page on successful registration, delay by one sec and half */
          setTimeout(() => {
            this.router.navigate(['/Home']);
          }, 1500);
        } else {
          this.registerFailure = true;
          this.registrationFailureMessage = resObj.msg;
        }
      });
    } else {
      this.registerFailure = true;
      this.registrationFailureMessage = 'Password and Confirm Password don\'t match';
    }

  }
}
