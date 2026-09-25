import { cn } from "@/lib/cn";
import { site } from "@/config/site";

/** "Prince" carries the weight; "Sec" is set quieter. Text stays real text for accessibility. */
export function Wordmark({ className }: { className?: string }) {
  const head = site.brand.slice(0, 6);
  const tail = site.brand.slice(6);
  return (
    <span className={cn("text-[1.0625rem] leading-none tracking-[-0.03em]", className)}>
      <span className="font-semibold text-fg">{head}</span>
      <span className="font-normal text-fg-2">{tail}</span>
    </span>
  );
}
