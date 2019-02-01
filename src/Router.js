import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import LoginForm from './components/LoginForm'; 
import EmployeeForm from './components/EmployeeForm';




const RouterComponent = () => {
	return (
		<Router  >
			<Scene key="auth" title="Clock" >
				<Scene key="login" component={LoginForm}/>
			</Scene>
			
			<Scene key="main" title="Clock" component={EmployeeForm}  >
				
			</Scene>
		</Router>
	);
};

export default RouterComponent;