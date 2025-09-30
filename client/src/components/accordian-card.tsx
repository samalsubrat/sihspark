"use client"

import type React from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { useState, useMemo, useCallback } from "react"

type AudienceItem = {
  id: string
  eyebrow: string
  heading: string
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  imageSrc: string
  imageAlt: string
}

interface AudienceSwitcherCardProps {
  items: AudienceItem[]
  initialId?: string
  className?: string
}

export function AudienceSwitcherCard({ items, initialId, className }: AudienceSwitcherCardProps) {
  const [activeId, setActiveId] = useState<string>(initialId ?? items[0]?.id)

  const activeIndex = useMemo(
    () =>
      Math.max(
        0,
        items.findIndex((i) => i.id === activeId),
      ),
    [items, activeId],
  )

  const active = items[activeIndex] ?? items[0]

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) return
      e.preventDefault()
      let nextIndex = activeIndex
      if (e.key === "ArrowUp") nextIndex = (activeIndex - 1 + items.length) % items.length
      if (e.key === "ArrowDown") nextIndex = (activeIndex + 1) % items.length
      if (e.key === "Home") nextIndex = 0
      if (e.key === "End") nextIndex = items.length - 1
      setActiveId(items[nextIndex].id)
    },
    [activeIndex, items],
  )

  return (
    <section
      className={["relative overflow-hidden rounded-xl bg-card text-card-foreground", "min-h-[420px]", className].join(
        " ",
      )}
      aria-label="Audience switcher"
    >
      {/* Right-side images, stacked and crossfading */}
      <div className="absolute inset-0">
        {items.map((item) => (
          <img
            key={item.id}
            src={item.imageSrc || "/placeholder.svg"}
            alt={item.imageAlt}
            className={[
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
              item.id === activeId ? "opacity-100" : "opacity-0",
            ].join(" ")}
            loading="lazy"
          />
        ))}
      </div>

      {/* Left gradient overlay */}
      <div
        className={[
          "pointer-events-none absolute inset-0",
          "bg-gradient-to-r from-blue-800 via-blue-700/80 to-transparent",
          "md:w-[70%]",
        ].join(" ")}
        aria-hidden="true"
      />

      {/* Content grid */}
      <div className="relative z-10 grid h-full grid-cols-1 md:grid-cols-2">
        {/* Left content */}
        <div className="flex flex-col p-6 md:p-10 lg:p-12">
          {/* Replace tab-style content with an accordion; opening a section sets the active image */}
          <Accordion
            type="single"
            collapsible
            value={activeId}
            onValueChange={(v) => setActiveId(v || items[0]?.id)}
            className="mt-2"
          >
            {items.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-none">
                <AccordionTrigger
                  className={[
                    // large, elegant titles similar to the reference
                    "text-2xl md:text-3xl lg:text-4xl text-white",
                    "py-3 md:py-4 no-underline hover:no-underline",
                  ].join(" ")}
                >
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="space-y-3">
                    <p className="max-w-prose text-pretty text-sm leading-relaxed text-gray-300 md:text-base pb-8">
                      {item.description}
                    </p>
                    {/* {item.ctaLabel && item.ctaHref ? (
                      <a
                        href={item.ctaHref}
                        className={[
                          "inline-flex w-fit items-center justify-center rounded-full",
                          "bg-accent px-4 py-2 text-sm font-medium text-accent-foreground",
                          "transition-colors hover:opacity-90 focus:outline-none focus-visible:ring",
                        ].join(" ")}
                      >
                        {item.ctaLabel}
                      </a>
                    ) : null} */}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Right column acts as the visual area; content panel for a11y */}
        <div
          role="tabpanel"
          id="audience-panel"
          aria-labelledby={`audience-tab-${activeId}`}
          className="min-h-[320px]"
        />
      </div>

      {/* Rounded outer border subtle */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-border/60" aria-hidden="true" />
    </section>
  )
}

export default AudienceSwitcherCard
