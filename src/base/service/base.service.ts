import { HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { LoggerService } from "../logger/logger.service";

@Injectable()
export class BaseService<T> {
    protected entityName: string = "Entity";

    constructor(
        protected readonly repository,
        protected readonly logger: LoggerService,
    ){}

    async actionPreCreate(dto: Partial<T>) {
        return dto;
    }

    async actionPostCreate(record: T) {
        const recordId = record['id']; 
        this.logger.log(`Request for create ${this.entityName} with ID: ${recordId}`);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved success",
            "data": instanceToPlain(record)
        }
    }

    async create(dto: Partial<T>): Promise<any>{
        try {
            const handleDto = await this.actionPreCreate(dto);
            const record = await this.repository.save(handleDto);
            return await this.actionPostCreate(record);
        } catch (error) {
            this.logger.error(`Failed to create ${this.entityName}! `, error);
            throw new InternalServerErrorException(`Failed to create ${this.entityName}!`);
        }
    }

    async actionPreList(dto: any) {
        return dto;
    }

    async actionPostList(records: T[]) {
        this.logger.log(`Request for get list ${this.entityName}!`)

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved success",
            "data": instanceToPlain(records)
        }
    }

    async getList(dto: any): Promise< any > {
        try {
            const handleDto = await this.actionPreList(dto);
            const records = await this.repository.find(handleDto);
            return this.actionPostList(records);
        } catch (error) {
            this.logger.error(`Failed to get list ${this.entityName}! `, error);
            throw new InternalServerErrorException(`Failed to get list ${this.entityName}!`);
        }
    }

    async actionPreDetail(id: number) {
        return id;
    }

    async actionPostDetail(record: T) {
        const recordId = record['id']; 
        this.logger.log(`Request for get detail ${this.entityName} with ID: ${recordId}`);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved success",
            "data": instanceToPlain(record)
        }
    }

    async getDetail(id: number): Promise<any> {
        try {
            const handleId = await this.actionPreDetail(id);
            const record = await this.repository.findOneBy({id: handleId});
            return this.actionPostDetail(record);
        } catch (error) {
            this.logger.error(`Failed to get detail ${this.entityName}! `, error);
            throw new InternalServerErrorException(`Failed to get detail ${this.entityName}!`);
        }
    }

    async actionPreUpdate(id: number, dto: Partial<T>) {
        return dto;
    }

    async actionPostUpdate(record: T) {
        const recordId = record['id']; 
        this.logger.log(`Request for update ${this.entityName} with ID: ${recordId}`);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved success",
            "data": instanceToPlain(record)
        }
    }

    async update(id: number, dto: Partial<T>): Promise<any> {
        try {
            const handleDto = await this.actionPreUpdate(id, dto);
            await this.repository.update({id: id}, handleDto);
            const updatedRecord = await this.repository.findOneBy({ id: id });
            return this.actionPostUpdate(updatedRecord);
        } catch (error) {
            this.logger.error(`Failed to update ${this.entityName}! `, error);
            throw new InternalServerErrorException(`Failed to update ${this.entityName}!`);
        }
    }

    async actionPreDelete(id: number) {
        return id;
    }

    async actionPostDelete(id: number) {
        this.logger.log(`Request for create ${this.entityName} with ID: ${id}`);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved success"
        }
    }

    async delete(id: number) {
        try {
            const handleId = await this.actionPreDelete(id);
            await this.repository.delete(handleId);
            return this.actionPostDelete(id);
        } catch (error) {
            this.logger.error(`Failed to delete ${this.entityName}! `, error);
            throw new InternalServerErrorException(`Failed to delete ${this.entityName}!`);
        }
    }
}