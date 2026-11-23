import { createLucideIcon } from 'lucide-react';

/**
 * lucide `house-heart` 아이콘.
 * 현재 lucide-react(0.468)에 없어서 같은 path로 직접 만든다. 버전을 올리면 lucide의 HouseHeart로 바꿔도 된다.
 */
const HouseHeart = createLucideIcon('HouseHeart', [
  ['path', { d: 'M8.62 13.8A2.25 2.25 0 1 1 12 10.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z', key: 'house-heart-1' }],
  ['path', { d: 'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', key: 'house-heart-2' }],
]);

export default HouseHeart;
