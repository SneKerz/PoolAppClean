const express = require('express');
const app = express();
app.use(express.json()); // Required to parse JSON in request body

// Data
let clients = [
  {
    id: '1',
    name: 'Client 1',
    phoneNumber: '+123456789',
    address: '123 Fake St, City, Country',
    poolSize: '40',
    interventions: []
  },
  {
    id: '2',
    name: 'Client 2',
    phoneNumber: '+987654321',
    address: '456 Real Ave, City, Country',
    poolSize: '60',
    interventions: []
  }
];
let interventions = [
  {
    id: '1',
    clientId: '1',
    date: '01.02.2023',
    clorRapid: 0.5,
    clorLent: 1,
    pH: 3.2,
    antialgic: 2,
    floculant: 0.2,
    calzestab: 1.2
  },
  {
    id: '2',
    clientId: '1',
    date: '01.12.2023',
    clorRapid: 0.5,
    clorLent: 1,
    pH: 3.2,
    antialgic: 2,
    floculant: 0.2,
    calzestab: 1.2
  },
  {
    id: '3',
    clientId: '1',
    date: '11.02.2023',
    clorRapid: 0.5,
    clorLent: 1,
    pH: 3.2,
    antialgic: 2,
    floculant: 0.2,
    calzestab: 1.2
  }
];

// Routes

app.get('/clients', (req, res) => {
  res.json(clients);
});

app.get('/interventions', (req, res) => {
  res.json(interventions);
});

app.get('/interventions/:clientId', (req, res) => {
  const clientId = req.params.clientId;
  const client = clients.find(c => c.id === clientId);

  if (client) {
    const clientInterventions = interventions.filter(i => i.clientId === clientId);
    res.json(clientInterventions);
  } else {
    res.status(404).json({ error: 'Client not found' });
  }
});


app.post('/clients', (req, res) => {
  const newClient = {
    id: (clients.length + 1).toString(),
    ...req.body
  };
  clients.push(newClient);
  res.status(201).json(newClient);
});

app.post('/interventions', (req, res) => {
  const newIntervention = {
    id: (interventions.length + 1).toString(),
    clientId: req.body.clientId,
    ...req.body
  };
  interventions.push(newIntervention);

  const client = clients.find(c => c.id === req.body.clientId);
  if (client) {
    client.interventions.push(newIntervention);
    res.status(201).json(newIntervention);
  } else {
    res.status(404).json({ error: 'Client not found' });
  }
});

app.listen(3000, () => {
  console.log('API server is running on http://localhost:3000');
});