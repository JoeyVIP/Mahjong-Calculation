// 麻將牌 SVG 檔案映射
export const getTileSvgPath = (type: string, value: number | string): string => {
  switch (type) {
    case 'wan':
      return `/tiles/Man${value}.svg`;
    case 'tiao':
      return `/tiles/Sou${value}.svg`;
    case 'tong':
      return `/tiles/Pin${value}.svg`;
    case 'wind':
      const windMap: Record<string, string> = {
        east: 'Ton',
        south: 'Nan',
        west: 'Shaa',
        north: 'Pei',
      };
      return `/tiles/${windMap[value as string]}.svg`;
    case 'dragon':
      const dragonMap: Record<string, string> = {
        white: 'Haku',
        green: 'Hatsu',
        red: 'Chun',
      };
      return `/tiles/${dragonMap[value as string]}.svg`;
    case 'flower':
      const flowerMap: Record<string, string> = {
        spring: 'Flower-Spring',
        summer: 'Flower-Summer',
        autumn: 'Flower-Autumn',
        winter: 'Flower-Winter',
        plum: 'Flower-Plum',
        orchid: 'Flower-Orchid',
        chrysanthemum: 'Flower-Chrysanthemum',
        bamboo: 'Flower-Bamboo',
      };
      return `/tiles/${flowerMap[value as string]}.svg`;
    default:
      return '';
  }
};
