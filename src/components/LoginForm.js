import React, { Component } from 'react';
import { Text,  Image, KeyboardAvoidingView } from 'react-native';
import { Asset } from 'expo';
import { connect } from 'react-redux';
import { emailChanged , passwordChanged, loginUser } from '../actions';
import { Card, CardSection, Input, Button, Spinner } from './common';

class Loginform extends Component {

	async componentDidMount() {
	  this._cacheResourcesAsync();
	}

	onEmailChange(text){
		this.props.emailChanged(text);
	}

	onPasswordChange(text){
		this.props.passwordChanged(text);
	}

	onButtonPress() {
		const { email, password } = this.props;

		this.props.loginUser({ email, password });
	}

	renderButton(){
		if (this.props.loading){
			return <Spinner size="large"/>;
		}

		return (
			<Button onPress={this.onButtonPress.bind(this)}>
				Login
			</Button>
		);
	}

	async _cacheResourcesAsync() {
	    const images = [
	      require('../../assets/icon.png'),
	    ];
	    const cacheImages = images.map((image) => {
	      return Asset.fromModule(image).downloadAsync();
	    });
	    return Promise.all(cacheImages)
	}

	render() {
		return (
			<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
			<Text style={styles.h1}> 🔥ClOcK ⏰ </Text>
			<Image
				style={{width: 90, height: 90, alignSelf: 'center' ,padding: 20}}
				source={require('../../assets/icon.png')} 
			/>
			<Card>
				<CardSection>
					<Input
						label="Email"
						placeholder="email@gmail.com"
						onChangeText={this.onEmailChange.bind(this)}
						value={this.props.email}
					/>
				</CardSection>

				<CardSection>
					<Input
						secureTextEntry
						label="Password"
						placeholder="Password" 
						onChangeText={this.onPasswordChange.bind(this)}
						value={this.props.password}
					/>
				</CardSection>
				<CardSection>
					<Text> use me@me.com with a password of password</Text>
				</CardSection>

				<Text style={styles.errorTextStyle}>
					{this.props.error}
				</Text>

				<CardSection>

					{this.renderButton()}

				</CardSection>
			</Card>
			</KeyboardAvoidingView>
		);
	}
}


const styles = {
	errorTextStyle: {
		fontSize: 20,
		alignSelf: 'center',
		color: 'red'
	},
	container: {
	    flex: 1,
	    justifyContent: 'center',
	},
	h1:{
		fontSize: 50,
		alignSelf: 'center',
		padding: 20,
		textShadowColor: '#ffeb00',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 10,
		color: '#e40d0d',
	}
};

const mapStateToProps = ({auth}) => {
	const { email, password, error, loading } = auth;
	return { email ,password, error, loading };
};

export default connect(mapStateToProps, {
	emailChanged, passwordChanged, loginUser
})(Loginform);
