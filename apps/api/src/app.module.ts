import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PesquisaModule } from './modules/pesquisa/pesquisa.module';

@Module({
  imports: [PrismaModule, PesquisaModule],
})
export class AppModule {}
