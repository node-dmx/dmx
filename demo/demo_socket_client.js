import io from 'socket.io-client'

const port = 17809;
const client = io(`http://localhost:${port}`);

client.on('update', (msg) => console.info(msg));
