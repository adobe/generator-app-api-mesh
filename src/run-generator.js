const ApiMeshCreateGenerator = require('./generator-create-api-mesh.js');
const Generator = require('yeoman-generator');
const path = require('path');

async function runGenerator() {
  const args = [];
  const opts = {
    env: require('yeoman-environment').createEnv(),
    resolved: path.join(__dirname, 'generator-create-api-mesh.js'),
    'skip-install': true,
    'template-folder': 'templates'
  };

  const generator = new ApiMeshCreateGenerator(args, opts);

  try {
    await generator.install();
    await generator.end();
  } catch (error) {
    console.error('Error running generator:', error);
  }
}

runGenerator();