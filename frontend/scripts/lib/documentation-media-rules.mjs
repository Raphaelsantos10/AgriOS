export function minimumCaptureDimensions(file) {
  const mobile = /(?:^|-)mobile\.(?:png|jpe?g|webp)$/i.test(file);
  return mobile
    ? { width: 360, height: 700, profile: "mobile" }
    : { width: 1_000, height: 200, profile: "desktop" };
}

export function isCaptureSizeValid(file, width, height) {
  const minimum = minimumCaptureDimensions(file);
  return width >= minimum.width && height >= minimum.height;
}
