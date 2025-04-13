import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzPluginData } from "./quartz/plugins/vfile"

const sortByModifiedDate = (a: QuartzPluginData, b: QuartzPluginData) => {
  if (a.dates?.modified && b.dates?.modified) {
    return new Date(b.dates.modified).getTime() - new Date(a.dates.modified).getTime()
  }
  return 0
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    // Component.Comments({
    //   provider: "giscus",
    //   options: {
    //     // from data-repo
    //     repo: "kaonmir/wiki.kaonmir.com",
    //     // from data-repo-id
    //     repoId: "R_kgDOOXoGJA",
    //     // from data-category
    //     category: "Announcements",
    //     // from data-category-id
    //     categoryId: "DIC_kwDOOXoGJM4CpCif",
    //   },
    // }),
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "Recent notes",
        limit: 6,
        filter: (page) => page.slug !== "index" && (page.slug?.startsWith("notes") ?? false),
        sort: sortByModifiedDate,
        showTags: true,
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "Recent Posts",
        limit: 4,
        filter: (page) =>
          (page.slug?.startsWith("posts") ?? false) || (page.slug?.startsWith("series") ?? false),
        sort: sortByModifiedDate,
        showTags: true,
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/kaonmir/wiki.kaonmir.com",
      // "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    // Component.Explorer(),
    Component.DesktopOnly(Component.Profile()),
  ],
  right: [
    Component.ConditionalRender({
      component: Component.Graph(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    // Component.Explorer(),
    Component.DesktopOnly(Component.Profile()),
  ],
  right: [],
}
