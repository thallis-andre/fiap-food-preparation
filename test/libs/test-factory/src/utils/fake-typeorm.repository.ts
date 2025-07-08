export class FakeTypeormRepository<T = any> {
  private run(): Promise<T | T[]> {
    return Promise.reject(new Error('Not Implemented'));
  }
  findOneBy() {
    return this.run();
  }
  find() {
    return this.run();
  }
  findOne() {
    return this.run();
  }
}
