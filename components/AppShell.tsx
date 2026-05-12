import type { CSSProperties, ReactNode } from "react";

type AppShellVariant = "home" | "create" | "story" | "replay";

type AppShellProps = {
  children: ReactNode;
  variant?: AppShellVariant;
  style?: CSSProperties;
};

const variantOrbs: Record<
  AppShellVariant,
  {
    blue: string;
    violet: string;
    peach: string;
    bubbles: string[];
  }
> = {
  home: {
    blue: "left-[-9rem] top-[-8rem]",
    violet: "right-[-10rem] top-20",
    peach: "bottom-[-10rem] left-[34%]",
    bubbles: [
      "left-[8%] top-[18%] h-36 w-36 opacity-25",
      "right-[12%] top-[34%] h-28 w-28 opacity-20",
      "left-[55%] bottom-[12%] h-24 w-24 opacity-18",
    ],
  },
  create: {
    blue: "left-[-10rem] top-[8rem]",
    violet: "right-[-11rem] top-[-5rem]",
    peach: "bottom-[-9rem] right-[18%]",
    bubbles: [
      "right-[10%] top-[18%] h-32 w-32 opacity-20",
      "left-[7%] bottom-[20%] h-24 w-24 opacity-18",
      "left-[48%] top-[10%] h-16 w-16 opacity-16",
    ],
  },
  story: {
    blue: "left-[-8rem] top-[18%]",
    violet: "right-[-12rem] top-[12%]",
    peach: "bottom-[-11rem] left-[24%]",
    bubbles: [
      "left-[6%] top-[12%] h-28 w-28 opacity-18",
      "right-[9%] bottom-[20%] h-36 w-36 opacity-20",
      "left-[52%] top-[7%] h-20 w-20 opacity-16",
    ],
  },
  replay: {
    blue: "left-[-11rem] top-[-7rem]",
    violet: "right-[-9rem] bottom-[18%]",
    peach: "bottom-[-12rem] left-[38%]",
    bubbles: [
      "left-[10%] bottom-[16%] h-32 w-32 opacity-18",
      "right-[14%] top-[12%] h-24 w-24 opacity-16",
      "left-[46%] top-[18%] h-16 w-16 opacity-14",
    ],
  },
};

export default function AppShell({
  children,
  variant = "home",
  style,
}: AppShellProps) {
  const theme = variantOrbs[variant];

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(191,219,254,0.55),transparent_32%),radial-gradient(circle_at_70%_30%,rgba(221,214,254,0.50),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(254,215,170,0.42),transparent_34%),linear-gradient(135deg,#eef3ff_0%,#f7f1ff_45%,#fff7ed_100%)] text-slate-900"
      style={style}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`float-slow absolute h-96 w-96 rounded-full bg-blue-200/40 blur-3xl ${theme.blue}`}
        />
        <div
          className={`bubble-float absolute h-[28rem] w-[28rem] rounded-full bg-violet-200/40 blur-3xl ${theme.violet}`}
        />
        <div
          className={`float-slow absolute h-[26rem] w-[26rem] rounded-full bg-orange-200/35 blur-3xl ${theme.peach}`}
        />
        {theme.bubbles.map((bubbleClassName) => (
          <div
            key={bubbleClassName}
            className={`absolute rounded-full border border-white/45 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.62),rgba(255,255,255,0.20)_58%,rgba(255,255,255,0.08)_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_24px_80px_rgba(129,140,248,0.12)] backdrop-blur-xl ${bubbleClassName}`}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(30,41,59,0.10)_100%)]" />
      <div className="relative z-10">{children}</div>
    </main>
  );
}
