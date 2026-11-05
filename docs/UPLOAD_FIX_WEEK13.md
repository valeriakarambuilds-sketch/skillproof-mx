# Upload clarity — fix and evidence

## Reported pain

Valeria reported P02 and P05 could not distinguish selecting a file from delivering it or confirming receipt. Completion, exact quotes, elapsed times, observation dates and tested builds remain unconfirmed. This is a researcher-supplied account, not an independently observed usability session.

## Before / after

| State | Before: source inspected at 226737d | After: e8186dd |
|---|---|---|
| Required evidence | File help said users could select another file and repeat later | Explicitly requires Excel .xlsx plus written explanation |
| Selected file | Size + “listo para evaluar” | “seleccionado, aún no enviado” plus a live status explaining the required button |
| Submit action | “Evaluar mi evidencia →” | “Enviar archivo y evaluar” |
| Pending request | “Evaluando…” button | “Enviando y evaluando…” live status, wait instruction and locked inputs |
| Response received | Report rendered without a dedicated receipt | Receipt only after successful HTTP response with expected report structure |
| Failed response | Error text | Error plus no confirmed evaluation; network ambiguity disclosed |
| Edit or retry | No dedicated receipt | Clear previous receipt and report so they cannot imply new evidence was received |
| Persistence | Separate saved/failed-save message | Preserved; receiving an evaluation does not imply the private report was saved |

## Verification

12 existing tests passed, including endpoint provisional boundary; ESLint passed; production build and TypeScript passed. No new unit test was added for copy changes. Vercel deployment dpl_Ai4g8j4JmQb8iyYkuAGZ2v5A1F72 reached READY at commit e8186ddb8ff3a9ef9d8614aa1aa7918564dab30f and aliased skillproof-mx.vercel.app. A public HTTP read confirmed the new two-item instruction, no-file status, explicit send label and selection-is-not-send warning. Successful receipt handling was inspected in code; a full authenticated browser submission was not performed in this correction session.

## Retest still required

P02 or P05 must attempt the updated workflow without coaching. Record whether the user distinguishes selection, delivery and receipt, and preserve actual version/date, quote, assistance, time and before/after task outcome. Deployment and copy checks do not establish that user confusion is resolved. Obtain an independent concrete return signal; do not treat technical testing as retention.
