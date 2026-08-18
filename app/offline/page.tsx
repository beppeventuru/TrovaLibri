import Link from "next/link";
import { BookOpen, WifiOff } from "lucide-react";

export default function OfflinePage() {
  return <main className="offline-page"><div className="offline-card"><span className="brand-mark"><BookOpen size={24} /></span><WifiOff size={34} /><p className="eyebrow">TrovaLibri offline</p><h1>La connessione non c&apos;è.<br /><em>I tuoi libri sì.</em></h1><p>I dati già salvati restano sullo smartphone. Torna all&apos;inventario e continua a cercare.</p><Link href="/">Torna all&apos;inventario</Link></div></main>;
}
