import React, { Component } from 'react';
import firebase from 'firebase';
import { Animated,View , Text , ScrollView, TextInput, Easing } from 'react-native';
import { CardSection , Button2 , Button } from './common';


export default class App extends React.Component {

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
    this.animatedValue = new Animated.Value(0);
  }

  componentWillMount(){
    this.getCurrentTime();
  }

  componentDidMount(){
                        
    this.timer = setInterval(() => {
            this.getCurrentTime();
        }, 1000);

  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  animate () {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 600,
        easing: Easing.linear
      }
    ).start();
  }

  // clock in function to create ref for db

  clockIn = () => {
    const { currentUser } = firebase.auth();
    const currentTimeClockIn = this.state.currentTime;
    const currentDayClockin = this.state.currentDay;
    firebase.database().ref(`/users/${currentUser.uid}/clockIn`)
    .push({currentDayClockin, currentTimeClockIn})
    this.shiftCalculatorIn();
    this.animate();
  }

  // clock out function to create ref for db

  clockOut = () => {
    const { currentUser } = firebase.auth();
    const currentTimeClockOut = this.state.currentTime;
    const currentDayClockOut = this.state.currentDay;
    firebase.database().ref(`/users/${currentUser.uid}/clockOut`)
    .push({ currentDayClockOut,  currentTimeClockOut})
    this.animate();
    this.shiftCalculatorOut();
  }

  // function to get ref of clockin and lock out time  set state to time in time out and work day
  // to use with add time 

  shiftCalculatorIn = () => {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/users/${currentUser.uid}/clockIn`).orderByKey().limitToLast(1)
      .once('value', snapshot => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childDataClockIn = childSnapshot.val();
            const hourIn = childDataClockIn.currentTimeClockIn;
            this.setState({timeIn: hourIn });
          });
      });
  }

  shiftCalculatorOut = () => {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/users/${currentUser.uid}/clockOut`).orderByKey().limitToLast(1)
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

  // function to calculate  time worked 

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

  // function to create ref for db of shift worked

  displayShiftCal = () => {
    const { currentUser } = firebase.auth();
    const shiftWorked =  (this.state.currentDay)  + ':' +  this.state.hoursWorked;
    firebase.database().ref(`/users/${currentUser.uid}/shift`)
    .push({ shiftWorked})
    
  }

  // function to show last shift worked

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
    this.displayShiftCal()
    this.addTimes();
  }

  
  
  // function to display current time

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

  //conditionaly render the shift if empty 

  renderShift () {

    if (this.state.shift){
      return  (
          <Text style={styles.textS}>
            Last Shift:  {this.state.shift} 
          </Text>
      );

    }
    return(
        <Text style={styles.textS}>
          Last Shift:  None 
        </Text>
    );
  }

  renderClockIn () {

    if (this.state.timeIn){
      return  (
        <Text style={styles.textS}>Clock In Time:  {this.state.timeIn }</Text>
      );

    }
    return(
      <Text style={styles.textS}>Clock In Time:</Text>
    );
  }

  renderClockOut () {

    if (this.state.timeOut){
      return  (
        <Text style={styles.textS}>Clock Out Time:  {this.state.timeOut }</Text>  
      );

    }
    return(
      <Text style={styles.textS}>Clock Out Time:</Text>  
    );
  }



  render() {
    const rotateX = this.animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['0deg', '180deg', '360deg']
      })
    return (
      <CardSection style={styles.container}>
        <ScrollView style={styles.sv}>
          <CardSection>
            <Text style={styles.clockS}>{ this.state.currentDay }</Text>  
          </CardSection>
          <CardSection>
             <Animated.Text style={{transform: [{rotateX}],  fontSize: 55, padding: 10}}>{ this.state.currentTime }</Animated.Text>  
          </CardSection>
          <CardSection>
          <Button2  onPress={this.clockIn}>Clock In</Button2>
          <Button2  onPress={this.clockOut}>Clock Out</Button2>
          </CardSection>
          <CardSection>
            {this.renderClockIn()} 
          </CardSection>
          <CardSection>
            {this.renderClockOut()} 
          </CardSection>
          <CardSection>
            <Text style={styles.textS}>
              Day Worked : {this.state.workDay}
            </Text>
          </CardSection>
          <CardSection>
            <Text style={styles.textS}>
              Time Worked:  {this.state.hoursWorked} 
            </Text>
          </CardSection>
          <CardSection>
            <Button style={styles.button} onPress={this.displayShifts}>See Time Worked</Button>
          </CardSection>
          <CardSection>
            {this.renderShift()}
          </CardSection>
        </ScrollView>
      </CardSection>
    );
  }
}

const styles = {
  container: {
    paddingTop: 30,
    marginTop: 5,
    color: '#ffffff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sv:{
      padding: 3,
      color: '#ffffff',
      flex: 1,
    },
  textS:{
    fontSize: 25, 
    padding: 10
  },
  textC:{
    fontSize: 15, 
    padding: 10
  },
  clockS:{
    fontSize: 55, 
    padding: 10
  }
};
