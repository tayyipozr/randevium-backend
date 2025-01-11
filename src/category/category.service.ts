import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryRequestModel, CategoryUpdateModel } from './model';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }

    async getCategories() {
        return await this.prisma.category.findMany();
    }

    async createCategories(model: CategoryRequestModel) {
        //TODO: Create Image before creating category
        return await this.prisma.category.create(
            {
                data: {
                    name: model.name,
                }
            }
        );
    }

    async deleteCategory(id: string) {
        return await this.prisma.category.delete({
            where: {
                id: id
            }
        });
    }

    async updateCategory(id: string, model: CategoryUpdateModel) {
        const updateData: CategoryRequestModel = new CategoryRequestModel();

        if (model.name !== undefined) {
            updateData.name = model.name;
        }
        if (model.imageUrl !== undefined) {
            updateData.imageUrl = model.imageUrl;
        }

        return await this.prisma.category.update({
            where: {
                id: id
            },
            data: updateData
        });
    }
}
