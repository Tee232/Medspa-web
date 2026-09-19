export function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-heading text-xl font-bold text-[#1C1C1A]">{title}</h1>
      <p className="mt-2 max-w-lg font-body text-sm text-[#6B7280]">{description}</p>
      <div className="mt-6 rounded-[20px] border border-dashed border-[#E8E4DF] p-10 text-center">
        <p className="font-body text-xs text-[#9CA3AF]">Page not yet built — shell and routing only.</p>
      </div>
    </div>
  );
}
