export interface ColumData {
  id: number;
  col_type: string;
  name: string;
  index: number;
  project_id: number;
  array_index: {
    id: number;
    index: number;
  }[];
}
