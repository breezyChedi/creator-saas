"'use client'"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UploadAreaProps {
onFileUpload: (file: File) => void

}

export function UploadArea({onFileUpload}: UploadAreaProps) {
  const [files, setFiles] = useState<File[]>([])
  const [category, setCategory] = useState("''")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    if (acceptedFiles[0]) {
      onFileUpload(acceptedFiles[0]) // Call the onFileUpload prop with the first file
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 1, // Only allow one file
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'text/plain': ['.txt'],
      'application/epub+zip': ['.epub'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'audio/*': ['.mp3', '.wav', '.aac', '.flac']
    }
  })

  const handleUpload = () => {
    // Here you would typically send the files to your server
    console.log("'Uploading'", files, "'to category'", category)
    // Reset state after upload
    setFiles([])
    setCategory("''")
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div {...getRootProps()} className="flex-1 border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer">
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {files.length > 0 && (
        <div className="overflow-auto max-h-32">
          <h4 className="font-semibold mb-2">Selected Files:</h4>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index} className="truncate">{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      

      <Button onClick={handleUpload} disabled={files.length === 0 || !category}>
        Upload
      </Button>
    </div>
  )
 

}

 /* 
      <Select onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="resources">Resources</SelectItem>
          <SelectItem value="messages">Messages</SelectItem>
          <SelectItem value="collections">Collections</SelectItem>
        </SelectContent>
      </Select>
 */