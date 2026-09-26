'use client'

import React, { useState } from 'react'
import { TriageResult, FeatureItem } from '@/lib/schema'
import { formatTriageMarkdown } from '@/lib/markdown'

interface ResultsViewProps {
  result: TriageResult
  originalInput: string
  onReset: () => void
}

export function ResultsView({ result, originalInput, onReset }: ResultsViewProps) {
  const [copied, setCopied] = useState(false)
  const [showRawInput, setShowRawInput] = useState(false)

  const handleCopy = async () => {
    try {
      const markdown = formatTriageMarkdown(result, originalInput)
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard', err)
    }
  }

  return (
    <div className="results-container">
      {/* Top Action Bar */}
      <div className="results-action-bar">
        <div className="results-meta">
          <span className="badge badge-success">Triage Complete</span>
          <span className="results-title-sub">Defensible MVP Scope</span>
        </div>
        <div className="action-buttons">
          <button
            type="button"
            className={`btn ${copied ? 'btn-copied' : 'btn-secondary'}`}
            onClick={handleCopy}
          >
            {copied ? (
              <>
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
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
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy Result</span>
              </>
            )}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onReset}>
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Triage Another</span>
          </button>
        </div>
      </div>

      {/* 1. Diagnostic Summary Grid (4 cards) */}
      <section className="diagnostic-summary">
        <h2 className="section-label">Diagnostic Summary</h2>
        <div className="diagnostic-grid">
          <div className="card diag-card">
            <div className="diag-header">
              <span className="diag-tag tag-problem">01 // Problem</span>
              <h3 className="diag-title">Core User Problem</h3>
            </div>
            <p className="diag-body">{result.coreProblem}</p>
          </div>

          <div className="card diag-card">
            <div className="diag-header">
              <span className="diag-tag tag-risk">02 // Critical Risk</span>
              <h3 className="diag-title">Riskiest Assumption</h3>
            </div>
            <p className="diag-body">{result.riskiestAssumption}</p>
          </div>

          <div className="card diag-card">
            <div className="diag-header">
              <span className="diag-tag tag-mvp">03 // Kernel</span>
              <h3 className="diag-title">Smallest Useful MVP</h3>
            </div>
            <p className="diag-body">{result.smallestMVP}</p>
          </div>

          <div className="card diag-card">
            <div className="diag-header">
              <span className="diag-tag tag-criteria">04 // Validation</span>
              <h3 className="diag-title">Success Criteria</h3>
            </div>
            <p className="diag-body">{result.successCriteria}</p>
          </div>
        </div>
      </section>

      {/* 2. Feature Triage Columns (Build Now / Build Later / Don't Build) */}
      <section className="feature-triage-section">
        <h2 className="section-label">Feature Triage Verdict</h2>
        <div className="triage-columns">
          {/* Build Now Column */}
          <div className="triage-column col-now">
            <div className="col-header">
              <div className="col-title-row">
                <span className="status-dot dot-now"></span>
                <h3 className="col-title">Build Now</h3>
                <span className="col-count count-now">{result.buildNow.length}</span>
              </div>
              <p className="col-desc">Essential to prove core value. Nothing else belongs here.</p>
            </div>
            <div className="item-list">
              {result.buildNow.length === 0 ? (
                <p className="empty-notice">No essential features detected.</p>
              ) : (
                result.buildNow.map((item, idx) => (
                  <FeatureCard key={idx} item={item} tier="now" />
                ))
              )}
            </div>
          </div>

          {/* Build Later Column */}
          <div className="triage-column col-later">
            <div className="col-header">
              <div className="col-title-row">
                <span className="status-dot dot-later"></span>
                <h3 className="col-title">Build Later</h3>
                <span className="col-count count-later">{result.buildLater.length}</span>
              </div>
              <p className="col-desc">Useful extensions, but safe to defer past day one.</p>
            </div>
            <div className="item-list">
              {result.buildLater.length === 0 ? (
                <p className="empty-notice">No deferrable features found.</p>
              ) : (
                result.buildLater.map((item, idx) => (
                  <FeatureCard key={idx} item={item} tier="later" />
                ))
              )}
            </div>
          </div>

          {/* Don't Build Column */}
          <div className="triage-column col-dont">
            <div className="col-header">
              <div className="col-title-row">
                <span className="status-dot dot-dont"></span>
                <h3 className="col-title">Don’t Build</h3>
                <span className="col-count count-dont">{result.dontBuild.length}</span>
              </div>
              <p className="col-desc">Premature complexity, distractions, or off-kernel bloat.</p>
            </div>
            <div className="item-list">
              {result.dontBuild.length === 0 ? (
                <p className="empty-notice">No features eliminated.</p>
              ) : (
                result.dontBuild.map((item, idx) => (
                  <FeatureCard key={idx} item={item} tier="dont" />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Collapsible Original Input */}
      {originalInput && (
        <section className="raw-input-section">
          <button
            type="button"
            className="raw-input-toggle"
            onClick={() => setShowRawInput(!showRawInput)}
          >
            <span className="raw-toggle-label">
              {showRawInput ? '▾ Hide Evaluated Input' : '▸ Show Evaluated Input'}
            </span>
            <span className="raw-toggle-hint">({originalInput.length} characters)</span>
          </button>
          {showRawInput && (
            <div className="raw-input-body">
              <pre className="raw-text">{originalInput}</pre>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

function FeatureCard({ item, tier }: { item: FeatureItem; tier: 'now' | 'later' | 'dont' }) {
  return (
    <div className={`card feature-card card-${tier}`}>
      <h4 className="feature-name">{item.feature}</h4>
      <p className="feature-rationale">{item.rationale}</p>
    </div>
  )
}
