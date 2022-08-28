/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/* istanbul ignore file */

const path = require('path')
const { constants, ActionGenerator, commonTemplates } = require('@adobe/generator-app-common-lib')
const { commonDependencyVersions } = constants

class ApiMeshActionGenerator extends ActionGenerator {
  constructor (args, opts) {
    super(args, opts)
    this.props = {
      description: 'This is a sample action showcasing how to query API MESH',
      // eslint-disable-next-line quotes
      requiredParams: `['MESH_ID', 'MESH_API_KEY']`,
      // eslint-disable-next-line quotes
      requiredHeaders: `['Authorization']`,
      // eslint-disable-next-line quotes
      importCode: `const { GraphQLClient, gql } = require('graphql-request')
const { Core } = require('@adobe/aio-sdk')`,

      responseCode: `const apiMeshEndpoint = \`https://graph.adobe.io/api/\${params.MESH_ID}/graphql?api_key=\${params.MESH_API_KEY}\`
    const query = gql\`
      {
        storeConfig {
          store_name
        }
      }
    \`
    // query content from API MESH
    const client = new GraphQLClient(apiMeshEndpoint)
    const data = await client.request(query)
    // perform some business logic
    data.storeConfig.store_name = '[App Builder]: ' + data.storeConfig.store_name
    const response = {
      statusCode: 200,
      body: data
    }`,
      actionName: 'api-mesh-query-content'
    }
  }

  writing () {
    this.sourceRoot(path.join(__dirname, '.'))

    this.addAction(this.props.actionName, commonTemplates['stub-action'], {
      testFile: '../templates/api-mesh.test.js',
      sharedLibFile: commonTemplates.utils,
      sharedLibTestFile: commonTemplates['utils.test'],
      e2eTestFile: commonTemplates['stub-action.e2e'],
      tplContext: this.props,
      dependencies: {
        '@adobe/aio-sdk': commonDependencyVersions['@adobe/aio-sdk'],
        'graphql-request': '^4.3.0'
      },
      actionManifestConfig: {
        inputs: {
          MESH_ID: '$MESH_ID',
          MESH_API_KEY: '$MESH_API_KEY',
          LOG_LEVEL: 'debug'
        },
        annotations: { final: true }
      },
      dotenvStub: { label: 'API MESH variables', vars: ['MESH_ID', 'MESH_API_KEY'] }
    })

    this.copyDestination(path.join(__dirname, '../templates/', 'mesh.json'), this.destinationPath(this.actionFolder, '../conf/', 'mesh.json'))
  }
}

module.exports = ApiMeshActionGenerator
