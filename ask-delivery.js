
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const docClient = new AWS.DynamoDB.DocumentClient()
const stepfunctions = new AWS.StepFunctions();

exports.handler = (event, context, callback) => {
	console.log('request received');
	let deliveryRequest = JSON.parse(event.body);

	let deliveryId = uuidv4();

	let params = {
		stateMachineArn: process.env.DELIVERY_STEP_FUNCTION,
		input: `{"deliveryId": "${deliveryId}"}`  
	};

	//TODO: do something with docClient

	stepfunctions.startExecution(params, function(err, data) { 
			if (err) {
				console.log(err, err.stack); 
				callback(err, {status: 400, headers: 'application/json', body: JSON.stringify('success') })
				return;
			}
			console.log(data);
			callback(null, {status: 200, body: JSON.stringify('success')});
		});
};
