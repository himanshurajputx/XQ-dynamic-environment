import mongoose from 'mongoose';
import { DbConfigService, EnvConfigLoaderService } from './loadEnv.service';

export async function InitEnvironment() {
  // Connect manually first
  const connection = await mongoose
    .createConnection(
      'mongodb+srv://RFOneDB:UQGeGRsvmbqo1nsL@app-setting.gtnic6l.mongodb.net/?retryWrites=true&w=majority&appName=app-setting',
    )
    .asPromise();

  // Instantiate manually (outside of Nest context)
  const dbConfigService = new DbConfigService(connection);
  const envLoader = new EnvConfigLoaderService(dbConfigService);
  await envLoader.loadAndSaveEnvFile();
}
