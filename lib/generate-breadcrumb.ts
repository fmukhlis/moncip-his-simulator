import { DataProps } from "./navigation-data"

export function generateBreadcrumb(data: DataProps[][]) {
  const map = new Map<string, { url: string; title: string }[]>()

  function walk(items: Omit<DataProps, "icon">[], parents: { url: string; title: string }[] = []) {
    for (const { url, title, items: subItems } of items) {
      const currentCrumbs = [...parents, { url, title }]

      if (!map.has(url)) {
        map.set(url, currentCrumbs)
      }

      if (subItems) {
        walk(subItems, currentCrumbs)
      }
    }
  }

  for (const item of data) {
    walk(item)
  }

  return map
}
