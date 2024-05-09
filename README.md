# Amplify Gen 2 - Code First DX

One of the key differences between Amplify Gen 1 and Amplify Gen 2 is the use of a code-first development experience. This means that you can define your backend resources using code and then deploy them to the cloud. This is a more developer-friendly approach as it allows you to version control your backend resources and collaborate with other developers more easily.

From Amplify Development context this is a big change, as in Amplify Gen 1, you would define your backend resources using the Amplify CLI and then deploy them to the cloud. 

It also avoids backend branch management by the Amplify framework and leaves the versioning control handle the branch infrastructure.

## Getting Started

In this guide, we will walk you through how to create a new Amplify project using the code-first development experience.

```
ionic start project-manager-demo
cd project-manager-demo

git remote add origin git@github.com:lazpavel/project-manager-demo.git
git branch -M main
git push -u origin main

pnpm add -D @aws-amplify/backend@latest @aws-amplify/backend-cli@latest typescript 
pnpm add @aws-amplify/ui-angular @aws-amplify/api pino

npm create amplify@latest

# setup auth resource
# setup data resource

# test changes in sandbox env
pnpm ampx sandbox

# add custom api and lambda backend resource
# add status lambda code

cd amplify/custom/status-api/lambda
mkdir status-lambda

pnpm init && pnpm add -D typescript &&  pnpm tsc --init
pnpm add aws-lambda pino && pnpm add -D @types/aws-lambda @types/node

# setup authenticator
# setup pages
```
