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
    this.log('Checking if mesh plugin is installed')
    const listInstalledPlugins = (await this.spawnCommand('aio', ['plugins'], { stdio: [process.stderr] })).stdout
    const isPluginInstalled = listInstalledPlugins.indexOf(meshPluginName) !== -1
    if (isPluginInstalled) {
      this.log(meshPluginName + ' is installed')
    } else {
      this.log(meshPluginName + ' is not installed. Installing...')
      try {
        await this.spawnCommand('aio', ['plugins', 'install', meshPluginName])
      } catch (e) {
        throw new Error('Unable to create a mesh. Run "aio plugins" and check if "@adobe/aio-cli-plugin-api-mesh" plugin is installed. Make sure you\'re using the latest version.')
      }
    }
    this.log('Checking if selected workspace doesn\'t have a mesh')
    let shouldCreateMesh = false;
    try {
      const output = await this.spawnCommand('aio', ['api-mesh', 'get'], { stdio: [process.stderr] });
      // The command might produce output on stderr without failing
      if (output.stderr && output.stderr.includes('No mesh found')) {
        shouldCreateMesh = true;
      }
    } catch (err) {
      // If the command fails, check if the error message indicates no mesh was found
      if (err.stderr && err.stderr.message.includes('No mesh found')) {
        shouldCreateMesh = true;
      } else {
        this.log('unexpected error occurred while getting mesh: ' + err);
      }
    }
    if (shouldCreateMesh) {
      this.log('Creating mesh')
      const output = (await this.spawnCommand('aio', ['api-mesh', 'create', '-c', this.options['template-folder'] + '/mesh.json', '--json'], { stdio: [process.stderr] })).stdout
      this.log(output)
      this.props.meshConfig = JSON.parse(output.substring(output.indexOf('{'), output.lastIndexOf('}') + 1))
      const dotenvFile = this.destinationPath(constants.dotenvFilename)
      const vars = [{ name: 'MESH_ID', value: this.props.meshConfig.mesh.meshId }]
      const content = `${vars.map(v => `${v.name}=${v.value}`).join(EOL)}${EOL}`
      /* istanbul ignore next */
      if (this.fs.exists(dotenvFile)) {
        /* istanbul ignore next */
        this.fs.append(dotenvFile, content)
      } else {
        this.fs.write(dotenvFile, content)
      }
    } else {
      throw new Error('Selected org, project and workspace already has a mesh. Delete the mesh to create a sample mesh using "aio app". Make sure you\'re using the latest version.')
    }
  }

  async end () {
    /* istanbul ignore next */
    if (this.props.meshConfig) {
      this.log(chalk.blue(chalk.bold(`API Mesh endpoint:\n  -> https://edge-stage-graph.adobe.io/api/${this.props.meshConfig.mesh.meshId}/graphql${EOL}`)))
    }
  }
}

module.exports = ApiMeshCreateGenerator
