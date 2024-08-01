const Logs = require("../schemas/logs");


async function createLog(log, error) {
    // message is an object, so you can put anything you want
    // error is the code of the error

	try {
		// Create log
		const newLog = new Logs({
            message: log,
            error: error,
			date: Date.now()
		});

		const savedLog = await newLog.save();

        return savedLog._id.toString()
    } catch (error) {
		console.error(error);
		return { error: responses.errors.client.loginError };
	}
}


module.exports = createLog;