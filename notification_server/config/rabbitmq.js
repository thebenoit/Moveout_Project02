import amqp from "amqplib";

class RabbitMQConnection {
  constructor() {
    this.connection = null;
    this.channels = new Map(); //pour stocker plusieurs channels
    this.url = process.env.RABBITMQ_URI;
    this.isReconnecting = false;

    this.exchange = {
      notification: {
        name: "notification.exchange",
        type: "direct",
        options: { durable: true },
      },
      dlx: {
        name: "notification.dlx",
        type: "direct",
        options: { durable: true },
      },
    };

    this.queues = {
      notification: {
        name: "notification.queue",
        options: {
          durable: true,
          arguments: {
            "x-dead-letter-exchange": "notification.dlx",
            "x-dead-letter-routing-key": "notification.dead",
            "x-message-ttl": 30000, // 30 secondes
            "x-max-length": 1000, // Limite de 10000 messages
            "x-max-priority": 10, //support des priorités
          },
        },
      },
      dead: {
        name: "notification.dead.queue",
        options: { durable: true },
      },
    };
  }

  async connect() {
    try {
      if (!this.connection) {
   
    
        //Établir la connexion avec des options de heartbeat
        this.connection = await amqp.connect(this.url, {
          heartbeat: 60, // Heartbeat toutes les 60 secondes
          timeout: 60000, // Timeout de connexion à 60 secondes
          connectionTimeout: 30000,
          keepAlive: true,
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
        await this.setupExchangesAndQueues();
      }
      console.log("✅ Connecté à RabbitMQ");
      return this.connection;
    } catch (error) {
      console.error("❌ Erreur de connexion RabbitMQ:", error);
      // Réessayer dans 5 secondes
      setTimeout(() => this.connect(), 5000);
    }
  }

  async setupExchangesAndQueues() {
    console.log("👷‍♂️ Configuration des exchanges et queues...");
    try {
      const channel = await this.createChannel("setup");

      //Création des exchanges
      await channel.assertExchange(
        this.exchange.notification.name,
        this.exchange.notification.type,
        this.exchange.notification.options
      );

      await channel.assertExchange(
        this.exchange.dlx.name,
        this.exchange.dlx.type,
        this.exchange.dlx.options
      );

      // Création des queues
      await channel.assertQueue(
        this.queues.notification.name,
        this.queues.notification.options
      );

      await channel.assertQueue(
        this.queues.dead.name,
        this.queues.dead.options
        
      );

      //Binding des queues aux exchange
      await channel.bindQueue(
        this.queues.notification.name,
        this.exchange.notification.name,
        "notification.routing"
      );

      await channel.bindQueue(
        this.queues.dead.name,
        this.exchange.dlx.name,
        "notification.dead"
      );

      console.log("✅ Exchanges et queues créés et liés");
    } catch (error) {
      console.error("Erreur de configuration des exchanges et queues", error);
      throw error;
    }
  }

  async publishMessage(message, options = {}) {
    try {
      const channel = await this.getChannel("publisher");

      const messageOptions = {
        persistent: true,
        priority: options.priority || 0,
        headers: {
          "x-retry-count": 0,
          "x-first-death-reason": "",
          "x-first-death-queue": "",
          timestamp: new Date().toISOString(),
        },
        ...options,
      };
      return await channel.publish(
        this.exchange.notification.name,
        "notification.routing",
        Buffer.from(JSON.stringify(message)),
        messageOptions
      );
    } catch (err) {
      console.error("Erreur de publication du message", err);
      throw err;
    }
  }

  async consumeMessages(queueName, callback) {
    try {
      const channel = await this.getChannel("consumer");

      await channel.consume(queueName, async (msg) => {
        try {
          await callback(msg);
          channel.ack(msg);
        } catch (error) {
          const retryCount = (msg.properties.headers["x-retry-count"] || 0) + 1;

          if (retryCount <= 3) {
            //Republuer avec retry count incrémenté
            const retryMessage = {
              ...JSON.parse(msg.content.toString()),
              headers: {
                ...msg.properties.headers,
                "x-retry-count": retryCount,
              },
            };
            //Délai exponentiel
            const delay = Math.pow(2, retryCount) * 1000;

            setTimeount(() => {
              this.publishMessage(retryMessage);
            }, delay);

            channel.ack(msg);
          } else {
            //Rejeter définitivement vers DLQ
            channel.reject(msg, false);
          }
        }
      });
    } catch (err) {
      console.error("Erreur de consommation du message", err);
      throw err;
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
    console.log("🫡reconnexion en cours...");
    try {
      this.isReconnecting = true;

      await new Promise((resolve) => setTimeout(resolve, 5000));

      //tenter une nouvelle connexion
      await this.connect();

      for (const [channelId, channel] of this.channels.entries()) {
        console.log("🫡reconnexion en cours pour le canal", channelId);
        await this.createChannel(channelId);
      }

      console.log("🫡reconnexion terminée");
    } catch (error) {
      console.log("erreur durant la reconnexion");
    } finally {
      this.isReconnecting = false;
    }

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
