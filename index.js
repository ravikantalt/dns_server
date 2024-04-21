const dgram= require('dgram')
const dnsPacket = require('dns-packet');

const server = dgram.createSocket('udp4');

const db ={
    'piyushgarg.dev':{
        type: 'A',
        data: '1.2.3.4'

    },
    'blog.piyushgrag.dev':{
        type:'A',
        data: '4.5.6.7'
    }
}

server.on('message',(msg,rinfo)=>{
    const incomingReq = dnsPacket.decode(msg);
    const ipFromDb = db[incomingReq.questions[0].name];
    const ans = dnsPacket.encode({
        type: 'query',
        id: incomingReq.id,
        flags: dnsPacket.AUTHORITATIVE_ANSWER,
        questions:incomingReq.questions,
        answers:[{
            type:'A',
            class:'IN',
            name: incomingReq.questions[0].name,
            data: ipFromDb
        }]

    })
    server.send(ans,rinfo.port,rinfo.address)
})

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`Server is listening on ${address.address}:${address.port}`);
});

server.bind(52,()=> console.log("DNS Server is running on port 52"))