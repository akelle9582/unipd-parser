import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as http from 'http';
import * as fs from 'fs';
import * as readline from 'readline';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: true });

  var lineReader = readline.createInterface({
    input: fs.createReadStream('./list.txt')
  });
  
  lineReader.on('line', function (line) {
    setInterval(function () {
      http.get(line);
    }, 300000); // every 5 minutes (300000)
  
  });

  await app.listen(process.env.PORT || 3331);
}
bootstrap();
