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

const apiMesh = require('../index')
const helpers = require('yeoman-test')
const Generator = require('yeoman-generator')
const ApiMeshActionGenerator = require('../src/generator-add-action-api-mesh')
const excReactWebAssets = require('@adobe/generator-add-web-assets-exc-react')
const { utils } = require('@adobe/generator-app-common-lib')

const composeWith = jest.spyOn(Generator.prototype, 'composeWith').mockImplementation(jest.fn())
const prompt = jest.spyOn(Generator.prototype, 'prompt')
const writeKeyAppConfig = jest.spyOn(utils, 'writeKeyAppConfig')
const writeKeyYAMLConfig = jest.spyOn(utils, 'writeKeyYAMLConfig')

beforeEach(() => {
  composeWith.mockClear()
  prompt.mockClear()
  writeKeyAppConfig.mockClear()
  writeKeyYAMLConfig.mockClear()
})

describe('prototype', () => {
  test('exports a yeoman generator', () => {
    expect(apiMesh.prototype).toBeInstanceOf(Generator)
  })
})

describe('run', () => {
  test('test a generator invocation skipping questions', async () => {
    const options = { yes: true }
    await helpers.run(apiMesh)
      .withOptions(options)
    expect(prompt).not.toHaveBeenCalled()
    expect(composeWith).toHaveBeenCalledTimes(1)
    expect(composeWith).toHaveBeenCalledWith(
      expect.objectContaining({
        Generator: ApiMeshActionGenerator,
        path: 'unknown'
      }),
      {
        'action-folder': global.n('src/api-mesh/actions'),
        'config-path': 'app.config.yaml',
        'full-key-to-manifest': 'application.runtimeManifest'
      }
    )
  })

  test('test a generator invocation asking questions', async () => {
    const options = { yes: false }
    await helpers.run(apiMesh)
      .withOptions(options)
      .withPrompts({ isExperienceCloudUIApp: true })
    expect(prompt).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({
        type: 'confirm',
        name: 'isExperienceCloudUIApp',
        default: false
      })])
    )
    expect(composeWith).toHaveBeenCalledTimes(2)
    expect(composeWith).toHaveBeenCalledWith(
      expect.objectContaining({
        Generator: ApiMeshActionGenerator,
        path: 'unknown'
      }),
      {
        'action-folder': global.n('src/dx-excshell-1/api-mesh/actions'),
        'config-path': global.n('src/dx-excshell-1/api-mesh/ext.config.yaml'),
        'full-key-to-manifest': 'runtimeManifest'
      }
    )
    expect(composeWith).toHaveBeenCalledWith(
      expect.objectContaining({
        Generator: excReactWebAssets,
        path: 'unknown'
      }),
      {
        'skip-prompt': false,
        'web-src-folder': global.n('src/dx-excshell-1/api-mesh/web-src'),
        'config-path': global.n('src/dx-excshell-1/api-mesh/ext.config.yaml')
      }
    )
    expect(writeKeyAppConfig).toHaveBeenCalledTimes(1)
    expect(writeKeyYAMLConfig).toHaveBeenCalledTimes(3)
    expect(writeKeyAppConfig).toHaveBeenCalledWith(expect.any(apiMesh), 'extensions.dx/excshell/1', { $include: 'src/dx-excshell-1/api-mesh/ext.config.yaml' })
    expect(writeKeyYAMLConfig).toHaveBeenCalledWith(expect.any(apiMesh), 'src/dx-excshell-1/api-mesh/ext.config.yaml', 'operations', { view: [{ impl: 'index.html', type: 'web' }] })
    expect(writeKeyYAMLConfig).toHaveBeenCalledWith(expect.any(apiMesh), 'src/dx-excshell-1/api-mesh/ext.config.yaml', 'actions', 'actions')
    expect(writeKeyYAMLConfig).toHaveBeenCalledWith(expect.any(apiMesh), 'src/dx-excshell-1/api-mesh/ext.config.yaml', 'web', 'web-src')
  })
})
