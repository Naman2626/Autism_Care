"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from 'react';

export function PredictionForm() {
  const [formData, setFormData] = useState<number[]>(new Array(31).fill(0));
  const [result, setResult] = useState<{ prediction: string; autism_probability: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoResult, setVideoResult] = useState<{ prediction: string } | null>(null);

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const newFormData = [...formData];
    newFormData[index] = checked ? 1 : 0;
    setFormData(newFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      // Log the data being sent
      console.log("Sending data:", formData);

      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          features: formData
        })
      });

      // Log the response status
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!data || !data.prediction || !data.autism_probability) {
        throw new Error("Invalid response format from API");
      }

      setResult(data);

    } catch (error) {
      console.error('Error details:', error);
      alert('Failed to get prediction. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setVideoUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:8000/predict/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setVideoResult(data);
    } catch (error) {
      console.error('Video upload error:', error);
      alert('Failed to process video. Please try again.');
    } finally {
      setVideoUploading(false);
    }
  };

  const questions = [
    "Limited or Inconsistent Eye Contact",
    "Poor Response to Name",
    "Difficulty with Joint Attention",
    "Limited Imitation Skills",
    "Reduced Social Smiling",
    "Repetitive Movements",
    "Unusual Sensory Interests",
    "Limited Use of Gestures",
    "Delayed Speech/Babbling",
    "Limited Pretend Play",
    "Difficulty with Peer Interaction",
    "Strong Adherence to Routine",
    "Hypersensitivity to Sound",
    "Limited Facial Expressions",
    "Walking on Toes",
    "Unusual Response to Pain",
    "Monotone Voice",
    "Echolalia (Repeating Words/Phrases)",
    "Avoids Physical Contact",
    "Unusual Eating Habits",
    "Delayed Motor Development",
    "Strong Attachment to Objects",
    "Difficulty Understanding Emotions",
    "Lack of Interest in Social Games",
    "Repetitive Speech Patterns",
    "Fixation on Specific Objects",
    "Significant Parent Concerns",
    "Limited Social Interest",
    "Communication Difficulties",
    "Resistance to Changes",
    "Additional Behavioral Concerns"
  ];

  return (
    <div className="space-y-8">
      {/* Behavioral Assessment Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Behavioral Assessment</CardTitle>
            <p className="text-muted-foreground">Please check all behaviors that you have observed</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.map((question, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`q${index + 1}`} 
                    onCheckedChange={(checked) => handleCheckboxChange(index, checked as boolean)}
                  />
                  <Label htmlFor={`q${index + 1}`}>{question}</Label>
                </div>
              ))}
            </div>
            
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-6"
            >
              {isLoading ? 'Getting Prediction...' : 'Submit Assessment'}
            </Button>

            {/* Show API prediction result below submit button */}
            {result && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="text-xl font-bold mb-4">Assessment Result</h3>
                <div className="space-y-2">
                  <p className="text-lg">
                    Prediction: <span className="font-bold text-primary">{result.prediction}</span>
                  </p>
                  <p className="text-lg">
                    Probability: <span className="font-bold text-primary">{result.autism_probability}</span>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>

      {/* Video Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Video Analysis</CardTitle>
          <p className="text-muted-foreground">Upload a video of the child's behavior for AI analysis</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              type="file" 
              accept="video/*" 
              onChange={handleVideoUpload}
              disabled={videoUploading}
            />
            {videoUploading && (
              <div className="text-center text-primary">
                Processing video... Please wait...
              </div>
            )}
            {videoResult && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Video Analysis Result</h4>
                <p>Prediction: <span className="font-bold text-primary">{videoResult.prediction}</span></p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 