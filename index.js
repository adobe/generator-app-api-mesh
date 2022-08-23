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
const Generator = require('yeoman-generator')
const { constants } = require('@adobe/generator-app-common-lib')
const genericAction = require('@adobe/generator-add-action-generic')

class ApiMesh extends Generator {
  constructor (args, opts, features) {
    super(args, opts, features)

    this.option('skip-prompt', { default: false })
  }

  async initializing () {
    // all paths are relative to root
    this.templateFolder = 'src/api-mesh'
    this.actionFolder = path.join(this.templateFolder, 'actions')
    this.templateConfigPath = constants.appConfigFile

    // generate a generic action
    this.composeWith({
      Generator: genericAction,
      path: 'unknown'
    },
    {
      // forward needed options
      'skip-prompt': true, // do not ask for an action name
      'action-folder': this.actionFolder,
      'config-path': this.templateConfigPath,
      'full-key-to-manifest': 'application.runtimeManifest'
    })
  }
}

module.exports = ApiMesh
