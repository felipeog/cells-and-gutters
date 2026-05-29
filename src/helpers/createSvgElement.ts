export function createSvgElement(
  tag: string,
  properties: Record<string, string> = {},
) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);

  Object.entries(properties).forEach(([key, value]) =>
    element.setAttribute(key, value),
  );

  return element;
}
