import { Module } from "@nestjs/common";
import { AuthenticationModule } from "./authentication/authentication.module";
import { GatewayModule } from "./gateway/gateway.module";

@Module({
  imports: [AuthenticationModule, GatewayModule],
  providers: [],
})
export class ComponentsModule {}
