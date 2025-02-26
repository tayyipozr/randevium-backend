import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class DragonflyService {
  private readonly client;

  constructor() {
    // Create Redis client pointing to Dragonfly
    this.client = createClient({
      url: 'redis://localhost:6379', // Your Dragonfly instance URL
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.connect();
  }

  // Save a string value to Dragonfly cache
  async setString(
    key: string,
    value: string,
    ttl: number = 3600,
  ): Promise<string> {
    try {
      await this.client.set(key, value, {
        EX: ttl, // Set expiration in seconds
      });
      return 'OK';
    } catch (error) {
      throw new InternalServerErrorException(
        'Error setting value in Dragonfly cache',
        error,
      );
    }
  }

  // Retrieve a string value from Dragonfly cache
  async getString(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error retrieving value from Dragonfly cache',
        error,
      );
    }
  }

  // Remove a string value from the cache
  async deleteString(key: string): Promise<string> {
    try {
      await this.client.del(key);
      return 'Cache deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException(
        'Error interacting with Dragonfly cache',
        error,
      );
    }
  }

  // Add a new method for JSON data
  async setJson<T>(key: string, value: T, ttl: number = 3600): Promise<string> {
    return await this.setString(key, JSON.stringify(value), ttl);
  }

  // Add a new method to get JSON data
  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.getString(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }
}
