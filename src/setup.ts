import {
  ValidationPipe,
  HttpStatus,
  INestApplication,
  Logger,
  VersioningType,
} from "@nestjs/common";
import { useContainer } from "class-validator";
import * as cookieParser from "cookie-parser";
import * as compression from "compression";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { ConfigService, ResponseInterceptor } from "./shared";

export function setup(app: INestApplication): INestApplication {
  const logger = new Logger("Application Setup");

  try {
    // 1️⃣ Get configuration service
    const configService = app.get(ConfigService);
    const appSecret = configService.get("APP_SECRET");

    if (!appSecret) {
      throw new Error("APP_SECRET is not defined in environment variables");
    }

    // 2️⃣ Enable security middlewares
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "validator.swagger.io"],
            connectSrc: ["'self'", "http://localhost:4200"],
          },
        },
        crossOriginEmbedderPolicy: false,
      }),
    );

    app.use(compression());
    app.use(cookieParser(appSecret));

    // 3️⃣ CORS configuration
    const allowedOrigins = configService
      .get("ALLOWED_ORIGINS")
      ?.split(/\s*,\s*/)
      .filter(Boolean) || ["http://localhost:4200"];

    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
      credentials: true,
      exposedHeaders: ["Authorization"],
      maxAge: 86400, // 24 hours
    });

    // 4️⃣ Enable logging
    app.useLogger(logger);

    // 5️⃣ Set global prefix and API versioning
    app.setGlobalPrefix("api");
    app.enableVersioning({
      type: VersioningType.HEADER,
      header: "Version",
    });

    // 6️⃣ Global interceptors for error handling and response formatting
    // app.useGlobalInterceptors(new DatabaseErrorInterceptor());
    // app.useGlobalInterceptors(new ExceptionInterceptor());
    app.useGlobalInterceptors(new ResponseInterceptor());

    // 7️⃣ Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // 8️⃣ Set up dependency injection for custom validators
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    logger.log("✅ Application setup completed successfully");
    return app;
  } catch (error) {
    logger.error(
      `❌ Error during application setup: ${error.message}`,
      error.stack,
    );
    throw error;
  }
}
