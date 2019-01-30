import React, { Component } from 'react';
import { connect } from  'react-redux';
import { View , Text , ScrollView, TextInput , Button } from 'react-native';
import { employeeUpdate } from '../actions';
import { CardSection, Input } from './common';

// class EmployeeForm extends Component {
	
// 	render (){
// 		return (
// 			<View style={styles.container}>
// 				<CardSection>
// 					<Input 
// 						label="Club"
// 						placeholder="6 iron"
// 						value={this.props.name}
// 						onChangeText={value => this.props.employeeUpdate({prop: 'name', value})}
// 					/>
// 				</CardSection>

// 				<CardSection>
// 					<Input
// 						label="Distance"
// 						placeholder="150 To 160"
// 						value={this.props.phone}
// 						onChangeText={value => this.props.employeeUpdate({prop: 'phone', value})}
// 					/>
// 				</CardSection>

// 				<CardSection style={{ flexDirection:'column'}}>
// 					<ScrollView>
// 						<TextInput
// 							style={{ flexDirection:'column', flex: 1 , height: 90, fontSize: 16}}
// 							multiline = {true}
// 							numberOfLines = {6}
// 							label="Notes"
							
// 							placeholder="Ball closer to the left foot"
// 							value={this.props.shift}
// 							onChangeText={value => this.props.employeeUpdate({prop: 'shift', value})}
// 						/>
// 					</ScrollView>
					
// 				</CardSection>
// 			</View>
// 		);

// 	}
// }



// const mapStateToProps = ( state ) => {
// 	const { name, phone, shift } = state.employeeForm;

// 	return { name, phone, shift};
// };


// export default connect(mapStateToProps, {employeeUpdate})(EmployeeForm);




export default class EmployeeForm extends React.Component {

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



