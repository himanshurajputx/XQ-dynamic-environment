import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from '@hapi/joi';

type EnvConfig = {
  [key: string]: string;
};

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string().valid('development', 'production', 'test'),
      // .default('dev'),
      MONGO_URL: Joi.string(),
      PORT: Joi.number(),
      URL: Joi.string(),
      APP_SECRET: Joi.string(),
      JWT_VERIFICATION_TOKEN_SECRET: Joi.string(),
      JWT_SECRET_KEY: Joi.string(),
      JWT_EXPIRES_IN: Joi.string(),
      SECRET_ACCESS_KEY: Joi.string(),
      TWILIO_ACCOUNT_SID: Joi.string(),
      TWILIO_AUTH_TOKEN: Joi.string(),
      TWILIO_PHONE_NUMBER: Joi.string(),
      AWS_S3_BUCKET: Joi.string(),
      AWS_ACCESS_KEY: Joi.string(),
    });

    let error: Joi.ValidationError | undefined, validatedEnvConfig: any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,prefer-const
    ({ error, value: validatedEnvConfig } = envVarSchema.validate(envConfig));

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return validatedEnvConfig;
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
