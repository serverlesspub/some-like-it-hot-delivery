const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;
const VALIDATION_MESSAGE = `You haven't provided `;

exports.handler = (event, context, cb) => {
    
    let orderId = event.pathParameters.orderId;
	if (!orderId) cb(formatReply(`${VALIDATION_MESSAGE} a orderId`));

	docClient.delete({
		TableName: TABLE_NAME,
		Key: {
			deliveryId: orderId
		}
	}).promise().then(response => {
		cb(null, formatReply(null, {}));
	}).catch(err => {
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