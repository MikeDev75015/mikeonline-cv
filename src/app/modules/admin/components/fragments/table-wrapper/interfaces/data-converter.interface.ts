export interface DataConverter {
  [dataKey: string]: (data: any) => any;
}
