import React, { createContext, useState, useCallback } from 'react'

export const AnalysisContext = createContext()

export const AnalysisProvider = ({ children }) => {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const setResult = useCallback((result) => {
    setAnalysisResult(result)
    setError(null)
  }, [])

  const setErrorMessage = useCallback((message) => {
    setError(message)
    setAnalysisResult(null)
  }, [])

  const clearResult = useCallback(() => {
    setAnalysisResult(null)
    setError(null)
  }, [])

  return (
    <AnalysisContext.Provider 
      value={{
        analysisResult,
        loading,
        error,
        setResult,
        setLoading,
        setErrorMessage,
        clearResult,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}
