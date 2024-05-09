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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.page.html',
  styleUrls: ['./task-create.page.scss'],
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
export class TaskCreatePage {
  private client;
  taskForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.client = generateClient<Schema>();
  }

  async createTask(): Promise<void> {
    const projectId = this.route.snapshot.paramMap.get('id')!;
    const formData = {
      title: this.taskForm.value.title!,
      description: this.taskForm.value.description!,
      project_id: projectId,
    };

    await this.client.models.task.create(formData);
    this.router.navigate(['/projects', projectId.toString()]);
  }
}
