
import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

type Props = { title: string; onPress?: () => void; disabled?: boolean; variant?: 'primary'|'ghost'};

export default function PrimaryButton({ title, onPress, disabled, variant='primary' }: Props){
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({pressed}) => [
      styles.base,
      variant==='primary' ? styles.primary : styles.ghost,
      pressed && { transform: [{scale: 0.98}]},
      disabled && { opacity: 0.5 }
    ]}>
      <Text style={variant==='primary' ? styles.primaryText : styles.ghostText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  primary: {
    backgroundColor: '#7C3AED',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#7C3AED'
  },
  primaryText: { color: 'white', fontWeight: '700' },
  ghostText: { color: '#7C3AED', fontWeight: '700' }
});
