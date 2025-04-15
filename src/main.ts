import { NestFactory } from "@nestjs/core";
import { setup } from "./setup";
import { AppModule } from "./app.module";
import { ConsoleLogger } from "@nestjs/common";
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
      colors: true,
    }),
  });
  setup(app);
  await app.listen(process.env.PORT ?? 3000);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (module.hot) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    module.hot.accept();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
