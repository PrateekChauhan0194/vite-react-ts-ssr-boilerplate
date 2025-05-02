import { useEffect, useState } from 'react';

// This utility helps ensure code only runs on the client side
export function useClientSideOnly<T>(fallback: T, fn: () => T): T {
    const [value, setValue] = useState<T>(fallback);

    useEffect(() => {
        // Only execute the function on the client side
        setValue(fn());
    }, [fn]);

    return value;
}

// Hook to check if the code is running on the client
export function useIsClient(): boolean {
    return useClientSideOnly(false, () => true);
}
