export interface RadarData {
  labels: string[];

  datasets: DataSets[];
}

export interface DataSets {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
}
