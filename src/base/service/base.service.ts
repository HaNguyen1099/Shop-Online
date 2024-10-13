import { HttpStatus, Injectable } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { LoggerService } from "../logger/logger.service";

@Injectable()
export class BaseService<T> {
    constructor(
        protected readonly repository,
        protected readonly logger: LoggerService,
    ){}

    async actionPreCreate(dto: Partial<T>) {
        return dto;
    }

    async actionPostCreate(record: T) {
        this.logger.log("Request for create product!")

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved success",
            "data": instanceToPlain(record)
        }
    }

    async create(dto: Partial<T>): Promise<any>{
        const handleDto = await this.actionPreCreate(dto);

        const record = await this.repository.save(handleDto);

        return this.actionPostCreate(record);
    }

    async actionPreList(dto: any) {
        return dto;
    }

    async actionPostList(records: T[]) {
        this.logger.log("Request for all products!")

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved success",
            "data": instanceToPlain(records)
        }
    }

    async getList(dto: any): Promise< any > {
        const handleDto = await this.actionPreList(dto);

        const records = await this.repository.find(handleDto);

        return this.actionPostList(records);
    }

    async actionPreDetail(id: number) {
        return id;
    }

    async actionPostDetail(record: T) {
        this.logger.log("Request for get detail product!")

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved success",
            "data": instanceToPlain(record)
        }
    }

    async getDetail(id: number): Promise<any> {
        const handleId = await this.actionPreDetail(id);

        const record = await this.repository.findOneBy({id: handleId});

        return this.actionPostDetail(record);
    }

    async actionPreUpdate(id: number, dto: Partial<T>) {
        return dto;
    }

    async actionPostUpdate(record: T) {
        this.logger.log("Request for update product!")

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved success",
            "data": instanceToPlain(record)
        }
    }

    async update(id: number, dto: Partial<T>): Promise<any> {
        const handleDto = await this.actionPreUpdate(id, dto);

        await this.repository.update({id: id}, handleDto);

        const updatedRecord = await this.repository.findOneBy({ id: id });

        return this.actionPostUpdate(updatedRecord);
    }

    async actionPreDelete(id: number) {
        return id;
    }

    async actionPostDelete() {
        this.logger.log("Request for delete product!")

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved success"
        }
    }

    async delete(id: number) {
        const handleId = await this.actionPreDelete(id);

        await this.repository.delete(handleId);

        return this.actionPostDelete()
    }
}