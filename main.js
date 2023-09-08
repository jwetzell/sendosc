#!/usr/bin/env node

const { Option, program } = require('commander');
const osc = require('osc-min');
const dgram = require('dgram');
const net = require('net');
const packageInfo = require('./package.json');

function argsProcessor(argString, argsArray) {
  const cleanArg = {
    type: 'string',
    value: argString,
  };

  if (!Number.isNaN(argString * 1)) {
    cleanArg.value = argString * 1;
    if (argString.includes('.')) {
      cleanArg.type = 'float';
    } else {
      cleanArg.type = 'integer';
    }
  } else if (cleanArg.value === 'true') {
    cleanArg.type = 'boolean';
    cleanArg.value = true;
  } else if (cleanArg.value === 'false') {
    cleanArg.type = 'boolean';
    cleanArg.value = false;
  }

  argsArray.push(cleanArg);
  return argsArray;
}

program.name(packageInfo.name);
program.version(packageInfo.version);
program.description('simple util to sendosc');
program.addOption(new Option('-p,--protocol <protocol>', 'Network protocol').choices(['tcp', 'udp']).default('udp'));
program.argument('host', 'the host to send osc to');
program.argument('port', 'the port to send osc to');
program.argument('address', 'OSC address');
program.argument('[args...]', 'optional OSC arguments', argsProcessor, []);
program.action((host, port, address, args, options) => {
  const oscMsgBuffer = osc.toBuffer({
    address,
    args,
  });

  if (options.protocol === 'tcp') {
    const client = net.Socket();
    client.on('error', (error) => {
      console.error(error);
    });
    client.connect(port, host, () => {
      client.write(oscMsgBuffer, () => {
        client.destroy();
      });
    });
  } else if (options.protocol === 'udp') {
    const client = dgram.createSocket('udp4');
    client.send(oscMsgBuffer, port, host, (error) => {
      if (error) {
        console.error(error);
      }
      client.close();
    });
  }
});
program.parse();
