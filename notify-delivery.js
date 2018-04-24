const rp = require('minimal-request-promise');

exports.handler = (event, context, callback) => {
	console.log('delivery from Step Functions received');
    console.log(event)

    //TODO: change status in the database that its in delivery and invoke the webhook from the delivery id,

    options = {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deliveryId: event.deliveryId
        })
      };

    rp.post(event.webhook, options)
        .then(data => {
            callback(null, {});
        })
};