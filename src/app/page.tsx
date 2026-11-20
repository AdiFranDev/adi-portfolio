import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold underline">Hello, Adrian.</h1>
      <Button className="mt-4">Hello</Button>
      <ThemeToggle />
    </main>
  )
}
