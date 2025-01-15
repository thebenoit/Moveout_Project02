import amqp from "amqplib";

class RabbitMQConnection {
  constructor() {
    this.connection = null;
    this.channels = new Map(); //pour stocker plusieurs channels
    this.url = process.env.RABBITMQ_URI;
  }

  async connect() {
    try {
      if (!this.connection) {
        // Établir la connexion avec des options de heartbeat
        this.connection = await amqp.connect(this.url, {
          heartbeat: 60, // Heartbeat toutes les 60 secondes
          timeout: 60000, // Timeout de connexion à 60 secondes
        });

        // Gérer la déconnexion
        this.connection.on("error", (err) => {
          console.error("RabbitMQ connection error:", err);
          this.reconnect();
        });

        this.connection.on("close", () => {
          console.warn(
            "RabbitMQ connection closed, attempting to reconnect..."
          );
          this.reconnect();
        });
      }
      console.log("✅ Connecté à RabbitMQ");
      return this.connection;
    } catch (error) {
      console.error("❌ Erreur de connexion RabbitMQ:", error);
      // Réessayer dans 5 secondes
      setTimeout(() => this.connect(), 5000);
    }
  }
  async createChannel(channelId) {
    try {
      if (!this.connection) {
        await this.connect();
      }
      const channel = await this.connection.createChannel();
      this.channels.set(channelId, channel);
      return channel;
    } catch (err) {
      console.error("Erreur de création du canal RabbitMQ:", err);
      throw err;
    }
  }

  async reconnect() {
    if (this.channels) {
      try {
        //fermer tous les channels
        await this.channels.forEach(async (channel) => {
          await channel.close();
        });
      } catch (error) {
        console.error("Erreur fermeture canal:", error);
      }
    }
    if (this.connection) {
      try {
        await this.connection.close();
      } catch (error) {
        console.error("Erreur fermeture connexion:", error);
      }
    }

    this.connection = null;
    this.channel = null;

    // Réessayer la connexion
    setTimeout(() => this.connect(), 5000);
  }

  getChannel(channelId) {
    if (this.channels.has(channelId)) {
      return this.channels.get(channelId);
    }
    return this.createChannel(channelId);
  }
}

export default new RabbitMQConnection();
