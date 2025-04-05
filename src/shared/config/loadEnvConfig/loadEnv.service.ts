import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { writeFileSync } from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

// Service to manage DB configs
@Injectable()
export class DbConfigService {
  constructor(@InjectConnection() private connection: Connection) {}

  async fetchConfigurations() {
    try {
      const db = this.connection.useDb('app_settings', { useCache: true });

      const configs = await db.collection('app_prefiin').find({}).toArray();

      return configs.map((config) => ({
        key: config.key,
        value: config.value,
      }));
    } catch (error) {
      console.error('Error fetching configurations:', error);
      return [];
    }
  }
}

@Injectable()
export class EnvConfigLoaderService implements OnApplicationBootstrap {
  constructor(private dbConfigService: DbConfigService) {}

  async onApplicationBootstrap() {
    console.log(
      'Application fully bootstrapped, now loading configurations...',
    );
    await this.loadAndSaveEnvFile();
  }

  async loadAndSaveEnvFile() {
    try {
      console.log('Loading configuration from database...');

      const dbConfigs = await this.dbConfigService.fetchConfigurations();
      let envContent = '';

      for (const config of dbConfigs) {
        envContent += `${config.key}=${config.value}\n`;
      }

      const envPath = path.resolve(
        process.cwd(),
        `./environment/${process.env.NODE_ENV}.env`,
      );

      writeFileSync(envPath, envContent);

      console.log('Configuration loaded and saved to .env file successfully');

      // Reload environment variables
      dotenv.config();

      return { success: true, message: 'Environment loaded successfully' };
    } catch (error) {
      console.error('Failed to load configuration from database:', error);
      throw error;
    }
  }
}
