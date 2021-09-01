import { DataFrame, Field, Vector } from '@grafana/data';

export interface PanelOptions {}

export const defaults: PanelOptions = {};

interface Buffer extends Vector {
  buffer: { hash_id: string; polygon: string; hour: number }[];
}

export interface FieldBuffer extends Field<any, Vector> {
  values: Buffer;
}

export interface Frame extends DataFrame {
  fields: FieldBuffer[];
}
