import { View, Text, Pressable, StyleSheet } from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';





function ProjectButton({ children }) {
  function pressHandler() {
    console.log('ProjectButton - Pressed!');
  }

  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={pressHandler}
        android_ripple={{ color: GlobalStyles.colors.gray200 }}
      >
        <Text style={styles.buttonText}>{children}</Text>
        


        <AnimatedCircularProgress
  size={75}
  width={15}
  fill={80}
  tintColor="#00e0ff"
  onAnimationComplete={() => console.log('ProjectButton - onAnimationComplete')}
  backgroundColor="#3d5875" />
        
    
      </Pressable>
    </View>
  );
}

export default ProjectButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 28,
    margin: 4,
    height : 150,
    width : 150,
    overflow: 'hidden',
  },
  buttonInnerContainer: {
    backgroundColor: GlobalStyles.colors.gray200,
    paddingVertical: 8,
    paddingHorizontal: 16,
    height : 150,
    width : 150,
    elevation: 2,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
  
});