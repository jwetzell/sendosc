#!/usr/bin/env node

const {Option, program} = require('commander');
const osc = require('osc-min')
const dgram = require('dgram')
const net = require('net')
const packageInfo = require('./package.json');

program.name(packageInfo.name)
program.version(packageInfo.version)
program.description('simple util to sendosc');
program.enablePositionalOptions()
program.addOption(new Option('-p,--protocol <protocol>','Network protocol').choices(['tcp','udp']).default('udp'))
program.argument('host', 'the host to send osc to')
program.argument('port', 'the port to send osc to')
program.argument('address', 'OSC address')
program.argument('args...', 'many arguments')
program.action((host,port,address,args,options,command)=>{

    const cleanArgs = args.map((argString)=>{
        let argType = 'string';

        let cleanValue = argString
        if(!isNaN(argString * 1)){
            cleanValue = argString * 1;
            if(argString.includes('.')){
                console.log('is number and contains a dot')
                argType = 'float'
            } else {
                argType = 'integer'
            }
        }else if(cleanValue === 'true' || cleanValue === 'false'){
            argType = 'boolean'
            cleanValue = JSON.parse(cleanValue)
        }else{
            cleanValue = argString
        }

        return {
            type: argType,
            value: cleanValue
        }
    })
    console.log(cleanArgs)

    const oscMsgBuffer = osc.toBuffer({
        address,
        args: cleanArgs
    })
    
    if(options.protocol === 'tcp'){
        const client = net.Socket()
        client.on('error',(error)=>{
            console.error(error)
        })
        client.connect(port,host,()=>{
            client.write(oscMsgBuffer,()=>{
                client.destroy()
            })
        })
    }else if(options.protocol === 'udp'){
        const client = dgram.createSocket('udp4')
        client.send(oscMsgBuffer,port,host,((error,bytes)=>{
            if(error){
                console.error(error)
            }
            client.close()
        }))
    }
})
program.parse()