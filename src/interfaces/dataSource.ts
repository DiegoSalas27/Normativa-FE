export interface IDataSource<T> {
  listaRecords: T[];
  numeroPaginas: number;
  totalRecords: number;
}