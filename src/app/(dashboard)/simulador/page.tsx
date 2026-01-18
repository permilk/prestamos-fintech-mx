import { LoanSimulator } from '@/components/loans/loan-simulator';

export const metadata = {
    title: 'Simulador de Préstamos',
    description: 'Calcula el costo de tu préstamo con CAT y tabla de amortización',
};

export default function SimuladorPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                    🧮 Simulador de Préstamos
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Calcula cuotas, intereses, IVA y CAT de forma interactiva.
                </p>
            </div>

            {/* Simulator Component */}
            <LoanSimulator />
        </div>
    );
}
