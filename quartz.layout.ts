import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

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
    Component.MobileOnly(
      Component.ConditionalRender({
        component: Component.RecentNotes({
          title: "Recent Posts",
          limit: 4,
          showTags: false,
        }),
        condition: (page) => page.fileData.slug === "index",
      }),
    ),
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
    // Component.ConditionalRender({
    //   component: Component.Breadcrumbs(),
    //   condition: (page) => page.fileData.slug !== "index",
    // }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    // Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    // Component.Flex({
    //   components: [
    //     {
    //       Component: Component.Search(),
    //       grow: true,
    //     },
    //     { Component: Component.Darkmode() },
    //   ],
    // }),
    // Component.Explorer({
    //   useSavedState: true,
    // }),
    Component.DesktopOnly(
      Component.RecentNotes({
        limit: 10,
        showTags: false,
      }),
    ),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    // Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    // Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    // Component.Flex({
    //   components: [
    //     {
    //       Component: Component.Search(),
    //       grow: true,
    //     },
    //     { Component: Component.Darkmode() },
    //   ],
    // }),
    // Component.Explorer(),
    Component.DesktopOnly(
      Component.RecentNotes({
        limit: 10,
        showTags: false,
      }),
    ),
  ],
  right: [],
}
