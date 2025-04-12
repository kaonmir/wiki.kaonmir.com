import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/profile.scss"

// @ts-ignore
import { classNames } from "../util/lang"

export interface Options {}

const defaultOptions: Options = {}

// 사용자 프로필 정보
const userProfile = {
  author: "Sunghun Son",
  description: "I'm living, loving, and learning my excellent life as an Engineer!",
  avatar: "/static/images/avatar.png",
  github: "kaonmir",
  gitlab: "infograb-jeff",
  email: "sonjeff@naver.com",
  url: "https://blog.kaonmir.com",
  location: "Seoul, Republic of Korea",
  rss: true,
  keywords: "blog, computer, programming",
  favicon: "/static/images/favicon.ico",
  credlyUser: "kaonmir",
  experiences: [
    {
      position: "DevOps Engineer",
      company: "InfoGrab LC.",
      company_url: "https://insight.infograb.net/",
      duration: "2022.10 ~ 2025.03",
      short_duration: "22.10~25.03",
      markdown: "/experience/infograb/_index.md",
      logo: "/experience/infograb/logo.png",
    },
    {
      position: "B.E. Computer Science",
      company: "Chung-Ang Univ.",
      company_url: "https://www.cau.ac.kr",
      duration: "2018.03 ~ 2024.02",
      short_duration: "18.03~24.02",
      markdown: "/experience/cau/_index.md",
      logo: "/experience/cau/logo.png",
    },
  ],

  badges: [
    {
      title: "Kubestronaut",
      href: "https://www.credly.com/badges/ea16e7e7-163c-47e1-ba84-7777bcd833da/public_url",
      img: "/static/images/kubestronaut.png",
    },
    {
      title: "AWS Certified DevOps Engineer \u2013 Professional",
      href: "https://www.credly.com/badges/7b301a0f-d721-4766-993c-da41b5df4ca3",
      img: "/static/images/dop.png",
    },
    {
      title: "CKS: Certified Kubernetes Security Specialist",
      href: "https://www.credly.com/badges/ecfd8688-5de0-4c09-8f04-678e67840f15",
      img: "/static/images/cks.png",
    },
    {
      title: "CKA: Certified Kubernetes Administrator",
      href: "https://www.credly.com/badges/a4d24907-cb2f-43bc-a4f1-37024428f271",
      img: "/static/images/cka.png",
    },
    {
      title: "CKAD: Certified Kubernetes Application Developer",
      href: "https://www.credly.com/badges/3ebff1ef-cc4f-48e8-8ed3-2d255aade368",
      img: "/static/images/ckad.png",
    },
    {
      title: "AWS Certified Solutions Architect \u2013 Associate",
      href: "https://www.credly.com/badges/b71e06df-90aa-4c17-8d22-e6f70173e636",
      img: "/static/images/saa.png",
    },
    {
      title: "Korean Olympiad in Informatics (13·14·16·17)",
      href: "https://kaonmir.notion.site/a490f314a9f44e7b8add5cfbc05c2238?pvs=4",
      img: "/static/images/koi.webp",
    },
  ],
  skills: [
    {
      title: "Amazon Web Services",
      img: "/static/images/aws.png",
    },
    {
      title: "GitLab",
      img: "/static/images/gitlab.png",
    },
    {
      title: "Go",
      img: "/static/images/go.png",
    },
    {
      title: "Kubernetes",
      img: "/static/images/kubernetes.png",
    },
    {
      title: "NestJS",
      img: "/static/images/nestjs.png",
    },
    {
      title: "Terraform",
      img: "/static/images/terraform.png",
    },
    {
      title: "Figma",
      img: "/static/images/figma.png",
    },
  ],
  gitalk: {
    clientID: "8cbc72e597b160c18ec3",
    clientSecret: "89f1e9690e6e8ca52f377e8cbf2328b9154ff502",
    repo: "blog.kaonmir.com",
    owner: "kaonmir",
    admin: "kaonmir",
    id: "location.pathname",
    labels: "gitalk",
    perPage: 15,
    pagerDirection: "last",
    createIssueManually: true,
    distractionFreeMode: false,
  },
  mermaid: {
    theme: "dark",
    align: "center",
  },
}

