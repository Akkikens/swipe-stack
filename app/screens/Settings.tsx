
import React from 'react';
import { SafeAreaView, Text, StyleSheet, View, Switch } from 'react-native';
import { useUIStore } from '../store/useUIStore';

export default function Settings(){
  const soundEnabled = useUIStore(s=>s.soundEnabled);
  const toggleSound = useUIStore(s=>s.toggleSound);

  return (
    <SafeAreaView style={styles.wrap}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Sound</Text>
        <Switch value={soundEnabled} onValueChange={toggleSound} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap:{ flex:1, backgroundColor:'#0B0F17', padding:20 },
  title:{ color:'#fff', fontSize:26, fontWeight:'800', marginBottom: 16 },
  row:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical: 12 },
  label:{ color:'#D1D5DB', fontSize:16 }
});
