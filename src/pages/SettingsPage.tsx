import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonIcon,
  IonBadge,
  IonToggle,
  IonText,
  IonItemDivider,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useAuth } from '../auth';
import { firestore } from '../firebase';

const SettingsPage: React.FC = () => {
  const { userId } = useAuth();
  const [ firstName, setFirstName ] = useState(''); 
  const [ lastName, setLastName ] = useState('');
  const [ location, setLocation ] = useState('');
  const [ metric, setMetric ] = useState(true);
  // const [ editing, setEditing ] = useState(false);
  
  useEffect(() => {
    const usersRef = firestore.collection('users').doc(userId);
    return usersRef.onSnapshot((user) => {
      const data = user.data();
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setMetric(data.metric);
    });
  }, [userId]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

      <IonList>
          <IonItemDivider>
            <IonLabel>
              Your Profile
            </IonLabel>
          </IonItemDivider>

          <IonGrid>
            <IonRow>
              <IonCol sm-size="9">
                <IonItem>
                  <IonLabel position="fixed">First Name</IonLabel>
                  <IonInput type="text" value={firstName} onIonChange={(event) => setFirstName(event.detail.value)} />
                </IonItem>
                <IonItem class="ion-margin-top">
                  <IonLabel position="fixed">Last Name</IonLabel>
                  <IonInput type="text" value={lastName} onIonChange={(event) => setLastName(event.detail.value)} />
                </IonItem>
                <IonItem class="ion-margin-top">
                  <IonLabel position="fixed">Location</IonLabel>
                  <IonInput type="text" value={location} onIonChange={(event) => setLocation(event.detail.value)} />
                </IonItem>
              </IonCol>
              <IonCol class="ion-no-padding ion-justify-content-end" size="3">
                [ profile image ]
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonItemDivider>
            <IonLabel>
              Your Preferences
            </IonLabel>
          </IonItemDivider>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem class="ion-margin-top">
                  <IonLabel>Distance</IonLabel>
                  <IonToggle checked={metric} onIonChange={e => setMetric(e.detail.checked)} />
                  <IonBadge slot="end" color={ metric ? 'primary' : 'secondary' }>{metric ? 'km' : 'miles'}</IonBadge>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
          {/* <IonItem class="ion-margin-top">
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput type="email" value={email} onIonChange={(event) => setEmail(event.detail.value)} />
          </IonItem>
          <IonItem class="ion-margin-top">
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput type={showPassword ? "text" : "password" } value={password} onIonChange={(event) => setPassword(event.detail.value)} />
            <IonIcon slot="end" icon={showPasswordIcon} onClick={() => {toggleShowPassword()}} />
          </IonItem> */}
        </IonList>
        <IonItemDivider>
          <IonLabel>
            Logout?
          </IonLabel>
        </IonItemDivider>
        <IonButton expand="block" color="medium" onClick={() => auth.signOut()}>Logout</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
