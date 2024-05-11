import mongoose, { ConnectOptions } from "mongoose";

mongoose.set("strictQuery", false);

/**
 * Database class to connect and disconnect from MongoDB
 * @param uri
 * @param options
 */
class Database {
  private uri: string;
  private options: ConnectOptions;

  constructor(uri: string, options: ConnectOptions) {
    this.uri = uri;
    this.options = options;
  }

  /**
   * Connect to MongoDB
  
   */
  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.uri, this.options);
      console.log(
        `Connected to database: ${mongoose.connection.db.databaseName}`
      );
    } catch (error) {
      throw error;
    }
  }


  /**
   * Disconnect from MongoDB
   */
  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log(
        `Disconnected from database: ${mongoose.connection.db.databaseName}`
      );
    } catch (error) {
      throw error;
    }
  }
}

export default Database