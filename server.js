const io = require('socket.io-client');
const config = require('./config.json');

// import python script
const spawn = require("child_process").spawn;

if(process.argv.length > 2 && typeof process.argv[2] != 'undefined' && process.argv[2] == 'dev') {
	var isDev = true;
	var conn_options = {
		'sync disconnect on unload':false
	};
	console.log(`ws://${config.server_dev}:80`);
	var socket = io(`ws://${config.server_dev}:80`, conn_options);
}
else {
	var isDev = false;
	var socket = io(`socket://${config.server_prod}:80`, conn_options);
}

socket.on('connect', () => {
	console.log("socket is open");
	// connect to server and set username
	let output = {
		username: config.username,
		commands: config.commands.join(),
		defaultChannel: config.defaultDiscordChannel,
		initWS: true
	};
	socket.emit('userconnect', JSON.stringify(output));
});

socket.on('message', dataStr => {
	console.log(dataStr);
	var validJSON = true;
	let data = {};
	let output = {};
	try {
		data = JSON.parse(dataStr);
	} catch (e) {
		// something went wrong, we don't have valid JSON!
		output = {
			success: false,
			channel: data.channel,
			message: `Invalid arguments`,
			data: data
		};
		socket.emit('message', JSON.stringify(output));
		validJSON = false;

	}
	if (validJSON) {
		if (data.connectionSuccess) {
			// first time connecting. don't return anything for now
		}
		else if (typeof data.command === 'undefined') {
			// something went wrong, we dont have a command
			output = {
				success: false,
				channel: data.channel,
				message: `Invalid arguments.`,
				data: data
			};
			socket.emit('message', JSON.stringify(output));
		}
		else {
			// check if the initiating user has permission to send commands
			let validUser = false;
			validUser = (config.trustedUsers.indexOf(data.initUser) !== -1);
			if(validUser) {
				// we have a valid user, now check supported commands
				if (config.commands.indexOf(data.command) !== -1) {
					// we have a valid command supported by the user
					switch (data.command) {
						case 'zap':
							// handle max values for power and time
							if(data.power > config.commandOptions.zap.powerLimit) {
								data.power = config.commandOptions.zap.powerLimit;
							}
							if(data.time > config.commandOptions.zap.timeLimit) {
								data.time = config.commandOptions.zap.timeLimit;
							}
							if(!isDev){
								const pythonProcess = spawn('python',["./transmit.py", config.commandOptions.zap.transmitMode, data.power, data.time, config.commandOptions.zap.defaultChannel]);
								pythonProcess.stdout.on('data', function(data) {
									console.log(data.toString());
								});
							}
						else {
							console.log("Dev...python script disabled...");
						}
							break;
						case 'vibrate':
							// handle max values for power and time
							if(data.power > config.commandOptions.vibrate.powerLimit) {
								data.power = config.commandOptions.vibrate.powerLimit;
							}
							if(data.time > config.commandOptions.vibrate.timeLimit) {
								data.time = config.commandOptions.vibrate.timeLimit;
							}
							if(!isDev){
								const pythonProcess = spawn('python',["./transmit.py", config.commandOptions.vibrate.transmitMode, data.power, data.time, config.commandOptions.vibrate.defaultChannel]);
								pythonProcess.stdout.on('data', function(data) {
									console.log(data.toString());
								});
							}
							else {
								console.log("Dev...python script disabled...");
							}
							break;
						default:
					}

					output = {
						success: true,
						channel: data.channel,
						message: `success!`,
						data: data
					};
					socket.emit('message', JSON.stringify(output));
				}
				else {
					// this user does not support the given command
					output = {
						success: false,
						channel: data.channel,
						message: `${data.username} does not support the ${data.command} command.`,
						data: data
					};
					socket.emit('message', JSON.stringify(output));
				}
			}
			else {
				// this user does not have permission to send commands
				output = {
					success: false,
					channel: data.channel,
					message: `${data.initUser.split('#')[0]} does not have permission to send ${data.username} commands.`,
					data: data
				};
				socket.emit('message', JSON.stringify(output));
			}

		}
	}

});
