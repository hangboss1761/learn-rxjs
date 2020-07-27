import React, { useState, useMemo } from 'react'
import { fromEvent } from 'rxjs'
import { throttleTime, map } from 'rxjs/operators'
import './index.scss'

type ScrollPercent = () => React.CSSProperties

export const ScrollView = () => {
  const [scrollTop, setScrollTop] = useState(0)

  const scrollPercent = useMemo<React.CSSProperties>(
    () => ({
      width: (scrollTop / (3000 - 937)) * 100 + '%',
    }),
    [scrollTop]
  )

  fromEvent(document, 'scroll')
    .pipe(
      throttleTime(200),
      map((e) => (e as any).srcElement.documentElement.scrollTop)
    )
    .subscribe((e) => setScrollTop(e))

  return (
    <div className="scroll-view">
      <span className="scroll-view__box" style={scrollPercent}></span>
    </div>
  )
}
