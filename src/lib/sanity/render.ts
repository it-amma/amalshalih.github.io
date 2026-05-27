import { toHTML } from '@portabletext/to-html'

export function renderPortableText(body: unknown): string {
  if (!body) return ''

  const components = {
    block: {
      bullet: (opts: { children?: unknown }) => `<ul>${opts.children ?? ''}</ul>`,
      bulletList: (opts: { children?: unknown }) => `<ul>${opts.children ?? ''}</ul>`,
      heading: (opts: { children?: unknown; level?: number }) => `<h${opts.level ?? 2}>${opts.children ?? ''}</h${opts.level ?? 2}>`,
      numberList: (opts: { children?: unknown }) => `<ol>${opts.children ?? ''}</ol>`,
      numberListItem: (opts: { children?: unknown }) => `<li>${opts.children ?? ''}</li>`,
      blockquote: (opts: { children?: unknown }) => `<blockquote>${opts.children ?? ''}</blockquote>`,
    },
    marks: {
      strong: (opts: { children?: unknown }) => `<strong>${opts.children ?? ''}</strong>`,
      em: (opts: { children?: unknown }) => `<em>${opts.children ?? ''}</em>`,
      link: (opts: { value?: { href?: string }; children?: unknown }) =>
        `<a href="${opts.value?.href ?? '#'}" target="_blank" rel="noopener noreferrer">${opts.children ?? ''}</a>`,
      code: (opts: { children?: unknown }) => `<code>${opts.children ?? ''}</code>`,
    },
    types: {
      image: (opts: { value?: { asset?: { url?: string }; alt?: string } }) => {
        const src = opts.value?.asset?.url ?? ''
        const alt = opts.value?.alt ?? ''
        if (!src) return ''
        return `<figure class="my-6"><img src="${src}" alt="${alt}" class="rounded-xl max-w-full" loading="lazy" /><${''}/figure>`
      },
    },
  }

  return toHTML(body as Parameters<typeof toHTML>[0], { components } as Parameters<typeof toHTML>[1])
}