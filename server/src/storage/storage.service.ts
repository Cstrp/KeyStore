import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { join, resolve } from 'path';
import {
  mkdir,
  open,
  readdir,
  readFile,
  rename,
  unlink,
  writeFile,
} from 'fs/promises';

@Injectable()
export class StorageService {
  private readonly root: string;

  constructor(private readonly cfg: ConfigService) {
    this.root = resolve(
      this.cfg.get<string>('STORAGE_PATH') ??
        this.cfg.get<string>('storage.path') ??
        'storage',
    );
  }

  public async onModuleInit(): Promise<void> {
    await Promise.all([
      mkdir(this.root, { recursive: true }),
      this.ensureDirectory('orders'),
      this.ensureDirectory('products'),
      this.ensureDirectory('keys'),
      this.ensureDirectory('payments'),
      this.ensureDirectory('deliveries'),
    ]);
  }

  public async get<T>(collection: string, id: string): Promise<T | undefined> {
    try {
      const content = await readFile(this.file(collection, id), 'utf8');

      return JSON.parse(content) as T;
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        return;
      }

      throw error;
    }
  }

  public async set<T>(collection: string, id: string, data: T): Promise<void> {
    await this.ensureDirectory(collection);
    const target = this.file(collection, id);
    const temp = `${target}.${process.pid}.${Date.now()}.tmp`;

    await writeFile(temp, JSON.stringify(data, null, 2), 'utf8');
    await rename(temp, target);
  }

  public async delete(collection: string, id: string): Promise<void> {
    try {
      await unlink(this.file(collection, id));
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        return;
      }

      throw error;
    }
  }

  public async list<T>(collection: string): Promise<T[]> {
    const dir = this.directory(collection);
    let files: string[];
    try {
      files = await readdir(dir);
    } catch (error) {
      if (this.isErrorCode(error, 'ENOENT')) {
        return [];
      }
      throw error;
    }

    return Promise.all(
      files
        .filter((f) => f.endsWith('.json'))
        .map(async (f) => {
          const content = await readFile(join(dir, f), 'utf8');

          return JSON.parse(content) as T;
        }),
    );
  }

  public async withLock<T>(key: string, cb: () => Promise<T>): Promise<T> {
    const lockPath = join(this.root, `${key}.lock`);
    await this.acquireLock(lockPath);

    try {
      return await cb();
    } finally {
      try {
        await unlink(lockPath);
      } catch (error) {
        if (!this.isErrorCode(error, 'ENOENT')) {
          throw error;
        }
      }
    }
  }

  private async acquireLock(lockPath: string): Promise<void> {
    await mkdir(this.root, { recursive: true });
    for (;;) {
      try {
        const handle = await open(lockPath, 'wx');
        await handle.close();

        return;
      } catch (error) {
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          error.code === 'EEXIST'
        ) {
          await new Promise((res) => setTimeout(res, 25));
          continue;
        }

        throw error;
      }
    }
  }

  private file(collection: string, id: string): string {
    return join(this.directory(collection), `${id}.json`);
  }

  private directory(collection: string): string {
    return join(this.root, collection);
  }
  private async ensureDirectory(collection: string): Promise<void> {
    await mkdir(this.directory(collection), { recursive: true });
  }

  private isErrorCode(error: unknown, code: string): boolean {
    return (
      error !== null &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === code
    );
  }
}
