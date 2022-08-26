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

const composeWith = jest.spyOn(Generator.prototype, 'composeWith')

beforeAll(() => {
  // mock implementations
  composeWith.mockReturnValue(undefined)
})
beforeEach(() => {
  composeWith.mockClear()
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
  test('test a generator invocation', async () => {
    const options = { yes: true }
    await helpers.run(apiMesh)
      .withOptions(options)
    expect(composeWith).toHaveBeenCalledTimes(1)
    expect(composeWith).toHaveBeenCalledWith(
      expect.objectContaining({
        Generator: expect.any(apiMesh.constructor),
        path: 'unknown'
      }),
      expect.any(Object)
    )
  })
})
