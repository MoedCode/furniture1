import { Section } from "@/components/section"
import { getTranslations, getLocale } from "next-intl/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { getApiUrl } from "@/lib/utils"
import { z } from "zod"
import { toast } from "sonner"
import { ArrowLeft, Clock, Eye } from "lucide-react"

const BlogResponseSchema = z.strictObject({
  data: z.strictObject({
    image_url: z.string().url(),
    paragraph: z.string().min(1),
    article: z.array(z.string().min(1)),
  }),
})

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const t = await getTranslations("BlogPage")
  const locale = await getLocale()

  let result: {
    data: z.infer<typeof BlogResponseSchema> | null
    error: any | null
  }

  try {
    const response = await fetch(getApiUrl("/blog/data"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-lang": locale,
      },
      body: JSON.stringify({ blog_id: id }),
    })

    const data = await response.json()
    console.log(`[FETCH] ${getApiUrl("/blog/data")} (${response.status}): `, data)

    if (!response.ok) {
      result = { data: null, error: data }
    } else {
      const validatedData = BlogResponseSchema.safeParse(data)
      if (!validatedData.success) {
        result = { data: null, error: validatedData.error.issues }
      } else {
        result = { data: validatedData.data, error: null }
      }
    }
  } catch (err) {
    toast.error("Failed to fetch blog data:")
    result = { data: null, error: err }
  }

  if (result.error || !result.data) {
    console.error("Blog fetch error:", result.error)
    return (
      <Section className="min-h-screen flex items-center justify-center py-8 md:py-16 lg:py-24" id="blog">
        <div className="container px-4 md:px-6 max-w-2xl">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="flex flex-col items-center text-center p-8 md:p-12">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{t("title")}</h1>
              <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-md">{t("error")}</p>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/blogs">
                  <ArrowLeft className="w-4 h-4" />
                  {t("backButton")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>
    )
  }

  const blog = result.data.data
  const articleContent = processArticleParagraphs(blog.article)

  return (
    <Section>
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <Link href="/blogs">
              <ArrowLeft className="w-4 h-4" />
              {t("backButton")}
            </Link>
          </Button>
        </div>

        {/* Main Article Card */}
        <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-b from-background to-muted/20">
          {/* Hero Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <Image
              src={blog.image_url || "/placeholder.svg"}
              alt={blog.paragraph}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority={true}
            />
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
              <Badge variant="secondary" className="mb-4 bg-white/90 text-black">
                <Clock className="w-3 h-3 mr-1" />
                {Math.ceil(blog.article.length / 3)} min read
              </Badge>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">{blog.paragraph}</h1>
            </div>
          </div>

          {/* Article Content */}
          <CardContent className="p-6 md:p-8 lg:p-12">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-8">
                {articleContent.map((content, index) =>
                  "question" in content ? (
                    <div key={index} className="space-y-4">
                      {index > 0 && <Separator className="my-8" />}

                      {/* Question Section */}
                      <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-lg border-l-4 border-primary">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-4 flex items-start gap-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-1">
                            Q
                          </span>
                          {content.question}
                        </h2>

                        {/* Answers */}
                        {content.answers.length > 0 && (
                          <div className="ml-11 space-y-3">
                            {content.answers.map((answer, idx) => (
                              <div key={idx} className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border">
                                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{answer}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div key={index} className="space-y-4">
                      {index > 0 && <Separator className="my-6" />}
                      <div className="bg-card p-6 rounded-lg border">
                        <p className="text-base md:text-lg leading-relaxed text-foreground">{content.text}</p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Published • {new Date().toLocaleDateString()}</span>
                </div>
                <Button asChild size="lg" className="gap-2 shadow-lg">
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4" />
                    {t("backButton")}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}

type ArticleContent = { question: string; answers: string[] } | { text: string }

function processArticleParagraphs(paragraphs: string[]): ArticleContent[] {
  const result: ArticleContent[] = []
  let currentQuestion: string | null = null
  let currentAnswers: string[] = []

  for (const para of paragraphs) {
    const trimmedPara = para.trim()
    const isQuestion = trimmedPara.endsWith("?") || trimmedPara.endsWith("؟")

    if (isQuestion) {
      if (currentQuestion) {
        result.push({
          question: currentQuestion,
          answers: currentAnswers,
        })
        currentAnswers = []
      }
      currentQuestion = trimmedPara.slice(0, -1).trim()
    } else {
      if (currentQuestion) {
        currentAnswers.push(trimmedPara)
      } else {
        result.push({ text: trimmedPara })
      }
    }
  }

  if (currentQuestion) {
    result.push({
      question: currentQuestion,
      answers: currentAnswers,
    })
  }

  return result
}

