import { useRouter } from "next/router";
import { useEffect } from "react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

export default function ReferralRedirect() {
  const router = useRouter();
  const { referral_code } = router.query;

  useEffect(() => {
    if (referral_code) {
      router.push(`/register?r=${referral_code}`);
    }
  }, [referral_code, router]);

  return (
    <div className={spaceGrotesk.className}>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
        <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
        <div className="fixed -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
        <div className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />

        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d5eb2d]" />
            <span className="text-sm text-muted-foreground">Redirecionando...</span>
          </div>
        </div>
      </div>
    </div>
  );
} 