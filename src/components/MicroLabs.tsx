"use client";

import { useState, type ReactNode } from "react";
import type { Project, TelemetryEntry } from "@/types/project";

interface MicroLabProps {
  project: Project;
  telemetry?: TelemetryEntry;
  faultActive: boolean;
  onFaultChange: (active: boolean, note: string) => void;
}

interface LabInnerProps {
  telemetry?: TelemetryEntry;
  faultActive: boolean;
  onFaultChange: (active: boolean, note: string) => void;
}

function PdfCraftLab({ onFaultChange }: LabInnerProps): ReactNode {
  const [pages, setPages] = useState<string[]>([
    "Pág. 01 · Portada del contrato",
    "Pág. 02 · Anexo financiero",
    "Pág. 03 · Cláusula y firma",
  ]);
  const [activeIdx, setActiveIdx] = useState<number>(2);
  const [rotation, setRotation] = useState<number>(0);
  const [signed, setSigned] = useState<boolean>(true);
  const [log, setLog] = useState<string>("Motor local listo · 0 bytes enviados fuera del navegador.");

  const swapFirstTwo = () => {
    setPages((prev) => [prev[1], prev[0], prev[2]]);
    onFaultChange(false, "Reordenamiento local en memoria: pdf-lib actualiza el árbol de páginas al instante.");
    setLog("Páginas 01 y 02 reordenadas en RAM · 0 peticiones HTTP.");
  };

  const rotatePage = () => {
    const next = (rotation + 90) % 360;
    setRotation(next);
    onFaultChange(false, `Transformación de matriz local (${next}°) sin subir archivo a nube.`);
    setLog(`Hoja activa rotada a ${next}° · pdf.js Canvas actualizado.`);
  };

  const toggleSign = () => {
    const next = !signed;
    setSigned(next);
    onFaultChange(false, "Trazado vectorial incrustado directo en los bytes del PDF local.");
    setLog(next ? "Firma local incrustada · Hash SHA-256 local regenerado." : "Firma removida del borrador local.");
  };

  return (
    <>
      <div className="lab-head">
        <span className="lab-title">PdfCraft · Lienzo privado</span>
        <div className="lab-controls">
          <button type="button" className="lab-btn" onClick={swapFirstTwo}>
            Intercambiar 1 ↔ 2
          </button>
          <button type="button" className="lab-btn" onClick={rotatePage}>
            Rotar {rotation}° → {(rotation + 90) % 360}°
          </button>
          <button type="button" className="lab-btn lab-btn-primary" aria-pressed={signed} onClick={toggleSign}>
            {signed ? "Firma aplicada ✓" : "Estampar firma"}
          </button>
        </div>
      </div>
      <div className="lab-surface">
        <div className="lab-pdf-grid">
          <div className="lab-pdf-thumbs">
            {pages.map((title, idx) => (
              <button
                key={title}
                type="button"
                className={`lab-pdf-thumb ${activeIdx === idx ? "is-active" : ""}`}
                onClick={() => setActiveIdx(idx)}
              >
                {title.split(" · ")[0]}
              </button>
            ))}
          </div>
          <div className="lab-pdf-sheet" style={{ transform: `rotate(${rotation}deg)` }}>
            <div>
              <span className="mono">{pages[activeIdx]}</span>
              <p style={{ margin: "8px 0 0", fontSize: 14 }}>
                Documento manipulado por <strong>pdf-lib</strong> dentro de tu navegador sin backend ni
                cargas externas.
              </p>
            </div>
            {signed ? <span className="lab-sig-mark">D. Díaz</span> : <span className="mono">[Sin firma]</span>}
          </div>
        </div>
      </div>
      <div className="lab-log">{log}</div>
    </>
  );
}

const MERKAT_DOCS: Record<
  "joyeria" | "textil" | "fragancia",
  { label: string; items: { name: string; price: string; meta: string }[]; doc: object }
