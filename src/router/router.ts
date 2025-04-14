export interface Route {
  path: string;
  view: (root: HTMLElement) => Promise<void> | void;
}

export class Router {
  private routes: Route[];
  private currentRoute: Route | undefined;
  private readonly rootElement: HTMLElement;
  private readonly notFoundRoute: Route;

  constructor(rootElement: HTMLElement, routes: Route[], notFoundRoute: Route) {
    this.routes = routes;
    this.rootElement = rootElement;
    this.notFoundRoute = notFoundRoute;
    this.init();
  }

  public navigateTo(path: string): void {
    const normalizedPath = normalizePath(path);
    if (getCurrentHashPath() !== normalizedPath.slice(1)) {
      globalThis.history.pushState({}, '', normalizedPath);
      this.handleRouteChange();
    }
  }

  private init(): void {
    ensureHashRouting();
    globalThis.addEventListener('popstate', () => this.handleRouteChange());
    globalThis.addEventListener('load', () => this.handleRouteChange());
    this.setupLinkInterception();
  }

  private clearRootElement(): void {
    this.rootElement.replaceChildren();
  }

  private async handleRouteChange(): Promise<void> {
    const path = getCurrentHashPath();

    const matchingRoute = this.routes.find((route) => route.path === path);

    try {
      if (matchingRoute) {
        if (this.currentRoute !== matchingRoute) {
          this.currentRoute = matchingRoute;
          this.clearRootElement();
          await matchingRoute.view(this.rootElement);
        }
      } else {
        console.warn(`Route not found: ${path}`);
        this.clearRootElement();
        globalThis.history.replaceState({}, '', normalizePath(this.notFoundRoute.path));
        this.currentRoute = this.notFoundRoute;
        await this.notFoundRoute.view(this.rootElement);
      }
    } catch (error) {
      console.error('Error during route rendering:', error);
      this.clearRootElement();
      globalThis.history.replaceState({}, '', normalizePath(this.notFoundRoute.path));
      this.currentRoute = this.notFoundRoute;
      await this.notFoundRoute.view(this.rootElement);
    }
  }

  private setupLinkInterception(): void {
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!target || !(target instanceof Element)) return;
      const link = target.closest('a[data-router-link]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;
      event.preventDefault();
      this.navigateTo(href);
    });
  }
}

function normalizePath(path: string): string {
  const cleanPath: string = path.replace(/^[#/]+/, '').replaceAll(/\/+/g, '/');
  return cleanPath ? `#/${cleanPath}` : '#/';
}

function ensureHashRouting(): void {
  if (!globalThis.location.hash) {
    const baseUrl = globalThis.location.origin;
    const path = globalThis.location.pathname === '/' ? '#/' : `#${globalThis.location.pathname}`;
    globalThis.history.replaceState({}, '', `${baseUrl}${path}`);
  } else if (!globalThis.location.hash.startsWith('#/')) {
    const newHash = `#/${globalThis.location.hash.slice(1)}`;
    globalThis.history.replaceState({}, '', `${globalThis.location.pathname}${newHash}`);
  }
}

function getCurrentHashPath(): string {
  return globalThis.location.hash.slice(1) || '/';
}
