import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logger } from './utils/logger';
import { HttpRequest } from '@smithy/protocol-http';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { sub } = event?.requestContext?.authorizer?.claims;
    const jwtToken = event.headers['Authorization'];

    if (!sub || !jwtToken) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    if (!process.env.AWS_REGION) {
      logger.error('AWS_REGION is missing');
      throw new Error('AWS_REGION is missing');
    }

    if (!process.env.GRAPHQL_ENDPOINT) {
      logger.error('GRAPHQL_ENDPOINT is missing');
      throw new Error('GRAPHQL_ENDPOINT is missing');
    }

    const endpoint = new URL(process.env.GRAPHQL_ENDPOINT);

    logger.info('list projects');
    const query = /* GraphQL */ `
      query LIST_PROJECTS {
        listProjects{
          items {
            id
            name
            description
            tasks {
              items {
                title
                description
              }
            }
          }
        }
      }
    `;

    const request = new HttpRequest({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        host: endpoint.host,
        Authorization: jwtToken,
      },
      hostname: endpoint.host,
      body: JSON.stringify({
        query: query,
        variables: {},
      }),
      path: endpoint.pathname,
    });

    const response = await fetch(endpoint, request);
    const json = await response.json();

    if (json.errors) {
      logger.error({ errors: json.errors });
      throw new Error(json.errors);
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: json }),
    };
  } catch (error) {
    logger.error({ error: error });
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        error: 'Failed to create Plaid Link token',
        reason: error,
      }),
    };
  }
};
