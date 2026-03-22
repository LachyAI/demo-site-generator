"use client"

import { useEffect, useRef, useState } from "react"
import { DemoConfig } from "@/lib/types"

function Counter({
  end,
  suffix = "",
  label,
  isDecimal = false,
}: {
  end: number
  suffix?: string
  label: string
  isDecimal?: boolean
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const duration = 2000
    const steps = 60
    const increment = end / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [started, end])

  const displayValue = isDecimal
    ? (count / 10).toFixed(1)
    : count.toLocaleString()

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl md:text-5xl font-extrabold text-navy-900">
        {displayValue}{suffix}
      </div>
      <div className="text-sm text-slate-500 mt-2 font-medium">{label}</div>
    </div>
  )
}

export function Stats({ config }: { config: DemoConfig }) {
  const jobs = config.stats?.jobsCompleted ?? 500
  const clients = config.stats?.happyClients ?? 200
  const rating = config.stats?.googleRating ?? 49

  return (
    <section className="py-12 md:py-16 bg-white border-y border-slate-100">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-3 gap-8">
          <Counter end={jobs} suffix="+" label="Jobs Completed" />
          <Counter end={clients} suffix="+" label="Happy Clients" />
          <Counter end={rating} suffix="" label="★ Google Rating" isDecimal />
        </div>
      </div>
    </section>
  )
}
