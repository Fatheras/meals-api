<p align="center">
  <a href="https://ecocart.io/" target="blank"><img src="https://lever-client-logos.s3.us-west-2.amazonaws.com/a8166ec8-059b-439c-9e83-dc3f9e342cd1-1664982789427.png" width="400" alt="Logo" /></a>
</p>

## Description

A simple API that allows users to get meals by ingredients using [Meals-API](https://www.themealdb.com)

## Ways to improve
- Increase test coverage. There is only e2e coverage of the endpoint with few unit tests.
- Host on a public API. I wanted to host an API on an EC2 instance like I did before, but the free trial has expired. >_<
- Improve security mechanisms. Currently there is only query params validation.
- Refactor + rename some parts that I wrote in a hurry:) 

## Scaling
AWS will be used as an example of a cloud provider.
### How to reduce dependency from MealsDB
1. Start caching responses using Redis with a 24-hour expiration, this way we will significantly speed up data retrieval and reduce the number of requests to MealsDB. This is the fastest solution in terms of implementation, which can also be used as a temporary solution before the second one (see below).
2. Get all data from MealsDB, send it to our own database and use it instead. It makes sense to update data via cron jobs every 24 hours. As a database, I would use a noSQL solution here for easier scalability with fast read times (we rarely write/update). DynamoDB-like DBs are the best solutions here in terms of read times, but document-based DBs like MongoDB will also do the job.
3. Use other meals providers or make it by ourselves. MealsDB is a good API for hometasks, but not really suitable for production apps:)
P.S. In any case, it's needed to use caching. Redis cache/Amazon DynamoDB Accelerator AND HTTP caching (minimum 15 minutes).

### How to scale the DB
We can use autoscaling DynamoDB + DAX or if MongoDB + Redis we can use autoscaling Amazon DocumentDB/Atlas and Amazon ElastiCache. We can also deploy them on prem and scale them out with manually defined "scaling rules" based on workload if there are factors such as compliance or the need to be platform-agnostic.

### How to scale the API
To scale microservice with the endpoint, we can use any of the different approaches depending on the requirements.
1. We can scale EC2 with ELB. In my opinion, this is the easiest way, but it will make us dependent on AWS and require a relatively predictable workload to be cost effective.
2. As an open source solution, we can use Kubernetes, it takes more time to implement, but also more flexible. We can use our kubernetes configuration in various clouds or on-premises.
3. We can use serverless solutions like Beanstalk or Lambdas. Beanstalk is a service that can automatically scale our platform, and Lambdas can run code by FaaS model at a pretty significant discount. These services are especially good if the load is unpredictable. We should keep in mind that Lambdas have limitations like a cold start that can increase read times.

### Example
Without specific requirements, it makes sense to create an application based on a hybrid architecture in order to have more flexibility(the ability to change the cloud provider, database migration, etc.) in the future when the requirements become more specific.

VERY high level visualization below
<p align="center">
<img src="https://i.imgur.com/4JHfMtc.png">
</p>

## Security
The endpoint is idempotent so we don't have to take care of most OWASP vulnerabilities.

But in any case, we must have DDOS protection, which is built into almost all cloud providers. Or we can add an open source solution like NGINX and set it up there.

We also need to add https

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Stay in touch

- Author - [Stanislav Levchenko](https://www.linkedin.com/in/stanislav-levchenko-ab7657196)
