
import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';

export default function CardModal({visible, children, title}:{visible:boolean; children: React.ReactNode; title?:string}){
  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {children}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex:1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems:'center', justifyContent:'center'},
  card: { width: '88%', backgroundColor:'#111827', padding: 18, borderRadius: 20 },
  title: { color: '#fff', fontSize: 18, fontWeight:'800', marginBottom: 8},
});
