/**
 * 이미지를 canvas로 리사이즈 + 압축하여 base64로 반환한다.
 * @param file 원본 이미지 파일
 * @param maxWidth 최대 가로 픽셀 (기본 800)
 * @param quality JPEG 품질 0~1 (기본 0.7)
 */
export function compressImage(
  file: File,
  maxWidth = 800,
  quality = 0.7,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context를 생성할 수 없습니다.'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };
    img.onerror = () => reject(new Error('이미지를 불러올 수 없습니다.'));
    img.src = URL.createObjectURL(file);
  });
}
