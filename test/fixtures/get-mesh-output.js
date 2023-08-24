/* eslint-disable */
const output = { stdout: 'Selected organization: Org\nSelected project: Test Project\nSelect workspace: Stage\n{\n  "apiKey": "apiKey",\n  "sdkList": [\n    null\n  ],\n  "mesh": {\n    "lastUpdated": "2022-11-02T19:43:04.378Z",\n    "meshConfig": {\n      "sources": [\n        {\n          "name": "Commerce",\n          "handler": {\n            "graphql": {\n              "endpoint": "https://venia.magento.com/graphql/"\n            }\n          }\n        }\n      ]\n    },\n    "meshId": "aaa-bbb-ccc",\n    "lastUpdatedBy": {\n      "firstName": "John",\n      "lastName": "Doe",\n      "userEmail": "johndoe@adobe.com",\n      "userId": "id",\n      "displayName": "John%20Doe"\n    }\n  },\n  "endpoint": "https://graph.adobe.io/api/aaa-bbb-ccc/graphql?api_key=apiKey"\n}' }

const error = new Error( "Error message")
error.stderr = 'No mesh found'
module.exports = {
    output: output,
    error: error
}
