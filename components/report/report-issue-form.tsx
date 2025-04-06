"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, MapPin, AlertTriangle, UploadCloud, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Define the form validation schema
const formSchema = z.object({
  issueType: z.enum(["pollution", "deforestation", "waste", "flooding", "other"], {
    required_error: "Please select an issue type.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  date: z.date({
    required_error: "Please select a date when you observed this issue.",
  }),
  severity: z.enum(["low", "medium", "high"], {
    required_error: "Please select the severity level.",
  }),
  contactInfo: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .optional(),
})

export default function ReportIssueForm() {
  const [isUploading, setIsUploading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issueType: undefined,
      location: "",
      description: "",
      date: new Date(),
      severity: undefined,
      contactInfo: "",
    },
  })

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, we would send this data to an API
    console.log(values)
    console.log("Images:", images)

    // Show success message
    toast({
      title: "Report submitted successfully",
      description: "Thank you for reporting this issue. We'll look into it right away.",
    })

    // Redirect to a thank you page
    setTimeout(() => {
      router.push("/report-success")
    }, 1500)
  }

  // Handle file upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return

    setIsUploading(true)

    // In a real app, we would upload the files to a server
    // For now, we'll just simulate the upload
    setTimeout(() => {
      const newImages = Array.from(event.target.files!).map((file) => {
        return URL.createObjectURL(file)
      })

      setImages([...images, ...newImages])
      setIsUploading(false)

      toast({
        title: "Images uploaded",
        description: `${newImages.length} image${newImages.length > 1 ? "s" : ""} uploaded successfully`,
      })
    }, 1500)
  }

  // Handle removing an image
  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  // Handle accessing the camera
  const handleTakePhoto = () => {
    // In a real app, we would use the MediaDevices API
    toast({
      title: "Camera access requested",
      description: "Please allow access to your camera to take a photo.",
    })
  }

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation features.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Getting your location",
      description: "Please wait while we determine your current location...",
    })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, we would use a reverse geocoding service
        // For now, we'll just use the coordinates
        const location = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
        form.setValue("location", location)

        toast({
          title: "Location detected",
          description: "Your current location has been added to the form.",
        })
      },
      (error) => {
        toast({
          title: "Location error",
          description: error.message,
          variant: "destructive",
        })
      },
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Report Environmental Issue
        </CardTitle>
        <CardDescription>
          Help us monitor environmental issues in your area by reporting problems you observe. Your reports will be
          verified and added to our monitoring system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="issueType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pollution" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Pollution</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="deforestation" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Deforestation</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="waste" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Illegal Waste</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="flooding" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Flooding</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Other Issue</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="Enter location details" {...field} />
                    </FormControl>
                    <Button type="button" variant="outline" size="icon" onClick={getCurrentLocation}>
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription>Enter an address or use your current location</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Observed</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-2"
                      >
                        <FormItem className="flex flex-col items-center space-y-1">
                          <FormControl>
                            <RadioGroupItem value="low" className="sr-only" />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              "w-full py-2 border rounded-md text-center cursor-pointer",
                              field.value === "low" ? "bg-green-100 border-green-500 dark:bg-green-900/30" : "",
                            )}
                          >
                            Low
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-col items-center space-y-1">
                          <FormControl>
                            <RadioGroupItem value="medium" className="sr-only" />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              "w-full py-2 border rounded-md text-center cursor-pointer",
                              field.value === "medium" ? "bg-yellow-100 border-yellow-500 dark:bg-yellow-900/30" : "",
                            )}
                          >
                            Medium
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-col items-center space-y-1">
                          <FormControl>
                            <RadioGroupItem value="high" className="sr-only" />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              "w-full py-2 border rounded-md text-center cursor-pointer",
                              field.value === "high" ? "bg-red-100 border-red-500 dark:bg-red-900/30" : "",
                            )}
                          >
                            High
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about the environmental issue you're reporting"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Upload Images</FormLabel>
              <div className="mt-2 flex flex-col gap-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={() => document.getElementById("file-upload")?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : (
                      <UploadCloud className="h-4 w-4" />
                    )}
                    <span>{isUploading ? "Uploading..." : "Upload Files"}</span>
                  </Button>

                  <Button type="button" variant="outline" className="flex items-center gap-2" onClick={handleTakePhoto}>
                    <Camera className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only">Take Photo</span>
                  </Button>

                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Uploaded image ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-5 w-5"
                          onClick={() => removeImage(index)}
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Upload images related to the issue. This helps us verify and assess the situation better.
              </p>
            </div>

            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email (Optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide your email if you'd like to receive updates about this report
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Submit Report</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

