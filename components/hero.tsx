import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-primary/20 to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl"> The Hook Tech Free Innovation Summit 2025</h1>
          <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
            Join us for a day of inspiration, learning, and networking with industry leaders
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="outline" asChild>
              <Link href="#registration">Register Now</Link>
            </Button>
            {/* <Button variant="outline" size="lg">
              Learn More
            </Button> */}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <div className="mb-2 text-3xl font-bold">5000+</div>
              <div className="text-muted-foreground">Attendees</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 text-3xl font-bold">25+</div>
              <div className="text-muted-foreground">Speakers</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 text-3xl font-bold">10+</div>
              <div className="text-muted-foreground">Workshops</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  )
}

