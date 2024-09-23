import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class BaseService<T> {
    constructor(
        protected readonly repository,
    ){}

    async actionPreCreate(dto: Partial<T>) {
        return dto;
    }

    async actionPostCreate(record: T) {
        return record;
    }

    async create(dto: Partial<T>): Promise<T>{
        const handleDto = await this.actionPreCreate(dto);

        const record = await this.repository.save(handleDto);

        return this.actionPostCreate(record);
    }

    async actionPreList(dto: any) {
        return dto;
    }

    async actionPostList(records: T[]) {
        return records;
    }

    async getList(dto: any): Promise<T[]> {
        const handleDto = await this.actionPreList(dto);

        const records = await this.repository.find(handleDto);

        return this.actionPostList(records);
    }

    async actionPreDetail(id: number) {
        return id;
    }

    async actionPostDetail(record: T) {
        return record;
    }

    async getDetail(id: number): Promise<T> {
        const handleId = await this.actionPreDetail(id);

        const record = await this.repository.findOneBy({id: handleId});

        return this.actionPostDetail(record);
    }

    async actionPreUpdate(id: number, dto: Partial<T>) {
        return dto;
    }

    async actionPostUpdate(record: T) {
        return record;
    }

    async update(id: number, dto: Partial<T>): Promise<T> {
        const handleDto = await this.actionPreUpdate(id, dto);

        await this.repository.update({id: id}, handleDto);

        const updatedRecord = await this.repository.findOneBy({ id: id });

        return this.actionPostUpdate(updatedRecord);
    }

    async actionPreDelete(id: number) {
        return id;
    }

    async actionPostDelete() {
    }

    async delete(id: number) {
        const handleId = await this.actionPreDelete(id);

        await this.repository.delete(handleId);

        return this.actionPostDelete()
    }
}