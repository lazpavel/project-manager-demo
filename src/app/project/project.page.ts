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

import { ActivatedRoute } from '@angular/router';
import { logger } from 'src/utils/logger';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
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
export class ProjectPage implements OnInit, OnDestroy {
  id!: string;
  private client;
  private subscription: any | undefined;
  tasks: any[] = [];
  project: any = {};
  
  constructor(private route: ActivatedRoute) { 
    this.client = generateClient<Schema>();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id')!;
    const { data: project } = await this.client.models.project.get({
      id: this.id,
    });
    this.project = project;
    logger.info({ project });
    const { data: tasks } = await this.client.models.task.list({
      filter: { project_id: { eq: this.id } },
    });
    this.tasks = tasks;
    this.subscription = this.client.models.task
      .observeQuery()
      .subscribe({
        next: ({ items, isSynced }) => {
          this.tasks = items;
        },
      });
  }
}
