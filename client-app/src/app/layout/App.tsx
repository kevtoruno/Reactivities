import { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dasboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
function App() {

  const {activityStore} = useStore();

  //Getting activities from the API
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore])

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>

  return (
    <>
      <NavBar />
      
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard/>
      </Container>
       
    </>
  );
}

export default observer(App);
