import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dasboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent'
import LoadingComponent from './LoadingComponent';
function App() {

  //Keeping a global state of all of the activities.
  const [activities, setActivities] = useState<Activity[]>([]); 

  //Keeping state for the selected activity (displaying in the details component)
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

  //Checks whether if we are editing or not.
  const [editMode, setEditMode] = useState(false);

  const[loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  //Getting activities from the API
  useEffect(() => {
    agent.Activities.list().then(response => {
      let activitiesToReturn: Activity[] = [];

      response.forEach(activity => {
        activity.date = activity.date.split('T')[0]; //Formateando la fecha
        activitiesToReturn.push(activity);
      })

      setActivities(activitiesToReturn);
      setLoading(false);
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
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity]) 
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    } else{
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
  }

  function handleDeleteActivity(id :string){
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id !== id)]);
      setSubmitting(false);

    });
    setActivities(activities.filter(a => a.id !== id))
  }

  if (loading) return <LoadingComponent content='Loading app'/>

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
        submitting ={submitting}
        />
      </Container>
       
    </>
  );
}

export default App;
