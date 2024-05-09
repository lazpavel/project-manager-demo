import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { StatusAPI } from './custom/status-api/lambda/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

new StatusAPI(
  backend.createStack('project-genie-status-api-stack'),
  'status-api',
  {
    graphqlEndpoint: backend.data.graphqlUrl,
    graphqlArn: backend.data.resources.graphqlApi.arn,
    userPool: backend.auth.resources.userPool,
  }
);
