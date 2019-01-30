import React from 'react';
import { Text, ScrollView , View, Button, } from 'react-native';
import firebase from 'firebase';


export default class App extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
       currentTime: null, 
       currentDay: null ,
    }
    this.daysArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  }

  componentWillMount(){
    this.getCurrentTime();
    const config = {
      apiKey: "AIzaSyCjKXQzdexPXzwnzUGws3ozgE1P0P_1eTA",
      authDomain: "fireclock-24f83.firebaseapp.com",
      databaseURL: "https://fireclock-24f83.firebaseio.com",
      projectId: "fireclock-24f83",
      storageBucket: "fireclock-24f83.appspot.com",
      messagingSenderId: "744715117658"
    };
    firebase.initializeApp(config);
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
    const currentTimeClockIn = this.state.currentTime;
    const ref = firebase.database().ref('Clock In').update({
      [currentTimeClockIn] : true
    })
  }

  clockOut = () => {
    const currentTimeClockOut = this.state.currentTime;
    const ref = firebase.database().ref('Clocked Out').update({
      [currentTimeClockOut] : true
    })

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
          <View><Text>Hours Worked </Text></View>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6ba9bb',
  },
  sv:{
    padding: 30,
    color: '#ffffff',
    flex: 1,
  }
};