export default ((userOpts?: Partial<Options>) => {
  const opts: Options = { ...defaultOptions, ...userOpts }

  const Profile: QuartzComponent = ({ cfg, displayClass }: QuartzComponentProps) => {
    return (
      <div class={classNames(displayClass, "profile")}>
        <div class="profile-wrapper">
          {/* <div class="profile-sticky-header" id="headerStuck">
            <div class="profile-mini-info">
              <span class="profile-mini-avatar">
                <img
                  class="profile-mini-image"
                  height="32"
                  width="32"
                  src={userProfile.avatar}
                  alt="Avatar"
                />
              </span>
              <span class="profile-mini-name">
                <strong>{userProfile.author}</strong>
              </span>
            </div>
          </div> */}

          <div class="profile-main-info">
            <div class="profile-avatar-container" style={{ zIndex: 4 }}>
              <img
                style={{ height: "auto" }}
                alt="Avatar"
                width="260"
                height="260"
                id="headerImg"
                class="profile-avatar"
                src={userProfile.avatar}
              />
            </div>

            <div
              class="profile-name-container"
              data-original-top="0px"
              style={{ position: "sticky" }}
            >
              <h1 class="profile-fullname">{userProfile.author}</h1>
              <p class="profile-bio"> {userProfile.description}</p>
            </div>
          </div>

          <div class="profile-details-container">
            <div class="profile-details-wrapper">
              <ul class="profile-details-list">
                {userProfile.location && (
                  <li class="profile-detail-item">
                    <svg
                      class="profile-icon"
                      viewBox="0 0 16 16"
                      version="1.1"
                      width="16"
                      height="16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"
                      ></path>
                    </svg>
                    <span class="profile-detail-text">{userProfile.location}</span>
                  </li>
                )}

                {userProfile.email && (
                  <li class="profile-detail-item">
                    <svg
                      class="profile-icon"
                      viewBox="0 0 16 16"
                      version="1.1"
                      width="16"
                      height="16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z"
                      ></path>
                    </svg>
                    <a class="profile-email" href={`mailto:${userProfile.email}`}>
                      {userProfile.email}
                    </a>
                  </li>
                )}

                <li class="profile-detail-item">
                  <svg
                    class="profile-icon"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    height="16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"
                    ></path>
                  </svg>
                  <a rel="nofollow me" class="profile-link" href={userProfile.url}>
                    {userProfile.url}
                  </a>
                </li>
              </ul>

              {userProfile.badges && userProfile.badges.length > 0 && (
                <div class="profile-badges">
                  <h2 class="profile-section-title">Badges</h2>
                  <div class="profile-badges-list">
                    {userProfile.badges.map((badge) => (
                      <a
                        href={badge.href}
                        class="profile-badge"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={badge.img} alt={badge.title} class="profile-badge-icon" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* {userProfile.skills && Object.keys(userProfile.skills).length > 0 && (
                <div class="profile-skills">
                  <h2 class="profile-section-title">Skills</h2>
                  <div class="profile-skills-list">
                    {Object.entries(userProfile.skills).map(([category, skills]) => (
                      <div class="profile-skill-category">
                        <h3 class="profile-skill-category-title">{category}</h3>
                        <div class="profile-skill-items">
                          {skills.map((skill) => (
                            <span class="profile-skill-item">
                              <img
                                src={skill.img}
                                alt={skill.title}
                                class="profile-skill-item-icon"
                              />
                              <span class="profile-skill-item-title">{skill.title}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              {userProfile.experiences && userProfile.experiences.length > 0 && (
                <div class="profile-experiences">
                  <h2 class="profile-section-title">Experience</h2>
                  <div class="profile-experiences-list">
                    {userProfile.experiences.map((exp) => (
                      <div class="profile-experience-item">
                        <div class="profile-experience-content">
                          <h3 class="profile-experience-position">{exp.position}</h3>
                          <span class="profile-experience-duration">{exp.short_duration}</span>
                        </div>
                        {/* <a
                          href={exp.company_url}
                          class="profile-experience-company"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {exp.company}
                        </a> */}
                        <span class="profile-experience-company">{exp.company}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  Profile.css = style
  return Profile
}) satisfies QuartzComponentConstructor
