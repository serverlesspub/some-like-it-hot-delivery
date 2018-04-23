
exports.handler = (event, context, callback) => {
	console.log('delivery from Step Functions received');
    console.log(event)
    callback(null, {});
};