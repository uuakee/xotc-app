import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      className="!bg-background/70 !border !border-white/10 !backdrop-blur-lg"
      toastOptions={{
        classNames: {
          toast: "!bg-background/70 !border !border-white/10 !backdrop-blur-lg !text-foreground",
          title: "!text-foreground",
          description: "!text-muted-foreground",
          actionButton: "!bg-[#d5eb2d] !text-background",
          cancelButton: "!bg-muted !text-foreground",
          success: "!bg-[#d5eb2d]/80 !border-[#d5eb2d]/20 group-[.success]:!text-[#d5eb2d]",
          error: "!bg-red-500/80 !border-red-500/20 group-[.error]:!text-red-400",
          info: "!bg-blue-500/80 !border-blue-500/20 group-[.info]:!text-blue-400",
          warning: "!bg-yellow-500/10 !border-yellow-500/20 group-[.warning]:!text-yellow-400",
        },
      }}
    />
  );
} 