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

/* eslint-disable jest/expect-expect */

const helpers = require('yeoman-test')
/* eslint-disable-next-line node/no-unpublished-require */
const assert = require('yeoman-assert')
/* eslint-disable-next-line node/no-unpublished-require */
const cloneDeep = require('lodash.clonedeep')
const fs = require('fs')
const { ActionGenerator } = require('@adobe/generator-app-common-lib')
const ApiMeshActionGenerator = require('../src/generator-add-action-api-mesh')

const basicGeneratorOptions = {
  'action-folder': 'src/api-mesh/actions',
  'config-path': 'app.config.yaml',
  'full-key-to-manifest': 'application.runtimeManifest'
}
const actionName = 'api-mesh-query-content'

describe('prototype', () => {
  test('exports a yeoman generator', () => {
    expect(ApiMeshActionGenerator.prototype).toBeInstanceOf(ActionGenerator)
  })
})

/**
 * Checks that all files have been generated.
 *
 * @param {string} actionName an action name
 */
function assertGeneratedFiles (actionName) {
  assert.file(basicGeneratorOptions['config-path'])

  assert.file(`${basicGeneratorOptions['action-folder']}/${actionName}/index.js`)

  assert.file(`test/${actionName}.test.js`)
  assert.file(`e2e/${actionName}.e2e.test.js`)

  assert.file(`${basicGeneratorOptions['action-folder']}/utils.js`)
  assert.file('test/utils.test.js')
}

/**
 * Checks that an action file contains correct code snippets.
 *
 * @param {string} actionName an action name
 */
function assertActionCodeContent (actionName) {
  const theFile = `${basicGeneratorOptions['action-folder']}/${actionName}/index.js`
  assert.fileContent(
    theFile,
    'const { GraphQLClient, gql } = require(\'graphql-request\')'
  )
  assert.fileContent(
    theFile,
    'const requiredParams = [\'MESH_ID\', \'MESH_API_KEY\']'
  )
  assert.fileContent(
    theFile,
    'const requiredHeaders = [\'Authorization\']'
  )
  assert.fileContent(
    theFile,
    'const client = new GraphQLClient(apiMeshEndpoint)'
  )
  assert.fileContent(
    theFile,
    'const data = await client.request(query)'
  )
}

describe('run', () => {
  test('test a generator invocation', async () => {
    const options = cloneDeep(basicGeneratorOptions)
    options['skip-prompt'] = true
    await helpers.run(ApiMeshActionGenerator)
      .withOptions(options)
      .inTmpDir(dir => {
        // ActionGenerator expects to have the ".env" file created
        fs.writeFileSync('.env', '')
      })

    assertGeneratedFiles(actionName)
    assertActionCodeContent(actionName)
  })
})
