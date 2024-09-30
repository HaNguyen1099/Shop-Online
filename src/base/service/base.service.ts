import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class BaseService<T> {
    constructor(
        protected readonly repository,
    ){}

    async actionPreCreate(dto: Partial<T>) {
        return dto;
    }

    async actionPostCreate(record: T) {
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