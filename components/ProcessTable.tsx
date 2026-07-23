import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Process } from "../app/api/utils/types";
import { ListTree, Trash2 } from "lucide-react";
import { Panel, QueueChip } from "@/components/mlfq-ui";

interface ProcessTableProps {
  processes: Process[];
  onRemove?: (pid: string) => void;
}

const num = (v: number | undefined) =>
  v !== undefined ? (
    <span className="font-mono tabular-nums text-foreground">{v}</span>
  ) : (
    <span className="text-muted-foreground">—</span>
  );

const ProcessTable: React.FC<ProcessTableProps> = ({ processes, onRemove }) => {
  if (!processes.length) return null;

  return (
    <Panel
      title="Process set"
      icon={<ListTree />}
      meta={`${processes.length} queued`}
      bodyClassName="p-0"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="data-label">PID</TableHead>
              <TableHead className="data-label text-right">Arrival</TableHead>
              <TableHead className="data-label text-right">CPU burst</TableHead>
              <TableHead className="data-label text-right">I/O</TableHead>
              <TableHead className="data-label">Priority</TableHead>
              {onRemove && <TableHead className="w-10" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((process) => (
              <TableRow key={process.pid} className="border-border/60">
                <TableCell>
                  <span className="font-mono text-sm font-medium text-foreground">
                    {process.pid}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {num(process.arrival_time)}
                </TableCell>
                <TableCell className="text-right">
                  {num(process.burst_time)}
                </TableCell>
                <TableCell className="text-right">
                  {num(process.io_time)}
                </TableCell>
                <TableCell>
                  <QueueChip queue={process.priority ?? 0} />
                </TableCell>
                {onRemove && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(process.pid)}
                      className="size-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Remove {process.pid}</span>
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Panel>
  );
};

export default ProcessTable;
