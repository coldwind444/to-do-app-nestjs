import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "./item.entity";
import { Like, Repository } from "typeorm";
import { CreateItemDto } from "./dtos/create-item.dto";
import { UpdateItemDto } from "./dtos/update-item.dto";

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
    ) {}

    async create(userid: number, req: CreateItemDto): Promise<Item> {
        const foundItem = await this.itemRepository.findOne({
            where: {
                name: req.name,
                owner: {
                    id: userid
                }
            }
        })

        if (foundItem) {
            throw new HttpException('This name has been used for another item.', HttpStatus.CONFLICT)
        }

        const item = this.itemRepository.create({
            name: req.name,
            deadline: req.deadline,
            description: req.description,
            createDate: new Date(),
            isDone: false,
            owner: { id: userid }
        })
        
        return this.itemRepository.save(item)
    }

    async update(userid: number, req: UpdateItemDto): Promise<Item> {
        const item = await this.itemRepository.findOne({
            where: {
                id: req.id,
                owner: { id: userid }
            }
        })

        if (!item) {
            throw new HttpException(`Item with ID ${req.id} not found`, HttpStatus.NOT_FOUND);
        }

        const updatedItem = this.itemRepository.merge(item, req)

        return this.itemRepository.save(updatedItem);
    }

    findByStatus(userid: number, finished: boolean) : Promise<Item[]> {
        return this.itemRepository.find({
            where: {
                isDone: finished,
                owner: {
                    id: userid
                }
            }
        })
    }

    findAll(userid: number): Promise<Item[]> {
        return this.itemRepository.find({
            where: {
                owner: {
                    id: userid
                }
            }
        })
    }

    findByName(userid: number, name: string): Promise<Item[]> {
        return this.itemRepository.find({
            where: {
                name: Like(`%${name}%`),
                owner: {
                    id: userid
                }
            }
        })
    }

    async remove(userid: number, id: number): Promise<void> {
        const item = await this.itemRepository.findOne({
            where: {
                id: id,
                owner: { id: userid }
            }
        })
        
        if (!item) throw new HttpException('No item found.', HttpStatus.NOT_FOUND)

        await this.itemRepository.delete({ id: id, owner: { id: userid }})
    }
}