import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryRequestModel, CategoryUpdateModel } from './model';
import { LoggerService } from 'src/utils/logger/logger.service';
import { DragonflyService } from 'src/dragonfly/dragonfly.service';

@Injectable()
export class CategoryService {
    private readonly CACHE_KEY_ALL_CATEGORIES = 'all_categories';
    private readonly CACHE_TTL = 3600; // 1 hour

    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService,
        private readonly cache: DragonflyService
    ) { }

    async getCategories() {
        try {
            // Try to get from cache first
            const cachedCategories = await this.cache.getJson<any[]>(this.CACHE_KEY_ALL_CATEGORIES);
            if (cachedCategories) {
                this.logger.log('Categories retrieved from cache');
                return cachedCategories;
            }

            // If not in cache, get from database
            const categories = await this.prisma.category.findMany();

            // Store in cache
            await this.cache.setJson(this.CACHE_KEY_ALL_CATEGORIES, categories, this.CACHE_TTL);

            this.logger.log('Categories retrieved from database and cached');
            return categories;
        } catch (error) {
            this.logger.error('Error fetching categories', error);
            throw error;
        }
    }

    async createCategories(model: CategoryRequestModel) {
        try {
            //TODO: Create Image before creating category
            const category = await this.prisma.category.create({
                data: {
                    name: model.name,
                }
            });

            // Invalidate cache after creating new category
            await this.cache.deleteString(this.CACHE_KEY_ALL_CATEGORIES);
            this.logger.log(`Category created: ${category.id}`);

            return category;
        } catch (error) {
            this.logger.error('Error creating category', error);
            throw error;
        }
    }

    async deleteCategory(id: string) {
        try {
            const result = await this.prisma.category.delete({
                where: {
                    id: id
                }
            });

            // Invalidate cache after deletion
            await this.cache.deleteString(this.CACHE_KEY_ALL_CATEGORIES);
            this.logger.log(`Category deleted: ${id}`);

            return result;
        } catch (error) {
            this.logger.error(`Error deleting category ${id}`, error);
            throw error;
        }
    }

    async updateCategory(id: string, model: CategoryUpdateModel) {
        try {
            const updateData: CategoryRequestModel = new CategoryRequestModel();

            if (model.name !== undefined) {
                updateData.name = model.name;
            }
            if (model.imageUrl !== undefined) {
                updateData.imageUrl = model.imageUrl;
            }

            const result = await this.prisma.category.update({
                where: {
                    id: id
                },
                data: updateData
            });

            // Invalidate cache after update
            await this.cache.deleteString(this.CACHE_KEY_ALL_CATEGORIES);
            this.logger.log(`Category updated: ${id}`);

            return result;
        } catch (error) {
            this.logger.error(`Error updating category ${id}`, error);
            throw error;
        }
    }
}
