import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { Schema } from 'amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

@Component({
  selector: 'app-projects',
  templateUrl: 'projects.page.html',
  styleUrls: ['projects.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    RouterLink
  ],
})
export class ProjectsPage implements OnInit, OnDestroy {
  private client;
  private subscription: any | undefined;
  projects: any[] = [];

  constructor() {
    this.client = generateClient<Schema>();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async ngOnInit(): Promise<void> {
    const { data: projects } = await this.client.models.project.list();
    this.projects = projects;
    this.subscription = this.client.models.project
      .observeQuery()
      .subscribe({
        next: ({ items, isSynced }) => {
          this.projects = items;
        },
      });
  }
}
