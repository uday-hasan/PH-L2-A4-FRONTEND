import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const SectionWrapper = ({ children, className }: Props) => {
  return (
    <section className={cn("container mx-auto px-4 py-8", className)}>
      {children}
    </section>
  );
};
