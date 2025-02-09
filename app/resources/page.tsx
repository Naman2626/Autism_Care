import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chatbot } from "@/components/Chatbot"

export default function ResourcesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Autism Resources</h1>
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About Autism</TabsTrigger>
          <TabsTrigger value="caregiving">Caregiving Strategies</TabsTrigger>
          <TabsTrigger value="chatbot">Ask a Question</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Autism</CardTitle>
              <CardDescription>Learn about Autism Spectrum Disorder (ASD)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is Autism?</h3>
                <p className="text-gray-700">
                  Autism, or Autism Spectrum Disorder (ASD), is a complex developmental condition that involves persistent
                  challenges in social interaction, speech and nonverbal communication, and restricted/repetitive
                  behaviors. The effects of autism and the severity of symptoms are different in each person.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Early Signs</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Limited eye contact</li>
                  <li>Delayed speech or no speech</li>
                  <li>Repetitive behaviors</li>
                  <li>Difficulty with changes in routine</li>
                  <li>Unusual reactions to sensory experiences</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="caregiving">
          <Card>
            <CardHeader>
              <CardTitle>Caregiving Strategies</CardTitle>
              <CardDescription>Helpful strategies for parents and caregivers</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Create and maintain consistent daily routines</li>
                <li>Use visual schedules and clear instructions</li>
                <li>Provide a sensory-friendly environment</li>
                <li>Practice positive reinforcement</li>
                <li>Encourage social interaction at their comfort level</li>
                <li>Work with professionals for specialized support</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chatbot">
          <Card>
            <CardHeader>
              <CardTitle>Ask Our AI Assistant</CardTitle>
              <CardDescription>Get answers to your questions about autism care</CardDescription>
            </CardHeader>
            <CardContent>
              <Chatbot />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

