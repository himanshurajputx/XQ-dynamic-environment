import { Module } from "@nestjs/common";
import { AuthenticationModule } from "./authentication/authentication.module";
import { GatewayModule } from "./gateway/gateway.module";
import { LeadModule } from "./lead/lead.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [AuthenticationModule, GatewayModule, LeadModule, HealthModule],
  providers: [],
})
export class ComponentsModule {}
