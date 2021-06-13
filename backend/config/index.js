

// Container for all the environments
var environments = {};
environments.staging = {
	'port' : 5000,
	'envName' : 'staging',
	'defaultReservationDuration': 0100 // HHMM format
};

// Production environments
environments.production = {
	'port' : 5000,
	'envName' : 'production',
	'defaultReservationDuration': 0100 // HHMM format
};

// Check command-line arguments for environment
var currentEnvironment =
	typeof(process.env.NODE_ENV) == 'string'
	? process.env.NODE_ENV.toLowerCase()
	: '';

// Check currentEnvironment is defined
var environmentToExport =
	typeof(environments[currentEnvironment]) == 'object'
	? environments[currentEnvironment]
	: environments.staging;

// Export the module
module.exports = environmentToExport;
