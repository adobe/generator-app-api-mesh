/* eslint-disable */
const output = {
    stdout: 'Selected organization: Org\n' +
      'Selected project: Test Project\n' +
      'Select workspace: Stage\n' +
      '{\n' +
      '  "mesh": {\n' +
      '    "meshConfig": {\n' +
      '      "sources": [\n' +
      '        {\n' +
      '          "name": "Commerce",\n' +
      '          "handler": {\n' +
      '            "graphql": {\n' +
      '              "endpoint": "https://venia.magento.com/graphql/"\n' +
      '            }\n' +
      '          }\n' +
      '        }\n' +
      '      ]\n' +
      '    },\n' +
      '    "meshId": "aaa-bbb-ccc",\n' +
      '    "lastUpdated": "2022-11-02T19:43:04.378Z",\n' +
      '    "createdOn": "2022-11-02T19:43:04.378Z",\n' +
      '    "createdBy": {\n' +
      '      "userId": "id",\n' +
      '      "displayName": "John Doe",\n' +
      '      "firstName": "John",\n' +
      '      "lastName": "Doe",\n' +
      '      "userEmail": "johndoe@adobe.com"\n' +
      '    }\n' +
      '  }\n' +
      '}'
  }

const error = new Error( 'No mesh found')
error.stderr = error

module.exports = {
    output: output,
    error: error
}
