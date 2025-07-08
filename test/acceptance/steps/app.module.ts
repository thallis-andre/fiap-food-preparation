import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PreparationSuite } from './step-definitions/preparation.suite';
@Module({
  imports: [HttpModule],
  providers: [PreparationSuite],
})
export class AppModule {}
