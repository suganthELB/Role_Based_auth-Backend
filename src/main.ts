//generate the backend port and pass the cookies
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as cookieParser from "cookie-parser";
//design function
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.use(cookieParser());
    await app.listen(8082);
}
bootstrap();