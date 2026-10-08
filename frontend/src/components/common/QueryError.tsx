import { Button } from '@/components/ui/button';

interface QueryErrorProps {
  message: string;
  onRetry?: () => void;
}

export function QueryError({ message, onRetry }: QueryErrorProps) {
  return (
    <div className="rounded-md border border-red-900 bg-red-950/30 p-4 text-red-300" role="alert">
      <p>{message}</p>
      {onRetry && (
        <Button className="mt-3" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
