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

const composeWith = jest.spyOn(Generator.prototype, 'composeWith')
const prompt = jest.spyOn(Generator.prototype, 'prompt')

beforeAll(() => {
  // mock implementations
  composeWith.mockReturnValue(undefined)
})
beforeEach(() => {
  composeWith.mockClear()
  prompt.mockClear()
})
afterAll(() => {
  composeWith.mockRestore()
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
    expect.assertions(3)
    expect(prompt).not.toHaveBeenCalled()
    expect(composeWith).toHaveBeenCalledTimes(1)
    expect(composeWith).toHaveBeenCalledWith(
      expect.objectContaining({
        Generator: ApiMeshActionGenerator,
        path: 'unknown'
      }),
      expect.any(Object)
    )
  })

  test('test a generator invocation asking questions', async () => {
    const options = { yes: false }
    await helpers.run(apiMesh)
      .withOptions(options)
      .withPrompts({ isExperienceCloudUIApp: true })
    expect.assertions(4)
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
      expect.any(Object)
    )
    expect(composeWith).toHaveBeenCalledWith(
      expect.objectContaining({
        Generator: excReactWebAssets,
        path: 'unknown'
      }),
      expect.any(Object)
    )
  })
})
