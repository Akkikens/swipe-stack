
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import CardModal from '../components/CardModal';
import { useUIStore } from '../store/useUIStore';
import { loadTuning } from '../services/remoteConfig';

export default function Home({navigation}: any){
  const [version, setVersion] = useState<string>('');
  const [tuning, setTuning] = useState<any>(null);
  const { showPaywall, setShowPaywall } = useUIStore();

  useEffect(()=>{ (async()=>{
    const t = await loadTuning();
    setTuning(t);
    setVersion('v'+(global as any).expo?.manifest?.version ?? '0.1');
  })() },[]);

  return (
    <SafeAreaView style={styles.wrap}>
      <Text style={styles.title}>Swipe Stack</Text>
      <Text style={styles.subtitle}>Build the tallest tower with perfect flicks.</Text>

      <View style={{height: 24}}/>

      <PrimaryButton title="Play (Endless)" onPress={()=> navigation.navigate('Game', { mode: 'endless' })} />
      <PrimaryButton title="Daily Seed" onPress={()=> navigation.navigate('Game', { mode: 'daily' })} />
      <PrimaryButton title="Settings" variant="ghost" onPress={()=> navigation.navigate('Settings')} />

      <View style={{flex:1}}/>

      <Text style={styles.footer}>Tuning: {tuning ? 'Loaded' : '...' }   {version}</Text>

      <CardModal visible={showPaywall} title="Go Pro">
        <Text style={{color:'#fff', marginBottom:12}}>Remove ads, unlock skins, and support development.</Text>
        <PrimaryButton title="Continue" onPress={()=> setShowPaywall(false) } />
      </CardModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap:{ flex:1, backgroundColor:'#0B0F17', padding: 20 },
  title:{ color: 'white', fontSize: 36, fontWeight:'900', letterSpacing: 0.5 },
  subtitle:{ color:'#9CA3AF', marginTop:6 },
  footer:{ color:'#6B7280', textAlign:'center', marginBottom: 12 }
});
