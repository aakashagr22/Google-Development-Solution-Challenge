import { Button } from "./ui/button.jsx"

export function MapControls({ className }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button variant="outline" size="icon" className="bg-background">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
          <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
          <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
          <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
        </svg>
        <span className="sr-only">Zoom</span>
      </Button>
      <Button variant="outline" size="icon" className="bg-background">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        <span className="sr-only">Toggle satellite view</span>
      </Button>
      <Button variant="outline" size="icon" className="bg-background">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11 11 6 6" />
        </svg>
        <span className="sr-only">Measure distance</span>
      </Button>
    </div>
  )
}

