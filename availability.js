/* ===== Power Rent — DOSTĘPNOŚĆ FLOTY =====
   Tu sterujesz kropkami i statusem na podstronach.
   Docelowo: podłącz bazę danych — wystarczy nadpisać window.PR_AVAILABILITY
   wynikiem z API (np. fetch) ZANIM załaduje się pr.js, albo wołać window.PR.refreshAvailability().

   status: "in"  -> dostępne  (zielona, pulsująca kropka)
   status: "out" -> zajęte    (czerwona kropka); pole "from" = data od kiedy wolne (RRRR-MM-DD)
*/
window.PR_AVAILABILITY = {
  "auto-mikrobus":   { status: "in" },
  "auto-male":       { status: "in" },
  "auto-proace":     { status: "in" },
  "auto-duze":       { status: "out", from: "2026-06-21" },
  "auto-przedluzane":{ status: "in" },
  "auto-najwieksze": { status: "out", from: "2026-06-20" },
  "auto-kontener":   { status: "in" },
  "auto-plandeka":   { status: "in" },
  "auto-chlodnia":   { status: "in" },
  "auto-laweta":     { status: "out", from: "2026-06-23" },
  "auto-bus":        { status: "in" },
  "auto-sedan":      { status: "in" },
  "auto-suv":        { status: "in" }
};
