
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const docClient = new AWS.DynamoDB.DocumentClient();
const stepfunctions = new AWS.StepFunctions();
const TABLE_NAME = process.env.TABLE_NAME;
const DELIVERY_STEP_FUNCTION_ARN = process.env.DELIVERY_STEP_FUNCTION;
const VALIDATION_MESSAGE = `You haven't provided `;

exports.handler = (event, context, cb) => {
	console.log('request received');
	let deliveryRequest = JSON.parse(event.body);
	console.log(deliveryRequest);

	let webhookUrl = deliveryRequest.webhookUrl || 'https://3w99bhuswd.execute-api.eu-central-1.amazonaws.com/latest/character';
	let pickupTime = deliveryRequest.pickupTime;
	let pickupAddress = deliveryRequest.pickupAddress;
	let deliveryAddress = deliveryRequest.deliveryAddress;
	if (!webhookUrl) cb(formatReply(`${VALIDATION_MESSAGE} a webhookUrl`));
	if (!pickupTime) cb(formatReply(`${VALIDATION_MESSAGE} a pickupTime`));
	if (!pickupAddress) cb(formatReply(`${VALIDATION_MESSAGE} a pickupAddress`));
	if (!deliveryAddress) cb(formatReply(`${VALIDATION_MESSAGE} a deliveryAddress`));
	let deliveryId = uuidv4();
	
	docClient.put({
		TableName: TABLE_NAME,
		Item: {
			deliveryId: deliveryId,
			webhookUrl: webhookUrl,
			pickupTime: pickupTime,
			pickupAddress: pickupAddress,
			deliveryAddress: deliveryAddress,
			deliveryStatus: 'REQUESTED'
		}
	}).promise().then(response => {

		let params = {
			stateMachineArn: DELIVERY_STEP_FUNCTION_ARN,
			input: `{"deliveryId": "${deliveryId}", "webhookUrl": "${webhookUrl}", "pickupAddress": "${pickupAddress}" , "deliveryAddress": "${deliveryAddress}"}`  
		};

		//TODO: check for promises
		stepfunctions.startExecution(params, function(err, data) { 
			if (err) {
				console.log(err, err.stack); 
				cb(formatReply(err))
				return;
			}
			console.log(data);
			cb(null, formatReply(null, data));
		});

	}).catch(err => {
		console.log(err);
		cb(formatReply(err));
	});
};

function formatReply(errorMessage, data) {
	let statusCode = errorMessage ? 400 : 200;
	let bodyData = errorMessage ? {message: errorMessage} : data;
	return {
		statusCode: statusCode,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(bodyData)
	};
}