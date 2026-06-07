'use client';

import PageTransition from '@/components/layout/PageTransition';
import BMICalculator from '@/components/analytics/BMICalculator';

export default function BMIPage() {
  return (
    <div className="gradient-mesh app-screen">
      <main className="page-container">
        <PageTransition>
          <BMICalculator standalone />
        </PageTransition>
      </main>
    </div>
  );
}
