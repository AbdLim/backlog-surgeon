'use client'

import React, { useState, useEffect } from 'react'

const STATUS_MESSAGES = [
  'Finding the core problem...',
  'Identifying the value-proving action...',
  'Cutting premature features...',
  'Testing the smallest useful MVP...',
]

export function AnalyzingView() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % STATUS_MESSAGES.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card analyzing-card">
      <div className="analyzing-content">
        <div className="surgical-scanner">
          <div className="scanner-line"></div>
          <div className="scanner-pulse"></div>
        </div>

        <div className="analyzing-status">
          <span className="badge badge-clinical badge-pulse">Analyzing Scope</span>
          <p className="status-message" key={msgIndex}>
            {STATUS_MESSAGES[msgIndex]}
          </p>
          <p className="status-subtext">Evaluating assumptions and pruning secondary complexity</p>
        </div>
      </div>
    </div>
  )
}