> = {
  joyeria: {
    label: "Joyería",
    items: [
      { name: "Anillo Sol 18k", price: "$ 120", meta: "talla: 7 · oro reciclado" },
      { name: "Collar Meridiano", price: "$ 195", meta: "largo: 45 cm · plata 925" },
    ],
    doc: {
      category: "jewelry",
      material: "18k recycled gold",
      ringSizes: [5, 6, 7, 8],
      hallmark: "CO-925",
    },
  },
  textil: {
    label: "Textil",
    items: [
      { name: "Abrigo Seda Nº 4", price: "$ 86", meta: "talla: M · lino lavado" },
      { name: "Camisa Taller", price: "$ 72", meta: "talla: L · algodón orgánico" },
    ],
    doc: {
      category: "apparel",
      fabricWeightGsm: 240,
      sizes: ["S", "M", "L"],
      care: "cold wash only",
    },
  },
  fragancia: {
    label: "Fragancias",
    items: [
      { name: "Ámbar Nocturno 50 ml", price: "$ 64", meta: "notas: cedro, bergamota" },
      { name: "Bruma Verde 30 ml", price: "$ 48", meta: "concentración: EDP 18 %" },
    ],
    doc: {
      category: "fragrance",
      volumeMl: 50,
      notes: ["bergamot", "cedarwood", "vetiver"],
      concentration: "EDP 18%",
    },
  },
};

function MerkatLab({ telemetry, onFaultChange }: LabInnerProps): ReactNode {
  const [cat, setCat] = useState<"joyeria" | "textil" | "fragancia">("joyeria");
  const [cacheMiss, setCacheMiss] = useState<boolean>(false);

  const selectCategory = (next: "joyeria" | "textil" | "fragancia") => {
    setCat(next);
    setCacheMiss(false);
    onFaultChange(false, `Redis CQRS entregó la proyección de ${MERKAT_DOCS[next].label} en ~4 ms sin joins.`);
  };

  const triggerMiss = () => {
    const next = !cacheMiss;
    setCacheMiss(next);
    onFaultChange(
      next,
      next
        ? "Cache MISS: consulta directa a MongoDB BSON e hidratación asíncrona de TTL en Redis."
        : "Cache HIT restaurado en Redis CQRS.",
    );
  };

  const current = MERKAT_DOCS[cat];
  const liveHint =
    telemetry?.status === "live" && telemetry.latencyMs !== null
      ? `API Railway live (${telemetry.latencyMs} ms) · `
      : "";

  return (
    <>
      <div className="lab-head">
        <span className="lab-title">Merkat · Esquema polimórfico NoSQL</span>
        <div className="lab-controls">
          {(["joyeria", "textil", "fragancia"] as const).map((key) => (
            <button
              key={key}
              type="button"
              className="lab-btn"
              aria-pressed={cat === key}
              onClick={() => selectCategory(key)}
            >
              {MERKAT_DOCS[key].label}
            </button>
          ))}
          <button
            type="button"
            className="lab-btn lab-btn-alert"
            aria-pressed={cacheMiss}
            onClick={triggerMiss}
          >
            {cacheMiss ? "Restaurar HIT Redis" : "Forzar Cache MISS"}
          </button>
        </div>
      </div>
      <div className="lab-surface">
        <div className="lab-cards-row">
          {current.items.map((item) => (
            <div className="lab-mini-card" key={item.name}>
              <strong>{item.name}</strong>
              <div>{item.price}</div>
              <span className="mono">{item.meta}</span>
            </div>
          ))}
        </div>
        <pre className="lab-json-pre">{JSON.stringify(current.doc, null, 2)}</pre>
      </div>
      <div className="lab-log">
        {liveHint}
        {cacheMiss
          ? "MISS en Redis → Query MongoDB (atributos propios sin modelo EAV) → Cache warmup 28 ms."
          : "HIT en Redis CQRS → Lectura de facetas polimórficas en 4 ms."}
      </div>
    </>
  );
}

