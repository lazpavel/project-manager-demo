import { AuthorizationType, CfnAuthorizer, Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, SourceMapMode } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path from 'path';

interface StatusApiProps {
  readonly graphqlEndpoint: string;
  readonly graphqlArn: string;
  readonly userPool: IUserPool;
}

export class StatusAPI extends Construct {
  private role: Role;
  private statusLambda: NodejsFunction;
  private api: RestApi;

  constructor(scope: Construct, id: string, props: StatusApiProps) {
    super(scope, id);

    this.role = this.createRole(props);
    this.statusLambda = this.createStatusLambda(props);
    this.api = this.createStatusAPI(props);
  }

  createRole(props: StatusApiProps): Role {
    const role = new Role(this, 'status-api-role', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole'
      )
    );
    role.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['appsync:*'],
        resources: [props.graphqlArn],
      })
    );

    return role;
  }

  createStatusLambda(props: StatusApiProps): NodejsFunction {
    return new NodejsFunction(this, 'status', {
      entry: path.resolve(
        'amplify/custom/status-api/lambda/status-lambda/src/index.ts'
      ),
      handler: 'handler',
      memorySize: 512,
      runtime: Runtime.NODEJS_18_X,
      role: this.role,
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: SourceMapMode.INLINE,
        sourcesContent: false,
        target: 'esnext',
      },
      environment: {
        GRAPHQL_ENDPOINT: props.graphqlEndpoint,
      },
    });
  }

  createStatusAPI(props: StatusApiProps): RestApi {
    const api = new RestApi(this, 'status-api');
    // Define the Cognito user pool authorizer
    const userPoolAuthorizer = new CfnAuthorizer(
      this,
      'UserPoolAuthorizer',
      {
        restApiId: api.restApiId,
        name: 'UserPoolAuthorizer',
        type: 'COGNITO_USER_POOLS',
        identitySource: 'method.request.header.Authorization',
        providerArns: [props.userPool.userPoolArn],
      }
    );

    const statusResource = api.root.addResource('status');
    statusResource.addMethod(
      'GET',
      new LambdaIntegration(this.statusLambda),
      {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: {
          authorizerId: userPoolAuthorizer.ref,
        },
      }
    );

    statusResource.addCorsPreflight({
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS, // this is also the default
    });

    return api;
  }
}