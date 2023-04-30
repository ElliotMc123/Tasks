import { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, TextInput } from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import { Ionicons } from '@expo/vector-icons';
import ProjectButton from '../Home/ProjectButton';
import { ScrollView } from 'react-native';
import { ProjectsContext } from '../../store/projects-context';

function ProjectsContainer({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');

  const projectsCtx = useContext(ProjectsContext);
  const projects = projectsCtx.projects;

  useEffect(() => {
    // Listen for changes in the projects state and re-render the component
    
  }, [projectsCtx.projects]);

  function addProjectHandler() {
 //   projectName
    const newProjectName = String(projectName);
    projectsCtx.addProject(newProjectName);
    setShowModal(false);
    console.log("ProjectsContainer.js - Projects", projectsCtx);
  }

  return (
    <View>
      <View style={styles.buttonOuterContainer}>  
        <View style={styles.header}>
          <Text>Projects</Text>
          <Pressable onPress={() => setShowModal(true)}>
            <Ionicons name="add-circle-outline" color= 'black' size={30} />
          </Pressable>
          <Pressable>
            <Text>See all</Text>
          </Pressable>     
        </View>
          
        <View style={styles.container}>
  <View style={styles.buttonContainer}>
    {Object.keys(projects).length > 0 ? (
      <ScrollView horizontal={true}>
        {Object.keys(projects).map((projectName) => (
          <ProjectButton key={projectName}>
            {projectName}
          </ProjectButton>
        ))}
      </ScrollView>
    ) : (
      <Text>No projects found</Text>
    )}
  </View>
</View>
</View>


      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Project</Text>
          <TextInput
            style={styles.modalTextInput}
            placeholder="Project Name"
            onChangeText={text => setProjectName(text)}
            value={projectName}
          />
          <Pressable style={styles.modalButton} onPress={addProjectHandler}>
            <Text style={styles.modalButtonText}>Add</Text>
          </Pressable>
          <Pressable style={styles.modalButton} onPress={() => setShowModal(false)}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

export default ProjectsContainer;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },

  buttonOuterContainer: {
    backgroundColor: GlobalStyles.colors.gray100,
    paddingHorizontal: 8,
    elevation: 2,
    borderRadius: 28,
    height: 200,
  },
  button: {
    fontSize: 20,
    color: GlobalStyles.colors.gray700,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalTextInput: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  modalButton: {
    width: '80%',
    height: 40,
    backgroundColor: GlobalStyles.colors.primary100,
    borderRadius: 28,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
