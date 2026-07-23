"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Process } from "../app/api/utils/types";
import { SAMPLE_PROCESSES } from "../lib/constants";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Cpu, Check, Info, Plus, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Panel } from "@/components/mlfq-ui";

const formSchema = z.object({
  pid: z.string().min(1, { message: "Process ID is required" }),
  arrival_time: z.coerce.number().min(0),
  burst_time: z.coerce.number().min(1),
  priority: z.coerce.number().min(0),
  io_time: z.coerce.number().min(0),
});

type FormSchemaType = z.infer<typeof formSchema>;

const NUMERIC_FIELDS: {
  name: Exclude<keyof FormSchemaType, "pid">;
  label: string;
  description: string;
  tooltip: string;
  min: number;
}[] = [
  {
    name: "arrival_time",
    label: "Arrival",
    description: "When it enters the ready queue",
    tooltip: "Time unit at which the process arrives in the system.",
    min: 0,
  },
  {
    name: "burst_time",
    label: "CPU burst",
    description: "Total CPU time required",
    tooltip: "Total CPU time the process needs to finish.",
    min: 1,
  },
  {
    name: "io_time",
    label: "I/O time",
    description: "Time blocked on I/O",
    tooltip: "Time spent on I/O after the CPU burst; keeps a job at high priority.",
    min: 0,
  },
  {
    name: "priority",
    label: "Priority",
    description: "Lower = higher priority",
    tooltip: "Initial priority, which sets the starting queue (0 = highest).",
    min: 0,
  },
];

function processType(io: number, burst: number) {
  if (io === 0) return { label: "CPU-bound", color: "var(--info)" };
  if (io > burst) return { label: "I/O-bound", color: "var(--state-finished)" };
  return { label: "Mixed", color: "var(--signal)" };
}

const TEMPLATES: { key: keyof typeof SAMPLE_PROCESSES; label: string }[] = [
  { key: "basic", label: "Basic" },
  { key: "cpuBound", label: "CPU-bound" },
  { key: "ioBound", label: "I/O-bound" },
  { key: "mixed", label: "Mixed" },
];

interface ProcessFormProps {
  onSubmit: (process: Process) => void;
  processCount?: number;
}

const ProcessForm: React.FC<ProcessFormProps> = ({
  onSubmit,
  processCount = 0,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pid: `P${processCount + 1}`,
      arrival_time: 0,
      burst_time: 1,
      priority: 0,
      io_time: 0,
    },
  });

  const w = form.watch();
  const type = processType(Number(w.io_time) || 0, Number(w.burst_time) || 0);

  const handleSubmit = (values: FormSchemaType) => {
    onSubmit({
      pid: values.pid,
      arrival_time: values.arrival_time,
      burst_time: values.burst_time,
      io_time: values.io_time,
      priority: values.priority,
      execution_log: [],
      first_execution_time: null,
      state: "ready",
      queue: values.priority,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
    form.reset({
      pid: `P${processCount + 2}`,
      arrival_time: 0,
      burst_time: 1,
      priority: 0,
      io_time: 0,
    });
  };

  const loadTemplate = (key: keyof typeof SAMPLE_PROCESSES) => {
    const t = SAMPLE_PROCESSES[key]?.[0];
    if (!t) return;
    form.setValue("pid", `P${processCount + 1}`);
    form.setValue("arrival_time", t.arrival_time);
    form.setValue("burst_time", t.burst_time);
    form.setValue("priority", t.priority);
    form.setValue("io_time", t.io_time);
    toast.info(`Loaded ${key} template`);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Panel
        title="Add process"
        icon={<Cpu />}
        meta={
          <span
            className="inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5"
            style={{
              color: type.color,
              borderColor: `color-mix(in oklch, ${type.color} 35%, transparent)`,
              background: `color-mix(in oklch, ${type.color} 12%, transparent)`,
            }}
          >
            {type.label}
          </span>
        }
        action={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                Template
                <ChevronDown className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Load first process from…</DropdownMenuLabel>
              {TEMPLATES.map((t) => (
                <DropdownMenuItem key={t.key} onClick={() => loadTemplate(t.key)}>
                  {t.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="pid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Process ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`P${processCount + 1}`}
                      {...field}
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Unique across all processes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {NUMERIC_FIELDS.map((f) => (
                <FormField
                  key={f.name}
                  control={form.control}
                  name={f.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 text-sm">
                        {f.label}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              tabIndex={-1}
                              className="text-muted-foreground/60 hover:text-signal"
                              aria-label={`About ${f.label}`}
                            >
                              <Info className="size-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs text-xs">
                            {f.tooltip}
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={f.min}
                          {...field}
                          className="font-mono tabular-nums"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {f.description}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Button type="submit" className="w-full gap-2">
              {justAdded ? (
                <>
                  <Check className="size-4" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Add process
                </>
              )}
            </Button>
          </form>
        </Form>
      </Panel>
    </TooltipProvider>
  );
};

export default ProcessForm;
