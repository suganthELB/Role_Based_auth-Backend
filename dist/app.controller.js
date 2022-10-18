"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AppController = class AppController {
    constructor(appService, jwtService) {
        this.appService = appService;
        this.jwtService = jwtService;
    }
    async register(name, email, password, is_admin) {
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
    async login(email, password, response) {
        const user = await this.appService.findOne({ email });
        if (!user) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        if (!await bcrypt.compare(password, user.password)) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        const jwt = await this.jwtService.signAsync({ id: user.id });
        response.cookie('jwt', jwt, { httpOnly: true });
        return {
            message: 'success',
            user
        };
    }
    async user(request) {
        try {
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            if (!data) {
                throw new common_1.UnauthorizedException();
            }
            const user = await this.appService.findOne({ id: data['id'] });
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        }
        catch (e) {
            throw new common_1.UnauthorizedException();
        }
    }
    async logout(response) {
        response.clearCookie('jwt');
        return {
            message: 'success'
        };
    }
};
__decorate([
    common_1.Post('register'),
    __param(0, common_1.Body('name')),
    __param(1, common_1.Body('email')),
    __param(2, common_1.Body('password')),
    __param(3, common_1.Body('is_admin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "register", null);
__decorate([
    common_1.Post('login'),
    __param(0, common_1.Body('email')),
    __param(1, common_1.Body('password')),
    __param(2, common_1.Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    common_1.Get('user'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "user", null);
__decorate([
    common_1.Post('logout'),
    __param(0, common_1.Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "logout", null);
AppController = __decorate([
    common_1.Controller('api'),
    __metadata("design:paramtypes", [app_service_1.AppService,
        jwt_1.JwtService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map