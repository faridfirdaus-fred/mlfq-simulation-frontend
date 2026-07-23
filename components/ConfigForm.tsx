"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { SimulationConfig } from "../app/api/utils/types";
import { DEFAULT_CONFIG, CONFIG_TOOLTIPS, CONFIG_CONSTRAINTS } from "../lib/constants";
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
import { RotateCcw, Info, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Panel, QueueChip } from "@/components/mlfq-ui";
import { queueColor } from "@/lib/queue";
import { Settings2 } from "lucide-react";

const formSchema = zod.object({
  num_queues: zod.coerce.number().min(1).max(10),
  time_slice: zod.coerce.number().min(1),
  boost_interval: zod.coerce.number().min(1),
  aging_threshold: zod.coerce.number().min(1),
});

type FormSchemaType = zod.infer<typeof formSchema>;

const FIELDS: {
  name: keyof FormSchemaType;
  label: string;
  description: string;
  tooltip: string;
}[] = [
  {
    name: "num_queues",
    label: "Queues",
    description: "Priority levels (1–10)",
    tooltip: CONFIG_TOOLTIPS.num_queues,
  },
  {
    name: "time_slice",
    label: "Time slice",
    description: "Base quantum for Q0",
    tooltip: CONFIG_TOOLTIPS.time_slice,
  },
  {
    name: "boost_interval",
    label: "Boost interval",
    description: "Ticks between priority boosts",
    tooltip: CONFIG_TOOLTIPS.boost_interval,
  },
  {
    name: "aging_threshold",
    label: "Aging threshold",
    description: "Wait before promotion",
    tooltip: CONFIG_TOOLTIPS.aging_threshold,
  },
];

interface ConfigFormProps {
  onSubmit: (config: SimulationConfig) => void;
  defaultValues?: Partial<FormSchemaType>;
  isSimulationRunning?: boolean;
}

const ConfigForm: React.FC<ConfigFormProps> = ({
  onSubmit,
  defaultValues = DEFAULT_CONFIG,
  isSimulationRunning = false,
}) => {
  const [applied, setApplied] = useState<SimulationConfig>({
    num_queues: defaultValues.num_queues ?? DEFAULT_CONFIG.num_queues,
    time_slice: defaultValues.time_slice ?? DEFAULT_CONFIG.time_slice,
    boost_interval: defaultValues.boost_interval ?? DEFAULT_CONFIG.boost_interval,
    aging_threshold: defaultValues.aging_threshold ?? DEFAULT_CONFIG.aging_threshold,
  });
  const [justApplied, setJustApplied] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: applied,
  });

  const watched = form.watch();
  const numQueues = Math.max(1, Math.min(10, Number(watched.num_queues) || 1));
  const baseSlice = Math.max(1, Number(watched.time_slice) || 1);

  const isChanged = (Object.keys(applied) as (keyof SimulationConfig)[]).some(
    (k) => Number(watched[k]) !== Number(applied[k])
  );

  const quanta = Array.from({ length: numQueues }, (_, i) => ({
    queue: i,
    quantum: baseSlice * (i + 1),
  }));
  const maxQuantum = quanta[quanta.length - 1]?.quantum || 1;

  const handleSubmit = (values: FormSchemaType) => {
    setApplied(values);
    onSubmit(values);
    setJustApplied(true);
    toast.success("Configuration applied", {
      description: `${values.num_queues} queues · base slice ${values.time_slice} units`,
    });
    setTimeout(() => setJustApplied(false), 1600);
  };

  const resetToDefaults = () => {
    form.reset(DEFAULT_CONFIG);
    setApplied(DEFAULT_CONFIG);
    onSubmit(DEFAULT_CONFIG);
    toast.info("Configuration reset to defaults");
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Panel
        title="Scheduler configuration"
        icon={<Settings2 />}
        action={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground"
                onClick={resetToDefaults}
                disabled={isSimulationRunning}
              >
                <RotateCcw className="size-4" />
                <span className="sr-only">Reset to defaults</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset to defaults</TooltipContent>
          </Tooltip>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {FIELDS.map((f) => (
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
                              className="text-muted-foreground/60 hover:text-signal"
                              tabIndex={-1}
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
                          min={CONFIG_CONSTRAINTS[f.name].min}
                          max={CONFIG_CONSTRAINTS[f.name].max}
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

            {/* Time quantum per queue — teaches priority vs quantum tradeoff */}
            <div className="rounded-lg border bg-panel/60 p-3">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="data-label">Time quantum per queue</span>
                <span className="font-mono text-[0.6875rem] text-muted-foreground">
                  q = slice × (level + 1)
                </span>
              </div>
              <div className="space-y-1.5">
                {quanta.map((q) => (
                  <div key={q.queue} className="flex items-center gap-2.5">
                    <QueueChip queue={q.queue} className="w-12 justify-center" />
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-[width] duration-300"
                        style={{
                          width: `${Math.max((q.quantum / maxQuantum) * 100, 6)}%`,
                          background: queueColor(q.queue),
                        }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-xs tabular-nums text-muted-foreground">
                      {q.quantum}u
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2.5 text-xs leading-snug text-muted-foreground">
                Higher-priority queues run first but get a shorter quantum, so
                CPU-bound jobs sink and stay out of the way.
              </p>
            </div>

            <Button
              type="submit"
              variant={isChanged ? "default" : "secondary"}
              className="w-full gap-2"
              disabled={isSimulationRunning || (!isChanged && !justApplied)}
            >
              {justApplied ? (
                <>
                  <Check className="size-4" />
                  Applied
                </>
              ) : isChanged ? (
                "Apply configuration"
              ) : (
                "No changes to apply"
              )}
            </Button>
          </form>
        </Form>
      </Panel>
    </TooltipProvider>
  );
};

export default ConfigForm;
