import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dasboard/ActivityDashboard';
import {v4 as uuid, v4} from 'uuid';

function App() {

  //Keeping a global state of all of the activities.
  const [activities, setActivities] = useState<Activity[]>([]); 

  //Keeping state for the selected activity (displaying in the details component)
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

  //Checks whether if we are editing or not.
  const [editMode, setEditMode] = useState(false);

  //Getting activities from the API
  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      setActivities(response.data);
    })
  }, [])

  function handleSelectActivity(id : string){
    setSelectedActivity(activities.find(a => a.id === id))
  }

  function handleCancelSelectActivity(){
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }
  
  //When this function executes, it makes a change in the virtual dom
  //which is to close the Form.
  function handleFormClose(){
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity){
    activity.id
    ? setActivities([...activities.filter(x => x.id !== activity.id), activity]) 
    : setActivities([...activities, {...activity, id: uuid()}]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id :string){
    setActivities(activities.filter(a => a.id !== id))
  }

  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
        activities={activities} 
        selectedActivity={selectedActivity}
        selectActivity={handleSelectActivity}
        cancelSelectActivity={handleCancelSelectActivity}
        editMode = {editMode}
        openForm={handleFormOpen}
        closeForm = {handleFormClose}
        createOrEdit={handleCreateOrEditActivity}
        deleteActivity = {handleDeleteActivity}
        />
      </Container>
       
    </>
  );
}

export default App;
