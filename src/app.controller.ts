// All api calls here, store the datas and generate the cookies in jwt
import {BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException} from '@nestjs/common';
import {AppService} from './app.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {Response, Request} from 'express';

@Controller('api')
//jwt service calling app service methods
export class AppController {
    constructor(
        private readonly appService: AppService,
        private jwtService: JwtService
    ) {
    }
//store the user or admin details in database
    @Post('register')
    async register(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
        @Body('is_admin') is_admin: number
    ) {
        //hash is to encrypt the password
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await this.appService.create({
            name,
            email,
            password: hashedPassword,
            is_admin
        });

        delete user.password;

        return user;
    }
//Api call for Login
    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({passthrough: true}) response: Response
    ) {
        const user = await this.appService.findOne({email});
        //if the user credintials are not matched, invalid credentials message will display in console
        if (!user) {
            throw new BadRequestException('invalid credentials');
        }
        // if the user password not matched,invalid credentials message will display in console
        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('invalid credentials');
        }
        // else the user credintials if matched it will display success message in console
        const jwt = await this.jwtService.signAsync({id: user.id});

        response.cookie('jwt', jwt, {httpOnly: true});
        
        return {
            message: 'success',
            user
        };
    }
//get the user data and generate the cookies in backend
    @Get('user')
    async user(@Req() request: Request) {
        try {
            const cookie = request.cookies['jwt'];

            const data = await this.jwtService.verifyAsync(cookie);
           //if the user credintials invalid from database, unauthorized message will display in console
            if (!data) {
                throw new UnauthorizedException();
            }

            const user = await this.appService.findOne({id: data['id']});

            const {password, ...result} = user;

            return result;
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
//logout button to clear the cookies in jwt
    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('jwt');

        return {
            message: 'success'
        }
    }
}