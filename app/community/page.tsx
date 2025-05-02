"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const forumTopics = [
  {
    id: "sensory_overload",
    title: "Coping strategies for sensory overload",
    author: "SensoryMom",
    replies: 15,
  },
  {
    id: "educational_resources",
    title: "Educational resources for autistic children",
    author: "TeacherJohn",
    replies: 8,
  },
  {
    id: "occupational_therapy",
    title: "Experiences with occupational therapy",
    author: "TherapyDad",
    replies: 12,
  },
  {
    id: "vacation_ideas",
    title: "Autism-friendly vacation ideas",
    author: "TravelLover",
    replies: 20,
  },
];

export default function CommunityPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Community Forum</h1>
        <Button>Create New Topic</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {forumTopics.map((topic) => (
          <Card key={topic.id} className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors">
            <CardHeader>
              <CardTitle>{topic.title}</CardTitle>
              <CardDescription>Posted by {topic.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{topic.replies} replies</p>
              <Button
                variant="link"
                className="mt-2 p-0"
                onClick={() => router.push(`/community/${topic.id}`)}
              >
                Read more
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

