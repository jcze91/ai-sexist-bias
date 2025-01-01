/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createRef, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { inputSchema, biasAnalyzeSchema } from "@/models/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { experimental_useObject } from "ai/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  Loader2,
  ScanSearch,
  FileText,
  AlertCircle,
  ClipboardCheck,
  Info,
  Search,
  Microscope,
  ShieldAlert,
  ShieldQuestion,
  ShieldCheck,
  Link,
  List,
  Target,
  Text,
  FastForward,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { biasExamples } from "@/data/example";

type FormValues = z.infer<typeof inputSchema>;

let exampleDataIndex = 0;

export default function BiasDetector() {
  const { toast } = useToast();
  const [animationParent] = useAutoAnimate();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      context: "",
      content: "",
      sensitivity: "high",
    },
  });
  const formRef = createRef<HTMLFormElement>();

  const { object, isLoading, error, submit } = experimental_useObject({
    api: "/api/analyze",
    schema: biasAnalyzeSchema,
    onFinish: () => {
      setHasAnalyzed(true);
      setProgress(100);
      toast({
        title: "Analysis completed",
        description: "Your text has been successfully analyzed.",
      });
    },
    onError: (error) => {
      setProgress(100);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to analyze text",
      });
    },
  });

  async function onSubmit(values: FormValues) {
    simulateProgress();
    submit(values);
  }

  const shouldDisplayAnalysis = isLoading || hasAnalyzed;

  return (
    <div className="inset-0 flex min-h-[100dvh] w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
      <div className="mx-auto w-container max-w-full px-5 py-12 text-center">
        <h1 className="text-3xl font-heading md:text-4xl lg:text-5xl">
          <div className="flex items-center justify-center gap-2">
            <Microscope className="h-8 w-8 text-mtext" />
            Sexist Bias Detector
            <Button
              variant="neutral"
              className="text-xs ml-4"
              disabled={isLoading}
              onClick={() => {
                exampleDataIndex = (exampleDataIndex % biasExamples.length) + 1;
                const example = biasExamples[exampleDataIndex];
                form.reset(example);
                formRef.current?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
                formRef.current
                  ?.querySelector<HTMLButtonElement>("button[type=submit]")
                  ?.focus();
              }}
            >
              <FastForward className="h-4 w-4" />
              Quick demo
            </Button>
          </div>
          <p className="mt-4 font-light text-sm max-w-2xl mx-auto ">
            Improve your professional communications by detecting potential
            biases and getting personalized suggestions for more inclusive
            language.
          </p>
        </h1>
      </div>

      <div
        className={`w-full max-w-7xl transition-all duration-300 pb-6
        ${shouldDisplayAnalysis ? "px-4 md:px-6 lg:px-8" : "px-4 md:px-0"}`}
        ref={animationParent}
      >
        <div
          className={`flex flex-col gap-4 transition-all duration-300 md:flex-row
          ${
            shouldDisplayAnalysis
              ? "justify-between"
              : "items-center justify-center"
          }`}
        >
          <Card
            className={`w-full transition-all duration-300
            ${shouldDisplayAnalysis ? "md:w-4/12" : "md:max-w-xl"}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Submit your content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  ref={formRef}
                >
                  <FormField
                    control={form.control}
                    name="context"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Context
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Example: professional interview feedback, offer letter..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <ClipboardCheck className="h-4 w-4" />
                          Content
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the content to analyze..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="sensitivity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Analysis Sensitivity
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sensitivity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">
                              <span className="flex items-center gap-2">
                                Low - Basic analysis
                              </span>
                            </SelectItem>
                            <SelectItem value="medium">
                              <span className="flex items-center gap-2">
                                Medium - Standard detection
                              </span>
                            </SelectItem>
                            <SelectItem value="high">
                              <span className="flex items-center gap-2">
                                High - Thorough scan
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <Button
                    type="submit"
                    variant="neutral"
                    disabled={isLoading}
                    className="w-full"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          Analyze
                        </>
                      )}
                    </div>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {shouldDisplayAnalysis && (
            <Card className="w-full md:w-8/12 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ScanSearch className="h-5 w-5" />
                    Analysis Results
                  </div>
                  {isLoading && (
                    <span className="text-sm text-muted-foreground">
                      Analyzing in real-time...
                    </span>
                  )}
                </CardTitle>
                {isLoading && (
                  <Progress
                    value={progress}
                    className="h-2 w-full transition-all duration-300"
                  />
                )}
              </CardHeader>
              <CardContent>
                {object?.result && object.result.length > 0 ? (
                  <div className="overflow-x-auto">
                    {object?.potential_impact && (
                      <div className="mt-2 bg-muted/20 rounded-lg">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Potential Impact
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {object.potential_impact}
                        </p>
                      </div>
                    )}
                    <div className="mt-4 bg-muted/20 rounded-lg">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <List className="h-4 w-4" />
                        Bias list
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[30px] whitespace-nowrap"></TableHead>
                            <TableHead className="w-[150px] whitespace-nowrap">
                              Type
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Passage
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Explanation
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Suggestion
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {object.result.map((bias, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-center">
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div>
                                      {bias?.severity === "high" && (
                                        <ShieldAlert className="h-4 w-4 text-red-500 mx-auto" />
                                      )}
                                      {bias?.severity === "medium" && (
                                        <ShieldQuestion className="h-4 w-4 text-orange-500 mx-auto" />
                                      )}
                                      {bias?.severity === "low" && (
                                        <ShieldCheck className="h-4 w-4 text-muted-foreground mx-auto" />
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{bias?.severity}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                {bias?.type && (
                                  <Badge variant="neutral">{bias?.type}</Badge>
                                )}
                              </TableCell>
                              <TableCell className="bg-muted/50">
                                {bias?.passage}
                              </TableCell>
                              <TableCell>{bias?.explanation}</TableCell>
                              <TableCell className="bg-muted/20">
                                {bias?.suggestion}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {object?.corrected_text && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Text className="h-4 w-4" />
                          Corrected text suggestion
                        </h3>
                        <p className="space-y-2 text-sm whitespace-pre-line	">
                          {object?.corrected_text}
                        </p>
                      </div>
                    )}
                    {object?.references && object.references.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          References
                        </h3>
                        <ul className="space-y-2 text-sm">
                          {object.references.map((ref, index) => (
                            <li key={index}>
                              <a
                                href={ref?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {ref?.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center gap-2 text-sm text-muted-foreground">
                    {error ? (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-destructive">
                          Error: {error.message}
                        </span>
                      </>
                    ) : (
                      "No biases detected in the analyzed text"
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
