import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowDownUp, ArrowUpRight, ChevronRight, Coins, Gift, Home, Layers, Package, RefreshCw, Swords, Zap } from "lucide-react";

type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";
type Card = { id: number; name: string; series: string; rarity: Rarity; value: number; art: string };
const rarities: Rarity[] = ["Common", "Rare", "Epic", "Legendary", "Mythic"];
const people = [
  { name: "Хитори Гото", series: "Бocchi the Rock!", art: "https://livedoor.blogimg.jp/nijianime/imgs/6/a/6a4275b7.jpg" },
  { name: "Юи Хирасава", series: "K-On!", art: "https://static.zerochan.net/K-ON%21.full.680112.jpg" },
  { name: "Мио Акияма", series: "K-On!", art: "https://static.zerochan.net/K-ON%21.full.680112.jpg" },
  { name: "Элейна", series: "Путешествие Элейны", art: "https://ogre.natalie.mu/media/news/comic/2026/0104/Elaina.jpg?imdensity=1&impolicy=hq&imwidth=1460" },
  { name: "Кёко Хори", series: "Horimiya", art: "https://www.animenachrichten.de/wp-content/uploads/2020/11/EnCQugpUYAE76w7.jpeg" },
  { name: "Идзуми Миямура", series: "Horimiya", art: "https://www.animenachrichten.de/wp-content/uploads/2020/11/EnCQugpUYAE76w7.jpeg" },
  { name: "Уми Асанаги", series: "Я подружился со второй самой симпатичной девушкой в классе", art: "https://shikimori.io/uploads/poster/characters/218935/main_alt-2231f80b436463f09c38d24c270ccdd4.jpeg" }
];
const cases = [
  { id: "starter", name: "First Spark", sub: "Первый шаг в коллекцию", price: 250, art: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900", drops: [65, 25, 8, 1.8, .2] },
  { id: "neon", name: "Neon Nights", sub: "Город никогда не спит", price: 650, art: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900", drops: [40, 35, 18, 6, 1] },
  { id: "mythic", name: "Mythic Bloom", sub: "Охота за легендами", price: 1400, art: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900", drops: [20, 35, 27, 15, 3] },
  { id: "ronin", name: "Crimson Ronin", sub: "Самурайская коллекция", price: 450, art: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900", drops: [55, 29, 12, 3.5, .5] },
  { id: "academy", name: "Sakura Academy", sub: "Школьные истории и тайны", price: 800, art: "https://images.unsplash.com/photo-1578632767115-3515dad4c6f7?w=900", drops: [38, 36, 18, 7, 1] },
  { id: "shadow", name: "Shadow Realm", sub: "Тёмные силы пробуждаются", price: 1100, art: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900", drops: [30, 35, 23, 10, 2] },
  { id: "starlight", name: "Starlight Wish", sub: "Герои под звёздным небом", price: 1900, art: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900", drops: [18, 32, 30, 16, 4] },
  { id: "dragon", name: "Dragon Core", sub: "Сила древних драконов", price: 2800, art: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=900", drops: [12, 25, 32, 23, 8] }
];
const values: Record<Rarity, number> = { Common: 100, Rare: 260, Epic: 700, Legendary: 2200, Mythic: 9000 };
const nav = [{ id: "home", label: "Главная", Icon: Home }, { id: "cases", label: "Кейсы", Icon: Package }, { id: "upgrader", label: "Апгрейдер", Icon: Zap }, { id: "contracts", label: "Контракты", Icon: ArrowDownUp }, { id: "battle", label: "Баттлы", Icon: Swords }, { id: "inventory", label: "Инвентарь", Icon: Layers }];
const money = (n: number) => n.toLocaleString("ru-RU");
function makeCard(rarity: Rarity): Card {
  const p = people[Math.floor(Math.random() * people.length)];
  return { id: Date.now() + Math.floor(Math.random() * 100000), name: p.name, series: p.series, rarity, value: values[rarity], art: p.art };
}
function rollCase(id: string): Card {
  const c = cases.find(x => x.id === id) ?? cases[0];
  let roll = Math.random() * 100, sum = 0, index = 0;
  c.drops.some((chance, i) => { sum += chance; if (roll <= sum) { index = i; return true; } return false; });
  return makeCard(rarities[index]);
}
function CardTile({ card, action, selected, onSelect }: { card: Card; action?: { label: string; run: () => void }; selected?: boolean; onSelect?: () => void }) {
  return <article className={`card-tile ${card.rarity.toLowerCase()} ${selected ? "selected" : ""}`} onClick={onSelect}>
    <div className="card-art"><img src={card.art} alt={card.name} /><span className="rarity-label">{card.rarity}</span></div>
    <div className="card-info"><b>{card.name}</b><small>{card.series}</small><strong>{money(card.value)} AC</strong></div>
    {action && <button className="sell" onClick={e => { e.stopPropagation(); action.run(); }}>{action.label}</button>}
  </article>;
}
function CaseTile({ c, onClick, active = false }: { c: typeof cases[number]; onClick: () => void; active?: boolean }) {
  return <button className={`case-tile ${active ? "case-active" : ""}`} onClick={onClick}>
    <div className="case-image"><img src={c.art} alt="" /><span className="case-glow" /><span className="case-open-label">OPEN CASE <ArrowUpRight size={14} /></span></div>
    <div className="case-meta"><span><b>{c.name}</b><small>{c.sub}</small></span><strong>{money(c.price)} AC</strong></div>
  </button>;
}
export default function App() {
  const [balance, setBalance] = useState(() => Number(localStorage.getItem("ac_balance") || 5000));
  const [inventory, setInventory] = useState<Card[]>(() => { try { return JSON.parse(localStorage.getItem("ac_inventory") || "[]"); } catch { return []; } });
  const [page, setPage] = useState("home");
  const [chosen, setChosen] = useState("starter");
  const [opening, setOpening] = useState(false);
  const [spinCards, setSpinCards] = useState<Card[]>([]);
  const [upgrading, setUpgrading] = useState(false);
  const [result, setResult] = useState<Card | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [upgradeTarget, setUpgradeTarget] = useState<Rarity>("Epic");
  const [upgradeTargetCard, setUpgradeTargetCard] = useState<Card>(() => makeCard("Epic"));
  const [upgradeOutcome, setUpgradeOutcome] = useState<"win" | "lose" | null>(null);
  const [upgradeSpinAngle, setUpgradeSpinAngle] = useState(0);
  const [toast, setToast] = useState("");
  const [battleResult, setBattleResult] = useState("");
  useEffect(() => { localStorage.setItem("ac_balance", String(balance)); localStorage.setItem("ac_inventory", JSON.stringify(inventory)); }, [balance, inventory]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const collectionStats = useMemo(() => rarities.map(r => ({ rarity: r, count: inventory.filter(c => c.rarity === r).length })), [inventory]);
  const currentCase = cases.find(c => c.id === chosen) ?? cases[0];
  const selectedUpgradeCard = inventory.find(c => c.id === selected[0]);
  const upgradeChance = selectedUpgradeCard ? Math.min(95, Math.max(1, (selectedUpgradeCard.value / upgradeTargetCard.value) * 100)) : 0;
  function openCaseById(caseId: string) {
    if (opening) return;
    const selectedCase = cases.find(c => c.id === caseId) ?? cases[0];
    if (balance < selectedCase.price) { notify("Недостаточно ANICOINS"); return; }
    setChosen(caseId);
    setBalance(v => v - selectedCase.price);
    setResult(null);
    const winner = rollCase(caseId);
    const strip = Array.from({ length: 34 }, (_, i) => i === 29 ? winner : rollCase(caseId));
    setSpinCards(strip);
    setOpening(true);
    window.setTimeout(() => {
      setInventory(v => [winner, ...v]);
      setResult(winner);
      setOpening(false);
    }, 7200);
  }
  function openCase() { openCaseById(chosen); }
  function sell(card: Card) { setInventory(v => v.filter(c => c.id !== card.id)); setSelected(v => v.filter(id => id !== card.id)); setBalance(v => v + card.value); notify(`Продано за ${money(card.value)} AC`); }
  function upgrade() {
    if (upgrading) return;
    const card = selectedUpgradeCard;
    if (!card) return notify("Сначала выбери карточку в инвентаре");
    if (rarities.indexOf(upgradeTarget) <= rarities.indexOf(card.rarity)) return notify("Цель должна быть выше редкости карточки");
    const chance = Math.min(95, Math.max(1, (card.value / upgradeTargetCard.value) * 100));
    const success = Math.random() * 100 < chance;
    const successArc = chance * 3.6;
    const landing = success ? Math.random() * successArc : successArc + Math.random() * (360 - successArc);
    setUpgradeOutcome(null);
    setUpgradeSpinAngle(v => v + 1800 + landing);
    setUpgrading(true);
    window.setTimeout(() => {
      setInventory(v => v.filter(c => c.id !== card.id));
      setSelected([]);
      if (success) {
        setInventory(v => [upgradeTargetCard, ...v]);
        setUpgradeOutcome("win");
        notify(`Успех! Получена карточка ${upgradeTargetCard.name}`);
      } else {
        setUpgradeOutcome("lose");
        notify("Неудача. Карточка потеряна в апгрейде");
      }
      setUpgrading(false);
    }, 3800);
  }
  function contract() {
    const chosenCards = inventory.filter(c => selected.includes(c.id));
    if (chosenCards.length < 3) return notify("Для контракта выбери минимум 3 карточки");
    const sorted = [...chosenCards].sort((a, b) => values[a.rarity] - values[b.rarity]);
    const rank = Math.min(4, rarities.indexOf(sorted[0].rarity) + 1);
    const out = makeCard(rarities[rank]);
    setInventory(v => [out, ...v.filter(c => !selected.includes(c.id))]); setSelected([]);
    notify(`Контракт завершён: ${out.rarity}`);
  }
  function runBattle() {
    if (inventory.length === 0) return notify("Сначала собери карточки");
    const mine = inventory[Math.floor(Math.random() * inventory.length)];
    const bot = makeCard(rarities[Math.floor(Math.random() * rarities.length)]);
    const won = mine.value >= bot.value;
    setBattleResult(`Ты: ${mine.name} (${mine.rarity}) · Бот: ${bot.name} (${bot.rarity}). ${won ? "Победа!" : "Бот победил."}`);
    if (won) setBalance(v => v + 150);
  }
  return <div className="app">
    <aside className="sidebar"><div className="brand"><div className="brand-mark">A</div><span>ANI<span className="purple">CASE</span></span></div><div className="side-label">МЕНЮ</div>
      {nav.map(({ id, label, Icon }) => <button key={id} className={`nav ${page === id ? "active" : ""}`} onClick={() => { setPage(id); setResult(null); }}><Icon size={18} />{label}{id === "inventory" && inventory.length > 0 && <b>{inventory.length}</b>}</button>)}
      <div className="side-bottom"><div className="mini-profile"><div className="avatar">G</div><div><strong>Гость</strong><small>Уровень 1</small></div><span className="online" /></div><small className="muted">Гостевой режим · данные на этом устройстве</small></div>
    </aside>
    <main className="main"><header className="topbar"><div className="mobile-brand">ANI<span>CASE</span></div><div className="crumb">UNIVERSE <ChevronRight size={13} /> <b>{nav.find(n => n.id === page)?.label.toUpperCase()}</b></div>
      <div className="top-actions"><div className="balance"><Coins size={17} /><b>{money(balance)}</b><small>AC</small></div><button className="icon-btn" title="Тестовый бонус +250 AC" onClick={() => { setBalance(v => v + 250); notify("+250 AC — тестовый бонус"); }}><Gift size={18} /></button></div>
    </header><div className="content">
      {page === "home" && <><section className="hero"><div className="hero-copy"><div className="eyebrow"><span /> ANIME CARD UNIVERSE</div><h1>Твоя коллекция.<br /><em>Твоя легенда.</em></h1><p>Открывай кейсы, собирай персонажей и охоться за карточками редчайших уровней.</p><button className="primary" onClick={() => setPage("cases")}>Открыть кейсы <ArrowUpRight size={17} /></button><div className="hero-stats"><div><b>{inventory.length}</b><small>карточек собрано</small></div><div><b>{collectionStats.filter(x => x.count > 0).length}/5</b><small>уровней редкости</small></div><div><b>{money(balance)}</b><small>твой баланс AC</small></div></div></div>
        <div className="hero-art"><div className="orb orb1" /><div className="orb orb2" /><div className="hero-card back"><img src={people[3].art} /><span>LEGENDARY</span></div><div className="hero-card front"><img src={people[0].art} /><span>MYTHIC DROP</span></div><div className="float-tag">✦ RARE COLLECTION</div></div></section>
        <div className="section-head"><div><div className="eyebrow">CHOOSE YOUR DESTINY</div><h2>Популярные кейсы</h2></div><button className="text-btn" onClick={() => setPage("cases")}>Все кейсы <ChevronRight size={16} /></button></div><div className="case-grid">{cases.map(c => <CaseTile key={c.id} c={c} onClick={() => { setChosen(c.id); setPage("cases"); }} />)}</div>
        <div className="section-head"><div><div className="eyebrow">FRESH FROM THE UNIVERSE</div><h2>Последние открытия</h2></div></div>{inventory[0] ? <div className="recent-card"><CardTile card={inventory[0]} /><span>Твоя последняя карточка</span></div> : <div className="activity"><Activity size={18} /><span>Твоя коллекция ждёт первого легендарного дропа.</span><button onClick={() => setPage("cases")}>Попробовать</button></div>}</>}
      {page === "cases" && <><div className="page-title"><div className="eyebrow">CASE OPENING</div><h1>Выбери свой <em>кейс</em></h1><p>У каждого кейса свои шансы и собственная коллекция.</p></div><div className="case-grid big">{cases.map(c => <CaseTile key={c.id} c={c} active={chosen === c.id} onClick={() => openCaseById(c.id)} />)}</div>
        <div className="open-panel"><div className="open-info"><span className="eyebrow">SELECTED CASE</span><h2>{currentCase.name}</h2><p>{currentCase.sub}</p><div className="price"><Coins size={17} />{money(currentCase.price)} AC</div><button className="primary" disabled={opening} onClick={openCase}>{opening ? "Открываем..." : "Открыть кейс"} <ChevronRight size={17} /></button></div>
          <div className={`roulette ${opening ? "roulette-active" : ""} ${result ? "roulette-won" : ""}`}>
            <div className="roulette-ring"><span /><span /><span /></div>
            {opening ? <><div className="roulette-track">{spinCards.map((card, i) => <div className={`roulette-card ${i === 29 ? "roulette-winner" : ""} ${card.rarity.toLowerCase()}`} key={card.id + "-" + i}><img src={card.art} alt="" /><b>{card.name}</b><small className={`rarity-${card.rarity.toLowerCase()}`}>{card.rarity}</small></div>)}</div><div className="rolling-caption"><span className="rolling-dot" /> РУЛЕТКА КРУТИТСЯ...</div></> : result ? <div className="roulette-result"><CardTile card={result} /><b>ВЫПАЛО!</b></div> : <div className="roulette-preview"><img src={currentCase.art} alt="" /><div><b>{currentCase.name}</b><small>Открой кейс и испытай удачу</small></div></div>}
          </div></div>
        <div className="section-head"><div><div className="eyebrow">DROP RATES</div><h2>Шансы выпадения</h2></div></div><div className="rates">{rarities.map((r, i) => <div className="rate" key={r}><span className={`dot ${r.toLowerCase()}`} /><b>{r}</b><strong>{currentCase.drops[i]}%</strong></div>)}</div></>}
      {page === "inventory" && <><div className="page-title"><div className="eyebrow">YOUR COLLECTION</div><h1>Мой <em>инвентарь</em></h1><p>Карточек: {inventory.length} · Общая стоимость: {money(inventory.reduce((s, c) => s + c.value, 0))} AC</p></div>
        {inventory.length === 0 ? <Empty title="Коллекция пока пуста" text="Открой первый кейс, чтобы получить первую карточку." action={() => setPage("cases")} /> : <><div className="inventory-tools"><span>{inventory.length} карточек · выбрано {selected.length}</span><button className="ghost" onClick={() => setSelected([])}>Сбросить выбор</button></div><div className="cards-grid">{inventory.map(card => <div key={card.id} className="select-wrap"><CardTile card={card} selected={selected.includes(card.id)} onSelect={() => setSelected(v => v.includes(card.id) ? v.filter(id => id !== card.id) : [...v, card.id])} action={{ label: "Продать", run: () => sell(card) }} /></div>)}</div></>}</>}
      {page === "upgrader" && <><div className="page-title"><div className="eyebrow">RISK IT FOR THE RARE</div><h1>Карточный <em>апгрейд</em></h1><p>Поставь карточку на кон и попробуй получить редкость выше.</p></div><div className={`upgrade-box ${upgrading ? "upgrade-running" : ""} ${upgradeOutcome === "win" ? "upgrade-success" : upgradeOutcome === "lose" ? "upgrade-fail" : ""}`}>
          <div className="upgrade-slot source-slot"><span className="upgrade-slot-label">ТВОЯ КАРТОЧКА</span>{inventory.find(c => c.id === selected[0]) ? <CardTile card={inventory.find(c => c.id === selected[0])!} /> : <div className="slot-empty"><Layers size={30} /><b>Выбери карточку</b><small>В инвентаре ниже</small></div>}</div>
          <div className="upgrade-mid">
            <div className={`chance-ring ${upgradeOutcome || ""} ${upgrading ? "is-spinning" : ""}`}><div className="chance-ring-inner"><strong>{upgradeChance.toFixed(2)}%</strong><small>ШАНС УСПЕХА</small></div><div className="upgrade-pointer" style={{ transform: `rotate(${upgradeSpinAngle}deg)` }}><i /></div></div>
            <div className="upgrade-arrows">‹ <span>➜</span> ›</div>
            <label>Редкость цели<select value={upgradeTarget} disabled={upgrading} onChange={e => { const rarity=e.target.value as Rarity; setUpgradeTarget(rarity); setUpgradeTargetCard(makeCard(rarity)); setUpgradeOutcome(null); }}>{rarities.map(r => <option key={r}>{r}</option>)}</select></label>
            <button className="primary upgrade-start" disabled={upgrading} onClick={upgrade}>{upgrading ? "АПГРЕЙД..." : "УЛУЧШИТЬ"} <Zap size={15} /></button>
            <small className="upgrade-cost">БЕСПЛАТНО · ШАНС = СТОИМОСТЬ / ЦЕЛЬ</small>
            {upgradeOutcome && <b className="upgrade-outcome">{upgradeOutcome === "win" ? "✦ УСПЕШНО!" : "✕ НЕ ПОВЕЗЛО"}</b>}
          </div>
          <div className="upgrade-slot target-slot"><span className="upgrade-slot-label">ЖЕЛАЕМАЯ КАРТОЧКА</span><CardTile card={upgradeTargetCard} /></div>
        </div><div className="section-head"><h2>Выбери карточку</h2></div><div className="cards-grid">{inventory.map(c => <div key={c.id} className="select-wrap"><CardTile card={c} selected={selected[0] === c.id} onSelect={() => setSelected([c.id])} /></div>)}</div></>}
      {page === "contracts" && <><div className="page-title"><div className="eyebrow">TRADE UP</div><h1>Контракты <em>обмена</em></h1><p>Обмени три или больше карточек на одну более высокой редкости.</p></div><div className="contract-banner"><div><span className="eyebrow">CONTRACT SYSTEM</span><h2>{selected.length} <small>/ минимум 3</small></h2><p>Выбери карточки в инвентаре ниже.</p></div><button className="primary" onClick={contract}>Собрать контракт <ArrowUpRight size={16} /></button></div><div className="section-head"><h2>Твои карточки</h2></div><div className="cards-grid">{inventory.map(c => <div key={c.id} className="select-wrap"><CardTile card={c} selected={selected.includes(c.id)} onSelect={() => setSelected(v => v.includes(c.id) ? v.filter(id => id !== c.id) : [...v, c.id])} /></div>)}</div></>}
      {page === "battle" && <><div className="page-title"><div className="eyebrow">CASE BATTLE · PRACTICE</div><h1>Битва <em>коллекций</em></h1><p>Тренировочный режим против бота. Это не онлайн-мультиплеер.</p></div><div className="battle-arena"><div className="fighter"><div className="bot-avatar">YOU</div><b>Ты</b><small>Твоя коллекция</small><strong>{inventory.length} карт.</strong></div><div className="versus">VS</div><div className="fighter"><div className="bot-avatar">BOT</div><b>ANICASE BOT</b><small>Соперник</small><strong>Случайная карта</strong></div></div><div className="battle-action"><div><b>Тренировочный раунд</b><small>Победа приносит 150 AC · без ставок</small></div><button className="primary" onClick={runBattle}>Начать битву <Swords size={16} /></button></div>{battleResult && <div className="notice">{battleResult}</div>}</>}
    </div></main>
    {result && page === "cases" && <div className="result-modal"><div className="modal-content"><span className="eyebrow">CASE OPENED</span><h2>Твой дроп!</h2><CardTile card={result} /><div className="result-actions"><button className="sell-result" onClick={() => { sell(result); setResult(null); }}>Продать за {money(result.value)} AC</button><button className="primary" onClick={() => { setResult(null); openCaseById(chosen); }}>Ещё раз · {money(currentCase.price)} AC</button></div><button className="result-continue" onClick={() => setResult(null)}>Закрыть</button></div></div>}
    {toast && <div className="toast">{toast}</div>}
  </div>;
}
function Empty({ title, text, action }: { title: string; text: string; action: () => void }) { return <div className="empty"><Layers size={34} /><h3>{title}</h3><p>{text}</p><button className="primary" onClick={action}>Открыть кейсы</button></div>; }
