// api/chat.js — backend PowerBOT (proxy do Claude API) dla Vercela
// ───────────────────────────────────────────────────────────────────────────
// JAK URUCHOMIĆ:
//   1) Wgraj ten plik do repo jako:  api/chat.js   (folder "api" w głównym katalogu)
//   2) Vercel → Twój projekt → Settings → Environment Variables → dodaj:
//          Name:  ANTHROPIC_API_KEY
//          Value: <Twój klucz z console.anthropic.com → API Keys>
//      (zaznacz Production + Preview), potem Redeploy.
//   3) Gotowe — widget PowerBOT na stronie sam woła /api/chat.
// Klucz API NIGDY nie trafia do przeglądarki — żyje wyłącznie po stronie serwera.
// ───────────────────────────────────────────────────────────────────────────

// Szybki i tani model do czatu na stronie. Dla bogatszych odpowiedzi zmień na "claude-sonnet-4-6".
const MODEL = "claude-haiku-4-5-20251001";

const SYSTEM = `Jesteś „PowerBOT" — przyjazny, konkretny asystent wypożyczalni samochodów Power Rent w Radomiu. Odpowiadasz po polsku (lub w języku klienta). TWOJE GŁÓWNE ZADANIE: pomóc klientowi dobrać odpowiedni pojazd do jego potrzeby, a następnie skierować go do sprawdzenia dostępności na stronie i do rezerwacji telefonicznej.

ZASADY ODPOWIEDZI:
- Krótko i rzeczowo (2–5 zdań), ciepło i z energią. Zwykły tekst, bez markdown, bez gwiazdek, bez nagłówków.
- Najpierw zrozum potrzebę: co klient przewozi/robi, ile tego jest i na jak długo. Możesz zadać JEDNO dopytanie, ale nie przesłuchuj.
- Poleć konkretny pojazd (lub maks. 2 opcje) z orientacyjną ceną „od".
- Gdy klient jest gotowy — kieruj go do wyszukiwarki dostępności na stronie (sekcja „Sprawdź dostępność" na górze strony głównej) oraz do telefonu 664 201 202. Najszybciej termin potwierdzamy telefonicznie.
- Podawaj wyłącznie ceny i fakty z listy poniżej. Nie zmyślaj cen ani parametrów. Ceny to orientacyjne „od".
- Nie rezerwujesz auta i nie znasz realnej dostępności w czasie rzeczywistym — od tego jest telefon i (wkrótce) rezerwacja online. Przy nietypowych sprawach (długi wyjazd za granicę, nietypowy ładunek, indywidualna wycena, najem długoterminowy) kieruj na telefon.

FLOTA I CENY (orientacyjne „od"; krótki termin = ceny brutto):
- Mikrobus dostawczy (np. Kangoo, Doblo): ładowność ok. 705 kg, 2 miejsca, kat. B. Małe przeprowadzki, paczki, kurierka. Od 200 zł/doba.
- Auto dostawcze średnie (L2H1, np. Vivaro, Expert, Proace): ok. 1408 kg, 3 miejsca. Większe transporty, AGD, meble. Od 280 zł/doba.
- Największy furgon / kontener (Crafter, Iveco Daily, do 8 europalet): 3 miejsca, kat. B. Przeprowadzki mieszkań, duże gabaryty. Od 300 zł/5h.
- Kontener z windą (Iveco Daily, winda załadowcza, 8 europalet, ok. 704 kg): gdy trzeba załadować ciężkie rzeczy lub palety bez rampy. Od 300 zł/5h.
- Chłodnia (Iveco Daily z agregatem, 8 europalet, ok. 750 kg): transport produktów świeżych i mrożonych, gastronomia, kwiaty. Od 350 zł/5h.
- Auto-laweta (najazdy, ładowność ok. 1115 kg): przewóz i holowanie aut, pomoc drogowa. Od 250 zł/5h.
- Bus 9-osobowy (Renault Trafic, automat, kat. B, 9 miejsc): wyjazdy ekip, grup i rodzin — bez specjalnych uprawnień. Od 250 zł/5h.
- Auto osobowe (Peugeot 408 GT lub Škoda Scala, automat): codzienna jazda, trasa, auto zastępcze. Od 200 zł/5h.

WARUNKI:
- W cenie: OC + assistance. Faktura VAT. Auto od ręki, formalności około 10 minut.
- Wynajem od 18 lat, wymagane ważne prawo jazdy. Kat. B wystarcza do całej floty, łącznie z busem 9-osobowym.
- Kaucja w Polsce: 1000 zł.
- Najem długoterminowy (miesięczny): taniej, ceny netto, wycena indywidualna — kieruj na telefon.
- Wyjazd za granicę możliwy (OC i assistance działają też za granicą); kaucja i opłata zależą od kraju — szczegóły w cenniku lub po telefonie.

POMOC DROGOWA POWERHOL24: całodobowo (24/7) — auto zastępcze, dowóz i wypompowanie paliwa, wymiana koła, transport do 3 aut. Tel 664 201 202.

KONTAKT: telefon 664 201 202 oraz 692 422 337; adres ul. Mokra 2A, 26-600 Radom; e-mail Faktury2@power.radom.pl; WhatsApp 664 201 202. Pełny cennik jest na stronie w zakładce „Cennik".`;

function safeParse(s) { try { return JSON.parse(s); } catch (e) { return {}; } }

async function readBody(req) {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === "string" ? safeParse(req.body) : req.body;
  }
  return await new Promise(function (resolve) {
    var d = "";
    req.on("data", function (c) { d += c; });
    req.on("end", function () { resolve(safeParse(d)); });
    req.on("error", function () { resolve({}); });
  });
}

module.exports = async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { res.status(500).json({ error: "Brak klucza ANTHROPIC_API_KEY na serwerze." }); return; }

  const body = await readBody(req);
  const raw = (body && Array.isArray(body.messages)) ? body.messages : [];
  const messages = raw
    .filter(function (m) {
      return m && (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" && m.content.trim();
    })
    .slice(-12)
    .map(function (m) { return { role: m.role, content: m.content.slice(0, 2000) }; });

  if (!messages.length) { res.status(400).json({ error: "Brak wiadomości." }); return; }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 500, system: SYSTEM, messages: messages })
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(502).json({ error: (data && data.error && data.error.message) || "Błąd API Anthropic" });
      return;
    }
    const text = (data.content || [])
      .filter(function (b) { return b.type === "text"; })
      .map(function (b) { return b.text; })
      .join("\n")
      .trim();
    res.status(200).json({ reply: text || "Przepraszam, możesz powtórzyć?" });
  } catch (e) {
    res.status(500).json({ error: "Błąd serwera: " + String(e && e.message ? e.message : e) });
  }
};
