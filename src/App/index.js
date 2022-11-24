
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from '../Screens/HomeStack';
import { createStackNavigator } from '@react-navigation/stack';
import FlashMessage from 'react-native-flash-message';

const Stack = createStackNavigator();

export default App = ({navigation}) =>  {
    return (

      <NavigationContainer>
        <FlashMessage position="bottom" />
          <Stack.Navigator>
        <Stack.Screen name="HomeDrawer" component={HomeStack} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
    );
  }
