const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gestion_requetes';

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*', // À restreindre en production
    methods: ['GET', 'POST']
  }
});

// Socket.io pour la messagerie interne en temps réel
io.on('connection', (socket) => {
  // Rejoindre une salle de requête
  socket.on('joinRequest', (requestId) => {
    socket.join(requestId);
  });

  // Envoyer un message dans une requête
  socket.on('newMessage', (data) => {
    // data doit contenir { requestId, message }
    io.to(data.requestId).emit('messageReceived', data.message);
  });

  // Quitter une salle
  socket.on('leaveRequest', (requestId) => {
    socket.leave(requestId);
  });
});

app.set('io', io); // Pour accéder à io dans les contrôleurs si besoin

mongoose.connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Serveur backend démarré sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erreur de connexion MongoDB:', err);
  });