
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
		input: `{"deliveryId": "${deliveryId}", "webhook": "https://3w99bhuswd.execute-api.eu-central-1.amazonaws.com/latest/character"}`  
	};

	//TODO: do something with docClient

	stepfunctions.startExecution(params, function(err, data) { 
			if (err) {
				console.log(err, err.stack); 
				callback(err, {
					statusCode: 400, 
					headers: {
						'Content-Type': 'application/json'
					}, 
					body: JSON.stringify(`{ "message": ${err}}`)
				})
				return;
			}
			console.log(data);
			callback(null, {
				statusCode: 200,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(`{ "message": "success" }`)
			});
		});
};
