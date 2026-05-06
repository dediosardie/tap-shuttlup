import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-xl border border-border-muted/55 bg-bg-elevated/75 before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(100deg,transparent_20%,rgba(148,163,184,0.22)_45%,transparent_70%)] before:animate-[shimmer_1.8s_infinite]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
