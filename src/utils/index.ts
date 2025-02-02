import type { Collection, TCollectionComponent } from "../types";

export function santizeCollection(component: TCollectionComponent): Collection {
  return {
    id: component.id,
    name: component.name,
    items: component.items.map((item) => ({
      id: item.id,
      title: item.visuals.headline,
      description: item.visuals.body,
      rating: item.entity_metadata.rating.code,
      genre: item.entity_metadata.genre_names?.join(", "),
      image: item.visuals.artwork.horizontal_tile.image.path,
      premiereDate: item.entity_metadata.premiere_date,
      watermark: item.visuals.primary_branding?.artwork["brand.watermark.bottom.right"].path,
      logo: item.visuals.primary_branding?.artwork["brand.logo"].path,
    })),
  };
}