function PulseFlowLab({ onFaultChange }: LabInnerProps): ReactNode {
  const [version, setVersion] = useState<number>(3);
  const [conflict, setConflict] = useState<boolean>(false);
  const [assignee, setAssignee] = useState<string>("Tú (borrador v3)");

  const simulateConflict = () => {
    setConflict(true);
    setAssignee("Ana acaba de guardar v4 (colisión con tu v3)");
    onFaultChange(
      true,
      "HTTP 409 ERR-OPTIMISTIC-LOCK: tu PATCH traía version=3 pero el servidor ya avanzó a version=4.",
    );
  };

  const resolve = (mode: "accept" | "reapply") => {
    setConflict(false);
    if (mode === "accept") {
      setVersion(4);
      setAssignee("Sincronizado con Ana (v4)");
      onFaultChange(false, "Resolución limpia: adoptaste v4 de Ana sin sobrescribir cambios.");
    } else {
      setVersion(5);
      setAssignee("Reaplicado sobre v4 → v5 publicado");
      onFaultChange(false, "CAS exitoso sobre v4 → nuevo commit v5 emitido por SSE a los demás editores.");
    }
  };

  return (
    <>
      <div className="lab-head">
        <span className="lab-title">PulseFlow · Concurrencia en vivo</span>
        <div className="lab-controls">
          <button type="button" className="lab-btn lab-btn-alert" onClick={simulateConflict}>
            Simular edición simultánea
          </button>
          {conflict ? (
            <>
              <button type="button" className="lab-btn" onClick={() => resolve("accept")}>
                Aceptar v4 (Ana)
              </button>
              <button type="button" className="lab-btn lab-btn-primary" onClick={() => resolve("reapply")}>
                Reaplicar → v5
              </button>
            </>
          ) : null}
        </div>
      </div>
      <div className="lab-surface">
        <div className="lab-head">
          <span className="mono">Tarjeta #PF-42 · Tablero Producto</span>
          <span className="mono">{conflict ? "Estado: 409 OCC CAS" : `Versión actual: v${version}`}</span>
        </div>
        <div className={`lab-kanban-card ${conflict ? "is-conflict" : ""}`}>
          <strong>Actualizar pasarela de cobro</strong>
          <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.88 }}>{assignee}</p>
        </div>
      </div>
      <div className="lab-log">
        {conflict
          ? "PATCH /incidents/42 (expected_version=3) → 409 CONFLICT · Trabajo de ambos preservado."
          : `Bitácora append-only íntegra · último evento SSE emitido para versión v${version}.`}
      </div>
    </>
  );
}

function CortexLab({ onFaultChange }: LabInnerProps): ReactNode {
  const [mode, setMode] = useState<"grounded" | "ungrounded">("grounded");

  const ask = (next: "grounded" | "ungrounded") => {
    setMode(next);
    const isFault = next === "ungrounded";
    onFaultChange(
      isFault,
      isFault
        ? "Similitud por debajo de umbral (0.14): guardrail bloquea la generación para no alucinar."
        : "BM25 + vector RRF recupera fragmento exacto (score 0.91) con cita obligatoria.",
    );
  };

  return (
    <>
      <div className="lab-head">
        <span className="lab-title">Cortex · Guardrail con citas</span>
        <div className="lab-controls">
          <button
            type="button"
            className="lab-btn lab-btn-primary"
            aria-pressed={mode === "grounded"}
            onClick={() => ask("grounded")}
          >
            Pregunta con soporte
          </button>
          <button
            type="button"
            className="lab-btn lab-btn-alert"
            aria-pressed={mode === "ungrounded"}
            onClick={() => ask("ungrounded")}
          >
            Pregunta fuera de corpus
          </button>
        </div>
      </div>
      <div className="lab-surface">
        {mode === "grounded" ? (
          <>
            <p style={{ margin: 0, fontWeight: 600 }}>
              Pregunta: ¿Cada cuánto se reemplaza el filtro de alta presión?
            </p>
            <div className="lab-cite-box">
              <strong>Respuesta verificada:</strong> Cada 500 horas de uso continuo o al notar caída de
              presión.
              <br />
              <span className="mono">Fuente literal [manual-planta.pdf · p. 12 · RRF 0.91]</span>
            </div>
          </>
        ) : (
          <>
            <p style={{ margin: 0, fontWeight: 600 }}>
              Pregunta: ¿Cuál será la tarifa oficial del repuesto en 2027?
            </p>
            <div className="lab-cite-box is-refusal">
              <strong>Respuesta bloqueada por guardrail:</strong> No existen fragmentos en los documentos
              indexados que mencionen tarifas de 2027 (similitud máxima 0.14 &lt; umbral 0.55).
            </div>
          </>
        )}
      </div>
      <div className="lab-log">
        {mode === "grounded"
          ? "Eval Citation Groundedness: 100 % respaldado por manual-planta.pdf · p. 12."
          : "Hallucination Guardrail: negativa verificable en vez de inventar un precio."}
      </div>
    </>
  );
}

