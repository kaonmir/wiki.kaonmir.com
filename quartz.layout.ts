import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzPluginData } from "./quartz/plugins/vfile"

const recentNotesFilter = (page: QuartzPluginData) => {
  return (
    !(page.frontmatter?.tags ?? [])?.includes("상록수") && // 상록수 페이지 무시
    page.slug !== "index" && // 메인 페이지 무시
    !page.slug?.startsWith("tags") // 태그 무시
  )
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
    Component.MobileOnly(
      Component.ConditionalRender({
        component: Component.RecentNotes({
          title: "Recent Posts",
          limit: 4,
          showTags: false,
          filter: recentNotesFilter,
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
    // Component.Explorer({
    //   useSavedState: true,
    // }),
    Component.DesktopOnly(
      Component.RecentNotes({
        limit: 10,
        showTags: false,
        filter: recentNotesFilter,
      }),
    ),
  ],
  right: [
    Component.Graph({
      globalGraph: {
        showTags: false,
      },
    }),
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
    Component.DesktopOnly(
      Component.RecentNotes({
        limit: 10,
        showTags: false,
        filter: recentNotesFilter,
      }),
    ),
  ],
  right: [],
}
