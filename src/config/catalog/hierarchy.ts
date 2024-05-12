import { ApiProperty } from '@nestjs/swagger';

export const HierarchyConfig = [
  {
    section: 'femme',
    categories: [
      'vetements',
      'maillots-de-bain',
      'brassieres',
      'tee-shirts',
      'shorts-de-sport-femme',
      'pantalons',
      'chaussures',
      'baskets',
      'chaussures',
      'chaussettes',
      'sandales',
      'sandales-tongs-claquettes',
      'bottes-boots-bottines',
      'accessoires',
      'sac-a-dos-femme',
      'montres',
      'ceintures-femme',
      'lunettes-de-soleil-et-etuis',
      'casquettes',
      'bob-chapeaux',
    ],
  },
  {
    section: 'homme',
    categories: [
      'vetements',
      'pantalons',
      'chaussures',
      'baskets',
      'chaussettes',
      'accessoires',
    ],
  },
  {
    section: 'enfant-bebe',
    categories: ['chaussures-enfant', 'equipements-enfant-bebe'],
  },
] as const;

export class HierarchyConfigResponse {
  @ApiProperty({ example: 'femme' })
  section: string;
  @ApiProperty({ example: ['vetements', 'maillots-de-bain'] })
  categories: string[];
}
