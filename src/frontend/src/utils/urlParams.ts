export function getUrlParam(param: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function getSecretParameter(param: string): string | null {
  return getUrlParam(param);
}

export function isPublicCardRoute(): boolean {
  return window.location.pathname.startsWith('/card/');
}

export function getPrincipalFromUrl(): string | null {
  const match = window.location.pathname.match(/^\/card\/(.+)$/);
  return match ? match[1] : null;
}
