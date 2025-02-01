export interface Hub {
  name: string;
  components: TCollectionComponent[];
}

export interface Collection {
  id: string;
  name: string;
  items: CollectionItem[];
}

export interface CollectionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  premiereDate: string;
  rating?: string;
  logo?: string;
  genre?: string;
  watermark?: string;
}

export type TCollectionComponent = {
  _type: string;
  id: string;
  href: string;
  name: string;
  theme: string;
  artwork: Record<string, unknown>;
  items: TView[];
};

export type TView = {
  _type: string;
  id: string;
  view_template: string;
  visuals: TVisuals;
  entity_metadata: TEntityMetadata;
};

export type TEntityMetadata = {
  genre_names: string[];
  premiere_date: string;
  rating: { code?: string };
  series_description: string;
  entity_type: string;
  episode_text?: string;
  is_warm: boolean;
};

export type TVisuals = {
  artwork: TArtworkOrientation;
  headline: string;
  action_text: string;
  subtitle?: string;
  body: string;
  footer?: string;
  prompt?: string;
  primary_branding?: TPrimaryBranding;
};

export type TArtworkOrientation = {
  _type: string;
  horizontal_tile: TArtwork;
  vertical_tile: TArtwork;
  vertical_title?: TArtwork;
};

export type TArtwork = {
  _type: string;
  artwork_type: string;
  image: TImage;
  text?: string;
};

export type TBrandingArtwork = {
  path: string;
  accent: TAccent;
  image_type: string;
  image_id: string;
};

export type TAccent = {
  hue: number;
  classification: string;
};

export type TImage = {
  path: string;
  accent: TAccent;
  image_id: string;
};

export type TPrimaryBranding = {
  id: string;
  name: string;
  artwork: {
    [key: string]: TBrandingArtwork;
  };
};
