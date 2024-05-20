import { App } from "./app";
import { mongoDBConnection } from "./config/mongoDB";

class Server {
  private readonly app: App;

  constructor() {
    this.app = new App();
  }

  async start() {
    try {
      this.app.start();
      await mongoDBConnection();
      console.log("Server started successfully.");
    } catch (error) {
      console.error("Failed to start server:");
      process.exit(1);
    }
  }
}

const server = new Server();
server.start();
