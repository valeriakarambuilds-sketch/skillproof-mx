# Persona test - Week 14 | SkillProof MX

## Persona and method
Lucia,38, is a fictional operations manager at a small Mexican advisory firm, hires junior analysts occasionally and has basic Excel. She needs to know billing period, review responsibility, what the simulator means and where scenarios are stored. A separate fresh-context model reviewed actual screenshots in order, then reviewed updated screenshots. This is a screenshot-based synthetic walkthrough, not a real payer, participant session, purchase or observed voluntary return. No persona clicks are claimed. Developer browser actions are logged separately in TEST_LOG_WEEK14.md.

## Chronology
1. Initial pricing screen: three options and test-price boundary.
2. Simulator: editable assumptions, provider gross/contribution, local storage controls.
3. Saved-state screen: developer had loaded a0.25-frequency snapshot.
4. Memo: distinction between stated interest, assumed benefit and actual evidence.
5. Corrected pricing, simulator, saved state and memo retest.
Screenshots live in docs/evidence/week14. Initial and retest images are local-preview captures, not proof of the deployed version; final public verification is recorded separately.

## Numbered confusion log
### 1. Billing period - low severity - resolved in screenshot comprehension
Initial: “I understand the proposed price is MXN180 for one vacancy, covering up to20 evaluations during30 days. It says there is no automatic renewal or subscription, so I would not read this as a monthly charge. I also understand I cannot buy it here yet.”
Retest retained per-vacancy scope. No actual billing or tax treatment was tested.

### 2. Human-review staffing - high severity - clarified, service still unverified
Initial: “The calculator includes30 minutes of human work. That makes me wonder whether a reviewer is already included in the MXN180.”
Fix: offer and memo identify the employer as reviewer and state SkillProof does not assign a reviewer. Simulator identifies labor as an illustrative future delivery cost. Existing review button remains instructions only.
Retest: “My team reviews the candidates and makes the decision. SkillProof is not assigning us a reviewer. The human time in the calculator is a cost assumption, although ‘included in the offer’ below that field still makes me pause.”
Follow-up: changed helper to “Modela tiempo humano futuro del servicio; no asigna un revisor.” This final helper received developer source verification; a further fresh-persona pass on that exact final sentence was not run. Staffing/capacity are not validated by copy changes.

### 3. Provider revenue vs buyer savings - medium severity - resolved conceptually
Initial: “Is this calculator showing your business economics or savings for my firm? I came here to compare hiring evidence.”
Fix: explicit provider-economics introduction and plain-language contribution definition.
Retest: “This is SkillProof’s possible revenue, not savings for my firm. MXN1,800 is before costs; MXN200 is the contribution after variable costs, not proven profit.”

### 4. Save location - low severity - resolved conceptually
Initial: “It saves only numbers and a date in this browser on this device. It does not save to my account, and clearing browser data removes it.”
Fix: button says Save in this browser. Retest found label and explanation consistent. Browser persistence itself is developer-tested, not established by a screenshot.

### 5. Loaded scenario - medium severity - partial
Initial: “The green message says Scenario1 is loaded... But the saved description shows only price and conversion; I cannot verify all the inputs that produced those results from this screenshot.”
Fix: frequency in card summary, expandable full numeric snapshot and active/unsaved label in result panel; load confirmation points to fields above.
Retest: “It says Scenario1 is loaded and its values are above. I can see the saved hiring frequency is0.25 vacancies per company per month. I understand the message, but this picture alone does not let me check every restored field.”
Status: comprehension improved; screenshot boundaries still hide some inputs. Separate developer browser test did verify frequency and recalculated outputs after reload/load. Cross-device syncing is intentionally absent.

### 6. Meaning of10:1 - high severity - conceptual distinction resolved
Initial: “Ten to one... does not mean the total process is ten times cheaper. I cannot fully inspect the second ratio or the rest of its explanation because the screenshot cuts it off.”
Fix: two separately labelled ratio panels before the memo body.
Retest: “Ten to one compares the assumed value of time saved with the service price. The2.17 times figure compares the two total costs. Neither is a measured result, and ten to one does not mean the whole process costs ten times less.”
Status: conceptual distinction resolved; full arithmetic table was partly outside the screenshot. Automated arithmetic tests confirm computation, not the assumptions' real-world truth.

### 7. Enough evidence to authorize spending - high uncertainty - unverified
Initial: “I would still need an example of comparable candidate evidence and confirmation of exactly what is delivered.”
Retest still cannot establish deliverable quality, purchase intent, actual savings or service capacity. Conditional reported payer interest is not a sale. No synthetic utterance is used as customer evidence.

## What was fixed and what remains
The worst misunderstanding, an implied staffed reviewer, was clarified in the offer and simulator. Saved-state explanations and ratio definitions improved. Real usefulness, review capacity, actual payer conversion, independent Week13 retest, full stranger/session evidence and voluntary return remain unverified. The synthetic test does not repair those evidence gaps.
