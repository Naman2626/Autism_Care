"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const forumTopics = [
  {
    id: "sensory_overload",
    title: "Coping strategies for sensory overload",
    author: "SensoryMom",
    messages: [
      { text: "Noise-cancelling headphones have been a game changer for my son during loud events. Highly recommend!", author: "ParentA" },
      { text: "We created a 'calm corner' at home with soft lighting and weighted blankets. It helps my daughter decompress after school.", author: "Therapist1" },
      { text: "I use visual schedules to prepare my child for potentially overwhelming situations. It reduces anxiety a lot.", author: "CaregiverX" },
      { text: "Chewing necklaces and fidget toys are great for redirecting sensory needs in public places.", author: "SensoryMom" },
      { text: "We practice deep breathing and gentle squeezes when my son starts to feel overloaded. It helps him self-regulate.", author: "DadB" },
      { text: "Dim lighting and soft music in the evenings help our whole family wind down. Routine is key!", author: "TeacherZ" },
    ],
  },
  {
    id: "educational_resources",
    title: "Educational resources for autistic children",
    author: "TeacherJohn",
    messages: [
      { text: "Khan Academy Kids is free and has lots of visual learning tools. My students love it!", author: "TeacherJohn" },
      { text: "We use Boardmaker for communication boards. It's been a huge help for nonverbal kids.", author: "SLP_Eve" },
      { text: "Visual schedules and social stories from Twinkl have made transitions much easier for my child.", author: "ParentC" },
      { text: "ABCmouse is engaging and lets you track progress. Great for early learners.", author: "MomD" },
      { text: "Check out the free resources from Autism Speaks. They have toolkits for different age groups.", author: "DadE" },
    ],
  },
  {
    id: "occupational_therapy",
    title: "Experiences with occupational therapy",
    author: "TherapyDad",
    messages: [
      { text: "OT helped my son improve his fine motor skills. He can now button his shirt and tie his shoes!", author: "TherapyDad" },
      { text: "Sensory integration therapy made a big difference in my daughter's tolerance for different textures.", author: "ParentE" },
      { text: "Our therapist gave us home exercises, like using playdough and squeezing stress balls. It's fun and effective.", author: "CaregiverF" },
      { text: "We saw progress after a few months, especially with handwriting and using utensils.", author: "OT_Sam" },
      { text: "Ask your OT about adaptive tools for eating and dressing. They can make daily routines easier.", author: "ParentG" },
    ],
  },
  {
    id: "vacation_ideas",
    title: "Autism-friendly vacation ideas",
    author: "TravelLover",
    messages: [
      { text: "We visited a sensory-friendly zoo day—staff were trained and there were quiet zones. Highly recommend!", author: "TravelLover" },
      { text: "Disney parks offer Disability Access Service passes. It made our trip much less stressful.", author: "MomH" },
      { text: "We always bring familiar snacks, headphones, and a favorite toy to help with transitions.", author: "DadI" },
      { text: "Look for hotels with quiet floors or suites. Some even offer sensory kits if you ask ahead.", author: "ParentG" },
      { text: "Plan for downtime each day and don't over-schedule. Flexibility is important for our family.", author: "Therapist2" },
      { text: "We use visual travel schedules and preview photos of places to help our child know what to expect.", author: "CaregiverJ" },
    ],
  },
];

export default function TopicChatPage() {
  const params = useParams();
  const topicId = params?.topicId as string;
  const topic = forumTopics.find((t) => t.id === topicId);
  const [messages, setMessages] = useState(topic ? [...topic.messages] : []);
  const [input, setInput] = useState("");
  const [author, setAuthor] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim() || !author.trim()) return;
    setMessages((prev) => [...prev, { text: input, author }]);
    setInput("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  if (!topic) {
    return <div className="max-w-2xl mx-auto py-8">Topic not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{topic.title}</CardTitle>
          <div className="text-gray-500 text-sm">Posted by {topic.author}</div>
        </CardHeader>
        <CardContent>
          <div className="h-[32rem] overflow-y-auto bg-gray-50 p-4 rounded mb-4 border">
            {messages.length === 0 && <div className="text-gray-400">No messages yet.</div>}
            {messages.map((msg, idx) => (
              <div key={idx} className="mb-5">
                <div className="font-semibold text-blue-700">{msg.author}</div>
                <div className="bg-white rounded p-3 shadow text-gray-800 whitespace-pre-line">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-1/4"
            />
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 