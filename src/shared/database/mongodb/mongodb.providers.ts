import * as mongoose from 'mongoose';
import ora from 'ora';
import chalk from 'chalk';
import { ConfigService } from '../../config';

export const MongodbProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (config: ConfigService): Promise<typeof mongoose> => {
      const MONGO_URL = config.get('MONGO_URL');
      const spinner = ora({
        spinner: {
          interval: 300,
          frames: [
            'Connecting to database   ',
            'Connecting to database.  ',
            'Connecting to database.. ',
            'Connecting to database...',
          ],
        },
      }).start();
      try {
        const connection = await mongoose.connect(MONGO_URL);
        spinner.color = 'green';
        spinner.succeed(`Database connected ${chalk.green(`successfully!`)}`);

        mongoose.connection.on('connected', () => {
          console.log('MongoDB connected');
        });

        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
          console.log('MongoDB disconnected');
        });

        process.on('SIGINT', async () => {
          await mongoose.connection.close();
          console.log(
            'MongoDB connection closed due to application termination',
          );
          process.exit(0);
        });

        return connection;
      } catch (error) {
        spinner.fail(
          chalk.red(`Error connecting to the database: ${error.message}`),
        );
        throw error;
      }
    },
    inject: [ConfigService],
  },
];
