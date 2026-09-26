'use client'

import React, { useState } from 'react'
import { AppState, AnalyzeResponse } from '@/lib/schema'
import { InputView } from './InputView'
import { AnalyzingView } from './AnalyzingView'
import { ResultsView } from './ResultsView'
import { ErrorView } from './ErrorView'

export function TriageApp() {
  const [state, setState] = useState<AppState>({
    phase: 'input',
    inputText: '',
  })

  const handleInputChange = (text: string) => {
    setState((prev) => ({
      ...prev,
      inputText: text,
    }))
  }

  const handleAnalyze = async () => {
    const currentInput = state.inputText.trim()
    if (!currentInput) return

    setState({
      phase: 'analyzing',
      inputText: state.inputText,
    })

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: currentInput }),
      })

      const json = (await res.json()) as AnalyzeResponse

      if (json.ok) {
        setState({
          phase: 'results',
          inputText: state.inputText,
          result: json.data,
        })
      } else {
        setState({
          phase: 'error',
          inputText: state.inputText,
          errorMessage:
            json.error?.message ||
            'The surgery didn’t go as planned. Your idea is untouched. Try the analysis again.',
        })
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setState({
        phase: 'error',
        inputText: state.inputText,
        errorMessage:
          'Network connection interrupted during surgery. Your idea is untouched. Try again.',
      })
    }
  }

  const handleReset = () => {
    setState({
      phase: 'input',
      inputText: '',
    })
  }

  const handleRetry = () => {
    setState({
      phase: 'input',
      inputText: state.inputText,
    })
  }

  return (
    <main className="app-container">
      {state.phase === 'input' && (
        <InputView
          value={state.inputText}
          onChange={handleInputChange}
          onSubmit={handleAnalyze}
        />
      )}

      {state.phase === 'analyzing' && <AnalyzingView />}

      {state.phase === 'results' && (
        <ResultsView
          result={state.result}
          originalInput={state.inputText}
          onReset={handleReset}
        />
      )}

      {state.phase === 'error' && (
        <ErrorView errorMessage={state.errorMessage} onRetry={handleRetry} />
      )}
    </main>
  )
}
