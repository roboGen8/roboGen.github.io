import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user-service';
import * as CanvasJS from './canvasjs.min';
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";
import {Globals} from '../globals'
import { delay } from 'q';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  globals: Globals;
  public username;

  constructor(private userService: UserService, globals: Globals) {
    this.globals = globals;
    // console.log(this.globals.username_global);
   }

   public meanVertical(arr) {
    var sum = 0;
    arr.forEach(function(item){  
      sum += item
    });  
    sum /= arr.length;
    sum /= 15;
    sum *= 100;
    return sum;
   }

   public meanTangential(arr) {
    var sum = 0;
   arr.forEach(function(item){  
     sum += item
   });  
   sum /= arr.length;
   sum /= 45;
   sum *= 100;
   return sum;
  }

  ngOnInit() {
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
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    var database = firebase.database();

    // console.log(this.globals.username_global);
    this.username = this.userService.getStoredLoggedInUsername();

    var leadsRef = database.ref('results/' + this.username);
    console.log(leadsRef);
    var v_sum;
    var t_sum;
    let verticalPoints = [
      { x: new Date(2017, 0, 3), y: 65 },
      { x: new Date(2017, 0, 4), y: 70 },
      { x: new Date(2017, 0, 5), y: 70 },
      { x: new Date(2017, 0, 6), y: 68 },
      { x: new Date(2017, 0, 7), y: 34 },
      { x: new Date(2017, 0, 8), y: 93 },
      { x: new Date(2017, 0, 9), y: 84 },
      { x: new Date(2017, 0, 10), y: 53 },
      { x: new Date(2017, 0, 11), y: 89 }
    ];
    let tangentialPoints = [
      { x: new Date(2017, 0, 3), y: 51 },
      { x: new Date(2017, 0, 4), y: 56 },
      { x: new Date(2017, 0, 5), y: 54 },
      { x: new Date(2017, 0, 6), y: 58 },
      { x: new Date(2017, 0, 7), y: 54 },
      { x: new Date(2017, 0, 8), y: 63 },
      { x: new Date(2017, 0, 9), y: 67 },
      { x: new Date(2017, 0, 10), y: 63 },
      { x: new Date(2017, 0, 11), y: 69 }
    ];
    var count = 0;

    leadsRef.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        console.log(childSnapshot.key);
        var childData = childSnapshot.val();
        console.log(childData.v0);
        //Mean Vertical
        v_sum = Math.abs(childData.v0) + Math.abs(childData.v1) 
        +Math.abs(childData.v2) +Math.abs(childData.v3) + Math.abs(childData.v4);
        
        v_sum /= 5;
        v_sum /= 15;
        v_sum *= 100;
        v_sum = 100 - v_sum;
        //End of Mean Vertical
      
        //Mean Tangential
        t_sum = Math.abs(childData.t0) + Math.abs(childData.t1) 
        +Math.abs(childData.t2) +Math.abs(childData.t3) + Math.abs(childData.t4);
        
        t_sum /= 5;
        t_sum /= 45;
        t_sum *= 100;
        t_sum = 100 - t_sum;
        //End of Tangential
        let date = childSnapshot.key.split("-");
        console.log(date);
        verticalPoints[count] = {x: new Date(+date[2], +date[0] - 1, +date[1]), y: v_sum};
        tangentialPoints[count] = {x: new Date(+date[2], +date[0] - 1, +date[1]), y: t_sum};
        count++;
        });
        createChart();
      });
    
		
		function createChart() {
      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        width: 1000,
        height: 300,
        axisX:{
          valueFormatString: "DD MMM",
          crosshair: {
            enabled: true,
            snapToDataPoint: true
          }
        },
        axisY: {
          title: "Accuracy (%)",
          crosshair: {
            enabled: true
          }
        },
        toolTip:{
          shared:true
        },  
        legend:{
          cursor:"pointer",
          verticalAlign: "bottom",
          horizontalAlign: "left",
          dockInsidePlotArea: true,
          itemclick: toogleDataSeries
        },
        data: [{
          type: "line",
          showInLegend: true,
          name: "Vertical Accuracy",
          markerType: "square",
          xValueFormatString: "DD MMM, YYYY",
          color: "#F08080",
          dataPoints: verticalPoints
        },
        {
          type: "line",
          showInLegend: true,
          name: "Torsional Accuracy",
          dataPoints: tangentialPoints
        }]
      });
      chart.render();
      function toogleDataSeries(e){
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else{
          e.dataSeries.visible = true;
        }
        chart.render();
      }
    }
    console.log(verticalPoints);
    
  }

  
  
  
}

