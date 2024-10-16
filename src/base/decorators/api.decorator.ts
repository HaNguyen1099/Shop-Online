import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export function ApiFile(fieldName: string = 'file', required: boolean = true) {
    return applyDecorators(
        ApiConsumes('multipart/form-data'),
        ApiBody({
            schema: {
                type: 'object',
                properties: {
                    [fieldName]: {
                        type: 'string',
                        format: 'binary'
                    },
                },
                required: required ? [fieldName] : [],
            },
        }),
    );
}

export function ApiFiles(fieldName: string = 'file', required: boolean = true) {
    return applyDecorators(
        ApiConsumes('multipart/form-data'),
        ApiBody({
            schema: {
                type: 'object',
                properties: {
                    title: { 
                        type: 'string' 
                    },
                    description: { 
                        type: 'string' 
                    },
                    price: { 
                        type: 'number' 
                    },
                    [fieldName]: {
                        type: 'array',
                        items: {
                            type: 'string',
                            format: 'binary',
                        },
                    },
                },
                required: required ? ['title', 'description', 'price', fieldName] : [],
            },
        }),
    );
}

export function ApiExcel(fieldName: string = 'file', required: boolean = true) {
    return applyDecorators(
        ApiConsumes('multipart/form-data'),
        ApiBody({
            schema: {
                type: 'object',
                properties: {
                    [fieldName]: {
                        type: 'string',
                        format: 'binary'
                    },
                },
                required: required ? [fieldName] : [],
            },
        }),
    );
}