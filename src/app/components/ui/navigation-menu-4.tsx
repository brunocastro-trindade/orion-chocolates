"use client"

import imgOrionLogo from "@/assets/figma/orion-logo.svg"
import { Globe } from "lucide-react"
import { cn } from "./utils"
import { Button } from "./button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { useLanguage } from "@/i18n/LanguageContext"
import { LANGUAGE_LABELS, type Language } from "@/i18n/translations"
import { linkDoChat } from "@/app/components/chat/abrirChat"

const DM_SANS = "'Creato Display', 'DM Sans', sans-serif"
const IBM_PLEX = "'Creato Display', 'DM Sans', sans-serif"

const LANGUAGE_OPTIONS: Language[] = ["pt", "en", "es"]

function useNavigationLinks() {
  const { t } = useLanguage()

  // Same nav content as the produtos page's navigation-menu-4 — "A ORION" is
  // the only item with a submenu today.
  return [
    { href: "/", label: t.nav.inicio },
    {
      label: t.nav.aOrion,
      submenu: true,
      items: [
        { href: "/nossa-historia", label: t.nav.nossaHistoria },
        { href: "/qualidade", label: t.nav.qualidade },
        { href: "/trabalhe-conosco", label: t.nav.trabalheConosco },
      ],
    },
    { href: "/produtos", label: t.nav.produtos },
    // Abrem o chatbot já com a resposta da opção correspondente do menu.
    { href: "#", label: t.nav.ondeEncontrar, onClick: linkDoChat("Endereços") },
    { href: "#", label: t.nav.contato, onClick: linkDoChat("Contatos") },
  ]
}

function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn("h-9 gap-1.5 px-2.5 font-bold text-primary hover:text-primary/80", className)}
          style={{ fontFamily: DM_SANS }}
        >
          <Globe className="h-4 w-4" />
          {language.toUpperCase()}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 rounded-xl border-0 bg-primary p-1.5 shadow-lg">
        <ul className="flex flex-col gap-0.5">
          {LANGUAGE_OPTIONS.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => setLanguage(option)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-base font-bold text-secondary no-underline transition-opacity hover:opacity-70",
                  option === language && "bg-black/10",
                )}
                style={{ fontFamily: DM_SANS }}
              >
                {LANGUAGE_LABELS[option]}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

type NavLink = ReturnType<typeof useNavigationLinks>[number]

function DesktopLinks({ links }: { links: NavLink[] }) {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {links.map((link, index) => (
          <NavigationMenuItem key={index}>
            {link.submenu ? (
              <>
                <NavigationMenuTrigger
                  className="bg-transparent px-2 py-1.5 font-bold text-primary hover:text-primary/80"
                  style={{ fontFamily: DM_SANS }}
                >
                  {link.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="group-data-[viewport=false]/navigation-menu:rounded-xl group-data-[viewport=false]/navigation-menu:border-0 group-data-[viewport=false]/navigation-menu:bg-primary group-data-[viewport=false]/navigation-menu:shadow-lg">
                  <ul className="grid w-72 gap-1 p-5">
                    {link.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <NavigationMenuLink
                          asChild
                          className="rounded-md px-2 py-2.5 text-2xl leading-none font-bold text-secondary no-underline hover:bg-transparent hover:opacity-70 focus:bg-transparent"
                        >
                          <a href={item.href} style={{ fontFamily: DM_SANS }}>
                            {item.label}
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <a
                  href={link.href}
                  onClick={link.onClick}
                  className={cn("px-2 py-1.5 font-bold text-primary hover:text-primary/80")}
                  style={{ fontFamily: DM_SANS }}
                >
                  {link.label}
                </a>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default function NavigationMenu4() {
  const navigationLinks = useNavigationLinks()
  const leftLinks = navigationLinks.slice(0, 3)
  const rightLinks = navigationLinks.slice(3)

  return (
    <header className="relative px-4 md:px-6">
      <div className="relative flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="group size-8 text-primary md:hidden" variant="ghost" size="icon">
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      {link.submenu ? (
                        <>
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground" style={{ fontFamily: DM_SANS }}>
                            {link.label}
                          </div>
                          <ul>
                            {link.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <NavigationMenuLink href={item.href} className="py-1.5" style={{ fontFamily: IBM_PLEX }}>
                                  {item.label}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <NavigationMenuLink href={link.href} onClick={link.onClick} className="py-1.5 font-bold" style={{ fontFamily: DM_SANS }}>
                          {link.label}
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
              <div className="mt-1 border-t px-2 pt-2">
                <LanguageSwitcher className="w-full justify-start px-0" />
              </div>
            </PopoverContent>
          </Popover>
          {/* Left nav items (desktop only) */}
          <div className="max-md:hidden">
            <DesktopLinks links={leftLinks} />
          </div>
        </div>

        {/* Logo — the only element with a background (the dark medallion
            pill, same as the rest of the site). Absolutely centered so it
            stays put regardless of how wide the left/right nav groups are. */}
        <a
          href="/"
          className="absolute top-0 left-1/2 flex h-28 w-[150px] -translate-x-1/2 items-start justify-center rounded-b-full bg-[#251116] pt-3"
        >
          <img id="orion-navbar-logo-img" alt="ORION Chocolates" src={imgOrionLogo} className="h-20 w-auto" />
        </a>

        {/* Right nav items (desktop only), with the language switcher tacked
            onto the end of the group */}
        <div className="max-md:hidden">
          <div className="flex items-center">
            <DesktopLinks links={rightLinks} />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
