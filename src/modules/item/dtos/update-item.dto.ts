export class UpdateItemDto {
    id: number
    name?: string
    description?: string
    deadline?: Date
    isDone?: boolean
    finishedDate?: Date
}