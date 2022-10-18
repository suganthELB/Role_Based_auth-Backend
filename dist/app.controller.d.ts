import { AppService } from './app.service';
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from 'express';
export declare class AppController {
    private readonly appService;
    private jwtService;
    constructor(appService: AppService, jwtService: JwtService);
    register(name: string, email: string, password: string, is_admin: number): Promise<import("./user.entity").User>;
    login(email: string, password: string, response: Response): Promise<{
        message: string;
        user: import("./user.entity").User;
    }>;
    user(request: Request): Promise<{
        id: number;
        name: string;
        email: string;
        is_admin: number;
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}
