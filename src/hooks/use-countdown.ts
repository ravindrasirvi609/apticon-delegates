import { useEffect, useState } from 'react';
import { getCountdownParts, type CountdownParts } from '@/utils/countdown';

export function useCountdown(target: Date): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() => getCountdownParts(target));

  useEffect(() => {
    const id = setInterval(() => setParts(getCountdownParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return parts;
}
