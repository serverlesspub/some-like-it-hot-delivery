const rp = require('minimal-request-promise');
const IN_PROGRESS_STATUS = 'IN-PROGRESS';

exports.handler = (event, context, cb) => {
  console.log('delivery from Step Functions received');
  if (!event.deliveryId || !event.webhook || !event.address) {
    let err = 'Delivery Id and/or webhook and/or address not provided'
    console.log(event);
    cb({message: err});
  }

  docClient.putItem({
    TableName: TABLE_NAME,
    Item: {
      deliveryId: event.deliveryId,
      webhook: event.webhook,
      address: event.address,
      status: IN_PROGRESS_STATUS
    }
  }).promise().then(response => {
    let options = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        deliveryId: event.deliveryId,
        status: IN_PROGRESS_STATUS
      })
    };
    return rp.post(event.webhook, options)
  }).then(data => {
    cb(null, {});
  });    
};