function LedgerCoreLab({ onFaultChange }: LabInnerProps): ReactNode {
  const [balance, setBalance] = useState<number>(2480);
  const [entries, setEntries] = useState<
    { label: string; amount: string; note: string }[]
  >([{ label: "Saldo inicial auditado", amount: "+ $2,480.00", note: "Cuentas cuadran ∑ = $0.00" }]);
  const [status, setStatus] = useState<string>(
    "Libro de doble partida equilibrado · Llave SHA-256 lista.",
  );

  const sendDoubleClick = () => {
    setBalance((prev) => prev - 120);
    setEntries((prev) => [
      { label: "Envío a Ana (2ª petición: replay idempotente)", amount: "$0.00 extra", note: "Misma llave k-9f2a · sin doble cargo" },
      { label: "Envío a Ana (1ª petición ejecutada)", amount: "− $120.00", note: "Asiento Débito/Crédito ∑=0" },
      ...prev.slice(0, 2),
    ]);
    onFaultChange(false, "Dos envíos con idempotency-key k-9f2a producen exactamente 1 débito y 1 replay.");
    setStatus("Doble clic absorbido: 1 débito real (−$120.00) + 1 replay idempotente.");
  };

  const simulateSettlementFault = () => {
    onFaultChange(
      true,
      "Cámara de liquidación rechazó: la Saga orquestada ejecuta asiento compensatorio +$120.00.",
    );
    setEntries((prev) => [
      { label: "Reverso automático Saga (compensación)", amount: "+ $120.00", note: "Saldo devuelto al instante" },
      { label: "Reserva fallida en cámara externa", amount: "− $120.00", note: "Compensado" },
      ...prev.slice(0, 2),
    ]);
    setStatus("Fallo compensado por Saga · ∑(débitos + créditos) = $0.00.");
  };

  const reset = () => {
    setBalance(2480);
    setEntries([{ label: "Saldo inicial auditado", amount: "+ $2,480.00", note: "Cuentas cuadran ∑ = $0.00" }]);
    onFaultChange(false, "Libro restaurado en flujo nominal de doble partida.");
    setStatus("Libro reiniciado · $2,480.00 verificados.");
  };

  return (
    <>
      <div className="lab-head">
        <span className="lab-title">LedgerCore · Idempotencia y Saga</span>
        <div className="lab-controls">
          <button type="button" className="lab-btn lab-btn-primary" onClick={sendDoubleClick}>
            Enviar $120 (Doble clic x2)
          </button>
          <button type="button" className="lab-btn lab-btn-alert" onClick={simulateSettlementFault}>
            Simular fallo y reverso
          </button>
          <button type="button" className="lab-btn" onClick={reset}>
            Reiniciar
          </button>
        </div>
      </div>
      <div className="lab-surface">
        <div className="lab-head">
          <div className="lab-wallet-balance">$ {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          <span className="mono">Suma de asientos: $0.00</span>
        </div>
        <div className="lab-wallet-rows">
          {entries.map((entry, idx) => (
            <div className="lab-wallet-row" key={`${entry.label}-${idx}`}>
              <span>
                <strong>{entry.label}</strong> · {entry.note}
              </span>
              <strong>{entry.amount}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="lab-log">{status}</div>
    </>
  );
}

function FieldNotesLab({ onFaultChange }: LabInnerProps): ReactNode {
  const [offline, setOffline] = useState<boolean>(true);
  const [queueCount, setQueueCount] = useState<number>(2);
  const [conflict, setConflict] = useState<boolean>(false);
  const [notes, setNotes] = useState<string[]>([
    "Poste 14 · Tensión nominal 13.8 kV",
    "Válvula B · Sello sustituido en campo",
  ]);
  const [status, setStatus] = useState<string>("Modo avión activo · 2 cambios guardados en SQLite local.");

  const toggleOffline = () => {
    const next = !offline;
    setOffline(next);
    if (!next && !conflict) {
      setQueueCount(0);
      onFaultChange(false, "Conexión restaurada: cola SQLite drenada con reloj Lamport incremental.");
      setStatus("Sincronización completa al reconectar · 0 pendientes.");
    } else {
      onFaultChange(next, "Sin cobertura celular: mutaciones van directo a la cola SQLite local.");
      setStatus("Modo avión activo · escribiendo sin conexión.");
    }
  };

  const addNote = () => {
    const label = `Inspección #${notes.length + 1} · Lectura verificada`;
    setNotes((prev) => [label, ...prev]);
    if (offline) {
      const nextQ = queueCount + 1;
      setQueueCount(nextQ);
      onFaultChange(true, `Nota guardada en SQLite local (cola pendiente: ${nextQ}).`);
      setStatus(`Nota guardada offline · ${nextQ} pendientes en SQLite.`);
    } else {
      onFaultChange(false, "Nota sincronizada en el acto hacia el backend de campo.");
      setStatus("Nota enviada directo a Sync API.");
    }
  };

  const triggerConflict = () => {
    setConflict(true);
    onFaultChange(true, "Choque 3-Way detectado: edición local vs servidor requieren decisión explícita.");
    setStatus("Conflicto en Válvula B: elige si conservas tu nota, la del servidor o ambas.");
  };

  const resolveConflict = (choice: string) => {
    setConflict(false);
    setOffline(false);
    setQueueCount(0);
    onFaultChange(false, `Resolución "${choice}" aplicada y replicada sin pérdida silenciosa.`);
    setStatus(`Choque resuelto (${choice}) · Cola sincronizada.`);
  };

  return (
    <>
      <div className="lab-head">
        <span className="lab-title">FieldNotes · Móvil sin internet</span>
        <div className="lab-controls">
          <button
            type="button"
            role="switch"
            aria-checked={offline}
            className="lab-switch"
            onClick={toggleOffline}
          >
            {offline ? "Modo avión: ON" : "Modo avión: OFF"}
          </button>
          <button type="button" className="lab-btn lab-btn-primary" onClick={addNote}>
            + Nota offline
          </button>
          <button type="button" className="lab-btn lab-btn-alert" onClick={triggerConflict}>
            Provocar choque
          </button>
        </div>
      </div>
      <div className="lab-surface">
        <div className="lab-phone-bezel">
          <div className="mono" style={{ fontSize: 10, color: "#9a3412", fontWeight: 700 }}>
            {offline ? `SIN SEÑAL · ${queueCount} EN COLA SQLITE` : "EN LÍNEA · SINCRONIZADO"}
          </div>
          {notes.slice(0, 3).map((item) => (
            <div className="lab-note-item" key={item}>
              <span>{item}</span>
              <span className="mono">{offline ? "local" : "sync"}</span>
            </div>
          ))}
          {conflict ? (
            <div style={{ paddingTop: 6, borderTop: "1px solid #9a3412" }}>
              <span className="mono">Choque en Válvula B:</span>
              <div className="lab-controls" style={{ marginTop: 6 }}>
                <button type="button" className="lab-btn" onClick={() => resolveConflict("Mía")}>
                  Conservar mía
                </button>
                <button type="button" className="lab-btn" onClick={() => resolveConflict("Servidor")}>
                  Servidor
                </button>
                <button type="button" className="lab-btn lab-btn-primary" onClick={() => resolveConflict("Ambas")}>
                  Ambas
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="lab-log">{status}</div>
    </>
  );
}

export default function MicroLabs({
  project,
  telemetry,
  faultActive,
  onFaultChange,
}: MicroLabProps): ReactNode {
  switch (project.previewKind) {
    case "pdf":
      return <PdfCraftLab telemetry={telemetry} faultActive={faultActive} onFaultChange={onFaultChange} />;
    case "catalog":
      return <MerkatLab telemetry={telemetry} faultActive={faultActive} onFaultChange={onFaultChange} />;
    case "kanban":
      return <PulseFlowLab telemetry={telemetry} faultActive={faultActive} onFaultChange={onFaultChange} />;
    case "chat":
      return <CortexLab telemetry={telemetry} faultActive={faultActive} onFaultChange={onFaultChange} />;
    case "wallet":
      return <LedgerCoreLab telemetry={telemetry} faultActive={faultActive} onFaultChange={onFaultChange} />;
    case "phone":
      return <FieldNotesLab telemetry={telemetry} faultActive={faultActive} onFaultChange={onFaultChange} />;
  }
}
