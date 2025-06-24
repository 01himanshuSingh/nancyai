'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CreateAgentPage() {
  const [name, setName] = useState('')
  const [instruction, setInstruction] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async () => {
    setStatus('idle')
    try {
      const res = await fetch('/api/agent/createagent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, instruction }),
      })

      if (!res.ok) throw new Error('Failed to create agent')
      setStatus('success')
      setName('')
      setInstruction('')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-blue-600">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">
            Create New Agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Agent Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
              placeholder="Agent Instructions"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={4}
            />
            <Button onClick={handleSubmit} className="w-full">
              Create Agent
            </Button>

            {status === 'success' && (
              <p className="text-green-600 text-sm">✅ Agent created successfully!</p>
            )}
            {status === 'error' && (
              <p className="text-red-600 text-sm">❌ Something went wrong!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
