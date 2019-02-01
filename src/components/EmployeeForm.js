import React, { Component } from 'react';
import firebase from 'firebase';
import { View , Text , ScrollView, TextInput , Button } from 'react-native';
import { CardSection, Input } from './common';


export default class EmployeeForm extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
       currentTime: null, 
       currentDay: null ,
       hoursWorked: 0,
       timeOut: 0,
       timeIn: 0,
       workDay: '',
       shift: '',
    }
    this.daysArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  }

  componentWillMount(){
    this.getCurrentTime();
  }

  componentDidMount(){
    this.displayShifts();
    this.timer = setInterval(() => {
            this.getCurrentTime();
        }, 1000);

  }

  componentWillUnmount(){
          clearInterval(this.timer);
  }

  clockIn = () => {
    const { currentUser } = firebase.auth();
    const currentTimeClockIn = this.state.currentTime;
    const currentDayClockin = this.state.currentDay;
    firebase.database().ref(`/users/${currentUser.uid}/clockIn`)
    .push({currentDayClockin, currentTimeClockIn})
  }

  clockOut = () => {
    const { currentUser } = firebase.auth();
    const currentTimeClockOut = this.state.currentTime;
    const currentDayClockOut = this.state.currentDay;
    firebase.database().ref(`/users/${currentUser.uid}/clockOut`)
    .push({ currentDayClockOut,  currentTimeClockOut})
    this.shiftCalculator();
    this.displayShiftCal();
    this.addTimes();
  }

  addTimes = () => {
    
    const startTime = this.state.timeIn;
    const endTime = this.state.timeOut;
    
    var times = [ 0, 0, 0 ]
    var max = times.length

    var a = (startTime || '').split(':')
    var b = (endTime || '').split(':')

    // normalize time values
    for (var i = 0; i < max; i++) {
      a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
      b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
    }

    // store time values
    for (var i = 0; i < max; i++) {
      times[i] = a[i] - b[i]
    }

    var hours = times[0]
    var minutes = times[1]
    var seconds = times[2]

    if (seconds >= 60) {
      var m = (seconds / 60) << 0
      minutes += m
      seconds -= 60 * m
    }

    if (minutes >= 60) {
      var h = (minutes / 60) << 0
      hours += h
      minutes -= 60 * h
    }

    const totalTime = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)

    this.setState({hoursWorked: totalTime })
  }

  displayShiftCal = () => {
    const { currentUser } = firebase.auth();
    const shiftWorked =  (this.state.currentDay)  + ':' +  this.state.hoursWorked;
    firebase.database().ref(`/users/${currentUser.uid}/shift`)
    .push({ shiftWorked})
  }

  shiftCalculator = () => {
    const { currentUser } = firebase.auth();
    const startTime1 = firebase.database().ref(`/users/${currentUser.uid}/clockIn`).orderByKey().limitToLast(1)
      .once('value', snapshot => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childDataClockIn = childSnapshot.val();
            const hourIn = childDataClockIn.currentTimeClockIn;
            this.setState({timeIn: hourIn });
          });
      });
    const endTime1 = firebase.database().ref(`/users/${currentUser.uid}/clockOut`).orderByKey().limitToLast(1)
      .once('value', snapshot => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childDataClockOut = childSnapshot.val();
            const hourOut = childDataClockOut.currentTimeClockOut;
            const dayOfWork = childDataClockOut.currentDayClockOut;
            this.setState({timeOut: hourOut ,  workDay: dayOfWork  });
          });
      });
    
  }

  displayShifts = () => {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/users/${currentUser.uid}/shift`).orderByKey().limitToLast(1)
        .once('value', snapshot => {
          snapshot.forEach((childSnapshot) => {
              const childKey = childSnapshot.key;
              const childDataShift = childSnapshot.val();
              const shiftOfWork = childDataShift.shiftWorked;
              this.setState({shift: shiftOfWork});
            });
        });
  }
  

  getCurrentTime = () => {
      let hour = new Date().getHours();
      let minutes = new Date().getMinutes();
      let seconds = new Date().getSeconds();
      let am_pm = 'pm';
   
      if( minutes < 10 )
      {
          minutes = '0' + minutes;
      }
   
      if( seconds < 10 )
      {
          seconds = '0' + seconds;
      }
   
      if( hour > 12 )
      {
          hour = hour - 12;
      }
   
      if( hour == 0 )
      {
          hour = 12;
      }
   
      if( new Date().getHours() < 12 )
      {
          am_pm = 'am';
      }
   
      this.setState({ currentTime: hour + ':' + minutes + ':' + seconds + ' ' + am_pm });
   
      this.daysArray.map(( item, key ) =>
      {
          if( key == new Date().getDay() )
          {
              this.setState({ currentDay: item.toUpperCase() });
          }
      })        
  }


  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.sv}>
          <View>
            <Text>{ this.state.currentDay }</Text>
             <Text>{ this.state.currentTime }</Text>  
          </View>
          <Button title="Clock In" onPress={this.clockIn}></Button>
          <Button title="Clock Out" onPress={this.clockOut}></Button>
          <View>
            <Text>Clock In Time:{ this.state.timeIn }</Text>
            <Text>Clock Out Time:{ this.state.timeOut }</Text>  
          </View>
          <View>
            <Text>
              Day Worked : {this.state.workDay}
            </Text>
          </View>
          <View>
            <Text>
              Time Worked:{this.state.hoursWorked} 
            </Text>
          </View>
          <View>
            
            <Text>
              Last Shift:{this.state.shift} 
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
    padding: 10,
    marginTop: 50,
    color: '#ffffff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6ba9bb',
    fontSize: 35

  },
  sv:{
      padding: 30,
      color: '#ffffff',
      flex: 1,
    }
};



