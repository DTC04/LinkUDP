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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const profile_service_1 = require("./profile.service");
const update_user_profile_dto_1 = require("./dto/update-user-profile.dto");
const update_tutor_specific_profile_dto_1 = require("./dto/update-tutor-specific-profile.dto");
const view_user_profile_dto_1 = require("./dto/view-user-profile.dto");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const public_decorator_1 = require("../auth/public.decorator");
let ProfileController = class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    async getMyProfile(user) {
        if (!user?.id) {
            throw new common_1.UnauthorizedException('ID de usuario no encontrado en el token');
        }
        return this.profileService.getMyProfile(user.id);
    }
    async updateUserProfile(user, dto) {
        if (!user?.id) {
            throw new common_1.UnauthorizedException('ID de usuario no encontrado en el token');
        }
        await this.profileService.updateUserProfile(user.id, dto);
        return this.profileService.getMyProfile(user.id);
    }
    async updateTutorSpecificProfile(user, dto) {
        if (!user?.id) {
            throw new common_1.UnauthorizedException('ID de usuario no encontrado en el token');
        }
        if (user.role !== client_1.Role.STUDENT &&
            user.role !== client_1.Role.TUTOR &&
            user.role !== client_1.Role.BOTH) {
            console.warn(`Usuario con ID ${user.id} y rol ${user.role} intentó acceder a updateTutorSpecificProfile.`);
            throw new common_1.ForbiddenException('Tu rol actual no permite realizar esta acción.');
        }
        console.log(`User ID: ${user.id} con Rol: ${user.role} está actualizando/creando perfil de tutor.`);
        await this.profileService.updateTutorSpecificProfile(user.id, dto);
        return this.profileService.getMyProfile(user.id);
    }
    async getPublicTutorProfile(tutorId) {
        const tutorProfile = await this.profileService.getPublicTutorProfileById(tutorId);
        if (!tutorProfile || !tutorProfile.user) {
            throw new common_1.NotFoundException('Perfil de tutor no encontrado o datos de usuario incompletos.');
        }
        if (tutorProfile.user.role !== client_1.Role.TUTOR && tutorProfile.user.role !== client_1.Role.BOTH) {
            throw new common_1.NotFoundException('Este usuario no es un tutor o no tiene un perfil de tutor público.');
        }
        return tutorProfile;
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el perfil del usuario autenticado' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil del usuario obtenido exitosamente.',
        type: view_user_profile_dto_1.ViewUserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado.' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Actualizar el perfil básico del usuario autenticado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil básico actualizado.',
        type: view_user_profile_dto_1.ViewUserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_profile_dto_1.UpdateUserProfileDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateUserProfile", null);
__decorate([
    (0, common_1.Patch)('me/tutor'),
    (0, swagger_1.ApiOperation)({
        summary: 'Crear o actualizar la información específica del perfil de tutor del usuario autenticado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil de tutor creado/actualizado exitosamente.',
        type: view_user_profile_dto_1.ViewUserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'El rol actual del usuario no permite esta acción.',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_tutor_specific_profile_dto_1.UpdateTutorSpecificProfileDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateTutorSpecificProfile", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('tutor/:tutorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el perfil público de un tutor por ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil público del tutor obtenido exitosamente.',
        type: view_user_profile_dto_1.ViewUserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tutor no encontrado.' }),
    __param(0, (0, common_1.Param)('tutorId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getPublicTutorProfile", null);
exports.ProfileController = ProfileController = __decorate([
    (0, swagger_1.ApiTags)('profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map