'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Lightbulb, RefreshCw } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/contexts/ThemeContext'

const exampleAbstracts = [
  {
    title: "Cancer Research",
    content: "Recent advancements in immunotherapy have shown promising results in the treatment of metastatic melanoma. A study conducted on 100 patients demonstrated a 40% increase in 5-year survival rates compared to traditional chemotherapy approaches."
  },
  {
    title: "Neuroscience",
    content: "Neuroplasticity in adult brains has been observed to be more prominent than previously thought. A longitudinal study over 10 years revealed significant structural changes in the hippocampus of individuals engaging in regular cognitive exercises."
  }
]

export default function Home() {
  const [abstract, setAbstract] = useState('')
  const [plainLanguage, setPlainLanguage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('input')

  const handleSubmit = async (e: React.FormEvent) => {de
    e.preventDefault()
    setIsLoading(true)
    // TODO: Replace this with your actual API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setPlainLanguage("This is a simplified version of the abstract. In this study, researchers found new ways to help the immune system fight skin cancer. They tested this on 100 people and found that 40% more people were alive after 5 years compared to older treatments. This is good news because it means we're getting better at treating a difficult type of cancer.")
    setIsLoading(false)
  }

  return (
      <ThemeProvider>
        <div className="flex flex-col min-h-screen">
          <Header setActiveTab={setActiveTab} />
          <main className="flex-grow flex flex-col items-center justify-center p-6 bg-background">
            <Card className="w-full max-w-3xl">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-center text-primary">PLABA ⚕️</CardTitle>
                <CardDescription className="text-center text-muted-foreground text-lg">
                  Plain Language Adaptation of Biomedical Abstracts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-foreground">
                  PLABA simplifies complex biomedical research abstracts into easy-to-understand language.
                  This tool helps patients, caregivers, and the general public access scientific information more easily.
                </p>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="input">Enter Abstract</TabsTrigger>
                    <TabsTrigger value="examples">See Examples</TabsTrigger>
                  </TabsList>
                  <TabsContent value="input">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Textarea
                          placeholder="Enter your biomedical abstract here..."
                          value={abstract}
                          onChange={(e) => setAbstract(e.target.value)}
                          className="min-h-[200px]"
                      />
                      <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                      >
                        {isLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Simplifying...
                            </>
                        ) : (
                            <>
                              Simplify Abstract
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="examples">
                    <div className="space-y-4">
                      {exampleAbstracts.map((example, index) => (
                          <Card key={index}>
                            <CardHeader>
                              <CardTitle className="text-lg">{example.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{example.content}</p>
                              <Button
                                  onClick={() => {
                                    setAbstract(example.content)
                                    setActiveTab('input')
                                  }}
                                  variant="outline"
                                  className="mt-2"
                              >
                                Use this example
                              </Button>
                            </CardContent>
                          </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                {plainLanguage && (
                    <Card className="mt-6 bg-primary/5">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-primary flex items-center">
                          <Lightbulb className="mr-2 h-5 w-5" />
                          Simplified Abstract
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground">{plainLanguage}</p>
                      </CardContent>
                    </Card>
                )}
              </CardContent>
            </Card>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
  )
}

