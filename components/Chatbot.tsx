import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Chatbot() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Autism Support Chatbot</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4">
            <div className="text-left">
              <span className="inline-block p-2 rounded-lg bg-secondary text-secondary-foreground">
                Hello! I'm here to help answer your questions about autism. What would you like to know?
              </span>
            </div>
            {/* Messages will be displayed here when connected to an API */}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="flex w-full space-x-2">
          <Input placeholder="Type your question here..." />
          <Button>Send</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

