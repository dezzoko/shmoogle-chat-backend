export abstract class IGenericRepository<T> {
  abstract getAll(): Promise<T[]>;

  abstract get(id: string): Promise<T>;

  abstract create(item: any, creatorId?: string): Promise<T>;

  abstract update(id: string, item: GenericUpdateData<T>): Promise<T>;

  abstract delete(id: string): Promise<boolean>;
}

export type GenericUpdateData<T> = Omit<Partial<T>, keyof { id: string }>;
