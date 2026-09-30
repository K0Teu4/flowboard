export function sitePath(path: string) {
  const clean = path.startsWith("/") ? path : "/" + path;
  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/flowboard") ? "/flowboard" : "";
  return base + clean;
}
