"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Download, Share2, Trash2, FileImage } from "lucide-react"

// Sample data - in a real app, this would come from your database
const sampleResults = [
  {
    id: "result-001",
    filename: "sample-slide-001.jpg",
    date: "2023-03-15T10:30:00",
    result: "Benign",
    confidence: 97.8,
    status: "completed",
  },
  {
    id: "result-002",
    filename: "sample-slide-002.jpg",
    date: "2023-03-14T14:45:00",
    result: "Malignant",
    confidence: 94.3,
    status: "completed",
  },
  {
    id: "result-003",
    filename: "sample-slide-003.jpg",
    date: "2023-03-12T09:15:00",
    result: "Benign",
    confidence: 89.5,
    status: "completed",
  },
  {
    id: "result-004",
    filename: "sample-slide-004.jpg",
    date: "2023-03-10T16:20:00",
    result: "Malignant",
    confidence: 98.2,
    status: "completed",
  },
  {
    id: "result-005",
    filename: "sample-slide-005.jpg",
    date: "2023-03-08T11:05:00",
    result: "Benign",
    confidence: 92.7,
    status: "completed",
  },
]

export default function ResultsTable() {
  const [results, setResults] = useState(sampleResults)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleDelete = (id: string) => {
    setResults(results.filter((result) => result.id !== id))
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Filename</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.length > 0 ? (
            results.map((result) => (
              <TableRow key={result.id}>
                <TableCell className="font-medium">
                  <Link href={`/results/${result.id}`} className="hover:underline text-primary">
                    {result.filename}
                  </Link>
                </TableCell>
                <TableCell>{formatDate(result.date)}</TableCell>
                <TableCell>
                  <Badge variant={result.result === "Malignant" ? "destructive" : "outline"}>{result.result}</Badge>
                </TableCell>
                <TableCell>{result.confidence}%</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/results/${result.id}`} className="flex items-center w-full">
                          <FileImage className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Result
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(result.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

