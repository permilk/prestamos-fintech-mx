'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';

interface SearchParamsReaderProps {
    onPrestamoId: (id: string | null) => void;
}

export function SearchParamsReader({ onPrestamoId }: SearchParamsReaderProps) {
    const searchParams = useSearchParams();
    const prestamoId = searchParams.get('prestamo');

    React.useEffect(() => {
        onPrestamoId(prestamoId);
    }, [prestamoId, onPrestamoId]);

    return null;
}
