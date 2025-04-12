import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/pageheader.scss"
import Search, { SearchOptions } from "./Search"

export default ((userOpts?: Partial<SearchOptions>) => {
  const PageHeader: QuartzComponent = ({ userOpts }: QuartzComponentProps) => {
    return (
      <header className="page-header">
        <div className="page-header-logo desktop-only">
          <a href="/">
            <img alt="logo" width="32" height="32" src="/images/logo.png" className="avatar" />
          </a>
        </div>
        <div className="page-header-mobile-menu">
          <button
            className="page-header-menu-button"
            type="button"
            onClick={() => {
              const search = document.querySelector("#header-search")
              if (search) {
                // search.style.display = search.style.display === "none" ? "block" : "none"
              }
            }}
          >
            <svg height="24" className="menu-icon" viewBox="0 0 16 16" version="1.1" width="24">
              <path
                fillRule="evenodd"
                d="M1 2.75A.75.75 0 011.75 2h12.5a.75.75 0 110 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h12.5a.75.75 0 110 1.5H1.75A.75.75 0 011 7.75zM1.75 12a.75.75 0 100 1.5h12.5a.75.75 0 100-1.5H1.75z"
              />
            </svg>
          </button>
        </div>
        <div id="header-search" className="page-header-search-container">
          <div className="page-header-search">
            <div className="search-wrapper">
              <form
                target="_blank"
                action="https://www.google.com/search"
                acceptCharset="UTF-8"
                method="get"
                autoComplete="off"
              >
                <label className="search-label">
                  <input
                    type="text"
                    className="search-input"
                    name="q"
                    placeholder="Search"
                    autoComplete="off"
                  />
                  <input type="hidden" name="q" value="site:/" />
                </label>
              </form>
            </div>
          </div>
        </div>
        <Search {...userOpts} />
      </header>
    )
  }

  PageHeader.css = style
  return PageHeader
}) satisfies QuartzComponentConstructor
