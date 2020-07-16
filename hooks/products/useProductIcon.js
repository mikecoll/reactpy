import * as Icons from '~/components/common/Icons';

/**
 * If the product name (lowercase) contains one of these keys
 * then the associated icon will be returned from `productNameIcons()`
 *
 * @TODO: update this logic to take advantage of `products.meat_group`
 */
const nameIcons = {
  rx: Icons.Box,
  bacon: Icons.Bacon,
  jerky: Icons.Bacon,
  chicken: Icons.Chicken,
  drumsticks: Icons.Chicken,
  turkey: Icons.Chicken,

  hotdog: Icons.HotDog,

  salmon: Icons.Fish,
  scallops: Icons.Fish,

  card: Icons.OtherBoxItem,
  insert: Icons.OtherBoxItem,
  collagen: Icons.OtherBoxItem,
  totes: Icons.OtherBoxItem,
  handbook: Icons.OtherBoxItem,

  pork: Icons.Pork,
  baby: Icons.Pork,
  tenderloin: Icons.Pork,

  // 'iron': Icons.Beef,
  // 'beef': Icons.Beef,
  // 'burgers': Icons.Beef,
  // 'steak': Icons.Beef,
  default: Icons.Beef,

  deleted: Icons.Trash,
};

const useProductIcon = (name) => {
  const foundKey = Object.keys(nameIcons).find(
    key => name.toLowerCase().includes(key),
  );

  return foundKey
    ? nameIcons[foundKey]
    : nameIcons.default;
};

export default useProductIcon;
