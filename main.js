import {Option, program} from 'commander';
import osc from 'osc-min'
import dgram from 'dgram';
import net from 'net';

program.description('simple util to sendosc');
program.enablePositionalOptions()
program.addOption(new Option('-p,--protocol <protocol>','Network protocol').choices(['tcp','udp']).default('tcp'))
program.argument('host', 'the host to send osc to')
program.argument('port', 'the port to send osc to')
program.argument('address', 'OSC address')
program.argument('args...', 'many arguments')
program.action((host,port,address,args,options,command)=>{

    const oscMsgBuffer = osc.toBuffer({
        address,
        args
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