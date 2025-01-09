import { useFormContext, useFieldArray, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { UploadArea } from "@/components/upload-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResourceFormData, ResourceType } from "@/app/types/resource"
import { PlusCircle, Trash2, Upload } from 'lucide-react'
import { useState, useCallback} from 'react'
import { useDropzone } from 'react-dropzone'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebaseConfig";

const resourceTypes: ResourceType[] = ["document", "course", "video", "audio"]
const documentFormats = ["PDF", "DOCX", "TXT", "EPUB"]
const videoResolutions = ["720p", "1080p", "1440p", "4K"]
const audioFormats = ["MP3", "WAV", "AAC", "FLAC"]


export function Step2Form() {
  const { register, watch, control, setValue, formState: { errors } } = useFormContext<ResourceFormData>()
  const { fields: modules, append: appendModule, remove: removeModule } = useFieldArray({
    control,
    name: "modules",
  })

  const resourceType = watch("type")
  const [file, setFile] = useState<File | null>(null)

  const getAcceptedFiles = () => {
    switch (resourceType) {
      case "video":
        return {
          'video/*': ['.mp4', '.mov', '.avi']
        }
      case "audio":
        return {
          'audio/*': ['.mp3', '.wav', '.aac', '.flac']
        }
      case "document":
        return {
          'application/pdf': ['.pdf'],
          'application/msword': ['.doc', '.docx'],
          'text/plain': ['.txt'],
          'application/epub+zip': ['.epub']
        }
      default:
        return undefined
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0]
      setFile(uploadedFile)

      const storageRef = ref(storage, `resources/${resourceType}/${uploadedFile.name}`);
      
      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, uploadedFile);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("file url: ", downloadURL)
      
      // Set the fileUrl in the form
      setValue('fileUrl', downloadURL);

      if (resourceType === "video") {
        // Create video element to get metadata
        console.log("form video")
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.src = URL.createObjectURL(uploadedFile)
        
        video.onloadedmetadata = () => {
          // Set duration in minutes
          setValue('videoDetails.duration', Math.ceil(video.duration / 60))
          
          // Determine resolution
          const resolution = video.videoHeight >= 2160 ? "4K" :
                           video.videoHeight >= 1440 ? "1440p" :
                           video.videoHeight >= 1080 ? "1080p" : "720p"
          setValue('videoDetails.resolution', resolution)
          URL.revokeObjectURL(video.src)
        }
      } 
      else if (resourceType === "audio") {
        // Create audio element to get metadata
        console.log("form audio")
        const audio = document.createElement('audio')
        audio.preload = 'metadata'
        audio.src = URL.createObjectURL(uploadedFile)
        
        audio.onloadedmetadata = () => {
          // Set duration in minutes
          setValue('audioDetails.duration', Math.ceil(audio.duration / 60))
          // Set file format
          const format = uploadedFile.name.split('.').pop()?.toUpperCase() || ''
          setValue('audioDetails.fileFormat', format)
          URL.revokeObjectURL(audio.src)
        }
      }
      else if (resourceType === "document") {
        // Set document format based on file extension
        const format = uploadedFile.name.split('.').pop()?.toUpperCase() || ''
        setValue('documentDetails.fileFormat', format)
      }
    }
  }, [resourceType, setValue])


  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: getAcceptedFiles(),
    maxFiles: 1,
    multiple: false
  })

  const renderFileUpload = () => (
    <div {...getRootProps()} className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer">
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag and drop a file here, or click to select</p>
      )}
      {file && (
        <p className="mt-2 text-sm text-gray-500">Selected file: {file.name}</p>
      )}
    </div>
  )

  const handleFileUpload = (file: File) => {
    const fileType = file.type

    // Handle documents
    if (fileType === 'application/pdf') {
      setValue('documentDetails.fileFormat', 'PDF')
    } else if (fileType.includes('msword') || fileType.includes('officedocument')) {
      setValue('documentDetails.fileFormat', 'DOCX')
    } else if (fileType === 'text/plain') {
      setValue('documentDetails.fileFormat', 'TXT')
    } else if (fileType === 'application/epub+zip') {
      setValue('documentDetails.fileFormat', 'EPUB')
    }

    // Handle videos
    if (fileType.startsWith('video/')) {
      // You might need additional logic to determine video resolution
      setValue('videoDetails.resolution', '1080p') // Default or determine from video metadata
    }

    // Handle audio
    if (fileType.startsWith('audio/')) {
      if (fileType === 'audio/mp3') {
        setValue('audioDetails.fileFormat', 'MP3')
      } else if (fileType === 'audio/wav') {
        setValue('audioDetails.fileFormat', 'WAV')
      } else if (fileType === 'audio/aac') {
        setValue('audioDetails.fileFormat', 'AAC')
      } else if (fileType === 'audio/flac') {
        setValue('audioDetails.fileFormat', 'FLAC')
      }
    }
  }
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Resource Type</Label>
            <Select
              onValueChange={(value) => {setValue("type", value as ResourceType); setFile(null)}}
              value={watch("type")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                {resourceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
          </div>

          {(resourceType === "document" || resourceType === "video" || resourceType === "audio") && (
        <div className="space-y-4">
          {renderFileUpload()}
        </div>
      )}
          
 {resourceType === "course" && (
            <div className="space-y-4">
              <Label>Course Modules</Label>
              {modules.map((module, moduleIndex) => (
                <div key={module.id} className="space-y-2 p-4 border border-neutral-200 rounded-md dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`modules.${moduleIndex}.title`}>Module Title</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeModule(moduleIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    id={`modules.${moduleIndex}.title`}
                    {...register(`modules.${moduleIndex}.title` as const, { required: "Module title is required" })}
                    placeholder="Enter module title"
                  />
                  {errors.modules?.[moduleIndex]?.title && (
                    <p className="text-sm text-red-500">{errors.modules[moduleIndex]?.title?.message}</p>
                  )}

                  <Label htmlFor={`modules.${moduleIndex}.chapters`}>Chapters (comma-separated)</Label>
                  <Input
                    id={`modules.${moduleIndex}.chapters`}
                    {...register(`modules.${moduleIndex}.chapters` as const, { required: "At least one chapter is required" })}
                    placeholder="Enter chapter titles, separated by commas"
                  />
                  {errors.modules?.[moduleIndex]?.chapters && (
                    <p className="text-sm text-red-500">{errors.modules[moduleIndex]?.chapters?.message}</p>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendModule({ title: "", chapters: [] })}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </div>
          )}

        </div>
      )
    }

/*
{resourceType === "document" && (
            <div className="space-y-4">
              <UploadArea onFileUpload={handleFileUpload}/>
              <div className="space-y-2">
                <Label htmlFor="documentDetails.fileFormat">File Format</Label>
                <Controller
                  name="documentDetails.fileFormat"
                  control={control}
                  rules={{ required: "File format is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select file format" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentFormats.map((format) => (
                          <SelectItem key={format} value={format}>
                            {format}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.documentDetails?.fileFormat &&
                  <p className="text-sm text-red-500">{errors.documentDetails.fileFormat.message}</p>
                }
              </div>
            </div>
          )}

         

          {resourceType === "video" && (
            <div className="space-y-4">
              <UploadArea onFileUpload={handleFileUpload}/>
              <div className="space-y-2">
                <Label htmlFor="videoDetails.duration">Duration (minutes)</Label>
                <Input
                  type="number"
                  id="videoDetails.duration"
                  {...register("videoDetails.duration", {
                    required: "Duration is required",
                    min: { value: 1, message: "Duration must be at least 1 minute" }
                  })}
                />
                {errors.videoDetails?.duration &&
                  <p className="text-sm text-red-500">{errors.videoDetails.duration.message}</p>
                }
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoDetails.resolution">Resolution</Label>
                <Controller
                  name="videoDetails.resolution"
                  control={control}
                  rules={{ required: "Resolution is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select video resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        {videoResolutions.map((resolution) => (
                          <SelectItem key={resolution} value={resolution}>
                            {resolution}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.videoDetails?.resolution &&
                  <p className="text-sm text-red-500">{errors.videoDetails.resolution.message}</p>
                }
              </div>
            </div>
          )}

          {resourceType === "audio" && (
            <div className="space-y-4">
              <UploadArea onFileUpload={handleFileUpload}/>
              <div className="space-y-2">
                <Label htmlFor="audioDetails.duration">Duration (minutes)</Label>
                <Input
                  type="number"
                  id="audioDetails.duration"
                  {...register("audioDetails.duration", {
                    required: "Duration is required",
                    min: { value: 1, message: "Duration must be at least 1 minute" }
                  })}
                />
                {errors.audioDetails?.duration &&
                  <p className="text-sm text-red-500">{errors.audioDetails.duration.message}</p>
                }
              </div>
              <div className="space-y-2">
                <Label htmlFor="audioDetails.fileFormat">File Format</Label>
                <Controller
                  name="audioDetails.fileFormat"
                  control={control}
                  rules={{ required: "File format is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audio format" />
                      </SelectTrigger>
                      <SelectContent>
                        {audioFormats.map((format) => (
                          <SelectItem key={format} value={format}>
                            {format}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.audioDetails?.fileFormat &&
                  <p className="text-sm text-red-500">{errors.audioDetails.fileFormat.message}</p>
                }
              </div>
            </div>
          )}
*/