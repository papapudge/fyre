export interface RouteHandler {
  (req: Request, params?: Record<string, string>): Promise<Response> | Response;
}

export interface Route {
  method: string;
  path: string;
  handler: RouteHandler;
}

export class Router {
  private routes: Route[] = [];

  get(path: string, handler: RouteHandler) {
    this.routes.push({ method: "GET", path, handler });
  }

  post(path: string, handler: RouteHandler) {
    this.routes.push({ method: "POST", path, handler });
  }

  put(path: string, handler: RouteHandler) {
    this.routes.push({ method: "PUT", path, handler });
  }

  patch(path: string, handler: RouteHandler) {
    this.routes.push({ method: "PATCH", path, handler });
  }

  delete(path: string, handler: RouteHandler) {
    this.routes.push({ method: "DELETE", path, handler });
  }

  use(prefix: string, subRouter: Router) {
    subRouter.routes.forEach(route => {
      this.routes.push({
        method: route.method,
        path: prefix + route.path,
        handler: route.handler
      });
    });
  }

  async handle(req: Request): Promise<Response | null> {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    for (const route of this.routes) {
      if (route.method === method && this.matchPath(route.path, path)) {
        const params = this.extractParams(route.path, path);
        return await route.handler(req, params);
      }
    }

    return null;
  }

  private matchPath(routePath: string, requestPath: string): boolean {
    // Normalize paths by removing trailing slashes
    const normalizedRoutePath = routePath.replace(/\/$/, '') || '/';
    const normalizedRequestPath = requestPath.replace(/\/$/, '') || '/';
    
    const routeParts = normalizedRoutePath.split('/');
    const requestParts = normalizedRequestPath.split('/');

    if (routeParts.length !== requestParts.length) {
      return false;
    }

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const requestPart = requestParts[i];

      if (routePart.startsWith(':')) {
        continue; // Parameter match
      }

      if (routePart !== requestPart) {
        return false;
      }
    }

    return true;
  }

  private extractParams(routePath: string, requestPath: string): Record<string, string> {
    const params: Record<string, string> = {};
    const routeParts = routePath.split('/');
    const requestParts = requestPath.split('/');

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      if (routePart.startsWith(':')) {
        const paramName = routePart.slice(1);
        params[paramName] = requestParts[i];
      }
    }

    return params;
  }
}

export function createRouter(): Router {
  return new Router();
}
