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
       hoursWorked: '',

    }
    this.daysArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  }

  componentWillMount(){
    this.getCurrentTime();
    this.calculateHW();
  }

  componentDidMount(){
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
    firebase.database().ref(`/users/${currentUser.uid}/clockIn`)
        .push({ currentTimeClockIn})
  }

  clockOut = () => {
    const { currentUser } = firebase.auth();
    const currentTimeClockOut = this.state.currentTime;
    firebase.database().ref(`/users/${currentUser.uid}/clockOut`)
        .push({ currentTimeClockOut})
  }

  calculateHW = () => {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/users/${currentUser.uid}/clockIn`).orderByKey().limitToLast(1)
      .once('value', snapshot => {
        snapshot.forEach(function(childSnapshot) {
            const childKey = childSnapshot.key;
            const childDataClockIn = childSnapshot.val();
            
            // console.log(childDataClockIn);
          });
        // console.log(snapshot.key);

      });
      firebase.database().ref(`/users/${currentUser.uid}/clockOut`).orderByKey().limitToLast(1)
        .once('value', snapshot => {
          snapshot.forEach(function(childSnapshot) {
              const childKey = childSnapshot.key;
              const childDataClockOut = childSnapshot.val();

              // console.log(childDataClockOut);
            });
          // console.log(snapshot.key);

        });

  }

  getCurrentTime = () =>
  {
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
          <View><Text>Hours Worked:{this.hoursWorked} </Text></View>
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
    backgroundColor: '#6ba9bb'

  },
  sv:{
      padding: 30,
      color: '#ffffff',
      flex: 1,
    }
};



