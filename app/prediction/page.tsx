"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

export default function PredictionPage() {
  const [result, setResult] = useState<string | null>(null)
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({})
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const symptoms = [
    // Column 1 symptoms
    [
      { id: 'eye_contact', label: 'Limited or Inconsistent Eye Contact' },
      { id: 'name_response', label: 'Poor Response to Name' },
      { id: 'joint_attention', label: 'Difficulty with Joint Attention' },
      { id: 'imitation', label: 'Limited Imitation Skills' },
      { id: 'social_smiling', label: 'Reduced Social Smiling' },
      { id: 'repetitive_movements', label: 'Repetitive Movements' },
      { id: 'sensory_interests', label: 'Unusual Sensory Interests' },
      { id: 'gestures', label: 'Limited Use of Gestures' },
      { id: 'speech', label: 'Delayed Speech/Babbling' },
      { id: 'pretend_play', label: 'Limited Pretend Play' },
      { id: 'peer_interaction', label: 'Difficulty with Peer Interaction' },
      { id: 'routine_adherence', label: 'Strong Adherence to Routine' },
      { id: 'sound_sensitivity', label: 'Hypersensitivity to Sound' },
      { id: 'facial_expressions', label: 'Limited Facial Expressions' },
      { id: 'toe_walking', label: 'Walking on Toes' },
    ],
    // Column 2 symptoms
    [
      { id: 'pain_response', label: 'Unusual Response to Pain' },
      { id: 'monotone_voice', label: 'Monotone Voice' },
      { id: 'echolalia', label: 'Echolalia (Repeating Words/Phrases)' },
      { id: 'physical_contact', label: 'Avoids Physical Contact' },
      { id: 'eating_habits', label: 'Unusual Eating Habits' },
      { id: 'motor_development', label: 'Delayed Motor Development' },
      { id: 'object_attachment', label: 'Strong Attachment to Objects' },
      { id: 'emotion_understanding', label: 'Difficulty Understanding Emotions' },
      { id: 'social_games', label: 'Lack of Interest in Social Games' },
      { id: 'repetitive_speech', label: 'Repetitive Speech Patterns' },
      { id: 'object_fixation', label: 'Fixation on Specific Objects' },
      { id: 'parent_worries', label: 'Significant Parent Concerns' },
      { id: 'social_interest', label: 'Limited Social Interest' },
      { id: 'communication', label: 'Communication Difficulties' },
      { id: 'behavioral_changes', label: 'Resistance to Changes' },
    ]
  ]

  const handleCheckboxChange = (symptomId: string) => {
    setCheckedItems(prev => ({ ...prev, [symptomId]: !prev[symptomId] }))
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      // Simulating upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
        }
      }, 500)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const checkedCount = Object.values(checkedItems).filter(Boolean).length
    const percentage = (checkedCount / (symptoms[0].length + symptoms[1].length)) * 100
    
    // Initial result based on questionnaire
    setResult(`Based on the questionnaire, there's a ${percentage.toFixed(2)}% likelihood of autism traits.`)
    
    // If there's a video, process it
    if (videoFile) {
      try {
        // Here you'll add your video processing API call
        // For now, we'll just update the result
        setResult(prev => 
          `${prev} Video analysis complete. Please consult with a specialist for a comprehensive evaluation.`
        )
      } catch (error) {
        console.error('Error processing video:', error)
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Autism Traits Assessment</h1>
      
      {/* Questionnaire Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Behavioral Assessment</CardTitle>
          <CardDescription>Please check all behaviors that you have observed</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
              {/* Column 1 */}
              <div className="space-y-4">
                {symptoms[0].map((symptom) => (
                  <div key={symptom.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom.id}
                      checked={checkedItems[symptom.id] || false}
                      onCheckedChange={() => handleCheckboxChange(symptom.id)}
                    />
                    <Label
                      htmlFor={symptom.id}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {symptom.label}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                {symptoms[1].map((symptom) => (
                  <div key={symptom.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom.id}
                      checked={checkedItems[symptom.id] || false}
                      onCheckedChange={() => handleCheckboxChange(symptom.id)}
                    />
                    <Label
                      htmlFor={symptom.id}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {symptom.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Video Upload Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Video Analysis</CardTitle>
          <CardDescription>Upload a video of the child's behavior for AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Input 
            type="file" 
            accept="video/*" 
            onChange={handleVideoUpload}
            className="mb-4"
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Progress value={uploadProgress} className="mt-2" />
          )}
          {uploadProgress === 100 && (
            <p className="mt-2 text-green-600">Upload complete!</p>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button onClick={handleSubmit} className="w-full mb-6">
        Submit Assessment
      </Button>

      {/* Results Card */}
      {result && (
        <Card className="bg-accent">
          <CardContent className="pt-6">
            <p className="font-semibold">{result}</p>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>This assessment tool is for screening purposes only and does not replace professional medical advice.</p>
        <p>Please consult with a healthcare provider for proper evaluation and diagnosis.</p>
      </div>
    </div>
  )
}

