import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { ForbiddenException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        private readonly jwt: JwtService,
    ) { }

    async register(dto: CreateCustomerDto) {
        const existing = await this.users.findOne({ where: { email: dto.email.toLowerCase() } });
        if (existing) throw new ConflictException('An account with this email already exists.');
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.users.save(
            this.users.create({
                email: dto.email.toLowerCase(),
                passwordHash,
                role: 'customer',
                name: dto.name,
                phone: dto.phone,
            }),
        );

        return {
            accessToken: await this.jwt.signAsync({
                sub: user.id,
                email: user.email,
                role: user.role,
            }),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        };
    }

    async login(dto: CustomerLoginDto) {
        const user = await this.users.findOne({ where: { email: dto.email.toLowerCase() } });
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Invalid email or password');
        if (user.role !== 'customer') throw new ForbiddenException('Access denied. This login is for customers only.');

        return {
            accessToken: await this.jwt.signAsync({
                sub: user.id,
                email: user.email,
                role: user.role,
            }),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        };
    }

    async updateProfile(userId: number, dto: UpdateProfileDto) {
        const user = await this.users.findOne({ where: { id: userId } });
        if (!user) throw new UnauthorizedException('User not found');


        if (dto.email && dto.email.toLowerCase() !== user.email) {
            const existing = await this.users.findOne({
                where: { email: dto.email.toLowerCase() },
            });
            if (existing) {
                throw new ConflictException('Email is already in use.');
            }
            user.email = dto.email.toLowerCase();
        }

        if (dto.name) user.name = dto.name;
        if (dto.phone) user.phone = dto.phone;
        if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, 12);
        await this.users.save(user);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };
    }

    async getProfile(userId: number) {
        const user = await this.users.findOne({ where: { id: userId } });
        if (!user) throw new UnauthorizedException('User not found');

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };
    }
}