import { IsNotEmpty, IsPositive } from "class-validator";

export class IdDto {
    @IsNotEmpty()
    @IsPositive()
    id: number;
}