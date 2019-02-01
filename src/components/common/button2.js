import React from 'react';
import { Text, TouchableOpacity } from 'react-native';


const Button2 = ({ onPress, children }) => {

	const {buttonStyle, textStyle} = styles;

	return (
		<TouchableOpacity  onPress={onPress} style={buttonStyle}>
			<Text style={ textStyle}> 
				{children}
			</Text>
		</TouchableOpacity>
	);
};

const styles = {
	buttonStyle:{
		flex: 1,
		alignSelf: 'center',
		backgroundColor: '#fff',
		borderRadius: 360,
		borderWidth: 1,
		borderColor: '#000000',
		marginLeft: 5,
		marginRight: 5
	},
	textStyle: {
		alignSelf: 'center',
		color: '#000000',
		fontSize: 16,
		fontWeight: '600',
		padding: 15	
	}
};

export { Button2 };