export type DiataxisType = 'explanation' | 'tutorial' | 'how-to' | 'reference';

export interface ProductSubsection {
  title: string;
  url: string;
}

export interface ProductSection {
  type: DiataxisType;
  title: string;
  description: string;
  url: string;
  icon?: string;
  highlighted?: boolean;
  subsections?: ProductSubsection[];
}

export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  url: string;
  external?: boolean;
  sections?: ProductSection[];
}
