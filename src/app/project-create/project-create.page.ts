import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { generateClient } from 'aws-amplify/data';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Schema } from 'amplify/data/resource';
import { Router } from '@angular/router';
import { logger } from 'src/utils/logger';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.page.html',
  styleUrls: ['./project-create.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonList,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProjectCreatePage {
  private client;
  projectForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.client = generateClient<Schema>();
  }

  async createProject(): Promise<void> {
    logger.info({ message: 'createProject', data: this.projectForm.value });
    const formData = {
      name: this.projectForm.value.name!,
      description: this.projectForm.value.description!,
    };

    await this.client.models.project.create(formData);
    this.router.navigate(['/projects']);
  }
}
