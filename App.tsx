
import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Home from './app/screens/Home';
import Game from './app/screens/Game';
import Settings from './app/screens/Settings';

export type ScreenName = 'Home'|'Game'|'Settings';
export default function App(){
  const [screen, setScreen] = useState<ScreenName>('Home');
  const [params, setParams] = useState<any>({});

  const navigation = {
    navigate: (name: ScreenName, p?: any)=> { setParams(p||{}); setScreen(name); },
    back: ()=> setScreen('Home')
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar barStyle="light-content" />
      {screen === 'Home' && <Home navigation={navigation} />}
      {screen === 'Game' && <Game route={{params}} navigation={navigation} />}
      {screen === 'Settings' && <Settings />}
    </SafeAreaView>
  );
}
