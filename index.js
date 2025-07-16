const mysql = require('mysql2/promise');
const fastify = require('fastify')({ logger: { level: 'error' }, trustProxy: true });
const PORT = process.env.PORT || 3000;

const db = mysql.createPool({
  host: '65.0.91.65',
  port: 3307,
  user: 'mysql',
  password: '01986847f703df146e88',
  database: 'comuno',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

fastify.register(require('@fastify/cors'));

fastify.get('/', (req, reply) => {
  return { message: 'Hello from Roshan' };
});

fastify.get('/health', (req, reply) => {
  return 'OK';
});

fastify.post('/api/:type', async (req, reply) => {
  const { type } = req.params;
  const validTypes = ['incomingCall', 'outgoingCall', 'callRecording'];

  if (!validTypes.includes(type)) {
    return reply.status(400).send({
      status: 'error',
      message: 'Invalid event type',
    });
  }

  const data = req.body;

  try {
    const query = 'INSERT INTO call_logs (type, data) VALUES (?, ?)';
    const [result] = await db.query(query, [type, JSON.stringify(data)]);

    return {
      status: 'success',
      message: `${type} event stored successfully`,
      id: result.insertId,
    };
  } catch (err) {
    fastify.log.error('Database Insert Error:', err);
    return reply.status(500).send({
      status: 'error',
      message: 'Database error',
    });
  }
});

const start = async () => {
  try {
    await fastify.listen({
      host: '0.0.0.0',
      port: PORT,
    });
    console.log(`Server listening on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();