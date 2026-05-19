import { notFound } from 'next/navigation';

/**
 * Foundation reset placeholder. The full MarketingPage orchestrator
 * lands in commit 3 of the foundation correction session.
 */
export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== 'simplygolf365') notFound();
  return (
    <main className="bg-[var(--bg)] text-white min-h-screen font-serif px-5 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-50">Foundation reset, real renderer in commit 3</p>
    </main>
  );
}
