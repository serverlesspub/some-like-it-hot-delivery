
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const docClient = new AWS.DynamoDB.DocumentClient()
const stepfunctions = new AWS.StepFunctions();
const TABLE_NAME = process.env.TABLE_NAME;
const DELIVERY_STEP_FUNCTION_ARN = process.env.DELIVERY_STEP_FUNCTION;

exports.handler = (event, context, callback) => {
	console.log('request received');
	let deliveryRequest = JSON.parse(event.body);

	let webhook = deliveryRequest.webhook || 'https://3w99bhuswd.execute-api.eu-central-1.amazonaws.com/latest/character';
	let address = deliveryRequest.address;
	let deliveryId = uuidv4();


	//TODO: validation of parameters

	console.log(deliveryRequest);

	docClient.putItem({
		TableName: TABLE_NAME,
		Item: {
			deliveryId: deliveryId,
			webhook: webhook,
			address: address,
			status: ''
		}
	}).promise().then(response => {

		let params = {
			stateMachineArn: DELIVERY_STEP_FUNCTION_ARN,
			input: `{"deliveryId": "${deliveryId}", "webhook": "${webhook}"}`  
		};

		//TODO: check for promises
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

	}).catch(err => {
		callback(err, {
			statusCode: 400, 
			headers: {
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify(`{ "message": ${err}}`)
		});
	});
};
