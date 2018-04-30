const rp = require('minimal-request-promise');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;
const IN_PROGRESS_STATUS = 'IN-PROGRESS';

exports.handler = (event, context, cb) => {
  console.log('delivery from Step Functions received');
  if (!event.deliveryId || !event.webhookUrl || !event.deliveryAddress) {
    let err = 'Delivery Id and/or webhookUrl and/or deliveryAddress not provided'
    console.log(event);
    cb({message: err});
  }

  docClient.update({
    TableName: TABLE_NAME,
    Key: {
      deliveryId: event.deliveryId
    },
    UpdateExpression: 'set deliveryStatus = :s',
    ExpressionAttributeValues: {
      ':s': IN_PROGRESS_STATUS
    },
    ReturnValues: 'UPDATED_NEW'
  }).promise().then(response => {
    console.log(response);
    let options = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        deliveryId: event.deliveryId,
        status: IN_PROGRESS_STATUS
      })
    };
    
    return rp.post(event.webhook, options);
  }).then(data => {
    console.log(data);
    cb(null, {});
  }).catch(err => {
    console.log(err);
    cb({message: JSON.stringify(err)});
  })
};