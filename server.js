const io = require('socket.io-client');
const fs = require('fs');
var config = require('./config.json');
var HttpProxyAgent = require('http-proxy-agent');


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
else if (process.argv.length > 2 && typeof process.argv[2] != 'undefined' && process.argv[2] == 'pi') {
	var isDev = false;
	let p = 'http://192.168.49.1:8000';
	let agent = new HttpProxyAgent(p);
	var conn_options = {
		'sync disconnect on unload':false,
		agent: agent
	};
	console.log(`ws://${config.server_dev}:80 via proxy`);
	var socket = io(`ws://${config.server_dev}:80`, conn_options);
}
else {
	var isDev = false;
	var conn_options = {
		'sync disconnect on unload':false
	};
	console.log(`ws://${config.server_prod}:80`);
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
					output = {
						success: true,
						channel: data.channel,
						message: `success!`,
						data: data
					};
					switch (data.command) {
						//-----------------------------------------------------------------------------
						// zap
						//-----------------------------------------------------------------------------
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
						//-----------------------------------------------------------------------------
						// vibe
						//-----------------------------------------------------------------------------
						case 'vibe':
							// handle max values for power and time
							if(data.power > config.commandOptions.vibe.powerLimit) {
								data.power = config.commandOptions.vibe.powerLimit;
							}
							if(data.time > config.commandOptions.vibe.timeLimit) {
								data.time = config.commandOptions.vibe.timeLimit;
							}
							if(!isDev){
								const pythonProcess = spawn('python',["./transmit.py", config.commandOptions.vibe.transmitMode, data.power, data.time, config.commandOptions.vibe.defaultChannel]);
								pythonProcess.stdout.on('data', function(data) {
									console.log(data.toString());
								});
							}
							else {
								console.log("Dev...python script disabled...");
							}
							break;
						//-----------------------------------------------------------------------------
						// trust
						//-----------------------------------------------------------------------------
						case 'trust':
							switch (data.method) {
								case 'add':
									output.message = `Adding ${data.username.split('#')[0]} to ${data.initUser.split('#')[0]}'s trusted list.`;
									addTrustedUser(data.username);
									break;
								case 'remove':
									output.message = `Removing ${data.username.split('#')[0]} from ${data.initUser.split('#')[0]}'s trusted list.`;
									removeTrustedUser(data.username);
									break;
								case 'list':
									output.message = `${data.initUser.split('#')[0]}'s trusted users:`;
									for (var i = 0; i < config.trustedUsers.length; i++) {
										output.message += `\n${config.trustedUsers[i].split('#')[0]}`
									}
									break;
								default:

							}
							break;
						//-----------------------------------------------------------------------------
						// limit
						//-----------------------------------------------------------------------------
						case 'limit':
							switch (data.method) {
								case 'zap':
									output.message = `Setting ${data.initUser.split('#')[0]}'s zap limit to ${data.time} seconds @ ${data.power}%.`;
									setZapLimits(data.time, data.power);
									break;
								case 'vibe':
									output.message = `Setting ${data.initUser.split('#')[0]}'s vibe limit to ${data.time} seconds @ ${data.power}%.`;
									setVibeLimits(data.time, data.power);
									break;
								default:

							}
							break;
						default:
					}

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

// ----------------------------------------------------------------------------
// --------------------------- [private methods] ------------------------------
// ----------------------------------------------------------------------------
function addTrustedUser(username) {
	if(config.trustedUsers.indexOf(username) === -1) {
		// only add the user if it's not already there
		config.trustedUsers.push(username);
		saveConfig();
	}
}

function removeTrustedUser(username) {
	var index = config.trustedUsers.indexOf(username);
	if(index !== -1) {
		// only remove the user if they are already there
		config.trustedUsers.splice(index, 1);
		saveConfig();
	}
}

function setZapLimits(time, power) {
	config.commandOptions.zap.timeLimit = time;
	config.commandOptions.zap.powerLimit = power;
	saveConfig();
}

function setVibeLimits(time, power) {
	config.commandOptions.vibe.timeLimit = time;
	config.commandOptions.vibe.powerLimit = power;
	saveConfig();
}

function saveConfig() {
	var json = JSON.stringify(config, null, 2);
	fs.writeFile('./config.json', json, 'utf8', () => {
		console.log('Config update finished.');
	});
}
