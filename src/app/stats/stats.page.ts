import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { logger } from 'src/utils/logger';
import { get } from '@aws-amplify/api';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class StatsPage implements OnInit {

  constructor() { }

  async ngOnInit(): Promise<void> {
    const user = await getCurrentUser();
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};

    // Ensure that the access token is present
    if (!idToken || !accessToken) {
      throw new Error('Access tokens missing');
    }

    // Construct the request headers with the access token
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${idToken.toString()}`,
    };

    const operation = get({
      apiName: 'status-api',
      path: 'status',
      options: {
        queryParams: {
          userId: user.username,
        },
        headers: headers,
        withCredentials: true,
      },
    });

    const { body } = await operation.response;
    const json = await body.json();
    logger.info({ json });
  }
}
