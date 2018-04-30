
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;
const VALIDATION_MESSAGE = `You haven't provided `;

exports.handler = (event, context, cb) => {
	console.log('request received');
	let deliveryRequest = JSON.parse(event.body);
    console.log(deliveryRequest);
};