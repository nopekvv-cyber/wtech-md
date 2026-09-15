"use client";

import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, TouchSensor, KeyboardSensor, closestCorners, useDroppable, useDraggable, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useTranslations } from "next-intl";
import { initialColumns, extraCounts, fmtMdl, type Card, type ColumnKey } from "./data";
import { track } from "@/lib/analytics";

const COLS: ColumnKey[] = ["new", "contacted", "offer", "won"];
const DOT: Record<ColumnKey, string> = { new: "#6E3BFF", contacted: "#B37BFF", offer: "#FF7A6B", won: "#35E3F0" };

function CardView({ card, industry, dragging, listeners, attributes, setRef, style }: {
  card: Card; industry: string; dragging?: boolean;
  listeners?: Record<string, unknown>; attributes?: Record<string, unknown>;
  setRef?: (el: HTMLElement | null) => void; style?: React.CSSProperties;
}) {
  const t = useTranslations("crm.pipeline");
  return (
    <div
      ref={setRef}
      style={style}
      {...(listeners ?? {})}
      {...(attributes ?? {})}
      className={`crm-panel p-3 flex items-start justify-between gap-2 select-none touch-none cursor-grab active:cursor-grabbing ${dragging ? "opacity-40" : ""}`}
      aria-label={`${card.company}, ${t("dragHint")}`}
    >
      <div className="min-w-0">
        <div className="text-[13px] font-medium truncate">{card.company}</div>
        <div className="text-[11px] text-dim truncate">{industry}</div>
        <div className="text-[11px] text-dim mt-2 tnum">{fmtMdl(card.amount)} · {card.days}d</div>
      </div>
      <span className="shrink-0 w-7 h-7 rounded-full grid place-items-center text-[10px] bg-white/10">{card.initials}</span>
    </div>
  );
}

function DraggableCard({ card, industry, dragging }: { card: Card; industry: string; dragging: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: card.id });
  return (
    <CardView
      card={card}
      industry={industry}
      dragging={dragging}
      setRef={setNodeRef}
      attributes={attributes as unknown as Record<string, unknown>}
      listeners={listeners as unknown as Record<string, unknown>}
      style={{ transform: CSS.Translate.toString(transform) }}
    />
  );
}

function Column({ id, title, count, children }: { id: ColumnKey; title: string; count: number; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const t = useTranslations("crm.pipeline");
  return (
    <div ref={setNodeRef} className={`crm-panel p-2.5 min-w-[172px] transition-colors ${isOver ? "border-white/25" : ""}`}>
      <div className="flex items-center justify-between px-1 pb-2 text-[12px]">
        <span className="inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: DOT[id] }} aria-hidden="true" />{title}</span>
        <span className="text-dim tnum">{count}</span>
      </div>
      <div className="grid gap-2">{children}</div>
      <div className="px-1 pt-2 text-[11px] text-dim">{t("more", { count: extraCounts[id] })}</div>
    </div>
  );
}

export function Kanban() {
  const t = useTranslations("crm");
  const [cols, setCols] = useState(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [interacted, setInteracted] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const find = (id: string): ColumnKey | undefined => COLS.find((c) => cols[c].some((k) => k.id === id));
  const activeCard = activeId ? cols[find(activeId)!]?.find((c) => c.id === activeId) : null;

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
    if (!interacted) { setInteracted(true); track("crm_demo_interact"); }
  }
  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const from = find(String(e.active.id));
    const to = (e.over?.id as ColumnKey | undefined) ?? (e.over ? find(String(e.over.id)) : undefined);
    if (!from || !to || from === to) return;
    setCols((prev) => {
      const card = prev[from].find((c) => c.id === e.active.id)!;
      return { ...prev, [from]: prev[from].filter((c) => c.id !== card.id), [to]: [card, ...prev[to]] };
    });
  }

  return (
    <DndContext id="crm-kanban" sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-4 gap-2 min-w-[720px]">
        {COLS.map((c) => (
          <Column key={c} id={c} title={t(`pipeline.columns.${c}`)} count={cols[c].length + extraCounts[c]}>
            {cols[c].map((card) => (
              <DraggableCard key={card.id} card={card} industry={t(`industries.${card.industry}`)} dragging={activeId === card.id} />
            ))}
          </Column>
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 180 }}>
        {activeCard ? <CardView card={activeCard} industry={t(`industries.${activeCard.industry}`)} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
