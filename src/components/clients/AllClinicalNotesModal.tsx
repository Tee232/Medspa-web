import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Table, type TableColumn } from "@/components/ui/Table";
import type { Client, ClinicalNoteRecord } from "@/features/clients/types";

export interface AllClinicalNotesModalProps {
  client: Client | null;
  notes: ClinicalNoteRecord[];
  onClose: () => void;
  onViewNote: (note: ClinicalNoteRecord) => void;
}

export function AllClinicalNotesModal({ client, notes, onClose, onViewNote }: AllClinicalNotesModalProps) {
  if (!client) return null;

  const columns: TableColumn<ClinicalNoteRecord>[] = [
    { key: "date", header: "Date", width: "110px", render: (row) => <span className="font-body text-sm text-[#1C1C1A]">{row.dateLabel}</span> },
    { key: "time", header: "Time", width: "90px", render: (row) => <span className="font-body text-sm text-[#6B7280]">{row.timeLabel}</span> },
    { key: "provider", header: "Provider", width: "110px", render: (row) => <span className="font-body text-sm text-[#6B7280]">{row.provider}</span> },
    { key: "note", header: "Note", render: (row) => <span className="truncate font-body text-sm text-[#6B7280]">{row.preview}</span> },
    { key: "action", header: "", width: "110px", render: (row) => <Button variant="secondary" size="sm" onClick={() => onViewNote(row)}>View Note</Button> },
  ];

  return (
    <Modal open={Boolean(client)} onClose={onClose} title="All Clinical Notes" size="lg">
      <p className="mb-4 font-body text-sm text-[#6B7280]">{client.name}</p>
      <div className="mb-3 flex items-center gap-2">
        <span className="font-heading text-sm font-bold text-[#1C1C1A]">Clinical Notes</span>
        <span className="rounded-full bg-[#1A6B52] px-2 py-0.5 font-body text-[10px] font-bold text-white">{notes.length}</span>
      </div>
      <div className="overflow-x-auto">
        <Table
          className="min-w-[560px]"
          columns={columns}
          data={notes}
          getRowId={(row) => row.id}
          emptyState={<p className="text-center font-body text-sm text-[#6B7280]">No clinical notes on record.</p>}
        />
      </div>
    </Modal>
  );
}
