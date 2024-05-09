import { Component } from '@angular/core';
import {
  IonApp,
  IonItem,
  IonList,
  IonMenu,
  IonRouterOutlet,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonMenuButton,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';
import outputs from '../../amplify_outputs.json';
import { Amplify } from 'aws-amplify';
import { fetchUserAttributes, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { UserData } from 'src/types/user';
import { logger } from 'src/utils/logger';
import {
  AmplifyAuthenticatorModule,
  AuthenticatorService,
} from '@aws-amplify/ui-angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

Amplify.configure(outputs);
// [ ] TODO: remove this once amplify exports the API config
const amplifyConfigWithAPI = {
  ...Amplify.getConfig(),
  API: {
    ...Amplify.getConfig().API,
    REST: {
      ...Amplify.getConfig().API?.REST,
      'status-api': {
        endpoint:
          'https://q4dn6yjljd.execute-api.us-east-2.amazonaws.com/prod/',
        region: 'us-east-2',
      },
    },
  },
};
Amplify.configure(amplifyConfigWithAPI);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    AmplifyAuthenticatorModule,
    CommonModule,
    IonApp,
    IonRouterOutlet,
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonButtons,
    IonButton,
    IonMenu,
    IonMenuButton,
    IonToolbar,
    IonTitle,
    RouterLink,
  ],
})
export class AppComponent {
  userData!: UserData;
  formFields = {
    signUp: {
      email: {
        order: 1,
      },
      password: {
        order: 2,
      },
      confirm_password: {
        order: 3,
      },
      phone_number: {
        order: 4,
      },
    },
  };

  constructor(public authenticator: AuthenticatorService) {
    Hub.listen('auth', async ({ payload: { event } }) => {
      if (event === 'signedIn') {
        try {
          const userAttributes = await fetchUserAttributes();
          this.userData = {
            userIdentifier: userAttributes.sub!,
            givenName: userAttributes.given_name!,
            familyName: userAttributes.family_name!,
          };
        } catch (error) {
          logger.error(error);
        }
      }
    });
  }

  async handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      logger.error('logout failed: ' + error);
    }
  }
}
