'use client'

import React from 'react'
import { SAMPLE_PROMPTS } from '@/lib/samples'

interface InputViewProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export function InputView({ value, onChange, onSubmit }: InputViewProps) {
  const isSubmittable = value.trim().length > 0

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd+Enter or Ctrl+Enter submits
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isSubmittable) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="card input-card">
      <header className="app-header">
        <div className="header-badge-row">
          <span className="badge badge-clinical">Surgical Scope Triage</span>
        </div>
        <h1 className="app-title">Backlog Surgeon</h1>
        <p className="app-tagline">
          Ruthless, opinionated product scoping. Paste your messy idea or backlog dump — we cut the bloat and extract the defensible kernel.
        </p>
      </header>

      <div className="samples-section">
        <span className="samples-label">Try a bloated sample idea:</span>
        <div className="samples-list">
          {SAMPLE_PROMPTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className="sample-pill"
              onClick={() => onChange(sample.text)}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (isSubmittable) onSubmit()
        }}
        className="input-form"
      >
        <div className="textarea-wrapper">
          <textarea
            id="idea-input"
            className="idea-textarea"
            rows={7}
            placeholder="Paste your feature wish-list, client request, or raw brain dump here... (e.g. 'I want to build an app with auth, payments, AI chatbot, mobile app, dark mode, social feed...')"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="form-actions">
          <span className="helper-text">
            {isSubmittable ? 'Press ⌘+Enter or click to triage' : 'Enter an idea or pick a sample above'}
          </span>
          <button
            type="submit"
            id="analyze-button"
            className="btn btn-primary"
            disabled={!isSubmittable}
          >
            <span>Analyze Scope</span>
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
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}
