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
/* eslint-disable-next-line node/no-unpublished-require */
const helpers = require('yeoman-test')
/* eslint-disable-next-line node/no-unpublished-require */
const assert = require('yeoman-assert')
const ApiMeshCreateGenerator = require('../src/generator-create-api-mesh')
const Generator = require('yeoman-generator')
const spawnCommandSpy = jest.spyOn(Generator.prototype, 'spawnCommand').mockImplementation(jest.fn())
const dotEnvFile = '.env'
const createMesh = require('./fixtures/create-mesh-output.js')
const getMeshOutput = require('./fixtures/get-mesh-output')

beforeEach(() => {
  spawnCommandSpy.mockClear()
})

describe('prototype', () => {
  test('exports a yeoman generator', () => {
    expect(ApiMeshCreateGenerator.prototype).toBeInstanceOf(Generator)
  })
})

describe('plugin installed already', () => {
  
  test('sets shouldCreateMesh to true when command produces "No mesh found" on stderr without failing', async () => {
    spawnCommandSpy
      // list of plugins
      .mockReturnValueOnce({ stdout: '@adobe/aio-cli-plugin-api-mesh' })
      // get Mesh
      .mockReturnValueOnce({ stderr: 'No mesh found', stdout: '' }) 
        // mesh creation
      .mockReturnValueOnce(createMesh.output)
    const options = { 
      'template-folder': 'src/api-mesh'
    }
    
    await helpers.run(ApiMeshCreateGenerator).withOptions(options)
    
    expect(spawnCommandSpy).toHaveBeenCalledTimes(3)
    assert.fileContent(
      dotEnvFile,
      'MESH_ID=aaa-bbb-ccc'
    )
  
  })

  test('logs an unexpected error message when an unexpected error occurs', async () => {
  spawnCommandSpy
    // list of plugins
    .mockReturnValueOnce({ stdout: '@adobe/aio-cli-plugin-api-mesh' })
    // get Mesh
    .mockRejectedValueOnce({ stderr: 'An unexpected error occurred', stdout: '' })

  const options = { 
    'template-folder': 'src/api-mesh'
  }

  await expect(async () => await helpers.run(ApiMeshCreateGenerator).withOptions(options)).rejects.toThrow()

  expect(spawnCommandSpy).toHaveBeenCalledTimes(2)
})
  test('succeeds when plugin is installed and no mesh found', async () => {
    spawnCommandSpy
      // list of plugins
      .mockReturnValueOnce({ stdout: '@adobe/aio-cli-plugin-api-mesh' })
      // get Mesh
      .mockRejectedValueOnce(getMeshOutput.error)
      // mesh creation
      .mockReturnValueOnce(createMesh.output)
    const options = {
      'template-folder': 'src/api-mesh'
    }
    await helpers.run(ApiMeshCreateGenerator).withOptions(options)
    expect(spawnCommandSpy).toHaveBeenCalledTimes(3)
    assert.fileContent(
      dotEnvFile,
      'MESH_ID=aaa-bbb-ccc'
    )
  })

  test('fails when workspace already has a mesh', async () => {
    spawnCommandSpy
      // list of plugins
      .mockReturnValueOnce({ stdout: '@adobe/aio-cli-plugin-api-mesh' })
      // get Mesh
      .mockReturnValueOnce(getMeshOutput.output)
    const options = {
      'template-folder': 'src/api-mesh'
    }
    await expect(async () => await helpers.run(ApiMeshCreateGenerator).withOptions(options)).rejects.toThrow()
    expect(spawnCommandSpy).toHaveBeenCalledTimes(2)
  })

   test('fails on get mesh generic error', async () => {
    spawnCommandSpy
      // list of plugins
      .mockReturnValueOnce({ stdout: '@adobe/aio-cli-plugin-api-mesh' })
      // get Mesh
      .mockRejectedValueOnce(new Error('Error'))
    const options = {
      'template-folder': 'src/api-mesh'
    }
    await expect(async () => await helpers.run(ApiMeshCreateGenerator).withOptions(options)).rejects.toThrow()
    expect(spawnCommandSpy).toHaveBeenCalledTimes(2)
  })
})

describe('tests with plugin installation step', () => {
  test('should succeed with plugin installation', async () => {
    spawnCommandSpy
      // list of plugins
      .mockReturnValueOnce({ stdout: '' })
      // plugin installation
      .mockReturnValueOnce({})
      // check mesh available
      .mockRejectedValueOnce(getMeshOutput.error)
      // mesh creation
      .mockReturnValueOnce(createMesh.output)
    const options = {
      'template-folder': 'src/api-mesh'
    }
    await helpers.run(ApiMeshCreateGenerator).withOptions(options)
    expect(spawnCommandSpy).toHaveBeenCalledTimes(4)
    assert.fileContent(
      dotEnvFile,
      'MESH_ID=aaa-bbb-ccc'
    )
  })

  test('invocation fails when workspace already has a mesh after plugin installation', async () => {
    spawnCommandSpy
      // list of plugins
      .mockReturnValueOnce({ stdout: '' })
      // plugin installation
      .mockReturnValueOnce({})
      // get mesh
      .mockReturnValueOnce(getMeshOutput.output)
    const options = {
      'template-folder': 'src/api-mesh'
    }
    await expect(async () => await helpers.run(ApiMeshCreateGenerator).withOptions(options)).rejects.toThrow()
    expect(spawnCommandSpy).toHaveBeenCalledTimes(3)
  })

  test('fails with mesh get generic error after plugin installation', async () => {
    spawnCommandSpy
      // list of plugins
      .mockReturnValueOnce({ stdout: '' })
      // plugin installation
      .mockReturnValueOnce({})
      // get mesh
      .mockRejectedValueOnce(new Error('Error'))
    const options = {
      'template-folder': 'src/api-mesh'
    }
    await expect(async () => await helpers.run(ApiMeshCreateGenerator).withOptions(options)).rejects.toThrow()
    expect(spawnCommandSpy).toHaveBeenCalledTimes(3)
  })

  test('fails when plugin installation fails', async () => {
    spawnCommandSpy
      // list of plugins
      .mockReturnValueOnce({ stdout: '' })
      // plugin installation
      .mockRejectedValueOnce(new Error('Installation failed'))
    const options = {
      'template-folder': 'src/api-mesh'
    }
    await expect(async () => await helpers.run(ApiMeshCreateGenerator).withOptions(options)).rejects.toThrow()
    expect(spawnCommandSpy).toHaveBeenCalledTimes(2)
  })
})
