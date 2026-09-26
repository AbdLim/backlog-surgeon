'use client'

import React from 'react'

interface ErrorViewProps {
  errorMessage: string
  onRetry: () => void
}

export function ErrorView({ errorMessage, onRetry }: ErrorViewProps) {
  return (
    <div className="card error-card">
      <div className="error-header">
        <span className="badge badge-error">Triage Halted</span>
        <h2 className="error-title">Unable to Complete Surgery</h2>
      </div>

      <div className="error-body">
        <p className="error-message">{errorMessage}</p>
      </div>

      <div className="error-actions">
        <button type="button" onClick={onRetry} className="btn btn-secondary">
          <svg
            className="btn-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>Modify Idea & Try Again</span>
        </button>
      </div>
    </div>
  )
}
