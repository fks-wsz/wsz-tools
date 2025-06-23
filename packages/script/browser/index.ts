export function getDOM(id: string): HTMLElement | null {
  return document.getElementById(id);
}

export function print(text: string): void {
  console.log('text --->', text);
}
