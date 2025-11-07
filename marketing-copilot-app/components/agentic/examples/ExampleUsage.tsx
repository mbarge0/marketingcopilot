'use client'

/**
 * Example Usage of Agentic Animation System
 * Demonstrates how to use agentic animations in different contexts
 */

import React, { useState } from 'react'
import { AgentThinking, AgentPhase, AgentActivity } from '@/components/agentic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Example 1: Simple Status Display
 */
export function ExampleSimpleStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simple Status</CardTitle>
      </CardHeader>
      <CardContent>
        <AgentThinking
          phase="cognition"
          activity="analyzing"
          showWaveform={true}
          compact={true}
        />
      </CardContent>
    </Card>
  )
}

/**
 * Example 2: Full Workflow with Progress
 */
export function ExampleFullWorkflow() {
  const [phase, setPhase] = useState<AgentPhase>('idle')
  const [activity, setActivity] = useState<AgentActivity>('planning')
  const [currentStep, setCurrentStep] = useState(0)

  const activitySequence: AgentActivity[] = [
    'planning',
    'analyzing',
    'searching',
    'generating',
    'optimizing',
    'executing',
  ]

  const startWorkflow = async () => {
    // Phase 1: Initiation
    setPhase('initiation')
    setActivity('planning')
    setCurrentStep(0)

    // Phase 2: Cognition
    setTimeout(() => {
      setPhase('cognition')
      setActivity('analyzing')
      setCurrentStep(1)
    }, 300)

    // Simulate work progression
    setTimeout(() => {
      setActivity('searching')
      setCurrentStep(2)
    }, 1500)

    setTimeout(() => {
      setActivity('generating')
      setCurrentStep(3)
    }, 2500)

    // Phase 3: Acting
    setTimeout(() => {
      setPhase('acting')
      setActivity('optimizing')
      setCurrentStep(4)
    }, 3500)

    setTimeout(() => {
      setActivity('executing')
      setCurrentStep(5)
    }, 4500)

    // Phase 4: Resolution
    setTimeout(() => {
      setPhase('resolving')
    }, 5500)

    // Complete
    setTimeout(() => {
      setPhase('complete')
      setTimeout(() => {
        setPhase('idle')
        setCurrentStep(0)
      }, 800)
    }, 6500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Full Workflow Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AgentThinking
          phase={phase}
          activity={activity}
          activitySequence={activitySequence}
          currentStep={currentStep}
          showWaveform={true}
          showProgress={true}
        />
        <Button onClick={startWorkflow} disabled={phase !== 'idle'}>
          {phase === 'idle' ? 'Start Workflow' : 'Processing...'}
        </Button>
      </CardContent>
    </Card>
  )
}

/**
 * Example 3: Chat Integration
 */
export function ExampleChatIntegration() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [phase, setPhase] = useState<AgentPhase>('idle')
  const [activity, setActivity] = useState<AgentActivity>('planning')

  const handleSubmit = async () => {
    setIsProcessing(true)
    setPhase('initiation')

    setTimeout(() => {
      setPhase('cognition')
      setActivity('analyzing')
    }, 200)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setTimeout(() => {
      setPhase('acting')
      setActivity('generating')
    }, 2200)

    setTimeout(() => {
      setPhase('resolving')
    }, 3500)

    setTimeout(() => {
      setPhase('complete')
      setIsProcessing(false)
      setTimeout(() => setPhase('idle'), 800)
    }, 4000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat Integration Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProcessing && (
          <AgentThinking
            phase={phase}
            activity={activity}
            showWaveform={true}
            compact={true}
          />
        )}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask your AI Co-Pilot..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            disabled={isProcessing}
          />
          <Button onClick={handleSubmit} disabled={isProcessing}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Example 4: Dashboard Data Refresh
 */
export function ExampleDataRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [phase, setPhase] = useState<AgentPhase>('idle')

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setPhase('cognition')

    // Simulate data fetch
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setPhase('acting')
    await new Promise((resolve) => setTimeout(resolve, 500))

    setPhase('resolving')
    setTimeout(() => {
      setPhase('complete')
      setIsRefreshing(false)
      setTimeout(() => setPhase('idle'), 500)
    }, 600)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Refresh Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isRefreshing && (
          <AgentThinking
            phase={phase}
            activity="searching"
            showWaveform={true}
            compact={true}
          />
        )}
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </CardContent>
    </Card>
  )
}

