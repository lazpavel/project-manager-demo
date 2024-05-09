import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  project: a
    .model({
      id: a.id(),
      name: a.string().required(),
      description: a.string().required(),
      status: a.string().default('Not started'),
      tasks: a.hasMany('task', 'project_id')
    })
    .authorization((allow) => [allow.authenticated()]),
  task: a
    .model({
      id: a.id(),
      project_id: a.id(),
      project: a.belongsTo('project', ['project_id']),
      status: a.string().default('Not started'),
      title: a.string().required(),
      description: a.string(),
      user_id: a.id(),
      assignee: a.belongsTo('user', 'user_id'),
      start_date: a.date(),
      complete_date: a.date(),
      comments: a.hasMany('comment', 'task_id'),
    })
    .authorization((allow) => [allow.authenticated()]),
  user: a
    .model({
      id: a.id(),
      name: a.string().required(),
      tasks: a.hasMany('task', 'user_id'),
      comments: a.hasMany('comment', 'user_id'),
    })
    .authorization((allow) => [allow.owner()]),
  comment: a.model({
    id: a.id(),
    task_id: a.id(),
    task: a.belongsTo('task', ['task_id']),
    user_id: a.id(),
    user: a.belongsTo('user', ['user_id']),
    content: a.string().required(),
  }).authorization((allow) => [allow.owner()]),
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({ schema });
