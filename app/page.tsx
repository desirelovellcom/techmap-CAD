import TechSchematicEditor from "@/components/tech-schematic-editor"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">TechMap CAD</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Project: Untitled</span>
          </div>
        </div>
      </header>
      <TechSchematicEditor />
    </main>
  )
}
