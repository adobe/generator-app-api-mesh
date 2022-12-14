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

const path = require('path')
const upath = require('upath')
const Generator = require('yeoman-generator')
const { constants, utils } = require('@adobe/generator-app-common-lib')
const ApiMeshActionGenerator = require('./src/generator-add-action-api-mesh')
const ApiMeshCreateGenerator = require('./src/generator-create-api-mesh')
const excReactWebAssets = require('@adobe/generator-add-web-assets-exc-react')

class ApiMesh extends Generator {
  constructor (args, opts, features) {
    super(args, opts, features)

    // options are inputs from CLI or a yeoman parent generator
    this.option('skip-prompt', { type: Boolean, default: false, description: 'Skip questions, and use all default values' })

    this.props = {
      // should a generator generate a Single Page Application accessed through Experience Cloud UI
      isExperienceCloudUIApp: false,
      createMesh: false,
      meshConfig: {}
    }
  }

  async initializing () {
    await this._askAboutExperienceCloudUI()

    if (this.props.isExperienceCloudUIApp) {
      await this._generateExperienceCloudUIApp()
    } else {
      await this._generateHeadlessApp()
    }
    await this._askAboutCreateMesh()
  }

  async writing () {
    if (this.props.isExperienceCloudUIApp) {
      const unixExtConfigPath = upath.toUnix(this.templateConfigPath)
      // add the extension point config in root
      utils.writeKeyAppConfig(
        this,
        // key
        'extensions.' + this.configName,
        // value
        {
          $include: unixExtConfigPath
        }
      )

      // add an extension point operation
      utils.writeKeyYAMLConfig(
        this,
        this.templateConfigPath,
        // key
        'operations',
        // value
        {
          view: [
            { type: 'web', impl: 'index.html' }
          ]
        }
      )

      // add actions path, relative to config file
      utils.writeKeyYAMLConfig(this, this.templateConfigPath, 'actions', path.relative(this.templateFolder, this.actionFolder))
      // add web-src path, relative to config file
      utils.writeKeyYAMLConfig(this, this.templateConfigPath, 'web', path.relative(this.templateFolder, this.webSrcFolder))
    }
  }

  async _askAboutExperienceCloudUI () {
    if (!this.options['skip-prompt']) {
      const confirm = await this.prompt([
        {
          type: 'confirm',
          name: 'isExperienceCloudUIApp',
          message: 'By default, Headless Application sample API Mesh code files will be generated. Should generated sample API Mesh code files be for a Single Page Application accessed through Experience Cloud UI?',
          default: this.props.isExperienceCloudUIApp
        }
      ])
      this.props.isExperienceCloudUIApp = confirm.isExperienceCloudUIApp
    }
  }

  async _askAboutCreateMesh () {
    if (!this.options['skip-prompt']) {
      const confirm = await this.prompt([
        {
          type: 'confirm',
          name: 'createMesh',
          message: 'Do you want to create sample API Mesh?',
          default: this.props.createMesh
        }
      ])
      this.props.createMesh = confirm.createMesh
    }
  }

  async _generateExperienceCloudUIApp () {
    // all paths are relative to root
    this.templateFolder = 'src/dx-excshell-1/api-mesh'
    this.actionFolder = path.join(this.templateFolder, 'actions')
    this.webSrcFolder = path.join(this.templateFolder, 'web-src')
    this.templateConfigPath = path.join(this.templateFolder, 'ext.config.yaml')
    this.configName = 'dx/excshell/1'

    this.composeWith({
      Generator: ApiMeshActionGenerator,
      path: 'unknown'
    },
    {
      // forward needed options
      'skip-prompt': this.options['skip-prompt'],
      'action-folder': this.actionFolder,
      'config-path': this.templateConfigPath,
      'full-key-to-manifest': constants.runtimeManifestKey
    })

    // generate the UI
    this.composeWith({
      Generator: excReactWebAssets,
      path: 'unknown'
    }, {
      // forward needed options
      'skip-prompt': this.options['skip-prompt'],
      'web-src-folder': this.webSrcFolder,
      'config-path': this.templateConfigPath
    })
  }

  async _generateHeadlessApp () {
    // all paths are relative to root
    this.templateFolder = 'src/api-mesh'
    this.actionFolder = path.join(this.templateFolder, 'actions')
    this.templateConfigPath = constants.appConfigFile

    this.composeWith({
      Generator: ApiMeshActionGenerator,
      path: 'unknown'
    },
    {
      // forward needed options
      'skip-prompt': this.options['skip-prompt'],
      'action-folder': this.actionFolder,
      'config-path': this.templateConfigPath,
      'full-key-to-manifest': 'application.runtimeManifest'
    })
  }

  async install () {
    if (this.props.createMesh) {
      this.composeWith({
        Generator: ApiMeshCreateGenerator,
        path: 'unknown'
      },
      {
        // forward needed options
        'skip-prompt': this.options['skip-prompt'],
        'template-folder': this.templateFolder
      })
    }
  }
}

module.exports = ApiMesh
