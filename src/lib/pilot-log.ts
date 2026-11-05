export const eventNames = ["task_started", "template_downloaded", "submission_rejected", "evaluation_completed", "report_opened", "feedback_submitted", "retry_started"] as const;
export type PilotEventName = typeof eventNames[number];
export type PilotEvent = { event: PilotEventName; at: string; caseVersion: string; rubricVersion: string };
// Deliberately no arbitrary metadata, account IDs, files or explanation text.
export function pilotEvent(event: PilotEventName): PilotEvent {
  if (!eventNames.includes(event)) throw new Error("Unsupported pilot event");
  return { event, at: new Date().toISOString(), caseVersion: "financial-case-v1", rubricVersion: "week13-v1" };
}
export function cleanFeedback(value: string): string {
  const text = value.trim();
  if (text.length < 5 || text.length > 500) throw new Error("Escribe entre 5 y 500 caracteres.");
  // Participants must still review free text before sharing it.
  if (/@|https?:\/\/|\b\d{7,}\b/.test(text)) throw new Error("Quita correos, enlaces o números personales antes de continuar.");
  return text;
}
