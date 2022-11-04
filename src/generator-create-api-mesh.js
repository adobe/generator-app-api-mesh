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

const { constants } = require('@adobe/generator-app-common-lib')
const meshPluginName = '@adobe/aio-cli-plugin-api-mesh'
const { EOL } = require('os')
const chalk = require('chalk')
const Generator = require('yeoman-generator')

class ApiMeshCreateGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts)
    this.props = { meshConfig: {} }
  }

  async install () {
    try {
      this.log('Check if Mesh plugin is installed')
      const listInstalledPlugins = (await this.spawnCommand('aio', ['plugins'], { stdio: [process.stderr] })).stdout
      const isPluginInstalled = listInstalledPlugins.indexOf(meshPluginName) !== -1
      if (isPluginInstalled) {
        this.log(meshPluginName + ' is installed')
      } else {
        this.log(meshPluginName + ' is not installed. Installing...')
        await this.spawnCommand('aio', ['plugins', 'install', meshPluginName])
      }
      const output = (await this.spawnCommand('aio', ['api-mesh', 'create', '-c', this.options['template-folder'] + '/conf/mesh.json', '--json'], { stdio: [process.stderr] })).stdout

      this.props.meshConfig = JSON.parse(output.substring(output.indexOf('{'), output.lastIndexOf('}') + 1))
      const dotenvFile = this.destinationPath(constants.dotenvFilename)
      const vars = [{ name: 'MESH_ID', value: this.props.meshConfig.mesh.meshId }, { name: 'MESH_API_KEY', value: this.props.meshConfig.adobeIdIntegrationsForWorkspace.apiKey }]
      const content = `${vars.map(v => `${v.name}=${v.value}`).join(EOL)}${EOL}`
      /* istanbul ignore next */
      if (this.fs.exists(dotenvFile)) {
        /* istanbul ignore next */
        this.fs.append(dotenvFile, content)
      } else {
        this.fs.write(dotenvFile, content)
      }
    } catch (error) {
      this.log(error)
      throw new Error('Unable to create a Mesh')
    }
  }

  async end () {
    /* istanbul ignore next */
    if (this.props.meshConfig) {
      this.log(chalk.blue(chalk.bold(`API Mesh endpoint:\n  -> https://graph.adobe.io/api/${this.props.meshConfig.mesh.meshId}/graphql?api_key=${this.props.meshConfig.adobeIdIntegrationsForWorkspace.apiKey}${EOL}`)))
    }
  }
}

module.exports = ApiMeshCreateGenerator
