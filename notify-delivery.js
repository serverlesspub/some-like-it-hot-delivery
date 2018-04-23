const rp = require('minimal-request-promise');

exports.handler = (event, context, callback) => {
	console.log('delivery from Step Functions received');
    console.log(event)

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