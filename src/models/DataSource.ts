import { IDataSource } from '../interfaces/dataSource';

export default class DataSource<T> implements IDataSource<T> {
    constructor(public listaRecords: T[], public numeroPaginas: number, public totalRecords: number) {}
}